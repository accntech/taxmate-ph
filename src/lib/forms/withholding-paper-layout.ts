import type { TaxpayerProfile } from '$lib/profiles/profile';

export type TaxpayerItemKey = 'tin' | keyof TaxpayerProfile;
type ItemNumbers = Record<string, string>;

type PaperLayout = {
	number: string;
	title: string;
	revision: string;
	subtitle?: string;
	englishAgency?: boolean;
	period: ItemNumbers;
	taxpayer: Partial<Record<TaxpayerItemKey, string>>;
	background: ItemNumbers;
	computation?: string;
	fixedAtc?: { item: string; inPeriod?: boolean };
	inlineSchedules?: Record<string, string>;
	scheduleItems?: Record<string, readonly [number, number]>;
	schedulePart?: string;
};

// Visible references follow the generated forms. The definitions own all field IDs and rules.
const legacyMonth = { txtMonth: '1', txtYear: '1', optAmend: '2', txtSheets: '3', optWithheld: '4' };
const revisedMonth = { txtMonth: '1', txtYear: '1', optAmend: '2', optWithheld: '3', txtSheets: '4' };
const revisedQuarter = { txtYear: '1', optQuarter: '2', optAmend: '3', optWithheld: '4', txtSheets: '5' };
const annual = { txtYear: '1', optAmend: '2', txtSheets: '3' };
const transaction = { date: '1', optAmend: '2', txtSheets: '3', optWithheld: '4' };

const legacyTaxpayer = { tin: '5', rdoCode: '6', lineOfBusiness: '7', taxpayerName: '8', contactNumber: '9', address: '10', zipCode: '11', category: '12' };
const monthlyTaxpayer = { tin: '5', rdoCode: '6', taxpayerName: '7', address: '8', zipCode: '8A', contactNumber: '9', category: '10', email: '11' };
const quarterlyTaxpayer = { tin: '6', rdoCode: '7', taxpayerName: '8', address: '9', zipCode: '9A', contactNumber: '10', category: '11', email: '12' };
const annualTaxpayer = { tin: '4', rdoCode: '5', taxpayerName: '6', address: '7', zipCode: '7A', category: '8', contactNumber: '9', email: '10' };
const legacyAnnualTaxpayer = { tin: '4', rdoCode: '5', lineOfBusiness: '6', taxpayerName: '7', contactNumber: '8', address: '9', zipCode: '10', category: '11' };

const monthlyReturn = 'Monthly Remittance Return';
const quarterlyReturn = 'Quarterly Remittance Return';
const annualReturn = 'Annual Information Return';
const compensation = 'of Income Taxes Withheld on Compensation';
const expandedAnnual = 'of Creditable Income Taxes Withheld (Expanded) / Income Payments Exempt from Withholding Tax';
const schedulePart = 'Part IV · Schedules';
const atcComputation = { atc: '' };
const revisedRelief = { optRelief: '13', reliefDescription: '13A' };
const legacyRelief = { optRelief: '13', reliefDescription: '13' };
const revisedAnnual = { title: annualReturn, period: annual, taxpayer: annualTaxpayer, englishAgency: true, computation: 'Summary of Remittances' };

const layouts: Record<string, PaperLayout> = {
	1600: {
		number: '1600', title: monthlyReturn, subtitle: 'of Value-Added Tax and Other Percentage Taxes Withheld',
		revision: 'September 2005 (ENCS)', period: legacyMonth, taxpayer: legacyTaxpayer,
		background: { optRelief: '13', selTreaty: '13' }, inlineSchedules: atcComputation
	},
	'1600PTv2018': {
		number: '1600-PT', title: monthlyReturn, subtitle: 'of Other Percentage Taxes Withheld', revision: 'January 2018',
		period: revisedMonth, taxpayer: monthlyTaxpayer, background: { optRelief: '12', reliefDescription: '12A' },
		englishAgency: true, inlineSchedules: atcComputation, scheduleItems: { atc: [13, 17] }, schedulePart: 'Schedule 1 · Monthly Alphalist of Payees'
	},
	'1600VTv2018': {
		number: '1600-VT', title: monthlyReturn, subtitle: 'of Value-Added Tax Withheld', revision: 'January 2018',
		period: revisedMonth, taxpayer: monthlyTaxpayer, background: { optRelief: '12', reliefDescription: '12A' },
		englishAgency: true, inlineSchedules: atcComputation, scheduleItems: { atc: [13, 17] }, schedulePart: 'Schedule 1 · Monthly Alphalist of Payees'
	},
	'1600WP': {
		number: '1600-WP', title: 'Remittance Return of Percentage Tax',
		subtitle: 'on Winnings and Prizes Withheld by Race Track Operators', revision: 'January 2010 (ENCS)',
		period: transaction, taxpayer: { tin: '5', rdoCode: '6', category: '7', taxpayerName: '8', address: '9', zipCode: '10' },
		background: {}, inlineSchedules: atcComputation
	},
	'1601C': {
		number: '1601-C', title: monthlyReturn, subtitle: compensation, revision: 'July 2008 (ENCS)',
		period: legacyMonth, taxpayer: legacyTaxpayer, background: legacyRelief, fixedAtc: { item: '14' },
		schedulePart: 'Section A · Adjustment of Taxes Withheld on Compensation'
	},
	'1601Cv2018': {
		number: '1601-C', title: monthlyReturn, subtitle: compensation, revision: 'January 2018 (ENCS)', englishAgency: true,
		period: revisedMonth, taxpayer: quarterlyTaxpayer, background: revisedRelief, fixedAtc: { item: '5', inPeriod: true }, schedulePart
	},
	'1601E': {
		number: '1601-E', title: monthlyReturn, subtitle: 'of Creditable Income Taxes Withheld (Expanded)',
		revision: 'September 2007 (ENCS)', period: legacyMonth, taxpayer: legacyTaxpayer,
		background: { optRelief: '13', j_id402: '13' }, inlineSchedules: atcComputation
	},
	'1601F': {
		number: '1601-F', title: monthlyReturn, subtitle: 'of Final Income Taxes Withheld', revision: 'September 2005 (ENCS)',
		period: legacyMonth, taxpayer: legacyTaxpayer, background: legacyRelief, inlineSchedules: atcComputation
	},
	'1601FQ': {
		number: '1601-FQ', title: quarterlyReturn, subtitle: 'of Final Income Taxes Withheld', revision: 'January 2018',
		period: revisedQuarter, taxpayer: quarterlyTaxpayer, background: revisedRelief, englishAgency: true,
		inlineSchedules: atcComputation, scheduleItems: { atc: [14, 19] }, schedulePart
	},
	1602: {
		number: '1602', title: 'Monthly Remittance Return of Final Income Taxes Withheld',
		subtitle: 'On Interest Paid on Deposits and Yield on Deposit Substitutes/Trusts/Etc.', revision: 'August 2001 (ENCS)',
		period: legacyMonth, taxpayer: legacyTaxpayer, background: legacyRelief,
		inlineSchedules: { interest: 'txt26', 'interest-treaty': 'txt29', 'interest-preferential': 'txt32' },
		scheduleItems: { interest: [14, 25], 'interest-treaty': [27, 28], 'interest-preferential': [30, 31] }
	},
	'1602Qv2018': {
		number: '1602-Q', title: quarterlyReturn, subtitle: 'of Final Taxes Withheld on Interest Paid on Deposits and Deposit Substitutes/Trusts/Etc.',
		revision: 'January 2018', period: revisedQuarter, taxpayer: quarterlyTaxpayer, background: revisedRelief, englishAgency: true, schedulePart
	},
	1603: {
		number: '1603', title: 'Quarterly Remittance Return of Final Income Taxes Withheld',
		subtitle: 'On Fringe Benefits Paid to Employees Other than Rank and File', revision: 'November 2004 (ENCS)',
		period: { txtYear: '1', optQuarter: '2', monthsCovered: '3', optAmend: '4', optWithheld: '5' },
		taxpayer: { tin: '6', rdoCode: '7', lineOfBusiness: '8', taxpayerName: '9', contactNumber: '10', address: '11', zipCode: '12', category: '13' },
		background: { optRelief: '14', reliefDescription: '14' }, inlineSchedules: { fringe: '' }, scheduleItems: { fringe: [15, 17] }
	},
	'1603Qv2018': {
		number: '1603-Q', title: quarterlyReturn, subtitle: 'of Final Income Taxes Withheld on Fringe Benefits Paid to Employees Other Than Rank and File',
		revision: 'January 2018 (ENCS)', period: revisedQuarter, taxpayer: quarterlyTaxpayer, background: revisedRelief,
		englishAgency: true, schedulePart: 'Part IV · Details of Taxes Withheld'
	},
	'1604C': {
		...revisedAnnual, number: '1604-C', subtitle: compensation, revision: 'January 2018',
		background: { topAgent: '8A', releasedOfFunds: '11', refundDate: '11A', txt12: '12', select13: '13' },
		computation: 'Summary of Remittances per BIR Form No. 1601-C'
	},
	'1604CF': {
		number: '1604-CF', title: annualReturn, subtitle: 'of Income Taxes Withheld on Compensation and Final Withholding Taxes',
		revision: 'July 2008 (ENCS)', period: annual, taxpayer: { ...legacyAnnualTaxpayer, category: '14' },
		background: { releasedOfFunds: '11', refundDate: '11', txt12: '12', select13: '13' }, computation: 'Summary of Remittances'
	},
	'1604E': {
		number: '1604-E', title: annualReturn, subtitle: expandedAnnual, revision: 'July 1999 (ENCS)',
		period: annual, taxpayer: legacyAnnualTaxpayer, background: {}, computation: 'Summary of Remittances'
	},
	'1604Ev2018': {
		...revisedAnnual, number: '1604-E', subtitle: expandedAnnual, revision: 'January 2018 (ENCS)', background: { topAgent: '8A' }
	},
	'1604F': {
		...revisedAnnual, number: '1604-F', subtitle: 'of Income Payments Subjected to Final Withholding Taxes',
		revision: 'January 2018', background: { topAgent: '8A', optRelief: '11', reliefDescription: '11A' }
	},
	1606: {
		number: '1606', title: 'Withholding Tax Remittance Return',
		subtitle: 'For Onerous Transfer of Real Property Other than Capital Asset (Including Taxable and Exempt)', revision: 'July 1999 (ENCS)',
		period: transaction, taxpayer: { tin: '5', rdoCode: '6', taxpayerName: '9', address: '11', category: '14' },
		background: { sellerTin: '7', sellerRdo: '8', txtSellerName: '10', sellerAddress: '12', atc: '13' }
	}
};

type SupportingPage = { title: string; schedules: string[] } | { title: string; reference: string[] };

// The printed form owns the page breaks, including pages with reference material only.
const monthlyPayees = { title: 'Monthly alphalist of payees', schedules: ['payees'] };
const treaty = { title: 'Tax treaty withholding', schedules: ['treaty'] };
const supportingPages: Partial<Record<string, SupportingPage[]>> = {
	'1600PTv2018': [monthlyPayees],
	'1600VTv2018': [monthlyPayees],
	'1601Cv2018': [{ title: 'Adjustments for previous months', schedules: ['adjustments'] }],
	'1601F': [treaty],
	'1601FQ': [treaty],
	'1602': [{ title: 'Interest expense per books', schedules: ['interest-books'] }],
	'1602Qv2018': [
		{ title: 'Details of taxes withheld', schedules: ['interest', 'interest-treaty', 'interest-preferential'] },
		{ title: 'Reference tables', reference: ['Schedule 5 · Tax treaty codes', 'Schedule 6 · Investment promotion agencies'] }
	],
	'1603Qv2018': [{ title: 'Fringe benefits tax computation', schedules: ['fringe'] }],
	'1604Ev2018': [{ title: 'Alphalist schedules', reference: [
		'Schedule 3 · Payees subject to expanded withholding tax',
		'Schedule 4 · Other payees whose payments are exempt from withholding'
	] }],
	'1604F': [{ title: 'Alphalist schedules', reference: [
		'Schedule 4 · Payees subject to final withholding tax',
		'Schedule 5 · Employees who received fringe benefits',
		'Schedule 6 · Other payees whose payments are exempt from withholding'
	] }]
};

export function getWithholdingSupportingPages(code: string) {
	return supportingPages[code] ?? [];
}

export function getWithholdingPaperLayout(code: string): PaperLayout {
	const layout = layouts[code];
	if (!layout) throw new Error(`Missing paper layout for BIR Form ${code}`);
	return layout;
}

export function compareFormItems(a: string, b: string): number {
	return a.localeCompare(b, 'en', { numeric: true });
}
