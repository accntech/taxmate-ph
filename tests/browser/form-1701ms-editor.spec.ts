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
	await read.click();
	await expect(terms).toBeHidden();
	await agree.check();
	await expect(agree).toBeChecked();
	await page.setViewportSize({ width: 390, height: 920 });
	const representative = declaration.getByText('Authorized representative details', { exact: true });
	await representative.click();
	await representativeTin.fill('009876543');
	await representative.click();
	await expect(representativeTin).toBeHidden();
	await representative.click();
	await expect(representativeTin).toHaveValue('009876543');
	await representativeTin.fill('');
	await expect(representativeTin).toBeFocused();
	await representativeTin.fill('009876543');
	expect(await declaration.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
	if (output) {
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
	await expect(representativeTin).toHaveValue('009876543');
	await expect(page.locator(id('printedName'))).toHaveValue('SAMPLE REPRESENTATIVE');
	await expect(page.getByRole('checkbox', { name: 'I agree to the declaration' })).toBeChecked();
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
	await expect(page.getByRole('combobox', { name: 'Go to section' })).toBeVisible();
	await expect(page.getByRole('table', { name: /Business income at/ })).toHaveCount(0);
	await page.getByRole('button', { name: 'Choose taxpayer income source' }).click();
	await expect(page.getByRole('radio', { name: 'Income from business' })).toBeFocused();
});

test('1701-MS keeps both filers in mixed-rate tables and seven-digit amounts readable at 390px', async ({ page }) => {
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
	await page.setViewportSize({ width: 390, height: 920 });
	await page.keyboard.press('Escape');
	const scrollRegion = page.getByRole('region', { name: 'Part IV.B2 · Business income at 8% columns' });
	await expect(scrollRegion).toHaveAttribute('tabindex', '0');
	const amount = flat.locator(id('txtSalesRevenuesFeesANo19a'));
	await amount.fill('1000000');
	await amount.blur();
	const total = flat.locator(id('txtTotalIncomeNo21a'));
	await expect(total).toHaveText('₱1,000,000.00');
	const fits = await total.evaluate(node => {
		const range = document.createRange();
		range.selectNodeContents(node);
		return range.getClientRects().length === 1 &&
			range.getBoundingClientRect().right <= node.closest('td')!.getBoundingClientRect().right;
	});
	expect(fits).toBe(true);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
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
	await expect(business.locator(id('txtTaxDueSpeciala'))).toHaveText('₱65,000.00');
});
