import { philippineCalendarDate } from '../../filing-calendar';
import { corporateDateIso } from '../dates';
import type { CorporateField, CorporateForm, CorporatePage, CorporateValues } from '../types';
import legacyPages from './1702ex-pages.json';
import revisedPages from './1702exv2018-pages.json';
import createPages from './1702exv2018c-pages.json';
import { legacyScheduleTotals } from './schedule-totals';
import { normalizeLegacyExemptIdentification, validateLegacyExemptIdentification } from './identification';
export { legacyExemptIdentificationFields, legacyExemptIdentificationPatch } from './identification';
import {
	exemptAdditionalExemptIncome, exemptAdditionalFinalTax, exemptContinuations, exemptRepeatablePages,
	expandExemptPages, rollupExemptDetails, validateExemptDetails
} from './repeatables';

const field = (key: string) => `frm1702EX:${key}`;
const year = field('txtPg1I2YearEnd');
const month = field('ddlPg1I2Date');
const period = field('rdoPg1I1');
const shortPeriod = field('rdoPg1I4ShortPeriod');
const filing = field('rdoPg1I3Amended');
const atc = field('rdoPg1I5ATC');
const deduction = field('rdoPg1Pt1I13MethodOfDeduc');
const legacyDeduction = field('rdoPg1Pt1I15ItemizedDeduction');
const overpayment = field('rdoPg1Overpayment');
const yearEndMonth = (values: CorporateValues) => values[period] !== 'F' && values[shortPeriod] !== 'Y' ? '12' : values[month];
const amount = (values: CorporateValues, key: string) => Number((values[field(key)] ?? '').replaceAll(',', '').replace(/^\((.+)\)$/, '-$1')) || 0;
const whole = (value: number) => value.toFixed(0);
const list = (prefix: string, keys: string[]) => keys.map(key => prefix + key);
const legacyTotals = [...legacyScheduleTotals, {
	outputs: ['txtPg7Sc9I19TotalFinalTax'],
	inputs: list('txtPg7Sc9I', ['1InterestsC3', '2RoyaltiesC3', '3DividendsC3', '4PrizesC3', '9FinalTaxC1', '9FinalTaxC2', '15FinalTaxC1', '15FinalTaxC2', '18FinalTaxC1', '18FinalTaxC2'])
}, {
	outputs: ['txtPg7Sc10I8TotalIncome'],
	inputs: list('txtPg7Sc10I', ['1ReturnofPremium', '5ActualAmountC1', '5ActualAmountC2', '7ActualAmountC1', '7ActualAmountC2'])
}];

function normalizePeriod(values: CorporateValues): CorporateValues {
	const result = { ...values };
	if (/^\d{2}$/.test(result[year] ?? '')) result[year] = `20${result[year]}`;
	if (yearEndMonth(result)) result[month] = yearEndMonth(result);
	return result;
}

function calculateLegacy(values: CorporateValues): CorporateValues {
	const result = normalizePeriod(values);
	result[legacyDeduction] = 'Y';
	normalizeLegacyExemptIdentification(result);
	for (const { inputs, outputs } of legacyTotals) {
		const total = inputs.reduce((sum, term) => term.startsWith('-') ? sum - amount(result, term.slice(1)) : sum + amount(result, term), 0);
		for (const output of outputs) result[field(output)] = whole(total);
	}
	const operation = amount(result, 'txtPg2Pt4I31NetSales') - amount(result, 'txtPg2Pt4I32LessCost');
	const gross = operation + amount(result, 'txtPg2Pt4I34AddOther');
	const special = amount(result, 'txtPg2Pt4I37SpecialAllowable');
	const itemized = amount(result, 'txtPg2Pt4I36OrdinaryAllowable') + special;
	const net = gross - itemized;
	const relief = Math.max(0, Number(whole(net * 0.30)));
	const specialRelief = Number(whole(special * 0.30));
	if (result[atc] === 'IC021') {
		result[field('chkPg6S8Partners')] = 'Y';
		result[field('chkPg6S8StockHolders')] = 'N';
		result[field('chkPg6S8MembersInfo')] = 'N';
	} else if (result[atc] === 'IC011') {
		result[field('chkPg6S8Partners')] = 'N';
		result[field('chkPg6S8StockHolders')] = 'Y';
	}
	for (const [key, value] of Object.entries({
		txtPg2Pt4I33GrossIncome: operation,
		txtPg2Pt4I35TotalGross: gross,
		txtPg2Pt4I38TotalItemized: itemized,
		txtPg2Pt4I39NetTaxable: net,
		txtPg2Pt4I41TotalIncome: 0,
		txtPg2Pt5I42RegularIncome: relief,
		txtPg2Pt5I43SpecialAllowable: specialRelief,
		txtPg2Pt5I44TotalTax: relief + specialRelief,
		txtPg1Pt2I20TotalIncome: 0,
		txtPg1Pt2I22TotalAmount: amount(result, 'txtPg1Pt2I21AddPenalty')
	})) result[field(key)] = whole(value);
	return result;
}

const ordinaryDeductions = [
	...list('txtPg3Pt6S1I', [
		'1Ammortization', '2BadDebts', '3CharitableContrib', '4Depletion', '5Depreciation', '6EntertainmentAmuseRecreate',
		'7FringeBenefits', '8Interest', '9Losses', '10PensionTrust', '11Rental', '12RnD', '13SalaryWageAllowance',
		'14SssGsisPHealthHDMFOthers', '15TaxAndLicense', '16TranspoAndTravel', '17aJanitorAndMessengerServ',
		'17bProfessionalFee', '17cSecurityServices'
	]),
	...list('txtPg3Pt6I17Others', ['DAmt', 'EAmt', 'FAmt', 'GAmt', 'HAmt', 'IAmt'])
];
const taxCredits = list('txtPg2Pt4I', [
	'42PriorYearExcessCr', '43IncomeTaxPmtFromPreviousQrt', '44CreditableTaxWithheldFromPrevQrt', '45CreditableTaxWithheldFor4thQrt',
	'46ForeignTaxCr', '47TaxPaidInReturnPrevFiled', '48OtherTaxCrPmtAmt', '49OtherTaxCrPmtAmt'
]);

function calculateRevised(values: CorporateValues, create: boolean): CorporateValues {
	const result = normalizePeriod(values);
	if (result[atc] === 'IC021') result[deduction] = 'I';
	if (result[filing] !== 'Y') result[field('txtPg2Pt4I47TaxPaidInReturnPrevFiled')] = '0';
	const read = (key: string) => amount(result, key);
	const sum = (keys: string[]) => keys.reduce((total, key) => total + read(key), 0);
	const sales = read('txtPg2Pt4I28SalesReceiptsRevFees') - read('txtPg2Pt4I29SalesRetAllowanceDisc');
	const operation = sales - read('txtPg2Pt4I31CostOfSalesServ');
	const gross = operation + read('txtPg2Pt4I33AddOther');
	const ordinary = sum(ordinaryDeductions);
	const special = sum(list('txtPg3Pt6S2I', ['1Amount', '2Amount', '3Amount', '4Amount']));
	const osd = result[deduction] === 'O';
	const standard = osd ? Number(whole(gross * 0.4)) : 0;
	const itemized = osd ? 0 : ordinary + special;
	const net = gross - (osd ? standard : itemized);
	const credits = sum(taxCredits);
	const balance = -credits;
	const penalty = read('txtPg1Pt2I21PenaltyCompromise');
	const additions = sum(list('txtPg3Pt6S3I', ['1NetIncomePerBook', '2NonDeductExpenseOtherIncomeAmt', '3NonDeductExpenseOtherIncomeAmt']));
	const subtractions = sum(list('txtPg3Pt6S3I', ['5NonTaxIncomeAndIncomeSubjectToFinTaxAmt', '6NonTaxIncomeAndIncomeSubjectToFinTaxAmt', '7SpecialDeductAmt', '8SpecialDeductAmt']));
	const filingYear = Number(result[year]?.slice(-2));
	const reliefRate = filingYear <= 20 ? 0.30 : 0;
	const relief = create ? read('txtPg2Pt5I52RegularIncomeOtherwiseDue') : Number(whole(net * reliefRate));
	const specialRelief = create ? read('txtPg2Pt5I53SpecialAllowableItemizedDeduc') : Number(whole((osd ? 0 : special) * reliefRate));
	if (balance >= 0) result[overpayment] = '';
	for (const [key, value] of Object.entries({
		txtPg1Pt2I18TaxDue: 0,
		txtPg1Pt2I19TotalTaxCrPmt: credits,
		txtPg1Pt2I20TotalOverpmt: balance,
		txtPg1Pt2I22TotalAmtPayable: balance < 0 && penalty > 0 ? penalty : balance + penalty,
		txtPg2Pt4I30NetSalesReceiptsRevFees: sales,
		txtPg2Pt4I32GrossIncomeFromOper: operation,
		txtPg2Pt4I34TotalGross: gross,
		txtPg2Pt4I35OrdinaryAllowable: osd ? 0 : ordinary,
		txtPg2Pt4I36SpecialAllowable: osd ? 0 : special,
		txtPg2Pt4I37TotalItemized: itemized,
		txtPg2Pt4I38OptionalStandardDeduc: standard,
		txtPg2Pt4I39NetTaxable: net,
		txtPg2Pt4I40TaxRate: 0,
		txtPg2Pt4I41TaxDue: 0,
		txtPg2Pt4I50TotalTaxCrPmt: credits,
		txtPg2Pt4I51TotalOverpayment: balance,
		txtPg2Pt5I52RegularIncomeOtherwiseDue: relief,
		txtPg2Pt5I53SpecialAllowableItemizedDeduc: specialRelief,
		txtPg2Pt5I54TotalTaxReliefAvailment: relief + specialRelief,
		txtPg3Pt6S1I18TotOrdinaryAllowableItemDeduc: ordinary,
		txtPg3Pt6S2I5TotSpecialAllowedItemDeduc: special,
		txtPg3Pt6S3I4Total: additions,
		txtPg3Pt6S3I9Total: subtractions,
		txtPg3Pt6S3I10NetTaxableIncome: additions - subtractions
	})) result[field(key)] = whole(value);
	return result;
}

const exemptSignatoryLabels: Record<string, string> = {
	txtPg1Pt2AuthorizedRepresentative: 'Authorized representative',
	txtPg1Pt2Treasurer: 'Treasurer',
	txtPg1Pt2TitleofSignatory: 'Authorized representative title',
	txtPg1Pt2TitleofSignatory2: 'Treasurer title',
	txtPg1Pt2TINofSignatory: 'Authorized representative TIN',
	txtPg1Pt2TINofSignatory2: 'Treasurer TIN',
	txtPg1P2I23NumOfAttachments: 'Number of attachments',
	txtPg1Pt2NumberofPagesFiled: 'Number of pages filed',
	txtPg1Pt1I25PlaceofIssue: 'Place of issue'
};

const paymentMethods: Record<string, string> = {
	Cash: 'Cash or bank debit memo', Check: 'Check', TaxDebit: 'Tax debit memo', Others: 'Other payment'
};
const supplementalColumns = ['Exempt amount', 'Actual amount, fair market value, or net capital gains', 'Final tax withheld or paid'];

function labelExemptFields(input: CorporateField, legacy: boolean): void {
	const name = input.id.replace('frm1702EX:', '');
	const signatoryLabel = exemptSignatoryLabels[name];
	if (signatoryLabel && !(legacy && /^(?:txtPg1Pt2AuthorizedRepresentative|txtPg1Pt2Treasurer|txtPg1Pt2TitleofSignatory)$/.test(name))) {
		input.label = signatoryLabel;
		if (/TitleofSignatory|TINofSignatory/.test(input.id)) input.kind = 'text';
	}
	const holder = /^txtPg6S8I(\d+)Col(\d)([A-Za-z]+)([1-4])?$/.exec(name);
	if (holder) {
		const [, entry, column, , segment] = holder;
		const label = column === '1' ? 'Registered name'
			: column === '2' ? segment === '4' ? 'Branch code' : `TIN segment ${segment}`
			: column === '3' ? 'Capital contribution' : 'Ownership percentage';
		input.label = `Entry ${entry} · ${label}`;
	}
	const payment = /^txtPg1Pt3I(\d+)(Cash|Check|TaxDebit|Others)C([1-4])$/.exec(name);
	if (payment) {
		const method = payment[2];
		const column = Number(payment[3]);
		const amount = column === (method === 'Others' ? 4 : 3);
		const description = amount ? 'Amount' : method === 'Others'
			? ['Payment method', 'Drawee bank or agency', 'Reference number'][column - 1]
			: column === 1 ? 'Drawee bank or agency' : 'Reference number';
		input.kind = amount ? 'money' : 'text';
		input.label = `${paymentMethods[method]} · ${description}`;
	}
	const supplemental = /^txtPg7Sc9I[1-4](?:Interests|Royalties|Dividends|Prizes)C([123])$/.exec(name);
	if (supplemental) {
		input.column = Number(supplemental[1]);
		input.label = supplementalColumns[input.column - 1];
	}
}

function describeExemptTransactions(page: CorporatePage): void {
	const index = page.sections.findIndex(section => /^Schedule 9\b/i.test(section.title));
	const schedule = page.sections[index];
	if (!schedule) return;
	const groups = [
		{ title: 'Schedule 9.I · Income subject to final withholding', rows: [], columns: supplementalColumns },
		{ title: 'Schedule 9.II · Property transactions', rows: [] },
		{ title: 'Schedule 9.III · Share transactions', rows: [] },
		{ title: 'Schedule 9.IV · Other income subject to final tax', rows: [] }
	] as CorporatePage['sections'];
	for (const row of schedule.rows) {
		const firstId = row.fields[0]?.id ?? '';
		const item = Number(/(?:Sc|S)9I(\d+)/i.exec(firstId)?.[1]);
		const group = item >= 16 ? 3 : item >= 10 ? 2 : item >= 5 ? 1 : 0;
		groups[group].rows.push(row);
		if (!group) continue;
		for (const input of row.fields) {
			const entry = /C([12])$/.exec(input.id)?.[1];
			if (!entry) continue;
			const label = input.id.includes('ddPg7S9I10') ? 'Stock type' : input.id.includes('PSCSC') ? 'Stock certificate series' : row.label;
			input.label = `${group === 1 ? 'Property' : group === 2 ? 'Share transaction' : 'Other income'} ${entry} · ${label}`;
		}
	}
	page.sections.splice(index, 1, ...groups.filter(group => group.rows.length));
	const exempt = page.sections.find(section => /^Schedule 10\b/i.test(section.title));
	for (const row of exempt?.rows ?? []) {
		for (const input of row.fields) {
			const match = /Sc10I([2-7]).*C([12])$/.exec(input.id);
			if (match) input.label = `${Number(match[1]) < 6 ? 'Property transfer' : 'Other exempt income'} ${match[2]} · ${row.label}`;
		}
	}
}

function fieldsForRevision(raw: CorporatePage[], legacy: boolean, create: boolean): CorporatePage[] {
	const pages = structuredClone(raw);
	const background = pages[0].sections.find(section => /part i\b/i.test(section.title)) ?? pages[0].sections[0];
	if (!legacy) {
		const first = background.rows.findIndex(row => row.item === '6');
		const rows = background.rows.splice(first);
		pages[0].sections.splice(1, 0, { title: 'Part I · Background Information', rows });
	}
	const identitySection = pages[0].sections.find(section => /background/i.test(section.title))!;
	const rdo: CorporateField = { id: field('hdnPg1Pt1I7RDO'), label: 'RDO code', kind: 'text', readonly: true, required: true, profileKey: 'rdoCode' };
	identitySection.rows.splice(1, 0, { label: rdo.label!, item: '7', fields: [rdo] });
	for (const page of pages) {
		for (const section of page.sections) {
			section.title = section.title.replace(/\s+/g, ' ');
			if (legacy && page === pages[3] && /^Schedule 3/.test(section.title)) {
				section.title = 'Schedule 3 · Other taxable income';
				const firstDeduction = section.rows.findIndex(row => row.fields.some(input => input.id.endsWith('I1AdsAndPromotions')));
				if (firstDeduction !== -1) page.sections.push({
					title: 'Schedule 4 · Ordinary allowable itemized deductions',
					rows: section.rows.splice(firstDeduction)
				});
			}
			if (/^Tax computation and schedules$/.test(section.title)) section.title = 'Return identification';
			for (const row of section.rows) {
				for (const input of row.fields) {
					labelExemptFields(input, legacy);
					if (/Pt3I\d+Date$/.test(input.id)) input.label = `${row.label} · Payment date`;
					if (input.id === period) input.defaultValue = 'C';
					if (input.id === filing || input.id === shortPeriod) input.defaultValue = 'N';
					if (input.id === month) input.defaultValue = '12';
					if (input.id === atc || input.id === deduction ||
						(page === pages[0] && ['contactNumber', 'zipCode', 'lineOfBusiness', 'psicCode'].includes(input.profileKey ?? ''))) {
						input.required = true;
					}
					if (input.id === overpayment || input.id === 'CTCorReg') input.readonly = false;
						if (!create && input.id === field('txtPg2Pt4I40TaxRate')) input.readonly = true;
					if (/(?:TIN|Tin)C?[1-4]$|BIRAccreditedNoC[1-4]$/.test(input.id)) input.kind = 'text';
					if (input.id.endsWith('Col4PTotal')) input.kind = 'percent';
					if (input.id.startsWith(field('chkPg6S8'))) {
						input.kind = 'checkbox';
						input.options = undefined;
					}
					if (legacyTotals.some(op => op.outputs.some(key => field(key) === input.id))) {
						input.kind = 'money';
						input.readonly = true;
					}
					if (/I5[23](?:RegularIncomeOtherwiseDue|SpecialAllowableItemizedDeduc)$/.test(input.id)) {
						input.readonly = !create;
						input.kind = 'money';
					}
				}
				if (row.fields.some(input => /I46TinC1$/.test(input.id))) row.label = 'External auditor’s TIN';
				if (row.fields.some(input => /I48TinC1$/.test(input.id))) row.label = 'Signing partner’s TIN';
				const holder = /^frm1702EX:txtPg6S8I(\d+)Col1Name$/.exec(row.fields[0]?.id ?? '');
				if (holder) {
					row.item = holder[1];
					row.label = `Ownership entry ${holder[1]}`;
				}
				if (row.fields.some(input => /txtPg7Sc9I[1-4](?:Interests|Royalties|Dividends|Prizes)C[123]$/.test(input.id))) {
					section.columns = supplementalColumns;
				}
				if (row.fields.length === 1 && row.fields[0].kind === 'radio') row.label = row.fields[0].label ?? row.label;
			}
		}
	}
	if (legacy) describeExemptTransactions(pages[6]);
	return pages;
}

function validate(values: CorporateValues, legacy: boolean, create: boolean): CorporateValues {
	const result = legacy ? calculateLegacy(values) : calculateRevised(values, create);
	const errors: CorporateValues = {};
	const monthNumber = Number(result[month]);
	if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) errors[month] = 'Choose a closing month.';
	if ((result[period] === 'F' || result[shortPeriod] === 'Y') && monthNumber === 12) errors[month] = 'Choose a month other than December.';
	const filingYear = Number(result[year]);
	const now = philippineCalendarDate();
	if (filingYear > now.year || filingYear === now.year && monthNumber >= now.month) {
		errors[year] = 'Choose an ended taxable period.';
	}
	const incorporation = field(legacy ? 'txtPg1Pt1I8DateofIncorporation' : 'txtPg1Pt1I10DateofIncorporation');
	const incorporationText = result[incorporation]?.trim() ?? '';
	const incorporated = corporateDateIso(incorporationText);
	if (incorporationText && !incorporated) {
		errors[incorporation] = 'Enter a valid date.';
	} else if (incorporated && incorporated.slice(0, 7) > `${filingYear}-${String(monthNumber).padStart(2, '0')}`) {
		errors[incorporation] = 'Date of incorporation must fall within or before the filing period.';
	}
	const part = legacy ? 'txtPg5S6I10NetTaxable' : 'txtPg3Pt6S3I10NetTaxableIncome';
	if (amount(result, part) !== amount(result, 'txtPg2Pt4I39NetTaxable')) {
		errors[field(part)] = 'Reconcile this amount with item 39 on the tax computation page.';
	}
	if (!legacy && amount(result, 'txtPg1Pt2I20TotalOverpmt') < 0 && !result[overpayment]) {
		errors[overpayment] = 'Choose how to treat the overpayment.';
	}
	const legalFields = legacy ? ['16LegalBasis', '17Investment', '18RegisteredActivity', '19EffectivityFrom', '19EffectivityTo']
		: ['14LegalBasis', '15Investment', '16RegisteredActivity', '17EffectivityFrom', '17EffectivityTo'];
	for (const key of list('txtPg1Pt1I', legalFields)) {
		if (!values[field(key)]?.trim()) errors[field(key)] = 'Required.';
	}
	const [start, end] = legalFields.slice(-2).map(key => field('txtPg1Pt1I' + key));
	const startText = result[start]?.trim() ?? '';
	const endText = result[end]?.trim() ?? '';
	const first = corporateDateIso(startText);
	const last = corporateDateIso(endText);
	if (startText && !first) errors[start] = 'Enter a valid date.';
	if (endText && !last) errors[end] = 'Enter a valid date.';
	if (first && last && first > last) errors[end] = 'Exemption end date must follow the start date.';
	if (last && Number(last.slice(0, 4)) < filingYear) errors[end] = 'The exemption must cover the filing year.';
	if (first && Number(first.slice(0, 4)) > filingYear) errors[start] = 'The exemption must cover the filing year.';
	if (legacy) {
		Object.assign(errors, validateLegacyExemptIdentification(result, now));
		if (result.CTCorReg === 'CTC' && amount(result, 'txtPg1Pt1I26Amount') <= 0) {
			errors[field('txtPg1Pt1I26Amount')] = 'Enter a community tax certificate amount.';
		}
	} else if (create) {
		if (amount(result, 'txtPg2Pt4I39NetTaxable') > 0 && amount(result, 'txtPg2Pt5I52RegularIncomeOtherwiseDue') <= 0) {
			errors[field('txtPg2Pt5I52RegularIncomeOtherwiseDue')] = 'Enter the regular income tax otherwise due.';
		}
		if (amount(result, 'txtPg2Pt4I36SpecialAllowable') > 0 && amount(result, 'txtPg2Pt5I53SpecialAllowableItemizedDeduc') <= 0) {
			errors[field('txtPg2Pt5I53SpecialAllowableItemizedDeduc')] = 'Enter the tax relief on special allowable itemized deductions.';
		}
	}
	return errors;
}

export const exemptForms: CorporateForm[] = [
	{ code: '1702EX', revision: 'June 2013', data: legacyPages },
	{ code: '1702EXv2018', revision: 'January 2018', data: revisedPages },
	{ code: '1702EXv2018C', revision: 'January 2018 (ENCS) v2', data: createPages }
].map(({ code, revision, data }) => {
	const legacy = code === '1702EX';
	const create = code.endsWith('C');
	const fixedPages = fieldsForRevision(data as CorporatePage[], legacy, create);
	const pages = legacy ? exemptRepeatablePages(fixedPages) : fixedPages;
	return {
		code, revision, title: 'Annual Income Tax Return for Exempt Corporations, Partnerships and Other Non-Individual Taxpayers',
		year, month, periodType: period, shortPeriod, decimals: 0,
		amount: field(legacy ? 'txtPg1Pt2I22TotalAmount' : 'txtPg1Pt2I22TotalAmtPayable'),
		pages,
		pagesFiledField: legacy ? field('txtPg1Pt2NumberofPagesFiled') : undefined,
		expandPages: legacy ? values => expandExemptPages(pages, values) : undefined,
		continuations: legacy ? values => exemptContinuations(pages, values) : undefined,
		calculate: values => {
			if (!legacy) return calculateRevised(values, create);
			const result = calculateLegacy(rollupExemptDetails(pages, values));
			result[field('txtPg7Sc9I19TotalFinalTax')] = whole(amount(result, 'txtPg7Sc9I19TotalFinalTax') + exemptAdditionalFinalTax(result));
			result[field('txtPg7Sc10I8TotalIncome')] = whole(amount(result, 'txtPg7Sc10I8TotalIncome') + exemptAdditionalExemptIncome(result));
			return result;
		},
		validate: values => ({
			...validate(values, legacy, create),
			...(legacy ? validateExemptDetails(pages, values) : {})
		}),
		fieldApplies: (id, values) => {
			if (id === month) return values[period] === 'F' || values[shortPeriod] === 'Y';
			if (id === overpayment) return amount(values, 'txtPg1Pt2I20TotalOverpmt') < 0;
			if (id.endsWith('I47TaxPaidInReturnPrevFiled')) return values[filing] === 'Y';
			if (values[deduction] === 'O' && /txtPg3Pt6(?:S[12]|I17)/.test(id)) return false;
			return true;
		}
	};
});
