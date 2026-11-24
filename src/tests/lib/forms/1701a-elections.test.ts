import { describe, expect, it } from 'vitest';
import { getReturnExportValues } from '$lib/forms/form-runtime';
import {
	annual1701AElectionPatch, calculate1701A, shortAnnualFieldApplies, validate1701A
} from '$lib/forms/individual-income/annual-short';

const prefix = 'frm1701A:';
const values = (fields: Record<string, string>) => Object.fromEntries(
	Object.entries(fields).map(([id, value]) => [prefix + id, value])
);

describe('1701A filing elections', () => {
	it('rejects an ATC that is incompatible with the filer type', () => {
		const draft = values({ optTaxType: 'S', optATC: 'II017', txt47A: '500000', txt54A: '250000' });

		expect(validate1701A(draft)[prefix + 'optATC']).toMatch(/taxpayer type/i);
		expect(calculate1701A(draft)[prefix + 'txt20A']).toBe('0.00');
	});

	it('leaves saved regime amounts dormant until a valid ATC is selected', () => {
		const draft = values({ optTaxType: 'S', optTaxRate: 'E', txt47A: '500000', txt54A: '250000' });
		const calculated = calculate1701A(draft);
		const exported = getReturnExportValues('1701A', draft);

		expect(shortAnnualFieldApplies('1701A', prefix + 'txt47A', draft)).toBe(false);
		expect(shortAnnualFieldApplies('1701A', prefix + 'txt36A', draft)).toBe(false);
		expect(calculated[prefix + 'txt20A']).toBe('0.00');
		expect(calculated[prefix + 'optTaxRate']).toBe('E');
		expect(calculated[prefix + 'txt47A']).toBe('500000');
		expect(exported[prefix + 'txt47A']).toBeUndefined();
		expect(exported[prefix + 'optTaxRate']).toBeUndefined();

		const selected = { ...draft, ...values({ optATC: 'II015' }) };
		expect(getReturnExportValues('1701A', selected)[prefix + 'txt20A']).toBe('20000.00');
	});

	it('activates the spouse schedule independently of the taxpayer schedule', () => {
		const draft = values({
			optCivilStatus: 'Married', optSpouseIncome: 'Y', optFilingStatus: 'Joint',
			optTaxType: 'S', optATC: 'II012', optSpouseTaxType: 'P', optSpouseATC: 'II015'
		});

		expect(validate1701A(draft)[prefix + 'optSpouseATC']).toMatch(/taxpayer type/i);
		expect(shortAnnualFieldApplies('1701A', prefix + 'txt36A', draft)).toBe(true);
		expect(shortAnnualFieldApplies('1701A', prefix + 'txt47B', draft)).toBe(false);
		expect(shortAnnualFieldApplies('1701A', prefix + 'txt50Desc', draft)).toBe(false);
	});

	it('offers overpayment disposition only when all active filers have an applicable rate', () => {
		const draft = values({
			optCivilStatus: 'Married', optSpouseIncome: 'Y', optFilingStatus: 'Joint',
			optTaxType: 'S', optATC: 'II012', optSpouseTaxType: 'P', txt59A: '5000'
		});
		const calculated = calculate1701A(draft);
		expect(calculated[prefix + 'txt30']).toBe('-5000.00');
		expect(shortAnnualFieldApplies('1701A', prefix + 'optRefund', calculated)).toBe(false);
		expect(validate1701A(draft)[prefix + 'optRefund']).toBeUndefined();

		const ready = { ...draft, ...values({ optSpouseATC: 'II017' }) };
		expect(shortAnnualFieldApplies('1701A', prefix + 'optRefund', calculate1701A(ready))).toBe(true);
		expect(validate1701A(ready)[prefix + 'optRefund']).toEqual(expect.stringContaining('overpayment disposition'));
	});

	it('clears the spouse ATC and rate when the spouse changes taxpayer type', () => {
		const draft = values({
			optTaxType: 'P', optATC: 'II017', optTaxRate: 'E',
			optSpouseTaxType: 'S', optSpouseATC: 'II012', optSpouseTaxRate: 'G',
			txt36B: '500000'
		});
		const patch = annual1701AElectionPatch(draft, prefix + 'optSpouseTaxType', 'P');

		expect(patch).toEqual(values({ optSpouseTaxType: 'P', optSpouseATC: '', optSpouseTaxRate: '' }));
		expect(annual1701AElectionPatch({ ...draft, ...patch }, prefix + 'optSpouseATC', 'II014')).toEqual(
			values({ optSpouseATC: 'II014', optSpouseTaxRate: 'G' })
		);
	});

	it.each([
		['optAmendedReturn', ['txt61A', 'txt61B']],
		['optForeignTaxCredits', ['txtForeignTaxNumber', 'txt62A']],
		['optSpouseFTC', ['txtSpouseFTN', 'txt62B']]
	])('clears only the %s dependent fields when switched off', (election, fields) => {
		const draft = values({ optAmendedReturn: 'Y', optForeignTaxCredits: 'Y', optSpouseFTC: 'Y',
			txt61A: '2000', txt61B: '1000', txtForeignTaxNumber: 'FTN-A', txt62A: '3000', txtSpouseFTN: 'FTN-B', txt62B: '4000'
		});

		expect(annual1701AElectionPatch(draft, prefix + election, 'N')).toEqual({
			[prefix + election]: 'N',
			...Object.fromEntries(fields.map(field => [prefix + field, '']))
		});
	});

	it.each([
		['optAmendedReturn', { optAmendedReturn: 'N', txt61A: '2000', txt61B: '1000' }, ['txt61A', 'txt61B']],
		['optForeignTaxCredits', { optForeignTaxCredits: 'N', txtForeignTaxNumber: 'FTN-A', txt62A: '3000' }, ['txtForeignTaxNumber', 'txt62A']],
		['optSpouseFTC', { txtSpouseFTN: 'FTN-B', txt62B: '4000' }, ['txtSpouseFTN', 'txt62B']]
	] as const)('does not restore stale legacy data when %s is turned on', (election, fields, dependent) => {
		const draft = values({ ...fields, txt59A: '1000' });
		const patch = annual1701AElectionPatch(draft, prefix + election, 'Y');

		expect(patch).toEqual({
			[prefix + election]: 'Y',
			...Object.fromEntries(dependent.map(field => [prefix + field, '']))
		});
		expect(annual1701AElectionPatch({ ...draft, ...values({ [election]: 'Y' }) }, prefix + election, 'Y')).toBeUndefined();
	});
});
