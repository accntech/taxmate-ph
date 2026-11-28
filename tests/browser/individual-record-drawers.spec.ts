import { expect, test } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

const base = `/ebirforms/taxpayers/${taxpayerId}/forms`;

test('1701 Schedule 5 manages non-operating income in a drawer and totals each filer', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'I', civilStatus: 'Married' }, [{
		id: 'non-operating-income', taxpayerId, formCode: '1701', returnPeriod: '2017', status: 'Draft', finalFlag: '0', updatedAt: 1794441600000,
		values: {
			'frm1701:txtPg1I1Year': '2017',
			'frm1701:rdoPg1Pt1I14Status': 'Married',
			'frm1701:rdoPg1Pt1I15Income': 'WithIncome',
			'frm1701:rdoPg1Pt1I16FilingStatus': 'Joint'
		}
	}]);
	await page.goto(`${base}/1701?return=non-operating-income`);
	await expect(page.locator('.income-editor')).toBeVisible({ timeout: 90_000 });
	await goToReturnPage(page, 6);
	const schedule = page.getByRole('table', { name: /Schedule 5.*Non-Operating Income/i });
	const items = schedule.locator('[data-income-records]');
	const taxpayerTotal = schedule.locator('output[id="frm1701:txtPg6Sc5I6TaxPayerC1"]');
	const spouseTotal = schedule.locator('output[id="frm1701:txtPg6Sc5I6SpouseC2"]');
	await expect(items.getByRole('heading', { name: 'Non-operating income (0/5)', exact: true })).toBeVisible();
	await expect(items.getByText('No items added')).toBeVisible();
	await expect(items.getByRole('listitem')).toHaveCount(0);
	await expect(taxpayerTotal).toHaveText('₱0');
	await expect(spouseTotal).toHaveText('₱0');

	await items.getByRole('button', { name: 'Add item', exact: true }).click();
	const add = page.getByRole('dialog', { name: 'Add item', exact: true });
	await expect(add).toHaveAccessibleDescription('Non-operating income');
	await add.getByRole('textbox', { name: 'Description', exact: true }).fill('Rental income');
	await add.getByRole('textbox', { name: 'Taxpayer amount', exact: true }).fill('15000');
	await add.getByRole('textbox', { name: 'Spouse amount', exact: true }).fill('2500');
	await add.getByRole('button', { name: 'Add item', exact: true }).click();
	await expect(items.getByRole('heading', { name: 'Non-operating income (1/5)', exact: true })).toBeVisible();
	await expect(taxpayerTotal).toHaveText('₱15,000');
	await expect(spouseTotal).toHaveText('₱2,500');

	await items.getByRole('button', { name: 'Rental income', exact: true }).click();
	const edit = page.getByRole('dialog', { name: 'Edit item', exact: true });
	await expect(edit).toHaveAccessibleDescription('Non-operating income');
	await edit.getByRole('textbox', { name: 'Description', exact: true }).fill('Equipment rental');
	await edit.getByRole('textbox', { name: 'Taxpayer amount', exact: true }).fill('16000');
	await edit.getByRole('button', { name: 'Update', exact: true }).click();
	await expect(taxpayerTotal).toHaveText('₱16,000');
	await expect(spouseTotal).toHaveText('₱2,500');

	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(base);
	await page.getByRole('row').filter({ hasText: '1701' }).getByRole('link', { name: /^Edit BIR Form / }).click();
	await goToReturnPage(page, 6);
	await items.getByRole('button', { name: 'Equipment rental', exact: true }).click();
	await edit.getByRole('button', { name: 'Delete item', exact: true }).click();
	await expect(items.getByRole('heading', { name: 'Non-operating income (0/5)', exact: true })).toBeVisible();
	await expect(taxpayerTotal).toHaveText('₱0');
	await expect(spouseTotal).toHaveText('₱0');
});

test('numbered employers use one list and draft changes commit through the drawer', async ({ page }, info) => {
	await seedWorkspace(page, 'dark', 'loaded', { taxpayerClassification: 'I', civilStatus: 'Single' }, [{
		id: 'numbered-employer', taxpayerId, formCode: '1700v2018', returnPeriod: '2025', status: 'Draft', finalFlag: '0', updatedAt: 1794441600000,
		values: { 'frm1700:txtPg1I1Year': '2025', 'frm1700:txtPg2I1PartVIEmployerName1': 'First employer', 'frm1700:txtPg2ISched1c_1REG': '100000', 'frm1700:txtPg2I1PartVIEmployerTIN1': '111', 'frm1700:txtPg2I1PartVIEmployerTIN2': '222', 'frm1700:txtPg2I1PartVIEmployerTIN3': '333', 'frm1700:txtPg2I1PartVIEmployerBranchCode': '00000' }
	}]);
	await page.goto(`${base}/1700v2018?return=numbered-employer`);
	await goToReturnPage(page, 2);
	const section = page.getByRole('region', { name: 'Employers', exact: true });
	await expect(section.getByRole('heading', { name: 'Employers (1/4)', exact: true })).toBeVisible();
	await expect(section.getByRole('listitem')).toHaveCount(1);
	await section.getByRole('button', { name: 'First employer', exact: true }).click();
	const drawer = page.getByRole('dialog', { name: 'Edit employer', exact: true });
	const name = drawer.getByRole('textbox', { name: 'Employer name', exact: true });
	await name.fill('Unsaved employer');
	await drawer.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(section.getByRole('button', { name: 'First employer', exact: true })).toBeFocused();
	await section.getByRole('button', { name: 'First employer', exact: true }).click();
	await expect(name).toHaveValue('First employer');
	await name.fill('Updated employer');
	await drawer.getByRole('button', { name: 'Update', exact: true }).click();
	await expect(section.getByRole('button', { name: 'Updated employer', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(base);
	await page.getByRole('row').filter({ hasText: '1700v2018' }).getByRole('link', { name: /^Edit BIR Form / }).click();
	await goToReturnPage(page, 2);
	await expect(section.getByRole('heading', { name: 'Employers (1/4)', exact: true })).toBeVisible();
	await page.setViewportSize({ width: 390, height: 900 });
	await section.scrollIntoViewIfNeeded();
	await page.screenshot({ path: info.outputPath('numbered-employers-mobile.png'), animations: 'disabled' });
	await section.getByRole('button', { name: 'Updated employer', exact: true }).click();
	await drawer.getByRole('button', { name: 'Delete item', exact: true }).click();
	await expect(section.getByRole('heading', { name: 'Employers (0/4)', exact: true })).toBeVisible();
});

test('1701Q January edits Item 48 inline and preserves saved other income', async ({ page }, info) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'I', civilStatus: 'Single' }, [{
		id: 'quarterly-other', taxpayerId, formCode: '1701Qv2018', returnPeriod: '2025Q1', status: 'Draft', finalFlag: '0', updatedAt: 1794441600000,
		values: { 'frm1701q:txtYear': '2025', 'frm1701q:DateQuarter': '1', 'frm1701q:optTaxpayerType': 'Single', 'frm1701q:optATC': 'II015', 'frm1701q:optTaxRate': 'Percentage', 'frm1701q:txt48Desc': 'Quarterly rental', 'frm1701q:txt48A': '15000' }
	}]);
	await page.goto(`${base}/1701Qv2018?return=quarterly-other`);
	await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 45000 });
	await goToReturnPage(page, 2);
	const row = page.locator('tr[data-income-item="48"]');
	const description = row.locator('[id="frm1701q:txt48Desc"]');
	const amount = row.locator('[id="frm1701q:txt48A"]');
	const total = page.locator('[id="frm1701q:txt49A"]');
	await expect(description).toHaveValue('Quarterly rental');
	await expect(description).toHaveAttribute('maxlength', '25');
	await expect(amount).toHaveValue('15,000.00');
	await description.fill('Rental income');
	await amount.fill('18000');
	await amount.blur();
	await expect(total).toHaveText('₱18,000.00');
	await expect(page.getByRole('dialog')).toHaveCount(0);

	for (const width of [1440, 390]) {
		await page.setViewportSize({ width, height: 920 });
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
		await row.screenshot({
			path: info.outputPath(`1701qv2018-inline-item-48-${width}.png`), animations: 'disabled',
			style: '.eq-action-bar { position: static !important; }'
		});
	}

	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	await page.getByRole('row').filter({ hasText: '1701Qv2018' }).getByRole('link', { name: /^Edit BIR Form / }).click();
	await goToReturnPage(page, 2);
	await expect(description).toHaveValue('Rental income');
	await expect(amount).toHaveValue('18,000.00');
	await description.clear();
	await amount.clear();
	await amount.blur();
	await expect(total).toHaveText('₱0.00');
});

test('1701A other income adds in a drawer and preserves its subtotal through edit and delete', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'I', civilStatus: 'Single' }, [{
		id: 'annual-income', taxpayerId, formCode: '1701A', returnPeriod: '2025', status: 'Draft', finalFlag: '0', updatedAt: 1794441600000,
		values: { 'frm1701A:txtYear': '2025', 'frm1701A:optTaxType': 'S', 'frm1701A:optATC': 'II012' }
	}]);
	await page.goto(`${base}/1701A?return=annual-income`);
	await goToReturnPage(page, 2);
	const section = page.locator('[data-income-detail-items="42"] [data-income-records]');
	await expect(section).toBeVisible();
	await section.getByRole('button', { name: 'Add item', exact: true }).click();
	const drawer = page.getByRole('dialog', { name: 'Add item', exact: true });
	await drawer.getByRole('textbox', { name: 'Description', exact: true }).fill('Rental income');
	await drawer.getByRole('textbox', { name: 'Taxpayer amount', exact: true }).fill('15000');
	await drawer.getByRole('button', { name: 'Cancel', exact: true }).click();
	await expect(section.getByRole('listitem')).toHaveCount(0);
	await section.getByRole('button', { name: 'Add item', exact: true }).click();
	await drawer.getByRole('textbox', { name: 'Description', exact: true }).fill('Rental income');
	await drawer.getByRole('textbox', { name: 'Taxpayer amount', exact: true }).fill('15000');
	await drawer.getByRole('button', { name: 'Add item', exact: true }).click();
	await expect(page.locator('[id="frm1701A:txt42A"]')).toHaveText('₱15,000');
	await section.getByRole('button', { name: 'Rental income', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: 'Delete item', exact: true }).click();
	await expect(section.getByRole('listitem')).toHaveCount(0);
	await expect(page.locator('[id="frm1701A:txt42A"]')).toHaveText('₱0');
});

test('numbered dependents add and delete through one list while updating the declared count', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'I', civilStatus: 'Single' }, [{
		id: 'dependents', taxpayerId, formCode: '1700', returnPeriod: '2017', status: 'Draft', finalFlag: '0', updatedAt: 1794441600000,
		values: { 'frm1700:txtYear': '2017', 'frm1700:rdoPg1Pt1I14ClaimingAdditionalExemptions': 'frm1700:rdoPg1Pt1I14YesInd' }
	}]);
	await page.goto(`${base}/1700?return=dependents`);
	await goToReturnPage(page, 4);
	const section = page.getByRole('region', { name: 'Dependents', exact: true });
	await expect(section.getByRole('heading', { name: 'Dependents (0/4)', exact: true })).toBeVisible();
	await section.getByRole('button', { name: 'Add dependent', exact: true }).click();
	const drawer = page.getByRole('dialog', { name: 'Add dependent', exact: true });
	await drawer.getByRole('textbox', { name: 'Last name', exact: true }).fill('SANTOS');
	await drawer.getByRole('textbox', { name: 'First name', exact: true }).fill('JAMIE');
	await drawer.getByRole('spinbutton', { name: 'Month', exact: true }).fill('02');
	await drawer.getByRole('spinbutton', { name: 'Day', exact: true }).fill('02');
	await drawer.getByRole('spinbutton', { name: 'Year', exact: true }).fill('2011');
	await drawer.getByRole('button', { name: 'Add item', exact: true }).click();
	await expect(drawer).toBeHidden();
	await expect(section.getByRole('heading', { name: 'Dependents (1/4)', exact: true })).toBeVisible();
	await goToReturnPage(page, 1);
	await expect(page.locator('[id="frm1700:txtPg1Pt1I15QualifyDependent"]')).toHaveText('1');
	await goToReturnPage(page, 4);
	await section.getByRole('button', { name: 'SANTOS, JAMIE', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: 'Delete item', exact: true }).click();
	await expect(section.getByRole('heading', { name: 'Dependents (0/4)', exact: true })).toBeVisible();
});

test('special deduction drawer deletes one saved record and updates the total', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'I', civilStatus: 'Single' }, [{
		id: 'special-deduction', taxpayerId, formCode: '1701v2018', returnPeriod: '2025', status: 'Draft', finalFlag: '0', updatedAt: 1794441600000,
		values: { 'frm1701:txtPg1I1Year': '2025', 'frm1701:rdoPg1I7ATC': 'II012', 'frm1701:rdoPg1I21AMethodDeduction': 'Itemized', 'frm1701:txtPg3IShed5_1Desc': 'Eligible deduction', 'frm1701:txtPg3IShed5_1Legal': 'Statutory provision', 'frm1701:txtPg3IShed5_1Amt': '1200' }
	}]);
	await page.goto(`${base}/1701v2018?return=special-deduction`);
	await goToReturnPage(page, 3);
	const section = page.getByRole('region', { name: 'Schedule 5 · Special deductions · Taxpayer', exact: true });
	await section.getByRole('button', { name: 'Edit Item 1', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: 'Delete item', exact: true }).click();
	await expect(section.getByRole('listitem')).toHaveCount(0);
	await expect(page.locator('[id="frm1701:txtPg3IShed5_3"]')).toHaveText('₱0');
});
