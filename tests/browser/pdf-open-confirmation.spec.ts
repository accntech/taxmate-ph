import { expect, test, type Page } from '@playwright/test';
import type { PdfExportRequest } from '../../src/lib/tauri/pdf-export';
import { seedWorkspace, taxpayerId } from './fixtures';

const formsPath = `/ebirforms/taxpayers/${taxpayerId}/forms`;
const savedReturns = (page: Page) => page.evaluate(() => localStorage.getItem('ebirforms-created-returns-v1'));

async function preparePdf(page: Page, outcome: 'success' | 'cancel' | 'export-error' | 'open-error' | 'pending' = 'success', theme = 'light') {
	await seedWorkspace(page, theme);
	await page.goto(formsPath);
	await expect(page.getByRole('link', { name: /^Edit BIR Form / })).toBeVisible({ timeout: 15_000 });
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
				state.pdfRequest = args.request;
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
	const before = await savedReturns(page);
	await page.getByRole('button', { name: /^More actions for BIR Form/ }).click();
	await page.getByRole('menuitem', { name: 'Generate PDF', exact: true }).click();
	return before;
}

async function expectReturnUnchanged(page: Page, before: string | null) {
	await expect(page).toHaveURL(formsPath);
	expect(await savedReturns(page)).toBe(before);
	await expect(page.getByRole('button', { name: /^More actions for BIR Form/ })).toBeEnabled();
}

async function expectExportRequest(page: Page) {
	const report = await page.evaluate(() => {
		const request = (window as Window & { pdfRequest?: PdfExportRequest }).pdfRequest;
		if (!request) return null;
		const document = new DOMParser().parseFromString(request.html, 'text/html');
		return {
			paperSize: request.paperSize,
			values: Array.from(document.querySelectorAll('input'), input => input.value),
			watermark: document.querySelector('.pdf-draft-watermark')?.textContent
		};
	});
	expect(report).toMatchObject({
		paperSize: 'long',
		values: expect.arrayContaining(['Example Services Corporation', '100,000.00', 'WI120', '1,234.56']),
		watermark: 'DRAFT'
	});
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
		const before = await preparePdf(page);
		const dialog = page.getByRole('dialog', { name: 'Open generated PDF?' });
		await expect(dialog).toBeVisible();
		if (dismiss === 'Escape') await page.keyboard.press('Escape');
		else await dialog.getByRole('button', { name: dismiss, exact: true }).click();
		await expect(dialog).not.toBeVisible();
		expect(await page.evaluate(() => (window as any).openedPdfs)).toEqual([]);
		await expect(page.getByRole('status').and(page.locator('[data-slot="toast"]')).filter({ hasText: 'PDF saved to /tmp/generated return.pdf' })).toBeVisible();
		if (dismiss === 'Not now') {
			await expect(page.locator('main p[role="status"]:visible')).toHaveCount(0);
			await expectReturnUnchanged(page, before);
			await expectExportRequest(page);
		}
	});
}

for (const outcome of ['cancel', 'export-error'] as const) {
	test(`does not offer to open a PDF after ${outcome}`, async ({ page }) => {
		const before = await preparePdf(page, outcome);
		const role = outcome === 'cancel' ? 'status' : 'alert';
		const message = outcome === 'cancel' ? 'PDF export canceled.' : 'PDF export failed: Renderer unavailable';
		const toast = page.getByRole(role).and(page.locator('[data-slot="toast"]')).filter({ hasText: message });
		await expect(toast).toBeVisible();
		await expect(page.getByRole('dialog', { name: 'Open generated PDF?' })).not.toBeVisible();
		expect(await page.evaluate(() => (window as any).openedPdfs)).toEqual([]);
		await expectReturnUnchanged(page, before);
		if (outcome === 'export-error') await expectExportRequest(page);
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
	await expect(progress).not.toHaveAttribute('aria-valuenow');
	await expect(generating).not.toContainText('%');
	await expect(generating).not.toContainText('export steps completed');
	await expect(generating).toContainText('Rendering PDF');
	await expect(progress).toHaveAttribute('aria-valuetext', 'Rendering PDF');
	const indicator = progress.locator('span');
	await expect(indicator).toHaveCSS('animation-iteration-count', 'infinite');
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expect(indicator).toHaveCSS('animation-name', 'none');
	await expect(indicator).toBeVisible();
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.evaluate(() => (window as any).reportPdfProgress(6, 'Saving PDF'));
	await expect(progress).not.toHaveAttribute('aria-valuenow');
	await expect(generating).toContainText('Saving PDF');
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
