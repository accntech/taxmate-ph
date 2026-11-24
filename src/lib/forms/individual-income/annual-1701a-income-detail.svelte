<script lang="ts">
	import { Button, CurrencyInput, Input } from '$lib/components/ui';
	import { tick } from 'svelte';
	import { shortAnnualFieldApplies } from './annual-short';
	import {
		annual1701AAddDetail,
		annual1701ABaseDetailFields,
		annual1701ADetailFields,
		annual1701ADetailHasDormantAmount,
		annual1701ADetailRows,
		annual1701ARemoveDetail,
		annual1701AVisibleDetailRows,
		type Annual1701ADetailItem,
		type Annual1701ADetailPerson
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

	const base = $derived(annual1701ABaseDetailFields(item));
	const rows = $derived(annual1701ADetailRows(item, values));
	const active = $derived(people.filter(person => shortAnnualFieldApplies('1701A', base[person], values)));
	const visibleRows = $derived(annual1701AVisibleDetailRows(item, values, active));
	const baseDormant = $derived(annual1701ADetailHasDormantAmount({
		taxpayer: values[base.taxpayer] ?? '', spouse: values[base.spouse] ?? ''
	}, active));
	let editingSharedDescription = $state('');
	const baseDescriptionShared = $derived(baseDormant && !!values[base.description]?.trim() && editingSharedDescription !== base.description);
	const addButtonId = $derived(`1701a-item-${item}-add-entry`);
	const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

	function startDescriptionEdit(id: string, dormant: boolean) {
		if (dormant && !values[id]?.trim()) editingSharedDescription = id;
	}

	function endDescriptionEdit() {
		editingSharedDescription = '';
	}

	async function addEntry() {
		const { patch, descriptionId } = annual1701AAddDetail(item, values);
		onvaluechange(patch);
		await tick();
		document.getElementById(descriptionId)?.focus();
	}

	async function removeEntry(id: number, index: number) {
		const adjacent = visibleRows[index + 1] ?? visibleRows[index - 1];
		onvaluechange(annual1701ARemoveDetail(item, id, values, active));
		await tick();
		document.getElementById(adjacent ? annual1701ADetailFields(item, adjacent.id).description : addButtonId)?.focus();
	}
</script>

<tr data-income-item={item}>
	<td class="item-number">{item}</td>
	<th scope="row" class="description">
		<div class="item-heading">
			{label}{rows.length ? ' total' : ''}
			<Button id={addButtonId} size="sm" variant="ghost" aria-label={`Add Item ${item} entry`} onclick={addEntry}>
				Add entry
			</Button>
		</div>
		{#if !rows.length}
			<Input
				id={base.description}
				aria-label={`Item ${item} ${label.toLowerCase()} description`}
				placeholder="Description"
				value={values[base.description] ?? ''}
				readonly={baseDescriptionShared}
				help={baseDescriptionShared ? 'Description is shared with the other filer.' : undefined}
				maxlength={50}
				onfocus={() => startDescriptionEdit(base.description, baseDormant)}
				onblur={endDescriptionEdit}
				oninput={(event) => onvaluechange({ [base.description]: event.currentTarget.value })}
			/>
		{/if}
	</th>
	{#each people as person (person)}
		<td class={['amount', { editable: active.includes(person) && !rows.length }]}>
			{#if !active.includes(person)}
				<span aria-label="Not applicable">—</span>
			{:else if rows.length}
				<output id={base[person]}>{currency.format(Number((calculated[base[person]] ?? '').replaceAll(',', '')))}</output>
			{:else}
				<CurrencyInput
					id={base[person]}
					aria-label={`Item ${item} ${label.toLowerCase()} amount${people.length > 1 ? ` · ${person === 'spouse' ? 'Spouse' : 'Taxpayer'}` : ''}`}
					value={values[base[person]] ?? ''}
					onchange={(value) => onvaluechange({ [base[person]]: value })}
				/>
			{/if}
		</td>
	{/each}
</tr>
{#each visibleRows as row, index (row.id)}
	{@const fields = annual1701ADetailFields(item, row.id)}
	{@const entry = `Item ${item} entry ${index + 1}`}
	{@const dormant = annual1701ADetailHasDormantAmount(row, active)}
	{@const sharedDescription = dormant && !!row.description.trim() && editingSharedDescription !== fields.description}
	<tr data-income-detail={item}>
		<td class="item-number">{item}.{index + 1}</td>
		<th scope="row" class="description">
			<div class="entry-description">
				<Input
					id={fields.description}
					aria-label={`${entry} description`}
					placeholder="Description"
					value={row.description}
					readonly={sharedDescription}
					help={sharedDescription ? 'Description is shared with the other filer.' : undefined}
					error={errors[fields.description]}
					maxlength={30}
					onfocus={() => startDescriptionEdit(fields.description, dormant)}
					onblur={endDescriptionEdit}
					oninput={(event) => onvaluechange({ [fields.description]: event.currentTarget.value })}
				/>
				<Button size="sm" variant="ghost" aria-label={`Remove ${entry}${dormant ? ' active amount' : ''}`} onclick={() => void removeEntry(row.id, index)}>
					{dormant ? 'Remove amount' : 'Remove'}
				</Button>
			</div>
		</th>
		{#each people as person (person)}
			<td class={['amount', { editable: active.includes(person) }]}>
				{#if active.includes(person)}
					<CurrencyInput
						id={fields[person]}
						aria-label={`${entry} ${person} amount`}
						value={row[person]}
						error={errors[fields[person]]}
						onchange={(value) => onvaluechange({ [fields[person]]: value })}
					/>
				{:else}
					<span aria-label="Not applicable">—</span>
				{/if}
			</td>
		{/each}
	</tr>
{/each}

<style>
	td, th {
		padding: .45rem .625rem;
		border-block-end: 1px solid var(--border);
		text-align: start;
		vertical-align: middle;
	}

	.item-number { padding-inline: .5rem; font-variant-numeric: tabular-nums; }
	.description { font-weight: 500; }
	.item-heading, .entry-description { display: flex; flex-wrap: wrap; align-items: center; gap: .25rem .5rem; }
	.description :global([data-slot="form-item"]) { min-inline-size: 0; max-inline-size: 26rem; }
	.entry-description :global([data-slot="form-item"]) { flex: 1 1 9rem; }
	.amount { padding-inline-end: .75rem; text-align: end; font-variant-numeric: tabular-nums; }
	.amount:nth-child(4) { border-inline-start: 1px solid var(--border); }
	.amount.editable { padding-block: .3rem; vertical-align: bottom; }
	.amount output { padding-inline-end: calc(.75rem + 1px); font-weight: 650; white-space: nowrap; }
	.amount :global(input) { min-inline-size: 0; }

	@container paper-form (width < 36rem) {
		td, th { padding-inline: .375rem; }
		.item-number { padding-inline: .25rem; }
	}
</style>
