<script lang="ts">
	import type { Snippet } from 'svelte';
	import { CurrencyInput, DateInput, NumberInput, RadioGroup, Select } from '$lib/components/ui';
	import { normalizeCurrencyInput } from '$lib/components/ui/currency-input/currency';
	import PaperFormHeader from '../paper-form-header.svelte';
	import { getWithholdingDefinition } from '../withholding-definitions';
	import { calculateWithholding, monthlyRemittanceDueDate } from '../withholding-rules';
	import '../form-editor-layout.css';

	let { code, values, errors, onvaluechange, taxpayerInformation }: {
		code: '0619E' | '0619F';
		values: Record<string, string>;
		errors: Record<string, string>;
		onvaluechange: (patch: Record<string, string>) => void;
		taxpayerInformation: Snippet;
	} = $props();

	const definition = $derived(getWithholdingDefinition(code)!);
	const prefix = $derived(definition.prefix);
	const fields = $derived(Object.fromEntries(definition.sections.flatMap(section => section.fields).map(field => [field.id, field])));
	const finalTax = $derived(code === '0619F');
	const creditItem = $derived(finalTax ? 16 : 15);
	const penaltyItem = $derived(creditItem + 2);
	const calculated = $derived(calculateWithholding(code, values));
	const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
	const editableAmounts = $derived(Object.values(fields).filter(field => field.type === 'money' && !field.readonly &&
		(!field.showWhen || values[field.showWhen.field] === field.showWhen.value)));
	const invalidAmounts = $derived(editableAmounts.some(field => normalizeCurrencyInput(values[field.id] ?? '') === null));
	const amended = $derived(values[prefix + 'optAmend'] === 'Y');
	const previousRemittance = $derived(prefix + `txtTax${creditItem}`);

	function changePeriod(name: string, value: string) {
		const patch = { [prefix + name]: value };
		if (name === 'optAmend' && value === 'N') patch[previousRemittance] = '0';
		if (name === 'txtYear' || name === 'txtMonth') {
			const year = prefix + 'txtYear';
			const month = prefix + 'txtMonth';
			const dueDate = prefix + 'dueDate';
			const priorSuggestion = monthlyRemittanceDueDate(values[year] ?? '', values[month] ?? '');
			if (!values[dueDate] || values[dueDate] === priorSuggestion) {
				patch[dueDate] = monthlyRemittanceDueDate(patch[year] ?? values[year] ?? '', patch[month] ?? values[month] ?? '');
			}
		}
		onvaluechange(patch);
	}
</script>

{#snippet periodField(name: string)}
	{@const { id, label, type, options, required } = fields[prefix + name]}
	{@const value = values[id] ?? ''}
	{@const error = errors[id] ?? ''}
	{#if type === 'date'}
		<DateInput {id} {label} {required} {value} {error} onchange={(next) => onvaluechange({ [id]: next })} />
	{:else if type === 'number'}
		<NumberInput {id} {label} {required} {value} {error} min={1900} max={9999} maxlength={4} onchange={(next) => changePeriod(name, next)} />
	{:else if name === 'txtMonth' || name === 'txtTaxTypeCode'}
		<Select {id} {label} options={options ?? []} {required} {value} {error} onchange={(next) => changePeriod(name, next)} />
	{:else}
		<RadioGroup {id} {label} options={options ?? []} {required} {value} {error} onchange={(next) => changePeriod(name, next)} />
	{/if}
{/snippet}

{#snippet periodItem(item: string, name: string)}
	<div class="period-cell">
		<span class="paper-item-number" aria-hidden="true">{item}</span>
		{@render periodField(name)}
	</div>
{/snippet}

{#snippet amount(item: number | string, name: string, label: string)}
	{@const id = prefix + name}
	<div class="remittance-row">
		<span class="paper-item-number" aria-hidden="true">{item}</span>
		<CurrencyInput {id} {label} required={fields[id].required} value={values[id] ?? ''} error={errors[id] ?? ''}
			onchange={(next) => onvaluechange({ [id]: next })} />
	</div>
{/snippet}

{#snippet total(item: number | string, name: string, label: string, final = false)}
	{@const id = prefix + name}
	<div class={['remittance-row', 'remittance-total', { final }]}>
		<span class="paper-item-number" aria-hidden="true">{item}</span>
		<span id={`${id}-label`}>{label}</span>
		<output {id} aria-labelledby={`${id}-label`} aria-live="off">
			{invalidAmounts ? '—' : currency.format(Number(calculated[id]))}
		</output>
	</div>
{/snippet}

<div class="paper-sheet">
	<PaperFormHeader number={finalTax ? '0619-F' : '0619-E'} revision="January 2018" title="Monthly Remittance Form"
		subtitle={finalTax ? 'of Final Income Taxes Withheld' : 'of Creditable Income Taxes Withheld (Expanded)'} />

	<section class={['remittance-period', { 'final-tax': finalTax }]} aria-label="Return period">
		<div class="period-cell">
			<span class="paper-item-number" aria-hidden="true">1</span>
			<div class="month-year">
				{@render periodField('txtMonth')}
				{@render periodField('txtYear')}
			</div>
		</div>
		{@render periodItem('2', 'dueDate')}
		{@render periodItem('3', 'optAmend')}
		{@render periodItem('4', 'optWithheld')}
		{#if finalTax}
			{@render periodItem('5', 'txtTaxTypeCode')}
		{:else}
			<dl class="constant-codes">
				<div><dt><span class="paper-item-number" aria-hidden="true">5</span> ATC</dt><dd>WME10</dd></div>
				<div><dt><span class="paper-item-number" aria-hidden="true">6</span> Tax type code</dt><dd>WE</dd></div>
			</dl>
		{/if}
	</section>

	{@render taxpayerInformation()}

	<section aria-labelledby="tax-remittance">
		<h2 class="remittance-heading" id="tax-remittance">Part II · Tax Remittance</h2>
		{#if finalTax}
			{@render amount(13, 'txtTax13', 'WMF10 — Final tax on interest from deposits, deposit substitutes and trusts')}
			{@render amount(14, 'txtTax14', 'WMF20 — Other final income taxes withheld')}
			{@render total(15, 'txtTax15', 'Total taxes withheld')}
		{:else}
			{@render amount(14, 'txtTax14', 'Amount of remittance')}
		{/if}
		{#if amended}
			{@render amount(creditItem, `txtTax${creditItem}`, 'Amount previously remitted')}
		{/if}
		{@render total(creditItem + 1, `txtTax${creditItem + 1}`, 'Net amount of remittance')}
		<h3 class="penalties-heading"><span class="paper-item-number">{penaltyItem}</span> Add: Penalties</h3>
		{@render amount(`${penaltyItem}A`, `txtTax${penaltyItem}A`, 'Surcharge')}
		{@render amount(`${penaltyItem}B`, `txtTax${penaltyItem}B`, 'Interest')}
		{@render amount(`${penaltyItem}C`, `txtTax${penaltyItem}C`, 'Compromise')}
		{@render total(`${penaltyItem}D`, `txtTax${penaltyItem}D`, 'Total penalties')}
		{@render total(penaltyItem + 1, `txtTax${penaltyItem + 1}`, 'Total amount of remittance', true)}
		{#if invalidAmounts}
			<p role="status" class="eq-amount-error remittance-feedback">Correct the amounts to calculate the total.</p>
		{/if}
	</section>
</div>

<style>
	.remittance-period { display: grid; grid-template-columns: minmax(0, 1fr); border-bottom: 1px solid var(--border); }
	.period-cell, .remittance-row {
		display: grid;
		grid-template-columns: 1.75rem minmax(0, 1fr);
		align-items: start;
		gap: .375rem;
		min-width: 0;
		padding: .75rem .875rem;
		border-bottom: 1px solid var(--border);
	}
	.period-cell:last-child { border-bottom: 0; }
	.month-year { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: .5rem; }
	.period-cell :global([data-slot="date-input"]) { max-inline-size: 18rem; }
	.period-cell :global([data-slot="form-item"]), .remittance-row :global([data-slot="form-item"]) {
		grid-template-columns: minmax(0, 1fr);
	}
	.period-cell :global([data-slot="input"]:not([role="spinbutton"])), .remittance-row :global([data-slot="input"]) { width: 100%; min-width: 0; }
	.constant-codes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 0; }
	.constant-codes div { min-width: 0; padding: .75rem .875rem; }
	.constant-codes div + div { border-inline-start: 1px solid var(--border); }
	.constant-codes dt { color: var(--fg-muted); font-size: .8rem; line-height: var(--form-label-line-height); }
	.constant-codes dt span { margin-inline-end: .5rem; color: var(--fg); }
	.constant-codes dd { margin: .375rem 0 0; font-size: .875rem; font-weight: 600; }
	.remittance-heading, .penalties-heading {
		margin: 0;
		padding: .5rem .875rem;
		border-block: 1px solid var(--border);
		background: var(--paper-section-background, var(--bg-hover));
		font: 600 .875rem/1.4 var(--font-sans);
	}
	.penalties-heading { border-top: 0; }
	.penalties-heading span { display: inline-block; width: 1.75rem; margin-inline-end: .375rem; }
	.remittance-total {
		grid-template-columns: 1.75rem minmax(0, 1fr) fit-content(45%);
		align-items: baseline;
		font-size: .875rem;
		font-weight: 600;
	}
	.remittance-total output { margin-inline-end: var(--paper-amount-inset); text-align: end; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
	.final { border-bottom: 0; background: var(--bg-hover); }
	.final output { font-size: 1.125rem; }
	.remittance-feedback { margin: 0; padding: .75rem .875rem; border-top: 1px solid var(--border); }

	@container paper-form (min-width: 36rem) {
		.remittance-period { grid-template-columns: repeat(2, minmax(0, 1fr)); }
		.period-cell + .period-cell:nth-child(even) { border-inline-start: 1px solid var(--border); }
		.constant-codes, .final-tax > .period-cell:last-child { grid-column: 1 / -1; }
		.remittance-row :global([data-slot="currency-input"] > [data-slot="form-item"]) {
			grid-template-columns: minmax(0, 1fr) minmax(10rem, 16rem);
			align-items: center;
		}
	}
	@container paper-form (min-width: 57rem) {
		.remittance-period { grid-template-columns: minmax(12rem, 1.4fr) minmax(11rem, 1.3fr) minmax(8rem, 1fr) minmax(9rem, 1fr) minmax(10rem, 1fr); }
		.period-cell + .period-cell, .constant-codes { border-inline-start: 1px solid var(--border); }
		.period-cell { border-bottom: 0; }
		.constant-codes, .final-tax > .period-cell:last-child { grid-column: auto; }
	}
	@container paper-form (min-width: 64rem) {
		.remittance-period.final-tax {
			grid-template-columns: minmax(12rem, 1.4fr) minmax(11rem, 1.3fr) minmax(8rem, 1fr) minmax(9rem, 1fr) minmax(15rem, 1.45fr);
		}
	}
</style>
