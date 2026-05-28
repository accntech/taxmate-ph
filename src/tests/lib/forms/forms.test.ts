import { describe, expect, it } from 'vitest';
import { getFormDefinition, listForms } from '$lib/forms';

describe('form metadata', () => {
	it('lists the first migrated form as 1601EQ', () => {
		expect(listForms()).toEqual([
			{
				code: '1601EQ',
				title: 'Quarterly Remittance Return of Creditable Income Taxes Withheld',
				category: 'Withholding Tax',
				status: 'ready'
			}
		]);
	});

	it('defines the required legacy field ids for the 1601EQ vertical slice', () => {
		expect(getFormDefinition('1601EQ')?.fields.map((field) => field.id)).toEqual([
			'frm1601EQ:txtYear',
			'frm1601EQ:optQuarter',
			'frm1601EQ:optAmendedReturn',
			'frm1601EQ:optTaxesWithheld',
			'frm1601EQ:txtSheetsAttached',
			'frm1601EQ:txtTIN1',
			'frm1601EQ:txtTIN2',
			'frm1601EQ:txtTIN3',
			'frm1601EQ:txtBranchCode',
			'frm1601EQ:txtRDOCode',
			'frm1601EQ:txtTaxpayerName',
			'frm1601EQ:txtAddress',
			'frm1601EQ:txtAddress2',
			'frm1601EQ:txtZipCode',
			'frm1601EQ:txtTelNum',
			'frm1601EQ:optCategory',
			'txtEmail',
			'frm1601EQ:txtATC13',
			'frm1601EQ:txtTaxBase13',
			'frm1601EQ:txtTaxRate13',
			'frm1601EQ:txtTaxWithheld13',
			'frm1601EQ:txtATC14',
			'frm1601EQ:txtTaxBase14',
			'frm1601EQ:txtTaxRate14',
			'frm1601EQ:txtTaxWithheld14',
			'frm1601EQ:txtATC15',
			'frm1601EQ:txtTaxBase15',
			'frm1601EQ:txtTaxRate15',
			'frm1601EQ:txtTaxWithheld15',
			'frm1601EQ:txtATC16',
			'frm1601EQ:txtTaxBase16',
			'frm1601EQ:txtTaxRate16',
			'frm1601EQ:txtTaxWithheld16',
			'frm1601EQ:txtATC17',
			'frm1601EQ:txtTaxBase17',
			'frm1601EQ:txtTaxRate17',
			'frm1601EQ:txtTaxWithheld17',
			'frm1601EQ:txtATC18',
			'frm1601EQ:txtTaxBase18',
			'frm1601EQ:txtTaxRate18',
			'frm1601EQ:txtTaxWithheld18',
			'frm1601EQ:txtTotalTaxesWithheld',
			'frm1601EQ:txtRemittanceFirstMonth',
			'frm1601EQ:txtRemittanceSecondMonth',
			'frm1601EQ:txtTaxRemittedPreviousReturn',
			'frm1601EQ:txtOverremittancePreviousQuarter',
			'frm1601EQ:txtTotalRemittances',
			'frm1601EQ:txtTaxStillDue',
			'frm1601EQ:txtSurcharge',
			'frm1601EQ:txtInterest',
			'frm1601EQ:txtCompromise',
			'frm1601EQ:txtTotalPenalties',
			'frm1601EQ:txtTotalAmountDue'
		]);
	});
});
