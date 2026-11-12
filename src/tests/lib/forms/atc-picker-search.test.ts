import { describe, expect, it } from 'vitest';

import { filterATCOptions } from '$lib/forms/atc-picker';

describe('ATC search', () => {
 it('finds an income description as well as a case-insensitive code', () => {
  expect(filterATCOptions('P', 'certain contractors').map(item => item.value)).toContain('WI120');
  expect(filterATCOptions('P', 'wi120').map(item => item.value)).toEqual(['WI120']);
 });
 it('retains an imported selected code but never introduces codes from another category', () => {
  expect(filterATCOptions('P', '', 'WX999').map(item => item.value)).toContain('WX999');
  expect(filterATCOptions('G', 'WI820').map(item => item.value)).not.toContain('WI820');
 });
});
