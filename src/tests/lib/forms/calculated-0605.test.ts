import { expect, it } from 'vitest';
import { getReturnExportValues, validateReturnValues } from '$lib/forms/form-runtime';

it('uses December to validate and export a calendar-year 0605 draft', () => {
	const values = {
		'frm0605:txtClassification': 'N',
		'frm0605:itemFiscalStartMonth': 'Calendar',
		'frm0605:itemYearEndMonth': '06',
		'frm0605:txtYearEnded': '2025',
		'frm0605:date': '2025-11-01'
	};
	expect(getReturnExportValues('0605', values)['frm0605:itemYearEndMonth']).toBe('12');
	expect(validateReturnValues('0605', values)['frm0605:date']).toBeUndefined();
});
