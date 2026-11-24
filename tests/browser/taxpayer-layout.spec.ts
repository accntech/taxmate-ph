import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

for (const width of [1440, 390]) {
	for (const mode of ['new', 'edit']) {
		test(`${mode} taxpayer at ${width}px uses the compact workspace and accessible actions`, async ({ page }, testInfo) => {
			await page.setViewportSize({ width, height: 960 });
			await seedWorkspace(page);
			await page.goto(mode === 'new' ? '/ebirforms/taxpayers/new' : `/ebirforms/taxpayers/${taxpayerId}/edit`);
			const actions = page.locator('footer[aria-label="Taxpayer actions"]');
			await expect(actions.getByRole('button', { name: 'Save profile', exact: true })).toBeVisible();
			await expect(actions.getByRole('link', { name: 'Cancel', exact: true })).toBeVisible();
			await expect(actions.getByRole('button', { name: /apply to (active|current) return/i })).toHaveCount(0);
			const surface = await page.getByRole('form', { name: 'Taxpayer profile', exact: true }).evaluate(element => getComputedStyle(element).backgroundColor);
			await expect(actions).toHaveCSS('background-color', surface);
			await expect(actions).toHaveCSS('backdrop-filter', 'none');
			await expect(page.getByRole('heading', { name: mode === 'new' ? 'New taxpayer' : 'Edit taxpayer', exact: true })).toBeVisible();
			await expect(page.getByText('Required fields', { exact: true })).toHaveCount(0);
			await expect(page.getByText('Review and update the details used on your returns.', { exact: true })).toHaveCount(0);
			await expect(page.getByText('Save edits to keep this profile up to date.', { exact: true })).toHaveCount(0);
			const contact = page.getByRole('textbox', { name: 'Contact number', exact: true });
			await contact.focus();
			const control = await contact.boundingBox();
			const bar = await actions.boundingBox();
			expect(control!.y + control!.height).toBeLessThan(bar!.y - 3);
			expect(bar!.y + bar!.height).toBeLessThanOrEqual(961);
			expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
			await page.screenshot({ path: testInfo.outputPath(`${mode}-taxpayer-libro-${width}.png`), fullPage: true });
		});
	}
}

test('classification pickers fit the profile grid and stay usable after resizing', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {
		taxpayerClassification: 'I', psocCode: '4311', psicCode: '82221'
	});
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/edit`);
	const pickers = [
		{ label: 'Occupation code (PSOC)', selected: '4311', search: 'Search code or occupation', next: '2411' },
		{ label: 'PSIC code', selected: '82221', search: 'Search code or industry', next: '47913' }
	];

	for (const width of [640, 390]) {
		await page.setViewportSize({ width, height: 900 });
		for (const { label, selected } of pickers) {
			const trigger = page.getByRole('combobox', { name: label, exact: true });
			await expect(trigger).toContainText(selected);
			await expect.poll(() => trigger.evaluate(button => {
				const field = button.closest('.classification-picker')!.getBoundingClientRect();
				const bounds = button.getBoundingClientRect();
				return Math.abs(bounds.width - field.width);
			}), `${label} fits its grid cell at ${width}px`).toBeLessThan(1);
		}
	}

	for (const { label, search, next } of pickers) {
		const trigger = page.getByRole('combobox', { name: label, exact: true });
		await trigger.evaluate(button => button.scrollIntoView({ block: 'center', behavior: 'instant' }));
		await trigger.click();
		const input = page.getByPlaceholder(search, { exact: true });
		await expect(input).toBeFocused();
		await input.fill(next);
		await expect(page.getByRole('option', { name: new RegExp(`^${next} `) })).toBeInViewport({ ratio: 1 });
		await input.press('Enter');
		await expect(trigger).toContainText(next);
	}
});
