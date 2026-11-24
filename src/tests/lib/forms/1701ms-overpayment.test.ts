import { describe, expect, it } from 'vitest';
import { validate1701MS } from '$lib/forms/individual-income/annual-short';

const overpayment = {
	'frm1701MS:civilStatus': 'Single',
	'frm1701MS:sourceOfIncomeTaxpayer': '1',
	'frm1701MS:txtTaxpayerNo12a': '3',
	'frm1701MS:txtPriorYearsNo1a': '1000'
};

describe('1701-MS Item 31', () => {
	it('requires a positive amount for each selected disposition', () => {
		const errors = validate1701MS({
			...overpayment,
			'frm1701MS:txtToBeRefunded': 'Y',
			'frm1701MS:txtToBeRefunded1': '0',
			'frm1701MS:txtToBeCarried': 'Y',
			'frm1701MS:txtToBeCarried1': '1000'
		});
		expect(errors).toHaveProperty('frm1701MS:txtToBeRefunded1', 'Enter an amount greater than zero.');
	});

	it('rejects conflicting refund and certificate choices in an older draft', () => {
		const errors = validate1701MS({
			...overpayment,
			'frm1701MS:txtToBeRefunded': '1',
			'frm1701MS:txtToBeRefunded1': '500',
			'frm1701MS:txtToBeIssued': '2',
			'frm1701MS:txtToBeIssued1': '500'
		});
		expect(errors).toHaveProperty('frm1701MS:txtToBeIssued', 'Choose either a refund or a tax credit certificate.');
	});

	it('reconciles a split including centavos against Item 27', () => {
		const errors = validate1701MS({
			...overpayment,
			'frm1701MS:txtToBeIssued': 'Y',
			'frm1701MS:txtToBeIssued1': '369.88',
			'frm1701MS:txtToBeCarried': 'Y',
			'frm1701MS:txtToBeCarried1': '630.12'
		});
		expect(Object.keys(errors).filter(id => id.startsWith('frm1701MS:txtToBe'))).toEqual([]);
	});
});
