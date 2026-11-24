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
