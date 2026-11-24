import { describe, expect, it } from 'vitest';
import { getReturnExportValues } from '../../../lib/forms/form-runtime';
import {
	calculate1701A,
	calculate1701MS,
	validate1701A,
	validate1701MS
} from '../../../lib/forms/individual-income/annual-short';

describe('1701A inactive filing selections', () => {
	it('excludes prior-return and unclaimed foreign credits until their elections apply', () => {
		const draft = {
			'frm1701A:txtYear': '2025',
			'frm1701A:txt36A': '1000000',
			'frm1701A:optAmendedReturn': 'N',
			'frm1701A:txt61A': '2000',
			'frm1701A:txt62A': '3000'
		};
		expect(calculate1701A(draft)['frm1701A:txt64A']).toBe('0.00');
		expect(calculate1701A({ ...draft, 'frm1701A:optAmendedReturn': 'Y', 'frm1701A:optForeignTaxCredits': 'Y' })['frm1701A:txt64A']).toBe('5000.00');
	});

	it('uses the rate implied by an ATC even when an older draft retained another rate', () => {
		const draft = {
			'frm1701A:txtYear': '2025',
			'frm1701A:optTaxType': 'S',
			'frm1701A:optATC': 'II015',
			'frm1701A:optTaxRate': 'G',
			'frm1701A:txt36A': '1000000',
			'frm1701A:txt47A': '500000',
			'frm1701A:txt54A': '250000'
		};
		const calculation = calculate1701A(draft);
		expect(calculation['frm1701A:optTaxRate']).toBe('E');
		expect(calculation['frm1701A:txt20A']).toBe('20000.00');
		expect(calculation['frm1701A:txt46A']).toBe('0.00');
		expect(calculation['frm1701A:txt36A']).toBe('1000000');
		const exported = getReturnExportValues('1701A', draft);
		expect(exported['frm1701A:txt20A']).toBe('20000.00');
		expect(exported['frm1701A:txt36A']).toBeUndefined();
	});

	it('excludes a retained joint schedule when a married filer selects a spouse has no income', () => {
		const draft = {
			'frm1701A:txtYear': '2025',
			'frm1701A:optCivilStatus': 'Married',
			'frm1701A:optSpouseIncome': 'N',
			'frm1701A:optFilingStatus': 'Joint',
			'frm1701A:txt36B': '1000000'
		};
		expect(calculate1701A(draft)['frm1701A:txt30']).toBe('0.00');
		expect(validate1701A(draft)['frm1701A:txtSpouseTIN1']).toBeUndefined();
	});
});

describe('1701-MS inactive filing selections', () => {
	it('excludes an earlier return payment from an original return', () => {
		const draft = {
			'frm1701MS:txtAmended': 'N',
			'frm1701MS:txtTaxPaidPreviouslyFiledNo6a': '5000'
		};
		expect(calculate1701MS(draft)['frm1701MS:txtTotalTaxCreditsPaymentsPartVNo10a']).toBe('0.00');
		expect(calculate1701MS({ ...draft, 'frm1701MS:txtAmended': 'Y' })['frm1701MS:txtTotalTaxCreditsPaymentsPartVNo10a']).toBe('5000.00');
	});

	it('excludes retained compensation and Form 2316 credit for a pure business filer', () => {
		const draft = {
			'frm1701MS:sourceOfIncomeTaxpayer': '1',
			'frm1701MS:txtTaxpayerNo12a': '2',
			'frm1701MS:txtSalesRevenueNo5a': '1000000',
			'frm1701MS:txtGrossa': '400000',
			'frm1701MS:txtCreditableForm2316No5a': '22500',
			methodOfDeductionMain: 'osd'
		};
		const calculation = calculate1701MS(draft);
		expect(calculation['frm1701MS:txtTaxableCompensationIncomea']).toBe('0.00');
		expect(calculation['frm1701MS:txtTotalTaxCreditsPaymentsPartVNo10a']).toBe('0.00');
		expect(calculation['frm1701MS:txtAggregateAmountPayable30a']).toBe('62500.00');
	});

	it('uses only compensation for a joint filer’s compensation-only spouse', () => {
		const calculation = calculate1701MS({
			'frm1701MS:civilStatus': 'Married',
			'frm1701MS:txtIfMarried': '1',
			'frm1701MS:sourceOfIncomeSpouse': '4',
			'frm1701MS:txtTaxpayerNo12b': '2',
			'frm1701MS:txtGrossb': '400000',
			'frm1701MS:txtSalesRevenueNo5b': '1000000'
		});
		expect(calculation['frm1701MS:txtIncomeTaxRegularNo22b']).toBe('22500.00');
		expect(calculation['frm1701MS:txtTaxableCompensationIncomeNo7b']).toBe('0.00');
	});

	it('disregards saved cost of sales after switching from itemized deductions to OSD', () => {
		const draft = {
			'frm1701MS:sourceOfIncomeTaxpayer': '1',
			'frm1701MS:txtTaxpayerNo12a': '2',
			'frm1701MS:txtSalesRevenueNo5a': '1000000',
			'frm1701MS:txtCostofSalesNo8a': '200000',
			methodOfDeductionMain: 'osd'
		};
		const calculation = calculate1701MS(draft);
		expect(calculation['frm1701MS:txtTaxableIncomeBusinesNo14a']).toBe('600000.00');
		expect(calculation['frm1701MS:txtIncomeTaxRegularNo22a']).toBe('62500.00');
		expect(calculation['frm1701MS:txtCostofSalesNo8a']).toBe('200000');
		expect(getReturnExportValues('1701MS', draft)['frm1701MS:txtCostofSalesNo8a']).toBeUndefined();
	});

	it('disregards spouse amounts and validations when civil status makes a retained joint choice inactive', () => {
		const draft = {
			'frm1701MS:civilStatus': 'Single',
			'frm1701MS:txtIfMarried': '1',
			'frm1701MS:txtTaxpayerNo12b': '2',
			'frm1701MS:txtSalesRevenueNo5b': '1000000',
			'frm1701MS:txtOtherCreditsPaymentsNo9b': '10000'
		};
		expect(calculate1701MS(draft)['frm1701MS:txtAggregateAmountPayable30a']).toBe('0.00');
		const errors = validate1701MS(draft);
		expect(errors['frm1701MS:txtPg2TIN1Spouse']).toBeUndefined();
		expect(errors['frm1701MS:addOtherCreditsPayments']).toBeUndefined();
	});
});
