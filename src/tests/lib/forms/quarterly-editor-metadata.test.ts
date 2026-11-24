import { describe, expect, it } from 'vitest';
import { getIndividualIncomeForm } from '../../../lib/forms/individual-income';
import { incomeChoiceLabel, incomeEditorFields, incomeEditorRows } from '../../../lib/forms/individual-income/editor-layout';

const fields = (code: '1701Q' | '1701Qv2018') => incomeEditorFields(getIndividualIncomeForm(code)!);

describe('1701Q editor metadata', () => {
	it('uses the source computation heading and gives interleaved amounts distinct descriptions', () => {
		const rows = incomeEditorRows(fields('1701Q').filter(field => field.section === 'Part II · Computation of Tax'));
		expect(rows.map(row => row.item)).toEqual([
			'26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37',
			'38A/B', '38C/D', '38E/F', '38G/H', '38I/J', '38K/L', '38M/N', '39',
			'40A/B', '40C/D', '40E/F', '40G/H', '41', '41C'
		]);
		for (const [item, taxpayer, spouse, description] of [
			['38C/D', '38C', '38D', 'Tax payments for previous quarters'],
			['38E/F', '38E', '38F', 'Creditable tax withheld for previous quarters'],
			['38G/H', '38G', '38H', 'Creditable tax withheld this quarter per BIR Form 2307'],
			['40C/D', '40C', '40D', 'Interest'],
			['40E/F', '40E', '40F', 'Compromise']
		]) {
			const row = rows.find(candidate => candidate.item === item)!;
			expect(row.fields.map(field => [field.id, field.person, field.label])).toEqual([
				[`frm1701q:txt${taxpayer}`, 'taxpayer', `${item} ${description} · Taxpayer`],
				[`frm1701q:txt${spouse}`, 'spouse', `${item} ${description} · Spouse`]
			]);
		}
		expect(rows.at(-1)?.fields).toEqual([expect.objectContaining({
			id: 'frm1701q:txt41C', person: undefined, label: '41C Aggregate amount payable or overpayment'
		})]);
	});

	it('labels the July 2008 relief question and its blank selection', () => {
		const legacy = fields('1701Q');
		expect(legacy.find(field => field.id === 'frm1701q:j_id217')).toMatchObject({
			item: '25', label: '25 Are you availing of tax relief under special law or an international tax treaty?'
		});
		const relief = legacy.find(field => field.id === 'frm1701q:txtTaxRelief25')!;
		expect(relief.label).toBe('25 Tax relief type');
		expect(incomeChoiceLabel(relief, '0', 0)).toBe('Select tax relief type');
	});

	it('avoids repeated item numbers and points to the applicable filing-year rates in January 2018', () => {
		const revised = fields('1701Qv2018');
		for (const person of ['A', 'B']) {
			expect(revised.find(field => field.id === `frm1701q:txt42${person}`)?.label).toMatch(/^42 Add: Taxable/);
			expect(revised.find(field => field.id === `frm1701q:txt46${person}`)?.label).toMatch(/graduated rates for the filing year.*Part III, Item 26/i);
		}
	});
});
