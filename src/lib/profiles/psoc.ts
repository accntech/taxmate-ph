// PSA’s 2012 PSOC for POPCEN 2015, hierarchical list and alphabetical index.
// https://catalog.ihsn.org/catalog/7186/download/86010
import unitGroups from './psoc-unit-groups.json';

const titlesByCode = new Map(unitGroups.map(([code, title]) => {
	const label = title.charAt(0) + title.slice(1).toLowerCase().replace(/\bict\b/g, 'ICT');
	return [code, label] as const;
}));

export const psocOptions = [
	{ value: '', label: 'Not specified' },
	...Array.from(titlesByCode, ([code, label]) => ({ value: code, label, secondary: code }))
];

export function describePsoc(code: string | undefined): string {
	if (!code) return '';
	const title = titlesByCode.get(code);
	return title ? `${code} · ${title}` : code;
}
