import { describe, expect, it } from 'vitest';
import { calculateReturn, getReturnExportValues, validateReturnValues } from '../../../lib/forms/form-runtime';
import { parseLegacyXml, serializeLegacyXml } from '../../../lib/legacy/xml';
import { annual1701AAddDetail, annual1701ADetailFields, annual1701ADetailRows, annual1701ARemoveDetail } from '../../../lib/forms/individual-income/annual-1701a-income-detail';

const jointMixed = {
	'frm1701A:txtYear': '2025',
	'frm1701A:optTaxType': 'S',
	'frm1701A:optATC': 'II012',
	'frm1701A:optCivilStatus': 'Married',
	'frm1701A:optSpouseIncome': 'Y',
	'frm1701A:optFilingStatus': 'Joint',
	'frm1701A:optSpouseTaxType': 'P',
	'frm1701A:optSpouseATC': 'II017',
	'frm1701A:txt36A': '500000',
	'frm1701A:txt47B': '400000',
	'frm1701A:txt54B': '250000'
};

const detailed = {
	...jointMixed,
	'frm1701A:txt42Desc': 'OTHERS',
	'frm1701A:txt42A': '999999',
	'frm1701A:txtmodalPartIVADesc_1C1': 'Rental income',
	'frm1701A:txtmodalPartIVA_1C2': '5,000.00',
	'frm1701A:txtmodalPartIVA_1C3': '80000',
	'frm1701A:txtmodalPartIVADesc_4C1': 'Referral fees',
	'frm1701A:txtmodalPartIVA_4C2': '10000',
	'frm1701A:txt51Desc': 'Wrong subtotal',
	'frm1701A:txt51B': '200000',
	'frm1701A:txtmodalPartIVBDesc_2C1': 'Interest income',
	'frm1701A:txtmodalPartIVB_2C2': '90000',
	'frm1701A:txtmodalPartIVB_2C3': '30000'
};

describe('1701A repeatable other income', () => {
	it('reconciles source detail rows to each applicable filer amount and the return summary', () => {
		const calculated = calculateReturn('1701A', detailed);
		expect(calculated['frm1701A:txt42A']).toBe('15000.00');
		expect(calculated['frm1701A:txt44A']).toBe('15000.00');
		expect(calculated['frm1701A:txt51B']).toBe('30000.00');
		expect(calculated['frm1701A:txt52B']).toBe('30000.00');
		expect(calculated['frm1701A:txt45A']).toBe('315000.00');
		expect(calculated['frm1701A:txt55B']).toBe('180000.00');
		expect(calculated['frm1701A:txt30']).toBe('24150.00');
	});

	it('exports compact source row IDs and preserves totals through a legacy XML round trip', () => {
		const exported = getReturnExportValues('1701A', detailed);
		expect(exported['frm1701A:txtCtrmodalPartIVA']).toBe('2');
		expect(exported['frm1701A:txt42Desc']).toBe('OTHERS');
		expect(exported['frm1701A:txtmodalPartIVADesc_2C1']).toBe('Referral fees');
		expect(exported['frm1701A:txtmodalPartIVA_2C2']).toBe('10000');
		expect(exported['frm1701A:txtmodalPartIVADesc_4C1']).toBeUndefined();
		expect(exported['frm1701A:txtmodalPartIVA_1C3']).toBeUndefined();
		expect(exported['frm1701A:txtCtrmodalPartIVB']).toBe('0');
		expect(exported['frm1701A:txt51Desc']).toBe('Interest income');
		expect(exported['frm1701A:txt51B']).toBe('30000.00');
		expect(exported['frm1701A:txtmodalPartIVB_2C3']).toBeUndefined();
		expect(calculateReturn('1701A', parseLegacyXml(serializeLegacyXml(exported)))['frm1701A:txt30']).toBe('24150.00');
	});

	it('preserves a legacy draft with only a base-row description and amount', () => {
		const draft = { ...jointMixed, 'frm1701A:txt42Desc': 'Referral fees', 'frm1701A:txt42A': '5000' };
		const exported = getReturnExportValues('1701A', draft);
		expect(exported['frm1701A:txt42Desc']).toBe('Referral fees');
		expect(exported['frm1701A:txt42A']).toBe('5000');
		expect(exported['frm1701A:txt44A']).toBe('5000.00');
	});

	it('keeps a new row editable when its amount is cleared before entering a description', () => {
		const added = annual1701AAddDetail('42', jointMixed);
		const draft = { ...jointMixed, ...added.patch, [annual1701ADetailFields('42', 1).taxpayer]: '' };
		expect(annual1701ADetailRows('42', draft)).toHaveLength(1);
		const removed = { ...draft, ...annual1701ARemoveDetail('42', 1, draft, ['taxpayer']) };
		expect(annual1701ADetailRows('42', removed)).toHaveLength(0);
	});

	it('removing the active amount preserves a dormant spouse detail and its description', () => {
		const row = annual1701ADetailFields('42', 1);
		const edit = annual1701ARemoveDetail('42', 1, detailed, ['taxpayer']);
		const draft: Record<string, string> = { ...detailed, ...edit };
		expect(draft[row.taxpayer]).toBe('');
		expect(draft[row.spouse]).toBe('80000');
		expect(draft[row.description]).toBe('Rental income');
		const sameRate = { ...draft, 'frm1701A:optSpouseATC': 'II014' };
		expect(calculateReturn('1701A', sameRate)['frm1701A:txt42B']).toBe('80000.00');
	});

	it('requires a description for a populated detail row of an active filer', () => {
		const row = annual1701ADetailFields('42', 1);
		const draft = { ...detailed, [row.description]: '' };
		expect(validateReturnValues('1701A', draft)[row.description]).toBe('Enter a description for Item 42 entry 1.');
		const dormant = { ...draft, [row.taxpayer]: '' };
		expect(validateReturnValues('1701A', dormant)[row.description]).toBeUndefined();
	});

	it('flags invalid active detail amounts and does not include them in the sum', () => {
		const row = annual1701ADetailFields('42', 1);
		const draft = { ...detailed, [row.taxpayer]: '1,00', [row.spouse]: 'abc' };
		const errors = validateReturnValues('1701A', draft);
		expect(errors[row.taxpayer]).toMatch(/Enter an amount/);
		expect(errors[row.spouse]).toBeUndefined();
		expect(calculateReturn('1701A', draft)['frm1701A:txt42A']).toBe('10000.00');
	});

	it('requires a positive active amount for a named detail entry', () => {
		const row = annual1701ADetailFields('42', 1);
		const draft = { ...jointMixed, [row.description]: 'Rental income', [row.taxpayer]: '0.00' };
		expect(validateReturnValues('1701A', draft)[row.taxpayer]).toBe('Enter an amount greater than zero for Item 42 entry 1.');
		const blank = { ...draft, [row.description]: '' };
		expect(validateReturnValues('1701A', blank)[row.taxpayer]).toBeUndefined();
	});
});
