import { describe, expect, it, vi } from 'vitest';
import { createWithholdingValues, calculateWithholding, validateWithholding } from '$lib/forms/withholding-rules';
import { getManagedTaxpayerValues } from '$lib/forms/form-runtime';
import type { TaxpayerProfile } from '$lib/profiles/profile';

const individual = { taxpayerClassification: 'I' } as TaxpayerProfile;
describe('return period defaults', () => {
 it('autofills the current year and month for a new 0605', () => {
  const now = new Date();
  const values = createWithholdingValues('0605');
  expect(values['frm0605:txtYearEnded']).toBe(String(now.getFullYear()));
  expect(values['frm0605:itemYearEndMonth']).toBe(String(now.getMonth() + 1).padStart(2, '0'));
 });
 it('autofills monthly periods within the form year limits', () => {
  const now = new Date();
  expect(createWithholdingValues('1600')['frm1600:txtMonth']).toBe(String(now.getMonth() + 1).padStart(2, '0'));
  expect(createWithholdingValues('1601E')['frm1601E:txtYear']).toBe('2017');
 });
 it('defaults 0619 to a completed month across the January year boundary', () => {
  vi.useFakeTimers();
  try {
   vi.setSystemTime(new Date(2026, 0, 15));
   for (const code of ['0619E', '0619F']) {
    const values = createWithholdingValues(code);
    expect(values[`frm${code}:txtYear`]).toBe('2025');
    expect(values[`frm${code}:txtMonth`]).toBe('12');
    const errors = validateWithholding(code, values);
    expect(errors[`frm${code}:txtYear`]).toBeUndefined();
    expect(errors[`frm${code}:txtMonth`]).toBeUndefined();
   }
  } finally { vi.useRealTimers(); }
 });
 it('fixes individual year-end to December and calendar basis', () => {
  const values = createWithholdingValues('0605', individual);
  expect(values['frm0605:itemYearEndMonth']).toBe('12');
  expect(values['frm0605:itemFiscalStartMonth']).toBe('Calendar');
  const changed = calculateWithholding('0605', { ...values, 'frm0605:itemYearEndMonth': '06', 'frm0605:itemFiscalStartMonth': 'Fiscal' });
  expect(changed['frm0605:itemYearEndMonth']).toBe('12');
  expect(changed['frm0605:itemFiscalStartMonth']).toBe('Calendar');
 });
 it('preserves non-individual fiscal choices and applies individual rules on draft reload', () => {
  const values = calculateWithholding('0605', { 'frm0605:txtClassification': 'N', 'frm0605:itemYearEndMonth': '06', 'frm0605:itemFiscalStartMonth': 'Fiscal' });
  expect(values['frm0605:itemYearEndMonth']).toBe('06');
  expect(getManagedTaxpayerValues('0605', individual)['frm0605:itemYearEndMonth']).toBe('12');
  expect(getManagedTaxpayerValues('0605', individual, 'Final')).toEqual({});
 });
});
