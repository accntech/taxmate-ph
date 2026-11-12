import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

const tablePath = `/ebirforms/taxpayers/${taxpayerId}/forms`;

test('form command filters, handles no matches, and creates with the keyboard', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(tablePath);
	await page.getByRole('button', { name: 'Create form', exact: true }).click();
	const search = page.getByRole('combobox', { name: 'Search BIR forms' });
	await expect(search).toBeFocused();
	for (const query of ['1601eq', 'quarterly remittance', 'withholding tax']) {
		await search.fill(query);
		await expect(page.getByRole('option')).toHaveCount(1);
	}
	await search.fill('nonexistent');
	await expect(page.getByText('No matching forms')).toBeVisible();
	await search.press('Enter');
	await expect(page.getByRole('dialog')).toBeVisible();
	await search.fill('1601');
	await search.press('ArrowDown');
	await search.press('Enter');
	await expect(page.getByRole('heading', { name: 'BIR Form 1601EQ', exact: true })).toBeVisible();
	await page.getByRole('link', { name: '← Back to forms', exact: true }).click();
	await expect(page.getByRole('row')).toHaveCount(3);
});

for (const theme of ['light', 'dark']) {
	for (const width of [1440, 390]) {
		test(`form command resets and dismisses at ${width}px in ${theme}`, async ({ page }, testInfo) => {
			await page.setViewportSize({ width, height: 900 });
			await seedWorkspace(page, theme);
			await page.goto(tablePath);
			const trigger = page.getByRole('button', { name: 'Create form', exact: true });
			await trigger.click();
			const search = page.getByRole('combobox', { name: 'Search BIR forms' });
			await expect(search).toBeFocused();
			await expect(page.getByRole('option')).toBeInViewport();
			const dialog = page.getByRole('dialog');
			const searchBox = await search.boundingBox();
			const dialogBox = await dialog.boundingBox();
			expect(searchBox!.y - dialogBox!.y).toBeLessThanOrEqual(24);
			await expect(dialog.getByRole('button', { name: 'Create form', exact: true })).toBeVisible();
			// The entire 3px soft focus ring must fit every clipping ancestor.
			expect(await search.evaluate(input => {
				const rect = input.getBoundingClientRect();
				for (let parent = input.parentElement; parent; parent = parent.parentElement) {
					const style = getComputedStyle(parent);
					const bounds = parent.getBoundingClientRect();
					if (/(auto|scroll|hidden|clip)/.test(style.overflowY) && (rect.top - 3 < bounds.top || rect.bottom + 3 > bounds.bottom)) return false;
					if (/(auto|scroll|hidden|clip)/.test(style.overflowX) && (rect.left - 3 < bounds.left || rect.right + 3 > bounds.right)) return false;
				}
				return true;
			})).toBe(true);
			await page.screenshot({ path: testInfo.outputPath(`form-command-${theme}-${width}.png`), animations: 'disabled' });
			expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
			await search.fill('nonexistent');
			await search.press('Escape');
			await expect(page.getByRole('dialog')).toBeHidden();
			await expect(trigger).toBeFocused();
			await trigger.click();
			await expect(search).toHaveValue('');
			await page.getByRole('option').click();
			await expect(page.getByRole('heading', { name: 'BIR Form 1601EQ', exact: true })).toBeVisible();
		});
	}
}

for (const viewport of [{ width: 800, height: 360 }, { width: 600, height: 320 }]) {
	test(`command footer stays visible in a short ${viewport.width}px window`, async ({ page }) => {
		await page.setViewportSize(viewport);
		await seedWorkspace(page);
		await page.goto(tablePath);
		await page.getByRole('button', { name: 'Create form', exact: true }).click();
		const dialog = page.getByRole('dialog');
		const footer = dialog.getByRole('button', { name: 'Create form', exact: true });
		await expect(footer).toBeInViewport({ ratio: 1 });
		const footerBox = await footer.boundingBox();
		const dialogBox = await dialog.boundingBox();
		expect(footerBox!.y + footerBox!.height).toBeLessThanOrEqual(dialogBox!.y + dialogBox!.height);
	});
}
