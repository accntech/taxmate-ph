import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import AtcPicker from '$lib/forms/atc-picker.svelte';

describe('ATC picker', () => {
 it('uses the exact withholding template catalog instead of the 1601EQ catalog', () => {
  const { body } = render(AtcPicker, { props: { id: 'atc-pt', value: 'WB030', category: 'G', formCode: '1600PTv2018', onchange: () => {} } });
  expect(body).toContain('role="combobox"');
  expect(body.includes('TAX ON CARRIERS AND KEEPERS OF GARAGES')).toBe(true);
 });
 it('keeps the selected income description available without opening the picker', () => {
  const { body } = render(AtcPicker, { props: { id: 'atc-13', value: 'WI120', category: 'P', onchange: () => {} } });
  expect(body).toContain('INCOME PAYMENTS TO CERTAIN CONTRACTORS');
  expect(body).toContain('role="combobox"');
  expect(body).toContain('id="atc-13"');
  expect(body).toContain('for="atc-13"');
 });
 it('keeps imported unknown codes visible and associates validation feedback', () => {
  const { body } = render(AtcPicker, { props: { id: 'atc-13', value: 'WX999', category: 'P', error: 'Choose an available ATC.', onchange: () => {} } });
  expect(body).toMatch(/<button[^>]*role="combobox"[^>]*>[\s\S]*?WX999[\s\S]*?<\/button>/);
  expect(body).toContain('Choose an available ATC.');
  expect(body).toContain('aria-invalid="true"');
  expect(body).toContain('aria-describedby="atc-13-error"');
 });
});
