import { expect, test } from '@playwright/test';
import { formPath, seedWorkspace } from './fixtures';

for (const width of [1440, 1100, 390]) {
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
		if (width >= 1440) {
			expect(summary!.x).toBeGreaterThan(period!.x + period!.width - 1);
			expect(summary!.width).toBeCloseTo(270, 0);
		} else {
			expect(summary!.y).toBeGreaterThan(period!.y + period!.height);
		}
		await page.getByRole('button', { name: 'Add ATC row', exact: true }).click();
		await expect(page.getByRole('group', { name: 'ATC row 2', exact: true })).toBeVisible();
		await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
		const bar = await actions.boundingBox();
		expect(bar!.y + bar!.height).toBeLessThanOrEqual(961);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
		await page.screenshot({ path: testInfo.outputPath(`1601eq-libro-${width}.png`), fullPage: true });
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
	const breakdown = await summary.locator('dl').boundingBox();
	const total = await summary.locator('.eq-amount-due').boundingBox();
	expect(total!.y).toBeGreaterThanOrEqual(breakdown!.y + breakdown!.height);
	await expect(summary).toContainText('₱765.44');
});
