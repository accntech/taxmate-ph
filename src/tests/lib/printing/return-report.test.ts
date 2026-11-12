import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Form1601EQPrint from '$lib/forms/printing/form-1601-eq-print.svelte';
import { calculate1601EQ } from '$lib/forms/form-1601-eq/form-1601-eq-rules';

describe('BIR 1601EQ print layout', () => {
	it('restores the BIR sections with escaped values and calculated totals', () => {
		const html = render(Form1601EQPrint, { props: { values: calculate1601EQ({
			'frm1601EQ:txtTaxpayerName': '<script>unsafe</script>',
			'frm1601EQ:txtYear': '2026', 'frm1601EQ:optCategory': 'P',
			'frm1601EQ:optQuarter': 'Q2', 'frm1601EQ:optTaxesWithheld': 'Y',
			'frm1601EQ:txtATC13': 'WI120', 'frm1601EQ:txtTaxBase13': '100000',
			'frm1601EQ:txtTaxRate13': '99', 'frm1601EQ:txtTotalAmountDue': '999'
		}) } }).body;
		expect(html).toContain('&lt;script>unsafe&lt;/script>');
		expect(html).not.toContain('<script>');
		expect(html).toContain('1601-EQ');
		expect(html).toContain('Quarterly Remittance Return');
		expect(html).toContain('Machine Validation/Revenue Official Receipt Details');
		expect(html).toContain('1601EQ_p1.png');
		expect(html).toContain('value="100000"');
		expect(html).toContain('value="2000.00"');
		expect(html).not.toContain('Return details');
	});
});
