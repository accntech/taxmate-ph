import { describe, expect, it } from 'vitest';
import { cloneFilterValues, filterPatch, toggleFilterValue, type FilterDescriptor } from '$lib/components/ui/pcsti/filter-types';

const status: FilterDescriptor = { id: 'status', label: 'Status', mode: 'multi', options: [{ value: 'active', label: 'Active' }, { value: 'archived', label: 'Archived' }] };
const category: FilterDescriptor = { id: 'category', label: 'Category', mode: 'single', options: [{ value: 'private', label: 'Private' }] };

describe('PCSTI staged filters', () => {
	it('keeps applied values unchanged while a draft is edited or discarded', () => {
		const values = { status: ['active'], category: 'private' };
		const draft = cloneFilterValues([status, category], values);
		draft.status = toggleFilterValue(status, draft.status, 'archived');
		expect(draft.status).toEqual(['active', 'archived']);
		expect(values.status).toEqual(['active']);
		expect(cloneFilterValues([status, category], values).status).toEqual(['active']);
	});
	it('applies one filter without touching the other section or sharing mutable arrays', () => {
		const draft = { status: ['active', 'archived'], category: 'private' };
		const patch = filterPatch(status, draft);
		expect(patch).toEqual({ status: ['active', 'archived'] });
		(patch.status as string[]).push('other');
		expect(draft.status).toEqual(['active', 'archived']);
	});
	it('supports clearing a single or multiple-choice selection', () => {
		expect(toggleFilterValue(category, 'private', 'private')).toBeNull();
		expect(toggleFilterValue(status, ['active'], 'active')).toEqual([]);
		expect(filterPatch(status, { status: [] })).toEqual({ status: [] });
	});
});

import { render } from 'svelte/server';
import FilterMenu from '$lib/components/ui/pcsti/filter-menu.svelte';
import FilterChip from '$lib/components/ui/pcsti/filter-chip.svelte';

describe('PCSTI filter presentation', () => {
	it('renders a labelled filter trigger without exposing staged choices before opening', () => {
		const { body } = render(FilterMenu, { props: { descriptors: [status], values: { status: ['active'] }, onapply: () => {} } });
		expect(body).toContain('aria-label="Add filter"');
		expect(body).toContain('aria-haspopup="menu"');
		expect(body).not.toContain('role="menuitemcheckbox"');
	});
	it('keeps the applied filter value readable and its clear action named', () => {
		const { body } = render(FilterChip, { props: { label: 'Status', value: 'Active', onclear: () => {} } });
		expect(body).toContain('Status:');
		expect(body).toContain('Active');
		expect(body).toContain('aria-label="Clear Status filter"');
	});
});
