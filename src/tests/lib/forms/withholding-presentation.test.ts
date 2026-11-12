import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import WithholdingEditor from '$lib/forms/withholding-editor.svelte';
import type { WithholdingDefinition } from '$lib/forms/withholding-definitions';
import { getWithholdingDefinition, withholdingDefinitions, withholdingRowCountKey } from '$lib/forms/withholding-definitions';
import { createWithholdingValues } from '$lib/forms/withholding-rules';

const definition = {
	code: '0619E', title: 'Monthly remittance', revision: 'standalone', period: 'month',
	prefix: 'frm0619E:', yearField: 'frm0619E:txtYear', totalField: 'frm0619E:txtTax18', source: '0619e.md',
	sections: [
		{ id: 'period', title: 'Return period', fields: [
			{ id: 'frm0619E:txtYear', label: 'Year', type: 'number', required: true },
			{ id: 'frm0619E:txtSheets', label: 'Sheets attached', type: 'number', group: 'attachments' },
			{ id: 'frm0619E:optAmended', label: 'Amended return?', type: 'select', options: [{ value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }] }
		] },
		{ id: 'taxpayer', title: 'Taxpayer details', fields: [{ id: 'frm0619E:txtTaxpayerName', label: 'Taxpayer name', type: 'text', profileKey: 'taxpayerName' }] },
		{ id: 'computation', title: 'Tax remittance', fields: [
			{ id: 'frm0619E:txtTax14', label: '14 Taxes withheld', type: 'money' },
			{ id: 'frm0619E:txtTax15', label: '15 Previously remitted', type: 'money', group: 'credits', showWhen: { field: 'frm0619E:optAmended', value: 'Y' } },
			{ id: 'frm0619E:txtTax17A', label: 'Surcharge', type: 'money', group: 'penalties' },
			{ id: 'frm0619E:txtTax18', label: '18 Total amount due', type: 'money', readonly: true }
		] }
	],
	schedules: [{ id: 'payments', title: 'Remittance schedule', rows: [{ id: 'january', label: 'January', fields: [
		{ id: 'payment-date', label: 'Remittance date', type: 'date' },
		{ id: 'payment-amount', label: 'Amount remitted', type: 'money' }
	] }] }]
} satisfies WithholdingDefinition;
const values = { 'frm0619E:txtYear': '2026', 'frm0619E:txtTaxpayerName': 'Sample <taxpayer>', 'frm0619E:optAmended': 'N', 'frm0619E:txtTax14': '10000', 'frm0619E:txtTax18': '10300.00', 'payment-date': '2026-01-10', 'payment-amount': '1000' };

describe('withholding form presentation', () => {
	it('omits printed item numbers from editor and summary labels', () => {
		const html = render(WithholdingEditor, { props: { definition, values } }).body;
		expect(html.includes('14 Taxes withheld')).toBe(false);
		expect(html.includes('18 Total amount due')).toBe(false);
		expect(html).toContain('Taxes withheld');
		expect(html).toContain('Total amount due');
	});
	it('summarizes annual schedule aggregates without inventing a grand amount due or repeating row totals', () => {
		const source = getWithholdingDefinition('1604C')!;
		const html = render(WithholdingEditor, { props: { definition: source, values: createWithholdingValues(source.code) } }).body;
		expect(html.includes('eq-amount-due')).toBe(false);
		const summary = html.slice(html.indexOf('<aside'));
		expect((summary.match(/Total remitted/g) ?? []).length).toBe(1);
		expect(summary).toContain('Remittances');
	});
	it('reuses the 1601EQ layout and collapsible credits, penalties and attachments', () => {
		const html = render(WithholdingEditor, { props: { definition, values: { ...values, 'frm0619E:optAmended': 'Y' } } }).body;
		expect(html.includes('class="eq-layout"')).toBe(true);
		expect(html.includes('class="eq-fields"')).toBe(true);
		expect(html.includes('eq-section eq-disclosure')).toBe(true);
		expect(html).toContain('Remittances and credits');
		expect(html).toContain('Penalties');
		expect(html).toContain('Attachments');
		expect(html).toContain('class="eq-totals"');
	});
	it('starts a repeatable schedule with an empty state and a draft editor action', () => {
		const source = getWithholdingDefinition('1601E')!;
		const html = render(WithholdingEditor, { props: { definition: source, values: {} } }).body;
		expect(html).toContain('No line items yet');
		expect(html).toContain('aria-label="Add line item to Computation by ATC"');
		expect(html).not.toContain('id="frm1601E:txtAtcCode1"');
		expect(html).not.toContain('id="frm1601E:txtAtcCode2"');
	});
	for (const source of withholdingDefinitions) {
		it(`renders editor for exact template ${source.code}`, () => {
			const initial = createWithholdingValues(source.code);
			const editor = render(WithholdingEditor, { props: { definition: source, values: initial } }).body;
			expect(editor.includes('undefined')).toBe(false);
			expect(editor.includes('Testing only.')).toBe(false);
		});
	}
	it('offers repeatable schedule rows and renders preserved rows beyond the initial ten', () => {
		const source = getWithholdingDefinition('1601E')!;
		const countKey = withholdingRowCountKey(source, 'atc');
		const html = render(WithholdingEditor, { props: { definition: source, values: { [countKey]: '11', 'frm1601E:txtAtcCode11': 'WI120', 'frm1601E:txtTaxBase11': '100000' } } }).body;
		expect(html).toContain('aria-label="Add line item to Computation by ATC"');
		expect(html).toContain('aria-label="Computation by ATC line items"');
		expect(html).toContain('WI120');
		expect(html).toContain('100,000.00');
		expect(html).toContain('aria-label="Edit line item 1"');
	});
	it('groups source fields without duplicating taxpayer profile details or a testing banner', () => {
		const html = render(WithholdingEditor, { props: { definition, values, taxpayerHref: '/taxpayer/edit' } }).body;
		expect(html).toContain('Return period');
		expect(html).toContain('Tax remittance');
		expect(html.includes('Sample &lt;taxpayer>')).toBe(false);
		expect(html.includes('Taxpayer details')).toBe(false);
		expect(html.includes('href="/taxpayer/edit"')).toBe(false);
		expect(html.includes('Testing only.')).toBe(false);
		expect(html).not.toMatch(/<input[^>]*id="frm0619E:txtTaxpayerName"/);
		expect(html).toContain('data-slot="currency-input"');
		expect(html).toMatch(/<output[^>]*id="frm0619E:txtTax18"/);
		expect(html).not.toContain('Previously remitted');
	});
	it('shows conditional fields and links inline errors to the correct input', () => {
		const html = render(WithholdingEditor, { props: { definition, values: { ...values, 'frm0619E:optAmended': 'Y' }, errors: { 'frm0619E:txtTax14': 'Enter a valid amount.' } } }).body;
		expect(html).toContain('Previously remitted');
		expect(html).toContain('Enter a valid amount.');
		expect(html).toMatch(/<input[^>]*id="frm0619E:txtTax14"[^>]*aria-invalid="true"/);
		expect(html).toContain('aria-label="Remittance schedule line items"');
		expect(html).toContain('January');
		expect(html).toContain('aria-label="Edit line item 1"');
	});
});
