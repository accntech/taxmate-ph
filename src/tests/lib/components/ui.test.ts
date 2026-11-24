import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import ToggleGroup from '$lib/components/ui/toggle-group/toggle-group.svelte';

describe('ui component primitives', () => {
	it('renders the selected toggle as pressed', () => {
		const { body } = render(ToggleGroup, { props: {
			ariaLabel: 'Row density',
			value: 'compact',
			options: [
				{ value: 'compact', label: 'Compact' },
				{ value: 'comfortable', label: 'Comfortable' }
			]
		} });
		expect(body).toMatch(/<button(?=[^>]*aria-label="Compact")(?=[^>]*aria-pressed="true")[^>]*>/);
		expect(body).toMatch(/<button(?=[^>]*aria-label="Comfortable")(?=[^>]*aria-pressed="false")[^>]*>/);
	});

	it('provides sidebar nav typing helpers', async () => {
		const { isParent } = await import('$lib/components/ui/types');

		expect(isParent({ label: 'Forms', children: [{ label: '1601EQ', href: '/forms' }] })).toBe(
			true
		);
		expect(isParent({ label: 'Suite', href: '/' })).toBe(false);
	});
});
