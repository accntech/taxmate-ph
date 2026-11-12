import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import TinInput from '$lib/components/ui/tin-input/tin-input.svelte';
import { formatTinValue, getTinDigits } from '$lib/components/ui/tin-input/tin';

describe('TIN input', () => {
	it('formats nine TIN and four branch digits without changing the branch', () => {
		expect(formatTinValue('1234567890007')).toBe('123-456-789-0007');
		expect(getTinDigits('123-456-789-0007')).toBe('1234567890007');
	});
	it('preserves a five-digit branch in the input and rendered field', () => {
		expect(getTinDigits('001-002-003-12345')).toBe('00100200312345');
		expect(formatTinValue('00100200312345')).toBe('001-002-003-12345');
		const { body } = render(TinInput, { props: { value: '00100200312345' } });
		expect(body).toContain('value="001-002-003-12345"');
		expect(body).toContain('maxlength="17"');
	});
	it('retains incomplete TINs instead of inventing a branch code', () => {
		expect(formatTinValue('123456789')).toBe('123-456-789');
		expect(formatTinValue('12345678900')).toBe('123-456-789-00');
		expect(formatTinValue('')).toBe('');
	});
	it('renders a labeled numeric text field with leading zeros and validation', () => {
		const { body } = render(TinInput, { props: {
			id: 'tin', label: 'TIN and branch code', value: '0010020030004', error: 'Check this TIN.'
		} });
		expect(body).toContain('value="001-002-003-0004"');
		expect(body).toContain('for="tin"');
		expect(body).toContain('inputmode="numeric"');
		expect(body).toContain('aria-invalid="true"');
		expect(body).toContain('aria-describedby=');
		expect(body).toContain('Check this TIN.');
	});
});
