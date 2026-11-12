import { render } from 'svelte/server';
import { expect, it } from 'vitest';
import ReturnErrors from '$lib/forms/return-errors.svelte';
import { getFormDefinition } from '$lib/forms';

it('routes taxpayer errors to the profile editor when profile controls are omitted', () => {
	const { body } = render(ReturnErrors, { props: {
		definition: getFormDefinition('1601EQ')!,
		errors: { 'frm1601EQ:txtTaxpayerName': 'Enter a taxpayer name.' },
		taxpayerHref: '/ebirforms/taxpayers/example/edit'
	} });
	expect(body.includes('href="/ebirforms/taxpayers/example/edit"')).toBe(true);
});

it('links each error to its field and identifies repeated ATC rows', () => {
	const { body } = render(ReturnErrors, { props: {
		definition: getFormDefinition('1601EQ')!,
		errors: {
			'frm1601EQ:txtTaxBase14': 'Enter a tax base greater than zero.',
			'frm1601EQ:optQuarter': 'Choose a quarter.'
		}
	} });
	expect(body.includes('href="#frm1601EQ%3AtxtTaxBase14"')).toBe(true);
	expect(body.includes('ATC row 2 · Tax base')).toBe(true);
	expect(body.includes('Quarter')).toBe(true);
});
