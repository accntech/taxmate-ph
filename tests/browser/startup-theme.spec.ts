import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

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
			? 'rgb(21, 23, 27)' : 'rgb(241, 248, 252)');
	});
}

test('reload waits for StyleX before showing the app', async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.setItem('taxmate-ph-theme', 'dark');
		localStorage.setItem('taxmate-ph-palette', 'catppuccin');
		function sampleFirstVisibleFrame() {
			const row = document.querySelector('.sidebar a[aria-current="page"]');
			if (row?.getClientRects().length && getComputedStyle(row).visibility === 'visible') {
				document.documentElement.dataset.firstNavDisplay = getComputedStyle(row).display;
				return;
			}
			requestAnimationFrame(sampleFirstVisibleFrame);
		}
		requestAnimationFrame(sampleFirstVisibleFrame);
	});
	await page.goto('/');
	const navigation = page.locator('.sidebar a[aria-current="page"]');
	await expect(navigation).toHaveCSS('display', 'grid', { timeout: 15_000 });
	await expect(page.locator('html')).toHaveAttribute('data-first-nav-display', 'grid');

	let releaseStyles = () => {};
	const stylesReady = new Promise<void>(resolve => { releaseStyles = resolve; });
	const isStyleX = (url: URL) => url.pathname === '/virtual:stylex.css';
	await page.route(isStyleX, async route => {
		await stylesReady;
		await route.continue();
	});

	try {
		const stylesheetRequested = page.waitForRequest(request => isStyleX(new URL(request.url())));
		await page.reload({ waitUntil: 'commit' });
		await stylesheetRequested;
		// Give the app a paint opportunity while the stylesheet is still held.
		await page.evaluate(() => new Promise(resolve =>
			requestAnimationFrame(() => requestAnimationFrame(resolve))));
		await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(17, 17, 27)');
		await expect(page.locator('main')).toBeHidden();
	} finally {
		releaseStyles();
	}

	await expect(page.locator('html')).toHaveAttribute('data-first-nav-display', 'grid');
	await expect(page.getByRole('heading', { name: 'Tax workspaces' })).toBeVisible();
});

test('StyleX refreshes through a stylesheet link while opening Form 1701v2018', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'loaded', {
		taxpayerClassification: 'I',
		taxpayerType: 'professional'
	});
	const [stylesheet] = await Promise.all([
		page.waitForResponse(response => {
			const url = new URL(response.url());
			return url.pathname === '/virtual:stylex.css' && url.searchParams.has('t');
		}),
		page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1701v2018?new=true`)
	]);
	expect(stylesheet.request().resourceType()).toBe('stylesheet');
	expect(stylesheet.ok()).toBe(true);
	await expect(page.getByRole('region', { name: 'BIR Form 1701v2018 workspace' })).toBeVisible({ timeout: 15_000 });
	await expect(page.getByRole('button', { name: 'Save draft' })).toBeEnabled();
});
