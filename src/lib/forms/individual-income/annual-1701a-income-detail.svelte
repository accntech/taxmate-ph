<script lang="ts">
	import { tick } from 'svelte';
	import { Button, CurrencyInput, Input } from '$lib/components/ui';
	import { shortAnnualFieldApplies } from './annual-short';
	import {
		annual1701ABaseDetailFields, annual1701ADetailFields, annual1701ADetailHasDormantAmount,
		annual1701ADetailRows, annual1701ARemoveDetail, type Annual1701ADetailItem, type Annual1701ADetailPerson
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

	let focusedSavedRow = $state<number>();

	const base = $derived(annual1701ABaseDetailFields(item));
	const rows = $derived(annual1701ADetailRows(item, values));
	const visibleRows = $derived.by(() => {
		const focused = focusedSavedRow;
		if (focused === undefined || rows.some(row => row.id === focused)) return rows;
		return [...rows, { id: focused, description: '', taxpayer: '', spouse: '' }].sort((left, right) => left.id - right.id);
	});
	const active = $derived(people.filter(person => shortAnnualFieldApplies('1701A', base[person], values)));
	const baseAmounts = $derived({ taxpayer: values[base.taxpayer] ?? '', spouse: values[base.spouse] ?? '' });
	const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0, maximumFractionDigits: 0 });

	function setField(id: string, value: string) {
		const patch = { [id]: value };
		if (!value && focusedSavedRow !== undefined && rows.length === 1 &&
			!annual1701ADetailRows(item, { ...values, ...patch }).length) {
			// A legacy summary must not reappear when its last detail is cleared.
			onvaluechange(annual1701ARemoveDetail(item, focusedSavedRow, values, active));
		} else {
			onvaluechange(patch);
		}
	}

	async function clearSavedEntry(row: (typeof rows)[number]) {
		const dormant = annual1701ADetailHasDormantAmount(row, active);
		const next = rows.find(candidate => candidate.id !== row.id);
		const fields = dormant ? annual1701ADetailFields(item, row.id) : next ? annual1701ADetailFields(item, next.id) : base;
		const focus = dormant && active[0] ? fields[active[0]] : fields.description;
		focusedSavedRow = undefined;
		onvaluechange(annual1701ARemoveDetail(item, row.id, values, active));
		await tick();
		document.getElementById(focus)?.focus();
	}
</script>

{#snippet description(id: string, title: string, maxlength: number, dormant: boolean)}
	<Input {id} aria-label={`${title} description`} placeholder="Description" {maxlength}
		value={values[id] ?? ''} error={errors[id]} readonly={dormant && !!values[id]?.trim()}
		oninput={(event) => setField(id, event.currentTarget.value)} />
{/snippet}

{#snippet amount(id: string, title: string, person: Annual1701ADetailPerson)}
	<CurrencyInput decimals={0} {id}
		aria-label={`${title} amount${people.length > 1 ? ` · ${person === 'spouse' ? 'Spouse' : 'Taxpayer'}` : ''}`}
		value={values[id] ?? ''} error={errors[id]} onchange={(next) => setField(id, next)} />
{/snippet}

{#if visibleRows.length}
	<tr data-income-item={item} class="income-detail-total">
		<td>{item}</td>
		<th scope="row">{label}</th>
		{#each people as person (person)}
			<td class="amount">
				{#if active.includes(person)}
					<output id={base[person]}>{currency.format(Number((calculated[base[person]] ?? '').replaceAll(',', '')))}</output>
				{:else}
					<span aria-label="Not applicable">—</span>
				{/if}
			</td>
		{/each}
	</tr>
	{#each visibleRows as row (row.id)}
		{@const fields = annual1701ADetailFields(item, row.id)}
		{@const number = `${item}.${row.id}`}
		{@const title = `Item ${number}`}
		<tr class="income-detail-entry legacy-detail-entry" data-income-detail-items={item}
			onfocusin={() => { focusedSavedRow = row.id; }}
			onfocusout={(event) => {
				if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
					focusedSavedRow = undefined;
				}
			}}>
			<td>{number}</td>
			<th scope="row">
				{#if active.length}
					{@render description(fields.description, title, 30, annual1701ADetailHasDormantAmount(row, active))}
					<Button variant="ghost" size="sm" aria-label={`Clear ${title}`} onclick={() => void clearSavedEntry(row)}>Clear</Button>
				{:else}
					{row.description}
				{/if}
			</th>
			{#each people as person (person)}
				<td class="amount">
					{#if active.includes(person)}
						{@render amount(fields[person], title, person)}
					{:else}
						<span aria-label="Not applicable">—</span>
					{/if}
				</td>
			{/each}
		</tr>
	{/each}
{:else}
	{@const title = `Item ${item} ${label.toLowerCase()}`}
	<tr class="income-detail-entry" data-income-item={item} data-income-detail-items={item}>
		<td>{item}</td>
		<th scope="row">
			{label}
			{#if active.length}
				{@render description(base.description, title, 50, annual1701ADetailHasDormantAmount(baseAmounts, active))}
			{/if}
		</th>
		{#each people as person (person)}
			<td class="amount">
				{#if active.includes(person)}
					{@render amount(base[person], title, person)}
				{:else}
					<span aria-label="Not applicable">—</span>
				{/if}
			</td>
		{/each}
	</tr>
{/if}

<style>
	td, th { padding: .45rem .625rem; border-block-end: 1px solid var(--border); text-align: start; font-weight: 500; }
	.amount { text-align: end; font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
	.amount output { padding-inline-end: var(--paper-amount-inset); font-weight: 650; }
	.income-detail-entry > .amount { vertical-align: bottom; }
	.income-detail-entry th :global([data-slot="form-item"]) { margin-block-start: .3rem; }
	.legacy-detail-entry > :is(th, .amount) { vertical-align: top; }
	.legacy-detail-entry th :global([data-slot="form-item"]) { margin-block-start: 0; }
	@container paper-form (width < 36rem) {
		td, th { padding-inline: .375rem; }
		.amount :global([data-slot="form-item"] > div:has(> input)) { padding-inline: .375rem; gap: .25rem; }
	}
</style>
