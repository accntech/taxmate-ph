import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

for (const [width, theme] of [[1440, 'light'], [390, 'dark']] as const) {
 test(`sending preferences persist and control the form action at ${width}px`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 960 });
  await seedWorkspace(page, theme);
  await page.goto('/settings');
  const sending = page.getByRole('radiogroup', { name: 'Sending mode' });
  const send = sending.getByRole('radio', { name: 'Send to BIR', exact: true });
  const prepare = sending.getByRole('radio', { name: 'Prepare locally', exact: true });
  await expect(send).toBeChecked({ timeout: 15_000 });
  await send.focus();
  await page.keyboard.press('ArrowRight');
  await expect(prepare).toBeChecked();
  await expect(prepare).toBeFocused();
  await expect(send).not.toBeChecked();
  await page.reload();
  await expect(prepare).toBeChecked();
  const primary = page.getByRole('textbox', { name: 'Primary dispatcher address' });
  const backup = page.getByRole('textbox', { name: 'Backup dispatcher address' });
  const clientVersion = page.getByRole('textbox', { name: 'eBIRForms client version' });
  await expect(primary).toHaveValue('http://birgovph.com/');
  await expect(backup).toHaveValue('http://ws1.birgovph.com/');
  await expect(clientVersion).toHaveValue('7.9.6.0');
  const config = {
   primaryAddress: 'https://primary.example.test/bir/',
   backupAddress: 'https://backup.example.test/bir/',
   clientVersion: '7.9.7.0'
  };
  await primary.fill('https://primary.example.test/?extra=value');
  await page.getByRole('button', { name: 'Save dispatcher settings' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Enter HTTP or HTTPS dispatcher addresses' })).toBeVisible();
  await primary.fill(config.primaryAddress);
  await backup.fill(config.backupAddress);
  await clientVersion.fill(config.clientVersion);
  await page.getByRole('button', { name: 'Save dispatcher settings' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Dispatcher settings saved.' })).toBeVisible();
  await page.reload();
  await expect(primary).toHaveValue(config.primaryAddress);
  await expect(backup).toHaveValue(config.backupAddress);
  await expect(clientVersion).toHaveValue(config.clientVersion);
  await expect(prepare).toBeChecked();
  await page.screenshot({ path: testInfo.outputPath('sending-settings.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  const primaryBounds = (await primary.boundingBox())!;
  const backupBounds = (await backup.boundingBox())!;
  const versionBounds = (await clientVersion.boundingBox())!;
  if (width === 1440) {
   expect(backupBounds.y).toBeCloseTo(primaryBounds.y, 0);
   expect(backupBounds.x).toBeGreaterThan(primaryBounds.x);
   expect(versionBounds.width).toBeLessThan(primaryBounds.width);
  } else {
   expect(backupBounds.x).toBeCloseTo(primaryBounds.x, 0);
   expect(backupBounds.y).toBeGreaterThan(primaryBounds.y);
  }
  await primary.focus();
  await page.keyboard.press('Tab');
  await expect(backup).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(clientVersion).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Save dispatcher settings' })).toBeFocused();
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
  await page.getByRole('button', { name: /^More actions for BIR Form/ }).click();
  await expect(page.getByRole('menuitem', { name: 'Prepare locally', exact: true })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Mock submit', exact: true })).toHaveCount(0);

  await page.goto('/settings');
  await send.check();
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
  await page.evaluate(() => {
   const native = Reflect.get(window, '__TAURI_INTERNALS__');
   const invoke = native.invoke;
   native.invoke = (command: string, args: unknown) => {
    if (command === 'submit_return') Reflect.set(window, 'testSubmissionArgs', args);
    return invoke(command, args);
   };
  });
  await page.getByRole('button', { name: /^More actions for BIR Form/ }).click();
  await page.getByRole('menuitem', { name: 'Submit to BIR', exact: true }).click();
  await expect.poll(() => page.evaluate(() => Reflect.get(window, 'testSubmissionArgs'))).toMatchObject({
   request: { dispatcherConfig: config, fetchDispatcher: true, mode: 'legacy_sftp' }
  });
  await expect(page.getByRole('status').filter({ hasText: 'Package prepared locally.' })).toBeVisible();

  await page.goto('/settings');
  await clientVersion.fill('8.0');
  await page.getByRole('button', { name: 'Reset preferences', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(primary).toHaveValue('http://birgovph.com/');
  await expect(backup).toHaveValue('http://ws1.birgovph.com/');
  await expect(clientVersion).toHaveValue('7.9.6.0');
 });
}

test('saving a blank backup keeps it disabled after reload and displays the primary error', async ({ page }) => {
 await seedWorkspace(page);
 await page.goto('/settings');
 const backup = page.getByRole('textbox', { name: 'Backup dispatcher address' });
 await expect(backup).toHaveValue('http://ws1.birgovph.com/', { timeout: 15_000 });
 await backup.fill('');
 await page.getByRole('button', { name: 'Save dispatcher settings' }).click();
 await expect(page.getByRole('status').filter({ hasText: 'Dispatcher settings saved.' })).toBeVisible();
 await page.reload();
 await expect(backup).toHaveValue('');

 await page.getByRole('link', { name: /^eBIRForms Prepare/ }).click();
 await page.getByRole('link', { name: 'Example Services Corporation', exact: true }).click();
 await page.evaluate(() => {
  const native = Reflect.get(window, '__TAURI_INTERNALS__');
  const invoke = native.invoke;
  native.invoke = (command: string, args: { request?: { dispatcherConfig?: { backupAddress: string } } }) => {
   if (command === 'submit_return') {
    Reflect.set(window, 'testBackupAddress', args.request?.dispatcherConfig?.backupAddress);
    return Promise.reject({ message: 'Primary dispatcher connection failed' });
   }
   return invoke(command, args);
  };
 });
 await page.getByRole('button', { name: /^More actions for BIR Form/ }).click();
 await page.getByRole('menuitem', { name: 'Submit to BIR', exact: true }).click();
 await expect(page.getByRole('alert')).toContainText('Primary dispatcher connection failed');
 expect(await page.evaluate(() => Reflect.get(window, 'testBackupAddress'))).toBe('');
});

test('tests the displayed dispatcher addresses without saving edits', async ({ page }, testInfo) => {
 await page.setViewportSize({ width: 390, height: 960 });
 await seedWorkspace(page, 'dark', 'loaded', {}, undefined, { uiAgent: true });
 await page.goto('/settings');
 await expect(page.getByRole('heading', { name: 'eBIRForm Submission', exact: true })).toBeVisible({ timeout: 15_000 });
 await expect(page.getByText('BIR submission is available for Form 1601-EQ first.')).toHaveCount(0);
 const testConnection = page.getByRole('button', { name: 'Test dispatcher connection' });
 await expect(testConnection).toBeVisible({ timeout: 15_000 });
 await page.evaluate(() => {
  const native = Reflect.get(window, '__TAURI_INTERNALS__');
  const invoke = native.invoke;
  native.invoke = (command: string, args: { backupAddress: string }) => {
   if (command === 'test_dispatcher_connection') {
    Reflect.set(window, 'testDispatcherArgs', args);
    return Promise.resolve({
     primary: { kind: 'http', status: 200 },
     backup: args.backupAddress ? { kind: 'http', status: 404 } : null
    });
   }
   if (command === 'submit_return') throw new Error('Connection test must not invoke submission');
   return invoke(command, args);
  };
 });
 const primary = page.getByRole('textbox', { name: 'Primary dispatcher address' });
 const backup = page.getByRole('textbox', { name: 'Backup dispatcher address' });
 await primary.fill('https://primary.example.test/bir/');
 await backup.fill('https://backup.example.test/bir/');
 await testConnection.click();
 await expect(page.getByRole('status').filter({ hasText: 'Primary dispatcher returned HTTP 200.' })).toBeVisible();
 await expect(page.getByRole('status').filter({ hasText: 'Backup dispatcher returned HTTP 404.' })).toBeVisible();
 expect(await page.evaluate(() => Reflect.get(window, 'testDispatcherArgs'))).toEqual({
  primaryAddress: 'https://primary.example.test/bir/',
  backupAddress: 'https://backup.example.test/bir/'
 });
 const dispatcherForm = page.getByRole('form', { name: 'Dispatcher settings' });
 await dispatcherForm.evaluate(element => element.scrollIntoView({ block: 'center' }));
 await dispatcherForm.screenshot({ path: testInfo.outputPath('dispatcher-connection-narrow.png') });
 expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
 await page.setViewportSize({ width: 1440, height: 960 });
 await dispatcherForm.evaluate(element => element.scrollIntoView({ block: 'center' }));
 await dispatcherForm.screenshot({ path: testInfo.outputPath('dispatcher-connection-desktop.png') });

 await backup.fill('');
 await testConnection.click();
 await expect(page.getByRole('status').filter({ hasText: 'Primary dispatcher returned HTTP 200.' })).toBeVisible();
 await expect(page.getByText('Backup dispatcher returned HTTP 404.')).toHaveCount(0);
 expect(await page.evaluate(() => Reflect.get(window, 'testDispatcherArgs'))).toEqual({
  primaryAddress: 'https://primary.example.test/bir/',
  backupAddress: ''
 });
 await page.reload();
 await expect(primary).toHaveValue('http://birgovph.com/');
 await expect(backup).toHaveValue('http://ws1.birgovph.com/');
});
