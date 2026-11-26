import { expect, it } from 'vitest';
import { validateReturnValues } from '$lib/forms/form-runtime';
import { philippineCalendarDate } from '$lib/forms/filing-calendar';

const type = 'frm1702RT:rdoPg1Pt2I22';
const number = 'frm1702RT:txtPg1Pt2I22CTC';
const date = 'frm1702RT:txtPg1Pt2I23Date';
const place = 'frm1702RT:txtPg1Pt2I24PlaceOfIssue';
const amount = 'frm1702RT:txtPg1Pt2I25AmountCTC';

it('requires a current-year certificate and positive CTC amount for June 2013 Form 1702RT', () => {
	const { year } = philippineCalendarDate();
	const values = { [type]: 'CTC', [number]: '00123456', [date]: `01/01/${year - 1}`, [place]: 'Example City', [amount]: '0' };
	expect(validateReturnValues('1702RT', values)).toMatchObject({
		[date]: 'Use a community tax certificate issued this year.',
		[amount]: 'Enter a community tax certificate amount.'
	});
	expect(validateReturnValues('1702RT', { ...values, [date]: `01/01/${year}`, [amount]: '925' })[amount]).toBeUndefined();
});

it('accepts a June 2013 Form 1702RT SEC registration over 50 years old', () => {
	const { year } = philippineCalendarDate();
	const values = { [type]: 'SEC', [number]: 'CS-00123', [date]: `01/01/${year - 51}`, [place]: 'Example City' };
	const errors = validateReturnValues('1702RT', values);
	for (const field of [type, number, date, place, amount]) expect(errors[field]).toBeUndefined();
});
