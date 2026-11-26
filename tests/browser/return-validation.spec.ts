import { expect, test } from '@playwright/test';
import { formPath, seedWorkspace, taxpayerId } from './fixtures';

test.beforeEach(async ({ page }) => {
	await page.routeWebSocket('**/*', socket => socket.close());
});

for (const scenario of ['no ATC', 'zero tax base']) {
	test(`Finalization rejects taxes withheld Yes with ${scenario} without changing the saved return`, async ({ page }) => {
		await seedWorkspace(page);
		if (scenario === 'zero tax base') {
			await page.addInitScript(() => {
				const data = JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!);
				data.returns[0].values['frm1601EQ:txtTaxBase13'] = '0';
				localStorage.setItem('ebirforms-created-returns-v1', JSON.stringify(data));
			});
		}
		await page.goto(formPath);
		await expect(page.getByRole('radiogroup', { name: 'Any taxes withheld?' }).getByRole('radio', { name: 'Yes', exact: true })).toBeChecked();
		if (scenario === 'no ATC') {
			await page.getByRole('button', { name: 'Edit line item 1', exact: true }).click();
			await page.getByRole('dialog').getByRole('button', { name: 'Delete item', exact: true }).click();
			await expect(page.getByRole('dialog')).toBeHidden();
		}
		await page.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(`/ebirforms/taxpayers/${taxpayerId}/forms`);
		const savedDraft = await page.evaluate(() => localStorage.getItem('ebirforms-created-returns-v1'));
		await page.getByRole('button', { name: /^More actions for BIR Form 1601EQ,/ }).click();
		await page.getByRole('menuitem', { name: 'Mark as final', exact: true }).click();
		await expect(page.getByRole('alert')).toContainText(scenario === 'no ATC' ? 'Add at least one ATC' : 'Enter a tax base greater than zero');
		expect(await page.evaluate(() => localStorage.getItem('ebirforms-created-returns-v1'))).toBe(savedDraft);
		await page.getByRole('link', { name: 'Edit', exact: true }).click();
		await page.getByRole('button', { name: scenario === 'no ATC' ? 'Add line item' : 'Edit line item 1' }).click();
		const editor = page.getByRole('dialog');
		if (scenario === 'no ATC') {
			await editor.getByRole('combobox', { name: 'ATC', exact: true }).click();
			await page.getByPlaceholder('Search code or income', { exact: true }).fill('WI120');
			await page.getByRole('option', { name: /WI120/ }).click();
		}
		await editor.getByRole('textbox', { name: 'Tax Base', exact: true }).fill('200000');
		await editor.getByRole('button', { name: scenario === 'no ATC' ? 'Add' : 'Update', exact: true }).click();
		await expect(editor).toBeHidden();
		await expect(page.getByLabel('Item 13 Tax base', { exact: true })).toHaveText('₱200,000.00');
		await page.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(`/ebirforms/taxpayers/${taxpayerId}/forms`);
		const values = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0].values);
		expect(values['frm1601EQ:txtTaxBase13']).toBe('200000');
	});
}
