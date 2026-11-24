// Four-digit classes and five-digit subclasses from the BIR-published 2019 Updates to the 2009 PSIC.
// https://bir-cdn.bir.gov.ph/BIR/pdf/PSA_PSIC%202019.pdf
import industries from './psic-industries.json';

const titles = new Map(industries.map(([code, label]) => [code, label] as const));
const options = [
	{ value: '', label: 'Not specified' },
	...Array.from(titles, ([code, label]) => ({ value: code, label, secondary: code }))
];

export function psicOptionsForCode(code?: string) {
	return code && !titles.has(code)
		? [{ value: code, label: 'Previously saved code', secondary: code }, ...options]
		: options;
}
