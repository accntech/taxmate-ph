import { expect, test, type Locator } from '@playwright/test';
import { seedWorkspace } from './fixtures';

async function settledStyle(surface: Locator) {
	return surface.evaluate(async element => {
		getComputedStyle(element).boxShadow;
		await Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => {})));
		const style = getComputedStyle(element);
		return { border: style.borderTopColor, background: style.backgroundColor, shadow: style.boxShadow.replace(/rgba\(0, 0, 0, 0\) 0px 0px 0px 0px, ?/g, '') };
	});
}

for (const theme of ['light', 'dark']) {
	test(`all form focus surfaces match the input in ${theme}`, async ({ page }, testInfo) => {
		await seedWorkspace(page, theme);
		// Keep the mounted fixture stable if another workspace task triggers Vite HMR.
		await page.routeWebSocket('**/*', socket => socket.close());
		await page.goto('/design-system');
		await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
		await page.evaluate(async () => {
			const fixtureModule = '/src/tests/fixtures/mount-form-focus.ts';
			(await import(/* @vite-ignore */ fixtureModule)).mountFormFocus();
		});
		const fixture = page.getByRole('region', { name: 'Form focus fixture' });
		const reference = fixture.getByRole('textbox', { name: 'Reference input', exact: true });
		let normalFocus = { border: '', background: '', shadow: '' };
		for (const invalid of [false, true]) {
			if (invalid) await fixture.getByRole('button', { name: 'Toggle field errors' }).click();
			await reference.focus();
			const focused = await settledStyle(reference.locator('..'));
			if (!invalid) normalFocus = focused;
			await reference.blur();
			const resting = await settledStyle(reference.locator('..'));
			const controls = [
				fixture.getByLabel('Password input', { exact: true }),
				fixture.getByRole('textbox', { name: 'Number input', exact: true }),
				fixture.getByRole('textbox', { name: 'Currency input', exact: true }),
				fixture.getByRole('textbox', { name: 'TIN input', exact: true }),
				fixture.getByRole('combobox', { name: 'Period select', exact: true }),
				fixture.getByRole('button', { name: 'Primitive select', exact: true }),
				fixture.getByRole('textbox', { name: 'Notes textarea', exact: true }),
				fixture.getByRole('radiogroup', { name: 'Declaration' }).getByRole('radio', { name: 'No', exact: true }),
				fixture.getByRole('combobox', { name: 'ATC', exact: true })
			];
			for (const control of controls) {
				await control.focus();
				await page.keyboard.press('Tab');
				await page.keyboard.press('Shift+Tab');
				await expect(control).toBeFocused();
				const frame = await control.evaluate(el => el.matches('input:not([type=password])')) ? control.locator('..') : control;
				const actual = await settledStyle(frame);
				expect(actual.shadow, await control.getAttribute('aria-label') || await control.getAttribute('id') || 'control').toBe(focused.shadow);
				if (await control.getAttribute('type') === 'radio') await expect(frame).toHaveCSS('outline-color', focused.border);
				else {
					expect(actual.border).toBe(focused.border);
					expect(actual.background).toBe(focused.background);
				}
				await control.hover();
				expect((await settledStyle(frame)).shadow).toBe(focused.shadow);
				await page.mouse.move(0, 0);
				const bounds = await frame.boundingBox();
				if (bounds) await page.screenshot({
					path: testInfo.outputPath(`focus-${theme}-${invalid ? 'invalid' : 'valid'}-${controls.indexOf(control)}.png`),
					clip: { x: bounds.x - 5, y: bounds.y - 5, width: bounds.width + 10, height: bounds.height + 10 }
				});
				await control.blur();
				if (invalid) expect((await settledStyle(frame)).shadow).toBe(resting.shadow);
			}
		}
		const toggle = fixture.getByRole('button', { name: 'Compact', exact: true });
		await toggle.focus();
		expect(await settledStyle(toggle)).toEqual(normalFocus);
		const atc = fixture.getByRole('combobox', { name: 'ATC', exact: true });
		await atc.focus();
		await atc.press('Enter');
		const search = page.getByPlaceholder('Search code or income', { exact: true });
		await expect(search).toBeFocused();
		expect(await settledStyle(search.locator('..'))).toEqual(normalFocus);
		await expect(search).toHaveCSS('box-shadow', 'none');
		await search.press('Escape');
		await expect(atc).toBeFocused();
		await page.emulateMedia({ forcedColors: 'active' });
		for (const control of [reference, fixture.getByLabel('Password input', { exact: true }), fixture.getByRole('combobox', { name: 'Period select', exact: true }), fixture.getByRole('button', { name: 'Primitive select', exact: true }), fixture.getByRole('textbox', { name: 'Notes textarea', exact: true }), atc]) {
			await control.focus();
			await expect(control).toHaveCSS('outline-style', 'solid');
		}
		const radio = fixture.getByRole('radiogroup', { name: 'Declaration' }).getByRole('radio', { name: 'No', exact: true });
		await radio.focus();
		await expect(radio).toHaveCSS('outline-style', 'none');
		await expect(radio.locator('..')).toHaveCSS('outline-style', 'solid');
		await expect(radio.locator('..')).toHaveCSS('border-radius', '50%');
		await page.screenshot({ path: testInfo.outputPath(`form-focus-${theme}.png`), fullPage: true });
	});
}
