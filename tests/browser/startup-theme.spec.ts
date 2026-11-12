import { expect, test } from '@playwright/test';

for (const scenario of [
	{ stored: 'dark', system: 'light', expected: 'dark' },
	{ stored: 'light', system: 'dark', expected: 'light' },
	{ stored: 'system', system: 'dark', expected: 'dark' },
	{ stored: null, system: 'dark', expected: 'dark' },
	{ stored: 'invalid', system: 'light', expected: 'light' }
] as const) {
	test(`initial paint uses ${scenario.expected} for ${scenario.stored} preference on ${scenario.system} system`, async ({ page }) => {
		await page.emulateMedia({ colorScheme: scenario.system });
		await page.addInitScript(stored => {
			if (stored === null) localStorage.removeItem('taxmate-ph-theme');
			else localStorage.setItem('taxmate-ph-theme', stored);
		}, scenario.stored);
		// Delay app startup completely: the document must already have its theme.
		await page.route('**/*', route => route.request().resourceType() === 'script'
			? route.abort() : route.continue());
		await page.goto('/', { waitUntil: 'domcontentloaded' });
		await expect(page.locator('html')).toHaveAttribute('data-theme', scenario.expected);
		await expect(page.locator('html')).toHaveCSS('color-scheme', scenario.expected);
		await expect(page.locator('html')).toHaveCSS('background-color', scenario.expected === 'dark'
			? 'rgb(12, 20, 34)' : 'rgb(241, 248, 252)');
	});
}
