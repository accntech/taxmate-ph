import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Form1601EQ from '$lib/forms/form-1601-eq/form-1601-eq.svelte';
import { getFormDefinition } from '$lib/forms';
import { RadioGroup } from '$lib/components/ui';

function markup(overrides: Record<string, string> = {}) {
	return render(Form1601EQ, { props: { definition: getFormDefinition('1601EQ')!, values: {
		'frm1601EQ:optCategory': 'P', 'frm1601EQ:txtYear': '2026', 'frm1601EQ:optQuarter': 'Q1',
		'frm1601EQ:optTaxesWithheld': 'N', 'frm1601EQ:optAmendedReturn': 'N', ...overrides
	} } }).body;
}
describe('1601EQ preparation', () => {
	it('omits print, export, and taxpayer controls from the preparation form', () => {
		const body = markup({ 'frm1601EQ:txtTaxpayerName': 'Example taxpayer' });
		expect(body.includes('Print &amp; export')).toBe(false);
		expect(body.includes('Export PDF')).toBe(false);
		expect(body.includes('Taxpayer details')).toBe(false);
		expect(body.includes('TIN and branch code')).toBe(false);
		expect(body.includes('Example taxpayer')).toBe(false);
		expect(body.includes('Return period')).toBe(true);
	});
	it('uses currency controls for money and a separate whole-number attachment count', () => {
		const body = markup({ 'frm1601EQ:optTaxesWithheld': 'Y', 'frm1601EQ:txtATC13': 'WI120', 'frm1601EQ:txtTaxBase13': '100000' });
		expect(body).toContain('data-slot="currency-input"');
		expect(body).toContain('value="100,000.00"');
		expect(body).toContain('id="frm1601EQ:txtTaxBase13"');
		expect(body).toContain('inputmode="numeric"');
	});
	it('does not present an invalid amount as a calculated zero', () => {
		const body = markup({ 'frm1601EQ:optTaxesWithheld': 'Y', 'frm1601EQ:txtATC13': 'WI120', 'frm1601EQ:txtTaxBase13': 'oops' });
		expect(body).toContain('Correct the amounts to calculate the total.');
		expect(body).not.toContain('₱ 0.00');
	});
	it('gives repeated ATC fields a semantic row group', () => {
		const body = markup({ 'frm1601EQ:optTaxesWithheld': 'Y' });
		expect(body).toMatch(/<fieldset[^>]*aria-label="ATC row 1"/);
	});
	it('hides ATC entry on a nil return', () => {
		expect(markup().includes('Tax Base')).toBe(false);
	});
	it('hides previous return payment unless amended', () => {
		expect(markup().includes('Previously filed return')).toBe(false);
		expect(markup({ 'frm1601EQ:optAmendedReturn': 'Y' })).toContain('Previously filed return');
	});
	it('shows a single initial ATC row and preserves imported later rows', () => {
		const initial = markup({ 'frm1601EQ:optTaxesWithheld': 'Y' });
		expect(initial.match(/aria-label="ATC row /g)).toHaveLength(1);
		const imported = markup({ 'frm1601EQ:optTaxesWithheld': 'Y', 'frm1601EQ:txtATC18': 'WI010', 'frm1601EQ:txtTaxBase18': '1000', 'frm1601EQ:txtTaxRate18': '5' });
		expect(imported).toContain('WI010');
		expect(imported).toContain('aria-label="ATC row 6"');
	});
	it('only exposes previous quarter credits after Q1', () => {
		expect(markup().includes('Over-remittance from previous quarter')).toBe(false);
		expect(markup({ 'frm1601EQ:optQuarter': 'Q2' })).toContain('Over-remittance from previous quarter');
	});
	it('renders calculated withholding and exposes over-remittance disposition', () => {
		const body = markup({ 'frm1601EQ:optTaxesWithheld': 'Y', 'frm1601EQ:txtATC13': 'WI120', 'frm1601EQ:txtTaxBase13': '100000', 'frm1601EQ:txtTaxRate13': '2', 'frm1601EQ:txtRemittanceFirstMonth': '2500' });
		expect(body).toMatch(/<output[^>]*id="frm1601EQ:txtTaxWithheld13"[^>]*>₱2,000.00<\/output>/);
		expect(body).toContain('-₱500.00');
		expect(body).toContain('Apply over-remittance as');
	});
	it('keeps unanswered choices unselected instead of assigning a radio default', () => {
		const body = markup({ 'frm1601EQ:optQuarter': '', 'frm1601EQ:optAmendedReturn': '', 'frm1601EQ:optTaxesWithheld': '' });
		const radios = body.match(/<input[^>]*type="radio"[^>]*>/g) || [];
		expect(radios).toHaveLength(4);
		expect(radios.some(radio => /\schecked(?:\s|>|=)/.test(radio))).toBe(false);
		expect(body).toContain('Select an option');
	});
	it('associates radio validation with the group and keeps the legacy focus target', () => {
		const body = render(RadioGroup, { props: {
			id: 'frm1601EQ:optQuarter', label: 'Quarter', value: '', required: true,
			options: [{ value: 'Q1', label: 'Q1' }, { value: 'Q2', label: 'Q2' }], error: 'Choose a quarter.'
		} }).body;
		const description = body.match(/<fieldset[^>]*aria-describedby="([^"]+)"/)?.[1];
		expect(description).toBeTruthy();
		expect(body).toMatch(/<fieldset[^>]*aria-invalid="true"/);
		expect(body).toContain(`id="${description}"`);
		expect(body).toContain('Choose a quarter.');
		expect(body).toMatch(/<input[^>]*id="frm1601EQ:optQuarter"[^>]*type="radio"/);
	});
});
