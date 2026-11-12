import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

for (const width of [1440, 390]) {
	for (const mode of ['new', 'edit']) {
		test(`${mode} taxpayer at ${width}px uses the compact workspace and accessible actions`, async ({ page }, testInfo) => {
			await page.setViewportSize({ width, height: 960 });
			await seedWorkspace(page);
			await page.goto(mode === 'new' ? '/ebirforms/taxpayers/new' : `/ebirforms/taxpayers/${taxpayerId}/edit`);
			const actions = page.locator('footer[aria-label="Taxpayer actions"]');
			await expect(actions.getByRole('button', { name: 'Save profile', exact: true })).toBeVisible();
			await expect(actions.getByRole('link', { name: 'Cancel', exact: true })).toBeVisible();
			await expect(actions.getByRole('button', { name: /apply to (active|current) return/i })).toHaveCount(0);
			const surface = await page.getByRole('form', { name: 'Taxpayer profile', exact: true }).evaluate(element => getComputedStyle(element).backgroundColor);
			await expect(actions).toHaveCSS('background-color', surface);
			await expect(actions).toHaveCSS('backdrop-filter', 'none');
			await expect(page.getByRole('heading', { name: mode === 'new' ? 'New taxpayer' : 'Edit taxpayer', exact: true })).toBeVisible();
			await expect(page.getByText('Required fields', { exact: true })).toHaveCount(0);
			await expect(page.getByText('Review and update the details used on your returns.', { exact: true })).toHaveCount(0);
			await expect(page.getByText('Save edits to keep this profile up to date.', { exact: true })).toHaveCount(0);
			const contact = page.getByRole('textbox', { name: 'Contact number', exact: true });
			await contact.focus();
			const control = await contact.boundingBox();
			const bar = await actions.boundingBox();
			expect(control!.y + control!.height).toBeLessThan(bar!.y - 3);
			expect(bar!.y + bar!.height).toBeLessThanOrEqual(961);
			expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
			await page.screenshot({ path: testInfo.outputPath(`${mode}-taxpayer-libro-${width}.png`), fullPage: true });
		});
	}
}

for (const mode of ['new', 'edit']) {
	test(`${mode} taxpayer still saves valid details and returns to the list`, async ({ page }) => {
		await seedWorkspace(page);
		await page.goto(mode === 'new' ? '/ebirforms/taxpayers/new' : `/ebirforms/taxpayers/${taxpayerId}/edit`);
		await page.getByRole('textbox', { name: 'Taxpayer name', exact: true }).fill('Updated Example Services');
		await page.getByRole('textbox', { name: 'TIN and branch code', exact: true }).fill('0012345670008');
		await page.getByRole('textbox', { name: 'RDO code', exact: true }).fill('040');
		await page.getByRole('button', { name: 'Save profile', exact: true }).click();
		await expect(page).toHaveURL('/ebirforms/taxpayers');
	});
}
