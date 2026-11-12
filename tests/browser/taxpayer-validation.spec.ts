import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

test('saves a packaged alphanumeric RDO from the taxpayer editor', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/edit`);
	const rdo = page.getByRole('textbox', { name: 'RDO code', exact: true });
	await rdo.fill('999');
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page.getByRole('alert')).toContainText('Profile not saved');
	await expect(rdo).toHaveAttribute('aria-invalid', 'true');
	await expect(page).toHaveURL(`/ebirforms/taxpayers/${taxpayerId}/edit`);
	await rdo.fill('17A');
	expect(await rdo.evaluate((input: HTMLInputElement) => input.validity.patternMismatch)).toBe(false);
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page).toHaveURL('/ebirforms/taxpayers');
});
