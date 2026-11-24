import { expect, test, type Page } from '@playwright/test';
import { formPath, seedWorkspace, taxpayerId } from './fixtures';

function request(page: Page, request: Record<string, unknown>) {
	return page.evaluate(request => (window as unknown as {
		sendUiAgentRequest: (request: unknown) => Promise<unknown>;
	}).sendUiAgentRequest(request), request);
}

test('the native UI agent opens a taxpayer and saves a new 0605 through the editor', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {}, [], { uiAgent: true });
	await page.goto('/');
	await expect.poll(() => page.evaluate(() => Reflect.get(window, 'uiAgentReady')), { timeout: 15000 }).toBe(true);

	async function press(target: string) {
		await expect(request(page, { method: 'act', target, action: 'press' })).resolves.toMatchObject({ ok: true });
	}

	await press('eBIRForms');
	await expect(page.getByRole('link', { name: 'Example Services Corporation', exact: true })).toBeVisible();
	await expect(request(page, { method: 'query', text: 'Example Services' })).resolves.toMatchObject({
		ok: true,
		result: { controls: expect.arrayContaining([expect.objectContaining({ target: 'Example Services Corporation', actions: ['press'] })]) }
	});
	await press('Example Services Corporation');
	await expect(page.getByRole('button', { name: 'Create return', exact: true })).toBeEnabled();
	await press('Create return');
	await expect(page.getByRole('option').filter({ hasText: 'BIR Form 0605' })).toBeVisible();
	await press('BIR Form 0605');
	await expect(page.getByRole('button', { name: 'Save draft' })).toBeEnabled();
	await expect(request(page, { method: 'act', target: 'Submit', action: 'press' })).resolves.toMatchObject({ ok: false });
	await press('Save draft');
	await expect(page).toHaveURL(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	const row = page.getByRole('row').filter({ has: page.getByRole('cell', { name: 'BIR Form 0605', exact: true }) });
	await expect(row.getByRole('cell', { name: 'Draft', exact: true })).toBeVisible();
	const records = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns);
	expect(records).toMatchObject([{ formCode: '0605', taxpayerId, status: 'Draft' }]);
});

test('the UI agent updates the latest saved 0605 draft across table pages', async ({ page }) => {
	const draft = {
		taxpayerId,
		formCode: '0605',
		returnPeriod: '2026',
		status: 'Draft' as const,
		finalFlag: '0',
		values: { 'frm0605:txtTax19': '75', 'frm0605:txtTax20A': '25' }
	};
	await seedWorkspace(page, 'light', 'loaded', {}, [
		...Array.from({ length: 22 }, (_, index) => ({ ...draft, id: `earlier-${index}`, updatedAt: index })),
		{ ...draft, id: 'latest-0605', updatedAt: 23 },
		{ ...draft, id: 'archived-0605', updatedAt: 24, archived: true },
		{ ...draft, id: 'final-0605', updatedAt: 25, status: 'Final', finalFlag: '1' }
	], { uiAgent: true });
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	await expect(page.getByRole('heading', { name: 'Tax Returns' })).toBeVisible();
	await expect.poll(() => page.evaluate(() => Reflect.get(window, 'uiAgentReady'))).toBe(true);

	const query = (text: string) => request(page, { method: 'query', text });
	const act = (target: string, action: string, args?: Record<string, unknown>) =>
		request(page, { method: 'act', target, action, args });
	const target = 'Edit BIR Form 0605 Draft (latest-0605)';
	await expect(query('0605 draft')).resolves.toMatchObject({
		ok: true,
		result: {
			controls: expect.arrayContaining([expect.objectContaining({ target, actions: ['press'], formCode: '0605', status: 'Draft', returnPeriod: '2026', updatedAt: 23 })]),
			more: 3
		}
	});
	await expect(query('final-0605')).resolves.toMatchObject({ result: { controls: [] } });
	await expect(query('archived-0605')).resolves.toMatchObject({ result: { controls: [] } });
	const result = await query('0605 draft') as { result: { controls: { target: string }[] } };
	expect(result.result.controls[0].target).toBe(target);
	await expect(request(page, { method: 'query', text: '0605 draft', offset: 20 })).resolves.toMatchObject({
		result: {
			controls: [0, 1, 2].reverse().map(index => ({ target: `Edit BIR Form 0605 Draft (earlier-${index})` })),
			more: 0
		}
	});

	await expect(act(target, 'press')).resolves.toMatchObject({ ok: true });
	await expect(page.getByRole('button', { name: 'Save draft' })).toBeEnabled();
	await expect(query('Basic tax')).resolves.toMatchObject({
		result: { controls: [{ target: 'Basic tax', actions: ['set_value'], args: { value: 'string' }, value: '75.00' }] }
	});
	await expect(query('Total penalties')).resolves.toMatchObject({
		result: { controls: [{ target: 'Total penalties', actions: [], value: '₱25.00' }] }
	});
	await expect(act('Total amount payable', 'set_value', { value: '500' })).resolves.toMatchObject({ ok: false });
	await expect(act('Basic tax', 'set_value', { value: 'malformed' })).resolves.toMatchObject({ ok: false });
	await expect(act('Basic tax', 'set_value', { value: '475' })).resolves.toMatchObject({ ok: true });
	await expect(query('Total amount payable')).resolves.toMatchObject({
		result: { controls: [{ target: 'Total amount payable', actions: [], value: '₱500.00' }] }
	});
	await expect(act('Save draft', 'press')).resolves.toMatchObject({ ok: true });
	await expect(page).toHaveURL(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	await expect.poll(() => query('latest-0605')).toMatchObject({
		result: { controls: [{ target, amountDue: '500.00' }] }
	});
	await expect(act(target, 'press')).resolves.toMatchObject({ ok: true });
	await expect.poll(() => query('Total amount payable')).toMatchObject({
		result: { controls: [{ value: '₱500.00' }] }
	});
	const records = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns);
	expect(records).toHaveLength(25);
	expect(records).toEqual(expect.arrayContaining([
		expect.objectContaining({ id: 'latest-0605', status: 'Draft', values: expect.objectContaining({ 'frm0605:txtTax19': '475', 'frm0605:txtTax20A': '25' }) }),
		expect.objectContaining({ id: 'earlier-0', values: draft.values })
	]));
});

test('the UI agent can search and navigate ordinary controls while deletion requires a human click', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {}, undefined, { uiAgent: true });
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	await expect(page.getByRole('heading', { name: 'Tax Returns' })).toBeVisible();
	await expect.poll(() => page.evaluate(() => Reflect.get(window, 'uiAgentReady'))).toBe(true);

	const query = (text: string) => request(page, { method: 'query', text });
	const act = (target: string, action: string, args?: Record<string, unknown>) =>
		request(page, { method: 'act', target, action, args });
	await expect(query('Search tax returns')).resolves.toMatchObject({
		result: { controls: [{ target: 'Search tax returns', actions: ['set_value'], value: '' }] }
	});
	await expect(act('Search tax returns', 'set_value', { value: 'nonexistent' })).resolves.toMatchObject({ ok: true });
	await expect(page.getByRole('cell', { name: 'BIR Form 1601EQ', exact: true })).toHaveCount(0);
	await expect(act('Search tax returns', 'set_value', { value: '' })).resolves.toMatchObject({ ok: true });
	await expect(page.getByRole('cell', { name: 'BIR Form 1601EQ', exact: true })).toBeVisible();

	await expect(act('More actions for BIR Form 1601EQ, 2026Q2', 'press')).resolves.toMatchObject({ ok: true });
	await expect(query('Delete…')).resolves.toMatchObject({ result: { controls: [{ target: 'Delete…', actions: ['press'] }] } });
	await expect(act('Delete…', 'press')).resolves.toMatchObject({ ok: true });
	await expect(query('Delete return')).resolves.toMatchObject({
		result: { controls: [{ target: 'Delete return', actions: [], requiresUserConsent: true }] }
	});
	await expect(act('Delete return', 'press')).resolves.toMatchObject({ ok: false });
	await page.getByRole('button', { name: 'Delete return', exact: true }).evaluate(button => (button as HTMLElement).click());
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.getByRole('button', { name: 'Delete return', exact: true }).click();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(page.getByRole('cell', { name: 'BIR Form 1601EQ', exact: true })).toHaveCount(0);
});

test('the UI agent reorders line items and leaves removal to the user', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {}, [{
		id: 'review-return', taxpayerId, formCode: '1601EQ', returnPeriod: '2026Q2',
		status: 'Draft', updatedAt: 1794441600000, finalFlag: '0',
		values: {
			'frm1601EQ:optTaxesWithheld': 'Y', 'frm1601EQ:txtYear': '2026', 'frm1601EQ:optQuarter': 'Q2',
			'frm1601EQ:txtATC13': 'WI120', 'frm1601EQ:txtTaxBase13': '100000',
			'frm1601EQ:txtATC14': 'WI010', 'frm1601EQ:txtTaxBase14': '20000'
		}
	}], { uiAgent: true });
	await page.goto(formPath);
	await expect(page.getByRole('button', { name: 'Save draft' })).toBeEnabled({ timeout: 15000 });
	const rows = page.getByRole('list', { name: 'ATC line items', exact: true }).getByRole('listitem');
	await expect(rows).toHaveCount(2);
	await expect.poll(() => page.evaluate(() => Reflect.get(window, 'uiAgentReady'))).toBe(true);

	const target = 'Drag line item 1';
	await expect(request(page, { method: 'query', text: target })).resolves.toMatchObject({
		result: { controls: [{ target, actions: ['key'], args: { key: ['ArrowUp', 'ArrowDown', 'Home', 'End'] } }] }
	});
	await expect(request(page, { method: 'act', target, action: 'key', args: { key: 'Delete' } })).resolves.toMatchObject({ ok: false });
	await expect(request(page, { method: 'act', target, action: 'key', args: { key: 'ArrowDown' } })).resolves.toMatchObject({ ok: true });
	await expect(rows.last()).toContainText('WI120');

	const remove = 'Remove line item 1';
	await expect(request(page, { method: 'query', text: remove })).resolves.toMatchObject({
		result: { controls: [{ target: remove, actions: [], requiresUserConsent: true }] }
	});
	await expect(request(page, { method: 'act', target: remove, action: 'press' })).resolves.toMatchObject({ ok: false });
	await expect(rows).toHaveCount(2);
});

test('the agent bridge is off by default and its desktop setting requires a direct click', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {}, undefined, { uiAgent: true });
	await page.goto('/settings');
	const setting = page.getByRole('switch', { name: 'Enable agent bridge', exact: true });
	await expect(setting).toHaveAttribute('aria-checked', 'false', { timeout: 15000 });
	await setting.evaluate(button => (button as HTMLElement).click());
	await expect(setting).toHaveAttribute('aria-checked', 'false');
	const thumb = setting.locator('[data-slot="switch-thumb"]');
	await expect(thumb).toBeVisible();
	const offPosition = (await thumb.boundingBox())!.x;
	await setting.press('Space');
	await expect(setting).toHaveAttribute('aria-checked', 'true');
	await expect.poll(async () => (await thumb.boundingBox())?.x).toBeGreaterThan(offPosition);
	await page.reload();
	await expect(setting).toHaveAttribute('aria-checked', 'true');
	await expect.poll(() => page.evaluate(() => Reflect.get(window, 'uiAgentReady'))).toBe(true);
	await expect(request(page, { method: 'query', text: 'Enable agent bridge' })).resolves.toMatchObject({
		result: { controls: [{ actions: [], requiresUserConsent: true }] }
	});
	await expect(request(page, { method: 'act', target: 'Enable agent bridge', action: 'press' })).resolves.toMatchObject({ ok: false });
	await expect(setting).toHaveAttribute('aria-checked', 'true');
	await setting.click();
	await expect(setting).toHaveAttribute('aria-checked', 'false');
	await page.reload();
	await expect(setting).toHaveAttribute('aria-checked', 'false');
});

test('MCP setup copies a client-neutral prompt and protects access-token copying', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await seedWorkspace(page, 'light', 'loaded', {}, undefined, { uiAgent: true });
	await page.goto('/settings');
	const copy = page.getByRole('button', { name: 'Copy access token', exact: true });
	const copyPrompt = page.getByRole('button', { name: 'Copy setup prompt', exact: true });
	const setting = page.getByRole('switch', { name: 'Enable agent bridge', exact: true });
	const copyCount = () => page.evaluate(() => Reflect.get(window, 'agentTokenCopyCount') ?? 0);

	await expect(copy).toBeVisible({ timeout: 10000 });
	await expect(copy).toBeDisabled();
	await expect(copyPrompt).toBeDisabled();
	await setting.click();
	await expect(copy).toBeEnabled();
	await expect(page.getByText('http://127.0.0.1:42171/mcp', { exact: true })).toBeVisible();
	await page.evaluate(() => {
		Object.defineProperty(navigator.clipboard, 'writeText', {
			value: async (text: string) => { Reflect.set(window, 'agentSetupPrompt', text); }
		});
	});
	await copyPrompt.click({ timeout: 5000 });
	await expect(page.getByRole('status').filter({ hasText: 'Setup prompt copied.' })).toBeVisible();
	const prompt = await page.evaluate(() => Reflect.get(window, 'agentSetupPrompt'));
	expect(prompt).toContain('http://127.0.0.1:42171/mcp');
	expect(prompt).toContain('Streamable HTTP');
	expect(prompt).toContain('Bearer token');
	expect(prompt).toContain('credential settings');
	expect(prompt).toContain('taxmate_ui_query with the text "Settings"');
	await expect(page.getByRole('button', { name: 'Copy Codex config' })).toHaveCount(0);
	await expect.poll(() => page.evaluate(() => Reflect.get(window, 'uiAgentReady'))).toBe(true);
	await expect(request(page, { method: 'query', text: 'Copy access token' })).resolves.toMatchObject({
		result: { controls: [{ actions: [], requiresUserConsent: true }] }
	});
	await expect(request(page, { method: 'act', target: 'Copy access token', action: 'press' })).resolves.toMatchObject({ ok: false });
	await copy.evaluate(button => (button as HTMLElement).click());
	await expect.poll(copyCount).toBe(0);

	await page.evaluate(() => Reflect.set(window, 'failAgentTokenCopy', true));
	await copy.press('Enter');
	await expect(page.getByRole('alert')).toHaveText('Could not copy the access token. Try again.');
	await page.evaluate(() => Reflect.set(window, 'failAgentTokenCopy', false));
	await copy.click();
	await expect(page.getByRole('status').filter({ hasText: 'Access token copied.' })).toBeVisible();
	await expect.poll(copyCount).toBe(2);
	await expect(page.getByRole('alert')).toHaveCount(0);
	await setting.click();
	await expect(copy).toBeDisabled();
	await expect(copyPrompt).toBeDisabled();
	await expect(page.getByText('http://127.0.0.1:42171/mcp', { exact: true })).toHaveCount(0);
});


test('agent setup keeps the URL above the copy actions across window sizes', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {}, undefined, { uiAgent: true });
	await page.goto('/settings');
	await page.getByRole('switch', { name: 'Enable agent bridge', exact: true }).click();
	const url = page.getByText('http://127.0.0.1:42171/mcp', { exact: true });
	const prompt = page.getByRole('button', { name: 'Copy setup prompt', exact: true });
	const token = page.getByRole('button', { name: 'Copy access token', exact: true });

	for (const width of [390, 760, 1280]) {
		await page.setViewportSize({ width, height: 900 });
		const [urlBox, promptBox, tokenBox] = await Promise.all([
			url.boundingBox(), prompt.boundingBox(), token.boundingBox()
		]);
		expect(urlBox).not.toBeNull();
		expect(promptBox).not.toBeNull();
		expect(tokenBox).not.toBeNull();
		expect(promptBox!.y).toBeGreaterThan(urlBox!.y + urlBox!.height);
		expect(tokenBox!.y).toBeGreaterThanOrEqual(promptBox!.y);
		for (const box of [urlBox!, promptBox!, tokenBox!]) {
			expect(box.x + box.width).toBeLessThanOrEqual(width);
		}
		await expect(url).toHaveText('http://127.0.0.1:42171/mcp');
	}
});

test('bulk draft deletion is previewed and confirmed only through the agent', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 900 });
	const draft = { taxpayerId, formCode: '1601EQ', status: 'Draft' as const,
		updatedAt: 1794441600000, finalFlag: '0', values: {} };
	await seedWorkspace(page, 'light', 'loaded', {}, [
		{ ...draft, id: 'first', returnPeriod: '2026Q1' },
		{ ...draft, id: 'second', returnPeriod: '2026Q2' },
		{ ...draft, id: 'changed', returnPeriod: '2026Q3' },
		{ ...draft, id: 'other', returnPeriod: '2026Q4', taxpayerId: 'other-taxpayer' },
		{ ...draft, id: 'archived', returnPeriod: '2025Q1', archived: true }
	], { uiAgent: true });
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	await expect.poll(() => page.evaluate(() => Reflect.get(window, 'uiAgentReady'))).toBe(true);
	await page.getByRole('searchbox', { name: 'Search tax returns' }).fill('no matching returns');
	const trigger = page.getByRole('button', { name: 'Delete all drafts', exact: true });
	await expect(trigger).toHaveCount(0);
	const query = (text: string) => request(page, { method: 'query', text });
	const press = (target: string) => request(page, { method: 'act', target, action: 'press' });
	const confirm = (confirmationId: string, approved: boolean) => request(page, {
		method: 'act', target: 'Confirm draft deletion', action: 'confirm', args: { confirmationId, approved }
	});
	const prepare = async () => {
		const reply = await press('Delete all drafts') as { result?: { confirmationId: string } };
		expect(reply).toMatchObject({
			ok: true,
			result: {
				taxpayerName: 'Example Services Corporation', draftCount: 3,
				confirmationId: expect.any(String), confirmationLocation: 'agent'
			}
		});
		return reply.result!.confirmationId;
	};
	const readIds = () => page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns
		.map((record: { id: string }) => record.id));
	const original = ['first', 'second', 'changed', 'other', 'archived'];
	await expect(query('Delete all drafts')).resolves.toMatchObject({
		result: { controls: [{ target: 'Delete all drafts', actions: ['press'] }] }
	});
	await expect(confirm('missing', true)).resolves.toMatchObject({ ok: false });
	const canceled = await prepare();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(query('Confirm draft deletion')).resolves.toMatchObject({
		result: { controls: [{
			target: 'Confirm draft deletion', actions: ['confirm'], requiresUserConsent: true, confirmationLocation: 'agent'
		}] }
	});
	expect(JSON.stringify(await query('Confirm draft deletion'))).not.toContain(canceled);
	await expect(request(page, {
		method: 'act', target: 'Confirm draft deletion', action: 'confirm', args: { confirmationId: canceled }
	})).resolves.toMatchObject({ ok: false });
	await expect(confirm('wrong-id', true)).resolves.toMatchObject({ ok: false });
	await expect(confirm(canceled, false)).resolves.toMatchObject({ ok: true, result: { canceled: true } });
	await expect(confirm(canceled, true)).resolves.toMatchObject({ ok: false });
	expect(await readIds()).toEqual(original);

	const stale = await prepare();
	await expect(press('← Back to taxpayers')).resolves.toMatchObject({ ok: true });
	await expect(page.getByRole('link', { name: 'Example Services Corporation', exact: true })).toBeVisible();
	await expect(press('Example Services Corporation')).resolves.toMatchObject({ ok: true });
	await expect(page.getByRole('searchbox', { name: 'Search tax returns' })).toBeVisible();
	await expect(confirm(stale, true)).resolves.toMatchObject({ ok: false });
	expect(await readIds()).toEqual(original);

	const approved = await prepare();
	await page.evaluate(() => {
		const key = 'ebirforms-created-returns-v1';
		const data = JSON.parse(localStorage.getItem(key)!);
		data.returns.find((record: { id: string }) => record.id === 'changed').status = 'Final';
		localStorage.setItem(key, JSON.stringify(data));
	});
	await expect(confirm(approved, true)).resolves.toMatchObject({ ok: true, result: { deletedCount: 2 } });
	await expect(confirm(approved, true)).resolves.toMatchObject({ ok: false });
	await expect(page.getByRole('dialog')).toHaveCount(0);
	expect(await readIds()).toEqual(['changed', 'other', 'archived']);
	await expect(query('Delete all drafts')).resolves.toMatchObject({ result: { controls: [] } });
	await expect(trigger).toHaveCount(0);
});
