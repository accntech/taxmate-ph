import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Input from '$lib/components/ui/input/input.svelte';

describe('PCSTI input composition', () => {
	it('associates its separate label with the supplied native control id', () => {
		const { body } = render(Input, {
			props: { id: 'profile-name', label: 'Taxpayer name', required: true }
		});
		expect(body).toMatch(/<label\b[^>]*for="profile-name"/);
		expect(body).toMatch(/<input\b[^>]*id="profile-name"/);
	});

	it('exposes the source-derived native input slot for composition', () => {
		const { body } = render(Input, { props: { label: 'Taxpayer name', value: 'Sample' } });
		expect(body).toMatch(/<input\b[^>]*data-slot="input"/);
		expect(body).toContain('value="Sample"');
	});
});
