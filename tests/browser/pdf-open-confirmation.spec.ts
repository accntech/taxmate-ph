import { expect, test, type Page } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

async function preparePdf(page: Page, outcome: 'success' | 'cancel' | 'export-error' | 'open-error' | 'pending' = 'success', theme = 'light') {
	await seedWorkspace(page, theme);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	await expect(page.getByRole('link', { name: 'Edit', exact: true })).toBeVisible();
	await page.evaluate((outcome) => {
		const state = window as any;
		state.openedPdfs = [];
		state.__TAURI_INTERNALS__.transformCallback = () => 1;
		state.__TAURI_INTERNALS__.unregisterCallback = () => {};
		const previous = state.__TAURI_INTERNALS__.invoke;
		state.__TAURI_INTERNALS__.invoke = async (command: string, args: any) => {
			if (command === 'plugin:dialog|save') return outcome === 'cancel' ? null : '/tmp/requested.pdf';
			if (command === 'cancel_pdf_export') {
				state.canceledJobId = args.jobId;
				state.rejectPdf(new Error('PDF export canceled.'));
				return true;
			}
			if (command === 'export_form_pdf') {
				state.pdfJobId = args.request.jobId;
				state.reportPdfProgress = (completedSteps: number, stage: string) => args.onProgress?.onmessage({ completedSteps, totalSteps: 7, stage });
				state.reportPdfProgress(5, 'Rendering PDF');
				if (outcome === 'pending') return new Promise((resolve, reject) => { state.resolvePdf = resolve; state.rejectPdf = reject; });
				if (outcome === 'export-error') throw new Error('Renderer unavailable');
				return { status: 'exported', paperSize: 'long', path: '/tmp/generated return.pdf', message: 'Saved' };
			}
			if (command === 'plugin:opener|open_path') {
				state.openedPdfs.push(args.path);
				if (outcome === 'open-error') throw new Error('No PDF viewer');
				return;
			}
			return previous(command, args);
		};
	}, outcome);
	await page.getByRole('button', { name: /^More actions for BIR Form/ }).click();
	await page.getByRole('menuitem', { name: 'Generate PDF', exact: true }).click();
}

test('opens the generated PDF only after confirmation', async ({ page }, testInfo) => {
	await preparePdf(page);
	const dialog = page.getByRole('dialog', { name: 'Open generated PDF?' });
	await expect(dialog).toBeVisible();
	await expect(dialog).toContainText('/tmp/generated return.pdf');
	expect(await page.evaluate(() => (window as any).openedPdfs)).toEqual([]);
	await page.screenshot({ path: testInfo.outputPath('pdf-open-confirmation.png'), animations: 'disabled' });
	await dialog.getByRole('button', { name: 'Open PDF', exact: true }).click();
	await expect(dialog).not.toBeVisible();
	expect(await page.evaluate(() => (window as any).openedPdfs)).toEqual(['/tmp/generated return.pdf']);
});

for (const dismiss of ['Not now', 'Escape']) {
	test(`keeps the PDF saved without opening when dismissed with ${dismiss}`, async ({ page }) => {
		await preparePdf(page);
		const dialog = page.getByRole('dialog', { name: 'Open generated PDF?' });
		await expect(dialog).toBeVisible();
		if (dismiss === 'Escape') await page.keyboard.press('Escape');
		else await dialog.getByRole('button', { name: dismiss, exact: true }).click();
		await expect(dialog).not.toBeVisible();
		expect(await page.evaluate(() => (window as any).openedPdfs)).toEqual([]);
		await expect(page.locator('[data-slot="toast"]').filter({ hasText: 'PDF saved to /tmp/generated return.pdf' })).toBeVisible();
	});
}

for (const outcome of ['cancel', 'export-error'] as const) {
	test(`does not offer to open a PDF after ${outcome}`, async ({ page }) => {
		await preparePdf(page, outcome);
		await expect(page.locator('[data-slot="toast"]').filter({ hasText: outcome === 'cancel' ? 'PDF export canceled.' : 'PDF export failed: Renderer unavailable' })).toBeVisible();
		await expect(page.getByRole('dialog', { name: 'Open generated PDF?' })).not.toBeVisible();
		expect(await page.evaluate(() => (window as any).openedPdfs)).toEqual([]);
	});
}

test('reports opening failures while preserving the successful save', async ({ page }) => {
	await preparePdf(page, 'open-error');
	await page.getByRole('dialog', { name: 'Open generated PDF?' }).getByRole('button', { name: 'Open PDF', exact: true }).click();
	await expect(page.locator('[data-slot="toast"]').filter({ hasText: 'PDF saved to /tmp/generated return.pdf, but could not open it: No PDF viewer' })).toBeVisible();
});

for (const mobile of [false, true]) {
test(`shows cancellable generation and a toast on ${mobile ? 'mobile dark' : 'desktop light'}`, async ({ page }, testInfo) => {
	if (mobile) await page.setViewportSize({ width: 390, height: 844 });
	await preparePdf(page, 'pending', mobile ? 'dark' : 'light');
	const generating = page.getByRole('dialog', { name: 'Generating PDF' });
	await expect(generating).toBeVisible();
	const progress = generating.getByRole('progressbar', { name: 'PDF generation progress' });
	await expect(progress).toBeVisible();
	await expect(progress).toHaveAttribute('aria-valuenow', '71');
	await expect(generating).toContainText('71%');
	await expect(generating).toContainText('Rendering PDF');
	await page.evaluate(() => (window as any).reportPdfProgress(6, 'Saving PDF'));
	await expect(progress).toHaveAttribute('aria-valuenow', '86');
	await expect(generating).toContainText('86%');
	await page.keyboard.press('Escape');
	await expect(generating).toBeVisible();
	await page.screenshot({ path: testInfo.outputPath('pdf-generating.png'), animations: 'disabled' });
	await generating.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(generating).not.toBeVisible();
	await expect(page.locator('[data-slot="toast"]')).toContainText('PDF export canceled.');
	expect(await page.evaluate(() => (window as any).canceledJobId)).toBe(await page.evaluate(() => (window as any).pdfJobId));
	await expect(page.getByRole('dialog', { name: 'Open generated PDF?' })).not.toBeVisible();
	await expect(page.getByRole('button', { name: 'Create return', exact: true })).toBeEnabled();
	await page.screenshot({ path: testInfo.outputPath('pdf-canceled-toast.png'), animations: 'disabled' });
});
}

test('reports a successful export in a toast without status below the table', async ({ page }) => {
	await preparePdf(page);
	await page.getByRole('dialog', { name: 'Open generated PDF?' }).getByRole('button', { name: 'Not now' }).click();
	await expect(page.locator('[data-slot="toast"]')).toContainText('PDF saved to /tmp/generated return.pdf');
	await expect(page.locator('main p[role="status"]:visible')).toHaveCount(0);
});
