import { expect, test } from '@playwright/test';

const palettes = [
	{ value: 'ebirforms', label: 'eBIRForms', light: '#f1f8fc', dark: '#0c1422' },
	{ value: 'teal', label: 'Teal', light: '#f5f7f3', dark: '#111511' },
	{ value: 'catppuccin', label: 'Catppuccin', light: '#eff1f5', dark: '#171722' }
] as const;

for (const palette of palettes) {
	for (const mode of ['light', 'dark'] as const) {
		test(`${palette.label} ${mode} loads before app startup`, async ({ page }) => {
			await page.addInitScript(({ palette, mode }) => {
				localStorage.setItem('taxmate-ph-palette', palette);
				localStorage.setItem('taxmate-ph-theme', mode);
			}, { palette: palette.value, mode });
			await page.route('**/*', route => route.request().resourceType() === 'script' ? route.abort() : route.continue());
			await page.goto('/settings', { waitUntil: 'domcontentloaded' });
			await expect(page.locator('html')).toHaveAttribute('data-palette', palette.value);
			await expect(page.locator('html')).toHaveCSS('background-color', hexRgb(palette[mode]));
		});
	}
}

function hexRgb(hex: string) {
	return `rgb(${[1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`;
}

test('palette selection persists independently of mode and follows system changes', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto('/settings');
	await expect(page.getByRole('radio', { name: 'eBIRForms', exact: true })).toBeChecked();
	for (const palette of palettes) {
		await page.getByRole('radio', { name: palette.label, exact: true }).check();
		for (const mode of ['light', 'dark'] as const) {
			await page.getByRole('radio', { name: mode === 'light' ? 'Light' : 'Dark', exact: true }).check();
			await expect(page.locator('html')).toHaveAttribute('data-palette', palette.value);
			await expect(page.locator('html')).toHaveCSS('background-color', hexRgb(palette[mode]));
			await page.reload();
			await expect(page.getByRole('radio', { name: palette.label, exact: true })).toBeChecked();
			await expect(page.locator('html')).toHaveAttribute('data-theme', mode);
		}
	}
	await page.getByRole('radio', { name: 'System', exact: true }).check();
	await page.emulateMedia({ colorScheme: 'dark' });
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await page.emulateMedia({ colorScheme: 'light' });
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	await expect(page.locator('html')).toHaveAttribute('data-palette', 'catppuccin');
	await page.getByRole('button', { name: 'Reset preferences', exact: true }).click();
	await page.getByRole('button', { name: 'Reset', exact: true }).click();
	await expect(page.getByRole('radio', { name: 'eBIRForms', exact: true })).toBeChecked();
	await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'system');
	await expect.poll(() => page.evaluate(() => localStorage.getItem('taxmate-ph-palette'))).toBeNull();
});

test('invalid palette falls back and keyboard selection fits narrow screens', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 800 });
	await page.addInitScript(() => localStorage.setItem('taxmate-ph-palette', 'invalid'));
	await page.goto('/settings');
	const defaultOption = page.getByRole('radio', { name: 'eBIRForms', exact: true });
	await expect(defaultOption).toBeChecked();
	await defaultOption.focus();
	await page.keyboard.press('ArrowRight');
	await expect(page.getByRole('radio', { name: 'Teal', exact: true })).toBeChecked();
	await expect(page.locator('html')).toHaveAttribute('data-palette', 'teal');
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

function luminance(hex: string) {
	const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
		.map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
	return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}

function contrast(a: string, b: string) {
	const values = [luminance(a), luminance(b)];
	return (Math.max(...values) + .05) / (Math.min(...values) + .05);
}

test('new palettes keep small text and primary actions readable', async ({ page }, testInfo) => {
	await page.goto('/settings');
	for (const palette of palettes.filter(p => p.value !== 'teal')) {
		await page.getByRole('radio', { name: palette.label, exact: true }).check();
		for (const mode of ['Light', 'Dark']) {
			await page.getByRole('radio', { name: mode, exact: true }).check();
			const tokens = await page.evaluate(() => {
				const css = getComputedStyle(document.documentElement);
				return Object.fromEntries(['fg-muted', 'fg-subtle', 'bg', 'bg-elev', 'bg-elev-2', 'bg-hover', 'accent', 'accent-fg', 'accent-hover']
					.map(name => [name, css.getPropertyValue(`--${name}`).trim()]));
			});
			for (const text of ['fg-muted', 'fg-subtle']) {
				for (const bg of ['bg', 'bg-elev', 'bg-elev-2', 'bg-hover']) {
					expect(contrast(tokens[text], tokens[bg]), `${palette.label} ${mode}: ${text} on ${bg}`).toBeGreaterThanOrEqual(4.5);
				}
			}
			for (const accent of ['accent', 'accent-hover']) {
				expect(contrast(tokens[accent], tokens['accent-fg']), `${palette.label} ${mode}: primary action`).toBeGreaterThanOrEqual(4.5);
			}
			await page.screenshot({ path: testInfo.outputPath(`${palette.value}-${mode}.png`), animations: 'disabled' });
		}
	}
});

test('appearance keeps working when preference storage fails', async ({ page }) => {
	await page.addInitScript(() => {
		const read = Storage.prototype.getItem;
		const write = Storage.prototype.setItem;
		Storage.prototype.getItem = function(key) {
			if (key === 'taxmate-ph-theme' || key === 'taxmate-ph-palette') throw new DOMException('Blocked', 'SecurityError');
			return read.call(this, key);
		};
		Storage.prototype.setItem = function(key, value) {
			if (key === 'taxmate-ph-theme' || key === 'taxmate-ph-palette') throw new DOMException('Blocked', 'SecurityError');
			write.call(this, key, value);
		};
	});
	await page.goto('/settings');
	await expect(page.getByRole('radio', { name: 'eBIRForms', exact: true })).toBeChecked();
	await page.getByRole('radio', { name: 'Catppuccin', exact: true }).check();
	await page.getByRole('radio', { name: 'Dark', exact: true }).check();
	await expect(page.locator('html')).toHaveAttribute('data-palette', 'catppuccin');
	await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(23, 23, 34)');
});

test('appearance synchronizes between windows without changing status colors', async ({ page, context }) => {
	await page.goto('/settings');
	const other = await context.newPage();
	await other.goto('/settings');
	const statusColors = () => page.evaluate(() => {
		const css = getComputedStyle(document.documentElement);
		return ['success', 'warn', 'danger', 'info'].map(name => css.getPropertyValue(`--${name}`));
	});
	await expect.poll(async () => (await statusColors()).every(Boolean)).toBe(true);
	const before = await statusColors();
	await other.getByRole('radio', { name: 'Catppuccin', exact: true }).check();
	await expect(page.getByRole('radio', { name: 'Catppuccin', exact: true })).toBeChecked();
	expect(await statusColors()).toEqual(before);
	await other.getByRole('radio', { name: 'Dark', exact: true }).check();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await other.close();
});

for (const width of [320, 768, 1280]) {
	test(`palette controls fit at ${width}px`, async ({ page }, testInfo) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/settings');
		for (const palette of palettes) {
			await page.getByRole('radio', { name: palette.label, exact: true }).check();
			for (const mode of ['Light', 'Dark']) {
				await page.getByRole('radio', { name: mode, exact: true }).check();
				await expect(page.locator('main > section')).toHaveCSS('display', 'grid');
				expect((await page.getByText('Choose a palette for the whole workspace.', { exact: true }).boundingBox())!.width).toBeGreaterThanOrEqual(100);
				const bounds = await page.getByRole('radiogroup', { name: 'Color theme', exact: true }).boundingBox();
				expect(bounds!.x).toBeGreaterThanOrEqual(0);
				expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
				await page.screenshot({ path: testInfo.outputPath(`${palette.value}-${mode}-${width}.png`), animations: 'disabled' });
			}
		}
	});
}


test('eBIRForms follows the classic blue/red reference while Teal preserves its original palette', async ({ page }) => {
	await page.goto('/settings');
	for (const choice of [
		{ label: 'eBIRForms', mode: 'Light', accent: '#2269b5', soft: '#dff5ff' },
		{ label: 'eBIRForms', mode: 'Dark', accent: '#83c9ff', soft: '#163a54' },
		{ label: 'Teal', mode: 'Light', accent: '#00796b', soft: '#dff3eb' },
		{ label: 'Teal', mode: 'Dark', accent: '#42d6bd', soft: '#173f38' }
	]) {
		await page.getByRole('radio', { name: choice.label, exact: true }).check();
		await page.getByRole('radio', { name: choice.mode, exact: true }).check();
		await expect.poll(() => page.evaluate(() => {
			const css = getComputedStyle(document.documentElement);
			return [css.getPropertyValue('--accent').trim(), css.getPropertyValue('--accent-soft').trim()];
		})).toEqual([choice.accent, choice.soft]);
		if (choice.label === 'eBIRForms') {
			await expect(page.locator('body')).toHaveCSS('background-attachment', /^fixed(?:, fixed)*$/);
			await expect(page.locator('body')).toHaveCSS('background-image', /linear-gradient.*rgb/);
			expect(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundImage)).toContain(choice.mode === 'Light' ? 'rgb(242, 174, 186)' : 'rgb(48, 32, 48)');
		} else {
			await expect(page.locator('body')).toHaveCSS('background-attachment', /^scroll(?:, scroll)*$/);
		}
	}
});

test('theme mode switches paint directly without color fades', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto('/settings');
	for (const mode of ['Dark', 'Light', 'Dark']) {
		await page.getByRole('radio', { name: mode, exact: true }).check();
		const fadingColors = await page.evaluate(() => new Promise<string[]>(resolve => {
			requestAnimationFrame(() => resolve(document.getAnimations()
				.filter((animation): animation is CSSTransition => animation instanceof CSSTransition)
				.map(animation => animation.transitionProperty)
				.filter(property => /color|background|border|fill|stroke/.test(property))));
		}));
		expect(fadingColors).toEqual([]);
	}
});
