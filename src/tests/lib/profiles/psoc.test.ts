import { describe, expect, it } from 'vitest';
import { describePsoc, psocOptions } from '$lib/profiles/psoc';

describe('PSOC catalog', () => {
	it('offers unique four-digit codes with occupation titles', () => {
		const occupations = psocOptions.filter(option => option.value !== '');
		expect(new Set(occupations.map(option => option.value)).size).toBe(occupations.length);
		expect(occupations.every(option => /^\d{4}$/.test(option.value) && !!option.label.trim())).toBe(true);
		expect(occupations.find(option => option.value === '2411')?.label).toMatch(/^Accountants$/i);
	});

	it('displays the occupation title without discarding unlisted saved codes', () => {
		expect(describePsoc('0110')).toMatch(/^0110 · Commissioned Armed Forces Officers$/i);
		expect(describePsoc('0123')).toBe('0123');
		expect(describePsoc(undefined)).toBe('');
	});
});
