import { expect, test } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';
import { printSavedReturn } from './helpers/return-pdf';

const forms = `/ebirforms/taxpayers/${taxpayerId}/forms`;
const cases = [
	{
		code: '1701', year: '2017', sourcePage: 5, resultPage: 12,
		value: '123456', formatted: '123,456',
		source: 'txtPg5Sc2I1TaxPayerC1', target: 'txtPg12Pt9I3TotalSalesC1',
		label: 'Item 3 Total sales and operating income · Taxpayer · Regular'
	},
	{
		code: '1701v2018', year: '2025', sourcePage: 3, resultPage: 3,
		value: '654321', formatted: '654,321',
		source: 'txtPg3IShed4_1A', target: 'txtPg3IShed4_18A',
		label: 'Item 18 total ordinary itemized deductions amount'
	}
];

for (const example of cases) {
	test(`${example.code} displays a labeled calculation and carries it into the saved PDF`, async ({ page }, info) => {
		const draftId = 'calculated-' + example.code;
		await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'I', civilStatus: 'Single' }, [{
			id: draftId, taxpayerId, formCode: example.code, returnPeriod: example.year, status: 'Draft',
			finalFlag: '0', updatedAt: 1794441600000, values: { 'frm1701:txtPg1I1Year': example.year }
		}]);
		await page.setViewportSize({ width: 1280, height: 900 });
		await page.goto(`${forms}/${example.code}?return=${draftId}`);
		await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 90_000 });
		await goToReturnPage(page, example.sourcePage);
		const source = page.locator(`[id="frm1701:${example.source}"]`);
		await source.fill(example.value);
		await source.blur();
		await goToReturnPage(page, example.resultPage);
		const result = page.locator(`[id="frm1701:${example.target}"]`);
		await expect(result).toHaveJSProperty('tagName', 'OUTPUT');
		await expect(result).toHaveAccessibleName(example.label);
		await expect(result).toHaveText(`₱${example.formatted}`);
		const resultRow = result.locator('xpath=ancestor::tr[1]');
		await resultRow.screenshot({ path: info.outputPath('calculated-desktop.png') });
		await page.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(forms);
		await page.getByRole('row').filter({ hasText: example.code }).getByRole('link', { name: /^Edit BIR Form / }).click();
		await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 20_000 });
		await goToReturnPage(page, example.resultPage);
		await expect(result).toHaveText(`₱${example.formatted}`);
		await page.getByRole('link', { name: /Back to forms/ }).click();
		await expect(page).toHaveURL(forms);
		const printed = await printSavedReturn(page, example.code, info.outputPath(example.code + '.pdf'));
		if (example.code === '1701') {
			await expect(printed.locator(`[data-legacy-print-id="${example.target}"]`)).toHaveText(example.formatted);
		} else {
			await expect(printed.locator(`[data-income-field="frm1701:${example.target}"]`)).toHaveValue(example.formatted);
		}
		await printed.close();
		await page.getByRole('dialog', { name: 'Open generated PDF?' })
			.getByRole('button', { name: 'Not now', exact: true }).click();
		await page.getByRole('row').filter({ hasText: example.code }).getByRole('link', { name: /^Edit BIR Form / }).click();
		await goToReturnPage(page, example.resultPage);
		await page.setViewportSize({ width: 390, height: 900 });
		const sidebar = page.locator('aside.sidebar');
		const sidebarToggle = page.getByRole('button', { name: 'Toggle sidebar', exact: true });
		await expect(sidebarToggle).toBeVisible();
		if (await sidebar.getAttribute('data-mobile-open') === 'true') await sidebarToggle.click();
		await page.keyboard.press('Escape');
		await expect.poll(async () => (await sidebar.boundingBox())?.x ?? 0).toBeLessThan(-245);
		await resultRow.screenshot({ path: info.outputPath('calculated-mobile.png') });
	});
}
