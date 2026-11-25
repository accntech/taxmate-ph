import { describe, expect, it } from 'vitest';
import { getFormDefinition } from '$lib/forms';
import { calculateReturn, getManagedTaxpayerValues, getReturnAmount, getReturnExportValues, getReturnPeriod, validateReturnValues } from '$lib/forms/form-runtime';
import { createIndividualIncomeValues, getIndividualIncomeForm } from '$lib/forms/individual-income';
import type { TaxpayerProfile } from '$lib/profiles/profile';

const codes = ['1700', '1700v2018', '1701', '1701v2018', '1701A', '1701MS', '1701Q', '1701Qv2018'];
const individual: TaxpayerProfile = {
	id: 'sample', tin1: '001', tin2: '234', tin3: '567', branchCode: '00008', rdoCode: '047',
	taxpayerName: 'SANTOS, ALEX, REYES', address: '28 Narra Street', address2: '', zipCode: '1209',
	contactNumber: '0285550148', email: 'alex.santos@example.test', category: 'P',
	taxpayerClassification: 'I'
};

describe.each(codes)('%s taxpayer branch code', (code) => {
	const form = getIndividualIncomeForm(code)!;
	const branch = form.identity.branchCode!;

	it.each(['008', '0008', '00008'])('preserves and validates %s through draft autofill and export', (branchCode) => {
		const profile = { ...individual, branchCode };
		const values = createIndividualIncomeValues(form, profile);
		expect(values[branch]).toBe(branchCode);
		const olderDraft = { ...values, [branch]: '00008' };
		const reopened = { ...olderDraft, ...getManagedTaxpayerValues(code, profile, 'Draft', olderDraft) };
		expect(reopened[branch]).toBe(branchCode);
		expect(validateReturnValues(code, reopened)).not.toHaveProperty(branch);
		expect(getReturnExportValues(code, reopened)[branch]).toBe(branchCode);
		if (code === '1701Qv2018' || code === '1701MS') {
			const repeated = code === '1701Qv2018' ? 'frm1701q:txtPg2BranchCode' : 'frm1701MS:txtPg2BranchCode';
			expect(getReturnExportValues(code, reopened)[repeated]).toBe(branchCode);
		}
	});

	it.each(['', '08', '000008', '0A8'])('rejects an invalid taxpayer branch %j', (branchCode) => {
		expect(validateReturnValues(code, { ...createIndividualIncomeValues(form, individual), [branch]: branchCode }))
			.toHaveProperty(branch);
	});
});

it('copies a spouse branch code independently from the quarterly taxpayer branch', () => {
	const code = '1701Qv2018';
	const profile: TaxpayerProfile = {
		...individual,
		spouse: { taxpayerName: 'SANTOS, TAYLOR', tin1: '765', tin2: '432', tin3: '100', branchCode: '007' }
	};
	expect(getManagedTaxpayerValues(code, profile, 'Draft', { 'income:useSavedSpouse': 'Y' })).toMatchObject({
		'frm1701q:txtBranchCode': '00008',
		'frm1701q:txtSpouseBranchCode': '007'
	});
});


it('prefills the legacy 1701 trade name and four-digit PSIC class', () => {
	const profile = { ...individual, tradeName: 'Alex & Reyes Advisory', psicCode: '01121' };
	const tradeName = 'frm1701:txtPg1Pt1I9TradeName';
	const psic = 'frm1701:txtPg1Pt1I18PSIC';
	expect(getManagedTaxpayerValues('1701', profile)).toMatchObject({
		[tradeName]: 'Alex & Reyes Advisory', [psic]: '0112'
	});
	expect(getManagedTaxpayerValues('1701', profile, 'Draft', { [tradeName]: 'Earlier business name' }))
		.not.toHaveProperty(tradeName);
	expect(getManagedTaxpayerValues('1701', profile, 'Draft', { [tradeName]: '', [psic]: '' }))
		.toMatchObject({ [tradeName]: 'Alex & Reyes Advisory', [psic]: '0112' });
	expect(getManagedTaxpayerValues('1701', profile, 'Final', { [tradeName]: '', [psic]: '' })).toEqual({});
	expect(getManagedTaxpayerValues('1701A', profile)).not.toHaveProperty(tradeName);
});

describe('profile taxpayer type defaults across return revisions', () => {
	const cases = [
		['1700', 'compensation', { 'frm1700:SourceOfIncome_1': 'Y' }],
		['1700v2018', 'compensation', { 'frm1700:rdoPg1I6TaxpayerType': 'Employee' }],
		['1701', 'compensation', { 'frm1701:rdoPg1Pt1I4ATC': 'Compensation' }],
		['1701', 'single-proprietor', { 'frm1701:rdoPg1Pt1I4ATC': 'Business', 'frm1701:rdoPg1Pt1I7Type': 'Single' }],
		['1701', 'professional', { 'frm1701:rdoPg1Pt1I4ATC': 'Business', 'frm1701:rdoPg1Pt1I7Type': 'Professional' }],
		['1701', 'mixed-income', { 'frm1701:rdoPg1Pt1I4ATC': 'Mixed' }],
		['1701', 'estate', { 'frm1701:rdoPg1Pt1I7Type': 'Estate' }],
		['1701', 'trust', { 'frm1701:rdoPg1Pt1I7Type': 'Trust' }],
		['1701v2018', 'compensation', { 'frm1701:rdoPg1I6TaxpayerTypeC': 'Y', 'frm1701:rdoPg1I7ATC': 'II011' }],
		['1701v2018', 'single-proprietor', { 'frm1701:rdoPg1I6TaxpayerTypeS': 'Y' }],
		['1701v2018', 'professional', { 'frm1701:rdoPg1I6TaxpayerTypeP': 'Y' }],
		['1701v2018', 'estate', { 'frm1701:rdoPg1I6TaxpayerTypeE': 'Y' }],
		['1701v2018', 'trust', { 'frm1701:rdoPg1I6TaxpayerTypeT': 'Y' }],
		['1701A', 'single-proprietor', { 'frm1701A:optTaxType': 'S' }],
		['1701A', 'professional', { 'frm1701A:optTaxType': 'P' }],
		['1701MS', 'single-proprietor', { 'frm1701MS:sourceOfIncomeTaxpayer': '1' }],
		['1701MS', 'mixed-income', { 'frm1701MS:sourceOfIncomeTaxpayer': '2' }],
		['1701MS', 'professional', { 'frm1701MS:sourceOfIncomeTaxpayer': '3' }],
		['1701Q', 'compensation', { 'frm1701q:optATC20': 'II011' }],
		['1701Q', 'single-proprietor', { 'frm1701q:optATC20': 'II012' }],
		['1701Q', 'professional', { 'frm1701q:optATC20': 'II012' }],
		['1701Q', 'mixed-income', { 'frm1701q:optATC20': 'II013' }],
		['1701Qv2018', 'single-proprietor', { 'frm1701q:optTaxpayerType': 'Single' }],
		['1701Qv2018', 'professional', { 'frm1701q:optTaxpayerType': 'Professional' }],
		['1701Qv2018', 'estate', { 'frm1701q:optTaxpayerType': 'Estate' }],
		['1701Qv2018', 'trust', { 'frm1701q:optTaxpayerType': 'Trust' }]
	] as const;

	it.each(cases)('prefills %s for %s on new and sparse draft returns', (code, taxpayerType, expected) => {
		const profile = { ...individual, taxpayerType };
		const created = createIndividualIncomeValues(getIndividualIncomeForm(code)!, profile);
		const reopened = getManagedTaxpayerValues(code, profile, 'Draft', {});
		for (const [id, value] of Object.entries(expected)) {
			expect(created[id], id).toBe(value);
			expect(reopened[id], id).toBe(value);
		}
		expect(getManagedTaxpayerValues(code, profile, 'Final', {})).toEqual({});
	});

	it('preserves stored edits and leaves ambiguous types and rates unset', () => {
		const professional = { ...individual, taxpayerType: 'professional' as const };
		const mixed = { ...individual, taxpayerType: 'mixed-income' as const };
		expect(getManagedTaxpayerValues('1701v2018', professional, 'Draft', { 'frm1701:rdoPg1I6TaxpayerTypeS': 'Y' }))
			.not.toHaveProperty('frm1701:rdoPg1I6TaxpayerTypeP');
		expect(getManagedTaxpayerValues('1701v2018', professional, 'Draft', { 'frm1701:rdoPg1I6TaxpayerTypeP': '' }))
			.not.toHaveProperty('frm1701:rdoPg1I6TaxpayerTypeP');
		expect(getManagedTaxpayerValues('1701Qv2018', professional, 'Draft', { 'frm1701q:optTaxpayerType': 'Estate' }))
			.not.toHaveProperty('frm1701q:optTaxpayerType');
		expect(getManagedTaxpayerValues('1701', professional, 'Draft', { 'frm1701:rdoPg1Pt1I7Type': 'Trust' }))
			.not.toHaveProperty('frm1701:rdoPg1Pt1I4ATC');
		expect(getManagedTaxpayerValues('1701Qv2018', professional)).not.toHaveProperty('frm1701q:optATC');
		expect(getManagedTaxpayerValues('1701Qv2018', mixed)).not.toHaveProperty('frm1701q:optTaxpayerType');
		expect(getManagedTaxpayerValues('1701v2018', mixed)).not.toHaveProperty('frm1701:rdoPg1I6TaxpayerTypeC');
		expect(getManagedTaxpayerValues('1701A', mixed)).not.toHaveProperty('frm1701A:optTaxType');
		expect(getManagedTaxpayerValues('1701A', { ...professional, taxpayerClassification: 'N' }))
			.not.toHaveProperty('frm1701A:optTaxType');
	});
});

describe('individual income tax return integration', () => {
	it.each(codes)('registers %s with paper form fields and rejects an empty return', (code) => {
		const form = getFormDefinition(code);
		expect(form?.status).toBe('ready');
		expect(form?.fields.length).toBeGreaterThan(30);
		expect(Object.keys(validateReturnValues(code, {})).length).toBeGreaterThan(4);
	});

	it('defaults additional exemptions to No for a new June 2013 Form 1700', async () => {
		const { getIndividualIncomeForm } = await import('$lib/forms/individual-income');
		expect(getIndividualIncomeForm('1700')?.defaults).toMatchObject({
			'frm1700:rdoPg1Pt1I14ClaimingAdditionalExemptions': 'frm1700:rdoPg1Pt1I14NoInd',
			'frm1700:rdoPg1Pt1I21SpouseClaimAdditionalExemption': 'frm1700:rdoPg1Pt1I21SpouseClaimAdditionalExemptionNo'
		});
	});

	it('keeps the 1701A tax result and filing year in the shared return runtime', () => {
		const values = calculateReturn('1701A', {
			'frm1701A:txtYear': '2024',
			'frm1701A:optTaxType': 'S',
			'frm1701A:optATC': 'II012',
			'frm1701A:txt36A': '1000000'
		});
		expect(getReturnAmount('1701A', values)).toBe('62500.00');
		expect(getReturnPeriod('1701A', values)).toBe('2024');
	});
	it('rejects impossible calendar dates on the annual short form', () => {
		const errors = validateReturnValues('1701A', { 'frm1701A:txtYear': '2025', 'frm1701A:txtBirthDate': '02/30/1991' });
		expect(errors['frm1701A:txtBirthDate']).toMatch(/valid birth date/i);
	});

	it('reconciles Form 1701-MS graduated OSD, credits and penalties', () => {
		const values = calculateReturn('1701MS', {
			'frm1701MS:txtYearNo1': '2025',
			'frm1701MS:sourceOfIncomeTaxpayer': '1',
			'frm1701MS:txtTaxpayerNo12a': '2',
			'frm1701MS:txtSalesRevenueNo5a': '1000000',
			'frm1701MS:txtCreditableTaxNo3a': '50000',
			'frm1701MS:txtSurchangeNo28a': '500',
			methodOfDeductionMain: 'osd'
		});
		expect(values['frm1701MS:txtOptionalDeductionNo11a']).toBe('400000.00');
		expect(values['frm1701MS:txtIncomeTaxRegularNo22a']).toBe('62500.00');
		expect(getReturnAmount('1701MS', values)).toBe('13000.00');
	});

});

it('prefills a revised compensation return from reusable taxpayer and joint-spouse details', async () => {
	const { getManagedTaxpayerValues } = await import('$lib/forms/form-runtime');
	const profile = {
		id: 'sample', tin1: '001', tin2: '234', tin3: '567', branchCode: '00008', rdoCode: '047',
		taxpayerName: 'SANTOS, ALEX, REYES', address: '28 Narra Street', address2: '', zipCode: '1209',
		contactNumber: '0285550148', email: 'alex.santos@example.test', category: 'P',
		civilStatus: 'Married' as const, birthDate: '1984-02-29', citizenship: 'Filipino',
		spouse: { taxpayerName: 'SANTOS, TAYLOR, CRUZ', tin1: '765', tin2: '432', tin3: '100', branchCode: '00000', rdoCode: '047', citizenship: 'Filipino' }
	};
	const joint = { 'frm1700:rdoPg1I15CivilStatus': 'Married', 'frm1700:rdoPg1I16SpouseHasIncome': 'Yes', 'frm1700:rdoPg1I17FilingStatus': 'Joint' };
	expect(getManagedTaxpayerValues('1700v2018', profile)).toMatchObject({
		'frm1700:txtPg1I9BirthDate': '02/29/1984', 'frm1700:rdoPg1I15CivilStatus': 'Married'
	});
	expect(getManagedTaxpayerValues('1700v2018', profile, 'Draft', joint)).toMatchObject({
		'frm1700:txtPg1I18STIN1': '765', 'frm1700:txtPg1I21SpouseName': 'SANTOS, TAYLOR, CRUZ'
	});
	expect(getManagedTaxpayerValues('1700v2018', profile, 'Final', joint)).toEqual({});
	const prior = { ...joint, ...getManagedTaxpayerValues('1700v2018', profile, 'Draft', joint) };
	expect(getManagedTaxpayerValues('1700v2018', { ...profile, spouse: undefined }, 'Draft', prior)['frm1700:txtPg1I21SpouseName']).toBe('');

	expect(getManagedTaxpayerValues('1701v2018', profile)).not.toHaveProperty('frm1701:txtPg2I1TIN1');
	expect(getManagedTaxpayerValues('1701v2018', profile, 'Draft', { 'frm1701:rdoPg1I18FilingStatus': 'Joint' })).toMatchObject({
		'frm1701:txtPg2TIN1': '001', 'frm1701:txtPg2I1TIN1': '765'
	});
	expect(getManagedTaxpayerValues('1701Qv2018', profile)).not.toHaveProperty('frm1701q:txtSpouseTIN1');
	expect(getManagedTaxpayerValues('1701Qv2018', profile, 'Draft', { 'income:useSavedSpouse': 'Y' })).toMatchObject({
		'frm1701q:txtSpouseTIN1': '765', 'frm1701q:txtBirthMonth': '02', 'frm1701q:txtBirthDay': '29', 'frm1701q:txtBirthYear': '1984'
	});
	expect(getManagedTaxpayerValues('1700', profile)).toMatchObject({
		'frm1700:txtPg1Pt1I8TaxFilerLastName': 'SANTOS',
		'frm1700:txtPg1Pt1I8TaxFilerFirstName': 'ALEX',
		'frm1700:txtPg1Pt1I8TaxFilerMiddleName': 'REYES'
	});
});

it('ignores manual payment instruments without erasing calculated balances or tax credits', async () => {
	const { getReturnExportValues } = await import('$lib/forms/form-runtime');
	const { incomePaymentFieldIds } = await import('$lib/forms/individual-income');
	expect(incomePaymentFieldIds('1701A')).toContain('frm1701A:txtAmount32');
	expect(incomePaymentFieldIds('1701A')).not.toContain('frm1701A:txt57A');
	const payment = { 'frm1701A:txtAmount32': 'invalid prior payment', 'frm1701A:txt57A': '1000.00' };
	expect(validateReturnValues('1701A', payment)['frm1701A:txtAmount32']).toBeUndefined();
	expect(getReturnExportValues('1701A', payment)).not.toHaveProperty('frm1701A:txtAmount32');
	expect(getReturnExportValues('1701A', payment)['frm1701A:txt57A']).toBe('1000.00');
});

it('manages legacy Form 1700 PSOC from the taxpayer profile and preserves untracked draft values', async () => {
	const { getManagedTaxpayerValues } = await import('$lib/forms/form-runtime');
	const { upsertTaxpayerProfile } = await import('$lib/profiles/profile');
	const [profile] = upsertTaxpayerProfile([], {
		tin1: '001', tin2: '234', tin3: '567', branchCode: '00008', rdoCode: '047',
		taxpayerName: 'SANTOS, ALEX, REYES', address: '28 Narra Street', address2: '', zipCode: '1209',
		contactNumber: '0285550148', email: 'alex.santos@example.test', category: 'P', taxpayerClassification: 'I', psocCode: ' 0110 '
	});
	const id = 'frm1700:txtPg1Pt1I7Psoc';
	expect(profile.psocCode).toBe('0110');
	const managed = getManagedTaxpayerValues('1700', profile, 'Draft', { [id]: '1234' });
	expect(managed[id]).toBe('0110');
	const cleared = { ...profile, psocCode: undefined };
	expect(getManagedTaxpayerValues('1700', cleared, 'Draft', managed)[id]).toBe('');
	const nonIndividual = { ...profile, taxpayerClassification: 'N' as const };
	expect(getManagedTaxpayerValues('1700', nonIndividual, 'Draft', managed)[id]).toBe('');
	expect(getManagedTaxpayerValues('1700', nonIndividual, 'Draft', {})).not.toHaveProperty(id);
	expect(getManagedTaxpayerValues('1700', cleared, 'Draft', { [id]: '1234' })[id]).toBeUndefined();
	expect(validateReturnValues('1700', { [id]: '12' })[id]).toMatch(/four/i);
});

describe('return amount precision', () => {
	it.each(['1700', '1700v2018'])('rounds each employer amount before summing it in %s', (code) => {
		const legacy = code === '1700';
		const fields = legacy ? ['txtPg2Pt4I1ComIncomeC1', 'txtPg2Pt4I2ComIncomeC1'] : ['txtPg2ISched1c_1REG', 'txtPg2ISched1c_2REG'];
		const total = legacy ? 'txtPg2Pt4I4AC1' : 'txtPg2ISched1c_5AREG';
		const result = calculateReturn(code, {
			['frm1700:' + fields[0]]: '1,234.50',
			['frm1700:' + fields[1]]: '1,234.50',
			'frm1700:rdoPg2I1PartVIEmployee': 'Taxpayer',
			'frm1700:rdoPg2I2PartVIEmployee': 'Taxpayer'
		});
		expect(Number(result['frm1700:' + total])).toBe(2470);
	});

	it('adds the individually rounded amounts in Form 1701A detail rows', () => {
		const result = calculateReturn('1701A', {
			'frm1701A:optTaxType': 'S', 'frm1701A:optATC': 'II012', 'frm1701A:optTaxRate': 'G',
			'frm1701A:txtmodalPartIVA_1C2': '1,234.50',
			'frm1701A:txtmodalPartIVA_2C2': '1,234.50'
		});
		expect(Number(result['frm1701A:txt42A'])).toBe(2470);
	});

	it('rounds revised Form 1701 inputs before subtracting deductions', () => {
		const result = calculateReturn('1701v2018', {
			'frm1701:txtPg1I1Year': '2025',
			'frm1701:rdoPg1I21TaxRate': 'Graduated',
			'frm1701:rdoPg1I21AMethodDeduction': 'OSD',
			'frm1701:txtPg2IShed3_8A': '1000.49',
			'frm1701:txtPg2IShed3_9A': '200.50'
		});
		expect(Number(result['frm1701:txtPg2IShed3_10A'])).toBe(799);
	});

	it('keeps the special tax rate at its entered precision on Form 1701-MS', () => {
		const result = calculateReturn('1701MS', {
			'frm1701MS:txtTaxRatea': '6.50',
			'frm1701MS:txtToBeCarried1': '1,234.50'
		});
		expect(result['frm1701MS:txtTaxRatea']).toBe('6.50');
		expect(result['frm1701MS:txtToBeCarried1']).toBe('1235');
	});

	it('keeps cents in the legacy Form 1701Q calculation', () => {
		const result = calculateReturn('1701Q', {
			'frm1701q:txt26A': '1,234.56', 'frm1701q:txt27A': '0.10'
		});
		expect(result['frm1701q:txt28A']).toBe('1234.66');
	});
});
