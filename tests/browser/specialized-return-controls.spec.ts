import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

test('0605 shows only the payment-dependent controls and resets their choices', async ({ page }) => {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/0605?new=true`);
	const manner = page.getByRole('combobox', { name: 'Manner of payment', exact: true });
	const approval = page.getByRole('radiogroup', { name: 'Approved by investigating office?', exact: true });
	await expect(approval).toHaveCount(0);
	await manner.click();
	await page.getByRole('option', { name: 'Preliminary/final assessment / deficiency', exact: true }).click();
	await approval.getByRole('radio', { name: 'Yes', exact: true }).check();
	await manner.click();
	await page.getByRole('option', { name: 'Self-assessment', exact: true }).click();
	await expect(approval).toHaveCount(0);
	await manner.click();
	await page.getByRole('option', { name: 'Preliminary/final assessment / deficiency', exact: true }).click();
	await expect(approval.getByRole('radio', { name: 'Yes', exact: true })).not.toBeChecked();
	const mode = page.getByRole('radiogroup', { name: 'Type of payment', exact: true });
	await mode.getByRole('radio', { name: 'Installment', exact: true }).check();
	const installment = page.getByRole('textbox', { name: 'Installment number', exact: true });
	await installment.fill('3');
	await mode.getByRole('radio', { name: 'Full payment', exact: true }).check();
	await expect(installment).toHaveCount(0);
	await mode.getByRole('radio', { name: 'Installment', exact: true }).check();
	await expect(installment).toHaveValue('');
});

for (const code of ['0619E', '0619F']) {
	test(`${code} preserves the draft prior remittance while toggling amendment`, async ({ page }) => {
		await seedWorkspace(page);
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
		const amended = page.getByRole('radiogroup', { name: 'Amended return?', exact: true });
		const previous = page.getByRole('textbox', { name: 'Amount previously remitted', exact: true });
		const tax = page.locator(`[id="frm${code}:${code === '0619E' ? 'txtTax14' : 'txtTax13'}"]`);
		const net = page.locator(`[id="frm${code}:${code === '0619E' ? 'txtTax16' : 'txtTax17'}"]`);
		await page.getByRole('radiogroup', { name: 'Any tax withheld?', exact: true })
			.getByRole('radio', { name: 'Yes', exact: true }).check();
		await tax.fill('1000');
		await tax.blur();
		await expect(previous).toHaveCount(0);
		await amended.getByRole('radio', { name: 'Yes', exact: true }).check();
		await previous.fill('500');
		await previous.blur();
		await amended.getByRole('radio', { name: 'No', exact: true }).check();
		await expect(previous).toHaveCount(0);
		await expect(net).toHaveText('₱1,000.00');
		await amended.getByRole('radio', { name: 'Yes', exact: true }).check();
		await expect(previous).toHaveValue('500.00');
		await expect(net).toHaveText('₱500.00');
	});

	test(`${code} preserves a sparse older draft credit while excluding it from an original return`, async ({ page }) => {
		const prefix = `frm${code}:`;
		const prior = code === '0619E' ? 'txtTax15' : 'txtTax16';
		const net = code === '0619E' ? 'txtTax16' : 'txtTax17';
		await seedWorkspace(page, 'light', 'loaded', {}, [{
			id: 'legacy-credit', taxpayerId, formCode: code, returnPeriod: '202506',
			status: 'Draft', finalFlag: '0', updatedAt: 1794441600000,
			values: {
				[prefix + 'txtYear']: '2025', [prefix + 'txtMonth']: '06',
				[prefix + 'optAmend']: 'N', [prefix + 'optWithheld']: 'Y',
				[prefix + 'txtTax14']: '1000', [prefix + prior]: '500'
			}
		}]);
		const path = `/ebirforms/taxpayers/${taxpayerId}/forms/${code}?return=legacy-credit`;
		await page.goto(path);
		const previous = page.getByRole('textbox', { name: 'Amount previously remitted', exact: true });
		await expect(previous).toHaveCount(0);
		await expect(page.locator(`[id="${prefix}${net}"]`)).toHaveText('₱1,000.00');
		await page.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(/\/forms$/);
		const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns
			.find((record: { id: string }) => record.id === 'legacy-credit').values);
		expect(stored[prefix + prior]).toBe('500');
		expect(stored[prefix + net]).toBe('1000.00');
		await page.goto(path);
		const amended = page.getByRole('radiogroup', { name: 'Amended return?', exact: true });
		await expect(amended.getByRole('radio', { name: 'No', exact: true })).toBeChecked();
		await expect(previous).toHaveCount(0);
		await amended.getByRole('radio', { name: 'Yes', exact: true }).check();
		await expect(previous).toHaveValue('500.00');
		await expect(page.locator(`[id="${prefix}${net}"]`)).toHaveText('₱500.00');
		await amended.getByRole('radio', { name: 'No', exact: true }).check();
		await expect(previous).toHaveCount(0);
		await expect(page.locator(`[id="${prefix}${net}"]`)).toHaveText('₱1,000.00');
	});
}
