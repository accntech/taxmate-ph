import { describe, expect, it } from 'vitest';
import { getFormDefinition, listForms } from './forms';

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
			'frm1601EQ:txtTIN1',
			'frm1601EQ:txtTIN2',
			'frm1601EQ:txtTIN3',
			'frm1601EQ:txtBranchCode',
			'frm1601EQ:txtRDOCode',
			'frm1601EQ:txtTaxpayerName',
			'frm1601EQ:txtYear',
			'frm1601EQ:optQuarter',
			'frm1601EQ:txtTaxDue'
		]);
	});
});
