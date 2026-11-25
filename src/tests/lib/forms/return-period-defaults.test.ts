import { afterEach, describe, expect, it, vi } from 'vitest';
import { createWithholdingValues, calculateWithholding, validateWithholding } from '$lib/forms/withholding-rules';
import { getManagedTaxpayerValues, getReturnExportValues, validateReturnValues } from '$lib/forms/form-runtime';
import { createInitialFormValues, initialProfile } from '$lib/ebirforms/ebirforms-workspace.svelte';
import { getWithholdingDefinition } from '$lib/forms/withholding-definitions';
import type { TaxpayerProfile } from '$lib/profiles/profile';

const individual = { taxpayerClassification: 'I' } as TaxpayerProfile;
describe('return period defaults', () => {
 afterEach(() => vi.useRealTimers());
 function freeze(instant: string) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(instant));
 }

 it('starts a new non-individual 0605 on a consistent calendar year-end', () => {
  freeze('2026-11-25T04:00:00Z');
  const values = createWithholdingValues('0605', { ...initialProfile, taxpayerClassification: 'N' });
  expect(values['frm0605:txtYearEnded']).toBe('2026');
  expect(values['frm0605:itemFiscalStartMonth']).toBe('Calendar');
  expect(values['frm0605:itemYearEndMonth']).toBe('12');
 });

 it('starts the historical monthly forms at January 2017', () => {
  freeze('2026-11-25T04:00:00Z');
  expect(createWithholdingValues('1600')['frm1600:txtMonth']).toBe('11');
  for (const code of ['1601E', '1601F']) {
   const values = createWithholdingValues(code);
   expect(values).toMatchObject({ [`frm${code}:txtYear`]: '2017', [`frm${code}:txtMonth`]: '01' });
  }
 });

 it.each(['0619E', '0619F'])('defaults %s to the completed month and initializes the due date across Manila New Year', (code) => {
  freeze('2025-12-31T16:00:00Z');
  const prefix = `frm${code}:`;
  const values = createWithholdingValues(code);
  expect(values).toMatchObject({ [prefix + 'txtYear']: '2025', [prefix + 'txtMonth']: '12', [prefix + 'dueDate']: '2026-01-10' });
  const errors = validateWithholding(code, values);
  for (const key of ['txtYear', 'txtMonth', 'dueDate']) expect(errors[prefix + key]).toBeUndefined();
 });

 it('uses WB as the editable initial 0619F tax type', () => {
  const values = createWithholdingValues('0619F');
  expect(values['frm0619F:txtTaxTypeCode']).toBe('WB');
  expect(getReturnExportValues('0619F', { ...values, 'frm0619F:txtTaxTypeCode': 'WF' })['frm0619F:txtTaxTypeCode']).toBe('WF');
 });

 it.each(['1600WP', '1606'])('initializes and validates a new %s transaction date using the Manila date', (code) => {
  freeze('2026-11-24T17:00:00Z');
  const date = `frm${code}:date`;
  const values = createWithholdingValues(code);
  expect(values[date]).toBe('2026-11-25');
  expect(validateWithholding(code, values)[date]).toBeUndefined();
  expect(validateWithholding(code, { ...values, [date]: '2026-11-26' })[date]).toBeTruthy();
 });

 it.each(['1604C', '1604CF', '1604E', '1604F'])('starts a new %s in the previous reporting year', (code) => {
  freeze('2025-12-31T16:00:00Z');
  const { yearField } = getWithholdingDefinition(code)!;
  expect(createWithholdingValues(code)[yearField]).toBe('2025');
 });

 it('starts revised 1603Q at its documented template year', () => {
  freeze('2026-11-25T04:00:00Z');
  expect(createWithholdingValues('1603Qv2018')['frm1603Q:txtYear']).toBe('2018');
 });

 it.each(['0619E', '0619F', '1600', '1600WP', '1601C', '1601Cv2018', '1601E', '1601F', '1601FQ', '1602', '1602Qv2018', '1603', '1603Qv2018', '1606'])(
  'requires the filer to choose the withholding answer for %s', (code) => {
   const { prefix } = getWithholdingDefinition(code)!;
   const id = prefix + 'optWithheld';
   const values = createWithholdingValues(code);
   expect(values[id]).toBe('');
   expect(validateWithholding(code, values)[id]).toBeTruthy();
   expect(getReturnExportValues(code, values)[id]).toBe('');
   expect(getReturnExportValues(code, { ...values, [id]: 'N' })[id]).toBe('N');
  }
 );

 it('preserves the documented No defaults on 1600PT and 1600VT', () => {
  for (const code of ['1600PTv2018', '1600VTv2018']) {
   const { prefix } = getWithholdingDefinition(code)!;
   expect(createWithholdingValues(code)[prefix + 'optWithheld']).toBe('N');
  }
 });

 it('leaves revised 1602Q amendment and relief and revised 1604E agent status unselected', () => {
  const interest = createWithholdingValues('1602Qv2018');
  expect(interest).toMatchObject({ 'frm1602Q:optAmend': '', 'frm1602Q:optRelief': '' });
  expect(validateWithholding('1602Qv2018', interest)['frm1602Q:optRelief']).toBeTruthy();
  expect(createWithholdingValues('1604Ev2018')['frm1604e:topAgent']).toBe('');
 });

 it('starts 1601EQ with the current Manila year and no quarter or withholding answer', () => {
  freeze('2026-12-31T16:00:00Z');
  const values = createInitialFormValues(initialProfile);
  expect(values).toMatchObject({
   'frm1601EQ:txtYear': '2027', 'frm1601EQ:optQuarter': '',
   'frm1601EQ:optTaxesWithheld': '', 'frm1601EQ:optAmendedReturn': 'N'
  });
  const errors = validateReturnValues('1601EQ', values);
  expect(errors['frm1601EQ:optQuarter']).toBeTruthy();
  expect(errors['frm1601EQ:optTaxesWithheld']).toBeTruthy();
  expect(errors['frm1601EQ:txtATC13']).toBeUndefined();
  expect(getReturnExportValues('1601EQ', { ...values, 'frm1601EQ:txtOverremittancePreviousQuarter': '100' })['frm1601EQ:txtOverremittancePreviousQuarter']).toBe('0.00');
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
