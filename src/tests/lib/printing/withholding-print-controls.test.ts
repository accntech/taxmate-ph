import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import Form0605Print, { printBindings } from '$lib/forms/printing/form-0605-print.svelte';
import Form1601EPrint from '$lib/forms/printing/form-1601e-print.svelte';
import Form0619EPrint from '$lib/forms/printing/form-0619e-print.svelte';
import { createWithholdingValues } from '$lib/forms/withholding-rules';
import { createWithholdingPrintModel } from '$lib/printing/withholding-print-model';
import { initialProfile } from '$lib/ebirforms/ebirforms-workspace.svelte';

describe('source-native withholding print controls', () => {
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
