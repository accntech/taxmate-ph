import { describe, expect, it } from 'vitest';
import { serialize1601EQSubmissionXml } from '$lib/legacy/submission-xml';
import { serializeLegacyXml } from '$lib/legacy/xml';
import { get1601EQATCs } from '$lib/forms/form-1601-eq/form-1601-eq-atcs';
import fixture from './fixtures/1601eq-rdo.json';
import expected from './fixtures/1601eq-rdo.xml?raw';

describe('1601EQ installer RDO payload', () => {
	it('matches the original serializer replay for an amended return with raw special characters', () => {
		expect(serialize1601EQSubmissionXml(fixture.appValues)).toBe(expected);
	});
	it('maps quarter, category, nil withholding and overpayment choices to original checkbox/radio IDs', () => {
		const xml = serialize1601EQSubmissionXml({ ...fixture.appValues,
			'frm1601EQ:optQuarter': 'Q4', 'frm1601EQ:optAmendedReturn': 'N',
			'frm1601EQ:optTaxesWithheld': 'N', 'frm1601EQ:optCategory': 'G',
			'frm1601EQ:overpaymentOption': 'certificate', txtFinalFlag: '2'
		});
		for (const [id, value] of Object.entries({
			'frm1601EQ:optQuarter:2': false, 'frm1601EQ:optQuarter:4': true,
			'frm1601EQ:optAmend:Y': false, 'frm1601EQ:optAmend:N': true,
			'frm1601EQ:optWithheld:Y': false, 'frm1601EQ:optWithheld:N': true,
			'frm1601EQ:optCategory:P': false, 'frm1601EQ:optCategory:G': true,
			'frm1601EQ:ifRefund': false, 'frm1601EQ:ifIssueCert': true, 'frm1601EQ:ifCarriedOver': false
		})) expect(xml).toContain(`<div>${id}=${value}${id}=</div>`);
	});
	it('excludes app-only, hidden and password values while preserving Unicode text', () => {
		const xml = serialize1601EQSubmissionXml({ ...fixture.appValues,
			'frm1601EQ:txtTaxpayerName': 'PEÑA & SONS', appOnly: 'APP_SENTINEL',
			'frm1601EQ:inputSurcharge': 'HIDDEN_SENTINEL', ebirOnlinePassword: 'PASSWORD_SENTINEL'
		});
		expect(xml).toContain('PEÑA & SONS');
		expect(xml).not.toMatch(/APP_SENTINEL|HIDDEN_SENTINEL|PASSWORD_SENTINEL/);
		expect(xml).not.toContain('&amp;');
	});
	it('keeps the existing escaped savefile format separate', () => {
		expect(serializeLegacyXml({ txtName: 'ACME & CO' })).toContain('ACME &amp; CO');
	});
	it('uses the original category-specific ATC checkbox order and clears nil-return rows', () => {
		for (const category of ['P', 'G'] as const) {
			expect(get1601EQATCs(category)).toEqual(fixture.originalAtcCodes[category]);
			const xml = serialize1601EQSubmissionXml({ ...fixture.appValues,
				'frm1601EQ:optCategory': category, 'frm1601EQ:optTaxesWithheld': 'N' });
			expect(xml.match(/<div>AtcCode\d+=false/g)).toHaveLength(fixture.originalAtcCodes[category].length);
			expect(xml).toContain('<div>frm1601EQ:txtAtcCd1=frm1601EQ:txtAtcCd1=</div>');
			expect(xml).toContain('<div>frm1601EQ:txtTaxBase1=frm1601EQ:txtTaxBase1=</div>');
			expect(xml).toContain('<div>frm1601EQ:txtTaxbeWithHeld1=0.00frm1601EQ:txtTaxbeWithHeld1=</div>');
		}
	});
});
