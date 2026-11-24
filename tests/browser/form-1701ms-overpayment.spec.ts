import { expect, test } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

test('1701-MS Item 31 supports a refund and carry-over split only when overpaid', async ({ page }) => {
	test.setTimeout(60000);
	await seedWorkspace(page, 'light', 'loaded', {
		taxpayerName: 'SANTOS, ALEX, REYES', taxpayerClassification: 'I', civilStatus: 'Single'
	});
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1701MS?new=true`);
	await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 40000 });
	const choices = page.getByRole('group', { name: '31 · Overpayment disposition' });
	const source = page.getByRole('radiogroup', { name: 'Taxpayer income source' });
	const regime = page.getByRole('radiogroup', { name: 'Taxpayer tax regime' });
	await expect(choices).toHaveCount(0);
	await page.getByRole('textbox', { name: /^Filing year/ }).fill('2025');
	await source.getByRole('radio', { name: 'Income from business' }).check();
	await regime.getByRole('radio', { name: '8% rate' }).check();
	await goToReturnPage(page, 2);
	const payments = page.locator('[id="frm1701MS:txtPriorYearsNo1a"]');
	await payments.fill('1000');
	await payments.blur();
	await goToReturnPage(page, 1);

	const refund = choices.getByRole('checkbox', { name: 'Refund' });
	const creditCertificate = choices.getByRole('checkbox', { name: 'Tax credit certificate (TCC)' });
	const carry = choices.getByRole('checkbox', { name: 'Carry over to next year or quarter' });
	const refundAmount = choices.getByRole('textbox', { name: 'Refund amount' });
	const carryAmount = choices.getByRole('textbox', { name: 'Carry-over amount' });
	await expect(choices).toBeVisible();
	await refund.check();
	await expect(creditCertificate).toBeDisabled();
	await refundAmount.fill('600');
	await carry.check();
	await carryAmount.fill('400');
	await carryAmount.blur();
	const allocated = choices.getByText('₱1,000', { exact: true });
	await expect(allocated).toBeVisible();
	for (const width of [1440, 320, 390]) {
		await page.setViewportSize({ width, height: 920 });
		await page.keyboard.press('Escape');
		await expect.poll(() => allocated.evaluate(element => {
			const text = document.createRange();
			text.selectNodeContents(element);
			const total = text.getBoundingClientRect().right;
			const amounts = [...element.closest('fieldset')!.querySelectorAll('input[inputmode="decimal"]')];
			return amounts.flatMap(input => {
				const offset = input.getBoundingClientRect().right - total;
				return Math.abs(offset) > 2 ? [{ field: input.id, offset }] : [];
			});
		}), { message: `Item 31 amount column at ${width}px` }).toEqual([]);
	}
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await page.getByRole('row').filter({ hasText: '1701MS' }).getByRole('link', { name: 'Edit', exact: true }).click();
	await expect(refundAmount).toHaveValue('600');
	await expect(carryAmount).toHaveValue('400');

	await goToReturnPage(page, 2);
	await payments.fill('0');
	await payments.blur();
	await goToReturnPage(page, 1);
	await expect(choices).toHaveCount(0);
	await goToReturnPage(page, 2);
	await payments.fill('1000');
	await payments.blur();
	await goToReturnPage(page, 1);
	await expect(refund).not.toBeChecked();
	await expect(carry).not.toBeChecked();
});

test('1701-MS prints legacy source checkbox values for an Item 31 split', async ({ page, context }) => {
	await page.route('**/__1701ms-overpayment-print', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html>' }));
	await page.goto('/__1701ms-overpayment-print');
	const html = await page.evaluate(async () => {
		const formsPath = '/src/lib/forms/index.ts';
		const reportPath = '/src/lib/printing/return-report.ts';
		const { getFormDefinition } = await import(formsPath) as typeof import('../../src/lib/forms');
		const { buildReturnReport } = await import(reportPath) as typeof import('../../src/lib/printing/return-report');
		const form = getFormDefinition('1701MS');
		if (!form) throw new Error('Expected the 1701-MS form definition.');
		return buildReturnReport(form, {
			'frm1701MS:txtYearNo1': '2025',
			'frm1701MS:civilStatus': 'Single',
			'frm1701MS:sourceOfIncomeTaxpayer': '1',
			'frm1701MS:txtTaxpayerNo12a': '3',
			'frm1701MS:txtPriorYearsNo1a': '1000',
			'frm1701MS:txtToBeIssued': '2',
			'frm1701MS:txtToBeIssued1': '600.00',
			'frm1701MS:txtToBeCarried': '3',
			'frm1701MS:txtToBeCarried1': '400.00'
		}, 'Draft', 'a4');
	});
	const print = await context.newPage();
	await print.setContent(html);
	await expect(print.locator('[id="frm1701MS:txtToBeIssued"]')).toBeChecked();
	await expect(print.locator('[id="frm1701MS:txtToBeCarried"]')).toBeChecked();
	await expect(print.locator('[id="frm1701MS:txtToBeRefunded"]')).not.toBeChecked();
	await expect(print.locator('[id="frm1701MS:txtToBeIssued1"]')).toHaveValue('600');
	await expect(print.locator('[id="frm1701MS:txtToBeCarried1"]')).toHaveValue('400');
});
