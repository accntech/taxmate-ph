import { describe, expect, it } from 'vitest';
import { calculateAnnual, validateAnnual } from '../../../lib/forms/individual-income/annual';
import { exportRevisedActivityFields, importRevisedActivityFields, revisedActivitySlots } from '../../../lib/forms/individual-income/annual-2018-activities';

const prefix = 'frm1701:';
const values = (fields: Record<string, string>) =>
	Object.fromEntries(Object.entries(fields).map(([field, value]) => [prefix + field, value]));
const twoActivities = values({
	rdoPg1m: '2',
	rdoPg1I20IncomeSpecial: 'Yes',
	Pg3mTaxRegimeTYPE: 'Special Rate',
	Pg3mTaxRegimeACT2: 'Special Rate',
	txtPg3mSchedB_1ATYPE: '100000',
	txtPg3mSchedB_1AACT2: '25000',
	txtPg3mSchedB_14ATYPE: '5%',
	txtPg3mSchedB_14AACT2: '4%',
	txtPg3mSchedC_1ATYPE: '2000',
	txtPg3mSchedC_1AACT2: '500',
	txtPg4mSchedD1_1ATYPE: '100',
	txtPg4mSchedD1_1AACT2: '50',
	txtPg4mSchedD1_1ACT2: 'Sample special deduction',
	txtPg4mSchedD1_1ALBACT2: 'Sample basis'
});

describe('January Form 1701 activity consolidation', () => {
	it('calculates each activity and rolls up its own filer and regime amounts', () => {
		const result = calculateAnnual('1701v2018', twoActivities);
		expect(result).toMatchObject(values({
			txtPg3mSchedB_15ATYPE: '5000.00',
			txtPg3mSchedB_15AACT2: '1000.00',
			txtPg1mI1BSchdB: '125000.00',
			txtPg1mI17BSchdB: '6000.00',
			txtPg2mI1BSchdC: '2500.00',
			txtPg2mI18BSchdC: '2500.00',
			txtPg1mI6BSchdB: '2500.00',
			txtPg2mI1ASchdD: '150.00',
			txtPg2mI5ASchdD: '150.00',
			txtPg1mI7BSchdB: '150.00',
			txtPg2mI1DescSchdD: 'OTHERS',
			txtPg2mI1LBSchdD: 'OTHERS'
		}));
	});

	it('keeps a single activity on the directly entered Part X amounts', () => {
		const result = calculateAnnual('1701v2018', {
			...twoActivities,
			...values({ rdoPg1m: '1', txtPg1mI1BSchdB: '777', txtPg2mI1BSchdC: '300' })
		});
		expect(result[prefix + 'txtPg1mI1BSchdB']).toBe('777');
		expect(result[prefix + 'txtPg2mI18BSchdC']).toBe('300.00');
	});

	it('keeps joint filer and regime sums separate and drops removed or inapplicable amounts', () => {
		const joint = {
			...twoActivities,
			...values({
				rdoPg1I18FilingStatus: 'Joint', rdoPg2I10IncomeExempt: 'Yes',
				Pg3mTaxRegimeACT3: 'Exempt', Pg3mTaxRegimeACT4: 'Removed',
				txtPg3mSchedB_1AACT3: '900', txtPg3mSchedB_1BACT3: '300',
				txtPg3mSchedB_1AACT4: '700', txtPg3mSchedB_1BACT2: '600',
				txtPg4mSchedD2_8LBBTYPE: 'Inapplicable basis', txtPg4mSchedD2_8LBBACT3: 'Included basis'
			})
		};
		const result = calculateAnnual('1701v2018', joint);
		expect(result).toMatchObject(values({
			txtPg1mI1ASchdB: '0.00', txtPg1mI1BSchdB: '125000.00',
			txtPg1mI1ESchdB: '300.00', txtPg1mI1FSchdB: '0.00', txtPg2mI3LBSchdD: 'OTHERS'
		}));
		expect(revisedActivitySlots(joint)).toEqual(['TYPE', 'ACT2', 'ACT3']);
	});

	it('requires at least two configured activities when the filer selects multiple', () => {
		const incomplete = { ...twoActivities, ...values({ Pg3mTaxRegimeACT2: '' }) };
		expect(validateAnnual('1701v2018', incomplete)[prefix + 'rdoPg1m']).toMatch(/at least two/i);
		expect(validateAnnual('1701v2018', twoActivities)[prefix + 'rdoPg1m']).toBeUndefined();
	});
});

describe('January Form 1701 native attachment fields', () => {
	it('exports the BIR counter and indexed radios and roundtrips all eligible activity inputs', () => {
		const local = {
			...twoActivities,
			...values({
				rdoPg1I19IncomeExempt: 'Yes', Pg3mTaxRegimeACT3: 'Exempt', Pg3mTaxRegimeACT4: 'Removed',
				txtPg3mSchedB_1AACT3: '300', txtPg3mSchedB_1AACT4: '999', txtPg3mTIN1: '001'
			})
		};
		const native = exportRevisedActivityFields(local, false);
		expect(native).toMatchObject(values({
			txtAttachmentTypes: 'EX1,SP2', rdoPg1mOption1: 'false', rdoPg1mOption2: 'true',
			rdoPg3mExemptEX1: 'true', rdoPg3mSpecialRateEX1: 'false',
			rdoPg3mExemptSP2: 'false', rdoPg3mSpecialRateSP2: 'true',
			txtPg3mSchedB_1AEX1: '300', txtPg3mSchedB_1ASP1: '100000', txtPg3mSchedB_1ASP2: '25000', txtPg3mTIN1: '001'
		}));
		expect(native).not.toHaveProperty(prefix + 'txtPg3mSchedB_1ATYPE');
		expect(native).not.toHaveProperty(prefix + 'txtPg3mSchedB_1AACT4');
		const imported = importRevisedActivityFields(native);
		expect(imported).toMatchObject(values({
			rdoPg1m: '2', Pg3mTaxRegimeTYPE: 'Exempt', Pg3mTaxRegimeACT2: 'Special Rate', Pg3mTaxRegimeACT3: 'Special Rate',
			txtPg3mSchedB_1ATYPE: '300', txtPg3mSchedB_1AACT2: '100000', txtPg3mSchedB_1AACT3: '25000', txtPg3mTIN1: '001'
		}));
		expect(exportRevisedActivityFields(imported, false)).toEqual(native);
	});
});
