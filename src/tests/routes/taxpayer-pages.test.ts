import { render } from 'svelte/server';
import { beforeEach, describe, expect, it } from 'vitest';
import TaxpayerList from '../../routes/ebirforms/taxpayers/+page.svelte';

import { ebirformsWorkspace as workspace } from '$lib/ebirforms/ebirforms-workspace.svelte';
beforeEach(() => { workspace.profileLoadState = 'loaded'; });

describe('taxpayer list navigation', () => {
	it('links to a separate creation page without rendering an editor', () => {
		const { body } = render(TaxpayerList);
		expect(body).toContain('href="/ebirforms/taxpayers/new"');
		expect(body).not.toContain('<form');
		expect(body).not.toContain('TIN and branch code');
	});
	it('offers editing and forms for the saved taxpayer', () => {
		const { body } = render(TaxpayerList);
		expect(body).toContain('href="/ebirforms/taxpayers/1234567890000/edit"');
		expect(body).toContain('href="/ebirforms/taxpayers/1234567890000/forms"');
	});
});

 describe('taxpayer table presentation', () => {
  it('provides the reference table controls and semantic sortable headings', () => {
   const { body } = render(TaxpayerList);
   expect(body).toContain('<table');
   expect(body).toContain('Search taxpayers');
   expect(body).toContain('Add filter');
   expect(body).toContain('Columns');
   expect(body).toContain('aria-sort=');
   expect(body).toContain('Rows per page');
  });
 });
