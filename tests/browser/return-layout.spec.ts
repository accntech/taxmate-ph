import { expect, test } from '@playwright/test';
import { formPath, seedWorkspace } from './fixtures';

for (const width of [1440, 1100, 960, 768, 560, 390, 320]) {
	test(`1601EQ workspace at ${width}px keeps actions together and summary readable`, async ({ page }, testInfo) => {
		await page.setViewportSize({ width, height: 960 });
		await seedWorkspace(page);
		await page.goto(formPath);
		await expect(page.getByText('Loading saved form…', { exact: true })).toBeHidden();
		const actions = page.locator('footer[aria-label="Return actions"]');
		await expect(actions.getByRole('button', { name: 'Save draft', exact: true })).toBeVisible();
		await expect(actions.getByRole('button', { name: 'Cancel', exact: true })).toBeVisible();
		await expect(actions.getByRole('button', { name: 'Submit to BIR', exact: true })).toHaveCount(0);
		const period = await page.getByRole('region', { name: 'Return period', exact: true }).boundingBox();
		const summary = await page.getByRole('complementary', { name: 'Summary', exact: true }).boundingBox();
		expect(period).not.toBeNull();
		expect(summary).not.toBeNull();
		expect(summary!.y).toBeGreaterThan(period!.y + period!.height);
		const taxItems = page.getByRole('region', { name: 'Taxes withheld', exact: true });
		const taxBounds = await taxItems.boundingBox();
		expect(summary!.y).toBeGreaterThanOrEqual(taxBounds!.y + taxBounds!.height - 1);
		await expect(page.getByText('1601-EQ', { exact: true })).toBeVisible();
		await expect.poll(() => page.locator('.paper-sheet').evaluate((sheet) => {
			const frame = sheet.getBoundingClientRect();
			const problems: string[] = [];
			if (frame.left < 0 || frame.right > innerWidth + 1) problems.push('paper sheet outside viewport');
			for (const control of sheet.querySelectorAll('input:not([type="radio"]), [role="combobox"]')) {
				const cell = control.closest('.paper-period-field, .entry-cell, .paper-amount-row');
				const box = control.getBoundingClientRect();
				if (!cell || !box.width) continue;
				const bounds = cell.getBoundingClientRect();
				if (box.left < bounds.left - 1 || box.right > bounds.right + 1) problems.push(control.id + ' outside cell');
				if (innerWidth <= 390) {
					const surface = control instanceof HTMLInputElement ? control.parentElement! : control;
					const height = surface.getBoundingClientRect().height;
					if (height < 36 || height > 40) problems.push(control.id + ' is not compact');
				}
			}
			return problems;
		})).toEqual([]);
		if (width <= 390) {
			const quarter = page.getByRole('combobox', { name: 'Quarter', exact: true });
			await expect.poll(() => quarter.getByText('Second Quarter', { exact: true }).evaluate(label =>
				label.scrollWidth - label.clientWidth
			)).toBeLessThanOrEqual(1);
			for (const button of await actions.getByRole('button').all()) {
				const height = (await button.boundingBox())!.height;
				expect(height).toBeGreaterThanOrEqual(36);
				expect(height).toBeLessThanOrEqual(40);
			}
		}
		await expect(page.getByRole('complementary', { name: 'Summary', exact: true }).getByText('30', { exact: true })).toBeVisible();
		await expect(page.getByRole('complementary', { name: 'Summary', exact: true })).toContainText('Total amount still due');
		await page.getByRole('button', { name: /^Add line item/ }).click();
		const editor = page.getByRole('dialog', { name: 'New line item', exact: true });
		await expect(editor).toBeVisible();
		await expect(editor.getByRole('group', { name: 'ATC row 2', exact: true })).toBeVisible();
		await editor.getByRole('button', { name: 'Cancel', exact: true }).click();
		await expect(editor).toBeHidden();
		await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
		const bar = await actions.boundingBox();
		expect(bar!.y + bar!.height).toBeLessThanOrEqual(961);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
		await page.screenshot({ path: testInfo.outputPath(`1601eq-paper-${width}.png`), fullPage: true });
		await actions.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(/\/forms$/);
	});
}

test('keyboard focus clears the sticky footer on narrow forms', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 960 });
	await seedWorkspace(page);
	await page.goto(formPath);
	const secondMonth = page.locator('[id="frm1601EQ:txtRemittanceSecondMonth"]');
	await secondMonth.focus();
	const input = await secondMonth.boundingBox();
	const footer = await page.locator('footer[aria-label="Return actions"]').boundingBox();
	expect(input!.y + input!.height).toBeLessThan(footer!.y - 3);
});

test('return footer uses the same solid surface as the workspace', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(formPath);
	const footer = page.locator('footer[aria-label="Return actions"]');
	await expect(footer).toBeVisible();
	const surface = await page.getByRole('region', { name: 'BIR Form 1601EQ workspace', exact: true }).evaluate(element => getComputedStyle(element).backgroundColor);
	await expect(footer).toHaveCSS('background-color', surface);
	await expect(footer).toHaveCSS('backdrop-filter', 'none');
});

test('summary reads from the calculation breakdown to the final amount', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(formPath);
	const summary = page.getByRole('complementary', { name: 'Summary', exact: true });
	const breakdown = await summary.locator('dl').last().boundingBox();
	const total = await summary.locator('.eq-amount-due').boundingBox();
	expect(total!.y).toBeGreaterThanOrEqual(breakdown!.y + breakdown!.height);
	await expect(summary).toContainText('₱765.44');
});
