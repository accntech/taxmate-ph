import { describe, expect, it } from 'vitest';
import { calculate1601EQ, validate1601EQ } from '$lib/forms/form-1601-eq/form-1601-eq-rules';
import { get1601EQRate } from '$lib/forms/form-1601-eq/form-1601-eq-atcs';

const prefix = 'frm1601EQ:';
const field = (name: string) => `${prefix}${name}`;
const now = new Date('2026-11-12T00:00:00Z');
function validReturn(): Record<string, string> {
	return {
		[field('txtYear')]: '2026', [field('optQuarter')]: 'Q3',
		[field('optAmendedReturn')]: 'N', [field('optTaxesWithheld')]: 'Y',
		[field('txtTIN1')]: '123', [field('txtTIN2')]: '456', [field('txtTIN3')]: '789',
		[field('txtBranchCode')]: '0000', [field('txtRDOCode')]: '063',
		[field('txtTaxpayerName')]: 'Example taxpayer', [field('txtAddress')]: 'Example address',
		[field('txtZipCode')]: '5213', [field('txtTelNum')]: '09951234567',
		[field('optCategory')]: 'P', txtEmail: 'example@example.com',
		[field('txtATC13')]: 'WI120', [field('txtTaxBase13')]: '100000',
		[field('txtTaxRate13')]: '2'
	};
}

describe('1601EQ source-based validation and computation', () => {
	it.each(['000', '017', '128', '999', '050A', '17a'])('rejects RDO %s outside the packaged options', (rdo) => {
		const values = validReturn();
		values[field('txtRDOCode')] = rdo;
		expect(validate1601EQ(values, now)[field('txtRDOCode')]).toBeTruthy();
	});

	it.each(['001', '17A', '21C', '43B', '93A', '132'])('accepts packaged RDO %s', (rdo) => {
		const values = validReturn();
		values[field('txtRDOCode')] = rdo;
		expect(validate1601EQ(values, now)).toEqual({});
	});

	it.each([
		['txtZipCode', '12AB'], ['txtZipCode', '1234567890123'],
		['txtTelNum', '+639951234567'], ['txtTelNum', '0995-123-4567'],
		['txtTelNum', '123456789012345678901'],
		['txtSheetsAttached', '100'], ['txtSheetsAttached', '000']
	])('rejects %s value %s outside the documented input restrictions', (name, value) => {
		const values = validReturn();
		values[field(name)] = value;
		expect(validate1601EQ(values, now)[field(name)]).toBeTruthy();
	});

	it.each([
		['txtZipCode', '0'], ['txtZipCode', '001234567890'],
		['txtTelNum', '0'], ['txtTelNum', '00123456789012345678'],
		['txtSheetsAttached', ''], ['txtSheetsAttached', '0'],
		['txtSheetsAttached', '00'], ['txtSheetsAttached', '99']
	])('accepts %s value %s within the documented input restrictions', (name, value) => {
		const values = validReturn();
		values[field(name)] = value;
		expect(validate1601EQ(values, now)).toEqual({});
	});

	it('calculates withholding and totals instead of trusting editable totals', () => {
		const values = validReturn();
		values[field('txtRemittanceFirstMonth')] = '500';
		values[field('txtInterest')] = '100';
		values[field('txtTotalAmountDue')] = '99999';
		const result = calculate1601EQ(values);
		expect(result[field('txtTaxWithheld13')]).toBe('2000.00');
		expect(result[field('txtTotalTaxesWithheld')]).toBe('2000.00');
		expect(result[field('txtTotalRemittances')]).toBe('500.00');
		expect(result[field('txtTotalPenalties')]).toBe('100.00');
		expect(result[field('txtTotalAmountDue')]).toBe('1600.00');
		expect(values[field('txtTotalAmountDue')]).toBe('99999');
	});

	it('uses grouped currency values consistently in computation and validation', () => {
		const values = validReturn();
		values[field('txtTaxBase13')] = '100,000.00';
		values[field('txtRemittanceFirstMonth')] = '₱ 1,000.00';
		values[field('txtInterest')] = '100.00';
		expect(calculate1601EQ(values)[field('txtTotalAmountDue')]).toBe('1100.00');
		expect(calculate1601EQ(values)[field('txtTaxBase13')]).toBe('100000.00');
		expect(validate1601EQ(values, now)).toEqual({});
	});

	it('rejects malformed grouping without silently accepting a different amount', () => {
		const values = validReturn();
		values[field('txtTaxBase13')] = '10,00.00';
		values[field('txtInterest')] = '1,00';
		const errors = validate1601EQ(values, now);
		expect(errors[field('txtTaxBase13')]).toBeTruthy();
		expect(errors[field('txtInterest')]).toBeTruthy();
	});

	it('accepts a complete regular return and a nil return without any ATC', () => {
		expect(validate1601EQ(validReturn(), now)).toEqual({});
		const nil = validReturn();
		nil[field('optTaxesWithheld')] = 'N';
		delete nil[field('txtATC13')];
		delete nil[field('txtTaxBase13')];
		delete nil[field('txtTaxRate13')];
		expect(validate1601EQ(nil, now)).toEqual({});
	});

	it('requires the profile fields checked by original final validation', () => {
		const values = validReturn();
		for (const id of ['txtAddress', 'txtZipCode', 'txtTelNum']) values[field(id)] = '';
		values.txtEmail = '';
		const errors = validate1601EQ(values, now);
		for (const id of ['txtAddress', 'txtZipCode', 'txtTelNum']) expect(errors[field(id)]).toBeTruthy();
		expect(errors.txtEmail).toBeTruthy();
	});

	it('requires an ATC when tax was withheld and validates each populated row', () => {
		const values = validReturn();
		values[field('txtATC13')] = '';
		expect(validate1601EQ(values, now)[field('txtATC13')]).toBeTruthy();
		values[field('txtATC13')] = 'WI120';
		values[field('txtTaxBase13')] = '0';
		expect(validate1601EQ(values, now)[field('txtTaxBase13')]).toBeTruthy();
		values[field('txtTaxBase13')] = '100';
		values[field('txtATC14')] = 'wrong';
		values[field('txtTaxBase14')] = '100';
		values[field('txtTaxRate14')] = '2';
		expect(validate1601EQ(values, now)[field('txtATC14')]).toBeTruthy();
	});

	it.each(['0', '0.00', '000.00', '₱ 0.00'])('rejects a selected ATC with zero tax base %s when taxes were withheld', (base) => {
		const values = validReturn();
		values[field('txtTaxBase13')] = base;
		expect(validate1601EQ(values, now)).toEqual({
			[field('txtTaxBase13')]: 'Enter a tax base greater than zero.'
		});
	});

	it('allows positive tax bases whose computed withholding rounds to zero', () => {
		const values = validReturn();
		values[field('txtTaxBase13')] = '0.01';
		expect(calculate1601EQ(values)[field('txtTaxWithheld13')]).toBe('0.00');
		expect(validate1601EQ(values, now)).toEqual({});
	});

	it('uses Manila quarter boundaries and rejects future and pre-2018 periods', () => {
		const values = validReturn();
		values[field('optQuarter')] = 'Q4';
		expect(validate1601EQ(values, now)[field('optQuarter')]).toBeTruthy();
		values[field('optQuarter')] = 'Q1';
		expect(validate1601EQ(values, new Date('2026-03-31T15:59:59Z'))[field('optQuarter')]).toBeTruthy();
		expect(validate1601EQ(values, new Date('2026-03-31T16:00:00Z'))).toEqual({});
		values[field('txtYear')] = '2027';
		expect(validate1601EQ(values, now)[field('txtYear')]).toBeTruthy();
		values[field('txtYear')] = '2017';
		expect(validate1601EQ(values, now)[field('txtYear')]).toBeTruthy();
	});

	it('excludes previous-return payments unless amended and requires disposition of overpayment', () => {
		const values = validReturn();
		values[field('txtTaxRemittedPreviousReturn')] = '2500';
		expect(calculate1601EQ(values)[field('txtTaxRemittedPreviousReturn')]).toBe('0.00');
		values[field('optAmendedReturn')] = 'Y';
		expect(calculate1601EQ(values)[field('txtTotalAmountDue')]).toBe('-500.00');
		expect(validate1601EQ(values, now)[field('overpaymentOption')]).toBeTruthy();
		values[field('overpaymentOption')] = 'carry';
		expect(validate1601EQ(values, now)).toEqual({});
	});

	it('normalizes nil computations without discarding separately applicable payments or penalties', () => {
		const values = validReturn();
		values[field('optTaxesWithheld')] = 'N';
		values[field('txtInterest')] = '100';
		const result = calculate1601EQ(values);
		expect(result[field('txtATC13')]).toBe('');
		expect(result[field('txtTaxBase13')]).toBe('');
		expect(result[field('txtTaxWithheld13')]).toBe('0.00');
		expect(result[field('txtTotalTaxesWithheld')]).toBe('0.00');
		expect(result[field('txtTotalAmountDue')]).toBe('100.00');
	});

	it('rejects negative or malformed amounts and fractional sheet counts', () => {
		const values = validReturn();
		values[field('txtSheetsAttached')] = '1.5';
		values[field('txtRemittanceFirstMonth')] = '-5';
		values[field('txtInterest')] = '1junk';
		const errors = validate1601EQ(values, now);
		expect(errors[field('txtSheetsAttached')]).toBeTruthy();
		expect(errors[field('txtRemittanceFirstMonth')]).toBeTruthy();
		expect(errors[field('txtInterest')]).toBeTruthy();
	});

	it('ignores hidden credits for first-quarter and non-amended returns', () => {
		const values = validReturn();
		values[field('optQuarter')] = 'Q1';
		values[field('txtOverremittancePreviousQuarter')] = '1000';
		values[field('txtTaxRemittedPreviousReturn')] = 'invalid';
		expect(calculate1601EQ(values)[field('txtOverremittancePreviousQuarter')]).toBe('0.00');
		expect(calculate1601EQ(values)[field('txtTotalAmountDue')]).toBe('2000.00');
		values[field('txtOverremittancePreviousQuarter')] = 'invalid';
		expect(validate1601EQ(values, now)).toEqual({});
	});

	it('preserves incomplete tax row inputs for draft saving', () => {
		const values = validReturn();
		values[field('txtATC13')] = '';
		const result = calculate1601EQ(values);
		expect(result[field('txtTaxBase13')]).toBe('100000');
		expect(result[field('txtTaxRate13')]).toBe('2');
		expect(result[field('txtTaxWithheld13')]).toBe('0.00');
	});

	it('rejects branches the existing taxpayer identifier cannot preserve', () => {
		const values = validReturn();
		for (const branch of ['ABCDE', '12345']) {
			values[field('txtBranchCode')] = branch;
			expect(validate1601EQ(values, now)[field('txtBranchCode')]).toBeTruthy();
		}
	});

	it('rejects unknown ATCs and malformed packaged ATC entries', () => {
		const values = validReturn();
		for (const code of ['WI999', 'WI240', 'WI341', 'WC212', 'WC213']) {
			values[field('txtATC13')] = code;
			expect(validate1601EQ(values, now)[field('txtATC13')]).toBeTruthy();
		}
	});

	it('applies the packaged category filter without treating WI/WC as agent categories', () => {
		const values = validReturn();
		values[field('txtATC13')] = 'WC770';
		expect(validate1601EQ(values, now)).toEqual({});
		values[field('optCategory')] = 'G';
		expect(validate1601EQ(values, now)[field('txtATC13')]).toBeTruthy();
		values[field('txtATC13')] = 'WC010';
		expect(validate1601EQ(values, now)).toEqual({});
	});

	it('derives the selected packaged rate instead of trusting an imported or missing rate', () => {
		const values = validReturn();
		for (const inputRate of ['', '99', 'NaN']) {
			values[field('txtTaxRate13')] = inputRate;
			expect(calculate1601EQ(values)[field('txtTaxRate13')]).toBe('2.00');
			expect(calculate1601EQ(values)[field('txtTaxWithheld13')]).toBe('2000.00');
			expect(validate1601EQ(values, now)).toEqual({});
		}
	});

	it('applies documented legacy-year overrides and exposes no rate for unavailable ATCs', () => {
		expect(get1601EQRate('WI650', 'P', 2018)).toBe('25.00');
		expect(get1601EQRate('WI651', 'P', 2018)).toBe('32.00');
		expect(get1601EQRate('WI663', 'P', 2018)).toBe('20.00');
		expect(get1601EQRate('WI120', 'P', 2026)).toBe('2.00');
		expect(get1601EQRate('WI999', 'P', 2026)).toBeUndefined();
		expect(get1601EQRate('WI240', 'P', 2026)).toBeUndefined();
	});

	it('rejects carry-over from the fourth quarter into another taxable year', () => {
		const values = validReturn();
		values[field('txtYear')] = '2025';
		values[field('optQuarter')] = 'Q4';
		values[field('txtRemittanceFirstMonth')] = '2500';
		values[field('overpaymentOption')] = 'carry';
		expect(validate1601EQ(values, now)[field('overpaymentOption')]).toBeTruthy();
		values[field('overpaymentOption')] = 'refund';
		expect(validate1601EQ(values, now)).toEqual({});
	});
});
