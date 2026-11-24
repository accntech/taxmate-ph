import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import TimeInput from '$lib/components/ui/time-input/time-input.svelte';

describe('time input', () => {
	it('shows a 12-hour clock and submits a 24-hour form value', () => {
		const { body } = render(TimeInput, { props: { name: 'time', value: '13:04' } });
		expect(body).toContain('aria-label="Hour"');
		expect(body).toContain('aria-valuenow="1"');
		expect(body).toContain('aria-label="Minute"');
		expect(body).toContain('aria-valuenow="4"');
		expect(body).toContain('aria-valuetext="PM"');
		expect(body).toMatch(/<input(?=[^>]*type="hidden")(?=[^>]*name="time")(?=[^>]*value="13:04")[^>]*>/);
	});

	it('submits an empty string for an empty time', () => {
		const { body } = render(TimeInput, { props: { name: 'time', value: '' } });
		expect(body).toMatch(/<input(?=[^>]*type="hidden")(?=[^>]*name="time")(?=[^>]*value="")[^>]*>/);
	});
});
