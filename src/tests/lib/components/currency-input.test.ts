import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import * as UI from '$lib/components/ui';
import { commitCurrencyInput, normalizeCurrencyInput, formatCurrencyInput } from '$lib/components/ui/currency-input/currency';

describe('currency input', () => {
 it('renders a labeled peso amount with grouping and two decimal places', () => {
  expect(UI).toHaveProperty('CurrencyInput');
  const body = render(UI.CurrencyInput, { props: { id: 'tax-base', label: 'Tax base', value: '100000', required: true } }).body;
  expect(body).toContain('value="100,000.00"');
  expect(body).toContain('₱');
  expect(body).toContain('for="tax-base"');
  expect(body).toContain('inputmode="decimal"');
 });
 it('retains malformed text and associates an immediate error', () => {
  expect(UI).toHaveProperty('CurrencyInput');
  const body = render(UI.CurrencyInput, { props: { id: 'tax-base', label: 'Tax base', value: '10,00.00' } }).body;
  expect(body).toContain('value="10,00.00"');
  expect(body).toContain('aria-invalid="true"');
  expect(body).toContain('Enter an amount such as 1,234.56');
 });
 it('keeps format guidance when filing validation also rejects the amount', () => {
  const body = render(UI.CurrencyInput, { props: { value: '10,00.00', error: 'Enter a tax base greater than zero.' } }).body;
  expect(body.includes('Enter an amount such as 1,234.56')).toBe(true);
 });
});


describe('currency text normalization', () => {
 it('accepts properly grouped pesos and retains decimal text without floating point conversion', () => {
  expect(normalizeCurrencyInput('₱ 1,234,567.89')).toBe('1234567.89');
  expect(normalizeCurrencyInput('0.00')).toBe('0.00');
  expect(normalizeCurrencyInput('')).toBe('');
  expect(formatCurrencyInput('0')).toBe('0.00');
 });
 it('does not remove arbitrary characters or malformed separators', () => {
  for (const value of ['1,00', '12,34,567', '1junk', '-1', '₱', '12.', 'Infinity']) {
   expect(normalizeCurrencyInput(value)).toBeNull();
   expect(formatCurrencyInput(value)).toBe(value);
  }
 });
});


describe('currency editing commit', () => {
 it('preserves canonical precision at decimal rounding boundaries', () => {
  for (const [value, display] of [['1.005', '1.01'], ['2.675', '2.68'], ['1,234.005', '1,234.01']]) {
   const canonical = normalizeCurrencyInput(value)!;
   expect(formatCurrencyInput(value)).toBe(display);
   expect(commitCurrencyInput(value)).toBe(canonical);
   expect(formatCurrencyInput(commitCurrencyInput(value))).toBe(display);
  }
 });
 it('preserves unfinished and malformed input on blur', () => {
  for (const value of ['', '12.', '1,00', 'junk']) expect(commitCurrencyInput(value)).toBe(value);
 });
});
