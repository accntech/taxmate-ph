<script lang="ts">
	import { tick } from 'svelte';
	import AltArrowRight from '@solar-icons/svelte/category/arrows/Linear/AltArrowRight.svelte';
	import AtcPicker from './atc-picker.svelte';
	import { Button, CalculatedValue, CurrencyInput, DateInput, Input, NumberInput, RadioGroup, Select } from '$lib/components/ui';
	import { normalizeCurrencyInput } from '$lib/components/ui/currency-input/currency';
	import { withholdingSchedules, withholdingRowCountKey, type WithholdingDefinition, type WithholdingField, type WithholdingSchedule } from './withholding-definitions';
	import { calculateWithholding } from './withholding-rules';
	import './withholding-layout.css';
	import './form-editor-layout.css';

	let { definition, values, errors = {}, onvaluechange, taxpayerHref = '' }: {
		definition: WithholdingDefinition;
		values: Record<string, string>;
		errors?: Record<string, string>;
		onvaluechange?: (patch: Record<string, string>) => void;
		taxpayerHref?: string;
	} = $props();
	let addedRows = $state<Record<string, string[]>>({});
	const calculated = $derived(calculateWithholding(definition.code, values));
	const schedules = $derived(withholdingSchedules(definition, values));
	const catalogAtcIds = $derived(new Set(schedules.flatMap(schedule => schedule.id === 'atc' ? schedule.rows.map(row => row.fields[0].id) : schedule.id === 'payees' ? schedule.rows.map(row => row.fields[2].id) : [])));
	const fields = $derived([
		...definition.sections.flatMap(section => section.fields),
		...schedules.flatMap(schedule => [...schedule.rows.flatMap(row => row.fields), ...(schedule.totals ?? [])])
	]);
	const invalidAmounts = $derived(fields.some(field => field.type === 'money' && !field.readonly && visible(field) && normalizeCurrencyInput(values[field.id] ?? '') === null));
	const totalField = $derived(fields.find(field => field.id === definition.totalField));
	const summaryFields = $derived(definition.sections.flatMap(section => section.fields).filter(field => field.readonly && field.type === 'money' && field.id !== definition.totalField));
	const disclosureGroups = [
		{ id: 'credits', title: 'Remittances and credits' },
		{ id: 'penalties', title: 'Penalties' },
		{ id: 'attachments', title: 'Attachments' }
	] as const;
	const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
	function displayLabel(label: string) {
		return label.replace(/^\d+[A-Z]?(?:[.):-])?\s+/i, '');
	}
	function visible(field: WithholdingField) {
		return !field.showWhen || values[field.showWhen.field] === field.showWhen.value;
	}
	function change(id: string, value: string) {
		if (onvaluechange) onvaluechange({ [id]: value });
	}
	function display(field: WithholdingField, value: string) {
		if (!value) return '—';
		if (field.type === 'money') {
			const normalized = normalizeCurrencyInput(value);
			return normalized === null ? '—' : currency.format(Number(normalized));
		}
		return field.options?.find(option => option.value === value)?.label ?? value;
	}
	function rowHasValues(rowFields: WithholdingField[]) {
		return rowFields.some(field => !!errors[field.id] || (!field.readonly && !!values[field.id]?.trim() && (field.type !== 'money' && field.type !== 'number' || Number(values[field.id].replaceAll(',', '')) !== 0)));
	}
	function groupFields(group: WithholdingField['group']) {
		return definition.sections.flatMap(section => section.fields).filter(field => field.group === group && !field.profileKey && !field.readonly && visible(field));
	}
	function visibleRows(schedule: WithholdingSchedule) {
		const initialCount = definition.schedules.find(item => item.id === schedule.id)?.rows.length ?? 0;
		const rows = schedule.rows.filter((row, index) => rowHasValues(row.fields) || addedRows[schedule.id]?.includes(row.id) || index >= initialCount);
		return rows.length ? rows : schedule.rows.slice(0, 1);
	}
	function canAddRow(schedule: WithholdingSchedule) {
		return visibleRows(schedule).length < schedule.rows.length || (schedule.repeatable && schedule.rows.length < 1000);
	}
	async function addRow(schedule: WithholdingSchedule) {
		const visibleIds = new Set(visibleRows(schedule).map(row => row.id));
		let row = schedule.rows.find(item => !visibleIds.has(item.id));
		if (!row && schedule.repeatable && schedule.rows.length < 1000) {
			change(withholdingRowCountKey(definition, schedule.id), String(schedule.rows.length + 1));
			await tick();
			row = schedules.find(item => item.id === schedule.id)?.rows.at(-1);
		}
		if (row) {
			addedRows = { ...addedRows, [schedule.id]: [...visibleIds, row.id] };
			await tick();
			document.getElementById(row.fields.find(field => !field.readonly)?.id ?? '')?.focus();
		}
	}
</script>

{#snippet control(field: WithholdingField)}
	{#if visible(field)}
		{#if field.readonly}
			<CalculatedValue id={field.id} label={displayLabel(field.label)} value={invalidAmounts && field.type === 'money' ? '' : display(field, calculated[field.id] ?? values[field.id] ?? '')} error={displayLabel(errors[field.id] ?? '')} />
		{:else if catalogAtcIds.has(field.id)}
			<AtcPicker id={field.id} label={displayLabel(field.label)} formCode={definition.code} category={values[definition.prefix + 'optCategory'] ?? ''} year={Number(values[definition.yearField])} required={field.required ?? false} value={values[field.id] ?? ''} error={displayLabel(errors[field.id] ?? '')} onchange={(value) => change(field.id, value)} />
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

<div class="wh-preparation">
 <div class="eq-layout">
  <div class="eq-fields">
   {#each definition.sections as section (section.id)}
    {@const mainFields = section.fields.filter(field => !field.group && !field.profileKey && !(field.readonly && field.type === 'money') && visible(field))}
    {#if mainFields.length}
     <section class="eq-section" aria-label={section.id === 'taxpayer' ? 'Return details' : section.title}>
      <header class="eq-section-header"><h2>{section.id === 'taxpayer' ? 'Return details' : section.title}</h2></header>
      <div class="eq-field-grid">
       {#each mainFields as field (field.id)}{@render control(field)}{/each}
      </div>
     </section>
    {/if}
   {/each}
   {#each schedules as schedule (schedule.id)}
    <details class="eq-section eq-disclosure wh-schedule" open={schedule.id === 'atc' || schedule.rows.some(row => rowHasValues(row.fields)) || !!addedRows[schedule.id]?.length}>
     <summary><span class="eq-disclosure-icon" aria-hidden="true"><AltArrowRight size={16} color="currentColor" /></span>{schedule.title}</summary>
     {#each visibleRows(schedule) as row (row.id)}
      <fieldset aria-label={`${schedule.title}: ${row.label}`} class="wh-schedule-entry">
       <legend class="wh-row-label">{row.label}</legend>
       <div class="eq-field-grid">
        {#each row.fields as field (field.id)}{@render control(field)}{/each}
       </div>
      </fieldset>
     {/each}
     {#if canAddRow(schedule)}
      <div class="wh-schedule-actions"><Button type="button" variant="secondary" size="sm" aria-label={`Add row to ${schedule.title}`} onclick={() => void addRow(schedule)}>Add row</Button></div>
     {/if}
     {#if definition.period !== 'year' && schedule.totals?.length}
      <div class="eq-field-grid wh-schedule-totals">
       {#each schedule.totals as field (field.id)}{@render control(field)}{/each}
      </div>
     {/if}
    </details>
   {/each}
   {#each disclosureGroups as group (group.id)}
    {@const grouped = groupFields(group.id)}
    {#if grouped.length}
     <details class="eq-section eq-disclosure" open={rowHasValues(grouped) || (group.id === 'credits' && Object.entries(values).some(([id, value]) => /optAmend/.test(id) && value === 'Y'))}>
      <summary><span class="eq-disclosure-icon" aria-hidden="true"><AltArrowRight size={16} color="currentColor" /></span>{group.title}</summary>
      <div class="eq-field-grid">
       {#each grouped as field (field.id)}{@render control(field)}{/each}
      </div>
     </details>
    {/if}
   {/each}
  </div>
  {#if totalField}
   <aside class="eq-totals" aria-label="Summary">
    <div class="eq-totals-content">
     <section class="eq-summary">
      <h2 class="eq-summary-heading">{definition.period === 'year' ? 'Remittances' : 'Summary'}</h2>
      {#if definition.period === 'year'}
       {#each schedules.filter(schedule => schedule.totals?.length) as schedule (schedule.id)}
        <h3 class="wh-summary-group">{schedule.title}</h3>
        <dl class="eq-breakdown">
         {#each (schedule.totals ?? []).filter(visible) as field (field.id)}
          <div><dt>{displayLabel(field.label)}</dt><dd>{invalidAmounts ? '—' : display(field, calculated[field.id] ?? values[field.id] ?? '')}</dd></div>
         {/each}
        </dl>
       {/each}
      {:else}
       <dl class="eq-breakdown">
        {#each summaryFields.filter(visible) as field (field.id)}
         <div><dt>{displayLabel(field.label)}</dt><dd>{invalidAmounts ? '—' : display(field, calculated[field.id] ?? values[field.id] ?? '')}</dd></div>
        {/each}
       </dl>
       <div class="eq-amount-due"><p>{displayLabel(totalField.label)}</p><output id={definition.totalField} class="eq-total">{invalidAmounts ? '—' : display(totalField, calculated[definition.totalField] ?? values[definition.totalField] ?? '')}</output></div>
      {/if}
      {#if invalidAmounts}<p role="status" class="eq-amount-error">Correct the amounts to calculate the total.</p>{/if}
     </section>
    </div>
   </aside>
  {/if}
 </div>
</div>
