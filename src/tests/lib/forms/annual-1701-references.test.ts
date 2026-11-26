import { describe, expect, it } from 'vitest';
import { getIndividualIncomeForm, hasActivityAttachment } from '../../../lib/forms/individual-income';
import { incomeEditorFields } from '../../../lib/forms/individual-income/editor-layout';
import { annual1701ReferenceOwner, annual1701References } from '../../../lib/forms/individual-income/annual-1701-references';

const p = 'frm1701:';

describe('Form 1701 activity attachment availability', () => {
	it.each([
		['1701', 'rdoPg1Pt1I16FilingStatus', 'rdoPg4Pt7I107YesNo'],
		['1701', 'rdoPg1Pt1I16FilingStatus', 'rdoPg4Pt7I108YesNo'],
		['1701v2018', 'rdoPg1I18FilingStatus', 'rdoPg2I10IncomeExempt'],
		['1701v2018', 'rdoPg1I18FilingStatus', 'rdoPg2I11IncomeSpecial']
	])('makes spouse-only activity links available for joint %s returns', (code, filing, election) => {
		const form = getIndividualIncomeForm(code)!;
		const values = { [p + election]: 'Yes' };

		expect(hasActivityAttachment(form, { ...values, [p + filing]: 'Joint' })).toBe(true);
		expect(hasActivityAttachment(form, values)).toBe(false);
	});
});

describe('Form 1701 source cross-references', () => {
	it('names the filer for June consolidated amounts and keeps joint return amounts distinct', () => {
		expect(annual1701ReferenceOwner({ id: p + 'txtPg12Pt9I18TotalIncomeC2' }, true)).toBe('Taxpayer');
		expect(annual1701ReferenceOwner({ id: p + 'txtPg12Pt9I18TotalIncomeC6' }, true)).toBe('Spouse');
		expect(annual1701ReferenceOwner({ id: p + 'txtPg1Pt2I26IncomeTax' }, true)).toBe('Both filers');
		expect(annual1701ReferenceOwner({ id: p + 'txtPg3Pt5I84TotalPenalties' }, false)).toBe('Taxpayer');
	});

	it('uses the destination field owner for January schedules', () => {
		expect(annual1701ReferenceOwner({ id: p + 'txtPg2mI18BSchdC', person: 'taxpayer' }, true)).toBe('Taxpayer');
		expect(annual1701ReferenceOwner({ id: p + 'txtPg2mI18DSchdC', person: 'spouse' }, true)).toBe('Spouse');
	});

	it('opens the June filing summary source amounts', () => {
		expect(annual1701References('1701', p + 'txtPg1Pt2I26IncomeTax')).toContainEqual({
			label: 'From Item 72A', target: p + 'txtPg3Pt5I72TotalIncomeTaxC1'
		});
		expect(annual1701References('1701', p + 'txtPg1Pt2I27LessTotalTax')).toContainEqual({
			label: 'From Item 76B', target: p + 'txtPg3Pt5I76TotalTaxC2'
		});
	});

	it('keeps June employer and deduction references in the correct person column', () => {
		expect(annual1701References('1701', p + 'txtPg2Pt4I41GrossCompensationC2')).toEqual([
			{ label: 'From Schedule 1, Item 5B1', target: p + 'txtPg5Sc1I5BTotalComIncome' }
		]);
		expect(annual1701References('1701', p + 'txtPg2Pt4I59AllowanceC1')).toEqual([
			{ label: 'From Schedule 8A.1, Item 8', target: p + 'txtPg8Sc8A1I8TotalNOLCO' }
		]);
	});

	it('opens January summary and rate-specific source amounts', () => {
		expect(annual1701References('1701v2018', p + 'txtPg1I22BTaxDue')).toEqual([
			{ label: 'From Part VI, Item 5B', target: p + 'txtPg4ISc6_5B' }
		]);
		expect(annual1701References('1701v2018', p + 'txtPg1I23A')).toEqual([
			{ label: 'From Part VII, Item 10A', target: p + 'txtPg4IPart7_10A' }
		]);
		expect(annual1701References('1701v2018', p + 'txtPg4ISc6_1A')).toEqual([
			{ label: 'From Schedule 3.A, Item 25A', target: p + 'txtPg2IShed3_25A' },
			{ label: 'From Schedule 3.B, Item 32A', target: p + 'txtPg3IShed3_32A' }
		]);
	});

	it('returns references only for supported revisions and source citations', () => {
		expect(annual1701References('1701A', p + 'txtPg1I23A')).toEqual([]);
		expect(annual1701References('1701', p + 'txtPg1Pt1I8TaxFiler')).toEqual([]);
	});

	it('marks multi-activity links separately from direct consolidation deductions', () => {
		expect(annual1701References('1701v2018', p + 'txtPg1mI6BSchdB')).toContainEqual({
			label: 'From Schedule C, Item 18B', target: p + 'txtPg2mI18BSchdC'
		});
		expect(annual1701References('1701v2018', p + 'txtPg1mI6BSchdB')).toContainEqual({
			label: 'From Part XI, Schedule B, Item 6A', target: p + 'txtPg3mSchedB_6ATYPE', multipleActivities: true
		});
	});

	it('resolves every registered link to a different field in its revision', () => {
		for (const code of ['1701', '1701v2018']) {
			const fields = incomeEditorFields(getIndividualIncomeForm(code)!);
			const ids = new Set(fields.map(field => field.id));
			let count = 0;
			for (const field of fields) {
				for (const reference of annual1701References(code, field.id)) {
					expect(ids.has(reference.target), code + ' ' + reference.target).toBe(true);
					expect(reference.target).not.toBe(field.id);
					expect(reference.label).toMatch(/^(From|To) /);
					count += 1;
				}
			}
			expect(count).toBeGreaterThan(35);
		}
	});
});
