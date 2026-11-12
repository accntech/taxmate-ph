import { expect, test } from '@playwright/test';

for (const width of [320, 768, 1280]) {
	test(`appearance uses preview cards and accessible mode controls at ${width}px`, async ({ page }, testInfo) => {
		await page.setViewportSize({ width, height: 1000 });
		await page.goto('/settings');
		const themes = page.getByRole('radiogroup', { name: 'Color theme', exact: true });
		const modes = page.getByRole('radiogroup', { name: 'Color mode', exact: true });
		await expect(modes).toBeVisible();
		await expect(themes.getByRole('radio')).toHaveCount(3);
		await expect(modes.getByRole('radio')).toHaveCount(3);
		await expect(page.getByRole('group', { name: 'Sidebar default', exact: true })).toHaveCount(0);
		await expect(page.getByText('Show the full navigation rail or a compact icon rail.', { exact: true })).toHaveCount(0);
		for (const [group, labels] of [[themes, ['eBIRForms', 'Teal', 'Catppuccin']], [modes, ['Light', 'System', 'Dark']]] as const) {
			for (const label of labels) {
				const radio = group.getByRole('radio', { name: label, exact: true });
				await radio.check();
				await expect(radio).toBeChecked();
			}
			const bounds = (await group.boundingBox())!;
			expect(bounds.x).toBeGreaterThanOrEqual(0);
			expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
			if (width === 1280) expect(bounds.width).toBeGreaterThan(600);
		}
		await modes.getByRole('radio', { name: 'Light', exact: true }).focus();
		await page.keyboard.press('ArrowRight');
		await expect(modes.getByRole('radio', { name: 'System', exact: true })).toBeChecked();
		await page.reload();
		await expect(modes.getByRole('radio', { name: 'System', exact: true })).toBeChecked();
		await expect(themes.getByRole('radio', { name: 'Catppuccin', exact: true })).toBeChecked();
		await page.screenshot({ path: testInfo.outputPath(`appearance-${width}.png`), animations: 'disabled', fullPage: true });
	});
}
