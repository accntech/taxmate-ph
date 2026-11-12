import { expect, test, type Page } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

async function preparePdf(page: Page, outcome: 'success' | 'cancel' | 'export-error' | 'open-error' = 'success') {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	await expect(page.getByRole('link', { name: 'Edit', exact: true })).toBeVisible();
	await page.evaluate((outcome) => {
		const state = window as any;
		state.openedPdfs = [];
		const previous = state.__TAURI_INTERNALS__.invoke;
		state.__TAURI_INTERNALS__.invoke = async (command: string, args: any) => {
			if (command === 'plugin:dialog|save') return outcome === 'cancel' ? null : '/tmp/requested.pdf';
			if (command === 'export_form_pdf') {
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
	await page.screenshot({ path: testInfo.outputPath('pdf-open-confirmation.png') });
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
		await expect(page.getByRole('status').filter({ hasText: 'PDF saved to /tmp/generated return.pdf' })).toBeVisible();
	});
}

for (const outcome of ['cancel', 'export-error'] as const) {
	test(`does not offer to open a PDF after ${outcome}`, async ({ page }) => {
		await preparePdf(page, outcome);
		await expect(page.getByRole('status').filter({ hasText: outcome === 'cancel' ? 'PDF export canceled.' : 'PDF export failed: Renderer unavailable' })).toBeVisible();
		await expect(page.getByRole('dialog', { name: 'Open generated PDF?' })).not.toBeVisible();
		expect(await page.evaluate(() => (window as any).openedPdfs)).toEqual([]);
	});
}

test('reports opening failures while preserving the successful save', async ({ page }) => {
	await preparePdf(page, 'open-error');
	await page.getByRole('dialog', { name: 'Open generated PDF?' }).getByRole('button', { name: 'Open PDF', exact: true }).click();
	await expect(page.getByRole('status').filter({ hasText: 'PDF saved to /tmp/generated return.pdf, but could not open it: No PDF viewer' })).toBeVisible();
});
