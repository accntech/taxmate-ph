import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

test('tax returns search uses the standard field focus halo', async ({ page }) => {
	await seedWorkspace(page, 'dark');
	await page.addInitScript(() => localStorage.setItem('taxmate-ph-palette', 'catppuccin'));
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	const search = page.getByRole('searchbox', { name: 'Search tax returns' });
	const frame = page.locator('label').filter({ has: search });
	await search.focus();
	await page.keyboard.press('Shift+Tab');
	await page.keyboard.press('Tab');
	await expect(search).toBeFocused();
	const expectedHalo = await frame.evaluate(el => {
		const sample = document.createElement('span');
		sample.style.boxShadow = '0 0 0 3px var(--field-focus-halo)';
		el.append(sample);
		const halo = getComputedStyle(sample).boxShadow;
		sample.remove();
		return halo;
	});
	await expect(frame).toHaveCSS('box-shadow', expectedHalo);
	await expect(search).toHaveCSS('box-shadow', 'none');
	await page.emulateMedia({ forcedColors: 'active' });
	await expect(frame).toHaveCSS('outline-style', 'solid');
	await expect(search).toHaveCSS('outline-style', 'none');
});

for (const { palette, input, header, hover } of [
	{ palette: 'catppuccin', input: 'rgb(21, 21, 32)', header: 'rgb(30, 30, 46)', hover: 'rgb(35, 35, 53)' },
	{ palette: 'teal', input: 'rgb(20, 22, 21)', header: 'rgb(28, 31, 30)', hover: 'rgb(36, 40, 38)' }
]) {
	test(`${palette} returns table uses matching dark surfaces`, async ({ page }) => {
		await seedWorkspace(page, 'dark');
		await page.addInitScript(value => localStorage.setItem('taxmate-ph-palette', value), palette);
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
		const search = page.getByRole('searchbox', { name: 'Search tax returns' });
		await expect(page.locator('label').filter({ has: search })).toHaveCSS('background-color', input);
		const table = page.getByRole('table');
		await expect(table.locator('thead')).toHaveCSS('background-color', header);
		const row = table.getByRole('row').filter({ hasText: 'BIR Form 1601EQ' });
		await row.hover();
		await expect(row).toHaveCSS('background-color', hover);
	});
}

test('forms storyboard supports cancel, create, open, and back navigation', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	await page.getByRole('button', { name: 'Create return', exact: true }).click();
	await page.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(page.getByRole('dialog')).toBeHidden();
	await expect(page.getByRole('row')).toHaveCount(2);
	await page.getByRole('button', { name: 'Create return', exact: true }).click();
	await page.getByRole('combobox', { name: 'Search BIR forms' }).fill('1601EQ');
	await page.getByRole('option').click();
	await expect(page.getByRole('heading', { name: /^Quarterly Remittance Return/ })).toBeVisible();
	await page.getByRole('link', { name: '← Back to forms', exact: true }).click();
	await expect(page.getByRole('row')).toHaveCount(2);
	await page.locator('a[href*="review-return"]').filter({ hasText: 'Edit' }).click();
	await expect(page.getByRole('textbox', { name: 'Year', exact: true })).toHaveValue('2026');
	await page.getByRole('link', { name: '← Back to forms', exact: true }).click();
	await page.getByRole('link', { name: '← Back to taxpayers', exact: true }).click();
	await expect(page).toHaveURL(/\/ebirforms\/taxpayers$/);
});
