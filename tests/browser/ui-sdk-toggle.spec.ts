import { expect, test } from '@playwright/test';
import { openDesignSystemFixture, seedWorkspace } from './fixtures';

for (const theme of ['light', 'dark']) {
	test(`UI SDK toggle supports keyboard activation in ${theme} mode`, async ({ page, browserName }) => {
		await seedWorkspace(page, theme);
		await openDesignSystemFixture(page);

		const toggle = page.getByRole('button', { name: 'Pin preview', exact: true });
		await expect(toggle).toHaveAttribute('aria-pressed', 'false', { timeout: 15_000 });
		await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

		await toggle.focus();
		// WebKit uses Option+Tab to focus buttons under its default keyboard settings.
		const tab = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
		await page.keyboard.press(`Shift+${tab}`);
		await page.keyboard.press(tab);
		await expect(toggle).toBeFocused();
		await expect(toggle).not.toHaveCSS('box-shadow', 'none');

		const unpressedBackground = await toggle.evaluate((element) => getComputedStyle(element).backgroundColor);
		await page.keyboard.press('Space');
		await expect(toggle).toHaveAttribute('aria-pressed', 'true');
		await expect(toggle).not.toHaveCSS('background-color', unpressedBackground);
		await page.keyboard.press('Enter');
		await expect(toggle).toHaveAttribute('aria-pressed', 'false');
		await expect(toggle).toHaveCSS('background-color', unpressedBackground);
	});
}
