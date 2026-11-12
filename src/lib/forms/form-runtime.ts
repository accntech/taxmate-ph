import type { TaxpayerProfile } from '$lib/profiles/profile';
import type { CreatedReturnStatus } from '$lib/ebirforms/created-returns';
import { calculate1601EQ, validate1601EQ } from './form-1601-eq/form-1601-eq-rules';
import { getWithholdingDefinition } from './withholding-definitions';
import { calculateWithholding, validateWithholding, withholdingReturnPeriod } from './withholding-rules';

export function calculateReturn(code: string, values: Record<string, string>): Record<string, string> {
 return code === '1601EQ' ? calculate1601EQ(values) : calculateWithholding(code, values);
}
export function validateReturnValues(code: string, values: Record<string, string>): Record<string, string> {
 return code === '1601EQ' ? validate1601EQ(values) : validateWithholding(code, values);
}
export function getReturnPeriod(code: string, values: Record<string, string>): string {
 return code === '1601EQ' ? `${values['frm1601EQ:txtYear'] || 'YYYY'}${values['frm1601EQ:optQuarter'] || 'Q'}` : withholdingReturnPeriod(code, values);
}
export function getReturnAmount(code: string, values: Record<string, string>): string | undefined {
 if (getWithholdingDefinition(code)?.period === 'year') return undefined;
 const field = code === '1601EQ' ? 'frm1601EQ:txtTotalAmountDue' : getWithholdingDefinition(code)?.totalField;
 return field ? values[field] || '0.00' : '0.00';
}
export function getReturnTin(code: string, values: Record<string, string>, profile: TaxpayerProfile): Pick<TaxpayerProfile, 'tin1'|'tin2'|'tin3'|'branchCode'> {
 const prefix = code === '1601EQ' ? 'frm1601EQ:' : getWithholdingDefinition(code)?.prefix || '';
 return { tin1: values[`${prefix}txtTIN1`] || profile.tin1, tin2: values[`${prefix}txtTIN2`] || profile.tin2,
  tin3: values[`${prefix}txtTIN3`] || profile.tin3, branchCode: values[`${prefix}txtBranchCode`] || profile.branchCode };
}
export function getReturnEmail(code: string, values: Record<string, string>, profile: TaxpayerProfile): string {
 if (code === '1601EQ') return values.txtEmail ?? profile.email;
 const emailField = getWithholdingDefinition(code)?.sections.flatMap(section => section.fields).find(field => field.profileKey === 'email');
 return emailField ? values[emailField.id] ?? '' : profile.email;
}

/** Editable drafts follow profile corrections; finalized copies retain their saved identity. */
export function getManagedTaxpayerValues(code: string, profile: TaxpayerProfile, status: CreatedReturnStatus = 'Draft'): Record<string, string> {
 if (status !== 'Draft') return {};
 const definition = getWithholdingDefinition(code);
 if (!definition) return {};
 return Object.fromEntries(definition.sections.flatMap(section => section.fields).flatMap(field => {
  const key = field.profileKey;
  return key ? [[field.id, profile[key] ?? '']] : [];
 }));
}
