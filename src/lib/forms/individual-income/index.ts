import { normalizeCurrencyInput, roundWholePeso, type CurrencyDecimals } from '$lib/components/ui/currency-input/currency';
import { joinRegisteredLines, mapRegisteredLines, registeredAddressLines, registeredNameLines, taxpayerEmailError, type TaxpayerProfile } from '../../profiles/profile';
import { isPackagedRdoCode } from '../../profiles/rdo-codes';
import type { FormDefinition, FormField } from '..';
import { philippineCalendarDate } from '../filing-calendar';
import { annualAmountField, annualFieldApplies, calculateAnnual, legacy1701Filing, validateAnnual } from './annual';
import { isRevisedActivityFieldId, revisedActivityFieldId, revisedActivityRegime, revisedActivityRegimeApplies, revisedActivityRegimeId, revisedActivitySlots, revisedActivityTemplateId, usesRevisedActivityAttachments } from './annual-2018-activities';
import { compensationAmountField, calculateCompensation, validateCompensation, isLegacy1700ContactValid, legacy1700DependentClaim, legacy1700FirstYear, legacy1700LastYear, revised1700EmployerAssignment, revised1700EmployerHasEntry, revised1700EmployerRows, revised1700FieldApplies } from './compensation';
import { quarterlyAmountField, calculateQuarterly, quarterlyIncomeFieldApplies, validateQuarterly } from './quarterly';
import { incomeEditorFields } from './editor-layout';
import { annual1701AFilerRate, calculate1701A, calculate1701MS, shortAnnualFieldApplies, validate1701A, validate1701MS } from './annual-short';
import { annual1701ABaseDetailFields, exportAnnual1701ADetails } from './annual-1701a-income-detail';
import { incomeIncludesSpouse, incomePersonalValues, incomeProfileFieldList, incomeSpouseFieldIds, incomeTaxpayerTypeValues, legacy1701ProfileIds } from './profile-fields';
import importedFields from './templates/fields.json';

type Values = Record<string, string>;
type ProfileKey = keyof TaxpayerProfile;
type Rule = (code: string, values: Values) => Values;
type ValidationRule = (code: string, values: Values, sourceValues: Values) => Values;
const identityKeys = ['tin1', 'tin2', 'tin3', 'branchCode', 'rdoCode', 'taxpayerName', 'address', 'address2', 'zipCode', 'contactNumber', 'email'] as const;
const codeDetails = {
	'1700': ['1700 · June 2013', 'Annual return for purely compensation income', 'frm1700', 'txtYear', 'txtPg1Pt1I5TIN1 txtPg1Pt1I5TIN2 txtPg1Pt1I5TIN3 txtPg1Pt1I5BranchCode txtPg1Pt1I6RDOCode txtPg1Pt1I8TaxFilerLastName txtPg1Pt1I9Address1 txtPg1Pt1I9Address2 - txtPg1Pt1I12ContactNo txtPg1Pt1I11EmailAddress'],
	'1700v2018': ['1700 · January 2018', 'Annual return for purely compensation income', 'frm1700', 'txtPg1I1Year', 'txtPg1I4TIN1 txtPg1I4TIN2 txtPg1I4TIN3 txtPg1I4BranchCode txtRDOCode txtPg1I7TaxpayerName txtPg1I8Address txtPg1I8Address2 txtPg1I8AZipCode txtPg1I14TelNum txtPg1I10Email'],
	'1701': ['1701 · June 2013', 'Annual return for individuals, estates and trusts', 'frm1701', 'txtPg1I1Year', 'txtPg1Pt1I5TIN1 txtPg1Pt1I5TIN2 txtPg1Pt1I5TIN3 txtPg1Pt1I5TIN4 hdnPg1Pt1I6RDOCode txtPg1Pt1I8TaxFiler txtPg1Pt1I10Address - - txtPg1Pt1I13Contact txtPg1Pt1I12Email'],
	'1701v2018': ['1701 · January 2018', 'Annual return for individuals, estates and trusts', 'frm1701', 'txtPg1I1Year', 'txtPg1I4TIN1 txtPg1I4TIN2 txtPg1I4TIN3 txtPg1I4BranchCode txtPg1I5RDOCode txtPg1I8TaxpayerName txtPg1I9Address txtPg1I9Address2 txtPg1I9AZipCode txtPg1I15TelNum @txtEmail'],
	'1701A': ['1701A · January 2018', 'Annual return for purely business or professional income', 'frm1701A', 'txtYear', 'txtTIN1 txtTIN2 txtTIN3 txtBranchCode txtRDOCode txtTaxpayerName txtAddress txtAddress2 txtZipCode txtTelNum @txtEmail'],
	'1701MS': ['1701-MS · August 2024', 'Annual return for micro and small individual taxpayers', 'frm1701MS', 'txtYearNo1', 'txtPg1TIN1 txtPg1TIN2 txtPg1TIN3 txtPg1BranchCode txtRDOCodea txtTaxpayerNo8a - - - txtTelNum10a txtEmaila'],
	'1701Q': ['1701Q · July 2008', 'Quarterly return for individuals, estates and trusts', 'frm1701q', 'txtYear', 'txt5TIN1 txt5TIN2 txt5TIN3 txt5BranchCode txt5RDOCode txtTaxPayername txt11Address - txt14zip txt15Telno @txtEmail'],
	'1701Qv2018': ['1701Q · January 2018', 'Quarterly return for individuals, estates and trusts', 'frm1701q', 'txtYear', 'txtTIN1 txtTIN2 txtTIN3 txtBranchCode txtRDOCode txtTaxpayerName txtAddress txtAddress2 txtZipCode - @txtEmail']
} as const;
type IncomeCode = keyof typeof codeDetails;
const pagesFiledFields: Partial<Record<IncomeCode, string>> = {
	'1700': 'frm1700:txtPg1Pt2NumberofPagesFiled',
	'1701': legacy1701Filing.pages
};
const first1701MSYear = 2024;
const firstRevisedIncomeYear = 2018;

const rules: Record<IncomeCode, { calculate: Rule; validate: ValidationRule; amount: (code: string) => string }> = {
	'1700': { calculate: calculateCompensation, validate: validateCompensation, amount: compensationAmountField },
	'1700v2018': { calculate: calculateCompensation, validate: validateCompensation, amount: compensationAmountField },
	'1701': { calculate: calculateAnnual, validate: validateAnnual, amount: annualAmountField },
	'1701v2018': { calculate: calculateAnnual, validate: validateAnnual, amount: annualAmountField },
	'1701Q': { calculate: calculateQuarterly, validate: validateQuarterly, amount: quarterlyAmountField },
	'1701Qv2018': { calculate: calculateQuarterly, validate: validateQuarterly, amount: quarterlyAmountField },
	'1701A': { calculate: (_, values) => calculate1701A(values), validate: (_, values) => validate1701A(values), amount: () => 'frm1701A:txt30' },
	'1701MS': { calculate: (_, values) => calculate1701MS(values), validate: (_, values) => validate1701MS(values), amount: () => 'frm1701MS:txtAggregateAmountPayable30a' }
};

export type IncomeForm = FormDefinition & {
	revision: string;
	year: string;
	quarter?: string;
	identity: Partial<Record<ProfileKey, string>>;
	defaults: Values;
	amount: string;
	pagesFiledField?: string;
};

const definitions = Object.fromEntries(Object.entries(codeDetails).map(([code, [revision, description, prefix, year, mapping]]) => {
	const id = code as IncomeCode;
	const identity = Object.fromEntries(mapping.split(' ').flatMap((field, index) =>
		field === '-' ? [] : [[identityKeys[index], field.startsWith('@') ? field.slice(1) : `${prefix}:${field}`]]
	));
	const profileFields = new Map(Object.entries(identity).map(([profileKey, field]) => [field, profileKey]));
	const fields: FormField[] = importedFields[id].map(field => ({
		id: field.id, label: field.label,
		type: field.type as FormField['type'], profileKey: profileFields.get(field.id),
		options: field.options.length ? field.options : undefined
	}));
	const defaultFields = importedFields[id].filter(field =>
		field.defaultValue !== '' && !(id === '1700' && field.page === '3' && field.defaultValue === '0')
	);
	const definition: IncomeForm = {
		code, revision, title: `${revision} | ${description}`, category: 'Individual Income Tax', status: 'ready',
		fields, identity, year: `${prefix}:${year}`, quarter: code.startsWith('1701Q') ? 'frm1701q:DateQuarter' : undefined,
		defaults: {
			...Object.fromEntries(defaultFields.map(field => [field.id, field.defaultValue])),
			...(id === '1701v2018' ? { 'frm1701:rdoPg1I13ForeignTaxCredits': 'No' } : {}),
			...(id === '1700' ? {
				'frm1700:rdoPg1Pt1I14ClaimingAdditionalExemptions': 'frm1700:rdoPg1Pt1I14NoInd',
				'frm1700:rdoPg1Pt1I21SpouseClaimAdditionalExemption': 'frm1700:rdoPg1Pt1I21SpouseClaimAdditionalExemptionNo'
			} : id === '1700v2018' ? {
				'frm1700:rdoPg1I6TaxpayerType': 'Employee',
				'frm1700:rdoPg1I20SpouseTaxpayerType': 'Employee',
				'frm1700:rdoPg1I24SpouseForeignTaxCredits': 'No'
			} : {})
		},
		amount: rules[id].amount(code),
		pagesFiledField: pagesFiledFields[id]
	};
	return [code, definition];
})) as Record<IncomeCode, IncomeForm>;

export const individualIncomeForms: FormDefinition[] = Object.values(definitions).map(({ code, title, category, status, fields }) => ({ code, title, category, status, fields }));

export function getIndividualIncomeForm(code: string): IncomeForm | undefined {
	return Object.hasOwn(definitions, code) ? definitions[code as IncomeCode] : undefined;
}

// The two legacy returns reserve separate boxes for the taxpayer’s name components.
export const incomeRegisteredNameContinuation = 'income:registeredNameContinuation';

export type IncomeProfileOptions = { openingDraft?: boolean };

export function incomeProfileValues(
	form: IncomeForm,
	profile: TaxpayerProfile,
	values: Values = {},
	{ openingDraft = true }: IncomeProfileOptions = {}
): Values {
	const branchCode = profile.branchCode;
	const fullName = joinRegisteredLines(registeredNameLines(profile));
	const result = Object.fromEntries(Object.entries(form.identity).map(([key, id]) => [id, key === 'email' ? (profile.email ?? '').trim().toLowerCase() : String(profile[key as ProfileKey] ?? '')]));
	if (form.identity.taxpayerName) result[form.identity.taxpayerName] = fullName;
	const addressFields = [form.identity.address, form.identity.address2,
		form.code === '1700' ? 'frm1700:txtPg1Pt1I9Address3' : undefined]
		.filter((id): id is string => !!id);
	Object.assign(result, mapRegisteredLines(addressFields, registeredAddressLines(profile), values));
	for (const field of form.fields) {
		const name = field.id.split(':').at(-1) ?? '';
		if (form.code === '1701v2018' && /^txtPg2I1(?:TIN[123]|BranchCode)$/.test(name)) continue;
		const repeatedTin = name.match(/^(?:txt)?Pg[1-9]\d*m?(?:Pt\d+)?(?:I\d+)?TIN([1234])(?:TYPE)?$/i);
		if (repeatedTin) {
			const digit = Number(repeatedTin[1]);
			result[field.id] = digit === 4 ? branchCode : profile[`tin${digit as 1 | 2 | 3}`];
		} else if (/^txtPg[1-9]\d*m?(?:Pt\d+)?(?:I\d+)?BranchCode(?:TYPE)?$/i.test(name)) {
			result[field.id] = branchCode;
		} else if (/^(?:txt)?Pg[1-9]\d*m?(?:Pt\d+)?(?:I\d+)?Taxpayer(?:Name)?(?:TYPE)?$/i.test(name)) {
			result[field.id] = fullName;
		} else if (form.code === '1701' && /^txtPg(?:[2-4]|12Pt9)TaxFiler$/.test(name)) {
			result[field.id] = profile.taxpayerName.split(',')[0].trim();
		} else if (form.code === '1701' && /^txtPg\d+m?(?:RegName|TaxName|RegisteredName)(?:TYPE)?$/.test(name)) {
			result[field.id] = fullName;
		}
	}

	const taxpayerType = incomeTaxpayerTypeValues(form.code, profile, values);
	const personal = incomePersonalValues(form.code, profile, { ...values, ...taxpayerType });
	if (form.code === '1700' || form.code === '1701') {
		const continuation = joinRegisteredLines(registeredNameLines(profile).slice(1));
		if (continuation || incomeRegisteredNameContinuation in values) {
			personal[incomeRegisteredNameContinuation] = continuation;
		}
		if (form.code === '1700' && continuation) personal['frm1700:txtPg1Pt2TaxFiler'] = fullName;
	}
	if (form.code === '1701') {
		const { tradeName: tradeNameId, taxpayerType: taxpayerTypeId } = legacy1701ProfileIds;
		const tradeName = profile.tradeName?.trim();
		const savedTradeName = values[tradeNameId];
		if (tradeName && (savedTradeName === undefined || (openingDraft && !savedTradeName.trim()))) {
			result[tradeNameId] = tradeName;
		}

		const previous = (values[incomeProfileFieldList] ?? '').split(',');
		const defaults = {
			[tradeNameId]: tradeName,
			[taxpayerTypeId]: incomeTaxpayerTypeValues(form.code, profile, {})[taxpayerTypeId]
		};
		// A matching value can identify an older draft's autofill on open. During edits,
		// only retain tracked autofills or mark newly applied defaults.
		const shownFromProfile = Object.entries(defaults).flatMap(([id, value]) => {
			const applied = result[id] ?? taxpayerType[id];
			return value && (applied === value || ((openingDraft || previous.includes(id)) && values[id] === value))
				? [id] : [];
		});
		personal[incomeProfileFieldList] = [personal[incomeProfileFieldList], ...shownFromProfile].filter(Boolean).join(',');
	}
	return { ...result, ...personal, ...taxpayerType };
}

export function createIndividualIncomeValues(form: IncomeForm, profile: TaxpayerProfile): Values {
	const values = { ...form.defaults, ...incomeProfileValues(form, profile, form.defaults) };
	if (form.code === '1700' && profile.civilStatus === 'Single') {
		values['frm1700:rdoPg1Pt1I3JointFiling'] = 'frm1700:rdoPg1Pt1I3JointFilingNo';
	}
	if (form.code === '1701MS' || form.code === '1701Qv2018') {
		const { year } = philippineCalendarDate();
		if (form.code === '1701MS' && year > first1701MSYear) values[form.year] = String(year - 1);
		if (form.code === '1701Qv2018' && year >= firstRevisedIncomeYear) values[form.year] = String(year);
	}
	return calculateIndividualIncome(form, values);
}

export const annualFilingFields: Partial<Record<string, { month: string; shortPeriod: string }>> = {
	'1701': { month: 'frm1701:ddlPg1I1Month', shortPeriod: 'frm1701:rdoPg1I3ShortPeriod' },
	'1701v2018': { month: 'frm1701:txtPg1I1Month', shortPeriod: 'frm1701:rdoPg1I3ShortPeriod' },
	'1701A': { month: 'frm1701A:txtMonth', shortPeriod: 'frm1701A:optShortPeriod' },
	'1701MS': { month: 'frm1701MS:txtMonthNo1', shortPeriod: 'frm1701MS:txtReturnPeriod' }
};

export function isShortFilingPeriod(fields: { shortPeriod: string }, values: Values): boolean {
	return ['Yes', 'Y'].includes(values[fields.shortPeriod]);
}

export function incomeAmountDecimals(form: IncomeForm): CurrencyDecimals {
	return form.quarter ? 2 : 0;
}

const amountFieldsByForm = new WeakMap<IncomeForm, ReadonlySet<string>>();

function incomeAmountFields(form: IncomeForm): ReadonlySet<string> {
	let ids = amountFieldsByForm.get(form);
	if (!ids) {
		ids = new Set(incomeEditorFields(form).filter(field => field.kind === 'money').map(field => field.id));
		amountFieldsByForm.set(form, ids);
	}
	return ids;
}

export function isIncomeAmount(form: IncomeForm, id: string): boolean {
	return incomeAmountFields(form).has(form.code === '1701v2018' ? revisedActivityTemplateId(id) : id) ||
		(form.code === '1701A' && /^frm1701A:txtmodalPartIV[AB]_\d+C[23]$/.test(id));
}

function roundIncomeAmounts(form: IncomeForm, values: Values): Values {
	if (incomeAmountDecimals(form) === 2) return values;
	const rounded = { ...values };
	for (const [id, raw] of Object.entries(values)) {
		if (!isIncomeAmount(form, id)) continue;
		const normalized = normalizeCurrencyInput(raw, true);
		if (!normalized) continue;
		const amount = Number(normalized);
		if (!Number.isInteger(amount)) rounded[id] = String(roundWholePeso(amount));
	}
	return rounded;
}

export function calculateIndividualIncome(form: IncomeForm, values: Values): Values {
	const filing = annualFilingFields[form.code];
	const inputs = filing && !isShortFilingPeriod(filing, values) ? { ...values, [filing.month]: '12' } : values;
	const code = form.code as IncomeCode;
	const calculated = rules[code].calculate(code, roundIncomeAmounts(form, inputs));
	if (!form.pagesFiledField) return calculated;

	const sourcePages = new Set(importedFields[code].map(field => field.page));
	const pages = [...sourcePages].filter(page => incomePageApplies(form, page, calculated));
	return { ...calculated, [form.pagesFiledField]: String(pages.length) };
}

/** Fields written by calculation keep their display role even if an older draft lacks their sources. */
export function incomeCalculatedFields(form: IncomeForm, values: Values): Set<string> {
	const selectors = Object.fromEntries(incomeEditorFields(form)
		.filter(field => field.kind === 'select' || field.kind === 'radio')
		.map(field => [field.id, values[field.id] ?? '']));
	if (form.code === '1701' || form.code === '1701v2018') {
		const fields = new Set<string>();
		if (form.code === '1701v2018') {
			for (const slot of revisedActivitySlots(values)) {
				const key = revisedActivityFieldId(revisedActivityRegimeId, slot);
				if (key in values) selectors[key] = values[key];
			}
		}
		calculateAnnual(form.code, selectors, fields);
		if (form.pagesFiledField) fields.add(form.pagesFiledField);
		return fields;
	}

	const fields = new Set(Object.keys(calculateIndividualIncome(form, selectors)).filter(id => !(id in selectors)));
	if (form.code === '1700') {
		fields.add('frm1700:txtPg2Pt4I8C1');
		fields.add('frm1700:txtPg2Pt4I8C2');
	}
	return fields;
}

export function incomePageApplies(form: IncomeForm, page: string, values: Values): boolean {
	if (/^\d+$/.test(page)) return true;
	if (form.code === '1701v2018' && page.endsWith('TYPE')) {
		return usesRevisedActivityAttachments(values, incomeIncludesSpouse(form.code, values));
	}
	return hasActivityAttachment(form, values);
}

export function hasActivityAttachment(form: IncomeForm, values: Values): boolean {
	if (form.code !== '1701' && form.code !== '1701v2018') return false;

	const june = form.code === '1701';
	const taxpayerElections = june
		? ['rdoPg1Pt1I22IncomeExempt', 'rdoPg1Pt1I23IncomeSpecial']
		: ['rdoPg1I19IncomeExempt', 'rdoPg1I20IncomeSpecial'];
	const spouseElections = june
		? ['rdoPg4Pt7I107YesNo', 'rdoPg4Pt7I108YesNo']
		: ['rdoPg2I10IncomeExempt', 'rdoPg2I11IncomeSpecial'];
	const selected = (election: string) => values['frm1701:' + election] === 'Yes';

	return taxpayerElections.some(selected) ||
		(incomeIncludesSpouse(form.code, values) && spouseElections.some(selected));
}

export function incomePaymentFieldIds(code: string): Set<string> {
	const fields = importedFields[code as IncomeCode];
	return new Set(fields.filter(field =>
		/^part\s+[ivx]+\s*-\s*details of payment$/i.test(field.section) ||
		(code === '1701' && /^frm1701:txtPg1Pt3I(?:38|39|40)/.test(field.id))
	).map(field => field.id));
}

export function incomeOutputValues(form: IncomeForm, values: Values): Values {
	const omitted = incomePaymentFieldIds(form.code);
	const output = { ...values };
	omitted.add('income:useSavedSpouse');
	omitted.add(incomeProfileFieldList);
	omitted.add(incomeRegisteredNameContinuation);
	if (form.code === '1701A') {
		if (!annual1701AFilerRate(values, false)) omitted.add('frm1701A:optTaxRate');
		if (!annual1701AFilerRate(values, true)) omitted.add('frm1701A:optSpouseTaxRate');
		for (const item of ['42', '51'] as const) {
			const base = annual1701ABaseDetailFields(item);
			const active = (['taxpayer', 'spouse'] as const).filter(person => shortAnnualFieldApplies(form.code, base[person], values));
			exportAnnual1701ADetails(item, output, active);
		}
	}
	if (form.code === '1700') {
		const claimant = legacy1700DependentClaim(values);
		const spouseClaim = 'frm1700:rdoPg1Pt1I21SpouseClaimAdditionalExemption';
		const joint = incomeIncludesSpouse(form.code, values);
		if (!joint) omitted.add(spouseClaim);
		const contact = 'frm1700:txtPg1Pt1I12ContactNo';
		if (!isLegacy1700ContactValid(values[contact] ?? '')) omitted.add(contact);
		if (claimant !== 'taxpayer') omitted.add('frm1700:txtPg1Pt1I15QualifyDependent');
		if (claimant !== 'spouse') {
			omitted.add('frm1700:txtPg1Pt1I22SpouseQualifiedDependentChildren');
			if (joint &&
				/(?:^|:)rdoPg1Pt1I21SpouseClaimAdditionalExemptionYes$/.test(values[spouseClaim] ?? '')) {
				output[spouseClaim] = 'frm1700:rdoPg1Pt1I21SpouseClaimAdditionalExemptionNo';
			}
		}
		if (!claimant) {
			for (const id of Object.keys(values)) if (/^frm1700:(?:txtPg4T2|rdoP4T2)/.test(id)) omitted.add(id);
		}
		if (values.GovorCTC === 'Gov') omitted.add('frm1700:txtPg1Pt2I34Amount');
		if (!['Y', 'true', '1', 'on'].includes(values['frm1700:txtPg1Pt1I9AddressChangedInd'])) {
			for (const id of Object.keys(values)) if (id.startsWith('frm1700:txtPg4T1')) omitted.add(id);
		}
	}
	if (!incomeIncludesSpouse(form.code, values)) {
		for (const id of incomeSpouseFieldIds(form.code)) omitted.add(id);
		if (form.code !== '1700') {
			for (const field of incomeEditorFields(form)) {
				if (field.person === 'spouse' && !/(?:SpouseHasIncome|SpouseIncome|FilingStatus)/i.test(field.id)) omitted.add(field.id);
			}
		}
	}
	if (form.code === '1700v2018') {
		for (const id of Object.keys(values)) if (!revised1700FieldApplies(id, values)) omitted.add(id);
		for (const row of revised1700EmployerRows) {
			if (revised1700EmployerHasEntry(values, row)) output[`frm1700:rdoPg2I${row}PartVIEmployee`] = revised1700EmployerAssignment(values, row);
		}
	}
	if (form.quarter) {
		for (const id of Object.keys(values)) if (!quarterlyIncomeFieldApplies(form.code, id, values)) omitted.add(id);
	}
	if (['1701', '1701v2018', '1701A', '1701MS'].includes(form.code)) {
		const applies = form.code === '1701' || form.code === '1701v2018' ? annualFieldApplies : shortAnnualFieldApplies;
		for (const id of Object.keys(values)) if (!applies(form.code, id, values)) omitted.add(id);
	}
	if (form.code === '1701v2018') {
		const joint = incomeIncludesSpouse(form.code, values);
		const activeKeys = new Set<string>();
		const fields = incomeEditorFields(form).filter(field => isRevisedActivityFieldId(field.id));
		if (usesRevisedActivityAttachments(values, joint)) {
			for (const slot of revisedActivitySlots(values)) {
				const regime = revisedActivityRegime(values, slot);
				if (!regime) continue;
				const taxpayer = revisedActivityRegimeApplies(values, false, regime);
				const spouse = joint && revisedActivityRegimeApplies(values, true, regime);
				if (!taxpayer && !spouse) continue;
				for (const field of fields) {
					if (field.person === 'taxpayer' && !taxpayer || field.person === 'spouse' && !spouse) continue;
					activeKeys.add(revisedActivityFieldId(field.id, slot));
				}
			}
		}
		for (const id of Object.keys(values)) {
			if (isRevisedActivityFieldId(id) && !activeKeys.has(id)) omitted.add(id);
		}
	}
	return Object.fromEntries(Object.entries(output).filter(([id]) => !omitted.has(id)));
}

export function validateIndividualIncome(form: IncomeForm, values: Values): Values {
	const errors = rules[form.code as IncomeCode].validate(form.code, roundIncomeAmounts(form, values), values);
	const filing = annualFilingFields[form.code];
	if (filing && isShortFilingPeriod(filing, values) && !/^(?:0[1-9]|1[0-2])$/.test(values[filing.month] ?? ''))
		errors[filing.month] = 'Select the last month of the short filing period.';
	const paymentFields = incomePaymentFieldIds(form.code);
	for (const field of paymentFields) delete errors[field];
	const year = incomeFilingYear(form, values[form.year]);
	const { minYear, maxYear } = incomeFilingYearBounds(form);
	if (!/^\d{4}$/.test(year) || Number(year) < minYear || Number(year) > maxYear) {
		errors[form.year] = form.code === '1700' ? `Enter a filing year from ${minYear} to ${maxYear}.` :
			['1701', '1701Q'].includes(form.code) ? 'Select a filing year through 2017 for this revision.' : `Enter a filing year from ${minYear} through ${maxYear}.`;
	}
	const tin = ['tin1', 'tin2', 'tin3'].map(key => values[form.identity[key as ProfileKey]!] ?? '');
	if (!tin.every(part => /^\d{3}$/.test(part)) || tin.join('') === '000000000') errors[form.identity.tin1!] = 'Enter a valid nine-digit TIN.';
	const branch = form.identity.branchCode!;
	// Both 1701Q revisions have a three-character entry field but copy the full
	// profile branch into it and validate that it has at least three digits.
	if (!/^\d{3,5}$/.test(values[branch] ?? '')) errors[branch] = 'Enter a three- to five-digit branch code.';
	for (const key of ['taxpayerName', 'address', 'zipCode'] as const) {
		const field = form.identity[key];
		if (field && !values[field]?.trim()) errors[field] = `Enter the ${{ taxpayerName: 'taxpayer’s name', address: 'registered address', zipCode: 'ZIP code' }[key]}.`;
	}
	const rdo = form.identity.rdoCode!;
	if (isPackagedRdoCode((values[rdo] ?? '').trim())) delete errors[rdo];
	else errors[rdo] = 'Enter a valid packaged RDO code.';
	const email = form.identity.email!;
	const emailError = taxpayerEmailError(values[email] ?? '', true);
	if (emailError) errors[email] = emailError;
	for (const field of form.fields) {
		if (field.id === form.pagesFiledField || paymentFields.has(field.id)) continue;
		if (form.code === '1701v2018' && isRevisedActivityFieldId(field.id)) continue;
		if (form.quarter && !quarterlyIncomeFieldApplies(form.code, field.id, values)) continue;
		if (form.code === '1700v2018' && !revised1700FieldApplies(field.id, values)) continue;
		const value = values[field.id]?.trim();
		if (!value) continue;
		if (field.type === 'number' && !/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?%?$/.test(value)) errors[field.id] ??= 'Enter a number with up to two decimal places.';
		if (field.options && !field.options.includes(value) && field.id !== rdo) errors[field.id] ??= 'Select one of the available values.';
		if (/Spouse.*RDO|RDOCodeb$|txt7RDOCode$/i.test(field.id)) {
			if (isPackagedRdoCode(value)) delete errors[field.id];
			else if (value !== '000') errors[field.id] = 'Enter a valid spouse RDO code.';
		}
	}
	if (form.code === '1701v2018' && incomePageApplies(form, '1mTYPE', values)) {
		const joint = incomeIncludesSpouse(form.code, values);
		const fields = incomeEditorFields(form).filter(field => isRevisedActivityFieldId(field.id) && (joint || field.person !== 'spouse'));
		for (const slot of revisedActivitySlots(values)) {
			for (const field of fields) {
				const id = revisedActivityFieldId(field.id, slot);
				const value = values[id]?.trim();
				if (value && (field.kind === 'money' || field.kind === 'number') && !/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?%?$/.test(value)) {
					errors[id] ??= 'Enter a number with up to two decimal places.';
				}
			}
		}
	}
	return errors;
}

export function incomeFilingYearBounds(form: IncomeForm) {
	if (form.code === '1700') return { minYear: legacy1700FirstYear, maxYear: legacy1700LastYear };
	if (['1701', '1701Q'].includes(form.code)) return { minYear: 1900, maxYear: legacy1700LastYear };
	const currentYear = form.code === '1701MS' || form.code === '1701Qv2018'
		? philippineCalendarDate().year : new Date().getFullYear();
	return { minYear: form.code === '1701MS' ? first1701MSYear : firstRevisedIncomeYear, maxYear: currentYear };
}

export function incomeFilingYear(form: IncomeForm, value = '') {
	return ['1700', '1701'].includes(form.code) && /^\d{2}$/.test(value) ? '20' + value : value;
}

export function individualIncomePeriod(form: IncomeForm, values: Values): string {
	const year = incomeFilingYear(form, values[form.year]) || 'YYYY';
	return form.quarter ? `${year}Q${values[form.quarter] || ''}` : year;
}
