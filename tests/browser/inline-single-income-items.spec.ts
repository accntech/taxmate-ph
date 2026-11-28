import { expect, test } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

const formsPath = `/ebirforms/taxpayers/${taxpayerId}/forms`;
const cases: {
	code: string;
	page: number;
	variant?: string;
	values?: Record<string, string>;
	rows: [item: string, description: string, amount: string][];
}[] = [
	{ code: '1700', page: 2, rows: [
		['12', 'frm1700:txtPg2Pt4I12', 'frm1700:txtPg2Pt4I12C1'],
		['18', 'frm1700:txtPg2Pt4I18TC', 'frm1700:txtPg2Pt4I18C1']
	] },
	{ code: '1700v2018', page: 2, rows: [
		['45', 'frm1700:txtPg2I45Desc', 'frm1700:txtPg2I45A'],
		['57', 'frm1700:txtPg2I57Desc', 'frm1700:txtPg2I57A']
	] },
	{ code: '1700v2018', page: 2, variant: 'nonresident alien', values: { 'frm1700:rdoPg1I6TaxpayerType': 'NRANETB' }, rows: [
		['49', 'frm1700:txtPg2I49Desc', 'frm1700:txtPg2I49A'],
		['51', 'frm1700:txtPg2I51Desc', 'frm1700:txtPg2I51A']
	] },
	{ code: '1701', page: 9, rows: [['9', 'frm1701:txtPg9Sc9I9Description', 'frm1701:txtPg9Sc9I9TaxPayerC1']] },
	{ code: '1701', page: 17, variant: 'activity attachment', values: {
		'frm1701:rdoPg1Pt1I22IncomeExempt': 'Yes', 'frm1701:rdoPg1Pt1I23IncomeSpecial': 'Yes'
	}, rows: [['9', 'frm1701:txtPg5mScJI9OthersTYPE', 'frm1701:txtPg5mScJI9OtherPaymentsC1TYPE']] },
	{ code: '1701v2018', page: 3, rows: [['27', 'frm1701:txtPg3IShed3_27Desc', 'frm1701:txtPg3IShed3_27A']] },
	{ code: '1701A', page: 2, variant: 'graduated', values: {
		'frm1701A:txtYear': '2025', 'frm1701A:optTaxType': 'S', 'frm1701A:optATC': 'II012'
	}, rows: [['41', 'frm1701A:txt41Desc', 'frm1701A:txt41A'], ['63', 'frm1701A:txt63Desc', 'frm1701A:txt63A']] },
	{ code: '1701A', page: 2, variant: '8 percent', values: {
		'frm1701A:txtYear': '2025', 'frm1701A:optTaxType': 'S', 'frm1701A:optATC': 'II015'
	}, rows: [['50', 'frm1701A:txt50Desc', 'frm1701A:txt50A']] }
];

for (const { code, page: pageNumber, variant, values, rows } of cases) {
	test(`${code} page ${pageNumber} ${variant ?? 'default'} edits single rows inline`, async ({ page }, info) => {
		await page.routeWebSocket('**/*', socket => socket.close());
		await page.setViewportSize({ width: 1440, height: 950 });
		await seedWorkspace(page, 'light', 'loaded', {
			taxpayerClassification: 'I', civilStatus: 'Single', taxpayerType: 'single-proprietor'
		}, values ? [{
			id: 'inline-items', taxpayerId, formCode: code, returnPeriod: '2025', status: 'Draft',
			updatedAt: 1794441600000, finalFlag: '0', values
		}] : []);
		await page.goto(`${formsPath}/${code}${values ? '?return=inline-items' : '?new=true'}`);
		await expect(page.getByRole('button', { name: 'Save draft', exact: true })).toBeVisible({ timeout: 30000 });
		await goToReturnPage(page, pageNumber);
		const closed = page.locator('.income-editor details:not([open]) > summary:visible');
		while (await closed.count()) await closed.first().click();

		for (const [item, descriptionId, amountId] of rows) {
			const description = page.locator(`input[id="${descriptionId}"]`);
			const amount = page.locator(`input[id="${amountId}"]`);
			const row = page.locator(`tr[data-income-item="${item}"]`).filter({ has: description });
			await expect(description).toBeVisible();
			await expect(amount).toBeVisible();
			await expect(row.getByRole('button', { name: 'Add item', exact: true })).toHaveCount(0);
			await description.fill('Sample');
			await amount.fill('12500');
			await amount.blur();
			await expect(amount).toHaveValue(/12,500/);
			await expect(page.getByRole('dialog')).toHaveCount(0);
			if (process.env.CAPTURE_INLINE_SINGLE_ITEMS === '1') {
				await row.screenshot({ path: info.outputPath(`item-${item}-desktop.png`), animations: 'disabled' });
				await page.setViewportSize({ width: 390, height: 950 });
				await expect(description).toBeVisible();
				await expect(amount).toBeVisible();
				await row.screenshot({ path: info.outputPath(`item-${item}-mobile.png`), animations: 'disabled' });
				await page.setViewportSize({ width: 1440, height: 950 });
			}
		}

		if (code === '1700') {
			await page.getByRole('button', { name: 'Save draft', exact: true }).click();
			await expect(page).toHaveURL(formsPath);
			await page.getByRole('link', { name: /^Edit BIR Form / }).click();
			await goToReturnPage(page, pageNumber);
			for (const [, description, amount] of rows) {
				await expect(page.locator(`input[id="${description}"]`)).toHaveValue('Sample');
				await expect(page.locator(`input[id="${amount}"]`)).toHaveValue(/12,500/);
			}
		}
	});
}
