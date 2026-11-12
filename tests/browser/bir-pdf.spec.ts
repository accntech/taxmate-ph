import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

const cases = [
	{ status: 'Draft', paperSize: 'long' },
	{ status: 'Draft', paperSize: 'letter' },
	{ status: 'Draft', paperSize: 'a4' },
	{ status: 'Final', paperSize: 'long' },
	{ status: 'Submitted', paperSize: 'long' },
	{ status: 'For resubmission', paperSize: 'long' }
];

for (const { status, paperSize } of cases) {
	test(`${status} ${paperSize} PDF preserves the BIR layout and marks only drafts`, async ({ page }, testInfo) => {
		await seedWorkspace(page);
		await page.addInitScript(({ status, paperSize }) => {
			const key = 'ebirforms-created-returns-v1';
			const saved = JSON.parse(localStorage.getItem(key)!);
			saved.returns[0].status = status;
			localStorage.setItem(key, JSON.stringify(saved));
			localStorage.setItem('taxmate-ph-prefs', JSON.stringify({ paperSize }));
		}, { status, paperSize });
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
		// A cold Vite server compiles the UI modules before the page can hydrate.
		await expect(page.getByRole('link', { name: 'Edit', exact: true })).toBeVisible({ timeout: 15_000 });
		await page.evaluate(() => {
			const native = (window as any).__TAURI_INTERNALS__;
			native.transformCallback = () => 1;
			native.unregisterCallback = () => {};
			const previous = native.invoke;
			native.invoke = async (command: string, args: any) => {
				if (command === 'plugin:dialog|save') return '/tmp/1601eq.pdf';
				if (command === 'export_form_pdf') {
					(window as any).pdfRequest = args.request;
					return { path: '/tmp/1601eq.pdf', message: 'Saved' };
				}
				return previous(command, args);
			};
		});
		await page.getByRole('button', { name: /^More actions for BIR Form/ }).click();
		await page.getByRole('menuitem', { name: 'Generate PDF', exact: true }).click();
		await expect.poll(() => page.evaluate(() => (window as any).pdfRequest?.html || '')).toContain('Quarterly Remittance Return');
		const request = await page.evaluate(() => (window as any).pdfRequest);
		expect(request.html).toContain('1601-EQ');
		expect(request.html).toContain('Machine Validation/Revenue Official Receipt Details');
		expect(request.html).toContain('Example Services Corporation');
		expect(request.html).toContain('2000.00');
		expect(request.html).toContain('765.44');
		expect(request.html).toContain('data:image/png;base64,');
		expect(request.html).not.toContain('Return details');
		expect(request.suggestedFilename).toBe('00123456700008-1601EQ-2026Q2.pdf');
		expect(request.paperSize).toBe(paperSize);
		await page.setContent(request.html);
		await page.emulateMedia({ media: 'print' });
		await page.evaluate(() => document.fonts.ready);
		const watermark = page.locator('.pdf-draft-watermark');
		await expect(watermark).toHaveCount(status === 'Draft' ? 1 : 0);
		if (status === 'Draft') {
			await expect(watermark).toHaveText('DRAFT');
			await expect(watermark).toBeVisible();
		}
		await page.pdf({ path: testInfo.outputPath('1601eq.pdf'), preferCSSPageSize: true, printBackground: true });
		await page.screenshot({ path: testInfo.outputPath('1601eq.png'), fullPage: true });
	});
}
