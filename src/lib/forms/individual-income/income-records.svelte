<script lang="ts">
	import { tick } from 'svelte';
	import { Button, CheckboxInput, CurrencyInput, DateInput, FieldErrors, Input, NumberInput, RadioGroup, Select, TinInput } from '$lib/components/ui';
	import { Sheet } from '$lib/components/ui/sheet';
	import { splitTinSegments } from '$lib/components/ui/tin-input/tin';
	import { calculateIndividualIncome, incomeAmountDecimals, validateIndividualIncome, type IncomeForm } from '.';
	import { incomeChoiceLabel, type IncomeEditorField } from './editor-layout';
	import { revised1700FieldApplies } from './compensation';

	type Record = { key: string; item?: string; fields: IncomeEditorField[] };
	type Values = { [id: string]: string };
	let { title, singular = 'item', records, form, values, calculated, computed, errors = {}, onvaluechange,
		singleton = false, includesSpouse = false, unlimited = false, readonlyFields = new Set<string>(), ondelete, onediting }: {
		title: string;
		singular?: string;
		records: Record[];
		form: IncomeForm;
		values: Values;
		calculated: Values;
		computed: Set<string>;
		errors?: Values;
		onvaluechange: (patch: Values) => void;
		singleton?: boolean;
		includesSpouse?: boolean;
		unlimited?: boolean;
		readonlyFields?: Set<string>;
		ondelete?: (record: Record) => Values;
		onediting?: (ids: string[]) => void;
	} = $props();

	let editing = $state.raw<Record>();
	let draft = $state<Values>({});
	let draftErrors = $state<Values>({});
	let adding = $state(false);
	let trigger: HTMLElement | undefined;
	const uid = $props.id();
	const decimals = $derived(incomeAmountDecimals(form));
	const currency = $derived(new Intl.NumberFormat('en-PH', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }));
	const entered = $derived(records.filter(hasEntry));
	const available = $derived(records.find(record => !entered.includes(record)));
	const source = $derived(editing ? { ...calculated, ...draft } : calculated);

	function editable(record: Record) {
		return record.fields.filter(field => !computed.has(field.id) && !readonlyFields.has(field.id));
	}

	function hasEntry(record: Record) {
		return editable(record).some(field => {
			const value = values[field.id]?.trim();
			return !!errors[field.id] || !/Income earner/.test(field.label) && !!value && value !== form.defaults[field.id] &&
				(field.kind !== 'money' || Number(value.replaceAll(',', '')) !== 0);
		});
	}

	function label(record: Record) {
		const fields = record.fields.filter(field => visible(field, record));
		const name = fields.find(field => /employer name|last name|property description|description|specify|particular|amortiz|other exempt income/i.test(field.label) && values[field.id]?.trim());
		if (name) {
			const first = /last name/i.test(name.label) && fields.find(field => /first name/i.test(field.label));
			return [values[name.id], first && values[first.id]].filter(Boolean).join(', ');
		}
		const description = fields.find(field => field.kind === 'text' && !/\bTIN\b|branch|date|number|name continuation/i.test(field.label) && values[field.id]?.trim());
		return description && values[description.id]?.trim() || `${singular[0].toUpperCase() + singular.slice(1)} ${record.item ?? ''}`.trim();
	}

	function tinParts(field: IncomeEditorField, record: Record) {
		if (!/TIN1(?:C1)?$/.test(field.id)) return [];
		const first = field.id;
		const ids = [first, first.replace(/TIN1/, 'TIN2'), first.replace(/TIN1/, 'TIN3')];
		const branch = record.fields.find(item => item.id === first.replace(/TIN1(?:C1)?$/, 'TIN4C1') || item.id === first.replace(/TIN1$/, 'TINBranchCode') || item.id === first.replace(/TIN1$/, 'BranchCode'));
		if (branch) ids.push(branch.id);
		return ids.filter(id => record.fields.some(item => item.id === id));
	}

	function choices(field: IncomeEditorField) {
		const earner = /Income earner/.test(field.label);
		return field.options.filter(option => !!option && option !== '000' && (includesSpouse || !earner || !/Spouse$|^2$/.test(option)))
			.map((option, index) => ({ value: option, label: earner ? /Spouse$|^2$/.test(option) ? 'Spouse' : 'Taxpayer' : incomeChoiceLabel(field, option, index) }));
	}

	function visible(field: IncomeEditorField, record: Record) {
		if (form.code === '1700v2018' && !revised1700FieldApplies(field.id, source)) return false;
		if (/TIN[234](?:C1)?$|TINBranchCode$|EmployerBranchCode$|a_BranchCode$/.test(field.id)) return false;
		if (form.code === '1701v2018' && /_(?:1|2)(?:TP|S)Name$/.test(field.id)) {
			const assignment = record.fields.find(item => /Income earner/.test(item.label));
			const spouse = assignment && source[assignment.id]?.endsWith('Spouse');
			return field.id.endsWith(spouse ? 'SName' : 'TPName');
		}
		return true;
	}

	async function open(record: Record, control?: HTMLElement, isNew = false, focusId?: string) {
		trigger = control;
		focusId ??= control?.dataset.recordFocusId;
		if (control) delete control.dataset.recordFocusId;
		const tin = record.fields.find(field => tinParts(field, record).includes(focusId ?? ''));
		if (tin) focusId = tin.id;
		adding = isNew;
		draftErrors = {};
		draft = Object.fromEntries(editable(record).map(field => [field.id, calculated[field.id] ?? form.defaults[field.id] ?? '']));
		for (const field of editable(record)) {
			const options = choices(field);
			if (field.kind === 'radio' && /Income earner/.test(field.label) && options.length === 1 && !draft[field.id]) draft[field.id] = options[0].value;
		}
		editing = record;
		onediting?.(editable(record).map(field => field.id));
		await tick();
		const dialog = document.getElementById(`${uid}-fields`)?.closest('dialog');
		await Promise.all(dialog?.getAnimations().map(animation => animation.finished.catch(() => {})) ?? []);
		const target = focusId && document.getElementById(focusId);
		if (target && dialog?.contains(target)) target.focus();
		else dialog?.querySelector<HTMLElement>('input, select, [role="radio"]')?.focus();
	}

	async function close() {
		const control = trigger;
		editing = undefined;
		onediting?.([]);
		await tick();
		if (control?.isConnected && !(control instanceof HTMLButtonElement && control.disabled)) control.focus();
		else document.getElementById(`${uid}-heading`)?.focus();
	}

	async function save() {
		if (!editing) return;
		const result = validateIndividualIncome(form, calculateIndividualIncome(form, { ...values, ...draft }));
		draftErrors = Object.fromEntries(editable(editing).filter(field => visible(field, editing!) && result[field.id]).map(field => [field.id, result[field.id]]));
		if (adding && !editable(editing).some(field => !/Income earner/.test(field.label) && draft[field.id]?.trim() && draft[field.id] !== form.defaults[field.id] && (field.kind !== 'money' || Number(draft[field.id].replaceAll(',', '')) !== 0))) {
			const first = editable(editing).find(field => field.kind === 'text') ?? editable(editing)[0];
			if (first) draftErrors[first.id] = `Enter the ${singular} details.`;
		}
		if (Object.keys(draftErrors).length) {
			document.getElementById(Object.keys(draftErrors)[0])?.focus();
			return;
		}
		onvaluechange(draft);
		await close();
	}

	async function remove() {
		if (!editing) return;
		onvaluechange(ondelete ? ondelete(editing) : Object.fromEntries(editable(editing).map(field => [field.id, form.defaults[field.id] ?? ''])));
		trigger = document.getElementById(`${uid}-add`) ?? undefined;
		await close();
	}
</script>

<div class="income-records" data-income-records={title}>
	<header>
		<h3 id={`${uid}-heading`} tabindex="-1">{title}<span class="count">{unlimited ? ` (${entered.length})` : ` (${entered.length}/${records.length})`}</span></h3>
		<Button id={`${uid}-add`} data-record-fields={available?.fields.map(field => field.id).join(' ')} size="sm" variant="secondary" disabled={!available} aria-label={`Add ${singular}`}
			onclick={(event) => available && void open(available, event.currentTarget, true)}>Add item</Button>
	</header>
	{#if entered.length}
		<ul aria-label={`${title} items`}>
			{#each entered as record (record.key)}
				<li>
					<span class="slot">{record.item}</span>
					<button type="button" class="record-link" aria-haspopup="dialog" data-record-fields={record.fields.map(field => field.id).join(' ')} onclick={(event) => void open(record, event.currentTarget)}>{label(record)}</button>
					<dl>
						{#each record.fields.filter(field => field.kind === 'money' && visible(field, record)) as field (field.id)}
							<div><dt>{field.column ?? (field.person === 'spouse' ? 'Spouse' : field.person === 'taxpayer' ? 'Taxpayer' : field.label.replace(/^\d+[A-Z]?\s+/, ''))}</dt><dd>{currency.format(Number((calculated[field.id] ?? '0').replaceAll(',', '')))}</dd></div>
						{/each}
					</dl>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="schedule-empty-message">No items added</p>
	{/if}
</div>

<Sheet
	bind:open={() => !!editing, value => { if (!value) void close(); }}
	title={`${adding ? 'Add' : 'Edit'} ${singular}`}
	context={singular === 'item' ? title : undefined}
>
	{#if editing}
		<div id={`${uid}-fields`} class="record-fields">
			{#each editing.fields.filter(field => visible(field, editing!)) as field (field.id)}
				{@const parts = tinParts(field, editing)}
				{@const label = field.kind === 'text' && /description|specify|particular|amortiz/i.test(field.label) ? 'Description' : field.label.replace(/^\d+[A-Z]?\s+/, '')}
				{@const value = source[field.id] ?? ''}
				{@const error = draftErrors[field.id] ?? ''}
				{@const options = choices(field)}
				{#if computed.has(field.id) || readonlyFields.has(field.id)}
					<div class="computed"><span>{label}</span><output class:font-mono={field.kind !== 'text' && field.kind !== 'select'}>{field.kind === 'money' ? currency.format(Number(value.replaceAll(',', ''))) : value}</output></div>
				{:else if parts.length > 1}
					<TinInput id={field.id} label="Employer TIN and branch code" preserveSegments value={parts.map(id => source[id] ?? '').join('-')}
						error={parts.map(id => draftErrors[id]).filter(Boolean).join(' ')} onchange={(value) => { const segments = splitTinSegments(value); parts.forEach((id, index) => { draft[id] = segments[index] ?? ''; }); }} />
				{:else if field.kind === 'money'}
					<CurrencyInput {decimals} id={field.id} {label} {value} {error} allowNegative={/loss|adjustment|income per books/i.test(label)} onchange={(value) => { draft[field.id] = value; }} />
				{:else if field.kind === 'checkbox'}
					<CheckboxInput id={field.id} {label} checked={['Y', '1', 'true', 'on'].includes(value)} onchange={(event) => { draft[field.id] = event.currentTarget.checked ? 'Y' : ''; }} />
					{#if error}<FieldErrors errors={[error]} />{/if}
				{:else if field.kind === 'radio' && options.length > 1}
					<RadioGroup id={field.id} {label} {value} {options} {error} onchange={(value) => { draft[field.id] = value; }} />
				{:else if field.kind === 'select' && options.length > 1}
					<Select id={field.id} {label} {value} {options} {error} onchange={(value) => { draft[field.id] = value; }} />
				{:else if field.kind === 'radio' && options.length === 1}
					{#if value && value !== options[0].value}
						<div class="computed"><span>{label}</span><span>Spouse in saved draft</span></div>
						<Button variant="secondary" size="sm" onclick={() => { draft[field.id] = options[0].value; }}>Assign to taxpayer</Button>
					{:else}
						<div class="computed"><span>{label}</span><span>{options[0].label}</span></div>
					{/if}
				{:else if field.kind === 'date' || /date of birth|date of issue|date of transfer/i.test(label)}
					{@const date = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value)}
					<DateInput id={field.id} {label} value={date ? `${date[3]}-${date[1].padStart(2, '0')}-${date[2].padStart(2, '0')}` : value} {error} onchange={(value) => { draft[field.id] = value ? `${value.slice(5, 7)}/${value.slice(8, 10)}/${value.slice(0, 4)}` : ''; }} />
				{:else if /number of shares|year incurred/i.test(label)}
					<NumberInput id={field.id} {label} {value} {error} min={/year incurred/i.test(label) ? 1900 : 0} maxlength={field.maxLength ?? undefined} onchange={(value) => { draft[field.id] = value; }} />
				{:else}
					<Input id={field.id} {label} {value} {error} maxlength={field.maxLength ?? undefined} oninput={(event) => { draft[field.id] = event.currentTarget.value; }} />
				{/if}
			{/each}
		</div>
	{/if}
	{#snippet footer()}
		<div class="record-actions">
			{#if !adding}<Button variant="danger" data-agent-confirm="delete" onclick={() => void remove()}>{singleton ? 'Clear item' : 'Delete item'}</Button>{/if}
			<Button variant="secondary" onclick={() => void close()}>Cancel</Button>
			<Button onclick={() => void save()}>{adding ? 'Add item' : 'Update'}</Button>
		</div>
	{/snippet}
</Sheet>

<style>
	.income-records { min-width: 0; }
	header { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: .5rem; padding: .5rem .875rem; }
	h3 { margin: 0; font-size: .875rem; font-weight: 650; scroll-margin-top: 5rem; }
	.count, .slot, dt { color: var(--fg-muted); font-size: var(--form-label-size); }
	.count, .slot, dd { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
	ul { margin: 0; padding: 0; list-style: none; }
	li { display: grid; grid-template-columns: 2rem minmax(0, 1fr) auto; align-items: center; gap: .5rem; padding: .125rem .875rem; border-block-start: 1px solid var(--border-soft); }
	.record-link { min-width: 0; min-height: 2rem; padding: 0; border: 0; background: transparent; color: var(--accent); font: inherit; font-size: .875rem; text-align: start; text-decoration: underline; text-underline-offset: .15em; overflow-wrap: anywhere; cursor: pointer; }
	.record-link:focus-visible { outline: 2px solid var(--field-focus-border); outline-offset: 2px; }
	dl { display: flex; flex-wrap: wrap; justify-content: end; gap: .5rem 1rem; margin: 0; text-align: end; }
	dd { margin: 0; font-weight: 550; font-size: var(--form-control-size); }
	.record-fields { display: grid; gap: 1rem; padding: 1.25rem; }
	.computed { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
	.record-actions { display: flex; justify-content: end; flex-wrap: wrap; gap: .5rem; }
	@container paper-form (width < 36rem) { dl { grid-column: 2 / -1; padding-block-end: .5rem; } }
</style>
