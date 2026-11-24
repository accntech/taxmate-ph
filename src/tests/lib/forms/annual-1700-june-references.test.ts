import { describe, expect, it } from 'vitest';
import { getIndividualIncomeForm } from '../../../lib/forms/individual-income';
import { incomeEditorFields } from '../../../lib/forms/individual-income/editor-layout';
import { june1700References } from '../../../lib/forms/individual-income/annual-1700-june-references';

const p = 'frm1700:';
const pairs = [
	['txtPg1Pt2I23FilerTaxDue', '23', 'txtPg2Pt4I14C1', '14A', 'Taxpayer'],
	['txtPg1Pt2I24SpouseTaxDue', '24', 'txtPg2Pt4I14C2', '14B', 'Spouse'],
	['txtPg1Pt2I26TaxFilersTaxCredit', '26', 'txtPg2Pt4I19C1', '19A', 'Taxpayer'],
	['txtPg1Pt2I27SpouseTaxCredit', '27', 'txtPg2Pt4I19C2', '19B', 'Spouse'],
	['txtPg1Pt2I29', '29', 'txtPg2Pt4I22', '22', 'Both filers'],
	['txtPg1Pt2I30', '30', 'txtPg2Pt4I27', '27', 'Both filers'],
	['txtPg1Pt2I31', '31', 'txtPg2Pt4I28', '28', 'Both filers']
] as const;

describe('June 2013 Form 1700 cross-section references', () => {
	it.each(pairs)('connects summary %s to its computation and back', (summary, summaryItem, computation, computationItem, owner) => {
		expect(june1700References(p + summary)).toEqual([{
			label: 'From Part IV, Item ' + computationItem,
			target: p + computation,
			owner
		}]);
		expect(june1700References(p + computation)).toEqual([{
			label: 'To Part II, Item ' + summaryItem,
			target: p + summary,
			owner
		}]);
	});

	it('links only to rendered fields in the matching revision', () => {
		const form = getIndividualIncomeForm('1700');
		expect(form).toBeDefined();
		const fields = incomeEditorFields(form!);
		const ids = new Set(fields.map((field) => field.id));
		for (const [summary, , computation, , owner] of pairs) {
			for (const id of [summary, computation]) {
				expect(ids.has(p + id), id).toBe(true);
				for (const reference of june1700References(p + id)) {
					expect(ids.has(reference.target), reference.target).toBe(true);
					expect(reference.target).not.toBe(p + id);
					const target = fields.find((field) => field.id === reference.target)!;
					if (owner !== 'Both filers' && target.person) {
						expect(target.person, reference.target).toBe(owner.toLowerCase());
					}
				}
			}
		}
	});

	it('keeps adjacent arithmetic and unrelated fields free of navigation links', () => {
		for (const id of ['txtPg1Pt2I25TotalIncomeTaxDue', 'txtPg2Pt4I10C1', 'txtPg2Pt4I20C2', 'unknown']) {
			expect(june1700References(p + id)).toEqual([]);
		}
	});
});
