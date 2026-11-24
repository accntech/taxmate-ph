import { incomeIncludesSpouse } from './profile-fields';

type Values = Record<string, string>;

const brackets2018 = [[250000, 0, .2], [400000, 30000, .25], [800000, 130000, .3], [2000000, 490000, .32], [8000000, 2410000, .35]];
const brackets2023 = [[250000, 0, .15], [400000, 22500, .2], [800000, 102500, .25], [2000000, 402500, .3], [8000000, 2202500, .35]];

function graduatedTax(income: number, year: number): number {
	const bracket = (year < 2023 ? brackets2018 : brackets2023).findLast(([floor]) => income >= floor);
	return bracket ? Math.round(bracket[1] + (income - bracket[0]) * bracket[2]) : 0;
}

const key = (code: string, field: string) => `frm${code}:${field}`;
const number = (value = '') => Number(value.replaceAll(',', '').replace(/%$/, '')) || 0;
const isChecked = (value: string) => ['Y', '1', 'true', 'on'].includes(value);
const regularMsAtc: Record<string, string> = { '1': 'II012', '2': 'II013', '3': 'II014' };
const eightPercentMsAtc: Record<string, string> = { '1': 'II015', '2': 'II016', '3': 'II017' };

export function annual1701ARateForAtc(atc: string | undefined): 'G' | 'E' | undefined {
	if (atc === 'II012' || atc === 'II014') return 'G';
	if (atc === 'II015' || atc === 'II017') return 'E';
}

function aRate(values: Values, spouse: boolean): string | undefined {
	return annual1701ARateForAtc(values[key('1701A', spouse ? 'optSpouseATC' : 'optATC')]) ??
		values[key('1701A', spouse ? 'optSpouseTaxRate' : 'optTaxRate')];
}

function msSource(values: Values, spouse: boolean): string | undefined {
	return values[key('1701MS', spouse ? 'sourceOfIncomeSpouse' : 'sourceOfIncomeTaxpayer')];
}

function msRegime(values: Values, spouse: boolean): string | undefined {
	return spouse && msSource(values, true) === '4' ? '2' : values[key('1701MS', spouse ? 'txtTaxpayerNo12b' : 'txtTaxpayerNo12a')];
}

function msUsesOsd(values: Values, spouse: boolean): boolean {
	return msRegime(values, spouse) === '2' && !!values[spouse ? 'methodOfDeductionStandard' : 'methodOfDeductionMain']?.startsWith('osd');
}

export function shortAnnualFieldApplies(code: string, id: string, values: Values): boolean {
	if (code === '1701A') {
		const field = id.replace(/^frm1701A:/, '');
		const amount = /^txt(\d{2})([AB])$/.exec(field);
		const joint = incomeIncludesSpouse(code, values);
		const foreign = /^(?:txtForeignTaxNumber|txt62A)$/.test(field) ? 'optForeignTaxCredits' :
			/^(?:txtSpouseFTN|txt62B)$/.test(field) ? 'optSpouseFTC' : undefined;
		if (foreign) return (foreign !== 'optSpouseFTC' || joint) && values[key(code, foreign)] === 'Y';
		if (field === 'optRefund') return values[key(code, 'txt30')] === undefined || number(values[key(code, 'txt30')]) < 0;
		const description = /^txt(41|42|50|51)Desc$/.exec(field);
		if (description) {
			const inactiveRate = Number(description[1]) < 47 ? 'E' : 'G';
			return aRate(values, false) !== inactiveRate || (joint && aRate(values, true) !== inactiveRate);
		}
		if (!amount) return true;
		const spouse = amount[2] === 'B';
		const item = Number(amount[1]);
		if (spouse && !joint) return false;
		if (item === 61) return values[key(code, 'optAmendedReturn')] === 'Y';
		const rate = aRate(values, spouse);
		if (item >= 36 && item <= 46) return rate !== 'E';
		if (item >= 47 && item <= 56) return rate !== 'G';
		return true;
	}
	if (code !== '1701MS') return true;
	const field = id.replace(/^frm1701MS:/, '');
	const spouse = /b1?$|Spouse$|^methodOfDeductionStandard$|(?:Less22|Loss23|Income24|Availment)B$|SP$/.test(field);
	if (spouse && !incomeIncludesSpouse(code, values)) return false;
	const source = msSource(values, spouse);
	const regime = msRegime(values, spouse);
	if (/^txtTaxPaidPreviouslyFiledNo6[ab]$/.test(field)) return values[key(code, 'txtAmended')] === 'Y';
	if (/^txt(?:Gross|LessNonTaxable|TaxableCompensationIncome|TaxpayerNo4|CreditableForm2316No5)[ab]$/.test(field)) return source !== '1' && source !== '3';
	if (/^methodOfDeduction(?:Main|Standard)$/.test(field)) return source !== '4' && (!regime || regime === '2');
	if (/^txt(?:TaxpayerNo1[3-6][ab]1?|TaxRate[ab]|TaxDueSpecial[ab]|IncomeTaxDueNo19[ab]|ShareOfOtherNo20[ab]|NetSpecialRateNo21[ab])$|^TotalTaxDueCompensationA|^totalTaxReliefAvailment/.test(field)) {
		return source !== '4' && (regime === '4' || regime === '5');
	}
	const businessGraduated = source !== '4' && regime !== '3';
	if (/^txt(?:SalesRevenueNo5|SalesReturnsNo6|TaxableCompensationIncomeNo7|GrossIncomeNo9|NetIncomeLossNo12|NonOperatingIncomeNo13|TaxableIncomeBusinesNo14|CompensationBusinessNo15)[ab]$|^TotalTaxDueCompensationB/.test(field)) return businessGraduated;
	if (/^txt(?:CostofSalesNo8|AllowableItemizedDeductionsNo10|SpecialAllowableNo10|NetOperatingLossNo10|TotalAllowableItemixedDeductionsNo10)(?:[ab]|aSpouse)$/.test(field)) {
		return businessGraduated && !msUsesOsd(values, spouse);
	}
	if (/^txtOptionalDeductionNo11[ab]$/.test(field)) return businessGraduated && msUsesOsd(values, spouse);
	if (/^txt(?:SalesRevenuesFeesANo19|OtherNonOperatingIncomeNo20|TotalIncomeNo21|CompensationBusinessNo25)[ab]$|^txt(?:Less22|TaxableIncomeLoss23|TaxDueBusinessIncome24)[AB]$/.test(field)) {
		return source !== '4' && (!regime || regime === '3');
	}
	return true;
}

function parseDate(value: string): Date | undefined {
	const parts = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
	if (!parts) return;
	const [, month, day, year] = parts.map(Number);
	const date = new Date(year, month - 1, day);
	return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day ? date : undefined;
}

export function calculate1701A(values: Values): Values {
	const next = { ...values };
	const field = (item: string) => key('1701A', item);
	const read = (item: string) => number(next[field(item)]);
	const set = (item: string, amount: number) => { next[field(item)] = Math.round(amount).toFixed(2); };
	for (const person of ['A', 'B']) {
		const spouse = person === 'B';
		const rateId = field(spouse ? 'optSpouseTaxRate' : 'optTaxRate');
		const rate = aRate(values, spouse);
		if (rate) next[rateId] = rate;
		const get = (item: number) => {
			const id = `txt${item}${person}`;
			return shortAnnualFieldApplies('1701A', id, next) ? read(id) : 0;
		};
		const put = (item: number, amount: number) => set(`txt${item}${person}`, amount);
		put(38, get(36) - get(37));
		put(39, get(38) * .4);
		put(40, get(38) - get(39));
		put(44, get(41) + get(42) + get(43));
		put(45, get(40) + get(44));
		put(46, graduatedTax(get(45), read('txtYear')));
		put(49, get(47) - get(48));
		put(52, get(50) + get(51));
		put(53, get(49) + get(52));
		put(55, get(53) - get(54));
		put(56, Math.max(0, .08 * get(55)));
		put(64, [57, 58, 59, 60, 61, 62, 63].reduce((total, item) => total + get(item), 0));
		const active = !spouse || incomeIncludesSpouse('1701A', values);
		put(20, active ? get(rate === 'E' ? 56 : 46) : 0);
		put(21, active ? get(64) : 0);
		put(65, get(20) - get(21));
		put(22, get(65));
		put(24, active ? get(22) - get(23) : 0);
		put(28, active ? get(25) + get(26) + get(27) : 0);
		put(29, get(24) < 0 ? get(24) : get(24) + get(28));
	}
	set('txt30', read('txt29A') + read('txt29B'));
	return next;
}

export function calculate1701MS(values: Values): Values {
	const next = { ...values };
	const field = (item: string) => key('1701MS', item);
	for (const person of ['a', 'b']) {
		const spouse = person === 'b';
		const active = !spouse || incomeIncludesSpouse('1701MS', values);
		const read = (item: string) => number(next[field(item + person)]);
		const set = (item: string, amount: number) => { next[field(item + person)] = Math.round(amount).toFixed(2); };
		const regime = msRegime(values, spouse);
		const source = msSource(values, spouse);
		if (spouse && active && source === '4') next[field('txtTaxpayerNo12b')] = '2';
		const atcKey = spouse ? 'taxCodeDropdownSpouse' : 'taxCodeDropdown';
		const derivedAtc = regime === '3' ? eightPercentMsAtc[source ?? ''] :
			source === '4' && spouse && regime === '2' ? 'II011' :
				['2', '4', '5'].includes(regime ?? '') ? regularMsAtc[source ?? ''] : undefined;
		if (active && derivedAtc) next[atcKey] = derivedAtc;
		const atc = next[atcKey];
		const osd = msUsesOsd(values, spouse);
		const upper = person.toUpperCase();
		const schedulePerson = spouse ? 'SP' : 'TP';
		const hasCompensation = active && source !== '1' && source !== '3';
		const businessGraduated = active && source !== '4' && regime !== '3';
		set('txtTaxableCompensationIncome', hasCompensation ? read('txtGross') - read('txtLessNonTaxable') : 0);
		set('txtTaxpayerNo4', graduatedTax(Math.max(0, read('txtTaxableCompensationIncome')), 2023));
		set('txtTaxableCompensationIncomeNo7', businessGraduated ? read('txtSalesRevenueNo5') - read('txtSalesReturnsNo6') : 0);
		set('txtGrossIncomeNo9', read('txtTaxableCompensationIncomeNo7') - (businessGraduated && !osd ? read('txtCostofSalesNo8') : 0));
		const ordinary = number(next[field(spouse ? 'txtAllowableItemizedDeductionsNo10aSpouse' : 'txtAllowableItemizedDeductionsNo10a')]);
		set('txtTotalAllowableItemixedDeductionsNo10', businessGraduated && !osd ? ordinary + read('txtSpecialAllowableNo10') + read('txtNetOperatingLossNo10') : 0);
		set('txtOptionalDeductionNo11', osd ? read('txtTaxableCompensationIncomeNo7') * .4 : 0);
		set('txtNetIncomeLossNo12', read('txtGrossIncomeNo9') - read(osd ? 'txtOptionalDeductionNo11' : 'txtTotalAllowableItemixedDeductionsNo10'));
		set('txtTaxableIncomeBusinesNo14', businessGraduated ? read('txtNetIncomeLossNo12') + read('txtNonOperatingIncomeNo13') : 0);
		set('txtCompensationBusinessNo15', Math.max(0, read('txtTaxableCompensationIncome')) + Math.max(0, read('txtTaxableIncomeBusinesNo14')));
		const special = regime === '4' || regime === '5';
		set('txtTaxDueSpecial', special ? Math.max(0, read('txtGrossIncomeNo9')) * read('txtTaxRate') / 100 : 0);
		const graduated = graduatedTax(read('txtCompensationBusinessNo15'), 2023);
		next[field('TotalTaxDueCompensationA' + schedulePerson)] = (active && special ? read('txtTaxpayerNo4') + read('txtTaxDueSpecial') : 0).toFixed(2);
		next[field('TotalTaxDueCompensationB' + schedulePerson)] = (active && regime === '2' ? graduated : 0).toFixed(2);
		set('txtTotalIncomeNo21', read('txtSalesRevenuesFeesANo19') + read('txtOtherNonOperatingIncomeNo20'));
		if (active && regime === '3' && ['II015', 'II016', 'II017'].includes(atc)) {
			next[field('txtLess22' + upper)] = atc === 'II016' ? '0.00' : '250000.00';
		}
		const taxable8 = read('txtTotalIncomeNo21') - number(next[field('txtLess22' + upper)]);
		next[field('txtTaxableIncomeLoss23' + upper)] = Math.round(taxable8).toFixed(2);
		const tax8 = Math.max(0, Math.round(taxable8 * .08));
		next[field('txtTaxDueBusinessIncome24' + upper)] = tax8.toFixed(2);
		set('txtCompensationBusinessNo25', read('txtTaxpayerNo4') + tax8);
		set('txtIncomeTaxDueNo19', active && regime === '5' ? read('txtTaxDueSpecial') : 0);
		set('txtNetSpecialRateNo21', active && regime === '5' ? read('txtIncomeTaxDueNo19') - read('txtShareOfOtherNo20') : 0);
		const regular = regime === '3' ? read('txtCompensationBusinessNo25') :
			special ? read('txtTaxpayerNo4') : graduated;
		set('txtIncomeTaxRegularNo22', active ? regular : 0);
		set('txtTotalIncomeTaxDueNo23', read('txtNetSpecialRateNo21') + read('txtIncomeTaxRegularNo22'));
		const creditNames = ['txtPriorYearsNo1', 'txtTaxPaymentsNo2', 'txtCreditableTaxNo3', 'txtCreditableFourthQuarterNo4', 'txtCreditableForm2316No5', 'txtTaxPaidPreviouslyFiledNo6', 'txtForeignTaxCreditsNo7', 'txtSpecialTaxCreditsNo8', 'txtOtherCreditsPaymentsNo9'];
		set('txtTotalTaxCreditsPaymentsPartVNo10', active ? creditNames.reduce((total, name) => {
			return total + (shortAnnualFieldApplies('1701MS', name + person, values) ? read(name) : 0);
		}, 0) : 0);
		set('txtTotalTaxCreditsPartIINo24', active ? read('txtTotalTaxCreditsPaymentsPartVNo10') : 0);
		set('txtTaxPayableNo25', read('txtTotalIncomeTaxDueNo23') - read('txtTotalTaxCreditsPartIINo24'));
		set('txtAmountPayableNo27', active ? read('txtTaxPayableNo25') - read('txtTaxDueAllowedNo26') : 0);
		set('txtTotalPenaltiesNo28', active ? read('txtSurchangeNo28') + read('txtInterestNo28') + read('txtCompromise28') : 0);
		const balance = read('txtAmountPayableNo27');
		const penalties = read('txtTotalPenaltiesNo28');
		set('txtTotalAmountPayableNo29', balance < 0 && penalties > 0 ? penalties : balance + penalties);
		next[field('totalTaxReliefAvailment' + upper)] = Math.max(0, graduatedTax(read('txtSpecialAllowableNo10') + read('txtTaxableIncomeBusinesNo14'), 2023) - read('txtTaxDueSpecial') + read('txtSpecialTaxCreditsNo8')).toFixed(2);
	}
	const taxpayer = number(next[field('txtTotalAmountPayableNo29a')]);
	const spouse = number(next[field('txtTotalAmountPayableNo29b')]);
	next[field('txtAggregateAmountPayable30a')] =
		(taxpayer * spouse < 0 ? Math.max(taxpayer, spouse) : taxpayer + spouse).toFixed(2);
	return next;
}

export function validate1701A(values: Values): Values {
	const errors: Values = {};
	const field = (item: string) => key('1701A', item);
	const value = (item: string) => values[field(item)]?.trim() ?? '';
	const require = (item: string, label: string) => { if (!value(item)) errors[field(item)] = `Enter or select ${label}.`; };
	for (const [item, label] of [['txtBirthDate', 'the birth date'], ['txtCitizenship', 'citizenship'], ['optTaxType', 'the taxpayer type'], ['optATC', 'the ATC'], ['optCivilStatus', 'civil status'], ['optShortPeriod', 'the filing period']]) require(item, label);
	const birthDate = value('txtBirthDate');
	if (birthDate) {
		const date = parseDate(birthDate);
		if (!date || date > new Date()) {
			errors[field('txtBirthDate')] = 'Enter a valid birth date that is not in the future.';
		}
	}
	if (value('optCivilStatus') === 'Married') require('optSpouseIncome', 'whether the spouse has income');
	if (value('optCivilStatus') === 'Married' && value('optSpouseIncome') === 'Y') require('optFilingStatus', 'the filing status');
	const joint = incomeIncludesSpouse('1701A', values);
	if (joint) for (const [item, label] of [['txtSpouseTIN1', 'the spouse TIN'], ['txtSpouseTIN2', 'the spouse TIN'], ['txtSpouseTIN3', 'the spouse TIN'], ['txtSpouseBranchCode', 'the spouse branch code'], ['txtSpouseRDOCode', 'the spouse RDO'], ['txtSpouseName', 'the spouse name'], ['txtSpouseCitizenship', 'the spouse citizenship'], ['optSpouseTaxType', 'the spouse type'], ['optSpouseATC', 'the spouse ATC']]) require(item, label);
	const computed = calculate1701A(values);
	for (const person of joint ? ['A', 'B'] : ['A']) {
		const atcId = person === 'A' ? 'optATC' : 'optSpouseATC';
		const atc = value(atcId);
		const rate = annual1701ARateForAtc(atc);
		if (atc && !rate) errors[field(atcId)] = 'Select a valid ATC.';
		if (rate === 'E' && number(computed[field('txt53' + person)]) > 3000000) errors[field('txt53' + person)] = 'Income above ₱3,000,000 is ineligible for the 8% rate.';
		if (rate === 'E' && (number(value('txt54' + person)) < 0 || number(value('txt54' + person)) > 250000)) errors[field('txt54' + person)] = 'Enter an amount between zero and ₱250,000.';
		const installment = 'txt23' + person;
		const deferred = number(value(installment));
		if (deferred < 0 || deferred > Math.max(0, number(computed[field('txt20' + person)]) / 2)) {
			errors[field(installment)] = 'Enter an installment of 50% or less of Item 20.';
		}
	}
	if (number(computed[field('txt30')]) < 0) require('optRefund', 'the overpayment disposition');
	return errors;
}

export function validate1701MS(values: Values): Values {
	const errors: Values = {};
	const field = (item: string) => key('1701MS', item);
	const value = (item: string) => values[field(item)]?.trim() ?? '';
	const require = (item: string, label: string) => { if (!value(item)) errors[field(item)] = `Enter or select ${label}.`; };
	for (const [item, label] of [['civilStatus', 'civil status'], ['txtTelNum10a', 'contact number'], ['sourceOfIncomeTaxpayer', 'the income source'], ['txtTaxpayerNo12a', 'the tax regime'], ['txtReturnPeriod', 'the filing period']]) require(item, label);
	if (value('civilStatus').toLowerCase() === 'married') require('txtIfMarried', 'whether filing jointly');
	const joint = incomeIncludesSpouse('1701MS', values);
	if (joint) {
		for (const [item, label] of [['txtPg2TIN1Spouse', 'the spouse TIN'], ['txtPg2TIN2Spouse', 'the spouse TIN'], ['txtPg2TIN3Spouse', 'the spouse TIN'], ['txtPg2BranchCodeSpouse', 'the spouse branch code'], ['txtRDOCodeb', 'the spouse RDO'], ['txtTaxpayerNo8b', 'the spouse name'], ['txtEmailb', 'the spouse email'], ['txtTelNum10b', 'the spouse contact'], ['sourceOfIncomeSpouse', 'the spouse income source']]) require(item, label);
		if (msSource(values, true) !== '4') require('txtTaxpayerNo12b', 'the spouse regime');
	}
	const computed = calculate1701MS(values);
	const filingMonth = number(value('txtMonthNo1'));
	const filingYear = number(value('txtYearNo1'));
	const periodEnd = filingYear >= 1900 && filingMonth >= 1 && filingMonth <= 12
		? new Date(filingYear, filingMonth, 0) : undefined;
	for (const person of joint ? ['a', 'b'] : ['a']) {
		const spouse = person === 'b';
		const rate = msRegime(values, spouse);
		const method = spouse ? 'methodOfDeductionStandard' : 'methodOfDeductionMain';
		if (rate === '2' && msSource(values, spouse) !== '4' && !values[method]) errors[method] = 'Select the method of deduction.';
		if (rate === '3' && number(computed[field('txtTotalIncomeNo21' + person)]) > 3000000) {
			errors[field('txtSalesRevenuesFeesANo19' + person)] = 'Income above ₱3,000,000 is ineligible for the 8% rate.';
		}
		if (rate === '4' || rate === '5') {
			for (const item of ['13', '14', '15', '16']) require('txtTaxpayerNo' + item + person, `the tax relief details for Item ${item}`);
			const fromId = 'txtTaxpayerNo16' + person;
			const toId = fromId + '1';
			const from = parseDate(value(fromId));
			const to = parseDate(value(toId));
			if (value(fromId) && !from) errors[field(fromId)] = 'Enter a valid tax relief start date.';
			if (value(toId) && !to) errors[field(toId)] = 'Enter a valid tax relief end date.';
			if (periodEnd && from && from >= periodEnd) errors[field(fromId)] = 'The tax relief start date must be before the filing period ends.';
			if (periodEnd && to && to < periodEnd) errors[field(toId)] = 'The tax relief end date must be on or after the filing period ends.';
		}
		const installment = 'txtTaxDueAllowedNo26' + person;
		const deferred = number(value(installment));
		const limit = Math.max(0, Math.min(
			number(computed[field('txtTotalIncomeTaxDueNo23' + person)]) / 2,
			number(computed[field('txtTaxPayableNo25' + person)])
		));
		if (deferred < 0 || deferred > limit) {
			errors[field(installment)] = 'Enter an installment no greater than 50% of Item 23 and the balance in Item 25.';
		}
	}
	if (!isChecked(value('perjuryClause'))) errors[field('perjuryClause')] = 'Accept the declaration before finalizing this return.';
	if (number(computed[field('txtAggregateAmountPayable30a')]) < 0) {
		const dispositions = ['txtToBeRefunded', 'txtToBeIssued', 'txtToBeCarried'].filter(item => isChecked(value(item)));
		if (dispositions.includes('txtToBeRefunded') && dispositions.includes('txtToBeIssued')) {
			errors[field('txtToBeIssued')] = 'Choose either a refund or a tax credit certificate.';
		}
		const balance = number(computed[field('txtAmountPayableNo27a')]) + number(computed[field('txtAmountPayableNo27b')]);
		if (!dispositions.length || dispositions.reduce((total, item) => total + number(value(item + '1')), 0) !== Math.abs(balance)) errors[field('txtToBeRefunded')] = 'Select overpayment dispositions whose amounts total the overpayment.';
	}
	for (const [description, amount] of [['addForeignTaxCredits', 'txtForeignTaxCreditsNo7'], ['addOtherCreditsPayments', 'txtOtherCreditsPaymentsNo9']]) {
		if (Boolean(value(description)) !== Boolean(number(value(amount + 'a')) || (joint && number(value(amount + 'b'))))) errors[field(description)] = 'Provide both a description and an amount.';
	}
	return errors;
}
