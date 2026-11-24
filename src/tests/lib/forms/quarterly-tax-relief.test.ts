import { describe, expect, it } from 'vitest';
import { calculateQuarterly } from '../../../lib/forms/individual-income/quarterly';

const question = 'frm1701q:j_id217';
const relief = 'frm1701q:txtTaxRelief25';

describe('July 2008 quarterly tax relief', () => {
 it('clears a stale relief selection when an older draft answers No', () => {
  const values = { [question]: 'N', [relief]: '2', 'frm1701q:txt26A': '100000' };
  const result = calculateQuarterly('1701Q', values);
  expect(result[relief]).toBe('0');
  expect(result['frm1701q:txt26A']).toBe('100000');
  expect(values[relief]).toBe('2');
 });

 it('defaults an unselected Yes relief to the source Special Rate choice', () => {
  expect(calculateQuarterly('1701Q', { [question]: 'Y', [relief]: '0' })[relief]).toBe('1');
  expect(calculateQuarterly('1701Q', { [question]: 'Y', [relief]: '2' })[relief]).toBe('2');
 });

 it('keeps sparse legacy drafts and revised returns independent', () => {
  expect(calculateQuarterly('1701Q', { [relief]: '2' })[relief]).toBe('0');
  expect(calculateQuarterly('1701Qv2018', { [question]: 'N', [relief]: '2' })[relief]).toBe('2');
 });
});
