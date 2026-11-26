import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import WithholdingEditor from '$lib/forms/withholding-editor.svelte';
import type { WithholdingDefinition } from '$lib/forms/withholding-definitions';
import { getWithholdingDefinition, withholdingDefinitions, withholdingRowCountKey } from '$lib/forms/withholding-definitions';
import { initialProfile } from '$lib/ebirforms/ebirforms-workspace.svelte';
import { createWithholdingValues } from '$lib/forms/withholding-rules';

const definition = {
	code: '1601E', title: 'Monthly remittance', revision: 'standalone', period: 'month',
	prefix: 'frm1601E:', yearField: 'frm1601E:txtYear', totalField: 'frm1601E:txtTax18', source: '1601e.md',
	sections: [
		{ id: 'period', title: 'Return period', fields: [
			{ id: 'frm1601E:txtYear', label: 'Year', type: 'number', required: true },
			{ id: 'frm1601E:txtSheets', label: 'Sheets attached', type: 'number', group: 'attachments' },
			{ id: 'frm1601E:optAmend', label: 'Amended return?', type: 'select', options: [{ value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }] }
		] },
		{ id: 'taxpayer', title: 'Taxpayer details', fields: [{ id: 'frm1601E:txtTaxpayerName', label: 'Taxpayer name', type: 'text', profileKey: 'taxpayerName' }] },
		{ id: 'computation', title: 'Tax remittance', fields: [
			{ id: 'frm1601E:txtTax14', label: '14 Taxes withheld', type: 'money' },
			{ id: 'frm1601E:txtTax15', label: '15 Previously remitted', type: 'money', group: 'credits', showWhen: { field: 'frm1601E:optAmend', value: 'Y' } },
			{ id: 'frm1601E:txtTax17A', label: 'Surcharge', type: 'money', group: 'penalties' },
			{ id: 'frm1601E:txtTax18', label: '18 Total amount due', type: 'money', readonly: true }
		] }
	],
	schedules: [{ id: 'payments', title: 'Remittance schedule', rows: [{ id: 'january', label: 'January', fields: [
		{ id: 'payment-date', label: 'Remittance date', type: 'date' },
		{ id: 'payment-amount', label: 'Amount remitted', type: 'money' }
	] }] }]
} satisfies WithholdingDefinition;
const values = { 'frm1601E:txtYear': '2026', 'frm1601E:txtTaxpayerName': 'Sample <taxpayer>', 'frm1601E:optAmend': 'N', 'frm1601E:txtTax14': '10000', 'frm1601E:txtTax18': '10300.00', 'payment-date': '2026-01-10', 'payment-amount': '1000' };

function renderEditor(definition: WithholdingDefinition, values: Record<string, string>, errors: Record<string, string> = {}) {
	return render(WithholdingEditor, {
		props: { definition, values, errors, profile: initialProfile, taxpayerHref: '/taxpayer/edit', onvaluechange: () => {} }
	}).body;
}

describe('withholding form presentation', () => {
	it('omits printed item numbers from editor and summary labels', () => {
		const html = renderEditor(definition, values);
		expect(html.includes('14 Taxes withheld')).toBe(false);
		expect(html.includes('18 Total amount due')).toBe(false);
		expect(html).toContain('Taxes withheld');
		expect(html).toContain('Total amount due');
	});
	it('summarizes annual schedule aggregates without inventing a grand amount due or repeating row totals', () => {
		const source = getWithholdingDefinition('1604C')!;
		const html = renderEditor(source, createWithholdingValues(source.code));
		expect(html.includes('eq-amount-due')).toBe(false);
		const summary = html.slice(html.indexOf('<aside'));
		expect((summary.match(/Total remitted/g) ?? []).length).toBe(1);
		expect(summary).toContain('Compensation');
	});
	it('groups the numbered return period before taxpayer and computation fields', () => {
		const html = renderEditor(definition, { ...values, 'frm1601E:optAmend': 'Y' });
		expect(html).toContain('paper-sheet');
		expect(html.indexOf('Return period')).toBeLessThan(html.indexOf('Part I · Background Information'));
		expect(html.indexOf('Part I · Background Information')).toBeLessThan(html.indexOf('Part II · Computation of Tax'));
		expect(html.indexOf('frm1601E:txtTax14')).toBeLessThan(html.indexOf('Previously remitted'));
		expect(html.indexOf('Previously remitted')).toBeLessThan(html.indexOf('Surcharge'));
		expect(html).toContain('Sheets attached');
	});
	it('starts a repeatable schedule with an empty state and a draft editor action', () => {
		const source = getWithholdingDefinition('1601E')!;
		const html = renderEditor(source, { 'frm1601E:optWithheld': 'Y' });
		expect(html).toContain('No items added');
		expect(html).toContain('aria-label="Add line item to Computation by ATC"');
		expect(html).not.toContain('id="frm1601E:txtAtcCode1"');
		expect(html).not.toContain('id="frm1601E:txtAtcCode2"');
	});
	for (const source of withholdingDefinitions.filter(source => !['0605', '0619E', '0619F'].includes(source.code))) {
		it(`renders editor for exact template ${source.code}`, () => {
			const initial = createWithholdingValues(source.code);
			const editor = renderEditor(source, initial);
			expect(editor.includes('undefined')).toBe(false);
			expect(editor.includes('Testing only.')).toBe(false);
		});
	}
	it('offers repeatable schedule rows and renders preserved rows beyond the initial ten', () => {
		const source = getWithholdingDefinition('1601E')!;
		const countKey = withholdingRowCountKey(source, 'atc');
		const html = renderEditor(source, { [countKey]: '11', 'frm1601E:txtAtcCode11': 'WI120', 'frm1601E:txtTaxBase11': '100000' });
		expect(html).toContain('aria-label="Add line item to Computation by ATC"');
		expect(html).toContain('aria-label="Computation by ATC line items"');
		expect(html).toContain('WI120');
		expect(html).toContain('100,000.00');
		expect(html).toContain('aria-label="Edit line item 1"');
	});
	it('groups source fields without duplicating taxpayer profile details or a testing banner', () => {
		const html = renderEditor(definition, values);
		expect(html).toContain('Return period');
		expect(html).toContain('Part II · Computation of Tax');
		expect(html).toContain('Sample &lt;taxpayer>');
		expect(html).toContain('href="/taxpayer/edit"');
		expect(html.includes('Testing only.')).toBe(false);
		expect(html).not.toMatch(/<input[^>]*id="frm1601E:txtTaxpayerName"/);
		expect(html).toContain('data-slot="currency-input"');
		expect(html).toMatch(/<output[^>]*id="frm1601E:txtTax18"/);
		expect(html).not.toContain('Previously remitted');
	});
	it('shows conditional fields and links inline errors to the correct input', () => {
		const html = renderEditor(definition, { ...values, 'frm1601E:optAmend': 'Y' }, { 'frm1601E:txtTax14': 'Enter a valid amount.' });
		expect(html).toContain('Previously remitted');
		expect(html).toContain('Enter a valid amount.');
		expect(html).toMatch(/<input[^>]*id="frm1601E:txtTax14"[^>]*aria-invalid="true"/);
		expect(html).toContain('aria-label="Remittance schedule line items"');
		expect(html).toContain('January');
		expect(html).toContain('aria-label="Edit line item 1"');
	});
});
