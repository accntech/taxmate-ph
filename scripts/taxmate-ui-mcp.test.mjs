import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHmac, randomBytes } from 'node:crypto';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const script = new URL('./taxmate-ui-mcp.mjs', import.meta.url);

function startClient(socketPath, appData) {
  const env = { ...process.env };
  delete env.TAXMATE_UI_AGENT_SOCKET;
  let args = [fileURLToPath(script)];
  if (appData) {
    env.LOCALAPPDATA = appData;
    env.TAXMATE_UI_AGENT_SOCKET = join(appData, 'missing.sock');
    args = ['--input-type=module', '--eval', `
      Object.defineProperty(process, 'platform', { value: 'win32' });
      await import(${JSON.stringify(script.href)});
    `];
  } else {
    env.TAXMATE_UI_AGENT_SOCKET = socketPath;
  }
  const child = spawn(process.execPath, args, {
    env,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const pending = new Map();
  let nextId = 1;
  let stderr = '';
  child.stderr.on('data', chunk => { stderr += chunk; });
  createInterface({ input: child.stdout }).on('line', line => {
    const response = JSON.parse(line);
    const request = pending.get(response.id);
    pending.delete(response.id);
    request?.resolve(response);
  });
  child.on('exit', () => {
    for (const request of pending.values()) request.reject(new Error(stderr || 'MCP server exited'));
    pending.clear();
  });
  return {
    child,
    notify(method) { child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method }) + '\n'); },
    request(method, params) {
      const id = nextId++;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
      });
    },
  };
}

test('stdio MCP lists UI tools and routes validated calls through the Unix socket', { timeout: 10000, skip: process.platform === 'win32' }, async t => {
  const directory = await mkdtemp(join(tmpdir(), 'taxmate-mcp-'));
  const socketPath = join(directory, 'agent.sock');
  const requests = [];
  const server = createServer(socket => {
    createInterface({ input: socket }).once('line', line => {
      const request = JSON.parse(line);
      requests.push(request);
      if (request.text === 'fail') socket.end(JSON.stringify({ ok: false, error: 'Webview is not ready' }) + '\n');
      else if (request.text === 'disconnect') socket.end();
      else socket.end(JSON.stringify({ ok: true, result: { components: [{ ref: 'save', label: 'Save draft' }] } }) + '\n');
    });
  });
  await new Promise(resolve => server.listen(socketPath, resolve));
  const client = startClient(socketPath);
  t.after(async () => {
    client.child.kill();
    await new Promise(resolve => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  });

  const initialized = await client.request('initialize', { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'test', version: '1' } });
  assert.equal(initialized.result.protocolVersion, '2025-11-25');
  assert.deepEqual(initialized.result.capabilities, { tools: {} });
  client.notify('notifications/initialized');
  const listed = await client.request('tools/list');
  assert.deepEqual(listed.result.tools.map(tool => tool.name), ['taxmate_ui_query', 'taxmate_ui_act']);
  assert.equal(listed.result.tools[0].inputSchema.additionalProperties, false);

  const query = await client.request('tools/call', { name: 'taxmate_ui_query', arguments: { text: 'Save draft' } });
  assert.equal(query.result.isError, false);
  assert.equal(JSON.parse(query.result.content[0].text).components[0].ref, 'save');
  assert.deepEqual(requests[0], { method: 'query', text: 'Save draft' });

  const act = await client.request('tools/call', { name: 'taxmate_ui_act', arguments: { target: 'save', action: 'press', args: { value: 'sample' } } });
  assert.equal(act.result.isError, false);
  assert.deepEqual(requests[1], { method: 'act', target: 'save', action: 'press', args: { value: 'sample' } });

  const rejected = await client.request('tools/call', { name: 'taxmate_ui_act', arguments: { target: 'save', action: 'press', code: 'anything' } });
  assert.equal(rejected.result.isError, true);
  assert.equal(requests.length, 2);
  const longQuery = await client.request('tools/call', { name: 'taxmate_ui_query', arguments: { text: 'x'.repeat(201) } });
  assert.equal(longQuery.result.isError, true);
  const invalidArgs = await client.request('tools/call', { name: 'taxmate_ui_act', arguments: { target: 'save', action: 'press', args: [] } });
  assert.equal(invalidArgs.result.isError, true);
  assert.equal(requests.length, 2);
  const next = await client.request('tools/call', { name: 'taxmate_ui_query', arguments: { text: 'Draft', offset: 20 } });
  assert.equal(next.result.isError, false);
  assert.deepEqual(requests[2], { method: 'query', text: 'Draft', offset: 20 });
  const invalidOffset = await client.request('tools/call', { name: 'taxmate_ui_query', arguments: { text: '', offset: -1 } });
  assert.equal(invalidOffset.result.isError, true);

  const failure = await client.request('tools/call', { name: 'taxmate_ui_query', arguments: { text: 'fail' } });
  assert.equal(failure.result.isError, true);
  assert.match(failure.result.content[0].text, /Webview is not ready/);
  const disconnect = await client.request('tools/call', { name: 'taxmate_ui_query', arguments: { text: 'disconnect' } });
  assert.equal(disconnect.result.isError, true);
  assert.match(disconnect.result.content[0].text, /closed.*response/i);
  const unknown = await client.request('missing');
  assert.equal(unknown.error.code, -32601);
  assert.deepEqual((await client.request('ping')).result, {});
});

test('an unavailable app socket returns a usable tool error', { timeout: 5000, skip: process.platform === 'win32' }, async t => {
  const directory = await mkdtemp(join(tmpdir(), 'taxmate-mcp-'));
  const client = startClient(join(directory, 'missing.sock'));
  t.after(async () => { client.child.kill(); await rm(directory, { recursive: true, force: true }); });
  await client.request('initialize', { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'test', version: '1' } });
  client.notify('notifications/initialized');
  const response = await client.request('tools/call', { name: 'taxmate_ui_query', arguments: { text: '' } });
  assert.equal(response.result.isError, true);
  assert.match(response.result.content[0].text, /start.*TaxMate|TaxMate.*running/i);
});


test('Windows MCP discovers the local endpoint and authenticates before sending a request', { timeout: 5000 }, async t => {
  const appData = await mkdtemp(join(tmpdir(), 'taxmate-win-mcp-'));
  const directory = join(appData, 'ph.taxmate.desktop');
  const endpointFile = join(directory, 'agent-bridge-endpoint.json');
  await mkdir(directory);
  const key = randomBytes(32);
  const serverNonce = randomBytes(32);
  const requests = [];
  let trustedServer = true;
  let closeUntrusted;
  const untrustedClosed = new Promise(resolve => { closeUntrusted = resolve; });
  let untrustedBytes = 0;
  const server = createServer(socket => {
    let buffer = Buffer.alloc(0);
    let clientNonce;
    const trusted = trustedServer;
    if (!trusted) socket.on('close', closeUntrusted);
    socket.on('data', chunk => {
      if (!trusted) untrustedBytes += chunk.length;
      buffer = Buffer.concat([buffer, chunk]);
      if (!clientNonce && buffer.length >= 32) {
        clientNonce = buffer.subarray(0, 32);
        buffer = buffer.subarray(32);
        const proof = trusted
          ? createHmac('sha256', key).update('server').update(clientNonce).update(serverNonce).digest()
          : Buffer.alloc(32);
        socket.write(Buffer.concat([serverNonce, proof]));
      }
      if (!trusted || !clientNonce || buffer.length <= 32) return;
      const end = buffer.indexOf(10, 32);
      if (end < 0) return;
      const expected = createHmac('sha256', key).update('client').update(clientNonce).update(serverNonce).digest();
      assert.deepEqual(buffer.subarray(0, 32), expected);
      requests.push(JSON.parse(buffer.subarray(32, end).toString('utf8')));
      socket.end('{"ok":true,"result":[]}\n');
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  await writeFile(endpointFile, JSON.stringify({ port: server.address().port, key: key.toString('base64') }));
  const client = startClient(null, appData);
  t.after(async () => {
    client.child.kill();
    await new Promise(resolve => server.close(resolve));
    await rm(appData, { recursive: true, force: true });
  });

  await client.request('initialize', { protocolVersion: '2025-11-25' });
  const call = () => client.request('tools/call', { name: 'taxmate_ui_query', arguments: { text: 'Save draft' } });
  const response = await call();
  assert.equal(response.result.isError, false, response.result.content[0].text);
  assert.deepEqual(requests, [{ method: 'query', text: 'Save draft' }]);

  trustedServer = false;
  const rejected = await call();
  assert.equal(rejected.result.isError, true);
  assert.match(rejected.result.content[0].text, /authenticate/);
  await untrustedClosed;
  assert.equal(untrustedBytes, 32);

  await rm(endpointFile);
  const disconnected = await call();
  assert.equal(disconnected.result.isError, true);
  assert.match(disconnected.result.content[0].text, /enable Agent bridge/);
});
