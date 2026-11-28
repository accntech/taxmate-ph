import { expect, test } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';
import { printSavedReturn } from './helpers/return-pdf';
import { seedLegacyPrintArtwork } from './helpers/legacy-print-artwork';

test.beforeEach(async ({ page }) => { await seedLegacyPrintArtwork(page); });

const list = `/ebirforms/taxpayers/${taxpayerId}/forms`;

test.beforeEach(async ({ page }) => {
	await page.routeWebSocket('**/*', socket => socket.close());
});

for (const { item, atc, total } of [
	{ item: '42', atc: 'II012', total: '44' },
	{ item: '51', atc: 'II015', total: '52' }
]) {
	test(`1701A enters Item ${item} inline as one printable entry`, async ({ page }, info) => {
		await seedWorkspace(page, 'light', 'loaded', {
			civilStatus: 'Single', taxpayerClassification: 'I', taxpayerType: 'single-proprietor'
		});
		await page.goto(`${list}/1701A?new=true`);
		await page.getByRole('group', { name: 'Filing period', exact: true }).getByRole('spinbutton', { name: 'Year', exact: true }).fill('2025');
		await page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true }).selectOption(atc);
		await goToReturnPage(page, 2);

		const schedule = page.locator(`[data-income-detail-items="${item}"]`);
		const description = schedule.locator(`[id="frm1701A:txt${item}Desc"]`);
		const amount = schedule.locator(`[id="frm1701A:txt${item}A"]`);
		await expect(description).toBeEditable();
		await expect(amount).toBeEditable();
		await expect(schedule.getByRole('textbox')).toHaveCount(2);
		await expect(schedule.getByRole('button', { name: 'Add item', exact: true })).toHaveCount(0);
		await description.fill('Printable income');
		await amount.fill('12500');
		await amount.blur();
		await expect(page.locator(`[id="frm1701A:txt${total}A"]`)).toHaveText('₱12,500');
		await schedule.screenshot({ path: info.outputPath(`1701a-item-${item}-inline.png`), animations: 'disabled' });

		await page.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(list);
		const printed = await printSavedReturn(page, '1701A', info.outputPath(`1701a-item-${item}.pdf`));
		await expect(printed.locator(`[data-income-field="frm1701A:txt${item}Desc"]`)).toHaveValue('Printable income');
		await expect(printed.locator(`[data-income-field="frm1701A:txt${item}A"]`)).toHaveValue('12,500');
		await printed.close();
	});

	test(`1701A preserves and reconciles existing Item ${item} detail rows`, async ({ page }, info) => {
		const part = item === '42' ? 'IVA' : 'IVB';
		await seedWorkspace(page, 'light', 'loaded', {
			civilStatus: 'Single', taxpayerClassification: 'I', taxpayerType: 'single-proprietor'
		}, [{
			id: 'legacy-income', taxpayerId, formCode: '1701A', returnPeriod: '2025',
			status: 'Draft', updatedAt: 1794441600000, finalFlag: '0',
			values: {
				'frm1701A:txtYear': '2025', 'frm1701A:optTaxType': 'S', 'frm1701A:optATC': atc,
				[`frm1701A:txtmodalPart${part}Desc_1C1`]: 'Original income',
				[`frm1701A:txtmodalPart${part}_1C2`]: '12500',
				[`frm1701A:txtmodalPart${part}Desc_4C1`]: 'Additional income',
				[`frm1701A:txtmodalPart${part}_4C2`]: '37500'
			}
		}]);
		await page.goto(`${list}/1701A?return=legacy-income`);
		await goToReturnPage(page, 2);

		const schedule = page.locator(`[data-income-detail-items="${item}"]`);
		const original = schedule.locator(`[id="frm1701A:txtmodalPart${part}Desc_1C1"]`);
		const additional = schedule.locator(`[id="frm1701A:txtmodalPart${part}Desc_4C1"]`);
		const additionalAmount = schedule.locator(`[id="frm1701A:txtmodalPart${part}_4C2"]`);
		const itemTotal = page.locator(`[id="frm1701A:txt${item}A"]`);
		const sectionTotal = page.locator(`[id="frm1701A:txt${total}A"]`);
		await expect(itemTotal).toHaveText('₱50,000');
		await expect(sectionTotal).toHaveText('₱50,000');
		await expect(schedule.getByRole('button', { name: 'Add item', exact: true })).toHaveCount(0);
		await page.setViewportSize({ width: 390, height: 920 });
		await additionalAmount.fill('1234567.89');
		await additionalAmount.blur();
		await expect(itemTotal).toHaveText('₱1,247,068');
		expect(await additionalAmount.evaluate(element => element.getBoundingClientRect().right)).toBeLessThanOrEqual(390);
		await additionalAmount.locator('xpath=ancestor::tr').screenshot({
			path: info.outputPath(`1701a-${item}-legacy-inline-mobile.png`), animations: 'disabled'
		});
		await additionalAmount.fill('37500');
		await additionalAmount.blur();
		await page.setViewportSize({ width: 1280, height: 900 });
		await expect(itemTotal).toHaveText('₱50,000');

		async function saveAndReopen() {
			await page.getByRole('button', { name: 'Save draft', exact: true }).click();
			await expect(page).toHaveURL(list);
			await page.getByRole('row').filter({ hasText: '1701A' }).getByRole('link', { name: /^Edit BIR Form / }).click();
			await goToReturnPage(page, 2);
		}
		await saveAndReopen();
		await expect(original).toHaveValue('Original income');
		await expect(additional).toHaveValue('Additional income');
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

		await schedule.getByRole('button', { name: `Clear Item ${item}.1`, exact: true }).click();
		await expect(original).toHaveCount(0);
		await expect(itemTotal).toHaveText('₱37,500');
		await expect(additional).toBeFocused();
		await saveAndReopen();
		await expect(additional).toHaveValue('Additional income');
		await schedule.getByRole('button', { name: `Clear Item ${item}.4`, exact: true }).click();
		const baseDescription = schedule.locator(`[id="frm1701A:txt${item}Desc"]`);
		await expect(baseDescription).toBeFocused();
		await saveAndReopen();
		await expect(additional).toHaveCount(0);
		await expect(baseDescription).toHaveValue('');
		await expect(sectionTotal).toHaveText('₱0');
	});
}

test('1701A keeps an older sparse row focused while replacing its only saved value', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {
		civilStatus: 'Single', taxpayerClassification: 'I', taxpayerType: 'single-proprietor'
	}, [{
		id: 'sparse-income', taxpayerId, formCode: '1701A', returnPeriod: '2025',
		status: 'Draft', updatedAt: 1794441600000, finalFlag: '0',
		values: {
			'frm1701A:txtYear': '2025', 'frm1701A:optTaxType': 'S', 'frm1701A:optATC': 'II012',
			'frm1701A:txt42Desc': 'Saved subtotal',
			'frm1701A:txt42A': '999',
			'frm1701A:txtmodalPartIVADesc_4C1': 'Old description'
		}
	}]);
	await page.goto(`${list}/1701A?return=sparse-income`);
	await goToReturnPage(page, 2);

	const description = page.getByRole('textbox', { name: 'Item 42.4 description', exact: true });
	const amount = page.getByRole('textbox', { name: 'Item 42.4 amount', exact: true });
	const total = page.locator('[id="frm1701A:txt42A"]');
	await expect(total).toHaveText('₱0');
	await description.fill('');
	await expect(description).toBeFocused();
	await expect(total).toHaveText('₱0');
	await description.fill('New description');
	await description.press('Tab');
	await amount.fill('750');
	await expect(total).toHaveText('₱750');
});

test('1701A lets an active filer reuse the shared entry without overwriting the other filer', async ({ page }) => {
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
	const description = schedule.getByRole('textbox', { name: 'Item 42.1 description', exact: true });
	const taxpayerAmount = schedule.getByRole('textbox', { name: 'Item 42.1 amount · Taxpayer', exact: true });
	const spouseAmount = schedule.getByRole('textbox', { name: 'Item 42.1 amount · Spouse', exact: true });
	await description.fill('Rental income');
	await expect(description).toHaveAttribute('readonly', '');
	await expect(spouseAmount).toHaveCount(0);
	await schedule.getByRole('button', { name: 'Clear Item 42.1', exact: true }).click();
	await expect(page.locator('[id="frm1701A:txt42A"]')).toHaveText('₱0');
	await expect(description).toHaveValue('Rental income');
	await expect(taxpayerAmount).toBeFocused();
	await taxpayerAmount.fill('12000');
	await expect(page.locator('[id="frm1701A:txt42A"]')).toHaveText('₱12,000');
	await page.getByRole('combobox', { name: 'Spouse alphanumeric tax code (ATC)', exact: true }).selectOption('II014');
	await expect(spouseAmount).toHaveValue('80,000');
	await expect(description).toBeEditable();
});
