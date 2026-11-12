import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import NumberInput from '$lib/components/ui/number-input/number-input.svelte';
import { numberInputError } from '$lib/components/ui/number-input/number';

describe('number input', () => {
	it('validates integer quantities and bounds without coercing invalid text', () => {
		expect(numberInputError('2026', { min: 1900, max: 9999 })).toBe('');
		expect(numberInputError('', { min: 1900 })).toBe('');
		expect(numberInputError('12.5')).toBe('Enter a whole number.');
		expect(numberInputError('1e3')).toBe('Enter a whole number.');
		expect(numberInputError('-1', { min: 0 })).toBe('Enter a number of 0 or more.');
		expect(numberInputError('100', { max: 99 })).toBe('Enter a number of 99 or less.');
		expect(numberInputError('12.', { decimal: true })).toBe('Enter a valid number.');
		expect(numberInputError('12.5', { decimal: true })).toBe('');
	});
	it('renders string-backed quantities with a visible label and bound feedback', () => {
		const { body } = render(NumberInput, { props: {
			id: 'sheets', label: 'Sheets attached', value: '-2', min: 0
		} });
		expect(body).toContain('value="-2"');
		expect(body).toContain('for="sheets"');
		expect(body).toContain('inputmode="numeric"');
		expect(body).toContain('aria-invalid="true"');
		expect(body).toContain('Enter a number of 0 or more.');
	});
});
