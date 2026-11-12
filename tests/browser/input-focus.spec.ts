import { expect, test } from '@playwright/test';
import { seedWorkspace } from './fixtures';

for (const theme of ['light', 'dark']) {
	test(`wrapped inputs have one rounded focus halo in ${theme}`, async ({ page }, testInfo) => {
		await seedWorkspace(page, theme);
		await page.goto('/design-system');
		for (const label of ['Amount due', 'TIN and branch code', 'Sheets attached', 'Email']) {
			const input = page.getByRole('textbox', { name: label, exact: true });
			await input.focus();
			await page.keyboard.press('Tab');
			await page.keyboard.press('Shift+Tab');
			await expect(input).toBeFocused();
			await expect(input).toHaveCSS('box-shadow', 'none');
			const frame = input.locator('..');
			await frame.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {}))));
			await expect(frame).not.toHaveCSS('box-shadow', 'none');
			const bounds = await frame.boundingBox();
			if (bounds) await page.screenshot({
				path: testInfo.outputPath(`${label.replaceAll(' ', '-')}-${theme}.png`),
				clip: { x: bounds.x - 6, y: bounds.y - 6, width: bounds.width + 12, height: bounds.height + 12 }
			});
		}
		const invalid = page.getByRole('textbox', { name: 'Email', exact: true });
		const frame = invalid.locator('..');
		await invalid.blur();
		await frame.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {}))));
		const restingErrorShadow = await frame.evaluate(element => getComputedStyle(element).boxShadow);
		await invalid.focus();
		await frame.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {}))));
		await expect(frame).not.toHaveCSS('box-shadow', restingErrorShadow);
	});
}
