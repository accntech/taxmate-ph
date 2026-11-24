import { currencyInputError, normalizeCurrencyInput } from '$lib/components/ui/currency-input/currency';
import type { IncomeEditorField } from './editor-layout';

type Values = Record<string, string>;

export function is1701CurrentLoss(id: string) {
	return /^frm1701:txt(?:Pg[34]IShed6_(?:7|12)A|Pg8Sc8[AB]1I4Amount)$/.test(id);
}

export function allowsSignedScheduleAmount(id: string) {
	return /^frm1701:txtPg3IShed6_1[AB]$/.test(id);
}

export function validate1701ScheduleRow({
	code, fields, scheduleFields, values, calculated, adding
}: {
	code: string;
	fields: IncomeEditorField[];
	scheduleFields: IncomeEditorField[];
	values: Values;
	calculated: Values;
	adding: boolean;
}): Values {
	const errors: Values = {};
	const input = (field: IncomeEditorField) => (values[field.id] ?? '').trim();
	const value = (field: IncomeEditorField) => Number(normalizeCurrencyInput(
		is1701CurrentLoss(field.id) ? calculated[field.id] ?? '' : input(field), allowsSignedScheduleAmount(field.id)
	) ?? 0);

	const amounts = fields.filter(field => field.kind === 'money');
	for (const field of amounts) {
		if (is1701CurrentLoss(field.id) || /(?:\d+E|NetOperatingLoss)$/.test(field.id)) continue;
		const error = currencyInputError(input(field), allowsSignedScheduleAmount(field.id));
		if (error) errors[field.id] = error;
	}

	const description = fields.find(field => field.column === 'Description');
	const legalBasis = fields.find(field => field.column === 'Legal basis');
	if (description && legalBasis && (adding || input(description) || input(legalBasis) || amounts.some(field => value(field) || errors[field.id]))) {
		if (code === '1701v2018' || code === '1701MS') {
			if (!input(description)) errors[description.id] = 'Enter the special deduction description.';
			if (!input(legalBasis)) errors[legalBasis.id] = 'Enter the legal basis for the special deduction.';
		}
		if (amounts.length && !amounts.some(field => value(field) > 0 || errors[field.id])) {
			errors[amounts[0].id] = 'Enter a deduction amount greater than zero.';
		}
	}

	const yearField = fields.find(field => field.column === 'Year incurred');
	const lossField = amounts.find(field => field.column === 'Net operating loss');
	if (!yearField || !lossField) return errors;

	const adjustments = amounts.filter(field => ['Applied in prior years', 'Expired loss', 'Applied this year'].includes(field.column ?? ''));
	const current = is1701CurrentLoss(lossField.id);
	const year = input(yearField);
	const rawFilingYear = values['frm1701:txtPg1I1Year']?.trim() ?? '';
	const filingYear = Number(code === '1701' && /^\d{2}$/.test(rawFilingYear) ? '20' + rawFilingYear : rawFilingYear);
	const loss = value(lossField);
	const started = adding || !!year || loss > 0 || adjustments.some(field => value(field) || errors[field.id]);
	if (!started) return errors;
	if ((!current || year) && (!/^\d{4}$/.test(year) || Number(year) < 1900)) {
		errors[yearField.id] = 'Enter a four-digit year.';
	} else if (year && filingYear >= 1900) {
		if (current && Number(year) !== filingYear) {
			errors[yearField.id] = 'Use the filing year for the current-year loss.';
		} else if (!current && code === '1701v2018' && Number(year) >= filingYear) {
			errors[yearField.id] = 'Enter a year before the filing year.';
		} else if (!current && code === '1701' && (Number(year) < filingYear - 3 || Number(year) > filingYear)) {
			errors[yearField.id] = `Enter a year from ${filingYear - 3} to ${filingYear}.`;
		}
	}
	if (code === '1701' && year && !errors[yearField.id] && scheduleFields.some(field =>
		field.id !== yearField.id && field.column === 'Year incurred' && input(field) === year
	)) errors[yearField.id] = 'This year already has a loss carryover entry.';
	if (!current && !errors[lossField.id] && loss <= 0) errors[lossField.id] = 'Enter a net operating loss greater than zero.';

	if (!errors[lossField.id] && !adjustments.some(field => errors[field.id])) {
		let total = 0;
		for (const field of adjustments) {
			total += value(field);
			if (total > loss) {
				errors[field.id] = 'Applied and expired amounts together cannot exceed the net operating loss.';
				break;
			}
		}
	}
	return errors;
}
