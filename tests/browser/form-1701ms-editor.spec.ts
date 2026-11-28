import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

const route = `/ebirforms/taxpayers/${taxpayerId}/forms/1701MS`;
const id = (name: string) => `[id="frm1701MS:${name}"]`;
const single = {
	taxpayerName: 'SANTOS, ALEX, REYES',
	taxpayerClassification: 'I',
	contactNumber: '09171234567'
} as const;

test('1701-MS keeps filing choices aligned and puts spouse editing with spouse information', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { ...single, civilStatus: 'Married',
		spouse: { taxpayerName: 'SANTOS, JAMIE, CRUZ', tin1: '009', tin2: '876', tin3: '543', branchCode: '00000' }
	});
	await page.setViewportSize({ width: 1440, height: 960 });
	await page.goto(`${route}?new=true`);
	const filing = page.getByRole('region', { name: 'Filing details', exact: true });
	const status = filing.getByRole('radiogroup', { name: 'Filing status' });
	await expect(status).toBeVisible({ timeout: 30000 });
	const choices = await status.getByRole('radio').evaluateAll(radios => radios.map(radio => radio.getBoundingClientRect().top));
	expect(new Set(choices).size).toBe(1);
	const incomeChoices = page.getByRole('region', { name: 'Income and filing choices', exact: true });
	const editSpouse = page.getByRole('link', { name: 'Edit spouse details', exact: true });
	await expect(editSpouse).toHaveCount(0);
	await status.getByRole('radio', { name: 'Jointly', exact: true }).check();
	await expect(incomeChoices.getByRole('link', { name: 'Edit spouse details', exact: true })).toBeVisible();
	await expect(editSpouse).toHaveCount(1);
	const output = process.env.INCOME_PREVIEW_DIR;
	if (output) await filing.screenshot({ path: resolve(output, '1701MS-filing-desktop.png') });
	await page.setViewportSize({ width: 390, height: 920 });
	await page.keyboard.press('Escape');
	await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
	await expect(status.getByRole('radio', { name: 'Spouse has no income' })).toBeVisible();
	expect(await filing.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
	if (output) {
		await filing.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
		await filing.screenshot({ path: resolve(output, '1701MS-filing-mobile.png') });
	}
	await status.getByRole('radio', { name: 'Separately', exact: true }).check();
	await expect(editSpouse).toHaveCount(0);
});

test('1701-MS keeps the declaration compact and discloses representative details on demand', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { ...single, civilStatus: 'Single' });
	await page.goto(`${route}?new=true`);
	const declaration = page.getByRole('region', { name: 'Declaration', exact: true });
	const agree = declaration.getByRole('checkbox', { name: 'I agree to the declaration' });
	const terms = declaration.getByText('I declare under the penalties of perjury', { exact: false });
	const representativeTin = declaration.locator(id('authorizeRepresentative'));
	await expect(agree).toBeVisible({ timeout: 30000 });
	await expect(terms).toBeAttached();
	await expect(representativeTin).toBeAttached();
	await expect(terms).toBeHidden();
	await expect(representativeTin).toBeHidden();
	const nameField = declaration.locator(id('printedName'));
	const attachmentCount = declaration.locator(id('txtPg1I33NumberOfAttachments'));
	await expect(attachmentCount).toBeVisible();
	const namePosition = await nameField.boundingBox();
	const attachmentPosition = await attachmentCount.boundingBox();
	expect(Math.abs(attachmentPosition!.y - namePosition!.y)).toBeLessThanOrEqual(2);
	const output = process.env.INCOME_PREVIEW_DIR;
	if (output) await declaration.screenshot({ path: resolve(output, '1701MS-declaration-desktop.png') });
	const read = declaration.getByText('Read declaration', { exact: true });
	await read.focus();
	await page.keyboard.press('Enter');
	await expect(terms).toBeVisible();
	const termsPosition = (await terms.boundingBox())!;
	const agreePosition = (await agree.boundingBox())!;
	expect(agreePosition.y).toBeGreaterThanOrEqual(termsPosition.y + termsPosition.height);
	const representative = declaration.getByText('Authorized representative details', { exact: true });
	const representativePosition = (await representative.boundingBox())!;
	const expandedAttachmentPosition = (await attachmentCount.boundingBox())!;
	expect(representativePosition.y).toBeGreaterThanOrEqual(expandedAttachmentPosition.y + expandedAttachmentPosition.height);
	if (output) {
		await representative.click();
		await representativeTin.fill('009876543');
		await representativeTin.blur();
		await declaration.screenshot({ path: resolve(output, '1701MS-declaration-desktop-expanded.png') });
		await representative.click();
	}
	await read.click();
	await expect(terms).toBeHidden();
	await agree.check();
	await expect(agree).toBeChecked();
	await page.setViewportSize({ width: 390, height: 920 });
	await page.keyboard.press('Escape');
	await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
	await representative.click();
	await representativeTin.focus();
	await representativeTin.fill('009876543');
	await representative.click();
	await expect(representativeTin).toBeHidden();
	await representative.click();
	await expect(representativeTin).toHaveValue('009-876-543');
	await representativeTin.fill('');
	await expect(representativeTin).toBeFocused();
	await representativeTin.fill('009876543');
	expect(await declaration.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
	if (output) {
		await representativeTin.blur();
		await declaration.evaluate(node => node.scrollIntoView({ block: 'center' }));
		await declaration.screenshot({ path: resolve(output, '1701MS-declaration-mobile.png') });
	}
});

test('1701-MS reveals representative data when opening a saved draft', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { ...single, civilStatus: 'Single' }, [{
		id: 'representative-ms', taxpayerId, formCode: '1701MS', returnPeriod: '2025', status: 'Draft', finalFlag: '0',
		updatedAt: 1794441600000, values: {
			'frm1701MS:txtYearNo1': '2025',
			'frm1701MS:printedName': 'SAMPLE REPRESENTATIVE',
			'frm1701MS:authorizeRepresentative': '009876543',
			'frm1701MS:perjuryClause': '1'
		}
	}]);
	await page.goto(`${route}?return=representative-ms`);
	const representativeTin = page.locator(id('authorizeRepresentative'));
	await expect(representativeTin).toBeVisible({ timeout: 30000 });
	await expect(representativeTin).toHaveValue('009-876-543');
	await expect(page.locator(id('printedName'))).toHaveValue('SAMPLE REPRESENTATIVE');
	await expect(page.getByRole('checkbox', { name: 'I agree to the declaration' })).toBeChecked();
	await representativeTin.focus();
	await representativeTin.fill('00123456700089');
	await representativeTin.blur();
	await expect(representativeTin).toHaveValue('001-234-567-00089');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const savedTin = await page.evaluate(() => {
		const storage = JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!);
		return storage.returns.find((record: { id: string }) => record.id === 'representative-ms')
			?.values['frm1701MS:authorizeRepresentative'];
	});
	expect(savedTin).toBe('00123456700089');
	await page.getByRole('row').filter({ hasText: '1701MS' }).getByRole('link', { name: /^Edit BIR Form / }).click();
	await expect(representativeTin).toHaveValue('001-234-567-00089');
});

test('1701-MS links an incomplete schedule to its source and links summary credits back to Part V', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { ...single, civilStatus: 'Single' });
	await page.goto(`${route}?new=true`);
	await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 30000 });
	await expect(page.locator(id('txtAggregateAmountPayable30a'))).toHaveText('—');
	await expect(page.getByText('Due by October 15. Up to 50% of Item 23 and no more than Item 25.')).toBeVisible();
	await expect(page.getByRole('checkbox', { name: 'I agree to the declaration' })).toBeVisible();
	const creditJump = page.getByRole('button', { name: 'From Part V, Item 10' });
	await expect(creditJump).toBeVisible();
	await creditJump.click();
	await expect(page.locator(id('txtTotalTaxCreditsPaymentsPartVNo10a'))).toBeFocused();
	await expect(page.getByRole('combobox', { name: 'Go to section', exact: true })).toHaveCount(0);
	await expect(page.getByRole('table', { name: /Business income at/ })).toHaveCount(0);
	await page.getByRole('button', { name: 'Choose taxpayer income source' }).click();
	await expect(page.getByRole('radio', { name: 'Income from business' })).toBeFocused();
});

test('1701-MS keeps both filers in mixed-rate tables and seven-digit amounts readable at 390px', async ({ page }) => {
	test.setTimeout(120_000);
	await seedWorkspace(page, 'light', 'loaded', { ...single, civilStatus: 'Married',
		spouse: { taxpayerName: 'SANTOS, JAMIE, CRUZ', tin1: '009', tin2: '876', tin3: '543', branchCode: '00000' }
	}, [{
		id: 'joint-ms', taxpayerId, formCode: '1701MS', returnPeriod: '2025', status: 'Draft', finalFlag: '0',
		updatedAt: 1794441600000, values: {
			'frm1701MS:txtYearNo1': '2025', 'frm1701MS:civilStatus': 'Married', 'frm1701MS:txtIfMarried': '1',
			'frm1701MS:sourceOfIncomeTaxpayer': '1', 'frm1701MS:txtTaxpayerNo12a': '3',
			'frm1701MS:sourceOfIncomeSpouse': '3', 'frm1701MS:txtTaxpayerNo12b': '2',
			methodOfDeductionStandard: 'itemized2'
		}
	}]);
	await page.goto(`${route}?return=joint-ms`);
	await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 30000 });
	await goToReturnPage(page, 2);
	const graduated = page.getByRole('table', { name: 'Part IV.B1 · Business income at graduated or special rates' });
	const flat = page.getByRole('table', { name: 'Part IV.B2 · Business income at 8%' });
	await expect(graduated.getByRole('columnheader')).toHaveText(['Item', 'Description', 'Taxpayer', 'Spouse']);
	await expect(flat.getByRole('columnheader')).toHaveText(['Item', 'Description', 'Taxpayer', 'Spouse']);
	await expect(graduated.locator('tr[data-income-item="5"]').getByRole('cell').nth(1)).toHaveText('—');
	await expect(graduated.locator('tr[data-income-item="5"]').getByRole('cell').nth(2).locator(id('txtSalesRevenueNo5b'))).toBeEditable();
	await expect(flat.locator('tr[data-income-item="19"]').getByRole('cell').nth(2)).toHaveText('—');
	await expect(page.locator(id('txtSpecialAllowableNo10a'))).toHaveCount(0);
	const spouseTotal = graduated.locator(id('txtSpecialAllowableNo10b'));
	await expect(spouseTotal).toBeEditable();
	await spouseTotal.fill('600');
	await spouseTotal.blur();
	await expect(graduated.locator(id('txtTotalAllowableItemixedDeductionsNo10b'))).toHaveText('₱600');
	await page.setViewportSize({ width: 390, height: 920 });
	await page.keyboard.press('Escape');
	const scrollRegion = page.getByRole('region', { name: 'Part IV.B2 · Business income at 8% columns' });
	await expect(scrollRegion).toHaveAttribute('tabindex', '0');
	const amount = flat.locator(id('txtSalesRevenuesFeesANo19a'));
	await amount.fill('1000000');
	await amount.blur();
	const total = flat.locator(id('txtTotalIncomeNo21a'));
	await expect(total).toHaveText('₱1,000,000');
	const fits = await total.evaluate(node => {
		const range = document.createRange();
		range.selectNodeContents(node);
		return range.getClientRects().length === 1 &&
			range.getBoundingClientRect().right <= node.closest('td')!.getBoundingClientRect().right;
	});
	expect(fits).toBe(true);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('1701-MS edits Item 9 inline beside Item 7 and reopens both filers’ credits', async ({ page }, info) => {
	await seedWorkspace(page, 'light', 'loaded', { ...single, civilStatus: 'Married',
		spouse: { taxpayerName: 'SANTOS, JAMIE, CRUZ', tin1: '009', tin2: '876', tin3: '543', branchCode: '00000' }
	}, [{
		id: 'inline-credits', taxpayerId, formCode: '1701MS', returnPeriod: '2025', status: 'Draft', finalFlag: '0',
		updatedAt: 1794441600000, values: {
			'frm1701MS:txtYearNo1': '2025', 'frm1701MS:civilStatus': 'Married', 'frm1701MS:txtIfMarried': '1',
			'frm1701MS:sourceOfIncomeTaxpayer': '1', 'frm1701MS:txtTaxpayerNo12a': '2', methodOfDeductionMain: 'itemized',
			'frm1701MS:sourceOfIncomeSpouse': '3', 'frm1701MS:txtTaxpayerNo12b': '2', methodOfDeductionStandard: 'itemized2',
			'frm1701MS:addOtherCreditsPayments': 'Existing credit',
			'frm1701MS:txtOtherCreditsPaymentsNo9a': '125'
		}
	}]);
	await page.goto(`${route}?return=inline-credits`);
	await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 45000 });
	await goToReturnPage(page, 2);
	const table = page.getByRole('table', { name: 'Part V · Tax credits and payments', exact: true });
	const row = table.locator('[data-income-item="9"]');
	const description = row.locator(id('addOtherCreditsPayments'));
	const taxpayer = row.locator(id('txtOtherCreditsPaymentsNo9a'));
	const spouse = row.locator(id('txtOtherCreditsPaymentsNo9b'));
	await expect(table.locator('[data-income-item="7"]').locator(id('addForeignTaxCredits'))).toBeEditable();
	await expect(description).toHaveValue('Existing credit');
	await expect(taxpayer).toHaveValue('125');
	await expect(spouse).toBeEditable();
	await description.fill('Payment certificate');
	await taxpayer.fill('150');
	await spouse.fill('225');
	await spouse.blur();
	await expect(table.locator(id('txtTotalTaxCreditsPaymentsPartVNo10a'))).toHaveText('₱150');
	await expect(table.locator(id('txtTotalTaxCreditsPaymentsPartVNo10b'))).toHaveText('₱225');
	await expect(page.getByRole('dialog')).toHaveCount(0);
	for (const width of [1440, 390]) {
		await page.setViewportSize({ width, height: 920 });
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
		await page.locator('section.income-section').filter({ has: table }).screenshot({
			path: info.outputPath(`1701ms-inline-credit-${width}.png`), animations: 'disabled',
			style: '.eq-action-bar { position: static !important; }'
		});
	}
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	await page.getByRole('row').filter({ hasText: '1701MS' }).getByRole('link', { name: /^Edit BIR Form / }).click();
	await goToReturnPage(page, 2);
	await expect(description).toHaveValue('Payment certificate');
	await expect(taxpayer).toHaveValue('150');
	await expect(spouse).toHaveValue('225');
});

test('1701-MS keeps the preferential rate in its numbered business schedule', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { ...single, civilStatus: 'Single' }, [{
		id: 'special-ms', taxpayerId, formCode: '1701MS', returnPeriod: '2025', status: 'Draft', finalFlag: '0',
		updatedAt: 1794441600000, values: {
			'frm1701MS:txtYearNo1': '2025', 'frm1701MS:sourceOfIncomeTaxpayer': '1', 'frm1701MS:txtTaxpayerNo12a': '5',
			'frm1701MS:txtSalesRevenueNo5a': '1000000', 'frm1701MS:txtTaxRatea': '5%'
		}
	}]);
	await page.goto(`${route}?return=special-ms`);
	await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 30000 });
	await goToReturnPage(page, 2);
	const business = page.getByRole('table', { name: 'Part IV.B1 · Business income at graduated or special rates' });
	await expect(business).toHaveCount(1);
	const rate = business.locator('tr[data-income-item="16"]').locator(id('txtTaxRatea'));
	await expect(rate).toHaveValue('5');
	await rate.fill('6.5');
	await rate.blur();
	await expect(business.locator(id('txtTaxDueSpeciala'))).toHaveText('₱65,000');
});

test('1701-MS Item 10B accepts both printed totals directly', async ({ page }, testInfo) => {
	await seedWorkspace(page, 'light', 'loaded', { ...single, civilStatus: 'Married',
		spouse: { taxpayerName: 'SANTOS, JAMIE, CRUZ', tin1: '009', tin2: '876', tin3: '543', branchCode: '00000' }
	}, [{
		id: 'deduction-totals-ms', taxpayerId, formCode: '1701MS', returnPeriod: '2025', status: 'Draft', finalFlag: '0',
		updatedAt: 1794441600000, values: {
			'frm1701MS:txtYearNo1': '2025', 'frm1701MS:civilStatus': 'Married', 'frm1701MS:txtIfMarried': '1',
			'frm1701MS:sourceOfIncomeTaxpayer': '1', 'frm1701MS:txtTaxpayerNo12a': '2', methodOfDeductionMain: 'itemized',
			'frm1701MS:sourceOfIncomeSpouse': '3', 'frm1701MS:txtTaxpayerNo12b': '2', methodOfDeductionStandard: 'itemized2',
			'frm1701MS:txtSpecialAllowableNo10a': '225'
		}
	}]);
	await page.setViewportSize({ width: 1440, height: 980 });
	await page.goto(`${route}?return=deduction-totals-ms`);
	await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 45_000 });
	await goToReturnPage(page, 2);
	const taxpayerTotal = page.locator(id('txtSpecialAllowableNo10a'));
	const spouseTotal = page.locator(id('txtSpecialAllowableNo10b'));
	await expect(taxpayerTotal).toHaveJSProperty('tagName', 'INPUT', { timeout: 3000 });
	await expect(taxpayerTotal).toHaveValue('225');
	await expect(spouseTotal).toBeEditable();
	await expect(page.getByRole('region', { name: /Item 10B · Special deductions/ })).toHaveCount(0);
	await taxpayerTotal.fill('1425');
	await taxpayerTotal.blur();
	await spouseTotal.fill('650');
	await spouseTotal.blur();
	await expect(page.locator(id('txtTotalAllowableItemixedDeductionsNo10a'))).toHaveText('₱1,425');
	await expect(page.locator(id('txtTotalAllowableItemixedDeductionsNo10b'))).toHaveText('₱650');

	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	await page.getByRole('row').filter({ hasText: '1701MS' }).getByRole('link', { name: /^Edit BIR Form / }).click();
	await goToReturnPage(page, 2);
	await expect(taxpayerTotal).toHaveValue('1,425');
	await expect(spouseTotal).toHaveValue('650');
	const row = page.locator('tr[data-income-item="10B"]').filter({ has: taxpayerTotal });
	await row.screenshot({ path: testInfo.outputPath('1701MS-10b-totals-desktop.png'), animations: 'disabled' });
	await page.setViewportSize({ width: 390, height: 980 });
	await page.keyboard.press('Escape');
	await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	for (const [field, person] of [[taxpayerTotal, 'taxpayer'], [spouseTotal, 'spouse']] as const) {
		await field.focus();
		await expect(field).toBeEditable();
		await expect.poll(() => field.evaluate(node => {
			const input = node.getBoundingClientRect();
			const viewport = node.closest('.joint-schedule-viewport')!.getBoundingClientRect();
			return input.left >= viewport.left && input.right <= viewport.right;
		})).toBe(true);
		await field.screenshot({ path: testInfo.outputPath(`1701MS-10b-${person}-mobile.png`), animations: 'disabled' });
	}

	const html = await page.evaluate(async () => {
		const formsPath = '/src/lib/forms/index.ts';
		const reportPath = '/src/lib/printing/return-report.ts';
		const { getFormDefinition } = await import(formsPath) as typeof import('../../src/lib/forms');
		const { buildReturnReport } = await import(reportPath) as typeof import('../../src/lib/printing/return-report');
		const form = getFormDefinition('1701MS');
		if (!form) throw new Error('Expected the 1701-MS form definition.');
		const storage = JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!);
		const draft = storage.returns.find((record: { id: string }) => record.id === 'deduction-totals-ms');
		if (!draft) throw new Error('Expected the saved 1701-MS draft.');
		if (Object.keys(draft.values).some(id => id.startsWith('frm1701MS:sched410A'))) {
			throw new Error('An Item 10B total was saved as a detail row.');
		}
		return buildReturnReport(form, draft.values, draft.status, 'a4');
	});
	const print = await page.context().newPage();
	await print.setContent(html);
	await expect(print.locator(id('txtSpecialAllowableNo10a'))).toHaveValue('1,425');
	await expect(print.locator(id('txtSpecialAllowableNo10b'))).toHaveValue('650');
	await print.pdf({ path: testInfo.outputPath('1701MS-10b-totals.pdf'), preferCSSPageSize: true, printBackground: true });
});

for (const width of [1440, 390]) {
	test(`1701-MS Item 10B preserves saved deduction details at ${width}px`, async ({ page }, testInfo) => {
		test.setTimeout(120_000);
		await seedWorkspace(page, 'light', 'loaded', { ...single, civilStatus: 'Single' }, [{
			id: 'special-ms', taxpayerId, formCode: '1701MS', returnPeriod: '2025', status: 'Draft', finalFlag: '0',
			updatedAt: 1794441600000, values: {
				'frm1701MS:txtYearNo1': '2025',
				'frm1701MS:sourceOfIncomeTaxpayer': '1',
				'frm1701MS:txtTaxpayerNo12a': '2',
				methodOfDeductionMain: 'itemized',
				'frm1701MS:txtSpecialAllowableNo10a': '225',
				'frm1701MS:sched410A1:Description0': 'Prior deduction',
				'frm1701MS:sched410A1:LegalBasis0': 'Prior legal basis',
				'frm1701MS:sched410A1:Amount0': '225',
				'frm1701MS:sched410A1:Amount7': '1200'
			}
		}]);
		await page.setViewportSize({ width, height: 980 });
		await page.goto(`${route}?return=special-ms`);
		await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 45_000 });
		if (width < 640) {
			await page.keyboard.press('Escape');
			await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
		}
		await goToReturnPage(page, 2);

		const label = 'Item 10B · Special deductions · Taxpayer';
		const schedule = page.getByRole('region', { name: label, exact: true });
		const subtotal = page.locator(id('txtSpecialAllowableNo10a'));
		await expect(subtotal).toHaveJSProperty('tagName', 'OUTPUT');
		await expect(subtotal).toHaveText('₱1,425');
		await expect(page.locator(id('txtNetOperatingLossNo10a'))).toBeEditable();
		await expect(schedule.getByRole('button', { name: 'Add item' })).toHaveCount(0);
		const sparseDetail = schedule.getByRole('button', { name: 'Edit Item 10B.8' });
		const drawer = page.getByRole('dialog', { name: label, exact: true });
		const description = drawer.getByRole('textbox', { name: 'Description' });
		await sparseDetail.click();
		await expect(description).toBeFocused();
		await drawer.getByRole('button', { name: 'Close', exact: true }).click();
		await expect(sparseDetail).toBeFocused();

		await sparseDetail.click();
		await expect(drawer.getByRole('textbox', { name: 'Amount' })).toHaveValue('1,200');
		const update = drawer.getByRole('button', { name: 'Update', exact: true });
		await update.click();
		await expect(drawer.getByText('Enter the legal basis for the special deduction.', { exact: true })).toBeVisible();
		await description.fill('Sample deductible expense');
		await drawer.getByRole('textbox', { name: 'Legal basis' }).fill('Sample legal basis');
		await drawer.getByRole('textbox', { name: 'Amount' }).fill('1300');
		await drawer.getByRole('textbox', { name: 'Amount' }).blur();
		await expect(await drawer.evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth)).toBe(true);
		await page.screenshot({ path: testInfo.outputPath(`1701MS-saved-deduction-drawer-${width}.png`), animations: 'disabled' });
		await update.click();
		await expect(subtotal).toHaveText('₱1,525');
		await expect(schedule.getByText('Sample deductible expense')).toBeVisible();
		await expect(schedule.getByText('Legal basis · Sample legal basis')).toBeVisible();

		await page.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(/\/forms$/);
		await page.getByRole('row').filter({ hasText: '1701MS' }).getByRole('link', { name: /^Edit BIR Form / }).click();
		await goToReturnPage(page, 2);
		await expect(subtotal).toHaveText('₱1,525');
		await expect(schedule.getByText('Sample deductible expense')).toBeVisible();

		await sparseDetail.click();
		await drawer.getByRole('button', { name: 'Delete item', exact: true }).click();
		await expect(subtotal).toHaveText('₱225');
		await schedule.getByRole('button', { name: 'Edit Item 10B.1' }).click();
		await drawer.getByRole('button', { name: 'Delete item', exact: true }).click();
		await expect(schedule).toHaveCount(0);
		await expect(subtotal).toBeFocused();
		await expect(subtotal).toBeEditable();
		await expect(subtotal).toHaveValue('0');
	});
}
