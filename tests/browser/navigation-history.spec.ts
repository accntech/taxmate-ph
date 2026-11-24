import { expect, test } from '@playwright/test';
import { seedWorkspace } from './fixtures';

test('topbar follows app history and clears forward history after a new visit', async ({ page }, testInfo) => {
	await seedWorkspace(page);
	await page.goto('/');

	const titlebar = page.getByRole('banner', { name: 'Window title bar' });
	const back = titlebar.getByRole('button', { name: 'Go back', exact: true });
	const forward = titlebar.getByRole('button', { name: 'Go forward', exact: true });
	const sidebar = page.getByRole('complementary', { name: 'Primary' });
	await expect(back).toBeDisabled();
	await expect(forward).toBeDisabled();

	await sidebar.getByRole('link', { name: 'Settings', exact: true }).click();
	await expect(page).toHaveURL('/settings');
	await expect(forward).toBeDisabled();
	await page.getByRole('link', { name: 'Skip to content', exact: true }).press('Enter');
	await expect(page.getByRole('main')).toBeFocused();
	await expect(page).toHaveURL('/settings');
	await back.press('Enter');
	await expect(page).toHaveURL('/');
	await expect(back).toBeDisabled();

	await forward.click();
	await expect(page).toHaveURL('/settings');
	await page.goBack();
	await expect(back).toBeDisabled();
	await expect(forward).toBeEnabled();

	await sidebar.locator('a[href="/ebirforms/taxpayers"]').click();
	await expect(page).toHaveURL('/ebirforms/taxpayers');
	await expect(back).toBeEnabled();
	await expect(forward).toBeDisabled();
	await titlebar.screenshot({ path: testInfo.outputPath('desktop-history.png') });

	await page.setViewportSize({ width: 390, height: 700 });
	await expect(back).toBeVisible();
	await expect(forward).toBeVisible();
	await titlebar.screenshot({ path: testInfo.outputPath('narrow-history.png') });
	await back.click();
	await expect(page).toHaveURL('/');
	await expect(back).toBeDisabled();
	await expect(forward).toBeEnabled();
});
