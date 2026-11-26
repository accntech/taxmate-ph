import { expect, type Page } from '@playwright/test';
import type { PdfExportRequest } from '../../../src/lib/tauri/pdf-export';
import { writeFile } from 'node:fs/promises';

/** Capture the exact report sent by Generate PDF, then render it in Chromium. */
export async function printSavedReturn(page: Page, formCode: string, path: string, generate?: () => Promise<void>): Promise<Page> {
	await page.evaluate(() => {
		type Native = {
			invoke: (command: string, args: { request?: PdfExportRequest }) => Promise<unknown>;
			transformCallback: () => number;
			unregisterCallback: () => void;
		};
		const state = window as unknown as { __TAURI_INTERNALS__: Native; returnPdfReport?: string };
		const native = state.__TAURI_INTERNALS__;
		const invoke = native.invoke;
		native.transformCallback = () => 1;
		native.unregisterCallback = () => {};
		native.invoke = async (command, args) => {
			if (command === 'plugin:dialog|save') return '/tmp/test-return.pdf';
			if (command === 'export_form_pdf' && args.request) {
				state.returnPdfReport = args.request.html;
				return { status: 'exported', path: args.request.outputPath, paperSize: args.request.paperSize };
			}
			return invoke(command, args);
		};
	});
	if (generate) await generate();
	else {
		const row = page.getByRole('row').filter({ hasText: formCode });
		await row.getByRole('button', { name: /^More actions for BIR Form/ }).click();
		await page.getByRole('menuitem', { name: 'Generate PDF', exact: true }).click();
	}
	await expect(page.getByRole('dialog', { name: 'Open generated PDF?' })).toBeVisible({ timeout: 15_000 });
	const html = await page.evaluate(() => (window as Window & { returnPdfReport?: string }).returnPdfReport);
	if (!html) throw new Error(`Generate PDF returned no print report for ${formCode}`);
	if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === '1') await writeFile(`${path}.html`, html);
	const printed = await page.context().newPage();
	await printed.setContent(html);
	await printed.emulateMedia({ media: 'print' });
	await printed.evaluate(() => document.fonts.ready);
	await printed.pdf({ path, preferCSSPageSize: true, printBackground: true });
	return printed;
}
