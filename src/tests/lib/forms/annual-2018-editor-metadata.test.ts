import { describe, expect, it } from 'vitest';
import { getIndividualIncomeForm } from '../../../lib/forms/individual-income';
import { incomeEditorFields } from '../../../lib/forms/individual-income/editor-layout';

const fields = () => incomeEditorFields(getIndividualIncomeForm('1701v2018')!);
const field = (name: string) => fields().find(item => item.id === 'frm1701:' + name)!;

describe('January 2018 Form 1701 editor column meanings', () => {
	it('keeps taxpayer and spouse ownership in the NOLCO computation', () => {
		expect(field('txtPg3IShed6_1A').person).toBe('taxpayer');
		expect(field('txtPg3IShed6_1B').person).toBe('spouse');
		expect(field('txtPg3IShed6_1A').section).toBe('Schedule 6 · Computation of net operating loss');
	});

	it('names the person and tax regime in consolidation columns', () => {
		expect(field('txtPg1mI1ASchdA')).toMatchObject({ column: 'Taxpayer · Exempt', label: '1 Investment promotion agency or implementing government entity' });
		expect(field('txtPg1mI1FSchdA')).toMatchObject({ column: 'Spouse · Regular' });
		expect(field('txtPg1mI1HSchdB')).toMatchObject({ column: 'Spouse · Total', label: '1 Sales, revenues, receipts or fees' });
		expect(field('txtPg2mI1CSchdC')).toMatchObject({ column: 'Spouse · Exempt' });
	});

	it('separates service subitems and uses meaningful field labels', () => {
		expect(field('txtPg2mI17aASchdC')).toMatchObject({ item: '17A', label: '17A Janitorial and messenger services' });
		expect(field('txtPg2mI17bASchdC').rowKey).not.toBe(field('txtPg2mI17aASchdC').rowKey);
		expect(field('txtPg4IPart9_2Particulars').label).toBe('2 Non-deductible expense or other taxable income description');
		expect(field('txtPg4mSchedD1_1ALBTYPE').label).toBe('1 Legal basis');
	});

	it('keeps employer name ownership distinct from name continuation', () => {
		expect(field('txtPg2IShed1a_1TPName')).toMatchObject({ person: 'taxpayer', label: '1 Employer name · Taxpayer' });
		expect(field('txtPg2IShed1a_1SName')).toMatchObject({ person: 'spouse', label: '1 Employer name · Spouse' });
	});

	it('identifies relief dates without changing the source field IDs', () => {
		expect(field('txtPg1mI5ASchdA')).toMatchObject({ kind: 'date', label: '5 Tax relief or exemption start date' });
		expect(field('txtPg3mSchedA_6BTYPE')).toMatchObject({ kind: 'date', label: '6 Tax relief or exemption end date', person: 'spouse' });
	});

	it('uses percentages for activity tax rates', () => {
		expect(field('txtPg3mSchedA_4ATYPE')).toMatchObject({ kind: 'percent', label: '4 Tax rate (%)', column: 'Taxpayer' });
	});

	it('keeps concise amount names with the original source explanation', () => {
		expect(field('txtPg2IShed3_25A')).toMatchObject({
			shortLabel: 'Total tax due on compensation and business income'
		});
		expect(field('txtPg2IShed3_25A').label).toContain('Applicable Tax Rate');
		expect(field('txtPg4IPart8_2A').shortLabel).toBe('Tax relief on special itemized deductions');
		expect(field('txtPg3IShed4_18A').shortLabel).toBe('Total ordinary itemized deductions');
	});

	it('names elected OSD amount rows consistently', () => {
		expect(field('txtPg2IShed3_17A').shortLabel).toBe('40% Optional Standard Deduction (OSD)');
		expect(field('txtPg1mI10CSchdB').label).toBe('10 40% Optional Standard Deduction (OSD)');
	});

	it('keeps reconciliation together with explicit addition and deduction markers', () => {
		for (const item of ['1', '2', '5', '6', '10', '11']) {
			expect(field(`txtPg4IPart9_${item}A`).section).toBe('Part IX · Reconciliation of income');
		}
		expect(field('txtPg4IPart9_2A')).toHaveProperty('subheading', 'Add: Non-deductible expenses and other taxable income');
		expect(field('txtPg4IPart9_6A')).toHaveProperty('subheading', 'Less: Non-taxable income and income subject to final tax');
		expect(field('txtPg4IPart9_3A')).not.toHaveProperty('subheading');
	});

	it('uses deduction row headings independently of column labels', () => {
		expect(field('txtPg4mSchedD1_1TYPE').rowHeading).toBe('Special itemized deduction');
		expect(field('txtPg4mSchedD2_6BTYPE').rowHeading).toBe('Special itemized deduction');
		expect(field('txtPg4mSchedD1_5ATYPE').rowHeading).toBeUndefined();
	});
});
