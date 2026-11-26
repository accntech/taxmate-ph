import { expect, test } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

const list = `/ebirforms/taxpayers/${taxpayerId}/forms`;

for (const { item, atc, total } of [
	{ item: '42', atc: 'II012', total: '44' },
	{ item: '51', atc: 'II015', total: '52' }
]) {
	test(`1701A preserves and reconciles Item ${item} detail rows`, async ({ page }, info) => {
		await seedWorkspace(page, 'light', 'loaded', {
			civilStatus: 'Single', taxpayerClassification: 'I', taxpayerType: 'single-proprietor'
		});
		await page.goto(`${list}/1701A?new=true`);
		const filingYear = page.getByRole('textbox', { name: /^Filing year/ });
		await expect(filingYear).toBeVisible({ timeout: 30000 });
		await filingYear.fill('2025');
		await page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true }).selectOption(atc);
		await goToReturnPage(page, 2);

		const schedule = page.locator(`[data-income-detail-items="${item}"]`);
		const addEntry = schedule.getByRole('button', { name: 'Add item', exact: true });
		const drawer = page.getByRole('dialog');
		for (const [description, amount] of [['Original income', '12500'], ['Additional income', '37500']]) {
			await addEntry.click();
			await expect(drawer.getByRole('textbox', { name: 'Description', exact: true })).toBeFocused();
			await drawer.getByRole('textbox', { name: 'Description', exact: true }).fill(description);
			await drawer.getByRole('textbox', { name: 'Taxpayer amount', exact: true }).fill(amount);
			await drawer.getByRole('button', { name: 'Add item', exact: true }).click();
			await expect(drawer).toBeHidden();
		}
		const itemTotal = page.locator(`[id="frm1701A:txt${item}A"]`);
		const sectionTotal = page.locator(`[id="frm1701A:txt${total}A"]`);
		await expect(itemTotal).toHaveText('₱50,000');
		await expect(sectionTotal).toHaveText('₱50,000');
		await page.setViewportSize({ width: 390, height: 920 });
		await schedule.getByRole('button', { name: 'Additional income', exact: true }).click();
		await drawer.getByRole('textbox', { name: 'Taxpayer amount', exact: true }).fill('1234567.89');
		await drawer.getByRole('textbox', { name: 'Taxpayer amount', exact: true }).blur();
		expect(await drawer.evaluate(element => element.scrollWidth - element.clientWidth)).toBe(0);
		await page.screenshot({ path: info.outputPath(`1701a-${item}-drawer-mobile.png`), animations: 'disabled' });
		await drawer.getByRole('button', { name: 'Cancel', exact: true }).click();
		await expect(itemTotal).toHaveText('₱50,000');

		async function saveAndReopen() {
			await page.getByRole('button', { name: 'Save draft', exact: true }).click();
			await expect(page).toHaveURL(list);
			await page.getByRole('row').filter({ hasText: '1701A' }).getByRole('link', { name: 'Edit', exact: true }).click();
			await goToReturnPage(page, 2);
		}
		await saveAndReopen();
		await expect(schedule.getByRole('button', { name: 'Original income', exact: true })).toBeVisible();
		await expect(schedule.getByRole('button', { name: 'Additional income', exact: true })).toBeVisible();
		await expect(itemTotal).toHaveText('₱50,000');
		const html = await page.evaluate(async () => {
			const formsModule = '/src/lib/forms/index.ts';
			const reportModule = '/src/lib/printing/return-report.ts';
			const { getFormDefinition } = await import(formsModule) as typeof import('../../src/lib/forms');
			const { buildReturnReport } = await import(reportModule) as typeof import('../../src/lib/printing/return-report');
			const saved = JSON.parse(localStorage.getItem('ebirforms-created-returns-v1') ?? '{}') as {
				returns?: { formCode: string; values: Record<string, string>; status: string }[]
			};
			const draft = saved.returns?.find(record => record.formCode === '1701A');
			const form = getFormDefinition('1701A');
			if (!form || !draft) throw new Error('Expected a saved 1701A draft.');
			return buildReturnReport(form, draft.values, draft.status, 'a4');
		});
		const print = await page.context().newPage();
		await print.setContent(html);
		await expect(print.locator(`[data-income-field="frm1701A:txt${item}A"]`)).toHaveValue('50,000');
		await print.close();

		await schedule.getByRole('button', { name: 'Original income', exact: true }).click();
		await drawer.getByRole('button', { name: 'Delete item', exact: true }).click();
		await expect(schedule.getByRole('button', { name: 'Original income', exact: true })).toHaveCount(0);
		await expect(itemTotal).toHaveText('₱37,500');
		await saveAndReopen();
		await expect(schedule.getByRole('button', { name: 'Additional income', exact: true })).toBeVisible();
		await schedule.getByRole('button', { name: 'Additional income', exact: true }).click();
		await drawer.getByRole('button', { name: 'Delete item', exact: true }).click();
		await expect(addEntry).toBeFocused();
		await saveAndReopen();
		await expect(schedule.getByRole('listitem')).toHaveCount(0);
		await expect(sectionTotal).toHaveText('₱0');
	});
}

test('1701A allows a missing shared description and preserves an inactive spouse amount', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'I', civilStatus: 'Married' }, [{
		id: 'mixed-detail', taxpayerId, formCode: '1701A', returnPeriod: '2025',
		status: 'Draft', updatedAt: 1794441600000, finalFlag: '0',
		values: {
			'frm1701A:txtYear': '2025', 'frm1701A:optTaxType': 'S', 'frm1701A:optATC': 'II012',
			'frm1701A:optCivilStatus': 'Married', 'frm1701A:optSpouseIncome': 'Y', 'frm1701A:optFilingStatus': 'Joint',
			'frm1701A:optSpouseTaxType': 'P', 'frm1701A:optSpouseATC': 'II017',
			'frm1701A:txtmodalPartIVA_1C2': '10000', 'frm1701A:txtmodalPartIVA_1C3': '80000'
		}
	}]);
	await page.goto(`${list}/1701A?return=mixed-detail`);
	await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 30000 });
	await goToReturnPage(page, 2);
	const schedule = page.locator('[data-income-detail-items="42"]');
	await schedule.getByRole('button', { name: 'Item 42.1', exact: true }).click();
	const drawer = page.getByRole('dialog');
	await drawer.getByRole('textbox', { name: 'Description', exact: true }).fill('Rental income');
	await drawer.getByRole('button', { name: 'Update', exact: true }).click();
	await schedule.getByRole('button', { name: 'Rental income', exact: true }).click();
	await expect(drawer.getByRole('textbox', { name: 'Description', exact: true })).toHaveCount(0);
	await drawer.getByRole('button', { name: 'Delete item', exact: true }).click();
	await expect(schedule.getByRole('listitem')).toHaveCount(0);
	await expect(page.locator('[id="frm1701A:txt42A"]')).toHaveText('₱0');
	await page.getByRole('combobox', { name: 'Spouse alphanumeric tax code (ATC)', exact: true }).selectOption('II014');
	await schedule.getByRole('button', { name: 'Rental income', exact: true }).click();
	await expect(drawer.getByRole('textbox', { name: 'Spouse amount', exact: true })).toHaveValue('80,000');
});
