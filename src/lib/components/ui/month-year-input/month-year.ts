export const calendarMonths = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];

export function monthNumber(index: number) {
	return String(index + 1).padStart(2, '0');
}

export function splitMonthYear(value: string, fixedMonth: string) {
	const compact = value.replace(/\s/g, '');
	if (fixedMonth) return { month: fixedMonth, year: compact };
	const slash = /^([0-9]{0,2})\/([0-9]*)$/.exec(compact);
	const digits = /^([0-9]{0,2})([0-9]*)$/.exec(compact);
	const parts = slash ?? digits;
	return { month: parts?.[1] ?? '', year: parts?.[2] ?? '' };
}
