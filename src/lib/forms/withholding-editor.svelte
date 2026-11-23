<script lang="ts">
	import type { TaxpayerProfile } from '$lib/profiles/profile';
	import PaperFormHeader from './paper-form-header.svelte';
	import ReturnTaxpayerInformation from './return-taxpayer-information.svelte';
	import { compareFormItems, getWithholdingPaperLayout } from './withholding-paper-layout';
	import AtcPicker from './atc-picker.svelte';
	import { CalculatedValue, CurrencyInput, DateInput, Input, NumberInput, RadioGroup, Select } from '$lib/components/ui';
	import { normalizeCurrencyInput } from '$lib/components/ui/currency-input/currency';
	import { withholdingSchedules, withholdingSchedulesEnabled, type WithholdingDefinition, type WithholdingField, type WithholdingSchedule } from './withholding-definitions';
	import { calculateWithholding } from './withholding-rules';
	import ScheduleItems from './schedule-items.svelte';
	import './withholding-layout.css';
	import './form-editor-layout.css';

	let { definition, values, errors = {}, onvaluechange, profile, taxpayerHref }: {
		definition: WithholdingDefinition;
		values: Record<string, string>;
		errors?: Record<string, string>;
		onvaluechange: (patch: Record<string, string>) => void;
		profile: TaxpayerProfile;
		taxpayerHref: string;
	} = $props();
	const calculated = $derived(calculateWithholding(definition.code, values));
	const schedulesEnabled = $derived(withholdingSchedulesEnabled(definition, values));
	const schedules = $derived(schedulesEnabled ? withholdingSchedules(definition, values) : []);
	const layout = $derived(getWithholdingPaperLayout(definition.code));
	const annual = $derived(definition.period === 'year');
	const propertyReturn = $derived(definition.code === '1606');
	const sectionFields = $derived(definition.sections.flatMap(section => section.fields));
	const byName = $derived(Object.fromEntries(sectionFields.map(field => [shortName(field), field])));
	const periodGroups = $derived(Object.entries(layout.period).reduce<{ item: string; fields: WithholdingField[] }[]>((groups, [name, item]) => {
		const field = byName[name];
		if (!field || !visible(field)) return groups;
		const last = groups.at(-1);
		if (last?.item === item) last.fields.push(field);
		else groups.push({ item, fields: [field] });
		return groups;
	}, []));
	const backgroundItems = $derived([
		...Object.entries(layout.background).flatMap(([name, item]) => {
			const field = byName[name];
			return field && visible(field) ? [{ id: field.id, item }] : [];
		}),
		...(layout.fixedAtc && !layout.fixedAtc.inPeriod ? [{ id: 'fixed-atc', item: layout.fixedAtc.item }] : [])
	]);
	const propertyItems: Record<string, string> = {
		propertyType: '15', txtLocation: '16', propertyRdo: '16A', txtTCT: '17', txtArea: '17', txtTaxDC: '17',
		j_id394: '18', optRelief: '19', reliefDescription: '19', transactionType: '20', txtOthers20: '20',
		Habitual: '29', txtSurcharge: '35A', txtInterest: '35B', txtCompromise: '35C', txtTotalPenalties: '35D',
		overpaymentOption: ''
	};
	const propertyFields = $derived(propertyReturn ? [
		...definition.sections.find(section => section.id === 'property')!.fields.filter(field => shortName(field) !== 'Habitual'),
		byName.optRelief, byName.reliefDescription
	].filter(field => field && visible(field)).sort(byItem) : []);
	const valuation = $derived(propertyReturn ? [
		...sectionFields.filter(field => /^(27|28)[A-E]/.test(field.label)).sort(byItem),
		byName.Habitual
	].filter(field => visible(field)) : []);
	const computation = $derived(definition.sections.find(section => section.id === 'computation')?.fields
		.filter(field => visible(field) && (!propertyReturn || !/^(27|28)[A-E]/.test(field.label)))
		.sort((a, b) => {
			const first = itemNumber(a);
			const second = itemNumber(b);
			return first && second ? compareFormItems(first, second) : Number(!first) - Number(!second);
		}) ?? []);
	const separateSchedules = $derived(schedules.filter(schedule => !Object.hasOwn(layout.inlineSchedules ?? {}, schedule.id)));
	const fields = $derived([
		...definition.sections.flatMap(section => section.fields),
		...schedules.flatMap(schedule => [...schedule.rows.flatMap(row => row.fields), ...(schedule.totals ?? [])])
	]);
	const invalidAmounts = $derived(fields.some(field => field.type === 'money' && !field.readonly && visible(field) && normalizeMoney(values[field.id] ?? '', !!field.allowNegative) === null));
	const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
	function shortName(field: WithholdingField) {
		return field.id.slice(definition.prefix.length);
	}
	function itemNumber(field: WithholdingField) {
		const name = shortName(field);
		if (propertyReturn && name in propertyItems) return propertyItems[name];
		if (name === 'txt20Other') return '20';
		if (name === 'txt29Other') return '29';
		return /^(\d+[A-Z]?)\s+/.exec(field.label)?.[1] ?? /^txt(?:Tax)?(\d+[A-Z]?)$/.exec(name)?.[1] ?? '';
	}
	function byItem(a: WithholdingField, b: WithholdingField) {
		return compareFormItems(itemNumber(a), itemNumber(b));
	}
	function displayLabel(label: string) {
		return label.replace(/^\d+[A-Z]?(?:[.):-])?\s+/i, '');
	}
	function visible(field: WithholdingField) {
		return !field.showWhen || values[field.showWhen.field] === field.showWhen.value;
	}
	function change(id: string, value: string) {
		onvaluechange({ [id]: value });
	}
	function normalizeMoney(value: string, allowNegative = false) {
		const trimmed = value.trim();
		if (allowNegative && trimmed.startsWith('-')) {
			const magnitude = normalizeCurrencyInput(trimmed.slice(1));
			return magnitude === null || magnitude === '' ? null : `-${magnitude}`;
		}
		return normalizeCurrencyInput(value);
	}
	function display(field: WithholdingField, value: string) {
		if (!value) return '—';
		if (field.type === 'money') {
			const normalized = normalizeMoney(value, !!field.allowNegative || !!field.readonly);
			return normalized === null ? '—' : currency.format(Number(normalized));
		}
		return field.options?.find(option => option.value === value)?.label ?? value;
	}
</script>

{#snippet control(field: WithholdingField)}
	{#if visible(field)}
		{#if field.readonly}
			<CalculatedValue id={field.id} label={displayLabel(field.label)} value={invalidAmounts && field.type === 'money' ? '' : display(field, calculated[field.id] ?? values[field.id] ?? '')} error={displayLabel(errors[field.id] ?? '')} />
		{:else if displayLabel(field.label) === 'ATC'}
			<AtcPicker id={field.id} label={displayLabel(field.label)} formCode={definition.code} fieldOptions={field.options ?? []} category={values[definition.prefix + 'optCategory'] ?? ''} year={Number(values[definition.yearField])} required={field.required ?? false} value={values[field.id] ?? ''} error={displayLabel(errors[field.id] ?? '')} onchange={(value) => change(field.id, value)} />
		{:else if field.type === 'money'}
			<CurrencyInput id={field.id} label={displayLabel(field.label)} required={field.required ?? false} value={values[field.id] ?? ''} error={displayLabel(errors[field.id] ?? '')} onchange={(value) => change(field.id, value)} />
		{:else if field.type === 'number'}
			<NumberInput id={field.id} label={displayLabel(field.label)} required={field.required ?? false} value={values[field.id] ?? ''} error={displayLabel(errors[field.id] ?? '')} decimal={!/year|sheet|count|number|month|day/i.test(field.id)} onchange={(value) => change(field.id, value)} />
		{:else if field.type === 'select'}
			{#if field.options?.length === 2 && field.options.every(option => ['Y', 'N'].includes(option.value))}
				<RadioGroup id={field.id} label={displayLabel(field.label)} required={field.required ?? false} options={field.options} value={values[field.id] ?? ''} error={displayLabel(errors[field.id] ?? '')} onchange={(value) => change(field.id, value)} />
			{:else}
				<Select id={field.id} label={displayLabel(field.label)} required={field.required ?? false} options={field.options ?? []} value={values[field.id] ?? ''} error={displayLabel(errors[field.id] ?? '')} onchange={(value) => change(field.id, value)} />
			{/if}
		{:else if field.type === 'date'}
			<DateInput id={field.id} label={displayLabel(field.label)} required={field.required ?? false} value={values[field.id] ?? ''} error={displayLabel(errors[field.id] ?? '')} onchange={(value) => change(field.id, value)} />
		{:else}
			<Input id={field.id} label={displayLabel(field.label)} required={field.required ?? false} value={values[field.id] ?? ''} error={displayLabel(errors[field.id] ?? '')} oninput={(event) => change(field.id, event.currentTarget.value)} />
		{/if}
	{/if}
{/snippet}

{#snippet scheduleEditor(schedule: WithholdingSchedule)}
	<ScheduleItems {definition} {schedule} {values} {errors} onchange={onvaluechange} printedRange={layout.scheduleItems?.[schedule.id]}>
		{#snippet totals()}
			{#if !annual && schedule.totals?.length}
				<div class="eq-field-grid wh-schedule-totals">
					{#each schedule.totals as field (field.id)}{@render control(field)}{/each}
				</div>
			{/if}
		{/snippet}
	</ScheduleItems>
{/snippet}

{#snippet numberedField(field: WithholdingField, row = false)}
	{@const item = itemNumber(field)}
	{@const label = displayLabel(field.label)}
	{@const result = row && field.readonly && field.type === 'money'}
	<div class={['form-paper-field', { numbered: item, 'form-paper-money': row && field.type === 'money', 'form-paper-total': result, 'final-total': row && field.id === definition.totalField }]}>
		{#if item}<span class="paper-item-number" aria-hidden="true">{item}</span>{/if}
		{#if result}
			<span id={`${field.id}-label`}>{label}</span>
			<output id={field.id} aria-labelledby={`${field.id}-label`} aria-live="off">
				{invalidAmounts ? '—' : display(field, calculated[field.id] ?? values[field.id] ?? '')}
			</output>
		{:else}
			{@render control(field)}
		{/if}
	</div>
{/snippet}

<div class="paper-sheet wh-preparation">
	<PaperFormHeader number={layout.number} title={layout.title} subtitle={layout.subtitle}
		revision={layout.revision} englishAgency={layout.englishAgency} />

	<section class="form-paper-grid form-period" aria-label="Return period">
		{#each periodGroups as group (group.item)}
			<div class="form-paper-field numbered">
				<span class="paper-item-number" aria-hidden="true">{group.item}</span>
				<div class={['period-controls', { 'paired-period': group.fields.length > 1 }]}>
					{#each group.fields as field (field.id)}{@render control(field)}{/each}
				</div>
			</div>
		{/each}
		{#if layout.fixedAtc?.inPeriod}
			<div class="form-paper-field numbered">
				<span class="paper-item-number" aria-hidden="true">{layout.fixedAtc.item}</span>
				<dl class="fixed-atc"><dt>ATC</dt><dd>WW010</dd></dl>
			</div>
		{/if}
	</section>

	<ReturnTaxpayerInformation formCode={definition.code} {values} {profile} {taxpayerHref}
		itemNumbers={layout.taxpayer} extraItems={backgroundItems}>
		{#snippet extraField(id)}
			{#if id === 'fixed-atc'}
				<dl class="fixed-atc"><dt>ATC</dt><dd>WW010</dd></dl>
			{:else}
				{@render control(byName[id.slice(definition.prefix.length)])}
			{/if}
		{/snippet}
	</ReturnTaxpayerInformation>

	{#if propertyReturn}
		<section aria-labelledby="property-and-transaction">
			<h2 class="form-paper-heading" id="property-and-transaction">Property and transaction</h2>
			<div class="form-paper-grid">
				{#each propertyFields as field (field.id)}{@render numberedField(field)}{/each}
			</div>
		</section>
		<section aria-labelledby="property-valuation">
			<h2 class="form-paper-heading" id="property-valuation">Property valuation</h2>
			{#each valuation as field (field.id)}{@render numberedField(field, true)}{/each}
		</section>
	{/if}

	<section class="form-paper-part-two" aria-labelledby="computation-title">
		<h2 class="form-paper-heading" id="computation-title">Part II · {layout.computation ?? 'Computation of Tax'}</h2>
		{#if !schedulesEnabled}
			<p class="eq-muted form-paper-feedback">No taxes withheld this quarter.</p>
		{/if}
		{#if annual}
			<aside class="form-paper-summary" aria-label="Summary">
				{#each schedules as schedule (`${definition.code}:${schedule.id}`)}
					{@render scheduleEditor(schedule)}
					{#each schedule.totals ?? [] as field (field.id)}{@render numberedField(field, true)}{/each}
				{/each}
			</aside>
		{:else}
			{#each schedules.filter(schedule => layout.inlineSchedules?.[schedule.id] === '') as schedule (schedule.id)}
				{@render scheduleEditor(schedule)}
			{/each}
			{#each computation as field (field.id)}
				{#each schedules.filter(schedule => layout.inlineSchedules?.[schedule.id] === shortName(field)) as schedule (schedule.id)}
					{@render scheduleEditor(schedule)}
				{/each}
				{@render numberedField(field, true)}
			{/each}
		{/if}
		{#if invalidAmounts}
			<p role="status" class="eq-amount-error form-paper-feedback">Correct the amounts to calculate the total.</p>
		{/if}
	</section>

	{#if !annual && separateSchedules.length}
		<section aria-labelledby="supporting-schedules">
			<h2 class="form-paper-heading" id="supporting-schedules">{layout.schedulePart ?? 'Schedules'}</h2>
			{#each separateSchedules as schedule (`${definition.code}:${schedule.id}`)}{@render scheduleEditor(schedule)}{/each}
		</section>
	{/if}
</div>

<style>
	.form-paper-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 1px;
		background: var(--border);
		border-block-start: 1px solid var(--border);
	}
	.form-period { border-block-start: 0; }
	.form-paper-grid > .form-paper-field {
		flex: 1 0 100%;
		border-block-start: 0;
		background: var(--bg-elev);
	}
	.paper-sheet :global(.wh-schedule) { border-block-start: 1px solid var(--border); }
	.form-paper-heading {
		margin: 0;
		padding: .5rem .875rem;
		border-block-start: 1px solid var(--border);
		background: var(--paper-section-background, var(--bg-hover));
		font: 600 .875rem/1.4 var(--font-sans);
	}
	.form-paper-field, .period-controls {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: start;
		min-width: 0;
		gap: .375rem;
	}
	.form-paper-field { padding: .75rem .875rem; border-block-start: 1px solid var(--border); }
	.form-paper-field.numbered { grid-template-columns: 1.75rem minmax(0, 1fr); }
	.form-paper-field > .paper-item-number { padding-top: .15rem; }
	.paired-period { grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); }
	.form-paper-field :global([data-slot="form-item"]) { grid-template-columns: minmax(0, 1fr); min-width: 0; }
	.form-paper-field :global([data-slot="input"]) { min-width: 0; width: 100%; }
	.form-paper-total {
		grid-template-columns: minmax(0, 1fr) fit-content(48%);
		align-items: baseline;
		font-size: .875rem;
		font-weight: 600;
	}
	.form-paper-total.numbered { grid-template-columns: 1.75rem minmax(0, 1fr) fit-content(48%); }
	.form-paper-total output { min-width: 0; text-align: end; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
	.final-total { background: var(--bg-hover); }
	.final-total output { font-size: 1.125rem; }
	.fixed-atc { margin: 0; font-size: .875rem; }
	.fixed-atc dt { color: var(--fg-muted); font-size: .8rem; }
	.fixed-atc dd { margin: .375rem 0 0; font-weight: 600; }
	.form-paper-feedback { margin: 0; padding: .75rem .875rem; border-block-start: 1px solid var(--border); }

	@container paper-form (min-width: 36rem) {
		.form-paper-grid > .form-paper-field { flex-basis: calc((100% - 1px) / 2); }
		.form-paper-money :global([data-slot="currency-input"] > [data-slot="form-item"]) {
			grid-template-columns: minmax(0, 1fr) minmax(10rem, 16rem);
			align-items: center;
		}
	}

	@container paper-form (min-width: 58rem) {
		.form-period > .form-paper-field { flex-basis: 0; }
		.form-period > .form-paper-field:has(.paired-period) { flex-grow: 2; }
	}
</style>
