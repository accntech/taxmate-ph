import { expect, it } from 'vitest';
import { getReturnAmount } from '$lib/forms/form-runtime';
it('does not misrepresent annual remittances as an amount due', () => {
 expect(getReturnAmount('1604C', { 'frm1604c:txtSched1Total': '10000.00' })).toBeUndefined();
 expect(getReturnAmount('0619E', { 'frm0619E:txtTax18': '8300.00' })).toBe('8300.00');
});

it('normalizes saved email values across every return without altering other text', async () => {
 const { listForms } = await import('$lib/forms');
 const { calculateReturn, getReturnEmail } = await import('$lib/forms/form-runtime');
 const { getWithholdingDefinition } = await import('$lib/forms/withholding-definitions');
 const { initialProfile } = await import('$lib/ebirforms/ebirforms-workspace.svelte');
 for (const form of listForms().filter(form => form.status === 'ready')) {
  const definition = getWithholdingDefinition(form.code);
  const emailId = definition?.sections.flatMap(section => section.fields).find(field => field.profileKey === 'email')?.id ?? 'txtEmail';
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
