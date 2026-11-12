import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/design-system');
});

test('currency edits exact raw text, regroups on blur and preserves invalid entries', async ({ page }, testInfo) => {
	const amount = page.getByLabel('Amount due', { exact: true });
	await amount.fill('1234.56');
	await amount.blur();
	await expect(amount).toHaveValue('1,234.56');
	await amount.focus();
	await expect(amount).toHaveValue('1234.56');
	await expect.poll(() => amount.evaluate(input => {
		const control = input as HTMLInputElement;
		return [control.selectionStart, control.selectionEnd];
	})).toEqual([0, 7]);
	await page.screenshot({ path: testInfo.outputPath('currency-focus.png') });
	await amount.fill('12.');
	await amount.blur();
	await expect(amount).toHaveValue('12.');
	await expect(amount).toHaveAttribute('aria-invalid', 'true');
	await expect(page.getByText('Enter an amount such as 1,234.56')).toBeVisible();
	const calculated = page.getByLabel('Calculated withholding', { exact: true });
	await calculated.focus();
	await expect(calculated).toHaveValue('1,234.56');
	await expect(calculated).toHaveAttribute('readonly', '');
});

test('TIN accepts a formatted paste without losing branch digits or leading zeros', async ({ page }) => {
	const tin = page.getByLabel('TIN and branch code', { exact: true });
	await tin.focus();
	await tin.fill('');
	await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
	await page.evaluate(() => navigator.clipboard.writeText('001-234-567-0008'));
	await tin.press('ControlOrMeta+V');
	await tin.blur();
	await expect(tin).toHaveValue('001-234-567-0008');
	await tin.focus();
	await expect(tin).toHaveValue('0012345670008');
	await tin.fill('001234567');
	await tin.blur();
	await expect(tin).toHaveValue('001-234-567');
});

test('whole-number controls reject decimal entry and expose range errors', async ({ page }) => {
	const sheets = page.getByLabel('Sheets attached', { exact: true });
	await sheets.fill('12');
	await sheets.press('End');
	await sheets.press('.');
	await expect(sheets).toHaveValue('12');
	await sheets.fill('-1');
	await sheets.blur();
	await expect(sheets).toHaveAttribute('aria-invalid', 'true');
	await sheets.fill('0');
	await expect(sheets).not.toHaveAttribute('aria-invalid', 'true');
});

test('shared select can be chosen using the keyboard', async ({ page }) => {
	const period = page.getByRole('combobox', { name: 'Filing period' });
	await period.focus();
	await period.press('Enter');
	await expect(period).toHaveAttribute('aria-expanded', 'true');
	await page.keyboard.press('ArrowDown');
	await expect(period).toBeFocused();
	const activeId = await period.getAttribute('aria-activedescendant');
	expect(activeId).toBeTruthy();
	await expect(page.locator(`[id="${activeId}"]`)).toHaveAttribute('role', 'option');
	await page.keyboard.press('Enter');
	await expect(period).toHaveAttribute('aria-expanded', 'false');
});

test('Tab closes a select and advances focus in one keystroke', async ({ page }) => {
	const period = page.getByRole('combobox', { name: 'Filing period' });
	await period.focus();
	await period.press('Enter');
	await expect(period).toHaveAttribute('aria-expanded', 'true');
	await period.press('Tab');
	await expect(period).toHaveAttribute('aria-expanded', 'false');
	await expect(period).not.toBeFocused();
});

test('warning actions retain warning color after the component migration', async ({ page }) => {
	const warning = page.getByRole('button', { name: 'Needs review', exact: true });
	await expect(warning).toHaveCSS('background-color', 'rgb(255, 242, 214)');
});

test('keyboard focus remains visible in forced-colors mode', async ({ page }, testInfo) => {
	await page.emulateMedia({ forcedColors: 'active' });
	const amount = page.getByLabel('Amount due', { exact: true });
	await amount.focus();
	await page.keyboard.press('Tab');
	await page.keyboard.press('Shift+Tab');
	await expect(amount).toBeFocused();
	await expect(amount).toHaveCSS('outline-style', 'solid');
	await page.screenshot({ path: testInfo.outputPath('forced-colors-focus.png') });
});
