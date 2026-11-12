import { normalizeCurrencyInput } from '$lib/components/ui/currency-input/currency';
import { isPackagedRdoCode } from '$lib/profiles/rdo-codes';
import { get1601EQATCs, get1601EQRate, malformed1601EQATCs } from './form-1601-eq-atcs';

/** Rules traced to docs/research/ebirforms-v7.9.6.0/withholding/1601eq.md.
 * Packaged ATC membership does not establish current-law applicability of a rate.
 */
export const form1601EQRows = [13, 14, 15, 16, 17, 18] as const;
export const form1601EQPaymentFields = [
	'txtRemittanceFirstMonth', 'txtRemittanceSecondMonth',
	'txtTaxRemittedPreviousReturn', 'txtOverremittancePreviousQuarter'
] as const;
export const form1601EQPenaltyFields = ['txtSurcharge', 'txtInterest', 'txtCompromise'] as const;
export const form1601EQOverpaymentOptions = [
	{ value: 'refund', label: 'To be refunded' },
	{ value: 'certificate', label: 'Tax credit certificate' },
	{ value: 'carry', label: 'Carry over to the next quarter' }
] as const;

const id = (name: string) => `frm1601EQ:${name}`;
const text = (values: Record<string, string>, name: string) => (values[id(name)] ?? '').trim();

function numeric(value: string | undefined): number {
	const candidate = normalizeCurrencyInput(value ?? '');
	if (candidate === null || candidate === '') return 0;
	const amount = Number(candidate);
	return Number.isFinite(amount) ? amount : 0;
}

function cents(amount: number): number {
	return Math.round((amount + Number.EPSILON) * 100);
}

function paymentApplies(values: Record<string, string>, name: string): boolean {
	if (name === 'txtTaxRemittedPreviousReturn') return text(values, 'optAmendedReturn') === 'Y';
	// Item 23 is explicitly limited to the previous quarter of the same taxable year.
	if (name === 'txtOverremittancePreviousQuarter') return text(values, 'optQuarter') !== 'Q1';
	return true;
}

export function calculate1601EQ(values: Record<string, string>): Record<string, string> {
	const result = { ...values };
	let withheldCents = 0;
	const withheld = text(values, 'optTaxesWithheld') === 'Y';
	for (const row of form1601EQRows) {
		const active = withheld && text(values, `txtATC${row}`) !== '';
		const rate = active ? get1601EQRate(text(values, `txtATC${row}`), text(values, 'optCategory'), Number(text(values, 'txtYear'))) : undefined;
		// Rate is selected by the ATC catalogue, as in the original selector. Imported
		// or manually altered rate fields cannot change the resulting tax computation.
		if (active) {
			result[id(`txtTaxRate${row}`)] = rate ?? '';
			const base = normalizeCurrencyInput(values[id(`txtTaxBase${row}`)] ?? '');
			if (base !== null) result[id(`txtTaxBase${row}`)] = base;
		}
		const rowCents = active
			? cents(numeric(values[id(`txtTaxBase${row}`)]) * numeric(rate) / 100)
			: 0;
		if (text(values, 'optTaxesWithheld') === 'N') {
			result[id(`txtATC${row}`)] = '';
			result[id(`txtTaxBase${row}`)] = '';
			result[id(`txtTaxRate${row}`)] = '';
		}
		result[id(`txtTaxWithheld${row}`)] = (rowCents / 100).toFixed(2);
		withheldCents += rowCents;
	}
	let remittanceCents = 0;
	for (const name of form1601EQPaymentFields) {
		const amountCents = paymentApplies(values, name) ? cents(numeric(values[id(name)])) : 0;
		result[id(name)] = (amountCents / 100).toFixed(2);
		remittanceCents += amountCents;
	}
	let penaltyCents = 0;
	for (const name of form1601EQPenaltyFields) {
		const amountCents = cents(numeric(values[id(name)]));
		result[id(name)] = (amountCents / 100).toFixed(2);
		penaltyCents += amountCents;
	}
	const dueCents = withheldCents - remittanceCents;
	result[id('txtTotalTaxesWithheld')] = (withheldCents / 100).toFixed(2);
	result[id('txtTotalRemittances')] = (remittanceCents / 100).toFixed(2);
	result[id('txtTaxStillDue')] = (dueCents / 100).toFixed(2);
	result[id('txtTotalPenalties')] = (penaltyCents / 100).toFixed(2);
	result[id('txtTotalAmountDue')] = ((dueCents + penaltyCents) / 100).toFixed(2);
	if (dueCents + penaltyCents >= 0) result[id('overpaymentOption')] = '';
	result[id('txtSheetsAttached')] = text(values, 'txtSheetsAttached') || '0';
	return result;
}

/** Final-copy/submission validation. Drafts may retain incomplete periods and fields. */
export function validate1601EQ(values: Record<string, string>, now = new Date()): Record<string, string> {
	const errors: Record<string, string> = {};
	const required: Record<string, string> = {
		txtTIN1: 'TIN', txtTIN2: 'TIN', txtTIN3: 'TIN', txtBranchCode: 'Branch code',
		txtRDOCode: 'RDO code', txtTaxpayerName: 'Taxpayer name', txtAddress: 'Registered address',
		txtZipCode: 'ZIP code', txtTelNum: 'Contact number'
	};
	for (const [name, label] of Object.entries(required)) {
		if (!text(values, name)) errors[id(name)] = `${label} is required. Update the taxpayer details.`;
	}
	for (const name of ['txtTIN1', 'txtTIN2', 'txtTIN3']) {
		if (text(values, name) && !/^\d{3}$/.test(text(values, name))) errors[id(name)] = 'Enter three digits for each TIN segment.';
	}
	if (text(values, 'txtBranchCode') && !/^\d{4}$/.test(text(values, 'txtBranchCode'))) {
		errors[id('txtBranchCode')] = 'Enter the four-digit branch code used by the taxpayer profile.';
	}
	if (text(values, 'txtRDOCode') && !isPackagedRdoCode(text(values, 'txtRDOCode'))) {
		errors[id('txtRDOCode')] = 'Enter a supported RDO code, such as 040 or 17A. Update the taxpayer details.';
	}
	// Enforce the packaged input handlers at final validation too, including imports.
	if (text(values, 'txtZipCode') && !/^\d{1,12}$/.test(text(values, 'txtZipCode'))) {
		errors[id('txtZipCode')] = 'Enter a ZIP code using up to 12 digits. Update the taxpayer details.';
	}
	if (text(values, 'txtTelNum') && !/^\d{1,20}$/.test(text(values, 'txtTelNum'))) {
		errors[id('txtTelNum')] = 'Enter a contact number using up to 20 digits. Update the taxpayer details.';
	}
	const email = (values.txtEmail ?? '').trim();
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.txtEmail = 'Enter a valid email address in the taxpayer details.';
	for (const [name, allowed] of [
		['optAmendedReturn', ['Y', 'N']], ['optTaxesWithheld', ['Y', 'N']], ['optCategory', ['P', 'G']]
	] as const) {
		if (!(allowed as readonly string[]).includes(text(values, name))) errors[id(name)] = 'Choose an option.';
	}
	// Shift to Philippine civil time, independent of the desktop computer's timezone.
	const manila = new Date(now.getTime() + 8 * 60 * 60 * 1000);
	const currentYear = manila.getUTCFullYear();
	const currentMonth = manila.getUTCMonth();
	const yearText = text(values, 'txtYear');
	const year = Number(yearText);
	if (!/^\d{4}$/.test(yearText) || year < 2018 || year > currentYear) {
		errors[id('txtYear')] = `Enter a year from 2018 to ${currentYear}.`;
	}
	const quarterText = text(values, 'optQuarter');
	if (!/^Q[1-4]$/.test(quarterText)) errors[id('optQuarter')] = 'Choose a quarter.';
	else if (year === currentYear && Number(quarterText.slice(1)) * 3 > currentMonth) {
		errors[id('optQuarter')] = 'The quarter must end before you finalize or submit this return.';
	}
	const sheets = text(values, 'txtSheetsAttached');
	if (sheets && !/^\d{1,2}$/.test(sheets)) {
		errors[id('txtSheetsAttached')] = 'Enter a whole number of attached sheets from 0 to 99, using at most two digits.';
	}
	for (const name of [...form1601EQPaymentFields, ...form1601EQPenaltyFields]) {
		if (!paymentApplies(values, name)) continue;
		const amount = text(values, name);
		if (amount && normalizeCurrencyInput(amount) === null) errors[id(name)] = 'Enter a valid amount, zero or greater.';
	}
	if (text(values, 'optTaxesWithheld') === 'Y') {
		const activeRows = form1601EQRows.filter((row) =>
			['txtATC', 'txtTaxBase', 'txtTaxRate'].some((name) => text(values, `${name}${row}`) !== '')
		);
		if (!activeRows.some((row) => text(values, `txtATC${row}`))) errors[id('txtATC13')] = 'Add at least one ATC for taxes withheld.';
		for (const row of activeRows) {
			const atc = text(values, `txtATC${row}`);
			if (!/^W[IC]\d{3}$/.test(atc)) errors[id(`txtATC${row}`)] = 'Enter an expanded withholding ATC, such as WI010 or WC010.';
			else if ((malformed1601EQATCs as readonly string[]).includes(atc)) {
				errors[id(`txtATC${row}`)] = 'This ATC has malformed packaged reference data. Verify it against current BIR guidance before filing.';
			} else if (!get1601EQATCs(text(values, 'optCategory')).includes(atc)) {
				errors[id(`txtATC${row}`)] = 'Choose a 1601EQ ATC available for this withholding-agent category.';
			}
			const base = text(values, `txtTaxBase${row}`);
			if (normalizeCurrencyInput(base) === null || numeric(base) <= 0) errors[id(`txtTaxBase${row}`)] = 'Enter a tax base greater than zero.';
			// The matching catalogue entry supplies the rate; no user-entered rate is required.
		}
	}
	const total = Number(calculate1601EQ(values)[id('txtTotalAmountDue')]);
	if (total < 0 && !form1601EQOverpaymentOptions.some((option) => option.value === text(values, 'overpaymentOption'))) {
		errors[id('overpaymentOption')] = 'Choose how the over-remittance will be treated.';
	}
	if (total < 0 && quarterText === 'Q4' && text(values, 'overpaymentOption') === 'carry') {
		errors[id('overpaymentOption')] = 'Carry-over is limited to another quarter of the same taxable year. Choose a refund or tax credit certificate for the fourth quarter.';
	}
	return errors;
}
