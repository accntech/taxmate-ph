import { get1601EQATCs } from '$lib/forms/form-1601-eq/form-1601-eq-atcs';

/** RDO-copy wire format from the January 2018 1601-EQ installer form.
 * BIR-Form1601EQ.hta:1913-1972 serializes actual DOM control IDs and raw values.
 * Keep this separate from the escaped, logical-field savefile format in xml.ts.
 * UTF-8 is retained; the original Windows ANSI codepage is not established.
 */
export function serialize1601EQSubmissionXml(values: Record<string, string>): string {
	const records: [string, string | boolean][] = [];
	const field = (name: string) => values[`frm1601EQ:${name}`] ?? '';
	const add = (name: string, value: string | boolean) => records.push([`frm1601EQ:${name}`, value]);
	const text = (name: string, source = name) => add(name, field(source));
	const radio = (target: string, source: string, options: readonly string[]) => {
		for (const value of options) add(`${target}:${value}`, field(source) === value);
	};
	const money = (value: string, fallback = '0.00') => {
		if (!value) return fallback;
		const amount = Number(value.replace(/,/g, ''));
		if (!Number.isFinite(amount)) throw new Error('Invalid amount in 1601-EQ submission payload.');
		const [whole, cents] = amount.toFixed(2).split('.');
		return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${cents}`;
	};

	text('txtYear');
	for (let quarter = 1; quarter <= 4; quarter++) add(`optQuarter:${quarter}`, field('optQuarter') === `Q${quarter}`);
	radio('optAmend', 'optAmendedReturn', ['Y', 'N']);
	radio('optWithheld', 'optTaxesWithheld', ['Y', 'N']);
	add('txtNoSheets', field('txtSheetsAttached') || '0');
	for (const name of ['txtTIN1', 'txtTIN2', 'txtTIN3', 'txtBranchCode', 'txtRDOCode',
		'txtTaxpayerName', 'txtLineBus', 'txtAddress', 'txtAddress2', 'txtZipCode', 'txtTelNum']) text(name);
	radio('optCategory', 'optCategory', ['P', 'G']);
	records.push(['txtEmail', values.txtEmail ?? '']);

	// The original form creates six rows numbered 1..6 for printed items 13..18.
	for (let row = 1; row <= 6; row++) {
		const item = row + 12;
		const hasTax = field('optTaxesWithheld') === 'Y' && field(`txtATC${item}`) !== '';
		add(`txtAtcCd${row}`, hasTax ? field(`txtATC${item}`) : '');
		add(`txtTaxBase${row}`, hasTax ? money(field(`txtTaxBase${item}`), '') : '');
		add(`txtTaxRate${row}`, hasTax ? field(`txtTaxRate${item}`) : '');
		add(`txtTaxbeWithHeld${row}`, hasTax ? money(field(`txtTaxWithheld${item}`)) : '0.00');
	}
	add('txtTotalOtherTax', '0.00');
	const totals = [
		'txtTotalTaxesWithheld', 'txtRemittanceFirstMonth', 'txtRemittanceSecondMonth',
		'txtTaxRemittedPreviousReturn', 'txtOverremittancePreviousQuarter', 'txtTotalRemittances',
		'txtTaxStillDue', 'txtSurcharge', 'txtInterest', 'txtCompromise', 'txtTotalPenalties', 'txtTotalAmountDue'
	];
	for (const [index, source] of totals.entries()) add(`txtTax${index + 19}`, money(field(source)));
	for (const [control, choice] of [['ifRefund', 'refund'], ['ifIssueCert', 'certificate'], ['ifCarriedOver', 'carry']]) {
		add(control, field('overpaymentOption') === choice);
	}
	for (const name of ['txtTaxAgentNo', 'txtDateIssue', 'txtDateExpiry']) records.push([name, values[name] ?? '']);
	for (const row of [33, 34, 35, 36]) {
		if (row === 36) text('txtParticular36');
		for (const name of ['txtAgency', 'txtNumber', 'txtDate', 'txtAmount']) text(`${name}${row}`);
	}
	const selectedAtcs = new Set(Array.from({ length: 6 }, (_, index) =>
		field('optTaxesWithheld') === 'Y' ? field(`txtATC${index + 13}`) : ''
	));
	// The hidden selector is still part of frmMain.elements (changedrpATCList).
	for (const [index, code] of get1601EQATCs(field('optCategory')).entries()) {
		records.push([`AtcCode${index + 1}`, selectedAtcs.has(code)]);
	}
	records.push(['hPartIITableSize', '6'], ['txtFinalFlag', values.txtFinalFlag ?? '2'], ['txtEnroll', 'N']);
	// Text controls in unused legacy dialogs are serialized empty; passwords are excluded.
	for (const id of ['ebirOnlineConfirmUsername', 'ebirOnlineUsername', 'ebirOnlineSecret', 'driveSelectTPExport']) {
		records.push([id, '']);
	}
	const tab = '\n            '; // Original #xmlFormat contents.
	return "<?xml version='1.0'?>" + tab + records.map(([id, value]) =>
		`<div>${id}=${value}${id}=</div>${tab}`
	).join('') + tab + 'All Rights Reserved BIR 2012.0';
}
