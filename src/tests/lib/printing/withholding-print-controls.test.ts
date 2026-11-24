import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import Form0605Print, { printBindings } from '$lib/forms/printing/form-0605-print.svelte';
import Form1601EPrint from '$lib/forms/printing/form-1601e-print.svelte';
import Form0619EPrint, { printBindings as expandedRemittanceBindings } from '$lib/forms/printing/form-0619e-print.svelte';
import { printBindings as finalRemittanceBindings } from '$lib/forms/printing/form-0619f-print.svelte';
import { printBindings as propertyBindings } from '$lib/forms/printing/form-1606-print.svelte';
import { printBindings as compensationBindings } from '$lib/forms/printing/form-1604c-print.svelte';
import { printBindings as annualCompensationBindings } from '$lib/forms/printing/form-1604cf-print.svelte';
import { printBindings as finalWithholdingBindings } from '$lib/forms/printing/form-1601f-print.svelte';
import { createWithholdingValues } from '$lib/forms/withholding-rules';
import { createWithholdingPrintModel } from '$lib/printing/withholding-print-model';
import { initialProfile } from '$lib/ebirforms/ebirforms-workspace.svelte';

describe('source-native withholding print controls', () => {
 it.each([
  ['0619E', expandedRemittanceBindings, 'txtTax15', 'txtTax16'],
  ['0619F', finalRemittanceBindings, 'txtTax16', 'txtTax17']
 ] as const)('%s prints prior remittance only for amended returns', (code, bindings, prior, total) => {
  const prefix = `frm${code}:`;
  const values = {
   ...createWithholdingValues(code, initialProfile),
   [prefix + 'optAmend']: 'N', [prefix + 'optWithheld']: 'Y',
   [prefix + prior]: '100.00', [prefix + 'txtTax14']: '1000.00'
  };
  const original = createWithholdingPrintModel(code, values, bindings).text;
  expect([original[prior], original[prior + '_2']]).toEqual(['', '']);
  expect([original[total], original[total + '_2']]).toEqual(['1,000', '00']);
  const amended = createWithholdingPrintModel(code, { ...values, [prefix + 'optAmend']: 'Y' }, bindings).text;
  expect([amended[prior], amended[prior + '_2']]).toEqual(['100', '00']);
  expect([amended[total], amended[total + '_2']]).toEqual(['900', '00']);
  expect(values[prefix + prior]).toBe('100.00');
 });

 it('prints 0605 payment details only for their selected payment options', () => {
  const values = {
   ...createWithholdingValues('0605', initialProfile),
   'frm0605:itemModeOfPayment': 'Full payment',
   'frm0605:itemMannerOfPayment': 'Self-assessment',
   'frm0605:txtNumOfInstallment': '7',
   'frm0605:txtOthersName': 'Other payment details'
  };
  const inactive = createWithholdingPrintModel('0605', values, printBindings).text;
  expect(inactive['frm0605:txtNumOfInstallment']).toBe('');
  expect(inactive['frm0605:txtOthersName']).toBe('');
  const active = createWithholdingPrintModel('0605', {
   ...values, 'frm0605:itemModeOfPayment': 'Installment', 'frm0605:itemMannerOfPayment': 'Others'
  }, printBindings).text;
  expect(active['frm0605:txtNumOfInstallment']).toBe('7');
  expect(active['frm0605:txtOthersName']).toBe('Other payment details');
 });

 it('prints 0605 investigating-office approval only for assessed or delinquent payments', () => {
  const values = {
   ...createWithholdingValues('0605', initialProfile),
   'frm0605:itemMannerOfPayment': 'Self-assessment',
   'frm0605:itemApprovedYN': 'Y'
  };
  const original = createWithholdingPrintModel('0605', values, printBindings).checks;
  expect(original['frm0605:itemApprovedYN:_1']).toBe(false);
  expect(original['frm0605:itemApprovedYN:_2']).toBe(false);
  for (const manner of ['Preliminary/final assessment / deficiency', 'Accounts receivable / delinquent account']) {
   const assessed = createWithholdingPrintModel('0605', { ...values, 'frm0605:itemMannerOfPayment': manner }, printBindings).checks;
   expect(assessed['frm0605:itemApprovedYN:_1']).toBe(true);
  }
  expect(values['frm0605:itemApprovedYN']).toBe('Y');
 });

 it.each([
  ['1604C', 'frm1604c:', compensationBindings],
  ['1604CF', 'frm1604cf:', annualCompensationBindings]
 ] as const)('%s prints the refund details only when funds were released', (code, prefix, bindings) => {
  const values = {
   ...createWithholdingValues(code, initialProfile),
   [prefix + 'refundDate']: '2025-02-27',
   [prefix + 'txt12']: '4321.00',
   [prefix + 'select13']: '02'
  };
  const inactive = createWithholdingPrintModel(code, values, bindings).text;
  const keys = ['txtRefMonth', 'txtRefDate', 'txtRefYear', 'txt12', 'select13'].map(key => prefix + key);
  expect(keys.map(key => inactive[key])).toEqual(['', '', '', '', '']);
  const active = createWithholdingPrintModel(code, { ...values, [prefix + 'releasedOfFunds']: 'Y' }, bindings).text;
  expect(keys.slice(0, 4).map(key => active[key])).toEqual(['02', '27', '2025', '4,321.00']);
  expect(active[prefix + 'select13']).toMatch(/February|02/i);
 });

 it('omits retained 1601F treaty rows and their amounts when tax relief does not apply', () => {
  const values = {
   ...createWithholdingValues('1601F', initialProfile),
   'frm1601F:optWithheld': 'Y',
   'frm1601F:treaty:1:code': 'TT01',
   'frm1601F:treaty:1:income': '1000.00',
   'frm1601F:treaty:1:rate': '5'
  };
  const inactive = createWithholdingPrintModel('1601F', values, finalWithholdingBindings);
  expect(inactive.treatyRows).toHaveLength(10);
  expect(inactive.treatyRows.flatMap(row => row.cells).every(cell => cell.value === '')).toBe(true);
  expect(inactive.text['frm1601F:txtTax15']).toBe('0.00');
  const active = createWithholdingPrintModel('1601F', { ...values, 'frm1601F:optRelief': 'Y' }, finalWithholdingBindings);
  expect(active.treatyRows[0].cells[0].value).toBe('TT01');
  expect(active.text['frm1601F:txtTax15']).toBe('50.00');
 });

 it('omits both regular and treaty rows in a 1601F PDF when no tax was withheld', () => {
  const values = {
   ...createWithholdingValues('1601F', initialProfile),
   'frm1601F:optRelief': 'Y',
   'frm1601F:txtAtcCode1': 'WI202',
   'frm1601F:txtTaxBase1': '1000.00',
   'frm1601F:treaty:1:income': '1000.00',
   'frm1601F:treaty:1:rate': '5'
  };
  const result = createWithholdingPrintModel('1601F', values, finalWithholdingBindings);
  expect(result.atcRows).toHaveLength(0);
  expect(result.treatyRows.flatMap(row => row.cells).every(cell => cell.value === '')).toBe(true);
  expect(result.text['frm1601F:txtTax15']).toBe('0.00');
 });

 it.each([
  ['0619E', expandedRemittanceBindings, ['txtTax14'], 'txtTax16'],
  ['0619F', finalRemittanceBindings, ['txtTax13', 'txtTax14'], 'txtTax17']
 ] as const)('%s excludes retained withholding amounts when No is selected', (code, bindings, amounts, total) => {
  const prefix = `frm${code}:`;
  const values = { ...createWithholdingValues(code, initialProfile), [prefix + 'optWithheld']: 'N' };
  for (const amount of amounts) values[prefix + amount] = '345.67';
  const inactive = createWithholdingPrintModel(code, values, bindings).text;
  expect(amounts.map(amount => [inactive[amount], inactive[amount + '_2']])).toEqual(amounts.map(() => ['', '']));
  expect([inactive[total], inactive[total + '_2']]).toEqual(['0', '00']);
  const active = createWithholdingPrintModel(code, { ...values, [prefix + 'optWithheld']: 'Y' }, bindings).text;
  expect(amounts.map(amount => [active[amount], active[amount + '_2']])).toEqual(amounts.map(() => ['345', '67']));
 });

 it('1606 prints transaction descriptions and details only for the matching transaction type', () => {
  const values = {
   ...createWithholdingValues('1606', initialProfile),
   'frm1606:transactionType': 'Cash sale',
   'frm1606:txtOthers20': 'Sample exemption',
   'frm1606:txtSelling': '2345.00',
   'frm1606:txtTotalN': '8'
  };
  const print = (transactionType: string) => createWithholdingPrintModel('1606', {
   ...values, 'frm1606:transactionType': transactionType
  }, propertyBindings).text;
  const fields = ['frm1606:txtOthers20', 'frm1606:txtSelling', 'frm1606:txtTotalN'];
  const detail = (transactionType: string) => fields.map(field => print(transactionType)[field]);
  expect(detail('Cash sale')).toEqual(['', '', '']);
  expect(detail('Exempt')).toEqual(['Sample exemption', '', '']);
  expect(detail('Installment sale')).toEqual(['', '2,345.00', '8']);
 });

 it('prints a 1606 refund mark only on a return with overremittance', () => {
  const values = {
   ...createWithholdingValues('1606', initialProfile),
   'frm1606:transactionType': 'Cash sale',
   'frm1606:overpaymentOption': 'Refund'
  };
  const mark = 'frm1606:opt37:_1';
  expect(createWithholdingPrintModel('1606', values, propertyBindings).checks[mark]).toBe(false);
  const amended = { ...values, 'frm1606:optAmend': 'Y', 'frm1606:txtLess': '500' };
  expect(createWithholdingPrintModel('1606', amended, propertyBindings).checks[mark]).toBe(true);
 });

 it.each(['', '1'])('leaves the special-law print field blank for No with saved value %j', (savedLaw) => {
  const values = createWithholdingValues('1601E', initialProfile);
  values['frm1601E:optRelief'] = 'N';
  values['frm1601E:j_id402'] = savedLaw;
  const html = render(Form1601EPrint, { props: { values } }).body;
  const law = html.match(/<span\b[^>]*id="frm1601E:j_id402"[^>]*>(.*?)<\/span>/s)?.[1];
  expect(law?.replace(/<!--.*?-->/gs, '')).toBe('');
  const no = html.match(/<input\b[^>]*id="frm1601E:j_id398:_2"[^>]*>/)?.[0];
  expect(no).toMatch(/\bchecked\b/);
 });
 it('prints the special law when tax relief is Yes', () => {
  const values = createWithholdingValues('1601E', initialProfile);
  values['frm1601E:optRelief'] = 'Y';
  const html = render(Form1601EPrint, { props: { values } }).body;
  const law = html.match(/<span\b[^>]*id="frm1601E:j_id402"[^>]*>(.*?)<\/span>/s)?.[1];
  expect(law?.replace(/<!--.*?-->/gs, '')).toBe('Special Law');
 });
 it('preserves source field sizes and distinguishes radios from checkboxes', () => {
  const values = createWithholdingValues('0605', initialProfile);
  const html = render(Form0605Print, { props: { values } }).body;
  const name = html.match(/<input\b[^>]*id="frm0605:txtTaxPayerName"[^>]*>/)?.[0];
  expect(name).toBeDefined();
  expect(name).toMatch(/\bsize="65"/);
  expect(name).toMatch(/\breadonly\b/);
  expect(name).toContain('data-print-control="text"');
  expect(name).toContain('wh-source-size-65');
  const calendar = html.match(/<input\b[^>]*id="frm0605:itemFiscalStartMonth:_1"[^>]*>/)?.[0];
  expect(calendar).toMatch(/\btype="radio"/);
  expect(calendar).toMatch(/\bdisabled\b/);
 });
 it('prints the selected month label instead of the raw numeric option value', () => {
  const values = createWithholdingValues('0605', initialProfile);
  values['frm0605:itemYearEndMonth'] = '12';
  const model = createWithholdingPrintModel('0605', values, printBindings);
  expect(model.text['frm0605:itemYearEndMonth']).toBe('12 - December');
 });
 it('preserves populated dynamic ATC amounts in native source-sized fields', () => {
  const values = createWithholdingValues('1601E', initialProfile);
  values['frm1601E:optWithheld'] = 'Y';
  values['frm1601E:txtAtcCode1'] = 'WI010';
  values['frm1601E:txtTaxBase1'] = '25000.00';
  const html = render(Form1601EPrint, { props: { values } }).body;
  const taxBase = html.match(/<input\b[^>]*id="frm1601E:txtTaxBase1"[^>]*>/)?.[0];
  expect(taxBase).toMatch(/\bsize="17"/);
  expect(taxBase).toContain('wh-source-size-17');
  expect(taxBase).toMatch(/\breadonly\b/);
  expect(taxBase).toMatch(/value="(?:25,000|25000)\.00"/);
 });
 it('keeps OCR artwork overlays as plain positioned text without widget borders', () => {
  const html = render(Form0619EPrint, { props: { values: createWithholdingValues('0619E', initialProfile) } }).body;
  expect(html).not.toContain('data-print-control="text"');
  expect(html).not.toMatch(/<input\b/);
 });
});
