import { formatIso, parseIso } from '$lib/components/ui/date-input/date-arithmetic';
import type { CorporateValues } from '../types';

export const legacyExemptIdentificationFields = {
	type: 'CTCorReg',
	number: 'frm1702EX:txtPg1Pt2I23CommunityTax',
	issueDate: 'frm1702EX:txtPg1Pt1I24DateofIssue',
	issuePlace: 'frm1702EX:txtPg1Pt1I25PlaceofIssue',
	amount: 'frm1702EX:txtPg1Pt1I26Amount',
	registration: 'Reg'
} as const;

export type LegacyCorporateIdentificationFields = {
	type: string;
	number: string;
	issueDate: string;
	issuePlace: string;
	amount: string;
	registration: 'Reg' | 'SEC';
};

function identificationType(value: string | undefined): string | undefined {
	// The legacy filing export uses SEC, while the editor control uses Reg.
	return value === 'SEC' ? 'Reg' : value;
}

function cleanNumber(type: string | undefined, value: string): string {
	if (type === 'CTC') return value.replace(/\D/g, '').slice(0, 8);
	if (type === 'Reg') return value.replace(/[^a-z0-9 .,#@'()_-]/gi, '').toUpperCase().slice(0, 10);
	return value;
}

export function legacyExemptIdentificationPatch(values: CorporateValues, id: string, value: string, fields: LegacyCorporateIdentificationFields = legacyExemptIdentificationFields): CorporateValues {
	const previous = identificationType(values[fields.type]);
	if (id === fields.number) return { [id]: cleanNumber(previous, value) };
	const patch = { [id]: value };
	if (id !== fields.type || previous === identificationType(value)) return patch;
	if (previous === 'CTC' || previous === 'Reg') {
		patch[fields.number] = '';
		patch[fields.issueDate] = '';
	}
	if (identificationType(value) === 'Reg') patch[fields.amount] = '0';
	return patch;
}

export function normalizeLegacyExemptIdentification(values: CorporateValues, fields: LegacyCorporateIdentificationFields = legacyExemptIdentificationFields): void {
	if (identificationType(values[fields.type]) !== 'Reg') return;
	values[fields.type] = fields.registration;
	values[fields.amount] = '0';
}

export function validateLegacyExemptIdentification(
	values: CorporateValues,
	today: { year: number; month: number; day: number },
	fields: LegacyCorporateIdentificationFields = legacyExemptIdentificationFields,
	maxRegistrationAge: number | null = 50
): CorporateValues {
	const errors: CorporateValues = {};
	const type = identificationType(values[fields.type]);
	const number = values[fields.number]?.trim() ?? '';
	if (type !== 'CTC' && type !== 'Reg') errors[fields.type] = 'Select a certificate or registration type.';
	if (!number) errors[fields.number] = 'Enter the certificate or registration number.';
	else if (type === 'CTC' && !/^\d{1,8}$/.test(number)) {
		errors[fields.number] = 'Enter up to eight digits for the community tax certificate number.';
	} else if (type === 'Reg' && cleanNumber(type, number) !== number.toUpperCase()) {
		errors[fields.number] = 'Enter a valid SEC registration number of up to ten characters.';
	}
	const date = values[fields.issueDate]?.trim() ?? '';
	const legacy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(date);
	const iso = legacy ? formatIso(Number(legacy[3]), Number(legacy[1]), Number(legacy[2])) : date;
	const issue = parseIso(iso);
	if (!date) errors[fields.issueDate] = 'Enter the date of issue.';
	else if (!issue || issue.y < 1800) errors[fields.issueDate] = 'Enter a valid date of issue.';
	else if (iso > formatIso(today.year, today.month, today.day)) errors[fields.issueDate] = 'The date of issue cannot be in the future.';
	else if (type === 'CTC' && issue.y !== today.year) errors[fields.issueDate] = 'Use a community tax certificate issued this year.';
	else if (type === 'Reg' && maxRegistrationAge !== null && issue.y < today.year - maxRegistrationAge) errors[fields.issueDate] = `The SEC registration date must be within the last ${maxRegistrationAge} calendar years.`;
	if (!values[fields.issuePlace]?.trim()) errors[fields.issuePlace] = 'Enter the place of issue.';
	return errors;
}
