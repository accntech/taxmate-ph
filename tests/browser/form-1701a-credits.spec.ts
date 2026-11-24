import { expect, test } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

test('1701A keeps cleared election credits blank after saving and reopening', async ({ page }) => {
	await seedWorkspace(page, 'light', 'loaded', {
		taxpayerName: 'SANTOS, ALEX, REYES',
		taxpayerClassification: 'I',
		taxpayerType: 'single-proprietor',
		civilStatus: 'Single'
	});
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1701A?new=true`);
	await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 20000 });
	await page.getByRole('textbox', { name: /^Filing year/ }).fill('2025');

	const amended = page.getByRole('radiogroup', { name: 'Amended return?', exact: true });
	const foreignTaxCredits = page.getByRole('radiogroup', { name: 'Claiming foreign tax credits?', exact: true });
	const foreignTaxNumber = page.locator('[id="frm1701A:txtForeignTaxNumber"]');
	for (const election of [amended, foreignTaxCredits]) {
		await election.getByRole('radio', { name: 'Yes', exact: true }).check();
	}
	await foreignTaxNumber.fill('123456789');

	await goToReturnPage(page, 2);
	const withholding = page.locator('[id="frm1701A:txt59A"]');
	const previousReturn = page.locator('[id="frm1701A:txt61A"]');
	const foreignAmount = page.locator('[id="frm1701A:txt62A"]');
	const total = page.locator('[id="frm1701A:txt64A"]');
	await withholding.fill('1000');
	await previousReturn.fill('2000');
	await foreignAmount.fill('3000');
	await foreignAmount.blur();
	await expect(total).toHaveText('₱6,000.00');

	await goToReturnPage(page, 1);
	for (const election of [amended, foreignTaxCredits]) {
		await election.getByRole('radio', { name: 'No', exact: true }).check();
	}
	await expect(foreignTaxNumber).toHaveCount(0);
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await page.getByRole('row').filter({ hasText: '1701A' }).getByRole('link', { name: 'Edit', exact: true }).click();

	for (const election of [amended, foreignTaxCredits]) {
		await expect(election.getByRole('radio', { name: 'No', exact: true })).toBeChecked();
		await election.getByRole('radio', { name: 'Yes', exact: true }).check();
	}
	await expect(foreignTaxNumber).toHaveValue('');
	await goToReturnPage(page, 2);
	await expect(previousReturn).toHaveValue('');
	await expect(foreignAmount).toHaveValue('');
	await expect(withholding).toHaveValue('1,000.00');
	await expect(total).toHaveText('₱1,000.00');
});
