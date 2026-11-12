import { expect, test } from '@playwright/test';
import { formPath, seedWorkspace, taxpayerId } from './fixtures';

test.describe('return field behavior', () => {
	test.beforeEach(async ({ page }) => {
	await seedWorkspace(page);
	await page.clock.setFixedTime(new Date('2026-11-12T04:00:00Z'));
	await page.goto(formPath);
		await expect(page.getByText('Loading saved form…', { exact: true })).toBeHidden();
	});

test('quarter select shows full labels and preserves keyboard navigation and conditional credits', async ({ page }) => {
	const quarter = page.getByRole('combobox', { name: 'Quarter', exact: true });
	await expect(quarter).toHaveText('Second Quarter');
	await quarter.focus();
	await quarter.press('Enter');
	await expect(page.getByRole('option')).toHaveText(['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter']);
	await quarter.press('ArrowUp');
	await quarter.press('Enter');
	await expect(quarter).toHaveText('First Quarter');
	await expect(page.getByLabel('Over-remittance from previous quarter', { exact: true })).toHaveCount(0);
	await quarter.press('Enter');
	await quarter.press('ArrowDown');
	await quarter.press('Enter');
	await expect(quarter).toHaveText('Second Quarter');
	await expect(page.getByLabel('Over-remittance from previous quarter', { exact: true })).toBeVisible();
	await quarter.press('Tab');
	await expect(page.getByRole('radiogroup', { name: 'Amended return?' }).getByRole('radio', { name: 'No', exact: true })).toBeFocused();
});

test('Yes/No radios reveal applicable fields and preserve withheld entries across toggles and draft saving', async ({ page }) => {
	const amended = page.getByRole('radiogroup', { name: 'Amended return?' });
	await expect(amended.getByRole('radio', { name: 'No', exact: true })).toBeChecked();
	await amended.getByRole('radio', { name: 'Yes', exact: true }).check();
	await expect(page.getByLabel('Previously filed return', { exact: true })).toBeVisible();
	const withheld = page.getByRole('radiogroup', { name: 'Any taxes withheld?' });
	await expect(withheld.getByRole('radio', { name: 'Yes', exact: true })).toBeChecked();
	await withheld.getByRole('radio', { name: 'No', exact: true }).check();
	await expect(page.getByRole('group', { name: 'ATC row 1', exact: true })).toHaveCount(0);
	await page.getByRole('combobox', { name: 'Apply over-remittance as', exact: true }).click();
	await page.getByRole('option', { name: 'Carry over to next quarter', exact: true }).click();
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0].values);
	expect(saved['frm1601EQ:optTaxesWithheld']).toBe('N');
	expect(saved['frm1601EQ:txtATC13']).toBe('WI120');
	expect(saved['frm1601EQ:txtTaxBase13']).toBe('100000');
	await page.getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(withheld.getByRole('radio', { name: 'No', exact: true })).toBeChecked();
	await withheld.getByRole('radio', { name: 'Yes', exact: true }).check();
	const row = page.getByRole('group', { name: 'ATC row 1', exact: true });
	await expect(row.getByRole('combobox', { name: 'ATC', exact: true })).toHaveText('WI120');
	await expect(row.getByRole('textbox', { name: 'Tax Base', exact: true })).toHaveValue('100,000.00');
});

test('calculated outputs are separate from editable inputs and update from the tax base', async ({ page }) => {
	const row = page.getByRole('group', { name: 'ATC row 1', exact: true });
	const rate = row.getByLabel('Rate (%)', { exact: true });
	const tax = row.getByLabel('Tax withheld', { exact: true });
	await expect(rate).toHaveJSProperty('tagName', 'OUTPUT');
	await expect(tax).toHaveJSProperty('tagName', 'OUTPUT');
	await expect(rate).toHaveText('2.00%');
	await expect(tax).toHaveText('₱2,000.00');
	await expect(row.getByText('From ATC', { exact: true })).toBeVisible();
	await expect(row.getByText('Calculated', { exact: true })).toBeVisible();
	const base = row.getByRole('textbox', { name: 'Tax Base', exact: true });
	await expect(base).toBeEditable();
	await base.fill('50000');
	await base.blur();
	await expect(tax).toHaveText('₱1,000.00');
	await base.fill('oops');
	await base.blur();
	await expect(tax).toHaveText('—');
	await expect(page.getByText('Correct the amounts to calculate the total.')).toBeVisible();
});

test('unfinished quarter is saved as a draft and rejected at finalization', async ({ page }) => {
	const quarter = page.getByRole('combobox', { name: 'Quarter', exact: true });
	await quarter.click();
	await page.getByRole('option', { name: 'Fourth Quarter', exact: true }).click();
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	await page.getByRole('button', { name: /^More actions for BIR Form 1601EQ,/ }).click();
	await page.getByRole('menuitem', { name: 'Mark as final', exact: true }).click();
	await expect(page.getByRole('alert')).toContainText('The quarter must end');
	await page.getByRole('link', { name: 'Edit return to fix errors', exact: true }).click();
	await expect(quarter).toHaveText('Fourth Quarter');
});
});

for (const theme of ['light', 'dark']) {
	for (const width of [1440, 390]) {
		test(`field choices fit at ${width}px in ${theme}`, async ({ page }, testInfo) => {
			await page.setViewportSize({ width, height: 960 });
			await seedWorkspace(page, theme);
			await page.goto(formPath);
			await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
			await expect(page.getByRole('combobox', { name: 'Quarter', exact: true })).toBeInViewport();
			const year = page.getByRole('textbox', { name: 'Year', exact: true });
			await year.focus();
			const inputFrame = year.locator('..');
			await expect(inputFrame).toHaveCSS('box-shadow', /0px 0px 0px 3px$/);
			const inputFocus = await inputFrame.evaluate(element => {
				const style = getComputedStyle(element);
				return { shadow: style.boxShadow, border: style.borderTopColor };
			});
			const amended = page.getByRole('radiogroup', { name: 'Amended return?' });
			await amended.getByRole('radio', { name: 'No', exact: true }).focus();
			await page.keyboard.press('ArrowRight');
			const yes = amended.getByRole('radio', { name: 'Yes', exact: true });
			await expect(yes).toBeFocused();
			await expect(yes).toBeChecked();
			await expect(yes).toHaveCSS('outline-style', 'none');
			await expect(yes).toHaveCSS('box-shadow', 'none');
			const circle = yes.locator('..');
			await expect(circle).toHaveCSS('border-radius', '50%');
			await expect(circle).toHaveCSS('outline-style', 'solid');
			await expect(circle).toHaveCSS('outline-width', '1px');
			await expect(circle).toHaveCSS('outline-offset', '0px');
			await expect(circle).toHaveCSS('outline-color', inputFocus.border);
			await expect(circle).toHaveCSS('box-shadow', inputFocus.shadow);
			const label = amended.locator('label').filter({ has: page.getByRole('radio', { name: 'Yes', exact: true }) });
			await expect(label).toHaveCSS('outline-style', 'none');
			await expect(label).toHaveCSS('border-width', '0px');
			await expect(label).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
			expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
			await page.screenshot({ path: testInfo.outputPath(`field-choices-${theme}-${width}.png`), fullPage: true, animations: 'disabled' });
			const summary = page.locator('.eq-disclosure > summary').filter({ hasText: 'Remittances and credits' });
			await summary.focus();
			await expect(summary).toHaveCSS('outline-style', 'none');
			await expect(summary).toHaveCSS('border-top-color', inputFocus.border);
			await expect(summary).toHaveCSS('box-shadow', inputFocus.shadow);
			await page.screenshot({ path: testInfo.outputPath(`disclosure-focus-${theme}-${width}.png`), fullPage: true, animations: 'disabled' });
			await page.emulateMedia({ forcedColors: 'active' });
			await expect(summary).toHaveCSS('outline-style', 'solid');
			await yes.focus();
			await expect(yes).toHaveCSS('outline-style', 'none');
			await expect(circle).toHaveCSS('outline-style', 'solid');
			await expect(circle).toHaveCSS('border-radius', '50%');
			await page.screenshot({ path: testInfo.outputPath(`radio-forced-colors-${theme}-${width}.png`), animations: 'disabled' });
		});
	}
}
