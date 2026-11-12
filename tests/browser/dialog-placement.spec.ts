import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

for (const viewport of [{ width: 1440, height: 960 }, { width: 800, height: 360 }]) {
	test(`desktop form picker stays centered and fits a ${viewport.width} by ${viewport.height} window`, async ({ page }) => {
		await page.setViewportSize(viewport);
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await seedWorkspace(page);
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
		await page.getByRole('button', { name: 'Create return', exact: true }).click();
		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();
		const bounds = await dialog.boundingBox();
		expect(bounds).not.toBeNull();
		expect(Math.abs(bounds!.y + bounds!.height / 2 - viewport.height / 2)).toBeLessThanOrEqual(2);
		expect(Math.abs(bounds!.x + bounds!.width / 2 - viewport.width / 2)).toBeLessThanOrEqual(2);
		expect(bounds!.y).toBeGreaterThanOrEqual(14);
		expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height - 14);
		await expect(dialog.getByRole('button', { name: 'Create return', exact: true })).toBeInViewport({ ratio: 1 });
	});
}

test('mobile form picker remains a bottom sheet', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	await page.getByRole('button', { name: 'Create return', exact: true }).click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	const bounds = await dialog.boundingBox();
	expect(bounds).not.toBeNull();
	expect(Math.abs(bounds!.y + bounds!.height - 844)).toBeLessThanOrEqual(2);
	await expect(dialog.getByRole('button', { name: 'Create return', exact: true })).toBeInViewport({ ratio: 1 });
});
