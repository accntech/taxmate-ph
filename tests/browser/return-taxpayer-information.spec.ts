import { expect, test } from '@playwright/test';
import { listForms } from '../../src/lib/forms';
import { seedWorkspace, taxpayerId } from './fixtures';

const forms = listForms().filter(form => form.status === 'ready');

test.beforeEach(async ({ page }) => {
	await seedWorkspace(page);
	await page.addInitScript(({ codes }) => {
		const native = (window as any).__TAURI_INTERNALS__;
		const previous = native.invoke;
		native.invoke = async (command: string, args: unknown) => {
			const result = await previous(command, args);
			if (command !== 'list_taxpayer_profiles') return result;
			return result.map((profile: object) => ({ ...profile, lineOfBusiness: 'Accounting and advisory services', psicCode: '0123', taxpayerClassification: 'N', taxpayerSize: 'small' }));
		};
		const key = 'ebirforms-created-returns-v1';
		const saved = JSON.parse(localStorage.getItem(key)!);
		for (const code of codes) saved.returns.push({ ...saved.returns[0], id: `info-${code}`, formCode: code, values: {} });
		saved.returns.push({ ...saved.returns[0], id: 'final-info', formCode: '0605', status: 'Final', finalFlag: '1', values: { 'frm0605:txtTaxpayerName': 'Original Filed Name', 'frm0605:txtAddress': '', 'frm0605:txtClassification': 'I' } });
		localStorage.setItem(key, JSON.stringify(saved));
	}, { codes: forms.map(form => form.code) });
});

test('all supported returns show only basic taxpayer information', async ({ page }, testInfo) => {
	for (const form of forms) {
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${form.code}?return=info-${form.code}`);
		const information = page.getByRole('region', { name: 'Taxpayer information', exact: true });
		await expect(information).toBeVisible();
		for (const value of ['Example Services Corporation', '001-234-567-00008', '040', '123 Example Street', 'Example City']) {
			await expect(information).toContainText(value);
		}
		await expect(information.locator('dt')).toHaveText(['Taxpayer name', 'TIN and branch code', 'RDO code', 'Registered address']);
		await expect(information.getByRole('link', { name: 'Edit taxpayer information' })).toHaveAttribute('href', `/ebirforms/taxpayers/${taxpayerId}/edit`);
	}
	for (const theme of ['light', 'dark']) {
		for (const width of [1280, 390]) {
			await page.setViewportSize({ width, height: 900 });
			await page.reload();
			await expect(page.getByRole('region', { name: 'Taxpayer information', exact: true })).toBeVisible();
			await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
			await page.screenshot({ path: testInfo.outputPath(`return-taxpayer-${theme}-${width}.png`), fullPage: true, animations: 'disabled' });
		}
	}
});

test('final returns show their saved identity and preserve blank saved fields', async ({ page }) => {
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/0605?return=final-info`);
	const information = page.getByRole('region', { name: 'Taxpayer information', exact: true });
	await expect(information).toContainText('Original Filed Name');
	await expect(information).not.toContainText('Example Services Corporation');
	await expect(information.locator('div').filter({ has: page.locator('dt', { hasText: /^Registered address$/ }) }).locator('dd')).toHaveText('Example City');
	await expect(information.locator('dt')).toHaveCount(4);
});
