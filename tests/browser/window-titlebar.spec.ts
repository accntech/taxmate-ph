import { expect, test, type Page } from '@playwright/test';
import { seedWorkspace } from './fixtures';

async function configure(page: Page, platform: string, extended = true, theme = 'light', deviceTheme: 'light' | 'dark' | null = null) {
	await seedWorkspace(page, theme);
	await page.addInitScript(({ platform, extended, deviceTheme }) => {
		const state = { fullscreen: false, nativeTheme: null as 'light' | 'dark' | null, deviceTheme, calls: [] as { command: string; args: Record<string, unknown> }[] };
		const queries = new Set<MediaQueryList>();
		const matchesDark = () => (state.nativeTheme ?? state.deviceTheme) === 'dark';
		function notify(before: boolean) {
			if (deviceTheme && before !== matchesDark()) {
				for (const query of queries) query.dispatchEvent(new MediaQueryListEvent('change', { matches: matchesDark(), media: query.media }));
			}
		}
		if (deviceTheme) {
			const matchMedia = window.matchMedia.bind(window);
			window.matchMedia = query => {
				const result = matchMedia(query);
				if (query === '(prefers-color-scheme: dark)') {
					Object.defineProperty(result, 'matches', { get: matchesDark });
					queries.add(result);
				}
				return result;
			};
			Object.assign(window, { __setDeviceTheme: (theme: 'light' | 'dark') => {
				const before = matchesDark();
				state.deviceTheme = theme;
				notify(before);
			} });
		}
		const callbacks = new Map<number, (payload: unknown) => void>();
		Object.assign(window, { isTauri: true, __chromeTest: state,
			__TAURI_INTERNALS__: {
				metadata: { currentWindow: { label: 'main' }, currentWebview: { label: 'main' } },
				transformCallback: (callback: (payload: unknown) => void) => {
					const id = callbacks.size + 1;
					callbacks.set(id, callback);
					return id;
				},
				invoke: async (command: string, args: Record<string, unknown> = {}) => {
					state.calls.push({ command, args });
					if (command === 'desktop_platform') return platform;
					if (command === 'window_ready' || command === 'plugin:window|set_theme') {
						const before = matchesDark();
						state.nativeTheme = command === 'window_ready'
							? (args.followSystem ? null : args.dark ? 'dark' : 'light')
							: args.value as 'light' | 'dark' | null;
						notify(before);
					}
					if (command === 'plugin:window|is_fullscreen') return state.fullscreen;
					if (command === 'window_chrome_sync') return { extended, height: 48, leftInset: 0, rightInset: 138 };
					if (command === 'list_taxpayer_profiles' || command === 'list_submitted_returns') return [];
					if (command === 'plugin:event|listen') return 1;
					return undefined;
				}
			}
		});
	}, { platform, extended, deviceTheme });
}

for (const platform of ['macos', 'windows', 'linux']) {
	test(`${platform} reveals the window with the saved dark appearance`, async ({ page }) => {
		await configure(page, platform, true, 'dark');
		await page.goto('/');
		await expect.poll(() => page.evaluate(() => {
			const state = (window as unknown as { __chromeTest: { calls: { command: string; args: Record<string, unknown> }[] } }).__chromeTest;
			return state.calls.find(call => call.command === 'window_ready')?.args;
		})).toEqual({ dark: true, color: '#0c1422', followSystem: false });
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	});
}

for (const platform of ['macos', 'windows', 'linux']) {
	test(`${platform} keeps the skip link off the caption until keyboard focus`, async ({ page }) => {
		await configure(page, platform);
		await page.goto('/');
		await expect(page.getByRole('banner', { name: 'Window title bar' })).toBeVisible();
		const skip = page.getByRole('link', { name: 'Skip to content', exact: true });
		await expect.poll(async () => {
			const box = (await skip.boundingBox())!;
			return box.y + box.height;
		}).toBeLessThanOrEqual(0);
		await page.keyboard.press('Tab');
		await expect(skip).toBeFocused();
		await expect.poll(async () => (await skip.boundingBox())!.y).toBeGreaterThanOrEqual(48);
		await page.keyboard.press('Enter');
		await expect(page.locator('main')).toBeFocused();
	});

	test(`${platform} reserves native caption space and keeps the shell accessible`, async ({ page }, testInfo) => {
		await configure(page, platform);
		await page.goto('/');
		const bar = page.getByRole('banner', { name: 'Window title bar' });
		await expect(bar).toBeVisible();
		await expect(bar.getByRole('button', { name: 'Toggle sidebar', exact: true })).toBeVisible();
		await expect(page.locator('[data-app-topbar]')).toHaveCount(1);
		const sidebar = page.getByRole('complementary', { name: 'Primary' });
		await expect(sidebar.getByText('TaxMate PH', { exact: true })).toHaveCount(0);
		await expect(sidebar.getByText('Local compliance workspace', { exact: true })).toHaveCount(0);
		for (const width of [800, 390]) {
			await page.setViewportSize({ width, height: 700 });
			await expect.poll(async () => (await bar.boundingBox())?.height).toBe(48);
			const toggle = (await bar.getByRole('button', { name: 'Toggle sidebar', exact: true }).boundingBox())!;
			expect(toggle.x).toBeGreaterThanOrEqual(platform === 'macos' ? 88 : 16);
			expect(toggle.x + toggle.width).toBeLessThanOrEqual(width - (platform === 'windows' ? 138 : 16));
			const navbar = bar;
			await expect.poll(async () => (await navbar.boundingBox())!.x).toBe(0);
			await expect.poll(async () => (await navbar.boundingBox())!.width).toBe(width);
			await page.getByRole('button', { name: 'Toggle sidebar', exact: true }).click();
			await expect(page.getByRole('complementary', { name: 'Primary' })).toBeVisible();
			const navigationBounds = (await navbar.boundingBox())!;
			expect((await page.locator('.sidebar').boundingBox())!.y).toBeGreaterThanOrEqual(navigationBounds.y + navigationBounds.height);
			if (width < 768) await page.keyboard.press('Escape');
			await page.screenshot({ path: testInfo.outputPath(`${platform}-${width}.png`) });
		}
		await page.evaluate(() => {
			(window as unknown as { __chromeTest: { fullscreen: boolean } }).__chromeTest.fullscreen = true;
			document.dispatchEvent(new Event('fullscreenchange'));
		});
		await expect.poll(async () => (await bar.boundingBox())?.height).toBe(48);
		if (platform === 'macos') await expect(bar).toHaveCSS('padding-left', '16px');
	});
}

test('Windows SDK failure keeps a usable header with standard frame spacing', async ({ page }) => {
	await configure(page, 'windows', false);
	await page.goto('/');
	await expect(page.getByRole('banner', { name: 'Window title bar' })).toHaveCSS('height', '48px');
	await expect(page.locator('html')).not.toHaveAttribute('data-windows-titlebar');
});

test('macOS native appearance follows the selected app theme', async ({ page }) => {
	await configure(page, 'macos');
	await page.goto('/');
	await expect(page.getByRole('banner', { name: 'Window title bar' })).toBeVisible();
	await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
	await expect.poll(() => page.evaluate(() => {
		const calls = (window as unknown as { __chromeTest: { calls: { command: string; args: { value?: string } }[] } }).__chromeTest.calls;
		return calls.filter(call => call.command === 'plugin:window|set_theme').at(-1)?.args.value;
	})).toBe('dark');
});

test('macOS scroll backing follows dark and light app backgrounds', async ({ page }) => {
	await configure(page, 'macos');
	await page.goto('/');
	await expect(page.locator('html')).toHaveAttribute('data-tauri-platform', 'macos');
	for (const theme of ['dark', 'light']) {
		await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
		await expect.poll(() => page.evaluate(() => {
			const calls = (window as unknown as { __chromeTest: { calls: { command: string; args: { color?: string } }[] } }).__chromeTest.calls;
			return calls.filter(call => call.command === 'window_background_sync').at(-1)?.args.color;
		})).toBe(theme === 'dark' ? '#0c1422' : '#f1f8fc');
	}
});

test('browser preview uses the same single navigation row without caption insets', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto('/');
	await expect(page.getByRole('button', { name: 'Toggle sidebar', exact: true })).toBeVisible();
	await expect(page.getByRole('banner', { name: 'Window title bar' })).toBeVisible();
	await expect(page.locator('.sidebar')).toHaveCSS('top', '48px');
});

test('macOS scroll backing follows palette changes within light mode', async ({ page }) => {
	await configure(page, 'macos');
	await page.goto('/settings');
	await expect(page.locator('html')).toHaveAttribute('data-tauri-platform', 'macos');
	await page.getByRole('radio', { name: 'Catppuccin', exact: true }).check();
	await expect.poll(() => page.evaluate(() => {
		const calls = (window as unknown as { __chromeTest: { calls: { command: string; args: { color?: string } }[] } }).__chromeTest.calls;
		return calls.filter(call => call.command === 'window_background_sync').at(-1)?.args.color;
	})).toBe('#eff1f5');
});


for (const platform of ['macos', 'windows', 'linux']) {
	for (const device of ['light', 'dark'] as const) {
		test(`${platform} System mode releases an explicit override on a ${device} device`, async ({ page }) => {
			await configure(page, platform, true, 'system', device);
			await page.goto('/settings');
			await expect(page.locator('html')).toHaveAttribute('data-tauri-platform', platform);
			const explicit = device === 'light' ? 'dark' : 'light';
			await page.getByRole('radio', { name: 'Teal', exact: true }).check();
			await page.getByRole('radio', { name: explicit === 'dark' ? 'Dark' : 'Light', exact: true }).check();
			await expect.poll(() => page.evaluate(() =>
				(window as unknown as { __chromeTest: { nativeTheme: string | null } }).__chromeTest.nativeTheme
			)).toBe(explicit);
			await page.getByRole('radio', { name: 'System', exact: true }).check();
			await expect(page.locator('html')).toHaveAttribute('data-theme', device);
			await expect.poll(() => page.evaluate(() =>
				(window as unknown as { __chromeTest: { nativeTheme: string | null } }).__chromeTest.nativeTheme
			)).toBeNull();
			await expect(page.locator('html')).toHaveAttribute('data-palette', 'teal');
			await page.evaluate(mode => {
				(window as unknown as { __setDeviceTheme: (mode: string) => void }).__setDeviceTheme(mode);
			}, explicit);
			await expect(page.locator('html')).toHaveAttribute('data-theme', explicit);
			await page.reload();
			await expect(page.getByRole('radio', { name: 'System', exact: true })).toBeChecked();
			await expect.poll(() => page.evaluate(() => {
				const calls = (window as unknown as { __chromeTest: { calls: { command: string; args: Record<string, unknown> }[] } }).__chromeTest.calls;
				return calls.find(call => call.command === 'window_ready')?.args.followSystem;
			})).toBe(true);
		});
	}
}
