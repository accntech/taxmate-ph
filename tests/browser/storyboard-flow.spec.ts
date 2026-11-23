import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

test('tax returns search uses the standard field focus halo', async ({ page }) => {
	await seedWorkspace(page, 'dark');
	await page.addInitScript(() => localStorage.setItem('taxmate-ph-palette', 'catppuccin'));
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	const search = page.getByRole('searchbox', { name: 'Search tax returns' });
	const frame = page.locator('label').filter({ has: search });
	await search.focus();
	await page.keyboard.press('Shift+Tab');
	await page.keyboard.press('Tab');
	await expect(search).toBeFocused();
	const expectedHalo = await frame.evaluate(el => {
		const sample = document.createElement('span');
		sample.style.boxShadow = '0 0 0 3px var(--field-focus-halo)';
		el.append(sample);
		const halo = getComputedStyle(sample).boxShadow;
		sample.remove();
		return halo;
	});
	await expect(frame).toHaveCSS('box-shadow', expectedHalo);
	await expect(search).toHaveCSS('box-shadow', 'none');
	await page.emulateMedia({ forcedColors: 'active' });
	await expect(frame).toHaveCSS('outline-style', 'solid');
	await expect(search).toHaveCSS('outline-style', 'none');
});

for (const { palette, input, header, hover } of [
	{ palette: 'catppuccin', input: 'rgb(21, 21, 32)', header: 'rgb(30, 30, 46)', hover: 'rgb(35, 35, 53)' },
	{ palette: 'teal', input: 'rgb(20, 22, 21)', header: 'rgb(28, 31, 30)', hover: 'rgb(36, 40, 38)' }
]) {
	test(`${palette} returns table uses matching dark surfaces`, async ({ page }) => {
		await seedWorkspace(page, 'dark');
		await page.addInitScript(value => localStorage.setItem('taxmate-ph-palette', value), palette);
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
		const search = page.getByRole('searchbox', { name: 'Search tax returns' });
		await expect(page.locator('label').filter({ has: search })).toHaveCSS('background-color', input);
		const table = page.getByRole('table');
		await expect(table.locator('thead')).toHaveCSS('background-color', header);
		const row = table.getByRole('row').filter({ hasText: 'BIR Form 1601EQ' });
		await row.hover();
		await expect(row).toHaveCSS('background-color', hover);
	});
}

test('forms storyboard supports cancel, create, open, and back navigation', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	await page.getByRole('button', { name: 'Create return', exact: true }).click();
	await page.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(page.getByRole('dialog')).toBeHidden();
	await expect(page.getByRole('row')).toHaveCount(2);
	await page.getByRole('button', { name: 'Create return', exact: true }).click();
	await page.getByRole('combobox', { name: 'Search BIR forms' }).fill('1601EQ');
	await page.getByRole('option').click();
	await expect(page.getByRole('heading', { name: /^Quarterly Remittance Return/ })).toBeVisible();
	await page.getByRole('link', { name: '← Back to forms', exact: true }).click();
	await expect(page.getByRole('row')).toHaveCount(2);
	await page.locator('a[href*="review-return"]').filter({ hasText: 'Edit' }).click();
	await expect(page.getByRole('textbox', { name: 'Year', exact: true })).toHaveValue('2026');
	await page.getByRole('link', { name: '← Back to forms', exact: true }).click();
	await page.getByRole('link', { name: '← Back to taxpayers', exact: true }).click();
	await expect(page).toHaveURL(/\/ebirforms\/taxpayers$/);
});

for (const outcome of ['success', 'cancel', 'error'] as const) {
	test(`print to PDF ${outcome} stays on forms table and preserves the return`, async ({ page }, testInfo) => {
		await seedWorkspace(page);
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
		await expect(page.getByRole('link', { name: 'Edit', exact: true })).toBeVisible();
		await page.evaluate(outcome => {
			const native = (window as any).__TAURI_INTERNALS__;
			const previous = native.invoke;
			native.transformCallback = () => 1;
			native.unregisterCallback = () => {};
			native.invoke = async (command: string, args: any) => {
				if (command === 'plugin:dialog|save') return outcome === 'cancel' ? null : '/tmp/return.pdf';
				if (command === 'export_form_pdf') {
					(window as any).pdfRequest = args.request;
					if (outcome === 'error') throw new Error('Renderer unavailable');
					return { status: 'exported', paperSize: args.request.paperSize, path: '/tmp/return.pdf', message: 'PDF exported.' };
				}
				return previous(command, args);
			};
		}, outcome);
		const before = await page.evaluate(() => localStorage.getItem('ebirforms-created-returns-v1'));
		await page.getByRole('button', { name: /^More actions for BIR Form/ }).click();
		await page.getByRole('menuitem', { name: 'Generate PDF', exact: true }).click();
		await expect(page.getByRole(outcome === 'error' ? 'alert' : 'status').filter({ hasText: outcome === 'success' ? 'PDF saved to /tmp/return.pdf' : outcome === 'cancel' ? 'PDF export canceled.' : 'PDF export failed: Renderer unavailable' })).toBeVisible();
		await expect(page).toHaveURL(`/ebirforms/taxpayers/${taxpayerId}/forms`);
		expect(await page.evaluate(() => localStorage.getItem('ebirforms-created-returns-v1'))).toBe(before);
		await expect(page.getByRole('button', { name: /^More actions for BIR Form/ })).toBeEnabled();
		if (outcome !== 'cancel') {
			const request = await page.evaluate(() => (window as any).pdfRequest);
			expect(request.paperSize).toBe('long');
			expect(request.html).toContain('Example Services Corporation');
			expect(request.html).toContain('value="100000"');
			expect(request.html).toContain('WI120');
			expect(request.html).toContain('1234.56');
			expect(request.html).toContain('<div class="pdf-draft-watermark" aria-hidden="true">DRAFT</div>');
			if (outcome === 'success') {
				const preview = await page.context().newPage();
				await preview.setContent(request.html);
				await preview.emulateMedia({ media: 'print' });
				await preview.screenshot({ path: testInfo.outputPath('return-print.png'), fullPage: true });
				await preview.pdf({ path: testInfo.outputPath('return.pdf'), preferCSSPageSize: true });
			}
		}
	});
}
