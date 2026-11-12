import { expect, test } from '@playwright/test';
import { seedWorkspace } from './fixtures';

for (const theme of ['light', 'dark']) {
	for (const width of [390, 1440]) {
		test(`record search has one halo and matches filter height at ${width}px in ${theme}`, async ({ page }, testInfo) => {
			await page.setViewportSize({ width, height: 960 });
			await seedWorkspace(page, theme);
			await page.goto('/ebirforms/taxpayers');
			const search = page.getByRole('searchbox', { name: 'Search taxpayers', exact: true });
			const frame = search.locator('..');
			const filter = page.getByRole('button', { name: 'Add filter', exact: true });
			await expect(search).toBeVisible();
			await expect(filter).toBeVisible();
			expect.soft((await frame.boundingBox())?.height).toBe((await filter.boundingBox())?.height);
			await search.focus();
			await page.keyboard.press('Tab');
			await page.keyboard.press('Shift+Tab');
			await expect(search).toBeFocused();
			await expect.soft(search).toHaveCSS('box-shadow', 'none');
			await expect(frame).not.toHaveCSS('box-shadow', 'none');
			await page.screenshot({ path: testInfo.outputPath(`record-search-${width}-${theme}.png`) });
			await filter.focus();
			await page.keyboard.press('Tab');
			await page.keyboard.press('Shift+Tab');
			await expect(filter).toBeFocused();
			await expect(filter).not.toHaveCSS('box-shadow', 'none');
			await filter.press('Enter');
			await expect(filter).toHaveAttribute('aria-expanded', 'true');
			await page.keyboard.press('Escape');
			await expect(filter).toBeFocused();
			await page.emulateMedia({ forcedColors: 'active' });
			await search.focus();
			await expect(frame).toHaveCSS('outline-style', 'solid');
			await expect(search).toHaveCSS('outline-style', 'none');
		});
	}
}

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
