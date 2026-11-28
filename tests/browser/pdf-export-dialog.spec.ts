import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

test('Sending settings omit the workpaper email form', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {}, undefined, { uiAgent: true });
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	await page.getByRole('link', { name: 'Settings', exact: true }).click();
	await expect(page.getByText('Sending mode', { exact: true })).toBeVisible();
	await expect(page.getByRole('region', { name: 'Workpaper email' })).toHaveCount(0, { timeout: 1500 });
});

test('Generate PDF uses bundled legacy artwork and asks only where to save', async ({ page }) => {
	await seedWorkspace(page);
	const loadedArtwork = new Set<string>();
	page.on('response', response => {
		const { pathname } = new URL(response.url());
		if (response.ok() && pathname.startsWith('/forms/')) loadedArtwork.add(pathname);
	});
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	const actions = page.getByRole('button', { name: /^More actions for BIR Form/ });
	await expect(actions).toBeVisible();
	await page.evaluate(() => {
		const state = window as any;
		Object.assign(state, { isTauri: true, pdfDialogs: [] });
		const native = state.__TAURI_INTERNALS__;
		native.transformCallback = () => 1;
		native.unregisterCallback = () => {};
		const invoke = native.invoke;
		native.invoke = async (command: string, args: any) => {
			if (command === 'plugin:dialog|open' || command === 'plugin:dialog|save') {
				state.pdfDialogs.push(command);
				return command === 'plugin:dialog|save' ? '/tmp/synthetic-return.pdf' : null;
			}
			if (command === 'export_form_pdf') {
				state.exportedPdfHtml = args.request.html;
				return { path: '/tmp/synthetic-return.pdf' };
			}
			if (command === 'plugin:opener|open_path') {
				state.openedPdfPath = args.path;
				return;
			}
			return invoke(command, args);
		};
	});
	await actions.click();
	await page.getByRole('menuitem', { name: 'Generate PDF' }).click();
	await expect.poll(() => page.evaluate(() => (window as any).pdfDialogs), { timeout: 1500 })
		.toEqual(['plugin:dialog|save']);
	const dialog = page.getByRole('dialog', { name: 'Open generated PDF?' });
	await expect(dialog.getByRole('button', { name: 'Not now' })).toBeVisible();
	await expect(dialog.getByRole('button', { name: 'Email PDF' })).toHaveCount(0, { timeout: 1500 });
	const html = await page.evaluate(() => (window as any).exportedPdfHtml as string);
	expect(html).toContain('Machine Validation/Revenue Official Receipt Details');
	expect(html).toContain('data:image/png;base64,');
	expect(loadedArtwork.size).toBeGreaterThan(0);
	await dialog.getByRole('button', { name: 'Open PDF', exact: true }).click();
	await expect.poll(() => page.evaluate(() => (window as any).openedPdfPath)).toBe('/tmp/synthetic-return.pdf');
});
