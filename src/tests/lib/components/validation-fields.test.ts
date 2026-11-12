import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import { Input, Select, Textarea } from '$lib/components/ui';

describe('accessible validation fields', () => {
	it('associates a long-form field error with its labeled textarea', () => {
		const { body } = render(Textarea, { props: {
			id: 'registered-address', label: 'Registered address', required: true,
			value: '', error: 'Enter the registered address.'
		} });
		expect(body).toMatch(/<label\b[^>]*for="registered-address"/);
		expect(body).toMatch(/<textarea\b[^>]*id="registered-address"/);
		expect(body).toContain('aria-invalid="true"');
		const descriptionId = body.match(/aria-describedby="([^"]+)"/)?.[1];
		expect(descriptionId).toBeTruthy();
		expect(body).toContain(`id="${descriptionId}"`);
		expect(body).toContain('Enter the registered address.');
	});
	it('uses an explicit stable selector ID for error-summary navigation', () => {
		const { body } = render(Select, { props: {
			id: 'return-quarter', label: 'Quarter', value: '', options: [{ value: 'Q1', label: 'Q1' }]
		} });
		expect(body).toContain('id="return-quarter"');
		expect(body).toContain('for="return-quarter"');
	});
	it('marks required inputs and associates their error with the control', () => {
		const { body } = render(Input, {
			props: {
				label: 'Taxpayer name',
				required: true,
				error: 'Enter the taxpayer name.'
			}
		});
		expect(body).toContain('Enter the taxpayer name.');
		expect(body).toContain('aria-invalid="true"');
		const descriptionId = body.match(/aria-describedby="([^"]+)"/)?.[1];
		expect(descriptionId).toBeTruthy();
		expect(body).toContain(`id="${descriptionId}"`);
		expect(body).toContain('aria-hidden="true">*</span>');
	});
	it('marks required category selectors and exposes their error', () => {
		const { body } = render(Select, {
			props: {
				label: 'Category',
				value: '',
				options: [{ value: 'P', label: 'Private' }],
				required: true,
				error: 'Choose a category.'
			}
		});
		expect(body).toContain('Choose a category.');
		expect(body).toContain('aria-required="true"');
		expect(body).toContain('aria-invalid="true"');
		const descriptionId = body.match(/aria-describedby="([^"]+)"/)?.[1];
		expect(descriptionId).toBeTruthy();
		expect(body).toContain(`id="${descriptionId}"`);
		expect(body).toContain('aria-hidden="true">*</span>');
	});
});
