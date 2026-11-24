import { normalizeCurrencyInput } from '$lib/components/ui/currency-input/currency';

export type Annual1701ADetailItem = '42' | '51';
export type Annual1701ADetailPerson = 'taxpayer' | 'spouse';
type Values = Record<string, string>;
type Amounts = Record<Annual1701ADetailPerson, string>;

const sections = { 42: 'IVA', 51: 'IVB' } as const;
const prefix = 'frm1701A:';
const people = ['taxpayer', 'spouse'] as const;

export function annual1701ADetailAmount(value: string): number {
	return Number(normalizeCurrencyInput(value));
}

function annual1701ADetailHasAmount(value: string): boolean {
	const normalized = normalizeCurrencyInput(value);
	return normalized === null || Number(normalized) !== 0;
}

export function annual1701ADetailHasDormantAmount(amounts: Amounts, active: readonly Annual1701ADetailPerson[]): boolean {
	return people.some(person => !active.includes(person) && annual1701ADetailHasAmount(amounts[person]));
}

function detailPrefix(item: Annual1701ADetailItem): string {
	return `${prefix}txtmodalPart${sections[item]}`;
}

export function annual1701ABaseDetailFields(item: Annual1701ADetailItem) {
	return {
		description: `${prefix}txt${item}Desc`,
		taxpayer: `${prefix}txt${item}A`,
		spouse: `${prefix}txt${item}B`
	};
}

export function annual1701ADetailFields(item: Annual1701ADetailItem, row: number) {
	const base = detailPrefix(item);
	return {
		description: `${base}Desc_${row}C1`,
		taxpayer: `${base}_${row}C2`,
		spouse: `${base}_${row}C3`
	};
}

function detailKeys(item: Annual1701ADetailItem, values: Values) {
	const pattern = new RegExp(`^(?:${detailPrefix(item)}(?:Desc_(\\d+)C1|_(\\d+)C[23])|income:1701A:detailRow${item}:(\\d+))$`);
	return Object.keys(values).flatMap(id => {
		const match = pattern.exec(id);
		return match ? [{ id, row: Number(match[1] ?? match[2] ?? match[3]) }] : [];
	});
}

function detailRowId(item: Annual1701ADetailItem, row: number): string {
	// Working copies keep a blank added row open without writing it to legacy XML.
	return `income:1701A:detailRow${item}:${row}`;
}

export function annual1701ADetailRows(item: Annual1701ADetailItem, values: Values) {
	const rows = new Set(detailKeys(item, values).filter(({ id }) => values[id] !== '').map(({ row }) => row));
	return [...rows].sort((left, right) => left - right).map(id => {
		const fields = annual1701ADetailFields(item, id);
		return {
			id,
			description: values[fields.description] ?? '',
			taxpayer: values[fields.taxpayer] ?? '',
			spouse: values[fields.spouse] ?? ''
		};
	});
}

export function annual1701AVisibleDetailRows(item: Annual1701ADetailItem, values: Values, active: readonly Annual1701ADetailPerson[]) {
	return annual1701ADetailRows(item, values).filter(row =>
		!annual1701ADetailHasDormantAmount(row, active) || active.some(person => annual1701ADetailHasAmount(row[person])));
}

export function annual1701AAddDetail(item: Annual1701ADetailItem, values: Values) {
	const base = annual1701ABaseDetailFields(item);
	const rows = annual1701ADetailRows(item, values);
	const newId = Math.max(0, ...detailKeys(item, values).map(({ row }) => row)) + 1;
	const retainBase = !rows.length && (values[base.description]?.trim() ||
		[base.taxpayer, base.spouse].some(id => annual1701ADetailHasAmount(values[id] ?? '')));
	const patch: Values = {};
	if (retainBase) {
		const first = annual1701ADetailFields(item, newId);
		patch[first.description] = values[base.description] ?? '';
		patch[first.taxpayer] = values[base.taxpayer] || '0.00';
		patch[first.spouse] = values[base.spouse] ?? '';
	}
	const added = newId + (retainBase ? 1 : 0);
	patch[detailRowId(item, added)] = 'Y';
	return { patch, descriptionId: annual1701ADetailFields(item, added).description };
}

export function annual1701ARemoveDetail(item: Annual1701ADetailItem, id: number, values: Values, active: readonly Annual1701ADetailPerson[]): Values {
	const fields = annual1701ADetailFields(item, id);
	const amounts = { taxpayer: values[fields.taxpayer] ?? '', spouse: values[fields.spouse] ?? '' };
	if (annual1701ADetailHasDormantAmount(amounts, active)) {
		return Object.fromEntries(active.map(person => [fields[person], '']));
	}
	const clear = [...Object.values(fields), detailRowId(item, id)];
	if (annual1701ADetailRows(item, values).length === 1) {
		clear.push(...Object.values(annual1701ABaseDetailFields(item)));
	}
	return Object.fromEntries(clear.map(key => [key, '']));
}

export function exportAnnual1701ADetails(
	item: Annual1701ADetailItem,
	output: Values,
	active: readonly Annual1701ADetailPerson[]
): void {
	const rows = annual1701ADetailRows(item, output);
	const applicable = active.length ? rows.filter(row =>
		active.some(person => annual1701ADetailHasAmount(row[person])) ||
		(row.description.trim() && !annual1701ADetailHasDormantAmount(row, active))) : [];
	for (const { id } of detailKeys(item, output)) delete output[id];
	const counter = `${prefix}txtCtrmodalPart${sections[item]}`;
	if (applicable.length < 2) {
		if (rows.length || counter in output) output[counter] = '0';
		if (rows.length) output[annual1701ABaseDetailFields(item).description] = applicable[0]?.description ?? '';
		return;
	}
	output[counter] = String(applicable.length);
	output[annual1701ABaseDetailFields(item).description] = 'OTHERS';
	for (const [index, row] of applicable.entries()) {
		const fields = annual1701ADetailFields(item, index + 1);
		output[fields.description] = row.description;
		for (const person of active) output[fields[person]] = row[person] || '0.00';
	}
}
