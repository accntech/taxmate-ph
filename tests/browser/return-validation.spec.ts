import { expect, test } from '@playwright/test';
import { formPath, seedWorkspace, taxpayerId } from './fixtures';

for (const scenario of ['no ATC', 'zero tax base']) {
	test(`Finalization rejects taxes withheld Yes with ${scenario} without changing the saved return`, async ({ page }) => {
		await seedWorkspace(page);
		await page.goto(formPath);
		await expect(page.getByRole('radiogroup', { name: 'Any taxes withheld?' }).getByRole('radio', { name: 'Yes', exact: true })).toBeChecked();
		if (scenario === 'no ATC') {
			await page.getByRole('button', { name: 'Remove ATC row 1', exact: true }).click();
		} else {
			await page.getByRole('textbox', { name: 'Tax Base', exact: true }).fill('0');
		}
		await page.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(`/ebirforms/taxpayers/${taxpayerId}/forms`);
		const savedDraft = await page.evaluate(() => localStorage.getItem('ebirforms-created-returns-v1'));
		await page.getByRole('button', { name: /^More actions for BIR Form 1601EQ,/ }).click();
		await page.getByRole('menuitem', { name: 'Mark as final', exact: true }).click();
		await expect(page.getByRole('alert')).toContainText(scenario === 'no ATC' ? 'Add at least one ATC' : 'Enter a tax base greater than zero');
		expect(await page.evaluate(() => localStorage.getItem('ebirforms-created-returns-v1'))).toBe(savedDraft);
		await page.getByRole('link', { name: 'Edit', exact: true }).click();
		await page.getByRole('textbox', { name: 'Tax Base', exact: true }).fill('200000');
		await page.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(`/ebirforms/taxpayers/${taxpayerId}/forms`);
		const values = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0].values);
		expect(values['frm1601EQ:txtTaxBase13']).toBe('200000');
	});
}
