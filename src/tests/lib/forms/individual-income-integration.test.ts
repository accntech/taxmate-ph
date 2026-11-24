import { describe, expect, it } from 'vitest';
import { getFormDefinition } from '$lib/forms';
import { calculateReturn, getManagedTaxpayerValues, getReturnAmount, getReturnPeriod, validateReturnValues } from '$lib/forms/form-runtime';
import { createIndividualIncomeValues, getIndividualIncomeForm } from '$lib/forms/individual-income';
import type { TaxpayerProfile } from '$lib/profiles/profile';

const codes = ['1700', '1700v2018', '1701', '1701v2018', '1701A', '1701MS', '1701Q', '1701Qv2018'];
const individual: TaxpayerProfile = {
	id: 'sample', tin1: '001', tin2: '234', tin3: '567', branchCode: '00008', rdoCode: '047',
	taxpayerName: 'SANTOS, ALEX, REYES', address: '28 Narra Street', address2: '', zipCode: '1209',
	contactNumber: '0285550148', email: 'alex.santos@example.test', category: 'P',
	taxpayerClassification: 'I'
};

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
