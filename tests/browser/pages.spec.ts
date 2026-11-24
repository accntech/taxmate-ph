import { expect, test } from '@playwright/test';
import { formPath, seedWorkspace, taxpayerId } from './fixtures';

const taxpayerPath = `/ebirforms/taxpayers/${taxpayerId}`;
const pages = [
	{ path: '/', heading: 'Tax workspaces' },
	{ path: '/settings', heading: 'Settings', dark: true },
	{ path: '/alphalist', heading: 'Alphalist' },
	{ path: '/vat-relief', heading: 'VAT Relief' },
	{ path: '/ebirforms/taxpayers', heading: 'eBIRForms', dark: true },
	{ path: '/ebirforms/taxpayers/new', heading: 'New taxpayer' },
	{ path: taxpayerPath, heading: 'Example Services Corporation' },
	{ path: `${taxpayerPath}/edit`, heading: 'Edit taxpayer' },
	{ path: `${taxpayerPath}/forms`, heading: 'Tax Returns' },
	{ path: formPath, region: 'BIR Form 1601EQ workspace', dark: true }
];

for (const route of pages) {
	for (const theme of route.dark ? ['light', 'dark'] : ['light']) {
		for (const width of [1440, 390]) {
			test(`${route.heading ?? route.region} at ${width}px in ${theme} renders without errors or overflow`, async ({ page }) => {
				const errors: string[] = [];
				page.on('pageerror', error => errors.push(error.message));
				await page.setViewportSize({ width, height: 960 });
				await seedWorkspace(page, theme);
				const response = await page.goto(route.path);
				expect(response?.ok()).toBe(true);
				const main = page.getByRole('main');
				const content = route.region
					? main.getByRole('region', { name: route.region, exact: true })
					: main.getByRole('heading', { name: route.heading, level: 1, exact: true });
				await expect(content).toBeVisible({ timeout: 15_000 });
				expect(errors).toEqual([]);
				expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
			});
		}
	}
}

test('the design system is not an application route', async ({ page }) => {
	const response = await page.goto('/design-system');
	expect(response?.status()).toBe(404);
});

test('profile form uses TIN, multiline address, email and telephone controls with leading-zero codes', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/edit`);
	await expect(page.getByRole('textbox', { name: 'TIN and branch code', exact: true })).toHaveValue('001-234-567-00008');
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

test('keyboard retry recovers from an initial taxpayer load failure', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'error-once');
	await page.goto('/ebirforms/taxpayers');
	const retry = page.getByRole('button', { name: 'Retry', exact: true });
	await expect(retry).toBeVisible();
	await retry.focus();
	await expect(retry).toBeFocused();
	await retry.press('Enter');
	await expect(page.getByRole('row', { name: /Example Services Corporation/ })).toBeVisible();
	await expect(retry).toBeHidden();
});
