import { calculateCorporateIncome, corporateProfileField, corporateProfileValues, corporateReturnPeriod, getCorporateIncomeForm, validateCorporateIncome } from './corporate-income';
import { calculateIndividualIncome, getIndividualIncomeForm, incomeOutputValues, incomeProfileValues, individualIncomePeriod, validateIndividualIncome, type IncomeProfileOptions } from './individual-income';
import { exportRevisedActivityFields } from './individual-income/annual-2018-activities';
import { incomeIncludesSpouse } from './individual-income/profile-fields';
import { buildTaxpayerProfileFormValues, taxpayerEmailError, type TaxpayerProfile } from '$lib/profiles/profile';
import type { CreatedReturnStatus } from '$lib/ebirforms/created-returns';
import { calculate1601EQ, validate1601EQ } from './form-1601-eq/form-1601-eq-rules';
import { getWithholdingDefinition, is1602QDecedentWithdrawalInactive, withholdingPriorRemittanceFields } from './withholding-definitions';
import { calculateWithholding, validateWithholding, withholdingProfileValues, withholdingReturnPeriod } from './withholding-rules';

export function calculateReturn(code: string, values: Record<string, string>): Record<string, string> {
 const normalized = Object.fromEntries(Object.entries(values).map(([id, value]) => [id, /email/i.test(id) ? value.toLowerCase() : value]));
 const income = getIndividualIncomeForm(code);
 if (income) return calculateIndividualIncome(income, normalized);
 const corporate = getCorporateIncomeForm(code);
 if (corporate) return calculateCorporateIncome(corporate, normalized);
 return code === '1601EQ' ? calculate1601EQ(normalized) : calculateWithholding(code, normalized);
}
export function getReturnExportValues(code: string, values: Record<string, string>): Record<string, string> {
 const calculated = calculateReturn(code, values);
 const income = getIndividualIncomeForm(code);
 if (income) {
  const output = incomeOutputValues(income, calculated);
  return code === '1701v2018' ? exportRevisedActivityFields(output, incomeIncludesSpouse(code, calculated)) : output;
 }
 const priorCredit = withholdingPriorRemittanceFields[code];
 const withholding = getWithholdingDefinition(code);
 if (priorCredit && withholding && calculated[withholding.prefix + 'optAmend'] !== 'Y') {
  const id = withholding.prefix + priorCredit;
  if (id in calculated) calculated[id] = '0.00';
 }
 if (code === '1602Qv2018' && is1602QDecedentWithdrawalInactive(calculated)) {
  const id = 'frm1602Q:txtSched1Amount15';
  if (id in calculated) calculated[id] = '';
 }
 return calculated;
}

export function validateReturnValues(code: string, values: Record<string, string>): Record<string, string> {
 if (code === '1601EQ') return validate1601EQ(values);
 const income = getIndividualIncomeForm(code);
 if (income) return validateIndividualIncome(income, values);
 const corporate = getCorporateIncomeForm(code);
 if (corporate) return validateCorporateIncome(corporate, calculateCorporateIncome(corporate, values));
 const errors = validateWithholding(code, values);
 const emailId = getReturnEmailFieldId(code);
 if (!values[emailId]?.trim()) errors[emailId] = taxpayerEmailError('', true);
 return errors;
}
export function getReturnPeriod(code: string, values: Record<string, string>): string {
 const income = getIndividualIncomeForm(code);
 if (income) return individualIncomePeriod(income, values);
 const corporate = getCorporateIncomeForm(code);
 if (corporate) return corporateReturnPeriod(corporate, values);
 return code === '1601EQ' ? `${values['frm1601EQ:txtYear'] || 'YYYY'}${values['frm1601EQ:optQuarter'] || 'Q'}` : withholdingReturnPeriod(code, values);
}
export function getReturnAmount(code: string, values: Record<string, string>): string | undefined {
 const income = getIndividualIncomeForm(code);
 if (income) return values[income.amount] || '0.00';
 const corporate = getCorporateIncomeForm(code);
 if (corporate) return corporate.amount ? values[corporate.amount] || '0.00' : undefined;
 if (getWithholdingDefinition(code)?.period === 'year') return undefined;
 const field = code === '1601EQ' ? 'frm1601EQ:txtTotalAmountDue' : getWithholdingDefinition(code)?.totalField;
 return field ? values[field] || '0.00' : '0.00';
}
export function getReturnTin(code: string, values: Record<string, string>, profile: TaxpayerProfile): Pick<TaxpayerProfile, 'tin1'|'tin2'|'tin3'|'branchCode'> {
 const income = getIndividualIncomeForm(code);
 if (income) return {
  tin1: values[income.identity.tin1!] || profile.tin1, tin2: values[income.identity.tin2!] || profile.tin2,
  tin3: values[income.identity.tin3!] || profile.tin3, branchCode: values[income.identity.branchCode!] || profile.branchCode
 };
 const corporate = getCorporateIncomeForm(code);
 if (corporate) {
  const part = (key: 'tin1' | 'tin2' | 'tin3' | 'branchCode') => values[corporateProfileField(corporate, key) ?? ''] || profile[key];
  return { tin1: part('tin1'), tin2: part('tin2'), tin3: part('tin3'), branchCode: part('branchCode') };
 }
 const prefix = code === '1601EQ' ? 'frm1601EQ:' : getWithholdingDefinition(code)?.prefix || '';
 return { tin1: values[`${prefix}txtTIN1`] || profile.tin1, tin2: values[`${prefix}txtTIN2`] || profile.tin2,
  tin3: values[`${prefix}txtTIN3`] || profile.tin3, branchCode: values[`${prefix}txtBranchCode`] || profile.branchCode };
}
export function getReturnEmailFieldId(code: string): string {
 const corporate = getCorporateIncomeForm(code);
 if (corporate) return corporateProfileField(corporate, 'email') ?? 'txtEmail';
 return getIndividualIncomeForm(code)?.identity.email ?? getWithholdingDefinition(code)?.sections.flatMap(section => section.fields)
  .find(field => field.profileKey === 'email')?.id ?? 'txtEmail';
}
export function getReturnEmail(code: string, values: Record<string, string>, profile: TaxpayerProfile): string {
 const id = getReturnEmailFieldId(code);
 return (values[id] ?? (id === 'txtEmail' ? profile.email : '')).trim().toLowerCase();
}

/** Editable drafts follow profile corrections; finalized copies retain their saved identity. */
export function getManagedTaxpayerValues(
 code: string,
 profile: TaxpayerProfile,
 status: CreatedReturnStatus = 'Draft',
 values: Record<string, string> = {},
 options?: IncomeProfileOptions
): Record<string, string> {
 if (status !== 'Draft') return {};
 const income = getIndividualIncomeForm(code);
 if (income) return incomeProfileValues(income, profile, values, options);
 const corporate = getCorporateIncomeForm(code);
 if (corporate) return corporateProfileValues(corporate, profile, values);
 if (code === '1601EQ') return buildTaxpayerProfileFormValues(profile);
 const definition = getWithholdingDefinition(code);
 if (!definition) return {};
 const managed = withholdingProfileValues(definition, profile);
 if (code === '0605' && profile.taxpayerClassification === 'I') {
  managed[definition.prefix + 'itemYearEndMonth'] = '12';
  managed[definition.prefix + 'itemFiscalStartMonth'] = 'Calendar';
 }
 return managed;
}
