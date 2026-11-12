import { expect, test } from '@playwright/test';
import { seedWorkspace } from './fixtures';

for (const width of [1440, 390]) {
	test(`dialog animates opening and closing at ${width}px`, async ({ page }, testInfo) => {
		await page.setViewportSize({ width, height: 960 });
		await seedWorkspace(page);
		await page.goto('/design-system');
		const trigger = page.getByRole('button', { name: 'Open dialog', exact: true });
		await trigger.scrollIntoViewIfNeeded();
		await trigger.evaluate((el: HTMLButtonElement) => { el.focus(); el.click(); });
		const dialog = page.locator('dialog').first();
		const opening = await dialog.evaluate(el => {
			getComputedStyle(el).opacity;
			return el.getAnimations().map(a => (a as CSSTransition).transitionProperty);
		});
		expect(opening).toContain('opacity');
		expect(opening).toContain(width < 640 ? 'translate' : 'scale');
		await dialog.evaluate(async el => {
			await Promise.all(el.getAnimations().map(a => a.finished));
		});
		await page.screenshot({ path: testInfo.outputPath('dialog-open.png') });
		for (const dismissal of ['cancel', 'escape', 'backdrop']) {
			if (dismissal !== 'cancel') {
				await trigger.evaluate((el: HTMLButtonElement) => { el.focus(); el.click(); });
				await dialog.evaluate(async el => { await Promise.all(el.getAnimations().map(a => a.finished)); });
			}
			if (dismissal === 'escape') await page.keyboard.press('Escape');
			else if (dismissal === 'backdrop') await page.mouse.click(5, 5);
			else await dialog.getByRole('button', { name: 'Cancel', exact: true }).evaluate((el: HTMLButtonElement) => { el.focus(); el.click(); });
			const closing = await dialog.evaluate(el => {
				getComputedStyle(el).opacity;
				return el.getAnimations().map(a => (a as CSSTransition).transitionProperty);
			});
			expect(closing, dismissal).toContain('opacity');
			await expect(dialog).toBeHidden();
			await expect(trigger).toBeFocused();
		}
	});
}

test('dialog skips motion when reduced motion is requested', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await seedWorkspace(page);
	await page.goto('/design-system');
	await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
	const dialog = page.locator('dialog').first();
	await expect(dialog).toBeVisible();
	expect(await dialog.evaluate(el => el.getAnimations().length)).toBe(0);
	await page.keyboard.press('Escape');
	await expect(dialog).toBeHidden();
});

test('dialog can reopen during its exit', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto('/design-system');
	const trigger = page.getByRole('button', { name: 'Open dialog', exact: true });
	await trigger.click();
	const dialog = page.locator('dialog').first();
	await dialog.evaluate(async el => { await Promise.all(el.getAnimations().map(a => a.finished)); });
	await dialog.getByRole('button', { name: 'Cancel', exact: true }).evaluate((el: HTMLButtonElement) => el.click());
	await trigger.evaluate((el: HTMLButtonElement) => el.click());
	await dialog.evaluate(async el => { await Promise.all(el.getAnimations().map(a => a.finished)); });
	await expect(dialog).toHaveJSProperty('open', true);
	await expect(dialog).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(dialog).toBeHidden();
});
