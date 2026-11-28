import { expect, it } from 'vitest';
import { calculateReturn, getReturnAmount, getReturnExportValues } from '$lib/forms/form-runtime';
it('does not misrepresent annual remittances as an amount due', () => {
 expect(getReturnAmount('1604C', { 'frm1604c:txtSched1Total': '10000.00' })).toBeUndefined();
 expect(getReturnAmount('0619E', { 'frm0619E:txtTax18': '8300.00' })).toBe('8300.00');
});

it('exports a zero prior credit on an original return while preserving the saved draft value', () => {
 const credit = 'frm0619E:txtTax15';
 const amended = 'frm0619E:optAmend';
 const values = { [amended]: 'N', 'frm0619E:txtTax14': '1000', [credit]: '250' };
 expect(calculateReturn('0619E', values)[credit]).toBe('250');
 expect(getReturnExportValues('0619E', values)[credit]).toBe('0.00');
 expect(getReturnExportValues('0619E', { ...values, [amended]: 'Y' })[credit]).toBe('250');
});

it('omits an inactive 1602Q decedent withdrawal from export without losing the draft entry', () => {
 const year = 'frm1602Q:txtYear';
 const withdrawal = 'frm1602Q:txtSched1Amount15';
 const values = { [year]: '2019', [withdrawal]: '1000' };

 expect(calculateReturn('1602Qv2018', values)[withdrawal]).toBe('1000');
 expect(getReturnExportValues('1602Qv2018', values)[withdrawal]).toBe('');
 expect(getReturnExportValues('1602Qv2018', { ...values, [year]: '2018' })[withdrawal]).toBe('1000');
});

it('normalizes saved email values across every return without altering other text', async () => {
 const { listForms } = await import('$lib/forms');
 const { calculateReturn, getReturnEmail, getReturnEmailFieldId } = await import('$lib/forms/form-runtime');
 const { initialProfile } = await import('$lib/ebirforms/ebirforms-workspace.svelte');
 for (const form of listForms().filter(form => form.status === 'ready')) {
  const emailId = getReturnEmailFieldId(form.code);
  const values = { [emailId]: 'Mixed.Case@Example.COM', reference: 'Keep My Case' };
  expect(calculateReturn(form.code, values)[emailId], form.code).toBe('mixed.case@example.com');
  expect(calculateReturn(form.code, values).reference).toBe('Keep My Case');
  expect(getReturnEmail(form.code, values, initialProfile), form.code).toBe('mixed.case@example.com');
 }
});

it('normalizes profile emails when saving and creating or refreshing returns', async () => {
 const { initialProfile, createInitialFormValues } = await import('$lib/ebirforms/ebirforms-workspace.svelte');
 const { upsertTaxpayerProfile } = await import('$lib/profiles/profile');
 const { getManagedTaxpayerValues } = await import('$lib/forms/form-runtime');
 const profile = { ...initialProfile, email: 'Mixed.Case@Example.COM' };
 expect(upsertTaxpayerProfile([], profile)[0].email).toBe('mixed.case@example.com');
 expect(createInitialFormValues(profile).txtEmail).toBe('mixed.case@example.com');
 expect(createInitialFormValues(profile, '0619E')['frm0619E:txtEmail']).toBe('mixed.case@example.com');
 expect(getManagedTaxpayerValues('0619E', profile)['frm0619E:txtEmail']).toBe('mixed.case@example.com');
});
