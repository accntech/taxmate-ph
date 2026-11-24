import { expect, test } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

const list = `/ebirforms/taxpayers/${taxpayerId}/forms`;

for (const { item, atc, baseLabel, total } of [
	{ item: '42', atc: 'II012', baseLabel: 'other income', total: '44' },
	{ item: '51', atc: 'II015', baseLabel: 'other non-operating income', total: '52' }
]) {
	test(`1701A preserves and reconciles Item ${item} detail rows`, async ({ page }) => {
		await seedWorkspace(page, 'light', 'loaded', {
			civilStatus: 'Single', taxpayerClassification: 'I', taxpayerType: 'single-proprietor'
		});
		await page.goto(`${list}/1701A?new=true`);
		const filingYear = page.getByRole('textbox', { name: /^Filing year/ });
		await expect(filingYear).toBeVisible({ timeout: 20000 });
		await filingYear.fill('2025');
		await page.getByRole('combobox', { name: 'Alphanumeric tax code (ATC)', exact: true }).selectOption(atc);
		await goToReturnPage(page, 2);

		const addEntry = page.getByRole('button', { name: `Add Item ${item} entry` });
		await expect(addEntry).toBeVisible();
		await page.getByRole('textbox', { name: `Item ${item} ${baseLabel} description` }).fill('Original income');
		const baseAmount = page.getByRole('textbox', { name: `Item ${item} ${baseLabel} amount` });
		await baseAmount.fill('12500');
		await baseAmount.blur();
		await addEntry.click();
		const entry1 = page.getByRole('textbox', { name: `Item ${item} entry 1 description` });
		const entry2 = page.getByRole('textbox', { name: `Item ${item} entry 2 description` });
		await expect(entry2).toBeFocused();
		await expect(entry1).toHaveValue('Original income');
		await entry2.fill('Additional income');
		const amount = page.getByRole('textbox', { name: `Item ${item} entry 2 taxpayer amount` });
		await amount.fill('37500');
		await amount.blur();

		const itemTotal = page.locator(`[id="frm1701A:txt${item}A"]`);
		const sectionTotal = page.locator(`[id="frm1701A:txt${total}A"]`);
		await page.setViewportSize({ width: 390, height: 920 });
		await page.keyboard.press('Escape');
		await amount.fill('1234567.89');
		await amount.blur();
		await expect.poll(() => amount.evaluate(input => {
			const style = getComputedStyle(input.parentElement!);
			const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
			return [style.paddingInlineStart, style.paddingInlineEnd].map(padding => parseFloat(padding) / rem);
		})).toEqual([.75, .75]);
		const geometry = await amount.evaluate((input: HTMLInputElement) => {
			return { visibleWidth: input.clientWidth, contentWidth: input.scrollWidth };
		});
		expect(geometry.visibleWidth).toBeGreaterThanOrEqual(geometry.contentWidth);
		const inputEdge = (await amount.boundingBox())!;
		const totalEdge = await itemTotal.evaluate(total => {
			const range = document.createRange();
			range.selectNodeContents(total);
			return range.getBoundingClientRect().right;
		});
		expect(Math.abs(inputEdge.x + inputEdge.width - totalEdge)).toBeLessThanOrEqual(2);
		await amount.fill('37500');
		await amount.blur();
		await expect(itemTotal).toHaveText('₱50,000');
		await expect(sectionTotal).toHaveText('₱50,000');

		async function saveAndReopen() {
			await page.getByRole('button', { name: 'Save draft', exact: true }).click();
			await page.getByRole('row').filter({ hasText: '1701A' }).getByRole('link', { name: 'Edit', exact: true }).click();
			await goToReturnPage(page, 2);
		}

		await saveAndReopen();
		await expect(entry1).toHaveValue('Original income');
		await expect(entry2).toHaveValue('Additional income');
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

		await page.getByRole('button', { name: `Remove Item ${item} entry 1` }).click();
		await expect(entry1).toHaveValue('Additional income');
		await expect(entry2).toHaveCount(0);
		await expect(itemTotal).toHaveText('₱37,500');
		await saveAndReopen();
		await expect(entry1).toHaveValue('Additional income');
		await expect(itemTotal).toHaveText('₱37,500');

		await page.getByRole('button', { name: `Remove Item ${item} entry 1` }).click();
		await expect(addEntry).toBeFocused();
		await saveAndReopen();
		await expect(entry1).toHaveCount(0);
		await expect(sectionTotal).toHaveText('₱0');
	});
}

test('1701A allows a missing shared description and preserves an inactive spouse amount', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'I', civilStatus: 'Married' }, [{
		id: 'mixed-detail', taxpayerId, formCode: '1701A', returnPeriod: '2025',
		status: 'Draft', updatedAt: 1794441600000, finalFlag: '0',
		values: {
			'frm1701A:txtYear': '2025',
			'frm1701A:optTaxType': 'S',
			'frm1701A:optATC': 'II012',
			'frm1701A:optCivilStatus': 'Married',
			'frm1701A:optSpouseIncome': 'Y',
			'frm1701A:optFilingStatus': 'Joint',
			'frm1701A:optSpouseTaxType': 'P',
			'frm1701A:optSpouseATC': 'II017',
			'frm1701A:txtmodalPartIVA_1C2': '10000',
			'frm1701A:txtmodalPartIVA_1C3': '80000'
		}
	}]);
	await page.goto(`${list}/1701A?return=mixed-detail`);
	await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 20000 });
	await goToReturnPage(page, 2);

	const description = page.getByRole('textbox', { name: 'Item 42 entry 1 description' });
	await description.pressSequentially('Rental income');
	await expect(description).toHaveValue('Rental income');
	await description.blur();
	await expect(description).not.toBeEditable();
	await page.getByRole('button', { name: 'Remove Item 42 entry 1 active amount', exact: true }).click();
	await expect(description).toHaveCount(0);
	await expect(page.locator('[id="frm1701A:txt42A"]')).toHaveText('₱0');

	const spouseAtc = page.getByRole('combobox', { name: 'Spouse alphanumeric tax code (ATC)', exact: true });
	await spouseAtc.selectOption('II014');
	await expect(description).toHaveValue('Rental income');
	await expect(page.getByRole('textbox', { name: 'Item 42 entry 1 spouse amount' })).toHaveValue('80,000');
});
