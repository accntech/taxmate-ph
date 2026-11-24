import { expect, test, type Locator } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

const list = `/ebirforms/taxpayers/${taxpayerId}/forms`;
const fixture = {
	tin1: '001', tin2: '234', tin3: '567', branchCode: '00008', rdoCode: '047',
	taxpayerName: 'SANTOS, ALEX, REYES', address: '28 Narra Street', address2: 'Makati City',
	zipCode: '1209', contactNumber: '0285550148', email: 'alex.santos@example.test',
	taxpayerClassification: 'I' as const, psocCode: '0110'
};
const compensation = {
	'frm1700:rdoPg1I6TaxpayerType': 'Employee', 'frm1700:rdoPg1I15CivilStatus': 'Single',
	'frm1700:rdoPg2I1PartVIEmployee': 'Taxpayer', 'frm1700:txtPg2I1PartVIEmployerName1': 'Sample Employer',
	'frm1700:txtPg2I1PartVIEmployerTIN1': '321', 'frm1700:txtPg2I1PartVIEmployerTIN2': '654',
	'frm1700:txtPg2I1PartVIEmployerTIN3': '987', 'frm1700:txtPg2I1PartVIEmployerBranchCode': '00000',
	'frm1700:txtPg2ISched1c_1REG': '1000000', 'frm1700:txtPg2ISched1e_1TW': '100000'
};
const cases = { '1700': 4, '1700v2018': 2, '1701': 12, '1701v2018': 4, '1701A': 2, '1701MS': 2, '1701Q': 1, '1701Qv2018': 2 };

test('legacy 1701 carries the taxpayer details trade name through a new draft and reopen', async ({ page, context }) => {
	const name = 'Santos Advisory';
	const field = 'frm1701:txtPg1Pt1I9TradeName';
	const type = 'frm1701:rdoPg1Pt1I7Type';
	const output = process.env.INCOME_PREVIEW_DIR;
	await page.setViewportSize({ width: 1440, height: 1040 });
	async function captureDraft(stage: 'new-draft' | 'saved-draft', directory: string) {
		mkdirSync(directory, { recursive: true });
		const namePrefix = resolve(directory, `1701-${stage}`);
		await page.evaluate(() => document.fonts.ready);
		await page.getByRole('region', { name: 'BIR Form 1701 workspace' }).screenshot({
			path: `${namePrefix}-form.png`, animations: 'disabled',
			style: '.eq-action-bar { position: static !important; } .window-titlebar { visibility: hidden !important; }'
		});
		const html = await page.evaluate(async (field) => {
			const workspaceModule = '/src/lib/ebirforms/ebirforms-workspace.svelte.ts';
			const reportModule = '/src/lib/printing/return-report.ts';
			const { ebirformsWorkspace } = await import(workspaceModule) as typeof import('../../src/lib/ebirforms/ebirforms-workspace.svelte');
			const { buildReturnReport } = await import(reportModule) as typeof import('../../src/lib/printing/return-report');
			const { selectedForm, formValues, currentReturnStatus } = ebirformsWorkspace;
			if (selectedForm?.code !== '1701' || currentReturnStatus !== 'Draft' || !formValues[field]) {
				throw new Error('The legacy 1701 draft with its autofilled trade name must be open.');
			}
			return (await buildReturnReport(selectedForm, { ...formValues }, currentReturnStatus, 'a4'))
				.replaceAll('__EBIRFORMS_PRINT_SOURCE_URL__', 'FICTIONAL SAMPLE - FOR REVIEW ONLY');
		}, field);
		const print = await context.newPage();
		await print.setContent(html);
		await print.emulateMedia({ media: 'print' });
		await print.evaluate(() => document.fonts.ready);
		await expect(print.locator('[data-legacy-print-id="txtPg1Pt1I9TradeName"]')).toHaveText(name.toUpperCase());
		const pdfPath = `${namePrefix}.pdf`;
		const pdf = await print.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true });
		const firstPage = execFileSync('pdftotext', ['-f', '1', '-l', '1', '-layout', '-', '-'], { input: pdf, encoding: 'utf8' });
		expect(firstPage).toContain(name.toUpperCase());
		execFileSync('pdftoppm', ['-f', '1', '-l', '1', '-r', '105', '-singlefile', '-png', pdfPath, `${namePrefix}-pdf-page-1`]);
		await print.close();
	}
	await seedWorkspace(page, 'light', 'loaded', { ...fixture, taxpayerType: 'professional', psicCode: '69200' }, [], { persistProfile: true });
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/edit`);
	const tradeName = page.getByRole('textbox', { name: 'Trade name', exact: true });
	await expect(tradeName).toHaveValue('', { timeout: 15000 });
	await tradeName.fill(`  ${name}  `);
	await page.getByRole('button', { name: 'Save profile', exact: true }).click();
	await expect(page).toHaveURL('/ebirforms/taxpayers');
	await page.getByRole('link', { name: fixture.taxpayerName, exact: true }).click();
	await page.getByRole('button', { name: 'Create return', exact: true }).click();
	await page.getByRole('combobox', { name: 'Search BIR forms' }).fill('1701');
	await page.getByRole('option', { name: /BIR Form 1701\s+1701 · June 2013/ }).click();
	const displayName = page.locator(`dl[id="${field}"]`);
	const displayType = page.locator(`dl[id="${type}"]`);
	await expect(displayName.locator('dt')).toHaveText('Trade name');
	await expect(displayName.locator('dd')).toHaveText(name);
	await expect(displayType.locator('dt')).toHaveText('Taxpayer type');
	await expect(displayType.locator('dd')).toHaveText('Professional');
	await expect(tradeName).toHaveCount(0);
	await expect(page.getByRole('radiogroup', { name: 'Taxpayer type', exact: true })).toHaveCount(0);
	await expect(page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true })).toBeVisible();
	await page.getByRole('textbox', { name: 'Filing year' }).fill('2017');
	if (output) await captureDraft('new-draft', output);
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const savedName = await page.evaluate(field => {
		const storage = JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!);
		return storage.returns.find((record: { formCode: string }) => record.formCode === '1701')?.values[field];
	}, field);
	expect(savedName).toBe(name);
	await page.getByRole('row').filter({ hasText: 'BIR Form 1701' }).getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(displayName.locator('dd')).toHaveText(name);
	await expect(displayType.locator('dd')).toHaveText('Professional');
	if (output) await captureDraft('saved-draft', output);
	await page.setViewportSize({ width: 390, height: 920 });
	await expect(displayName.locator('dd')).toHaveText(name);
	await expect(displayType.locator('dd')).toHaveText('Professional');
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	if (output) {
		await page.getByRole('region', { name: 'Taxpayer information' }).screenshot({
			path: resolve(output, '1701-taxpayer-information-narrow.png'), animations: 'disabled'
		});
	}
});

test('legacy 1701 fills blank trade name and PSIC fields from the taxpayer profile', async ({ page }) => {
	const tradeNameId = 'frm1701:txtPg1Pt1I9TradeName';
	const psicId = 'frm1701:txtPg1Pt1I18PSIC';
	const taxpayerTypeId = 'frm1701:rdoPg1Pt1I7Type';
	await seedWorkspace(page, 'light', 'loaded', {
		...fixture, taxpayerType: 'professional', tradeName: 'Santos Accounting & Advisory', psicCode: '69200'
	}, [{
		id: 'older-1701', taxpayerId, formCode: '1701', returnPeriod: '2017',
		status: 'Draft', finalFlag: '0', updatedAt: 1794441600000,
		values: { 'frm1701:txtPg1I1Year': '2017', 'frm1701:rdoPg1Pt1I4ATC': 'Business', [tradeNameId]: '', [psicId]: '' }
	}, {
		id: 'historical-1701', taxpayerId, formCode: '1701', returnPeriod: '2016',
		status: 'Draft', finalFlag: '0', updatedAt: 1794441600000,
		values: { 'frm1701:txtPg1I1Year': '2016', [tradeNameId]: 'Earlier accounting name', [taxpayerTypeId]: 'Single' }
	}]);
	await page.goto(`${list}/1701?return=older-1701`);
	await expect(page.locator(`dl[id="${tradeNameId}"] dd`)).toHaveText('Santos Accounting & Advisory', { timeout: 15000 });
	await expect(page.locator(`[id="${psicId}"]`)).toContainText('6920');

	await page.goto(`${list}/1701?return=historical-1701`);
	const tradeName = page.getByRole('textbox', { name: 'Trade name', exact: true });
	await expect(tradeName).toHaveValue('Earlier accounting name');
	const type = page.getByRole('combobox', { name: 'Taxpayer type', exact: true });
	await expect(type).toContainText('Sole proprietor');
	await tradeName.fill('Santos Accounting & Advisory');
	await expect(tradeName).toBeFocused();
	await tradeName.fill('Return trade name');
	await expect(tradeName).toHaveValue('Return trade name');
});

test('prefills the quarterly taxpayer type and preserves a saved return override', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { ...fixture, taxpayerType: 'estate' });
	await page.goto(`${list}/1701Qv2018?new=true`);
	const type = page.getByRole('radiogroup', { name: 'Taxpayer type', exact: true });
	await expect(type.getByRole('radio', { name: 'Estate', exact: true })).toBeChecked({ timeout: 15000 });
	const trust = type.getByRole('radio', { name: 'Trust', exact: true });
	await trust.check();
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await page.getByRole('row').filter({ hasText: '1701Qv2018' }).getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(trust).toBeChecked();
});

for (const [code, total] of Object.entries({ 1701: '32', '1701v2018': '32', '1701A': '30', '1701MS': '30', '1701Qv2018': '31' })) {
	test(`${code} presents the total tax payable in a compact table`, async ({ page }) => {
		await seedWorkspace(page, 'light', 'loaded', { ...fixture, civilStatus: 'Single' });
		await page.setViewportSize({ width: 1280, height: 1000 });
		await page.goto(`${list}/${code}?new=true`);
		const summary = page.getByRole('table', { name: 'Calculated tax amounts' });
		await expect(summary).toBeVisible({ timeout: 15000 });
		await expect(summary.getByRole('columnheader', { name: 'Spouse', exact: true })).toHaveCount(0);
		expect(await summary.locator('tbody tr').evaluateAll(rows => rows.every(row => row.children.length === 3))).toBe(true);
		await expect(summary.getByRole('row', { name: new RegExp(`^${total} .*payable`, 'i') })).toContainText(['1701A', '1701MS', '1701Qv2018'].includes(code) ? '—' : '₱0.00');
		await page.setViewportSize({ width: 390, height: 920 });
		await page.keyboard.press('Escape');
		await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
		await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
		const output = process.env.INCOME_PREVIEW_DIR;
		if (output) {
			mkdirSync(output, { recursive: true });
			await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
			await summary.screenshot({ path: resolve(output, `${code}-mobile-tax-summary.png`), animations: 'disabled' });
		}
	});
}

for (const [code, monthId] of [['1701Q', 'txt13BirthMonth'], ['1701Qv2018', 'txtBirthMonth']]) {
	test(`${code} presents the profile date of birth as a single field`, async ({ page }) => {
		await seedWorkspace(page, 'light', 'loaded', { ...fixture, birthDate: '1984-02-29', lineOfBusiness: 'BOOKKEEPING' });
		await page.setViewportSize({ width: 1440, height: 960 });
		await page.goto(`${list}/${code}?new=true`);
		const date = page.locator(`[id="frm1701q:${monthId}"]`);
		await expect(date).toContainText('02/29/1984', { timeout: 20000 });
		await expect(page.locator(`[id="frm1701q:${monthId.replace('Month', 'Day')}"]`)).toHaveCount(0);
		const filing = page.getByRole('region', { name: 'Filing details', exact: true });
		const filingRows = await filing.locator('[data-income-item]').evaluateAll(rows => rows.map(row => row.getBoundingClientRect().y));
		expect(filingRows).toHaveLength(4);
		expect(new Set(filingRows).size).toBe(1);
		if (code === '1701Q') await expect(page.locator('[id="frm1701q:txt19"]')).toContainText('BOOKKEEPING');
	});
}

test('1701-MS exposes the taxpayer regime and names the sources of income for single filers', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'loaded', { ...fixture, civilStatus: 'Single' });
	await page.goto(`${list}/1701MS?new=true`);
	await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 20000 });
	await expect(page.getByRole('radiogroup', { name: 'Taxpayer tax regime', exact: true })).toBeVisible();
	const source = page.getByRole('radiogroup', { name: 'Taxpayer income source', exact: true });
	await expect(source.getByRole('radio', { name: 'Income from business', exact: true })).toBeVisible();
	await expect(source.getByRole('radio', { name: 'Income from profession', exact: true })).toBeVisible();
	await expect(page.getByRole('radiogroup', { name: 'Spouse tax regime', exact: true })).toHaveCount(0);
});

test('1701-MS aligns populated business schedules and clears deductions after changing tax regimes', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { ...fixture, civilStatus: 'Single' });
	await page.setViewportSize({ width: 1440, height: 960 });
	await page.goto(`${list}/1701MS?new=true`);
	await page.getByRole('radiogroup', { name: 'Taxpayer income source', exact: true }).getByRole('radio', { name: 'Income from business', exact: true }).check();
	const regime = page.getByRole('radiogroup', { name: 'Taxpayer tax regime', exact: true });
	await regime.getByRole('radio', { name: 'Graduated rates', exact: true }).check();
	const deduction = page.getByRole('radiogroup', { name: 'Taxpayer method of deduction', exact: true });
	await deduction.getByRole('radio', { name: /OSD/ }).check();
	await regime.getByRole('radio', { name: '8% rate', exact: true }).check();
	await expect(deduction).toHaveCount(0);
	await regime.getByRole('radio', { name: 'Graduated rates', exact: true }).check();
	await expect(deduction.getByRole('radio', { name: /OSD/ })).not.toBeChecked();
	await deduction.getByRole('radio', { name: /Itemized/ }).check();
	await page.getByRole('button', { name: 'Next page', exact: true }).click();
	const business = page.getByRole('table', { name: 'Part IV.B1 · Business income at graduated or special rates', exact: true });
	await expect(business.getByRole('columnheader')).toHaveText(['Item', 'Description', 'Amount']);
	await business.locator('[id="frm1701MS:txtSalesRevenueNo5a"]').fill('1000000');
	await business.locator('[id="frm1701MS:txtCostofSalesNo8a"]').fill('100000');
	await business.locator('[id="frm1701MS:txtCostofSalesNo8a"]').blur();
	await expect(business.locator('[id="frm1701MS:TotalTaxDueCompensationBTP"]')).toHaveText('₱127,500.00');
	await expect(page.getByRole('table', { name: 'Part IV.B2 · Business income at 8%', exact: true })).toHaveCount(0);
	const output = process.env.INCOME_PREVIEW_DIR;
	if (output) {
		mkdirSync(output, { recursive: true });
		await business.screenshot({ path: resolve(output, '1701MS-populated-business.png'), animations: 'disabled' });
	}
	await page.setViewportSize({ width: 390, height: 920 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	if (output) await business.screenshot({ path: resolve(output, '1701MS-populated-business-mobile.png'), animations: 'disabled' });
});

test('1701A keeps the ATC selector compact and the filing fields aligned on desktop', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'loaded', { ...fixture, taxpayerType: 'single-proprietor' });
	await page.setViewportSize({ width: 1440, height: 960 });
	await page.goto(`${list}/1701A?new=true`);
	await expect(page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true })).toBeVisible();
	const year = page.getByRole('textbox', { name: /^Filing year/ });
	const amended = page.getByRole('radiogroup', { name: 'Amended return?', exact: true });
	expect(Math.abs((await year.boundingBox())!.y - (await amended.boundingBox())!.y)).toBeLessThan(40);
	await expect(page.locator('[id="frm1701A:txtMonth"]')).toContainText('December');
	const shortPeriod = page.getByRole('radiogroup', { name: 'Short period return?', exact: true });
	await shortPeriod.getByRole('radio', { name: 'Yes' }).check();
	const month = page.getByRole('combobox', { name: 'Filing month', exact: true });
	await expect(month).toBeVisible();
	await month.click();
	await page.getByRole('option', { name: 'June', exact: true }).click();
	await shortPeriod.getByRole('radio', { name: 'No' }).check();
	await expect(page.locator('[id="frm1701A:txtMonth"]')).toContainText('December');
});

test('1701A derives the rate from the ATC and retains the calculated total after reopening', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { ...fixture, civilStatus: 'Single', taxpayerType: 'single-proprietor' });
	await page.goto(`${list}/1701A?new=true`);
	await page.getByRole('textbox', { name: /^Filing year/ }).fill('2025');
	const atc = page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true });
	await atc.selectOption('II012');
	await expect(page.locator('[id="frm1701A:optTaxRate"]')).toContainText('Graduated');
	await expect(page.getByRole('radiogroup', { name: 'Income tax rate', exact: true })).toHaveCount(0);
	await page.getByRole('button', { name: 'Next page', exact: true }).click();
	const sales = page.locator('[id="frm1701A:txt36A"]');
	await sales.fill('1000000');
	await sales.blur();
	await expect(page.locator('[id="frm1701A:txt47A"]')).toHaveCount(0);
	await page.getByRole('button', { name: 'Previous page', exact: true }).click();
	await expect(page.locator('[id="frm1701A:txt30"]')).toHaveText('₱62,500.00');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await page.getByRole('row').filter({ hasText: '1701A' }).getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(page.locator('[id="frm1701A:txt30"]')).toHaveText('₱62,500.00');
	const output = process.env.INCOME_PREVIEW_DIR;
	if (output) {
		mkdirSync(output, { recursive: true });
		const summary = page.getByRole('table', { name: 'Calculated tax amounts' });
		await summary.evaluate(node => node.scrollIntoView({ block: 'center' }));
		await summary.screenshot({ path: resolve(output, '1701A-populated-tax-summary.png'), animations: 'disabled' });
	}
});

test('1701A aligns schedule amounts and descriptions on page 2', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { ...fixture, civilStatus: 'Single', taxpayerType: 'single-proprietor' });
	await page.setViewportSize({ width: 1440, height: 960 });
	await page.goto(`${list}/1701A?new=true`);
	await page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true }).selectOption('II012');
	await page.getByRole('button', { name: 'Next page', exact: true }).click();
	const graduated = page.getByRole('table', { name: 'IV.A · Graduated income tax' });
	const flat = page.getByRole('table', { name: 'IV.B · 8% income tax' });
	const credits = page.getByRole('table', { name: 'IV.C · Tax credits and payments' });
	await expect(graduated).toBeVisible();
	await expect(flat).toHaveCount(0);
	await expect(credits).toBeVisible();
	await expect(graduated.getByRole('columnheader', { name: 'Spouse' })).toHaveCount(0);
	const description = graduated.getByRole('textbox', { name: 'Item 41 other income description' });
	const amount = graduated.getByRole('textbox', { name: 'Item 41 other income amount' });
	await description.fill('Miscellaneous income');
	await amount.fill('25000');
	await amount.blur();
	expect((await description.boundingBox())!.y).toBe((await amount.boundingBox())!.y);
	await expect(graduated.locator('[id="frm1701A:txt44A"]')).toHaveText('₱25,000.00');
	await page.setViewportSize({ width: 390, height: 920 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	const output = process.env.INCOME_PREVIEW_DIR;
	if (output) {
		mkdirSync(output, { recursive: true });
		await graduated.screenshot({ path: resolve(output, '1701A-schedule-mobile.png'), animations: 'disabled' });
	}
});

test('1701A keeps taxpayer and spouse amounts in the correct columns for mixed rates', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {
		...fixture, civilStatus: 'Married', taxpayerType: 'single-proprietor',
		spouse: { taxpayerName: 'SANTOS, JAMIE, CRUZ', tin1: '009', tin2: '876', tin3: '543', branchCode: '00000' }
	});
	await page.setViewportSize({ width: 1440, height: 960 });
	await page.goto(`${list}/1701A?new=true`);
	const atc = page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true });
	await atc.selectOption('II015');
	await page.getByRole('radiogroup', { name: /spouse has income/i }).getByRole('radio', { name: 'Yes', exact: true }).check();
	await page.getByRole('radiogroup', { name: 'Filing status', exact: true }).getByRole('radio', { name: /Joint/ }).check();
	await page.getByRole('button', { name: 'Next page', exact: true }).click();
	await page.getByRole('radiogroup', { name: 'Spouse taxpayer type', exact: true })
		.getByRole('radio', { name: 'Single Proprietor', exact: true }).check();
	const spouseAtc = page.getByRole('combobox', { name: 'Spouse alphanumeric tax code (ATC)', exact: true });
	await spouseAtc.selectOption('II012');
	await expect(page.getByText('009-876-543-00000', { exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Edit spouse details' })).toBeVisible();
	const graduated = page.getByRole('table', { name: 'IV.A · Graduated income tax' });
	const flat = page.getByRole('table', { name: 'IV.B · 8% income tax' });
	const spouseAmount = graduated.locator('tr[data-income-item="36"]');
	await expect(spouseAmount.getByRole('cell').nth(1)).toHaveText('—');
	await expect(spouseAmount.getByRole('cell').nth(2).locator('[id="frm1701A:txt36B"]')).toBeVisible();
	const taxpayerAmount = flat.locator('tr[data-income-item="47"]');
	await expect(taxpayerAmount.getByRole('cell').nth(1).locator('[id="frm1701A:txt47A"]')).toBeVisible();
	await expect(taxpayerAmount.getByRole('cell').nth(2)).toHaveText('—');
	const output = process.env.INCOME_PREVIEW_DIR;
	if (output) {
		mkdirSync(output, { recursive: true });
		await graduated.screenshot({ path: resolve(output, '1701A-joint-schedule.png'), animations: 'disabled' });
	}
	await page.setViewportSize({ width: 390, height: 920 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('June 2013 Form 1701 shows only applicable filing identification and overpayment controls', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { ...fixture, civilStatus: 'Single' });
	await page.goto(`${list}/1701?new=true`);
	const identification = page.getByRole('region', { name: 'Filing identification', exact: true });
	await expect(identification).toBeVisible({ timeout: 20_000 });
	const refund = page.getByRole('combobox', { name: 'Apply overpayment as', exact: true });
	await expect(refund).toHaveCount(0);
	const type = identification.getByRole('radiogroup', { name: 'Identification type', exact: true });
	await type.getByRole('radio', { name: 'Community tax certificate (CTC)', exact: true }).check();
	const certificate = identification.getByRole('textbox', { name: 'CTC number', exact: true });
	await expect(certificate).toHaveAttribute('inputmode', 'numeric');
	await certificate.fill('00123456');
	const amount = identification.getByRole('textbox', { name: 'CTC amount', exact: true });
	await amount.fill('125.50');
	await expect(amount).toHaveCSS('text-align', 'right');
	const output = process.env.INCOME_PREVIEW_DIR;
	if (output) {
		mkdirSync(output, { recursive: true });
		await identification.screenshot({ path: resolve(output, '1701-filing-identification.png'), animations: 'disabled' });
	}
	await type.getByRole('radio', { name: 'Government-issued ID', exact: true }).check();
	await expect(identification.getByRole('textbox', { name: 'Government ID number', exact: true })).toHaveValue('');
	await expect(amount).toHaveCount(0);
	await expect(identification.locator('[data-slot="date-input"]')).toBeVisible();
	await page.setViewportSize({ width: 390, height: 920 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	if (output) await identification.screenshot({ path: resolve(output, '1701-filing-identification-mobile.png'), animations: 'disabled' });
	await goToReturnPage(page, 9);
	const credit = page.locator('[id="frm1701:txtPg9Sc9I1TaxPayerC1"]');
	await credit.fill('500');
	await credit.blur();
	await goToReturnPage(page, 1);
	await refund.click();
	await expect(page.getByRole('option')).toHaveCount(3);
	await expect(page.getByRole('option', { name: 'Tax credit certificate (TCC)', exact: true })).toBeVisible();
	await expect(page.getByRole('option', { name: 'Carry over to next year or quarter', exact: true })).toBeVisible();
	await page.getByRole('option', { name: 'Refund', exact: true }).click();
	await goToReturnPage(page, 9);
	await credit.fill('0');
	await credit.blur();
	await goToReturnPage(page, 1);
	await expect(refund).toHaveCount(0);
	await goToReturnPage(page, 9);
	await credit.fill('500');
	await credit.blur();
	await goToReturnPage(page, 1);
	await expect(refund).toBeVisible();
	await expect(refund).not.toContainText('Refund');
});

test('June 2013 Form 1701 keeps employer fields and historical tax regime amounts in their source groups', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { ...fixture, civilStatus: 'Single' });
	await page.setViewportSize({ width: 1440, height: 960 });
	await page.goto(`${list}/1701?new=true`);
	await goToReturnPage(page, 4);
	await expect(page.getByRole('region', { name: 'Part VIIA · Dependent 1' })).toBeVisible();
	await expect(page.getByRole('region', { name: 'Part VIIB · Current address' })).toBeVisible();
	await expect(page.getByText('Auditor or tax agent TIN and branch code', { exact: true })).toBeVisible();
	await goToReturnPage(page, 5);
	const employer = page.getByRole('region', { name: 'Schedule 1 · Employer 1', exact: true });
	await expect(employer).toBeVisible();
	await expect(employer.getByText('Employer TIN and branch code', { exact: true })).toBeVisible();
	await expect(page.locator('[id="frm1701:txtPg5RegName"]')).toHaveCount(0);
	await goToReturnPage(page, 12);
	const regimes = page.getByRole('table', { name: 'Taxpayer tax regimes' });
	await expect(regimes.getByRole('columnheader')).toHaveText(['Item', 'Description', 'Regular', 'Special', 'Exempt', 'Total']);
	await expect(page.getByRole('table', { name: 'Spouse tax regimes' })).toHaveCount(0);
	await expect(regimes.locator('[id="frm1701:txtPg12Pt9I1SalesC1"]')).toHaveAttribute('inputmode', 'decimal');
	await expect(regimes.locator('[id="frm1701:txtPg12Pt9I1SalesC1"]')).toHaveCSS('text-align', 'end');
	await expect(regimes.locator('[id="frm1701:txtPg12Pt9I1SalesC2"]')).toHaveAttribute('inputmode', 'decimal');
	const output = process.env.INCOME_PREVIEW_DIR;
	if (output) {
		mkdirSync(output, { recursive: true });
		await regimes.screenshot({ path: resolve(output, '1701-2013-tax-regimes.png'), animations: 'disabled' });
	}
	await page.setViewportSize({ width: 390, height: 920 });
	const viewport = page.getByRole('region', { name: 'Taxpayer tax regimes' });
	await expect(viewport).toBeVisible();
	expect(await viewport.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('revised 1701 resets the deduction when the ATC switches to 8%', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { ...fixture, civilStatus: 'Single' });
	await page.goto(`${list}/1701v2018?new=true`);
	const atc = page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true });
	await atc.click({ timeout: 15000 });
	await page.getByRole('option', { name: /II012/ }).click();
	const deduction = page.getByRole('radiogroup', { name: /method of deduction/i });
	await deduction.getByRole('radio', { name: /Itemized/ }).check();
	await atc.click();
	await page.getByRole('option', { name: /II015/ }).click();
	await expect(deduction).toHaveCount(0);
	await atc.click();
	await page.getByRole('option', { name: /II012/ }).click();
	await expect(deduction.getByRole('radio', { name: /Itemized/ })).not.toBeChecked();
});

test('revised 1701Q links the ATC to its applicable schedule and hides unused spouse fields', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'loaded', { ...fixture, civilStatus: 'Single' });
	await page.goto(`${list}/1701Qv2018?new=true`);
	const pager = page.getByRole('navigation', { name: 'Return pages' });
	await expect(pager).toBeVisible({ timeout: 20000 });
	await expect(page.getByText(/BACKGROUND INFORMATION ON SPOUSE/i)).toHaveCount(0);
	const code = page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true });
	await code.selectOption('II015');
	await goToReturnPage(page, 2);
	await expect(page.locator('[id="frm1701q:txt47A"]')).toBeVisible();
	await expect(page.locator('[id="frm1701q:txt36A"]')).toHaveCount(0);
	await expect(page.locator('[id="frm1701q:txt59A"]')).toHaveCount(0);
});

test('1701Q v2018 lets filers remove and restore a saved spouse without changing the profile', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {
		...fixture, civilStatus: 'Married',
		spouse: { taxpayerName: 'SANTOS, TAYLOR, CRUZ', tin1: '765', tin2: '432', tin3: '100', branchCode: '00000', rdoCode: '047' }
	});
	await page.goto(`${list}/1701Qv2018?new=true`);
	const add = page.getByRole('button', { name: 'Use saved spouse details', exact: true });
	const remove = page.getByRole('button', { name: 'Remove spouse from this return', exact: true });
	const spouse = page.locator('[id="frm1701q:txtSpouseName"]');
	await add.click({ timeout: 15000 });
	await expect(spouse).toContainText('SANTOS, TAYLOR, CRUZ');
	await remove.click();
	await expect(spouse).toHaveCount(0);
	await add.click();
	await expect(spouse).toContainText('SANTOS, TAYLOR, CRUZ');
});

test('1700v2018 uses native fields and retains values while paging and reopening', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'loaded', fixture);
	await page.setViewportSize({ width: 1280, height: 1040 });
	await page.goto(`${list}/1700v2018?new=true`);
	const year = page.locator('[id="frm1700:txtPg1I1Year"]');
	await expect(year).toBeVisible({ timeout: 20000 });
	await year.fill('2025');
	await expect(page.getByText('II011', { exact: true })).toBeVisible();
	await page.getByRole('radio', { name: 'Employee (regular rates)' }).check();
	await page.getByRole('radio', { name: 'Single', exact: true }).check();
	await expect(page.getByRole('textbox', { name: '21 Spouse’s full name' })).toHaveCount(0);
	await expect(page.getByRole('button', { name: 'Previous page', exact: true })).toHaveCount(0);
	await expect(page.getByText('Page 1 of 2', { exact: true })).toBeVisible();
	const output = resolve(process.env.INCOME_PREVIEW_DIR ?? 'test-results/individual-income-previews');
	mkdirSync(output, { recursive: true });
	await page.getByRole('button', { name: 'Next page', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Employer details and tax computation', exact: true })).toBeFocused();
	await expect(year).toHaveCount(0);
	await expect(page.getByRole('button', { name: 'Next page', exact: true })).toHaveCount(0);
	const employer = page.getByRole('region', { name: 'Schedule 1 · Employer 1', exact: true });
	await expect(employer.getByRole('radio')).toHaveCount(0);
	await expect(employer.locator('[data-income-item="1"]')).toHaveCount(0);
	const tin = employer.getByRole('textbox', { name: 'Employer TIN and branch code', exact: true });
	const employerName = employer.getByRole('textbox', { name: 'Employer name', exact: true });
	const earnings = employer.getByRole('textbox', { name: 'Graduated-rate compensation', exact: true });
	const taxWithheld = employer.getByRole('textbox', { name: 'Tax withheld', exact: true });
	const employerPositions = await Promise.all([employerName.boundingBox(), tin.boundingBox(), earnings.boundingBox(), taxWithheld.boundingBox()]);
	expect(employerPositions[0]!.y).toBe(employerPositions[1]!.y);
	expect(employerPositions[2]!.y).toBe(employerPositions[3]!.y);
	expect(Math.abs(employerPositions[2]!.width - employerPositions[3]!.width)).toBeLessThan(1);
	await expectAmountEdge(earnings, page.locator('[id="frm1700:txtPg2ISched1c_5AREG"]'));
	await expectAmountEdge(taxWithheld, page.locator('[id="frm1700:txtPg2ISched1e_5ATW"]'));
	await expect(employer.getByRole('textbox', { name: 'Second name line', exact: true })).toHaveCount(0);
	await tin.fill('32165498700000');
	await tin.blur();
	await expect(tin).toHaveValue('321-654-987-00000');
	await expect(employer.getByRole('textbox', { name: '25%-rate compensation', exact: true })).toHaveCount(0);
	await expect(page.getByRole('heading', { name: /^Part V\.B/ })).toHaveCount(0);
	await expect(page.getByRole('textbox', { name: 'Credit or payment description', exact: true })).toBeVisible();
	for (const [id, value] of Object.entries(compensation)) {
		if (!id.startsWith('frm1700:txtPg2') || /EmployerTIN|EmployerBranchCode/.test(id)) continue;
		await page.locator(`[id="${id}"]`).fill(value);
	}
	await expect(page.locator('[id="frm1700:txtPg2I47A"]')).toHaveText('₱152,500.00');
	await expect(page.locator('[id="frm1700:txtPg2I54A"]')).toHaveText('₱100,000.00');
	await expectAmountEdge(page.locator('[id="frm1700:txtPg2I43A"]'), page.locator('[id="frm1700:txtPg2I47A"]'));
	await employer.getByRole('textbox', { name: 'Tax withheld', exact: true }).blur();
	await employer.evaluate(node => node.scrollIntoView({ block: 'center' }));
	await employer.screenshot({ path: resolve(output, '1700v2018-employer-desktop.png') });
	const secondEmployer = page.getByRole('region', { name: 'Schedule 1 · Employer 2', exact: true });
	const secondHeading = secondEmployer.locator('summary').first();
	await secondHeading.click();
	const secondTin = secondEmployer.getByRole('textbox', { name: 'Employer TIN and branch code', exact: true });
	await secondTin.fill('---00007');
	await secondTin.blur();
	await expect(secondTin).toHaveValue('---00007');
	await expect(secondEmployer.getByRole('textbox', { name: 'Second name line', exact: true })).toHaveCount(0);
	await employer.getByRole('heading').evaluate(node => node.scrollIntoView({ block: 'center' }));
	await page.screenshot({ path: resolve(output, '1700v2018-editor-page-2.png') });
	await secondHeading.click();
	await employer.getByText('Add second name line', { exact: true }).click();
	await employer.getByRole('textbox', { name: 'Second name line', exact: true }).fill('PAYROLL DIVISION');
	await page.getByRole('button', { name: 'Previous page', exact: true }).click();
	await expect(year).toHaveValue('2025');
	await expect(page.locator('[id="frm1700:txtPg1I36"]')).toHaveText('₱52,500.00');
	await expectAmountEdge(page.locator('[id="frm1700:txtPg1I31A"]'), page.locator('[id="frm1700:txtPg1I36"]'));
	await page.getByRole('link', { name: /Back to forms/ }).evaluate(node => node.scrollIntoView({ block: 'center' }));
	await page.screenshot({ path: resolve(output, '1700v2018-editor-page-1.png') });
	await page.setViewportSize({ width: 390, height: 920 });
	await page.keyboard.press('Escape');
	await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
	await page.getByRole('link', { name: /Back to forms/ }).evaluate(node => node.scrollIntoView({ block: 'center' }));
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	await expect(year).toBeVisible();
	expect((await year.boundingBox())!.width).toBeGreaterThan(170);
	await page.screenshot({ path: resolve(output, '1700v2018-editor-mobile.png') });
	await page.getByRole('button', { name: 'Next page', exact: true }).click();
	await expect(tin).toHaveValue('321-654-987-00000');
	await expectAmountEdge(earnings, page.locator('[id="frm1700:txtPg2ISched1c_5AREG"]'));
	await expectAmountEdge(taxWithheld, page.locator('[id="frm1700:txtPg2ISched1e_5ATW"]'));
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	await employer.screenshot({ path: resolve(output, '1700v2018-employer-mobile.png') });
	await page.getByRole('button', { name: 'Previous page', exact: true }).click();
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	await page.getByRole('row').filter({ hasText: '1700v2018' }).getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(year).toHaveValue('2025');
	await page.getByRole('button', { name: 'Next page', exact: true }).click();
	await expect(employer.getByRole('textbox', { name: 'Second name line', exact: true })).toHaveValue('PAYROLL DIVISION');
	await expect(secondTin).toHaveValue('---00007');
});

test('joint Form 1700 uses profile identity, keeps one desktop item row, and paginates below the fields', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {
		...fixture,
		birthDate: '1984-02-29',
		citizenship: 'Filipino',
		civilStatus: 'Married',
		spouse: { taxpayerName: 'SANTOS, TAYLOR, CRUZ', tin1: '765', tin2: '432', tin3: '100', branchCode: '00000', rdoCode: '047' }
	});
	await page.setViewportSize({ width: 1440, height: 960 });
	await page.goto(`${list}/1700v2018?new=true`);
	await expect(page.getByText('Page 1 of 2', { exact: true })).toBeVisible({ timeout: 20000 });
	await expect(page.getByText('02/29/1984', { exact: true })).toBeVisible();
	const identity = page.getByRole('region', { name: 'Taxpayer information', exact: true });
	const type = identity.getByRole('radiogroup', { name: 'Taxpayer type', exact: true });
	await expect(type.getByRole('radio', { name: 'Employee (regular rates)', exact: true })).toBeChecked();
	const employee = (await type.getByRole('radio', { name: 'Employee (regular rates)', exact: true }).boundingBox())!;
	const nonresident = (await type.getByRole('radio', { name: 'Nonresident alien (25%)', exact: true }).boundingBox())!;
	expect(Math.abs(employee.y - nonresident.y)).toBeLessThan(1);
	const name = (await identity.locator('[data-profile-key="taxpayerName"]').boundingBox())!;
	const address = (await identity.locator('[data-profile-key="address"]').boundingBox())!;
	expect(name.y).toBe(address.y);
	await expect(identity.locator('header')).toHaveCSS('border-top-width', '0px');
	const foreignCredits = identity.getByRole('radiogroup', { name: /claiming foreign tax credits/i });
	await foreignCredits.getByRole('radio', { name: 'Yes' }).check();
	const foreignNumber = identity.locator('[data-income-item="13"]');
	await expect(foreignNumber).toBeVisible();
	expect((await foreignNumber.boundingBox())!.y).toBe((await identity.locator('[data-income-item="12"]').boundingBox())!.y);
	await foreignCredits.getByRole('radio', { name: 'No' }).check();
	await expect(foreignNumber).toHaveCount(0);
	const backgroundPreview = process.env.INCOME_PREVIEW_DIR;
	if (backgroundPreview) {
		mkdirSync(backgroundPreview, { recursive: true });
		await identity.screenshot({ path: resolve(backgroundPreview, '1700v2018-page-1-background.png') });
	}
	await page.locator('[id="frm1700:rdoPg1I16SpouseHasIncome"]').check();
	await page.getByRole('radio', { name: 'Joint Filing', exact: true }).check();
	await expect(page.getByText('SANTOS, TAYLOR, CRUZ', { exact: true })).toBeVisible();
	const spouseDetails = page.getByRole('region', { name: /Part II - Background Information on Spouse/i });
	await expect(spouseDetails.getByRole('link', { name: 'Edit spouse details', exact: true })).toBeVisible();
	await expect(spouseDetails.getByRole('radio', { name: 'Employee (regular rates)', exact: true })).toBeChecked();
	await expect(spouseDetails.getByRole('radiogroup', { name: /foreign tax credits/i }).getByRole('radio', { name: 'No', exact: true })).toBeChecked();
	const summary = page.getByRole('table', { name: 'Calculated tax amounts' });
	await expect(summary).toBeVisible({ timeout: 3000 });
	const taxDue = summary.getByRole('row', { name: /26.*Tax due/ });
	await expect(taxDue.getByRole('cell', { name: '₱0.00' })).toHaveCount(2);
	await expect(summary.getByText('Calculated', { exact: true })).toHaveCount(0);
	const interest = summary.getByRole('textbox', { name: 'Interest · Taxpayer', exact: true });
	await interest.fill('120');
	await interest.press('Tab');
	await expect(summary.locator('[id="frm1700:txtPg1I36"]')).toHaveText('₱120.00');
	await summary.getByRole('textbox', { name: 'Interest · Spouse', exact: true }).blur();
	const summarySection = page.getByRole('region', { name: /^Part III - Total Tax Payable/i });
	const row = page.locator('[data-income-item="18"]').filter({ has: page.locator('[id="frm1700:txtPg1I18STIN1"]') });
	const first = row.locator('[id="frm1700:txtPg1I18STIN1"]');
	const last = row.locator('[id="frm1700:txtPg1I18SBranchCode"]');
	await expect(first).toContainText('765');
	await expect(last).toContainText('00000');
	expect(Math.abs((await first.boundingBox())!.y - (await last.boundingBox())!.y)).toBeLessThan(1);
	await expect(page.locator('[id="frm1700:txtPg1I38Agency"]')).toHaveCount(0);
	const pager = await page.getByRole('navigation', { name: 'Return pages' }).boundingBox();
	expect(pager!.y).toBeGreaterThan((await row.boundingBox())!.y);
	const output = process.env.INCOME_PREVIEW_DIR;
	if (output) {
		mkdirSync(output, { recursive: true });
		await row.evaluate(node => node.scrollIntoView({ block: 'center' }));
		await page.screenshot({ path: resolve(output, '1700v2018-joint-spouse-row.png') });
		await page.getByRole('navigation', { name: 'Return pages' }).evaluate(node => node.scrollIntoView({ block: 'center' }));
		await page.screenshot({ path: resolve(output, '1700v2018-bottom-pagination.png') });
		await summarySection.screenshot({ path: resolve(output, '1700v2018-tax-summary.png') });
	}
	await page.setViewportSize({ width: 390, height: 920 });
	await page.keyboard.press('Escape');
	await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
	const amountCells = taxDue.getByRole('cell', { name: '₱0.00' });
	expect((await amountCells.first().boundingBox())!.y).toBe((await amountCells.last().boundingBox())!.y);
	const controlEdge = await interest.evaluate(input => input.parentElement!.getBoundingClientRect().right);
	const cell = (await interest.locator('xpath=ancestor::td').boundingBox())!;
	expect(controlEdge).toBeLessThanOrEqual(cell.x + cell.width);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	if (output) await summarySection.screenshot({ path: resolve(output, '1700v2018-tax-summary-mobile.png') });
	const spouseIncome = page.getByRole('radiogroup', { name: /spouse has income/i });
	await spouseIncome.getByRole('radio', { name: 'No', exact: true }).check();
	await expect(summary.getByRole('columnheader', { name: 'Spouse' })).toHaveCount(0);
	await spouseIncome.getByRole('radio', { name: 'Yes', exact: true }).check();
	await expect(page.getByRole('radio', { name: 'Joint Filing', exact: true })).not.toBeChecked();
	await expect(summary.getByRole('columnheader', { name: 'Spouse' })).toHaveCount(0);
	await expect(summary.locator('[id="frm1700:txtPg1I36"]')).toHaveText('₱120.00');
	await expect(page.getByRole('navigation', { name: 'Return pages' })).toHaveCSS('border-top-width', '0px');
	const attachments = summarySection.locator('[id="frm1700:txtPg1I37NumberOfAttachments"]');
	expect((await attachments.boundingBox())!.width).toBeLessThan(180);
	await spouseIncome.getByRole('radio', { name: 'Yes', exact: true }).check();
	await page.getByRole('radio', { name: 'Joint Filing', exact: true }).check();
	await page.getByRole('button', { name: 'Next page', exact: true }).click();
	const earner = page.getByRole('region', { name: 'Schedule 1 · Employer 1', exact: true }).getByRole('radiogroup', { name: 'Income earner' });
	await expect(earner.getByRole('radio', { name: 'Taxpayer', exact: true })).toBeVisible();
	await expect(earner.getByRole('radio', { name: 'Spouse', exact: true })).toBeVisible();
});

for (const [code, count] of Object.entries(cases)) {
	if (code !== '1700v2018') {
		test(`${code} editor paginates the ${count} base pages`, async ({ page }) => {
			await seedWorkspace(page, 'light', 'loaded', fixture);
			await page.setViewportSize({ width: 1280, height: 1040 });
			await page.goto(`${list}/${code}?new=true`);
			await expect(page.getByText(`Page 1 of ${count}`, { exact: true })).toBeVisible({ timeout: 20000 });
			const pager = page.getByRole('navigation', { name: 'Return pages' });
			if (count > 1) await expect(pager.locator('..')).toHaveClass(/taxmate-pagination/);
			if (count > 4) {
				await expect(pager.getByRole('button', { name: 'Page 1', exact: true })).toHaveAttribute('aria-current', 'page');
				await expect(pager.getByRole('button', { name: `Page ${count}`, exact: true })).toBeVisible();
				await expect(pager.getByText('…', { exact: true })).toBeVisible();
			}
			const output = process.env.INCOME_PREVIEW_DIR;
			const checkLegacyAmounts = async () => {
				if (code !== '1701') return;
				const misaligned = await page.locator('.income-editor input[inputmode="decimal"]').evaluateAll(inputs =>
					inputs.filter(input => input.getClientRects().length && !['right', 'end'].includes(getComputedStyle(input).textAlign)).map(input => input.id));
				expect(misaligned).toEqual([]);
			};
			await checkLegacyAmounts();
			if (output) {
				mkdirSync(output, { recursive: true });
				await page.screenshot({ path: resolve(output, `${code}-editor-page-1.png`) });
			}
			for (let number = 2; number <= count; number++) {
				await page.getByRole('button', { name: 'Next page', exact: true }).click();
				await expect(page.getByText(`Page ${number} of ${count}`, { exact: true })).toBeVisible();
				await checkLegacyAmounts();
				if (output) await page.screenshot({ path: resolve(output, `${code}-editor-page-${number}.png`) });
			}
			const next = page.getByRole('button', { name: 'Next page', exact: true });
			await expect(next).toHaveCount(0);
			await page.setViewportSize({ width: 390, height: 920 });
			await page.keyboard.press('Escape');
			await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
			if (count > 1) {
				await goToReturnPage(page, 1);
				await expect(pager.locator('.page-summary')).toContainText(`Page 1 of ${count}`);
			}
			expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
			if (output) await page.screenshot({ path: resolve(output, `${code}-editor-mobile.png`) });
		});
	}
	for (const paper of code === '1700v2018' || code === '1701A' ? ['a4', 'long'] :
		code === '1701v2018' || code === '1701MS' ? ['a4', 'legal'] : ['a4']) {
		test(`${code} ${paper} produces ${count} source-aligned PDF pages`, async ({ page, context }, testInfo) => {
			await page.route('**/__pdf-preview-test', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>PDF preview test</title>' }));
			await page.goto('/__pdf-preview-test');
			const html = await page.evaluate(async ({ code, paper, fixture, compensation }) => {
				const base = '/src/lib';
				const { getFormDefinition } = await import(`${base}/forms/index.ts`);
				const { getIndividualIncomeForm, createIndividualIncomeValues } = await import(`${base}/forms/individual-income/index.ts`);
				const { buildReturnReport } = await import(`${base}/printing/return-report.ts`);
				const form = getIndividualIncomeForm(code);

				const values = { ...createIndividualIncomeValues(form, fixture), [form.year]: ['1700', '1701', '1701Q'].includes(code) ? '2017' : '2025' };
				if (code === '1701A') Object.assign(values, {
					'frm1701A:txt36A': '1000000', 'frm1701A:optTaxType': 'S', 'frm1701A:optATC': 'II012',
					'frm1701A:txtmodalPartIVADesc_1C1': 'Service income adjustment', 'frm1701A:txtmodalPartIVA_1C2': '5000',
					'frm1701A:txtmodalPartIVADesc_2C1': 'Miscellaneous income', 'frm1701A:txtmodalPartIVA_2C2': '2500'
				});
				if (code === '1701v2018') Object.assign(values, {
					'frm1701:rdoPg1I21TaxRate': 'Graduated',
					'frm1701:rdoPg1I21AMethodDeduction': 'OSD',
					'frm1701:txtPg2IShed3_8A': '1250000'
				});
				if (code === '1701MS') Object.assign(values, {
					'frm1701MS:sourceOfIncomeTaxpayer': '3',
					'frm1701MS:txtTaxpayerNo12a': '3',
					'frm1701MS:txtSalesRevenuesFeesANo19a': '500000'
				});
				if (code === '1701Q') Object.assign(values, {
					'frm1701q:txt26A': '100000',
					'frm1701q:txt27A': '10000',
					'frm1701:optMethodOfDeduction23': 'O'
				});
				if (code === '1701Qv2018') Object.assign(values, {
					'frm1701q:optATC': 'II012',
					'frm1701q:optTaxRate': 'Graduated',
					'frm1701q:optMethodOfDeduction': 'I',
					'frm1701q:txt36A': '400000'
				});
				if (code === '1700') Object.assign(values, {
					GovorCTC: 'Gov',
					'frm1700:SourceOfIncome_2': 'N',
					'frm1700:txtPg1Pt2I32GovID': 'SAMPLEID42',
					'frm1700:txtPg1Pt2I34Amount': '98765.00',
					'frm1700:txtPg1Pt2I36DraweeBank': 'SUPPRESSED PAYMENT',
					'frm1700:txtPg2Pt4I1NameOfEmployer': 'SAMPLE EMPLOYER',
					'frm1700:rdoPg2Pt4I1Employer': 'frm1700:rdoPg2Pt4I1TaxFiler',
					'frm1700:txtPg2Pt4I1ComIncomeC1': '420000',
					'frm1700:txtPg1Pt1I9AddressChangedInd': 'Y',
					'frm1700:txtPg4T1Barangay': 'SAMPLE BARANGAY',
					'frm1700:txtPg3Pt5BI1': '1825',
					'frm1700:txtPg3Pt5I1AAFM': '1250',
					'frm1700:txtPg3Pt5I1FinalTaxWithheld': '250',
					'frm1700:txtPg3Pt5I7C1': 'SAMPLE PARCEL',
					'frm1700:txtPg3Pt5I10C1': '50000',
					'frm1700:txtPg3Pt5I11C1': '3000',
					'frm1700:drpPg3Pt5I12A1': 'CS',
					'frm1700:txtPg3Pt5I12C1': 'STK123',
					'frm1700:txtPg3Pt5I14C1': '75',
					'frm1700:txtPg3Pt5I15DateofIssueC1': '06/15/2017',
					'frm1700:txtPg3Pt5BI4A': 'SAMPLE DONATED LAND',
					'frm1700:txtPg3Pt5BI5A': 'DONATION',
					'frm1700:txtPg3Pt5BI7A': '1200',
					'frm1700:txtPg1Pt1I10DOB': '02/29/1984',
					'frm1700:rdoPg1Pt1I13CivilStatusInd': 'frm1700:rdoPg1Pt1I13MarriedInd',
					'frm1700:rdoPg1Pt1I3JointFiling': 'frm1700:rdoPg1Pt1I3JointFilingYes',
					'frm1700:rdoPg1Pt1I14ClaimingAdditionalExemptions': 'frm1700:rdoPg1Pt1I14YesInd',
					'frm1700:rdoPg1Pt1I21SpouseClaimAdditionalExemption': 'frm1700:rdoPg1Pt1I21SpouseClaimAdditionalExemptionYes',
					'frm1700:txtPg1Pt1I15QualifyDependent': '4',
					'frm1700:txtPg1Pt1I22SpouseQualifiedDependentChildren': '4',
					'frm1700:txtPg4T2LastName1': 'SANTOS',
					'frm1700:txtPg4T2FirstName1': 'JAMIE',
					'frm1700:txtPg4T2DependentDOB1': '02/02/2011'
				});
				if (code === '1700v2018') Object.assign(values, compensation, {
					'frm1700:rdoPg2I1PartVIEmployee': '', 'frm1700:txtPg1I38Agency': 'TEST PAYMENT INSTRUMENT'
				});
				return buildReturnReport(getFormDefinition(code), values, 'Draft', paper);
			}, { code, paper, fixture, compensation });
			const print = await context.newPage();
			const sampleSource = 'FICTIONAL SAMPLE - FOR REVIEW ONLY';
			await print.setContent(html.replaceAll('__EBIRFORMS_PRINT_SOURCE_URL__', sampleSource));
			await print.emulateMedia({ media: 'print' });
			await expect(print.locator('.withholding-print-page')).toHaveCount(count);
			expect(await print.locator('script, iframe, object').count()).toBe(0);
			const path = testInfo.outputPath(`${code}-${paper}.pdf`);
			await print.pdf({ path, preferCSSPageSize: true, printBackground: true, tagged: true });
			const pdfinfo = execFileSync('pdfinfo', [path], { encoding: 'utf8' });
			expect(pdfinfo).toMatch(new RegExp(`Pages:\\s+${count}\\b`));
			await expect(print.locator('.withholding-page-footer .pdf-report-source')).toHaveText(Array(count).fill(sampleSource));
			if (code === '1700') {
				const [first, second, third, fourth] = execFileSync('pdftotext', ['-layout', path, '-'], { encoding: 'utf8' }).split('\f');
				const backgrounds = print.locator('.legacy-1700-print-background');
				await expect(backgrounds).toHaveCount(4);
				const backgroundBoxes = await backgrounds.evaluateAll(images => images.map(image => {
					const bounds = image.getBoundingClientRect();
					const page = image.closest('.withholding-print-page')!.getBoundingClientRect();
					return [bounds.x - page.x, bounds.y - page.y, bounds.width, bounds.height];
				}));
				expect(new Set(backgroundBoxes.map(([, , width, height]) => `${width}:${height}`)).size).toBe(1);
				expect(backgroundBoxes[0][0]).toBe(backgroundBoxes[1][0]);
				expect(backgroundBoxes[2][1]).toBeLessThan(backgroundBoxes[1][1]);
				expect(backgroundBoxes[3][0]).toBeLessThan(backgroundBoxes[1][0]);
				await expect(print.locator('input, select, textarea')).toHaveCount(0);
				const headers = print.locator('.withholding-page-header');
				const footers = print.locator('.withholding-page-footer');
				await expect(headers).toHaveCount(4);
				await expect(footers).toHaveCount(4);
				await expect(print.locator('body > .pdf-report-header')).toBeHidden();
				await expect(print.locator('body > .pdf-report-footer')).toBeHidden();
				const reportDate = new Intl.DateTimeFormat('en-GB').format(new Date());
				for (const [index, text] of [first, second, third, fourth].entries()) {
					await expect(headers.nth(index)).toContainText(`Page ${index + 1} of 4`);
					await expect(footers.nth(index).locator('.pdf-report-source')).toHaveText(sampleSource);
					expect(text).toContain('BIR Form No. 1700');
					expect(text).toContain(`Page ${index + 1} of 4`);
					expect(text).not.toContain('TaxMate PH');
					expect(text.split(sampleSource)).toHaveLength(2);
					expect(text.trimEnd().endsWith(reportDate)).toBe(true);
					const headerBox = (await headers.nth(index).boundingBox())!;
					const footerBox = (await footers.nth(index).boundingBox())!;
					const formBox = (await print.locator('.legacy-1700-ocr').nth(index).boundingBox())!;
					expect(headerBox.y + headerBox.height).toBeLessThan(formBox.y);
					expect(formBox.y + formBox.height).toBeLessThan(footerBox.y);
				}
				const slot = (id: string) => print.locator(`[data-legacy-print-id="${id}"]`);
				expect(first).toContain('SAMPLEID42');
				await expect(slot('txtPg1Pt1I7Psoc')).toHaveText('0110');
				await expect(slot('txtPg1Pt1I5BranchCode')).toHaveText('00008');
				await expect(slot('txtPg2Pt4BranchCode')).toHaveText('00008');
				await expect(slot('txtPg3Pt5BranchCode')).toHaveText('00008');
				await expect(slot('txtPg4BranchCode')).toHaveText('00008');
				await expect(slot('txtPg1Pt1I10DOB3')).toHaveText('1984');
				await expect(slot('SourceOfIncome_1')).toHaveText('X');
				await expect(slot('SourceOfIncome_2')).toHaveText('X');
				await expect(slot('txtPg1Pt1I15QualifyDependent')).toHaveText('1');
				await expect(slot('txtPg1Pt1I22SpouseQualifiedDependentChildren')).toBeEmpty();
				await expect(slot('rdoPg1Pt1I21SpouseClaimAdditionalExemptionNo')).toHaveText('X');
				expect(second).toMatch(/25,?000\.00/);
				expect(second).toContain('SAMPLE EMPLOYER');
				expect(fourth).toContain('JAMIE');

				expect(first).not.toMatch(/98,?765/);
				expect(first).not.toContain('SUPPRESSED PAYMENT');
				expect(second).toContain('SANTOS');
				expect(third).toContain('SAMPLE PARCEL');
				expect(third).toContain('STK123');
				expect(third).toContain('SAMPLE DONATED LAND');
				await expect(slot('drpPg3Pt5I12A1')).toHaveText('CS');
				await expect(slot('drpPg3Pt5I12B2')).toBeEmpty();
				await expect(slot('txtPg3Pt5I15DateofIssueC1_1')).toHaveText('06');
				await expect(slot('txtPg3Pt5I15DateofIssueC1_2')).toHaveText('15');
				await expect(slot('txtPg3Pt5I15DateofIssueC1_3')).toHaveText('2017');
				expect(third).toMatch(/3,?250\.00/);
				expect(third).toMatch(/3,?025\.00/);
				expect(fourth).toContain('SAMPLE BARANGAY');
			}
			if (code === '1700v2018') {
				const text = execFileSync('pdftotext', ['-layout', path, '-'], { encoding: 'utf8' });
				expect(text).toContain('1209');
				expect(text).not.toContain('TEST PAYMENT INSTRUMENT');
				expect(text).toMatch(/001\s*-?\s*234\s*-?\s*567\s*-?\s*00008/);
				expect(text).toMatch(/52,?500\.00/);
				expect(text.split(sampleSource)).toHaveLength(3);
			}
			if (code === '1701A') {
				const text = execFileSync('pdftotext', ['-layout', path, '-'], { encoding: 'utf8' });
				expect(text).toMatch(/400,?000\.00/);
				expect(text).toMatch(/42\s+OTHERS\s+42A\s+7,?500\.00/);
				expect(text).toMatch(/7,?500\.00/);
				expect(text).toMatch(/607,?500\.00/);
				expect(text).toMatch(/20A\s+64,?000\.00/);
				expect(text).toMatch(/46A\s+64,?000\.00/);
			}
			if (process.env.INCOME_PREVIEW_DIR) {
				const output = resolve(process.env.INCOME_PREVIEW_DIR ?? 'test-results/individual-income-previews');
				mkdirSync(output, { recursive: true });
				const preview = resolve(output, `${code}-${paper}`);
				await print.pdf({ path: `${preview}.pdf`, preferCSSPageSize: true, printBackground: true, tagged: true });
				execFileSync('pdftoppm', ['-r', '90', '-png', `${preview}.pdf`, preview]);
			}
			await print.close();
		});
	}
}

test('legacy 1700 summarizes profile fields and reveals the applicable identification controls', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'loaded', { ...fixture, birthDate: '1984-02-29', civilStatus: 'Single' });
	await page.setViewportSize({ width: 1440, height: 960 });
	await page.goto(`${list}/1700?new=true`);
	const profile = page.getByRole('region', { name: 'Taxpayer information', exact: true });
	await expect(profile.locator('[data-profile-key="psocCode"]')).toContainText('0110', { timeout: 20000 });
	await expect(profile.getByRole('textbox', { name: 'Occupation code (PSOC)', exact: true })).toHaveCount(0);
	await expect(profile).toContainText('SANTOS, ALEX, REYES');
	await expect(profile).toContainText('02/29/1984');
	await expect(profile).toContainText('Single');
	await expect(page.locator('[id="frm1700:txtPg1Pt1I9Address3"]')).toHaveCount(0);
	const pagesFiled = page.getByRole('textbox', { name: 'Number of pages filed', exact: true });
	await expect(pagesFiled).toHaveCount(1);
	await pagesFiled.pressSequentially('A4.3');
	await expect(pagesFiled).toHaveValue('43');
	await expect(page.locator('[id="frm1700:txtPg1Pt2I32GovID"]')).toHaveCount(0);
	await page.getByRole('radio', { name: 'Government-issued ID', exact: true }).check();
	await expect(page.getByRole('textbox', { name: 'Government ID number', exact: true })).toBeVisible();
	await expect(page.locator('[id="frm1700:txtPg1Pt2I34Amount"]')).toHaveCount(0);
	await page.getByRole('radio', { name: 'Community tax certificate (CTC)', exact: true }).check();
	await expect(page.getByRole('textbox', { name: 'CTC number', exact: true })).toBeVisible();
	await expect(page.getByRole('textbox', { name: 'CTC amount', exact: true })).toBeVisible();

	const capture = async (name: string, locator: ReturnType<typeof page.getByRole>) => {
		if (!process.env.INCOME_PREVIEW_DIR) return;
		const output = resolve(process.env.INCOME_PREVIEW_DIR);
		mkdirSync(output, { recursive: true });
		await locator.evaluate(node => node.scrollIntoView({ block: 'center' }));
		await page.mouse.move(4, 4);
		await page.screenshot({ path: resolve(output, `1700-2013-${name}.png`) });
	};
	const pager = page.getByRole('navigation', { name: 'Return pages' });
	const identification = page.getByRole('region', { name: 'Filing identification' });
	const addressChanged = page.getByRole('checkbox', { name: 'Registered address changed', exact: true });
	await expect(addressChanged).toHaveAttribute('type', 'checkbox');
	await expect(addressChanged.locator('xpath=ancestor::label[1]')).toContainText('Registered address changed');
	await addressChanged.focus();
	await page.keyboard.press('Space');
	await expect(addressChanged).toBeChecked();
	await expect(pager.getByRole('button', { name: 'Page 1', exact: true })).toHaveAttribute('aria-current', 'page');
	expect((await pager.boundingBox())!.y).toBeGreaterThan((await identification.boundingBox())!.y);
	await capture('identification-and-pagination', pager);

	await goToReturnPage(page, 2);
	await expect(page.getByRole('heading', { name: 'Employers and tax computation' })).toBeFocused();
	const employer = page.getByRole('region', { name: 'Part IV · Employer 1', exact: true });
	const income = employer.getByRole('textbox', { name: 'Compensation income', exact: true });
	const withheld = employer.getByRole('textbox', { name: 'Tax withheld', exact: true });
	await expect(employer.getByRole('radiogroup', { name: 'Income earner' })).toHaveCount(0);
	await employer.getByRole('textbox', { name: 'Employer name', exact: true }).fill('Example Employer');
	await income.fill('420000');
	await income.blur();
	await expect(income).toHaveValue('420,000.00');
	await withheld.fill('18000');
	await withheld.blur();
	await expect(page.locator('[id="frm1700:txtPg2Pt4I4AC1"]')).toHaveText('₱420,000.00');
	await expect(page.locator('[id="frm1700:txtPg2Pt4I4AC2"]')).toHaveText('₱18,000.00');
	expect((await income.boundingBox())!.y).toBe((await withheld.boundingBox())!.y);
	await capture('page-2', employer.getByRole('heading'));

	await pager.getByRole('button', { name: 'Next page', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Supplemental income' })).toBeFocused();
	await expect(page.getByText('Summation', { exact: false })).toHaveCount(0);
	await expect(page.getByRole('region', { name: 'Share transactions' })).toBeVisible();
	await expect(page.locator('[id="frm1700:txtPg3Pt5BI10TotalIncome"]')).toHaveText('₱0.00');
	const property = page.getByRole('region', { name: 'Real property transactions', exact: true }).locator('summary');
	await property.click();
	await capture('page-3', property);

	await goToReturnPage(page, 4);
	const address = page.getByRole('region', { name: 'Table 1 · Current address' });
	await expect(address.getByRole('textbox', { name: 'Municipality or city' })).toBeVisible();
	await expect(address.locator('[data-income-item]')).toHaveCount(0);
	await expect(pager.getByRole('button', { name: 'Next page', exact: true })).toHaveCount(0);
	await capture('page-4', address.getByRole('heading'));

	await goToReturnPage(page, 1);
	await addressChanged.locator('xpath=ancestor::label[1]').click();
	await expect(addressChanged).not.toBeChecked();
	await goToReturnPage(page, 4);
	await expect(address).toHaveCount(0);
	await expect(page.getByText('This schedule applies', { exact: false })).toBeVisible();
	await goToReturnPage(page, 2);
	await expect(income).toHaveValue('420,000.00');
	await page.setViewportSize({ width: 390, height: 920 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	expect((await income.boundingBox())!.y).toBeLessThan((await withheld.boundingBox())!.y);
	await page.keyboard.press('Escape');
	await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
	await capture('mobile-pagination', pager);
});

test('legacy 1700 keeps Part I in order and derives the dependent count from page 4', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'loaded', { ...fixture, contactNumber: '000' });
	await page.setViewportSize({ width: 1440, height: 960 });
	await page.goto(`${list}/1700?new=true`);
	const profile = page.getByRole('region', { name: 'Taxpayer information', exact: true });
	await expect(profile).toBeVisible({ timeout: 20000 });
	await expect(page.getByRole('heading', { name: /^Part I [·-] Background Information/ })).toHaveCount(1);
	await expect(profile.locator('[data-profile-key="address"]')).toContainText('Registered address changed');
	await expect(profile.getByRole('link', { name: 'Edit taxpayer information', exact: true }).locator('svg')).toBeVisible();
	await expect(profile.locator('[data-profile-key="birthDate"]')).toContainText('Required');
	await expect(profile.locator('[data-profile-key="civilStatus"]')).toContainText('Required');
	await expect(profile.locator('[data-profile-key="contactNumber"]')).toContainText('Enter a valid contact number');
	const psoc = profile.locator('[data-profile-key="psocCode"]');
	await expect(psoc).toContainText('0110');
	expect((await psoc.boundingBox())!.y).toBeLessThan((await profile.locator('[data-profile-key="address"]').boundingBox())!.y);

	const claim = profile.getByRole('radiogroup', { name: 'Claiming additional exemptions?', exact: true });
	const count = page.locator('[id="frm1700:txtPg1Pt1I15QualifyDependent"]');
	await expect(claim.getByRole('radio', { name: 'No', exact: true })).toBeChecked();
	await expect(count).toHaveCount(0);
	await claim.getByRole('radio', { name: 'Yes', exact: true }).check();
	await expect(count).toHaveText('0');
	await profile.getByRole('button', { name: 'Edit dependents on page 4' }).click();
	const first = page.getByRole('region', { name: 'Table 2 · Dependent 1', exact: true });
	await first.getByRole('textbox', { name: 'Last name', exact: true }).fill('SANTOS');
	await first.getByRole('textbox', { name: 'First name', exact: true }).fill('JAMIE');
	const middleInitial = first.getByRole('textbox', { name: 'Middle initial', exact: true });
	await middleInitial.pressSequentially('AB');
	await expect(middleInitial).toHaveValue('A');
	expect((await middleInitial.boundingBox())!.width).toBeLessThanOrEqual(96);
	await first.getByRole('spinbutton', { name: 'Month', exact: true }).fill('02');
	await first.getByRole('spinbutton', { name: 'Day', exact: true }).fill('02');
	await first.getByRole('spinbutton', { name: 'Year', exact: true }).fill('2011');
	await page.getByRole('button', { name: 'Add dependent', exact: true }).click();
	await expect(page.getByRole('region', { name: 'Table 2 · Dependent 2', exact: true })).toBeVisible();

	const output = process.env.INCOME_PREVIEW_DIR;
	if (output) {
		mkdirSync(output, { recursive: true });
		await first.screenshot({ path: resolve(output, '1700-2013-dependent-editor.png') });
	}
	const pager = page.getByRole('navigation', { name: 'Return pages' });
	await goToReturnPage(page, 1);
	await expect(count).toHaveText('1');
	if (output) {
		await profile.evaluate(node => node.scrollIntoView({ block: 'center' }));
		await profile.screenshot({ path: resolve(output, '1700-2013-part-i.png') });
	}
	await claim.getByRole('radio', { name: 'No', exact: true }).check();
	await expect(count).toHaveCount(0);
	await claim.getByRole('radio', { name: 'Yes', exact: true }).check();
	await expect(count).toHaveText('1');
	await page.getByRole('radiogroup', { name: 'Joint return?', exact: true }).getByRole('radio', { name: 'Yes', exact: true }).check();
	const spouseClaim = profile.getByRole('radiogroup', { name: 'Spouse claiming additional exemptions?', exact: true });
	await spouseClaim.getByRole('radio', { name: 'Yes', exact: true }).check();
	await expect(claim.getByRole('radio', { name: 'No', exact: true })).toBeChecked();
	await expect(count).toHaveCount(0);
	await expect(page.locator('[id="frm1700:txtPg1Pt1I22SpouseQualifiedDependentChildren"]')).toHaveText('1');
});

test('legacy 1700 aligns filing details and groups both income sources under item 4', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'loaded', fixture);
	await page.setViewportSize({ width: 1440, height: 960 });
	await page.goto(`${list}/1700?new=true`);
	const filing = page.getByRole('region', { name: 'Filing details', exact: true });
	const year = filing.getByRole('textbox', { name: 'Filing year', exact: true });
	await expect(year).toBeVisible({ timeout: 20000 });
	const amended = filing.getByRole('radiogroup', { name: 'Amended return?', exact: true });
	const joint = filing.getByRole('radiogroup', { name: 'Joint return?', exact: true });
	const sources = filing.getByRole('group', { name: 'Source of income', exact: true });
	await expect(sources).toBeVisible();
	await expect(filing.locator('[data-income-item]')).toHaveCount(4);
	const cells = await filing.locator('[data-income-item]').evaluateAll(items => items.map(item => item.getBoundingClientRect().top));
	expect(cells.every(top => top === cells[0])).toBe(true);
	await expect(amended.getByRole('radio', { name: 'No', exact: true })).toBeChecked();
	await expect(joint.getByRole('radio', { name: 'Yes', exact: true })).not.toBeChecked();
	await year.fill('2018');
	await expect(year).toHaveAttribute('aria-invalid', 'true');
	await year.fill('2017');
	await expect(year).not.toHaveAttribute('aria-invalid', 'true');
	const compensationSource = sources.getByRole('checkbox', { name: /Compensation income.*II011/i });
	const otherSource = sources.getByRole('checkbox', { name: /Other income.*II041/i });
	await expect(compensationSource).toBeChecked();
	await otherSource.locator('xpath=ancestor::label[1]').click();
	await expect(otherSource).toBeChecked();
	await expect(compensationSource).toBeChecked();
	await joint.getByRole('radio', { name: 'Yes', exact: true }).check();
	const output = process.env.INCOME_PREVIEW_DIR;
	if (output) {
		mkdirSync(output, { recursive: true });
		await filing.screenshot({ path: resolve(output, '1700-2013-filing-details.png') });
	}
	await page.setViewportSize({ width: 390, height: 920 });
	await page.keyboard.press('Escape');
	await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	expect((await sources.boundingBox())!.y).toBeGreaterThan((await joint.boundingBox())!.y);
	if (output) await filing.screenshot({ path: resolve(output, '1700-2013-filing-details-mobile.png') });
});

test('legacy 1700 identification controls fit narrow screens without overlap', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'loaded', fixture);
	await page.setViewportSize({ width: 500, height: 920 });
	await page.goto(`${list}/1700?new=true`);
	const section = page.locator('section[aria-labelledby="legacy-1700-identification"]');
	const certificate = section.getByRole('radio', { name: 'Community tax certificate (CTC)', exact: true });
	await expect(certificate).toBeVisible({ timeout: 20000 });
	await page.keyboard.press('Escape');
	await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
	await certificate.check();

	const number = section.getByRole('textbox', { name: 'CTC number', exact: true });
	const issueDate = section.locator('[data-slot="date-input"]');
	const amount = section.getByRole('textbox', { name: 'CTC amount', exact: true });
	const place = section.getByRole('textbox', { name: 'Place of issue', exact: true });
	for (const width of [500, 390]) {
		await page.setViewportSize({ width, height: 920 });
		const bounds = (await section.boundingBox())!;
		const controls = await Promise.all([number, issueDate, amount, place].map(locator => locator.boundingBox()));
		for (const [index, control] of controls.entries()) {
			expect(control!.x + control!.width).toBeLessThanOrEqual(bounds.x + bounds.width);
			if (index) expect(control!.y).toBeGreaterThan(controls[index - 1]!.y + controls[index - 1]!.height);
		}
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
	}
	if (process.env.INCOME_PREVIEW_DIR) {
		const output = resolve(process.env.INCOME_PREVIEW_DIR);
		mkdirSync(output, { recursive: true });
		await section.evaluate(node => node.scrollIntoView({ block: 'center' }));
		await section.screenshot({ path: resolve(output, '1700-2013-filing-identification-mobile.png') });
	}
});

test('legacy 1700 shows a compact tax summary on narrow screens', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'loaded', { ...fixture, civilStatus: 'Single' });
	await page.setViewportSize({ width: 390, height: 920 });
	await page.goto(`${list}/1700?new=true`);
	const summary = page.getByRole('table', { name: 'Calculated tax amounts', exact: true });
	await expect(summary).toBeVisible({ timeout: 20000 });
	await page.keyboard.press('Escape');
	await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
	const row = summary.getByRole('row', { name: /23.*Taxpayer tax due/ });
	await expect(row.getByRole('cell', { name: '₱0.00', exact: true })).toBeVisible();
	await expect(summary.getByRole('row', { name: /24.*Spouse/ })).toHaveCount(0);
	await expect(summary.getByRole('row', { name: /31.*Amount payable upon filing/ })).toBeVisible();
	const label = (await row.getByRole('rowheader').boundingBox())!;
	const amount = (await row.getByRole('cell', { name: '₱0.00', exact: true }).boundingBox())!;
	expect(amount.x).toBeGreaterThanOrEqual(label.x + label.width);
	expect(amount.y).toBe(label.y);
	expect((await row.boundingBox())!.height).toBeLessThan(65);
	await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	const profile = page.getByRole('region', { name: 'Taxpayer information', exact: true });
	await profile.getByRole('radiogroup', { name: 'Claiming additional exemptions?', exact: true })
		.getByRole('radio', { name: 'Yes', exact: true }).check();
	const dependents = profile.locator('[data-income-item="15"]');
	const count = dependents.locator('output');
	await expect(count).toHaveText('0');
	const countLabel = (await dependents.getByText('Qualified dependent children', { exact: true }).boundingBox())!;
	const countValue = (await count.boundingBox())!;
	expect(countValue.x).toBeGreaterThanOrEqual(countLabel.x + countLabel.width);
	expect(Math.abs(countValue.y - countLabel.y)).toBeLessThan(8);
	await expect(dependents.getByRole('button', { name: 'Edit dependents on page 4' })).toBeVisible();

	if (process.env.INCOME_PREVIEW_DIR) {
		const output = resolve(process.env.INCOME_PREVIEW_DIR);
		mkdirSync(output, { recursive: true });
		await summary.evaluate(node => node.scrollIntoView({ block: 'center' }));
		await summary.screenshot({ path: resolve(output, '1700-2013-tax-summary-mobile.png') });
		await dependents.evaluate(node => node.scrollIntoView({ block: 'center' }));
		await dependents.screenshot({ path: resolve(output, '1700-2013-dependent-count-mobile.png') });
		await page.setViewportSize({ width: 1440, height: 960 });
		await summary.evaluate(node => node.scrollIntoView({ block: 'center' }));
		await summary.screenshot({ path: resolve(output, '1700-2013-tax-summary.png') });
	}
});

test('legacy 1700 has single section dividers and complete field-grid seams', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'loaded', fixture);
	await page.setViewportSize({ width: 1440, height: 960 });
	await page.goto(`${list}/1700?new=true`);
	const filing = page.getByRole('region', { name: 'Filing details', exact: true }).locator('.income-fields');
	const profile = page.getByRole('region', { name: 'Taxpayer information', exact: true });
	await expect(profile).toBeVisible({ timeout: 20000 });
	await expect(filing).toHaveCSS('border-bottom-width', '1px');
	await expect(filing).toHaveCSS('column-gap', '1px');
	await expect(filing.locator(':scope > div').last()).toHaveCSS('border-right-width', '0px');
	await expect(profile.locator(':scope > header')).toHaveCSS('border-top-width', '0px');
	await expect(profile.locator('.profile-grid')).toHaveCSS('border-bottom-width', '1px');

	const identification = page.locator('section[aria-labelledby="legacy-1700-identification"]');
	await identification.getByRole('radio', { name: 'Community tax certificate (CTC)', exact: true }).check();
	const idGrid = identification.locator('.filing-identification');
	await expect(idGrid).toHaveCSS('row-gap', '1px');
	await expect(idGrid).toHaveCSS('column-gap', '1px');
	await expect(idGrid).toHaveCSS('border-bottom-width', '1px');
	const pager = page.getByRole('navigation', { name: 'Return pages' });
	for (const number of [1, 2, 3, 4]) {
		await expect(pager).toHaveCSS('border-top-width', '0px');
		if (number < 4) await pager.getByRole('button', { name: 'Next page', exact: true }).click();
	}
	const emptySchedule = page.locator('.schedule-empty').filter({ hasText: 'This schedule applies' });
	await expect(emptySchedule).toHaveCSS('border-bottom-width', '1px');
	await page.setViewportSize({ width: 390, height: 920 });
	await page.keyboard.press('Escape');
	await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
	await goToReturnPage(page, 1);
	await expect(filing).toHaveCSS('row-gap', '1px');
	await expect(pager).toHaveCSS('border-top-width', '0px');
});

test('legacy 1700 groups employer TIN entry and preserves each saved segment', async ({ page, context }, testInfo) => {
	await seedWorkspace(page, 'light', 'loaded', { ...fixture, civilStatus: 'Single' });
	await page.setViewportSize({ width: 1440, height: 960 });
	await page.goto(`${list}/1700?new=true`);
	await goToReturnPage(page, 2);
	const employer = (number: number) => page.getByRole('region', { name: `Part IV · Employer ${number}`, exact: true });
	const tin = (number: number) => employer(number).getByRole('textbox', { name: 'Employer TIN and branch code', exact: true });
	await expect(tin(1)).toBeVisible();
	await expect(tin(1)).toHaveAttribute('maxlength', '17');
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await page.evaluate(() => navigator.clipboard.writeText('001-024-350-00008'));
	await tin(1).focus();
	await page.keyboard.press('ControlOrMeta+V');
	await page.keyboard.press('Tab');
	await expect(employer(1).getByRole('textbox', { name: 'Compensation income', exact: true })).toBeFocused();
	await expect(tin(1)).toHaveValue('001-024-350-00008');
	await employer(2).locator('summary').click();
	await tin(2).fill('---00007');
	await tin(2).blur();
	await expect(tin(2)).toHaveValue('---00007');
	await employer(3).locator('summary').click();
	await tin(3).fill('065-043-021-00009');
	await tin(3).blur();

	for (const width of [1440, 320]) {
		await page.setViewportSize({ width, height: 960 });
		if (width === 320) {
			await page.keyboard.press('Escape');
			await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
		}
		const bounds = await tin(1).evaluate(input => {
			const { left, right } = input.getBoundingClientRect();
			const style = getComputedStyle(input);
			const canvas = document.createElement('canvas').getContext('2d')!;
			canvas.font = `${style.fontSize} ${style.fontFamily}`;
			const textWidth = canvas.measureText((input as HTMLInputElement).value).width;
			return { left, right, fits: textWidth <= input.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) };
		});
		expect(bounds.fits).toBe(true);
		expect(bounds.left).toBeGreaterThanOrEqual(0);
		expect(bounds.right).toBeLessThanOrEqual(width);
		if (width === 1440) {
			for (const [identity, amount] of [['Employer name', 'Compensation income'], ['Employer TIN and branch code', 'Tax withheld']]) {
				const boxes = await employer(1).getByRole('textbox', { name: identity, exact: true })
					.or(employer(1).getByRole('textbox', { name: amount, exact: true })).evaluateAll(inputs => inputs.map(input => {
						const { left, right } = input.parentElement!.getBoundingClientRect();
						return { left, right };
					}));
				expect(boxes[0], `${amount} aligns with ${identity}`).toEqual(boxes[1]);
			}
		}
		await employer(1).screenshot({ path: testInfo.outputPath(`employer-tin-${width}.png`), animations: 'disabled' });
	}

	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	await page.getByRole('row').filter({ hasText: '1700' }).getByRole('link', { name: 'Edit', exact: true }).click();
	await goToReturnPage(page, 2);
	await expect(tin(1)).toHaveValue('001-024-350-00008');
	await expect(tin(2)).toBeVisible();
	await expect(tin(2)).toHaveValue('---00007');

	const html = await page.evaluate(async () => {
		const formsModule = '/src/lib/forms/index.ts';
		const reportModule = '/src/lib/printing/return-report.ts';
		const { getFormDefinition } = await import(formsModule) as typeof import('../../src/lib/forms');
		const { buildReturnReport } = await import(reportModule) as typeof import('../../src/lib/printing/return-report');
		const saved = JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!) as {
			returns: { formCode: string; values: Record<string, string> }[];
		};
		const draft = saved.returns.find(record => record.formCode === '1700');
		if (!draft) throw new Error('The saved Form 1700 draft is missing.');
		return buildReturnReport(getFormDefinition('1700')!, draft.values, 'Draft', 'a4');
	});
	const print = await context.newPage();
	await print.setContent(html);
	await print.emulateMedia({ media: 'print' });
	const slot = (number: number, suffix: string) => print.locator(`[data-legacy-print-id="txtPg2Pt4I${number}EMPTIN${suffix}"]`);
	for (const [suffix, value] of [['1', '001'], ['2', '024'], ['3', '350'], ['BranchCode', '00008']]) {
		await expect(slot(1, suffix)).toHaveText(value);
	}
	await expect(slot(2, '1')).toBeEmpty();
	await expect(slot(2, 'BranchCode')).toHaveText('00007');
	await expect(print.locator('[data-legacy-print-id="rdoPg2Pt4I1TaxFiler"]')).toHaveText('X');
	for (const [suffix, value] of [['1', '065'], ['2', '043'], ['3', '021'], ['BranchCode', '00009']]) {
		await expect(slot(3, suffix)).toHaveText(value);
		const first = await slot(1, suffix).evaluate(element => getComputedStyle(element.parentElement!).left);
		await expect(slot(3, suffix).locator('..'), `Employer 3 ${suffix} uses the same print column as Employer 1`).toHaveCSS('left', first);
	}
	const pdf = testInfo.outputPath('employer-tin-draft.pdf');
	await print.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true });
	if (process.env.INCOME_PREVIEW_DIR) {
		execFileSync('pdftoppm', ['-f', '2', '-l', '2', '-r', '105', '-singlefile', '-png', pdf,
			testInfo.outputPath('employer-tin-pdf-page-2')]);
	}
});

test('legacy 1700 pages 2–4 disclose optional schedules and use filing-specific controls', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'loaded', { ...fixture, civilStatus: 'Single' });
	await page.setViewportSize({ width: 1440, height: 960 });
	await page.goto(`${list}/1700?new=true`);
	const pager = page.getByRole('navigation', { name: 'Return pages' });
	await expect(pager).toBeVisible({ timeout: 20000 });
	await goToReturnPage(page, 2);
	const employer = page.getByRole('region', { name: 'Part IV · Employer 1', exact: true });
	const earner = employer.getByRole('radiogroup', { name: 'Income earner', exact: true });
	await expect(earner).toHaveCount(0);
	await employer.getByRole('textbox', { name: 'Employer name', exact: true }).fill('Example Employer');
	const optionalEmployer = page.getByRole('region', { name: 'Part IV · Employer 2', exact: true });
	await expect(optionalEmployer.getByRole('textbox', { name: 'Employer name', exact: true })).toBeHidden();
	await optionalEmployer.locator('summary').click();
	await expect(optionalEmployer.getByRole('textbox', { name: 'Employer name', exact: true })).toBeVisible();

	await goToReturnPage(page, 3);
	const shares = page.getByRole('region', { name: 'Share transactions', exact: true });
	const shareCount = shares.getByRole('textbox', { name: 'Number of shares', exact: true });
	await expect(shareCount).toBeHidden();
	await shares.locator('summary').focus();
	await page.keyboard.press('Enter');
	await shareCount.fill('');
	await shareCount.pressSequentially('A4.3');
	await expect(shareCount).toHaveValue('43');
	await expect(shares.getByText('Date of issue', { exact: true })).toBeVisible();
	await expect(page.getByRole('region', { name: 'Final tax total', exact: true })).toBeVisible();

	await goToReturnPage(page, 4);
	await page.getByRole('button', { name: 'Review address on page 1', exact: true }).click();
	const addressChanged = page.getByRole('checkbox', { name: 'Registered address changed', exact: true });
	await expect(addressChanged).toBeFocused();
	await addressChanged.check();
	await goToReturnPage(page, 4);
	const address = page.getByRole('region', { name: 'Table 1 · Current address', exact: true });
	const zip = address.getByRole('textbox', { name: 'ZIP code', exact: true });
	await zip.pressSequentially('A01234');
	await expect(zip).toHaveValue('0123');
	await expect(zip).toHaveAttribute('required', '');
	if (process.env.INCOME_PREVIEW_DIR) {
		const output = resolve(process.env.INCOME_PREVIEW_DIR);
		mkdirSync(output, { recursive: true });
		await page.setViewportSize({ width: 390, height: 920 });
		await page.keyboard.press('Escape');
		await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
		await address.evaluate(node => node.scrollIntoView({ block: 'center' }));
		await address.screenshot({ path: resolve(output, '1700-2013-page-4-mobile.png') });
	}
});

async function expectAmountEdge(input: Locator, total: Locator) {
	const { edge, fits } = await input.evaluate(element => {
		const style = getComputedStyle(element);
		const measure = document.createElement('canvas').getContext('2d')!;
		measure.font = `${style.fontSize} ${style.fontFamily}`;
		const width = measure.measureText((element as HTMLInputElement).value).width;
		const available = element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
		return { edge: element.getBoundingClientRect().right, fits: width <= available };
	});
	const totalEdge = await total.evaluate(element => {
		const range = document.createRange();
		range.selectNodeContents(element);
		return range.getBoundingClientRect().right;
	});
	expect(Math.abs(edge - totalEdge), `Amount field at ${edge}px aligns with the total at ${totalEdge}px`).toBeLessThanOrEqual(2);
	expect(fits, 'The entire amount is visible inside its input').toBe(true);
}

test('June 1700 computation keeps inputs aligned with taxpayer, spouse and combined totals', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { ...fixture, civilStatus: 'Married' });
	await page.setViewportSize({ width: 1440, height: 960 });
	await page.goto(`${list}/1700?new=true`);
	const joint = page.getByRole('radiogroup', { name: 'Joint return?', exact: true });
	await joint.getByRole('radio', { name: 'Yes', exact: true }).check();
	await goToReturnPage(page, 2);
	const field = (id: string) => page.locator(`[id="frm1700:txtPg2Pt4I${id}"]`);
	for (const column of ['1', '2']) {
		await field(`5C${column}`).fill('1234567.89');
		await field(`5C${column}`).blur();
		await expectAmountEdge(field(`5C${column}`), field(`14C${column}`));
		await expectAmountEdge(field(`17C${column}`), field(`19C${column}`));
	}
	await expectAmountEdge(field('24'), field('28'));
	await goToReturnPage(page, 1);
	await joint.getByRole('radio', { name: 'No', exact: true }).check();
	await goToReturnPage(page, 2);
	await expect(field('5C2')).toHaveCount(0);
	for (const width of [1440, 390]) {
		await page.setViewportSize({ width, height: 960 });
		await expectAmountEdge(field('5C1'), field('14C1'));
		await expectAmountEdge(field('24'), field('28'));
		const output = process.env.INCOME_PREVIEW_DIR;
		if (output) {
			mkdirSync(output, { recursive: true });
			await page.getByRole('region', { name: 'Part IV · Tax computation', exact: true })
				.screenshot({ path: resolve(output, `1700-computation-${width}.png`), animations: 'disabled' });
		}
	}
});

test('legacy 1700 page 3 aligns amount columns and groups optional transactions by entry', async ({ page }) => {
	await seedWorkspace(page, 'dark', 'loaded', { ...fixture, civilStatus: 'Single' });
	await page.setViewportSize({ width: 1440, height: 960 });
	await page.goto(`${list}/1700?new=true`);
	await goToReturnPage(page, 3);

	const supplemental = page.getByRole('region', { name: 'Part V.A · Income subject to final tax', exact: true });
	await supplemental.locator('summary').click();
	const interest = supplemental.getByRole('textbox', { name: 'Interest amount or fair market value', exact: true });
	const royalties = supplemental.getByRole('textbox', { name: 'Royalties amount or fair market value', exact: true });
	await expect(interest).toHaveValue('');
	expect((await interest.boundingBox())!.x).toBe((await royalties.boundingBox())!.x);
	await royalties.fill('0');
	await royalties.blur();
	await expect(royalties).toHaveValue('0.00');
	await interest.fill('1250');
	await supplemental.getByRole('textbox', { name: 'Interest final tax withheld', exact: true }).fill('250');
	const finalTaxTotal = page.locator('[id="frm1700:txtPg3Pt5I21TotTaxWithheldPaid"]');
	await expect(finalTaxTotal).toHaveText('₱250.00');
	await expectAmountEdge(supplemental.getByRole('textbox', { name: 'Interest final tax withheld', exact: true }), finalTaxTotal);

	const shares = page.getByRole('region', { name: 'Share transactions', exact: true });
	await shares.locator('summary').click();
	const first = shares.getByRole('group', { name: 'Sale or exchange 1', exact: true });
	const second = shares.getByRole('group', { name: 'Sale or exchange 2', exact: true });
	await expect(first.getByRole('combobox', { name: 'Kind of shares', exact: true })).toHaveText('Select share type');
	await expect(second).toHaveCount(0);
	await expectAmountEdge(first.getByRole('textbox', { name: 'Final tax withheld or paid', exact: true }), finalTaxTotal);
	const exempt = page.getByRole('region', { name: 'Part V.B · Income exempt from tax', exact: true });
	await exempt.locator('summary').click();
	const lifeInsurance = exempt.getByRole('textbox', { name: 'Proceeds of life insurance policy', exact: true });
	await lifeInsurance.fill('4000');
	await lifeInsurance.blur();
	await expectAmountEdge(lifeInsurance, page.locator('[id="frm1700:txtPg3Pt5BI10TotalIncome"]'));
	await first.getByRole('combobox', { name: 'Kind of shares', exact: true }).click();
	await page.getByRole('option', { name: 'Common shares', exact: true }).click();
	// A share-type selection by itself must keep the schedule populated on return.
	await goToReturnPage(page, 4);
	await goToReturnPage(page, 3);
	await expect(royalties).toHaveValue('0.00');
	await expect(first.getByRole('combobox', { name: 'Kind of shares', exact: true })).toHaveText('Common shares');
	await first.getByRole('textbox', { name: 'Stock certificate series number', exact: true }).fill('STK123');
	await shares.getByRole('button', { name: 'Add second sale or exchange', exact: true }).click();
	await expect(second.getByRole('combobox', { name: 'Kind of shares', exact: true })).toBeFocused();
	const firstCount = first.getByRole('textbox', { name: 'Number of shares', exact: true });
	const secondCount = second.getByRole('textbox', { name: 'Number of shares', exact: true });
	await firstCount.fill('75');
	await secondCount.fill('12');
	expect((await firstCount.boundingBox())!.y).toBe((await secondCount.boundingBox())!.y);
	await expect(page.getByRole('region', { name: 'Property received through gifts, bequests, or devises', exact: true })).toBeVisible();
	await expect(page.getByRole('region', { name: 'Other exempt income or receipts', exact: true })).toBeVisible();

	const output = process.env.INCOME_PREVIEW_DIR;
	if (output) {
		mkdirSync(output, { recursive: true });
		await secondCount.blur();
		await supplemental.evaluate(node => node.scrollIntoView({ block: 'center' }));
		await supplemental.screenshot({ path: resolve(output, '1700-page-3-withholding.png') });
		await shares.screenshot({ path: resolve(output, '1700-page-3-desktop.png') });
	}
	await page.setViewportSize({ width: 390, height: 920 });
	await page.keyboard.press('Escape');
	await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
	expect((await first.boundingBox())!.y + (await first.boundingBox())!.height).toBeLessThanOrEqual((await second.boundingBox())!.y);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	if (output) {
		await second.getByRole('heading').evaluate(node => node.scrollIntoView({ block: 'center' }));
		await page.screenshot({ path: resolve(output, '1700-page-3-mobile.png') });
	}
});
