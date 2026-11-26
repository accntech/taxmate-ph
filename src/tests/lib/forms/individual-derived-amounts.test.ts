import { describe, expect, it } from 'vitest';
import { getReturnExportValues } from '../../../lib/forms/form-runtime';

function exportAmounts(code: string, fields: Record<string, string>) {
	return getReturnExportValues(code, Object.fromEntries(
		Object.entries(fields).map(([name, value]) => ['frm1701:' + name, value])
	));
}

describe('marked and carried individual income amounts', () => {
	it('carries June 2013 ordinary deductions into Schedule 6 and the regular consolidated return', () => {
		const result = exportAmounts('1701', {
			txtPg5Sc2I1TaxPayerC1: '1000', txtPg5Sc3I1TaxPayerC1: '200',
			txtPg6Sc6I1TaxSumPayerC1: '75', txtPg7Sc6I5TaxSumPayerC1: '25'
		});
		expect(result).toMatchObject({
			'frm1701:txtPg7Sc6I40TaxTotalPayerC1': '100.00',
			'frm1701:txtPg12Pt9I3TotalSalesC1': '1200.00',
			'frm1701:txtPg12Pt9I11TotalAllowableC1': '100.00'
		});
	});

	it('carries June 2013 Schedule 5 totals into the matching filer columns', () => {
		const result = exportAmounts('1701', {
			rdoPg1Pt1I14Status: 'Married', rdoPg1Pt1I15Income: 'WithIncome', rdoPg1Pt1I16FilingStatus: 'Joint',
			txtPg6Sc5I1TaxPayerC1: '15000', txtPg6Sc5I5TaxPayerC1: '500',
			txtPg6Sc5I3SpouseC2: '2500'
		});
		expect(result).toMatchObject({
			'frm1701:txtPg6Sc5I6TaxPayerC1': '15500.00',
			'frm1701:txtPg6Sc5I6SpouseC2': '2500.00',
			'frm1701:txtPg2Pt4I55AddNonOperC1': '15500.00',
			'frm1701:txtPg2Pt4I55AddNonOperC2': '2500.00',
			'frm1701:txtPg12Pt9I6AddNonC1': '15500.00',
			'frm1701:txtPg12Pt9I6AddNonC5': '2500.00'
		});
	});

	it('calculates June 2013 bookkeeping reconciliation and supplementary-income totals', () => {
		const result = exportAmounts('1701', {
			txtPg10Sc11AI1NetIncome: '123', txtPg10Sc11AI2TaxableOtherIncomeC2: '100',
			txtPg10Sc11AI5NonTaxableIncomeC2: '23',
			txtPg11Sc12AI11FinalTaxC1: '42', txtPg11Sc12AI11FinalTaxC2: '10',
			txtPg11Sc12BI7ActualAmountC1: '200', txtPg11Sc12BI9ActualAmountC2: '30'
		});
		expect(result).toMatchObject({
			'frm1701:txtPg10Sc11AI4Total': '223.00',
			'frm1701:txtPg10Sc11AI9Total': '23.00',
			'frm1701:txtPg10Sc11AI10NetTaxableIncomeLoss': '200.00',
			'frm1701:txtPg11Sc12AI21TotalFinalTaxC1': '52.00',
			'frm1701:txtPg11Sc12BI10TotalIncomeC1': '230.00'
		});
	});

	it('derives taxpayer counts and exemptions from a claimed June 2013 dependent', () => {
		const result = exportAmounts('1701', {
			txtPg1I1Year: '2017', txtPg1Pt1I11Month: '01/01/1980', rdoPg1Pt1I24Claiming: 'Yes', txtPg4Pt7ALastName1: 'SANTOS',
			txtPg4Pt7AFirstMiddleName1: 'JUAN', txtPg4Pt7AMonth1: '01/01/2010',
			txtPg1Pt1I24Dependent: '4', txtPg2Pt4I46AdditionalExempC1: '100000'
		});
		expect(result).toMatchObject({
			'frm1701:txtPg1Pt1I24Dependent': '1',
			'frm1701:txtPg2Pt4I46AdditionalExempC1': '25000.00'
		});
	});

	it('totals and transfers June 2013 attachment amounts into their special-rate column', () => {
		const result = exportAmounts('1701', {
			rdoPg1Pt1I23IncomeSpecial: 'Yes', rdoPg1mTaxRegimeTYPE: 'SpecialRate',
			txtPg2mScDI1TotalSalesC1TYPE: '1000', txtPg2mScDI2GrossSalesC1TYPE: '200',
			txtPg2mScDI4LessSalesReturnsC1TYPE: '100'
		});
		expect(result).toMatchObject({
			'frm1701:txtPg2mScDI3TotalSalesC1TYPE': '1200.00',
			'frm1701:txtPg2mScDI5NetSalesC1TYPE': '1100.00',
			'frm1701:txtPg1mScBI1NetSalesC1TYPE': '1100.00',
			'frm1701:txtPg12Pt9I1SalesC2': '1100.00'
		});
	});

	it('derives January 2018 attachment deductions and special-rate tax without overwriting the rate', () => {
		const result = exportAmounts('1701v2018', {
			rdoPg1I20IncomeSpecial: 'Yes', Pg3mTaxRegimeTYPE: 'Special Rate',
			txtPg3mSchedB_1ATYPE: '1000', txtPg3mSchedB_2ATYPE: '100',
			txtPg3mSchedB_4ATYPE: '50', txtPg3mSchedB_14ATYPE: '5%',
			txtPg3mSchedC_1ATYPE: '75', txtPg4mSchedD1_1ATYPE: '25'
		});
		expect(result).toMatchObject({
			'frm1701:txtPg4mSchedC_18ATYPE': '75.00',
			'frm1701:txtPg4mSchedD1_5ATYPE': '25.00',
			'frm1701:txtPg3mSchedB_8ATYPE': '100.00',
			'frm1701:txtPg3mSchedB_13ATYPE': '750.00',
			'frm1701:txtPg3mSchedB_14ATYPE': '5%',
			'frm1701:txtPg3mSchedB_15ATYPE': '43.00'
		});
	});

	it('totals January 2018 consolidated attachment amounts without crossing regime columns', () => {
		const result = exportAmounts('1701v2018', {
			rdoPg1I19IncomeExempt: 'Yes', rdoPg1I20IncomeSpecial: 'Yes',
			txtPg2mI1ASchdC: '75', txtPg2mI17dASchdC: '25', txtPg2mI1BSchdC: '30',
			txtPg2mI1ASchdD: '17', txtPg2mI4ASchdD: '3'
		});
		expect(result).toMatchObject({
			'frm1701:txtPg2mI18ASchdC': '100.00',
			'frm1701:txtPg2mI18BSchdC': '30.00',
			'frm1701:txtPg2mI5ASchdD': '20.00'
		});
	});
});
