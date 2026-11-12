import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

const quarters = ['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter'];

for (const code of ['1601EQ', '1601FQ', '1602Qv2018', '1603', '1603Qv2018']) {
	test(`${code} displays full quarter labels and saves the original code`, async ({ page }, testInfo) => {
		await seedWorkspace(page, 'dark');
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
		const quarter = page.getByRole('combobox', { name: 'Quarter', exact: true });
		await quarter.click();
		await expect(page.getByRole('option')).toHaveText(quarters);
		await page.getByRole('option', { name: 'Third Quarter', exact: true }).click();
		await expect(quarter).toHaveText('Third Quarter');
		await quarter.click();
		await expect(page.getByRole('option', { selected: true })).toHaveText('Third Quarter');
		await page.screenshot({ path: testInfo.outputPath('quarter-options.png') });
		await quarter.press('Escape');
		await page.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(/\/forms$/);
		const saved = await page.evaluate((code) => {
			return JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns
				.find((record: { formCode: string; id: string }) => record.formCode === code && record.id !== 'review-return');
		}, code);
		const prefix = `frm${code.replace('v2018', '')}:`;
		expect(saved.values[prefix + 'optQuarter']).toBe('Q3');
		await page.getByRole('row').filter({ hasText: `BIR Form ${code}` }).filter({ hasText: 'Q3' })
			.getByRole('link', { name: 'Edit', exact: true }).click();
		await expect(quarter).toHaveText('Third Quarter');
	});
}

test('1606 displays percentage labels and saves numeric rate strings', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1606?new=true`);
	const rate = page.getByRole('combobox', { name: 'Tax rate (%)', exact: true });
	await rate.click();
	await expect(page.getByRole('option')).toHaveText(['0%', '1.5%', '3%', '5%', '6%']);
	await page.getByRole('option', { name: '1.5%', exact: true }).click();
	await expect(rate).toHaveText('1.5%');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns
		.find((record: { formCode: string }) => record.formCode === '1606'));
	expect(saved.values['frm1606:txtTaxRate']).toBe('1.5');
});

test('0619F explains tax types and saves the original tax type code', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/0619F?new=true`);
	const taxType = page.getByRole('combobox', { name: 'Tax type', exact: true });
	await taxType.click();
	await expect(page.getByRole('option')).toHaveText([
		'WB — Withholding tax — banks and other financial institutions',
		'WF — Final withholding tax'
	]);
	await page.getByRole('option', { name: 'WF — Final withholding tax', exact: true }).click();
	await expect(taxType).toHaveText('WF — Final withholding tax');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns
		.find((record: { formCode: string }) => record.formCode === '0619F'));
	expect(saved.values['frm0619F:txtTaxTypeCode']).toBe('WF');
});
