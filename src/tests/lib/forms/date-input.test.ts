import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import { DateInput } from '$lib/components/ui/date-input';

describe('project date input', () => {
	it('uses the PCSTI segmented date control and preserves ISO calendar dates', () => {
		const html = render(DateInput, { props: { id: 'date-paid', label: 'Date paid', value: '2024-02-29', required: true } }).body;
		expect((html.match(/role="spinbutton"/g) ?? []).length).toBe(3);
		expect(html.includes('type="date"')).toBe(false);
		expect(html).toContain('aria-label="Open calendar"');
		expect(html).toContain('id="date-paid"');
		expect(html).toContain('value="02"');
		expect(html).toContain('value="29"');
		expect(html).toContain('value="2024"');
	});
	it('associates validation with all date segments and labels the field group', () => {
		const html = render(DateInput, { props: { id: 'due', label: 'Due date', value: '', error: 'Enter a valid due date.' } }).body;
		expect(html).toContain('Enter a valid due date.');
		expect((html.match(/aria-invalid="true"/g) ?? []).length).toBe(3);
		expect(html).toMatch(/role="group"[^>]*aria-labelledby="[^"]+"[^>]*aria-describedby="[^"]+"/);
	});
});
