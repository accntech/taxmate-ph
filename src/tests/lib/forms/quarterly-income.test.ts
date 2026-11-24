import { describe, expect, it } from 'vitest';
import { calculateReturn, getReturnExportValues, validateReturnValues } from '../../../lib/forms/form-runtime';
import { quarterlyIncomeFieldApplies, validateQuarterly } from '../../../lib/forms/individual-income/quarterly';

const p = 'frm1701q:';
const values = (fields: Record<string, string>) => Object.fromEntries(Object.entries(fields).map(([key, value]) => [p + key, value]));

describe('quarterly individual income returns', () => {
 it('calculates cumulative graduated tax and prior payments using the return-year table', () => {
  const input = values({ txtYear: '2024', optATC: 'II012', optTaxRate: 'Graduated', optMethodOfDeduction: 'I', txt36A: '400000', txt42A: '200000', txt55A: '40000' });
  const result = calculateReturn('1701Qv2018', input);
  expect(result[p + 'txt45A']).toBe('600000.00');
  expect(result[p + 'txt46A']).toBe('62500.00');
  expect(result[p + 'txt31']).toBe('22500.00');
  expect(calculateReturn('1701Qv2018', {...input, [p+'txtYear']: '2022'})[p+'txt46A']).toBe('80000.00');
  expect(input[p+'txt45A']).toBeUndefined();
 });
 it('keeps mixed-income 8% subtraction at zero and adds penalties to an overpayment', () => {
  const result = calculateReturn('1701Qv2018', values({ txtYear: '2024', optTaxRate: 'Percentage', optATC: 'II016', txt47A: '500000', txt52A: '250000', txt55A: '45000', txt64A: '1000' }));
  expect(result[p+'txt52A']).toBe('250000');
  expect(getReturnExportValues('1701Qv2018', result)).not.toHaveProperty(p + 'txt52A');
  expect(result[p+'txt54A']).toBe('40000.00');
  expect(result[p+'txt31']).toBe('-4000.00');
 });
 it('calculates legacy OSD from sales and preserves taxpayer/spouse totals', () => {
  const result = calculateReturn('1701Q', {...values({ txtYear: '2017', txt26A: '100000', txt27A: '10000', txt29A: '5000', txt31A: '2000', txt35A: '30000', txt38A: '5000', txt40A: '500', txt26B: '20000', txtSpousename: 'EXAMPLE, SAM' }), 'frm1701:optMethodOfDeduction23': 'O', 'frm1701:optMethodOfDeduction24': 'I'});
  expect(result[p+'txt33A']).toBe('40000.00');
  expect(result[p+'txt29A']).toBe('5000');
  expect(getReturnExportValues('1701Q', result)).not.toHaveProperty(p + 'txt29A');
  expect(result[p+'txt36A']).toBe('102000.00');
  expect(result[p+'txt37A']).toBe('14900.00');
  expect(result[p+'txt41C']).toBe('11900.00');
 });
 it('requires a quarter and rejects impossible birthday and excessive 8% subtraction', () => {
  const errors = validateReturnValues('1701Qv2018', values({ txtYear: '2024', DateQuarter: '4', txtBirthMonth: '02', txtBirthDay: '30', txtBirthYear: '1980', optATC: 'II015', optTaxRate: 'Percentage', txt52A: '250001' }));
  expect(errors[p+'DateQuarter']).toBeTruthy();
  expect(errors[p+'txtBirthDay']).toBeTruthy();
  expect(errors[p+'txt52A']).toBeTruthy();
 });
 it('excludes tax paid on a previously filed legacy return until an amendment is selected', () => {
  const input = values({ AmendedRtn: 'N', txt26A: '100000', txt38A: '500', txt38I: '3000', txt38J: '500', txtSpousename: 'EXAMPLE, SAM' });
  const original = calculateReturn('1701Q', input);
  expect(original[p + 'txt38M']).toBe('500.00');
  expect(original[p + 'txt38N']).toBe('0.00');
  expect(original[p + 'txt38I']).toBe('3000');
  const amended = calculateReturn('1701Q', { ...original, [p + 'AmendedRtn']: 'Y' });
  expect(amended[p + 'txt38M']).toBe('3500.00');
  expect(amended[p + 'txt38N']).toBe('500.00');
 });
 it('retains saved figures when the 2018 tax regime changes', () => {
  const input = values({
   txtYear: '2024', optATC: 'II012', optTaxRate: 'Graduated', optMethodOfDeduction: 'I',
   txt36A: '500000', txt47A: '400000', txt52A: '250000', AmendedRtn: 'N', txt59A: '5000'
  });
  const graduated = calculateReturn('1701Qv2018', input);
  expect(graduated[p + 'txt31']).toBe('42500.00');
  expect(graduated[p + 'txt47A']).toBe('400000');
  expect(graduated[p + 'txt59A']).toBe('5000');
  const percentage = calculateReturn('1701Qv2018', { ...graduated, [p + 'optATC']: 'II015', [p + 'optTaxRate']: 'Percentage' });
  expect(percentage[p + 'txt31']).toBe('12000.00');
  expect(percentage[p + 'txt36A']).toBe('500000');
  expect(percentage[p + 'txt46A']).toBe('0.00');
 });
 it('disregards saved spouse amounts and identity validation for estates', () => {
  const input = values({
   txtYear: '2024', optTaxpayerType: 'Estate', optATC: 'II012', optTaxRate: 'Graduated', optMethodOfDeduction: 'I',
   txt36A: '500000', txtSpouseName: 'Saved spouse', optSpouseTaxRate: 'Percentage', txt47B: '400000'
  });
  const estate = calculateReturn('1701Qv2018', input);
  expect(estate[p + 'txt31']).toBe('42500.00');
  expect(estate[p + 'txt47B']).toBe('400000');
  expect(validateQuarterly('1701Qv2018', input)[p + 'txtSpouseTIN1']).toBeUndefined();
 });
 it('identifies the active schedule and amendment fields for each 2018 filer', () => {
  const input = values({
   optATC: 'II012', optTaxRate: 'Graduated', optMethodOfDeduction: 'O',
   optSpouseATC: 'II016', optSpouseTaxRate: 'Percentage', AmendedRtn: 'N', txtSpouseName: 'EXAMPLE, SAM'
  });
  const visible = (name: string) => quarterlyIncomeFieldApplies('1701Qv2018', p + name, input);
  expect(['txt36A', 'txt40A', 'txt47B', 'txt48Desc'].map(visible)).toEqual([true, true, true, true]);
  expect(['txt37A', 'txt39A', 'txt47A', 'txt36B', 'txt52B', 'txt59A'].map(visible)).toEqual([false, false, false, false, false, false]);
 });
 it('excludes removed spouses from legacy quarterly totals, validation and export without discarding draft entries', () => {
  const draft = {
   ...values({ txtYear: '2017', txt26A: '100000', txt26B: '100000', txt38B: '500', txt40B: '100', txtSpousename: 'EXAMPLE, SAM' }),
   'frm1701:optMethodOfDeduction24': 'I', 'income:useSavedSpouse': 'N'
  };
  const result = calculateReturn('1701Q', draft);
  expect(result[p + 'txt41C']).toBe(result[p + 'txt41A']);
  expect(result[p + 'txt26B']).toBe('100000');
  expect(getReturnExportValues('1701Q', result)).not.toHaveProperty(p + 'txt38B');
  expect(getReturnExportValues('1701Q', result)).not.toHaveProperty(p + 'txt40B');
  expect(validateQuarterly('1701Q', draft)[p + 'txt7TIN1']).toBeUndefined();
  expect(calculateReturn('1701Q', { ...draft, 'income:useSavedSpouse': 'Y' })[p + 'txt41B']).toBe('14100.00');
 });
 it('excludes unnamed spouses from revised quarterly totals despite stale business amounts', () => {
  const draft = values({
   txtYear: '2025', optATC: 'II012', optTaxRate: 'Graduated', optMethodOfDeduction: 'I', txt36A: '500000',
   optSpouseATC: 'II015', optSpouseTaxRate: 'Percentage', txt47B: '400000', txt64B: '100'
  });
  const result = calculateReturn('1701Qv2018', draft);
  expect(result[p + 'txt31']).toBe('42500.00');
  expect(result[p + 'txt47B']).toBe('400000');
  expect(getReturnExportValues('1701Qv2018', result)).not.toHaveProperty(p + 'txt64B');
  expect(calculateReturn('1701Qv2018', { ...draft, ...values({ txtSpouseName: 'EXAMPLE, SAM' }) })[p + 'txt30B']).toBe('32100.00');
 });
 it('excludes foreign tax credits declined by the taxpayer while preserving the saved amount', () => {
  const draft = values({ txtYear: '2025', optATC: 'II012', optTaxRate: 'Graduated', optMethodOfDeduction: 'I', txt36A: '500000', optForeignTaxCredits: 'N', txtForeignTaxNumber: 'EXAMPLE', txt60A: '5000' });
  const result = calculateReturn('1701Qv2018', draft);
  expect(result[p + 'txt31']).toBe('42500.00');
  expect(result[p + 'txt60A']).toBe('5000');
  expect(getReturnExportValues('1701Qv2018', result)).not.toHaveProperty(p + 'txtForeignTaxNumber');
  expect(getReturnExportValues('1701Qv2018', result)).not.toHaveProperty(p + 'txt60A');
  expect(calculateReturn('1701Qv2018', { ...draft, ...values({ optForeignTaxCredits: 'Y' }) })[p + 'txt31']).toBe('37500.00');
 });
 it('uses the rate dictated by the ATC when a loaded draft carries a stale regime', () => {
  const draft = values({ txtYear: '2025', optATC: 'II015', optTaxRate: 'Graduated', optMethodOfDeduction: 'I', txt36A: '1000000', txt47A: '400000', txt52A: '250000' });
  const result = calculateReturn('1701Qv2018', draft);
  expect(result[p + 'txt31']).toBe('12000.00');
  const output = getReturnExportValues('1701Qv2018', result);
  expect(output[p + 'optTaxRate']).toBe('Percentage');
  expect(output).not.toHaveProperty(p + 'optMethodOfDeduction');
 });
 it('uses II011 and excludes stale business figures for a compensation-only spouse', () => {
  const draft = values({
   txtYear: '2025', optATC: 'II012', optTaxRate: 'Graduated', optMethodOfDeduction: 'I', txt36A: '500000',
   txtSpouseName: 'EXAMPLE, SAM', optSpouseType_3: 'Compensation', optSpouseATC: 'II015', optSpouseTaxRate: 'Percentage', txt47B: '400000', txt64B: '100'
  });
  expect(calculateReturn('1701Qv2018', draft)[p + 'txt31']).toBe('42500.00');
  const output = getReturnExportValues('1701Qv2018', draft);
  expect(output[p + 'optSpouseATC']).toBe('II011');
  expect(output).not.toHaveProperty(p + 'optSpouseTaxRate');
  expect(output).not.toHaveProperty(p + 'txt47B');
 });
});
