import { describe, expect, it, vi } from 'vitest';
import { getFormDefinition } from '$lib/forms';
import { calculateReturn, getReturnExportValues, validateReturnValues } from '$lib/forms/form-runtime';
import { legacyExemptIdentificationPatch } from '$lib/forms/corporate-income/exempt';

const id = (name: string) => `frm1702EX:${name}`;
const identificationNumber = id('txtPg1Pt2I23CommunityTax');
const issueDate = id('txtPg1Pt1I24DateofIssue');
const issuePlace = id('txtPg1Pt1I25PlaceofIssue');
const certificateAmount = id('txtPg1Pt1I26Amount');

describe('June 2013 Form 1702EX identification', () => {
	it('validates the number and issue date for the selected identification type', () => {
		vi.useFakeTimers();
		try {
			vi.setSystemTime(new Date('2026-11-25T18:00:00Z'));
			const base = { [issuePlace]: 'Example City', [certificateAmount]: '125' };
			const validate = (type: string, number: string, date: string) =>
				validateReturnValues('1702EX', { ...base, CTCorReg: type, [identificationNumber]: number, [issueDate]: date });
			expect(validate('CTC', '00123456', '11/26/2026')).not.toHaveProperty([issueDate]);
			expect(validate('CTC', '00123456', '11/26/2026')).not.toHaveProperty([identificationNumber]);
			expect(validate('CTC', 'A12345678', '11/26/2025')).toHaveProperty([identificationNumber]);
			expect(validate('CTC', '007', '11/26/2025')).toHaveProperty([issueDate]);
			expect(validate('CTC', '007', '11/27/2026')).toHaveProperty([issueDate]);
			expect(validate('Reg', 'CS-0123/1', '02/29/2000')).toHaveProperty([identificationNumber]);
			expect(validate('Reg', 'CS-0123A', '02/29/2000')).not.toHaveProperty([identificationNumber]);
			expect(validate('Reg', 'CS-0123A', '02/29/2000')).not.toHaveProperty([issueDate]);
			expect(validate('Reg', 'CS-0123A', '02/29/2001')).toHaveProperty([issueDate]);
			expect(validate('Reg', 'CS-0123A', '12/31/1975')).toHaveProperty([issueDate]);
			expect(validate('Reg', 'CS-0123A', '01/01/1976')).not.toHaveProperty([issueDate]);
		} finally {
			vi.useRealTimers();
		}
	});

	it('exports the shared number and clears stale CTC amounts from SEC drafts', () => {
		const draft = {
			CTCorReg: 'Reg', [identificationNumber]: 'CS-00123', [issueDate]: '02/29/2000',
			[issuePlace]: 'Example City', [certificateAmount]: '925'
		};
		expect(getReturnExportValues('1702EX', draft)).toMatchObject({ ...draft, [certificateAmount]: '0' });
		expect(draft[certificateAmount]).toBe('925');
	});

	it('recognizes the legacy SEC filing value when reopening, validating, and exporting', () => {
		const draft = { CTCorReg: 'SEC', [identificationNumber]: 'CS-00123',
			[issueDate]: '02/29/2000', [issuePlace]: 'Example City', [certificateAmount]: '925' };
		expect(calculateReturn('1702EX', draft)).toMatchObject({ ...draft, CTCorReg: 'Reg', [certificateAmount]: '0' });
		expect(validateReturnValues('1702EX', draft)).not.toHaveProperty('CTCorReg');
		expect(getReturnExportValues('1702EX', draft)).toMatchObject({ ...draft, CTCorReg: 'Reg', [certificateAmount]: '0' });
	});

	it('retains an incomplete older draft until the identification type is known', () => {
		const draft = { [identificationNumber]: '00054321', [issueDate]: '02/29/2024', [certificateAmount]: '125' };
		expect(calculateReturn('1702EX', draft)).toMatchObject(draft);
		expect(legacyExemptIdentificationPatch(draft, 'CTCorReg', 'CTC')).toEqual({ CTCorReg: 'CTC' });
		expect(legacyExemptIdentificationPatch({ ...draft, CTCorReg: 'CTC' }, 'CTCorReg', 'CTC')).toEqual({ CTCorReg: 'CTC' });
	});
});

describe('exempt corporate returns', () => {
	it('counts the seven base pages and the sheets generated for each continuation section', () => {
		const pagesFiled = id('txtPg1Pt2NumberofPagesFiled');
		expect(calculateReturn('1702EX', {})[pagesFiled]).toBe('7');
		const draft = {
			[pagesFiled]: '99',
			Pg4S3I3PopLength: '23',
			Pg5S4I39PopLength: '1'
		};
		expect(getReturnExportValues('1702EX', draft)[pagesFiled]).toBe('10');
		expect(calculateReturn('1702EX', { ...draft, Pg5S4I39PopLength: '0' })[pagesFiled]).toBe('9');
	});

	it('rolls legacy sales and cost schedules into the tax calculation', () => {
		expect(getFormDefinition('1702EX')).toBeDefined();
		const values = calculateReturn('1702EX', {
			[id('txtPg3S1I1GoodsProp')]: '15000',
			[id('txtPg3S1I5LessSales')]: '1000',
			[id('txtPg3S2I2AddPurchases')]: '4000',
			[id('txtPg1Pt2I21AddPenalty')]: '250'
		});
		expect(values[id('txtPg2Pt4I39NetTaxable')]).toBe('10000');
		expect(values[id('txtPg2Pt5I42RegularIncome')]).toBe('3000');
		expect(values[id('txtPg1Pt2I22TotalAmount')]).toBe('250');
	});

	it('computes revised optional deductions and keeps compromise separate from the overpayment', () => {
		expect(getFormDefinition('1702EXv2018C')).toBeDefined();
		const values = calculateReturn('1702EXv2018C', {
			[id('rdoPg1Pt1I13MethodOfDeduc')]: 'O',
			[id('txtPg2Pt4I28SalesReceiptsRevFees')]: '20000',
			[id('txtPg2Pt4I31CostOfSalesServ')]: '5000',
			[id('txtPg2Pt4I42PriorYearExcessCr')]: '1000',
			[id('txtPg1Pt2I21PenaltyCompromise')]: '300'
		});
		expect(values[id('txtPg2Pt4I38OptionalStandardDeduc')]).toBe('6000');
		expect(values[id('txtPg2Pt4I39NetTaxable')]).toBe('9000');
		expect(values[id('txtPg1Pt2I20TotalOverpmt')]).toBe('-1000');
		expect(values[id('txtPg1Pt2I22TotalAmtPayable')]).toBe('300');
	});
});

it('keeps historical payment details exportable without blocking return validation', () => {
	const legacy = {
		[id('txtPg1I2YearEnd')]: '2025',
		[id('rdoPg1I1')]: 'C',
		[id('txtPg1Pt1I8DateofIncorporation')]: '02/14/2026',
		[id('txtPg1Pt2I21AddPenalty')]: '250',
		[id('txtPg1Pt3I27CashC3')]: '200',
		[id('txtPg1Pt3I27CashC2')]: '000127A'
	};
	const errors = validateReturnValues('1702EX', legacy);
	expect(errors).toHaveProperty([id('txtPg1Pt1I8DateofIncorporation')]);
	expect(errors).not.toHaveProperty([id('txtPg1Pt3I27CashC3')]);
	expect(getReturnExportValues('1702EX', legacy)).toMatchObject({
		[id('txtPg1Pt2I22TotalAmount')]: '250',
		[id('txtPg1Pt3I27CashC3')]: '200',
		[id('txtPg1Pt3I27CashC2')]: '000127A'
	});
	expect(validateReturnValues('1702EXv2018C', {
		[id('txtPg1I2YearEnd')]: '2025',
		[id('txtPg2Pt4I28SalesReceiptsRevFees')]: '1000'
	})).toHaveProperty([id('txtPg2Pt5I52RegularIncomeOtherwiseDue')]);
});
