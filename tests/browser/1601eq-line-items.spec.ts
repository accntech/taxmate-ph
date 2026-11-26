import { expect, test, type Page } from '@playwright/test';
import { formPath, seedWorkspace } from './fixtures';

const summary = (page: Page) => page.getByRole('complementary', { name: 'Summary', exact: true });
const items = (page: Page) => page.getByRole('list', { name: 'ATC line items', exact: true });
const editor = (page: Page) => page.getByRole('dialog', { name: /line item/i });

test.beforeEach(async ({ page }) => {
	await page.routeWebSocket('**/*', socket => socket.close());
});

async function deleteLine(page: Page, index: number) {
	await page.getByRole('button', { name: `Edit line item ${index}`, exact: true }).click();
	await editor(page).getByRole('button', { name: 'Delete item', exact: true }).click();
	await expect(editor(page)).toBeHidden();
}

async function selectAtc(page: Page, code: string) {
	await editor(page).getByRole('combobox', { name: 'ATC', exact: true }).click();
	await page.getByPlaceholder('Search code or income', { exact: true }).fill(code);
	await page.getByRole('option', { name: new RegExp(`^${code} `) }).click();
}

test('numbered tax rows reopen their drawer and preserve committed values at narrow widths', async ({ page }, testInfo) => {
	await page.setViewportSize({ width: 1440, height: 960 });
	await seedWorkspace(page);
	await page.goto(formPath);
	const row = items(page).getByRole('listitem').first();
	const link = row.getByRole('button', { name: 'Edit line item 1', exact: true });
	await expect(link).toHaveText('WI120', { timeout: 15000 });
	await expect(link.getByText('WI120')).toHaveCSS('font-family', /\bmonospace$/);
	await expect(row.getByLabel('Item 13 Tax rate', { exact: true })).toHaveCSS('font-family', /\bmonospace$/);
	await expect(row.getByLabel('Item 13 Tax withheld', { exact: true })).toHaveCSS('font-family', /\bmonospace$/);
	await expect(row.getByRole('textbox')).toHaveCount(0);
	await link.click();
	await expect(editor(page).getByText('Taxes withheld', { exact: true })).toBeVisible();
	const base = editor(page).getByRole('textbox', { name: 'Tax Base', exact: true });
	await expect(base).toHaveCSS('font-family', /\bmonospace$/);
	await base.fill('200000');
	await expect(summary(page)).toContainText('₱765.44');
	await editor(page).getByRole('button', { name: 'Update', exact: true }).click();
	await expect(editor(page)).toBeHidden();
	await expect(summary(page)).toContainText('₱2,765.44');
	await expect(link).toBeFocused();
	await page.screenshot({ path: testInfo.outputPath('1601eq-form-desktop.png'), fullPage: true });
	await page.setViewportSize({ width: 390, height: 844 });
	await expect(row.getByLabel('Item 13 Tax rate', { exact: true })).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	await link.click();
	await selectAtc(page, 'WI010');
	await page.setViewportSize({ width: 320, height: 700 });
	await expect(editor(page).getByText('Taxes withheld', { exact: true })).toBeVisible();
	await base.fill('999999999.99');
	await base.blur();
	await expect(base).toHaveValue('999,999,999.99');
	await expect(page.getByPlaceholder('Search code or income', { exact: true })).toBeHidden();
	await page.screenshot({ path: testInfo.outputPath('1601eq-form-phone.png'), fullPage: true });
	await editor(page).getByRole('button', { name: 'Update', exact: true }).click();
	await expect(editor(page)).toBeHidden();
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0].values);
	expect(saved['frm1601EQ:txtATC13']).toBe('WI010');
	expect(saved['frm1601EQ:txtTaxBase13']).toBe('999999999.99');
});

test('new and edited line drafts leave totals unchanged until committed', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(formPath);
	await expect(summary(page)).toContainText('₱765.44');
	await page.getByRole('button', { name: 'Add line item', exact: true }).click();
	await expect(editor(page).getByText('Taxes withheld', { exact: true })).toBeVisible();
	await expect(editor(page)).toBeVisible();
	await expect(editor(page).getByRole('combobox', { name: 'ATC', exact: true })).toBeFocused();
	await selectAtc(page, 'WI010');
	await editor(page).getByRole('textbox', { name: 'Tax Base', exact: true }).fill('20000');
	await expect(summary(page)).toContainText('₱765.44');
	await page.keyboard.press('Control+i');
	await expect(editor(page).getByRole('textbox', { name: 'Tax Base', exact: true })).toHaveValue('20000');
	await editor(page).getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(editor(page)).toBeHidden();
	await expect(items(page).getByRole('listitem')).toHaveCount(1);
	await page.getByRole('button', { name: 'Edit line item 1', exact: true }).click();
	await editor(page).getByRole('textbox', { name: 'Tax Base', exact: true }).fill('200000');
	await editor(page).getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(editor(page)).toBeHidden();
	await expect(summary(page)).toContainText('₱765.44');
	await page.getByRole('button', { name: 'Add line item', exact: true }).click();
	await selectAtc(page, 'WI010');
	await editor(page).getByRole('textbox', { name: 'Tax Base', exact: true }).fill('20000');
	await editor(page).getByRole('button', { name: 'Add', exact: true }).click();
	await expect(editor(page)).toBeHidden();
	await expect(items(page).getByRole('listitem')).toHaveCount(2);
	await expect(summary(page)).toContainText('₱1,765.44');
	await page.getByRole('button', { name: 'Edit line item 1', exact: true }).click();
	await editor(page).getByRole('textbox', { name: 'Tax Base', exact: true }).fill('200000');
	await editor(page).getByRole('button', { name: 'Update', exact: true }).click();
	await expect(editor(page)).toBeHidden();
	await expect(summary(page)).toContainText('₱3,765.44');
});

test('1601EQ reopens a line item after closing its drawer', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(formPath);

	const edit = items(page).getByRole('button', { name: 'Edit line item 1', exact: true });
	const drawer = editor(page);
	const atc = drawer.getByRole('combobox', { name: 'ATC', exact: true });
	await edit.click();
	await expect(atc).toBeFocused();
	await drawer.getByRole('button', { name: 'Close', exact: true }).click();
	await expect(drawer).toBeHidden();

	await edit.click();
	await expect(atc).toBeFocused();
});

test('invalid drafts cannot add a row and Escape discards a new draft', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(formPath);
	await page.getByRole('button', { name: 'Add line item', exact: true }).click();
	await editor(page).getByRole('button', { name: 'Add', exact: true }).click();
	await expect(editor(page)).toContainText('Enter an expanded withholding ATC');
	await expect(editor(page)).toContainText('Enter a tax base greater than zero');
	await selectAtc(page, 'WI010');
	await editor(page).getByRole('textbox', { name: 'Tax Base', exact: true }).fill('oops');
	await editor(page).getByRole('button', { name: 'Add', exact: true }).click();
	await expect(editor(page)).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(editor(page)).toBeHidden();
	await expect(items(page).getByRole('listitem')).toHaveCount(1);
});

test('drag and keyboard reordering persist whole rows through save and reopen', async ({ page }) => {
	await seedWorkspace(page);
	await page.addInitScript(() => {
		const data = JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!);
		Object.assign(data.returns[0].values, { 'frm1601EQ:txtATC14': 'WI010', 'frm1601EQ:txtTaxBase14': '20000' });
		localStorage.setItem('ebirforms-created-returns-v1', JSON.stringify(data));
	});
	await page.goto(formPath);
	await expect(items(page).getByRole('listitem').first()).toHaveCSS('display', 'grid');
	await expect(page.getByRole('region', { name: 'Return period' })).toHaveCSS('display', 'grid');
	await expect.poll(async () => (await items(page).boundingBox())?.height).toBeLessThan(165);
	await page.evaluate(() => document.fonts.ready);
	await items(page).scrollIntoViewIfNeeded();
	await page.getByRole('button', { name: 'Drag line item 2', exact: true }).dragTo(page.getByRole('button', { name: 'Drag line item 1', exact: true }));
	await expect(items(page).getByRole('listitem').first()).toContainText('WI010');
	await expect(items(page).getByRole('listitem').first().getByLabel('Item 13 Tax base')).toHaveText('₱20,000.00');
	await expect(summary(page)).toContainText('₱1,765.44');
	await page.getByRole('button', { name: 'Drag line item 1', exact: true }).press('ArrowDown');
	await expect(items(page).getByRole('listitem').first()).toContainText('WI120');
	await page.getByRole('button', { name: 'Drag line item 2', exact: true }).press('ArrowUp');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0].values);
	expect(saved['frm1601EQ:txtATC13']).toBe('WI010');
	expect(saved['frm1601EQ:txtTaxBase13']).toBe('20000');
	expect(saved['frm1601EQ:txtTaxRate13']).toBe('5.00');
	expect(saved['frm1601EQ:txtTaxWithheld13']).toBe('1000.00');
	expect(saved['frm1601EQ:txtATC14']).toBe('WI120');
	expect(saved['frm1601EQ:txtTaxBase14']).toBe('100000');
	await page.getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(items(page).getByRole('listitem').first()).toContainText('WI010');
	await deleteLine(page, 1);
	await expect(items(page).getByRole('listitem')).toHaveCount(1);
	await page.getByRole('button', { name: 'Undo', exact: true }).click();
	await expect(items(page).getByRole('listitem').first()).toContainText('WI010');
	await expect(items(page).getByRole('listitem')).toHaveCount(2);
});

for (const theme of ['light', 'dark']) {
	test(`empty state, editor and keyboard focus fit a narrow ${theme} window`, async ({ page }, testInfo) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await seedWorkspace(page, theme);
		await page.goto(formPath);
		await deleteLine(page, 1);
		await expect(page.getByText('No items added', { exact: true })).toBeVisible();
		await page.getByRole('button', { name: 'Add line item', exact: true }).click();
		await expect(editor(page).getByRole('combobox', { name: 'ATC', exact: true })).toBeFocused();
		await page.keyboard.press('Tab');
		const base = editor(page).getByRole('textbox', { name: 'Tax Base', exact: true });
		await expect(base).toBeFocused();
		await expect(editor(page)).toHaveCSS('opacity', '1');
		await editor(page).evaluate(async element => { await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {}))); });
		expect(await base.evaluate(element => getComputedStyle(element.parentElement!).boxShadow)).not.toBe('none');
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
		const bounds = await editor(page).boundingBox();
		expect(bounds!.x).toBeGreaterThanOrEqual(0);
		expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(391);
		await page.screenshot({ path: testInfo.outputPath(`line-editor-${theme}.png`) });
		await page.keyboard.press('Escape');
		await expect(page.getByRole('button', { name: 'Add line item', exact: true })).toBeFocused();
	});
}

test('desktop list keeps the drag focus indicator visible', async ({ page }, testInfo) => {
	await page.setViewportSize({ width: 1440, height: 960 });
	await seedWorkspace(page, 'dark');
	await page.addInitScript(() => {
		const data = JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!);
		Object.assign(data.returns[0].values, { 'frm1601EQ:txtATC14': 'WI010', 'frm1601EQ:txtTaxBase14': '20000' });
		localStorage.setItem('ebirforms-created-returns-v1', JSON.stringify(data));
	});
	await page.goto(formPath);
	const grip = page.getByRole('button', { name: 'Drag line item 1', exact: true });
	await grip.focus();
	await grip.press('ArrowDown');
	const movedGrip = page.getByRole('button', { name: 'Drag line item 2', exact: true });
	await expect(movedGrip).toBeFocused();
	await expect(movedGrip).not.toHaveCSS('box-shadow', 'none');
	await page.screenshot({ path: testInfo.outputPath('line-items-desktop.png') });
});

test('adding to a sparse imported return appends after its existing item', async ({ page }) => {
	await seedWorkspace(page);
	await page.addInitScript(() => {
		const data = JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!);
		const values = data.returns[0].values;
		values['frm1601EQ:txtATC18'] = values['frm1601EQ:txtATC13'];
		values['frm1601EQ:txtTaxBase18'] = values['frm1601EQ:txtTaxBase13'];
		delete values['frm1601EQ:txtATC13'];
		delete values['frm1601EQ:txtTaxBase13'];
		localStorage.setItem('ebirforms-created-returns-v1', JSON.stringify(data));
	});
	await page.goto(formPath);
	await page.getByRole('button', { name: 'Add line item', exact: true }).click();
	await selectAtc(page, 'WI010');
	await editor(page).getByRole('textbox', { name: 'Tax Base', exact: true }).fill('20000');
	await editor(page).getByRole('button', { name: 'Add', exact: true }).click();
	await expect(items(page).getByRole('listitem').first()).toContainText('WI120');
	await expect(items(page).getByRole('listitem').last()).toContainText('WI010');
});

test('validation links open the corresponding line editor and keep invalid imports editable', async ({ page }) => {
	await seedWorkspace(page);
	await page.addInitScript(() => {
		const data = JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!);
		data.returns[0].values['frm1601EQ:txtTaxBase13'] = '0';
		localStorage.setItem('ebirforms-created-returns-v1', JSON.stringify(data));
	});
	await page.goto(formPath + '&validate=true');
	await page.getByRole('alert').getByRole('link', { name: /ATC row 1 · Tax base/ }).click();
	await expect(editor(page)).toBeVisible();
	await expect(editor(page).getByRole('textbox', { name: 'Tax Base', exact: true })).toBeFocused();
	await editor(page).getByRole('textbox', { name: 'Tax Base', exact: true }).fill('100000');
	await editor(page).getByRole('button', { name: 'Update', exact: true }).click();
	await expect(editor(page)).toBeHidden();
	await expect(summary(page)).toContainText('₱765.44');
});

test('six committed items block another draft until an item is removed', async ({ page }) => {
	await seedWorkspace(page);
	await page.addInitScript(() => {
		const data = JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!);
		for (const line of [13, 14, 15, 16, 17, 18]) {
			data.returns[0].values[`frm1601EQ:txtATC${line}`] = 'WI120';
			data.returns[0].values[`frm1601EQ:txtTaxBase${line}`] = '1000';
		}
		localStorage.setItem('ebirforms-created-returns-v1', JSON.stringify(data));
	});
	await page.goto(formPath);
	await expect(items(page).getByRole('listitem')).toHaveCount(6);
	await expect(page.getByRole('button', { name: 'Add line item', exact: true })).toBeDisabled();
	await page.keyboard.press('Control+i');
	await expect(editor(page)).toBeHidden();
	await deleteLine(page, 3);
	await expect(page.getByRole('button', { name: 'Add line item', exact: true })).toBeEnabled();
	await page.getByRole('button', { name: 'Undo', exact: true }).click();
	await expect(items(page).getByRole('listitem')).toHaveCount(6);
});

test('1601EQ opens saved ATC links and deletes in the drawer', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(formPath);
	await expect(page.locator('.eq-section-header').getByRole('button', { name: 'Add line item', exact: true })).toBeVisible();
	await items(page).getByRole('button', { name: 'Edit line item 1', exact: true }).click();
	await editor(page).getByRole('button', { name: 'Delete item', exact: true }).click();
	await expect(editor(page)).toBeHidden();
	await expect(items(page).getByRole('listitem')).toHaveCount(0);
	await expect(page.getByRole('button', { name: 'Add line item', exact: true })).toBeFocused();
	await page.getByRole('button', { name: 'Undo', exact: true }).click();
	await expect(items(page)).toContainText('WI120');
});
