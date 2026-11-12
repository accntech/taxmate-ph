import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

test('forms storyboard supports cancel, create, open, and back navigation', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	await page.getByRole('button', { name: 'Create form', exact: true }).click();
	await page.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(page.getByRole('dialog')).toBeHidden();
	await expect(page.getByRole('row')).toHaveCount(2);
	await page.getByRole('button', { name: 'Create form', exact: true }).click();
	await page.getByRole('combobox', { name: 'Search BIR forms' }).fill('1601EQ');
	await page.getByRole('option').click();
	await expect(page.getByRole('heading', { name: 'BIR Form 1601EQ', exact: true })).toBeVisible();
	await page.getByRole('link', { name: '← Back to forms', exact: true }).click();
	await expect(page.getByRole('row')).toHaveCount(3);
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
		await expect(page.getByRole('status').filter({ hasText: outcome === 'success' ? 'PDF saved to /tmp/return.pdf' : outcome === 'cancel' ? 'PDF export canceled.' : 'PDF export failed: Renderer unavailable' })).toBeVisible();
		await expect(page).toHaveURL(`/ebirforms/taxpayers/${taxpayerId}/forms`);
		expect(await page.evaluate(() => localStorage.getItem('ebirforms-created-returns-v1'))).toBe(before);
		await expect(page.getByRole('button', { name: /^More actions for BIR Form/ })).toBeEnabled();
		if (outcome !== 'cancel') {
			const request = await page.evaluate(() => (window as any).pdfRequest);
			expect(request.paperSize).toBe('long');
			expect(request.html).toContain('Example Services Corporation');
			expect(request.html).toContain('100000.00');
			expect(request.html).toContain('WI120');
			expect(request.html).toContain('1234.56');
			expect(request.html).toContain('Status: Draft');
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
