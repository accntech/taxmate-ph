import { get1601EQATCs, get1601EQATCDescription } from './form-1601-eq-atcs';

export function filterATCOptions(category: string, query: string, selected = '') {
	const codes = [...get1601EQATCs(category)];
	if (selected && !codes.includes(selected)) codes.unshift(selected);
	const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
	return codes.map(value => ({ value, description: get1601EQATCDescription(value, category) }))
		.filter(option => terms.every(term => `${option.value} ${option.description}`.toLocaleLowerCase().includes(term)));
}
