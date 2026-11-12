import { expect, test } from '@playwright/test';
import { seedWorkspace } from './fixtures';

for (const overlay of ['dialog', 'drawer']) {
	test(`${overlay} opens without focusing its close button`, async ({ page }, testInfo) => {
		await seedWorkspace(page);
		await page.goto('/design-system');
		const trigger = page.getByRole('button', { name: `Open ${overlay}`, exact: true });
		await trigger.focus();
		await page.keyboard.press('Enter');
		const panel = page.locator('dialog[open]');
		await expect(panel).toBeFocused();
		await expect(panel).toHaveCSS('outline-style', 'none');
		await expect(panel).toHaveCSS('box-shadow', 'none');
		const close = panel.locator('button[aria-label="Close"]');
		await expect(close).not.toBeFocused();
		await panel.evaluate(async el => {
			await Promise.all(el.getAnimations().map(animation => animation.finished));
		});
		await page.screenshot({ path: testInfo.outputPath(`${overlay}-initial-focus.png`) });
		await page.keyboard.press('Tab');
		await expect(close).toBeFocused();
		await expect(close).not.toHaveCSS('box-shadow', 'none');
		await page.keyboard.press('Escape');
		await expect(panel).toHaveCount(0);
		await expect(trigger).toBeFocused();
	});
}
