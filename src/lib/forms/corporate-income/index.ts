import { corporateBackgroundRows, isRegisteredInformationRow } from './background-layout';
import { corporateOwnerRequired, corporateOwnerSelection, corporateRecordSection, ownerListLabel } from './editor-lists';
import { exemptForms } from './exempt';
import { corporateContinuationRowsPerPage } from './continuation-pagination';
import { mixedForms } from './mixed';
import { legacyMixedOtherAtcElected } from './mixed/atc';
import { quarterlyForms } from './quarterly';
import { regularForms } from './regular';
import type { FormDefinition } from '..';
import { joinRegisteredLines, mapRegisteredLines, registeredAddressLines, registeredNameLines, taxpayerEmailError, type TaxpayerProfile } from '$lib/profiles/profile';
import { isPackagedRdoCode } from '$lib/profiles/rdo-codes';
import { psicClassCode } from '$lib/profiles/psic';
import { normalizeCurrencyInput } from '$lib/components/ui/currency-input/currency';
import { philippineCalendarDate } from '../filing-calendar';
import { externalAuditorLabels } from '../external-auditor';
import type { CorporateField, CorporateForm, CorporatePage, CorporateRow, CorporateSection, CorporateValues } from './types';

const forms = [...exemptForms, ...mixedForms, ...quarterlyForms, ...regularForms];
const catalog = new Map(forms.map(form => [form.code, form]));
function pageFields(pages: CorporatePage[]): CorporateField[] {
	return [...new Map(pages.flatMap(page => page.sections.flatMap(section =>
		section.rows.flatMap(row => row.fields.map(field => field.label ? field : { ...field, label: row.label }))
	)).map(field => [field.id, field])).values()];
}
const fields = new Map(forms.map(form => [form, pageFields(form.pages)]));

export function corporateAttachmentInstances(form: CorporateForm, values: CorporateValues) {
	return (form.attachmentGroups ?? []).flatMap(group => {
		if (!group.applies(values)) return [];
		const count = Math.max(0, Math.min(99, Math.floor(Number(values[group.countField])) || 0));
		return Array.from({ length: count }, (_, index) => ({
			group, id: `${group.key}${index + 1}`, title: `${group.label} ${index + 1}`
		}));
	});
}

function corporateCoverSection(section: CorporateSection, pagesFiledField?: string): CorporateSection {
	const rows = section.rows.flatMap((row): CorporateRow[] => {
		const fields = row.fields.filter(field => field.id !== pagesFiledField &&
			!/:txt(?:Signature(?:President|Treasurer)|Pg1Pt2(?:AuthorizedRepresentative|Treasurer|Signatory(?:Tin)?[12]?|TitleofSignatory2?|TINofSignatory2?))$/i.test(field.id));
		if (!fields.length) return [];
		const attachment = fields.find(field =>
			/^(?:frm1702(?:EX|MX):txtPg1P2I23NumOfAttachments|frm1702RT:txtPg1Pt2PagesFilled|frm1702q:txtSheets)$/.test(field.id));
		if (!attachment) return [fields.length === row.fields.length ? row : { ...row, fields }];

		const label = attachment.id === 'frm1702q:txtSheets' ? row.label : 'Number of attachments';
		const countRow: CorporateRow = {
			item: row.item ?? '22',
			label,
			fields: [{ ...attachment, label, kind: 'integer', maxLength: attachment.maxLength ?? 2 }]
		};
		const otherFields = fields.filter(field => field !== attachment);
		return otherFields.length ? [{ ...row, fields: otherFields }, countRow] : [countRow];
	});
	return { ...section, rows };
}

export const corporateAuditorSectionTitle = 'Part VI - Information - External Auditor/Accredited Tax Agent';

function corporateAuditorRows(section: CorporateSection, code: string): CorporateSection {
	if (section.title !== corporateAuditorSectionTitle) return section;
	const firstItem = code === '1702RT' ? 55 : 45;
	const fields = section.rows.flatMap(row => row.fields);
	const rows = Object.values(externalAuditorLabels).map((label, index): CorporateRow => {
		const item = String(firstItem + index);
		const prefix = `frm${code}:txtPg2Pt6I${item}`;
		return {
			item, label,
			fields: fields.filter(field => field.id.startsWith(prefix)).map(field => ({
				...field, label,
				kind: label === externalAuditorLabels.issueDate || label === externalAuditorLabels.expiryDate ? 'date' : field.kind
			}))
		};
	});
	return { ...section, rows };
}

export function corporateEditorPages(form: CorporateForm, values: CorporateValues): CorporatePage[] {
	const fixed = form.expandPages?.(values) ?? form.pages;
	const attachments = corporateAttachmentInstances(form, values).flatMap(({ group, id, title }) => {
		const pages = group.templatePages.map(page => ({
			title: `${title} · ${page.title}`,
			sections: page.sections.map(section => ({
				...section,
				rows: section.rows.map(row => ({
					...row,
					entry: row.entry && { ...row.entry, group: row.entry.group.replaceAll('AttM', id) },
					fields: row.fields.map(field => ({
						...field, id: field.id.replaceAll('AttM', id),
						options: field.options?.map(option => ({ ...option, value: option.value.replaceAll('AttM', id) }))
					}))
				}))
			}))
		}));
		return group.expandPages?.(pages, values, id) ?? pages;
	});
	return [...fixed, ...attachments].map((page, index) => ({
		...page,
		sections: page.sections
			.filter(section => !/\b(?:details of payment|payment details)\b/i.test(section.title))
			.map(section => index === 0 ? corporateCoverSection(section, form.pagesFiledField) : section)
			.map(section => corporateAuditorRows(section, form.code))
			.filter(section => section.rows.length > 0)
			.map(corporateRecordSection)
			.map(section => form.fieldReadonly ? {
				...section,
				rows: section.rows.map(row => ({
					...row,
					fields: row.fields.map(field => form.fieldReadonly?.(field.id, values)
						? { ...field, readonly: true }
						: field)
				}))
			} : section)
	}));
}

export function getCorporateIncomeForm(code: string): CorporateForm | undefined {
	return catalog.get(code);
}

export function corporateFields(form: CorporateForm): CorporateField[] {
	return fields.get(form) ?? [];
}

export const corporateIncomeForms: FormDefinition[] = forms.map(form => ({
	code: form.code,
	title: `${form.revision} | ${form.title}`,
	category: 'Corporate Income Tax',
	status: 'ready',
	fields: corporateFields(form).map(field => ({
		id: field.id,
		label: field.label || field.id,
		type: field.options ? 'select' : ['money', 'integer', 'percent'].includes(field.kind) ? 'number' : 'text',
		required: field.required,
		profileKey: field.profileKey,
		options: field.options?.map(option => option.value)
	}))
}));

export function corporateProfileField(form: CorporateForm, key: keyof TaxpayerProfile): string | undefined {
	return corporateFields(form).find(field => field.profileKey === key)?.id;
}

function registeredRows(form: CorporateForm) {
	return form.pages[0].sections.filter(section => /background information/i.test(section.title))
		.flatMap(section => corporateBackgroundRows(form, section.rows)).filter(isRegisteredInformationRow);
}

export function corporateProfileValues(
	form: CorporateForm,
	profile: TaxpayerProfile,
	saved: CorporateValues = {}
): CorporateValues {
	const result: CorporateValues = {};
	for (const { id, profileKey } of corporateFields(form)) {
		if (!profileKey) continue;
		if (form.code === '1702MX' && profileKey === 'psicCode') {
			const code = psicClassCode(profile.psicCode);
			if (code) result[id] = code;
			continue;
		}
		const value = profileKey === 'taxpayerName' ? joinRegisteredLines(registeredNameLines(profile)) : profile[profileKey];
		if (form.code === '1702MX' && profileKey === 'lineOfBusiness' && !profile.lineOfBusiness?.trim()) continue;
		if (typeof value === 'string') result[id] = profileKey === 'email' ? value.trim().toLowerCase() : value;
		else result[id] = '';
	}
	for (const row of registeredRows(form)) {
		const lines = row.fields[0].profileKey === 'taxpayerName' ? registeredNameLines(profile) : registeredAddressLines(profile);
		Object.assign(result, mapRegisteredLines(row.fields.map(field => field.id), lines, saved));
	}
	return result;
}

export function calculateCorporateIncome(form: CorporateForm, values: CorporateValues): CorporateValues {
	const result = form.calculate(values);
	const instances = corporateAttachmentInstances(form, result);
	if (!instances.length && !form.pagesFiledField) return result;
	const populated = { ...result };
	const nameRow = instances.length ? registeredRows(form).find(row => row.fields[0].profileKey === 'taxpayerName') : undefined;
	const registeredName = nameRow && joinRegisteredLines(nameRow.fields.map(field => result[field.id]));
	if (form.pagesFiledField) {
		const attachmentPages = instances.reduce((total, { group }) => total + group.templatePages.length, 0);
		const continuationPages = (form.continuations?.(result) ?? []).reduce(
			(total, section) => total + Math.ceil(section.rows.length / corporateContinuationRowsPerPage),
			0
		);
		populated[form.pagesFiledField] = String(form.pages.length + attachmentPages + continuationPages);
	}
	for (const { group, id } of instances) {
		for (const field of pageFields(group.templatePages)) {
			if (!field.profileKey) continue;
			const source = corporateProfileField(form, field.profileKey);
			if (source) populated[field.id.replaceAll('AttM', id)] = (field.profileKey === 'taxpayerName' ? registeredName : undefined) ?? result[source] ?? '';
		}
	}
	return populated;
}

export function createCorporateIncomeValues(form: CorporateForm, profile: TaxpayerProfile): CorporateValues {
	const defaults: CorporateValues = {};
	for (const { id, defaultValue } of corporateFields(form)) {
		if (defaultValue !== undefined) defaults[id] = defaultValue;
	}
	const year = philippineCalendarDate().year - (form.quarter ? 0 : 1);
	const years = corporateFields(form).find(field => field.id === form.year)?.options?.filter(option => /^\d{4}$/.test(option.value));
	const supportedYear = years?.find(option => Number(option.value) === year) ??
		years?.reduce((latest, option) => Number(option.value) > Number(latest.value) ? option : latest);
	const values = { ...defaults, [form.year]: supportedYear?.value ?? String(year), ...corporateProfileValues(form, profile) };
	return calculateCorporateIncome(form, values);
}

export function corporateReturnPeriod(form: CorporateForm, values: CorporateValues): string {
	const year = values[form.year] || 'YYYY';
	if (form.quarter) {
		const quarter = values[form.quarter]?.match(/[1-3]/)?.[0];
		return quarter ? `${year}Q${quarter}` : `${year}Q`;
	}
	const month = form.month && values[form.month];
	return /^\d{1,2}$/.test(month || '') ? `${year}-${month!.padStart(2, '0')}` : year;
}

export function corporateFieldLabel(form: CorporateForm, values: CorporateValues, id: string): string | undefined {
	for (const page of corporateEditorPages(form, values)) {
		for (const section of page.sections) {
			for (const row of section.rows) {
				const field = row.fields.find(field => field.id === id);
				if (!field) continue;
				const label = field.label || row.label || section.title;
				if (row.list && row.item) return `${row.list} · Item ${row.item.toUpperCase()} · ${label}`;
				if (row.entry && row.item) return `Entry ${row.item.toUpperCase()} · ${label}`;
				return label;
			}
		}
	}
	if (id.endsWith(':totalEXAttach') || id.endsWith(':totalSPAttach')) return 'Activity attachments';
}

export function corporateFieldRequired(form: CorporateForm, field: CorporateField, values: CorporateValues, row?: CorporateRow): boolean {
	if (form.fieldApplies && !form.fieldApplies(field.id, values)) return false;
	const key = field.id.split(':').at(-1) ?? '';
	if (field.profileKey && /^(?:tin[123]|branchCode|rdoCode|taxpayerName|address|contactNumber|email)$/.test(field.profileKey)) return true;
	if (field.required || [form.year, form.month, form.periodType, form.quarter].includes(field.id)) return true;
	if (field.kind === 'date' && /(?:Incorporation|txtPg1Pt1I(?:8|10)$)/.test(key)) return true;
	if (/^(?:lstTaxTreaty|txtTxRlfSpcfy|Pg1Pt2I21|rdoPg1(?:Pt2I21)?Overpayment)$/.test(key)) return true;
	if (form.code.startsWith('1702EX') && /^txtPg1Pt1I\d+(?:LegalBasis|Investment|RegisteredActivity|EffectivityFrom|EffectivityTo)$/.test(key)) return true;
	if (form.code === '1702MX' && key === 'drpPg1I5ATCR2') return legacyMixedOtherAtcElected(values);
	if (form.code.startsWith('1702MX') && key === 'drpPg1I5ATCR2') {
		return !['Y', 'IC055', 'true', '1'].includes(values['frm1702MX:chkPg1I5ATCR1']);
	}
	if (form.code.startsWith('1702RT') && key === 'drpPg1I5AtcOther') return true;
	if (/^rdoPg1Pt1I\d+(?:ItemizedDeduction|MethodOfDeduc)$/.test(key)) return true;
	if (!row || field.profileKey || field.readonly) return false;
	if (row.list === ownerListLabel) return corporateOwnerRequired(form.code, row, field, values);
	const amountEntered = row.fields.some(item => item.kind === 'money' && !item.readonly
		&& Number(normalizeCurrencyInput(values[item.id] ?? '', true)) !== 0);
	return field.kind === 'text' && /^(?:description|legal basis)$/i.test(field.label ?? '') && amountEntered;
}

export function validateCorporateIncome(form: CorporateForm, values: CorporateValues): CorporateValues {
	const errors = form.validate?.(values) ?? {};
	const ownerSelection = corporateOwnerSelection(form.code);
	if (ownerSelection && !ownerSelection.some(id => values[id] === 'Y')) {
		errors[ownerSelection[0]] ??= 'Select stockholders, partners, or members.';
	}
	for (const page of corporateEditorPages(form, values)) for (const section of page.sections) for (const row of section.rows) for (const field of row.fields) {
		if (form.fieldApplies && !form.fieldApplies(field.id, values)) continue;
		const value = values[field.id]?.trim() ?? '';
		if (corporateFieldRequired(form, field, values, row) && !value) errors[field.id] ??= 'Required.';
		if (!value) continue;
		if (row.list === ownerListLabel && /tin[1-4]$/i.test(field.id)) {
			const valid = (field.id.endsWith('4') ? /^\d{3,5}$/ : /^\d{3}$/).test(value);
			if (!valid) errors[field.id] ??= 'Enter a valid TIN and branch code.';
		}
		if (corporateOwnerRequired(form.code, row, field, values) && (field.kind === 'money' || field.kind === 'percent')
			&& !(Number(normalizeCurrencyInput(value, true)) > 0)) errors[field.id] ??= 'Enter a value greater than zero.';
		if (field.options && !field.options.some(option => option.value === value)) errors[field.id] ??= 'Choose a valid option.';
		if (field.kind === 'money' && normalizeCurrencyInput(value, true) === null) {
			errors[field.id] ??= 'Enter a valid amount.';
		}
		if (field.kind === 'integer' && !/^\d+$/.test(value)) errors[field.id] ??= 'Enter a whole number.';
		if (field.kind === 'percent' && (!/^\d+(?:\.\d+)?$/.test(value) || Number(value) > 100)) {
			errors[field.id] ??= 'Enter a percentage between 0 and 100.';
		}
		if (field.profileKey && /^tin[123]$/.test(field.profileKey) && !/^\d{3}$/.test(value)) errors[field.id] ??= 'Enter a valid TIN.';
		if (field.profileKey === 'rdoCode' && !isPackagedRdoCode(value)) errors[field.id] ??= 'Enter a valid RDO code.';
	}
	const email = corporateProfileField(form, 'email');
	if (email) {
		const error = taxpayerEmailError(values[email] ?? '', true);
		if (error) errors[email] ??= error;
	}
	const year = values[form.year] ?? '';
	if (!/^\d{4}$/.test(year)) {
		errors[form.year] ??= 'Enter a four-digit taxable year.';
	} else if (!errors[form.year]) {
		const today = philippineCalendarDate();
		const periodType = values[form.periodType ?? ''];
		const yearEndMonth = form.quarter && periodType === 'C' ? 12 : Number(values[form.month ?? '']);
		const quarter = form.quarter ? Number(values[form.quarter]) : 4;
		const latestYear = today.year + (form.quarter && periodType === 'F' ? 1 : 0);
		const hasMonth = Number.isInteger(yearEndMonth) && yearEndMonth >= 1 && yearEndMonth <= 12;
		const hasQuarter = !form.quarter || [1, 2, 3].includes(quarter);
		// A quarterly return can close before the calendar year of its fiscal year end.
		const closingMonth = Number(year) * 12 + yearEndMonth - (4 - quarter) * 3;
		if (Number(year) > latestYear || (hasMonth && hasQuarter && closingMonth >= today.year * 12 + today.month)) {
			errors[form.year] = 'Choose an ended taxable period.';
		}
	}
	return errors;
}
