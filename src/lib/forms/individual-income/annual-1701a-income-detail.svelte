<script lang="ts">
	import IncomeRecords from './income-records.svelte';
	import { getIndividualIncomeForm } from '.';
	import type { IncomeEditorField } from './editor-layout';
	import { shortAnnualFieldApplies } from './annual-short';
	import {
		annual1701ABaseDetailFields, annual1701ADetailFields, annual1701ADetailHasValues,
		annual1701ADetailHasDormantAmount, annual1701ADetailRows, annual1701ARemoveDetail,
		type Annual1701ADetailItem, type Annual1701ADetailPerson
	} from './annual-1701a-income-detail';

	let { item, label, values, calculated, people, errors = {}, onvaluechange }: {
		item: Annual1701ADetailItem;
		label: string;
		values: Record<string, string>;
		calculated: Record<string, string>;
		people: readonly Annual1701ADetailPerson[];
		errors?: Record<string, string>;
		onvaluechange: (patch: Record<string, string>) => void;
	} = $props();

	const form = getIndividualIncomeForm('1701A')!;
	let editingFields = $state<string[]>([]);
	const base = $derived(annual1701ABaseDetailFields(item));
	const rows = $derived(annual1701ADetailRows(item, values));
	const active = $derived(people.filter(person => shortAnnualFieldApplies('1701A', base[person], values)));
	const baseDormant = $derived(annual1701ADetailHasDormantAmount({ taxpayer: values[base.taxpayer] ?? '', spouse: values[base.spouse] ?? '' }, active));
	const records = $derived(rows.length
		? rows.map(row => ({
			key: String(row.id), item: `${item}.${row.id}`,
			fields: entryFields(annual1701ADetailFields(item, row.id)),
			occupied: annual1701ADetailHasValues(row)
		}))
		: [{ key: 'base', item, fields: entryFields(base), occupied: baseDormant }]);
	const readonlyFields = $derived(new Set([
		...(baseDormant && values[base.description]?.trim() ? [base.description] : []),
		...rows.flatMap(row => annual1701ADetailHasDormantAmount(row, active) && row.description.trim() ? [annual1701ADetailFields(item, row.id).description] : [])
	]));
	const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0, maximumFractionDigits: 0 });

	function entryFields(ids: ReturnType<typeof annual1701ABaseDetailFields>): IncomeEditorField[] {
		return [
			{ id: ids.description, label: 'Description', kind: 'text', column: 'Description' },
			...active.map(person => ({ id: ids[person], label: `${person === 'spouse' ? 'Spouse' : 'Taxpayer'} amount`, kind: 'money', person, column: person === 'spouse' ? 'Spouse' : 'Taxpayer' }))
		].map(field => ({ ...field, item, section: label, page: '2', options: [], maxLength: field.kind === 'money' ? 25 : ids.description === base.description ? 50 : 30, choiceLabels: {} }));
	}

	function remove(record: { key: string }) {
		if (record.key === 'base') return Object.fromEntries([
			...active.map(person => [base[person], '']), ...(!baseDormant ? [[base.description, '']] : [])
		]);
		return annual1701ARemoveDetail(item, Number(record.key), values, active);
	}
</script>

<tr data-income-item={item} class="income-detail-total">
	<td>{item}</td>
	<th scope="row">{label}</th>
	{#each people as person (person)}
		<td class="amount">{#if active.includes(person)}<output id={editingFields.includes(base[person]) ? undefined : base[person]}>{currency.format(Number((calculated[base[person]] ?? '').replaceAll(',', '')))}</output>{:else}<span aria-label="Not applicable">—</span>{/if}</td>
	{/each}
</tr>
<tr class="income-detail-items" data-income-detail-items={item}><td colspan={2 + people.length}>
	<IncomeRecords title={label} {records} {form} {values} {calculated} computed={new Set()} {errors}
		{onvaluechange} ondelete={remove} onediting={(ids) => { editingFields = ids; }} {readonlyFields} includesSpouse={people.length > 1} maxItems={1} />
</td></tr>

<style>
	td, th { padding: .45rem .625rem; border-block-end: 1px solid var(--border); text-align: start; font-weight: 500; }
	.amount { text-align: end; font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
	.amount output { padding-inline-end: var(--paper-amount-inset); font-weight: 650; }
	.income-detail-items > td { padding: 0; }
</style>
