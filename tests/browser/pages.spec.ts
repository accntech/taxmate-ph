import { expect, test } from '@playwright/test';
import { formPath, seedWorkspace, taxpayerId } from './fixtures';

const pages = [
	['home', '/'], ['settings', '/settings'], ['alphalist', '/alphalist'],
	['vat-relief', '/vat-relief'], ['design-system', '/design-system'],
	['taxpayers', '/ebirforms/taxpayers'], ['new-taxpayer', '/ebirforms/taxpayers/new'],
	['taxpayer', `/ebirforms/taxpayers/${taxpayerId}`],
	['edit-taxpayer', `/ebirforms/taxpayers/${taxpayerId}/edit`],
	['forms', `/ebirforms/taxpayers/${taxpayerId}/forms`], ['return', formPath]
];

for (const theme of ['light', 'dark']) {
for (const width of [1440, 390]) {
	for (const [name, path] of pages) {
		test(`${name} at ${width}px in ${theme} renders without errors or page overflow`, async ({ page }, testInfo) => {
			const errors: string[] = [];
			page.on('pageerror', error => errors.push(error.message));
			await page.setViewportSize({ width, height: 960 });
			await seedWorkspace(page, theme);
			await page.goto(path);
			await expect(page.locator('main')).toBeVisible();
			await expect(page.getByText('Loading taxpayer profile…', { exact: true })).toBeHidden();
			await expect(page.getByText('Loading saved form…', { exact: true })).toBeHidden();
			await page.screenshot({ path: testInfo.outputPath(`${name}-${width}-${theme}.png`), fullPage: true });
			expect(errors).toEqual([]);
			expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
		});
	}
}

}

test('profile form uses TIN, multiline address, email and telephone controls with leading-zero codes', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/edit`);
	await expect(page.getByRole('textbox', { name: 'TIN and branch code', exact: true })).toHaveValue('001-234-567-0008');
	await expect(page.getByRole('textbox', { name: 'RDO code', exact: true })).toHaveValue('040');
	await expect(page.getByRole('textbox', { name: 'ZIP code', exact: true })).toHaveValue('0123');
	await expect(page.getByRole('textbox', { name: 'Address line 1', exact: true })).toHaveJSProperty('tagName', 'TEXTAREA');
	await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toHaveAttribute('type', 'email');
	await expect(page.getByRole('textbox', { name: 'Contact number', exact: true })).toHaveAttribute('type', 'tel');
});

test('new taxpayer validation focuses the first invalid field and keeps four branch digits', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto('/ebirforms/taxpayers/new');
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page.getByRole('textbox', { name: 'Taxpayer name', exact: true })).toBeFocused();
	await expect(page.getByRole('textbox', { name: 'TIN and branch code', exact: true })).toHaveAttribute('aria-invalid', 'true');
	await page.getByRole('textbox', { name: 'TIN and branch code', exact: true }).fill('0012345670008');
	await page.getByRole('textbox', { name: 'RDO code', exact: true }).focus();
	await expect(page.getByRole('textbox', { name: 'TIN and branch code', exact: true })).toHaveValue('001-234-567-0008');
});

test('taxpayer list keeps its empty state usable', async ({ page }) => {
	await seedWorkspace(page, 'light', 'empty');
	await page.goto('/ebirforms/taxpayers');
	await expect(page.getByText('No saved taxpayers yet. Choose New taxpayer to begin.', { exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: 'New taxpayer', exact: true })).toBeVisible();
});

test('taxpayer load failure exposes a keyboard-accessible retry action', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'error');
	await page.goto('/ebirforms/taxpayers');
	const retry = page.getByRole('button', { name: 'Retry', exact: true });
	await expect(retry).toBeVisible();
	await retry.focus();
	await expect(retry).toBeFocused();
	await retry.press('Enter');
	await expect(page.getByRole('button', { name: 'Retry', exact: true })).toBeVisible();
});
