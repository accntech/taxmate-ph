// Four-digit classes and five-digit subclasses from the BIR-published 2019 Updates to the 2009 PSIC.
// https://bir-cdn.bir.gov.ph/BIR/pdf/PSA_PSIC%202019.pdf
import industries from './psic-industries.json';

const titles = new Map(industries.map(([code, label]) => [code, label] as const));
const options = [
	{ value: '', label: 'Not specified' },
	...Array.from(titles, ([code, label]) => ({ value: code, label, secondary: code }))
];

const classOptions = options.filter(option => /^\d{4}$/.test(option.value));

export function psicClassCode(code = '') {
	return /^\d{4,5}$/.test(code.trim()) ? code.trim().slice(0, 4) : '';
}

export function psicOptionsForCode(code?: string, classesOnly = false) {
	const availableOptions = classesOnly ? classOptions : options;
	return code && (!titles.has(code) || (classesOnly && code.length !== 4))
		? [{ value: code, label: 'Previously saved code', secondary: code }, ...availableOptions]
		: availableOptions;
}
