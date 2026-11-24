<script lang="ts">
	import type { Snippet } from 'svelte';
	import { CurrencyInput, DateInput, FieldErrors, Input, Label, NumberInput, RadioGroup, Select } from '$lib/components/ui';
	import { Combobox } from '$lib/components/ui/combobox';
	import { normalizeCurrencyInput } from '$lib/components/ui/currency-input/currency';
	import AtcPicker from '../atc-picker.svelte';
	import PaperFormHeader from '../paper-form-header.svelte';
	import { getWithholdingDefinition } from '../withholding-definitions';
	import { calculateWithholding } from '../withholding-rules';
	import { taxTypeOptions } from './tax-types';
	import '../form-editor-layout.css';

	let { values, errors, onvaluechange, taxpayerInformation }: {
		values: Record<string, string>;
		errors: Record<string, string>;
		onvaluechange: (patch: Record<string, string>) => void;
		taxpayerInformation: Snippet;
	} = $props();

	const definition = getWithholdingDefinition('0605')!;
	const { code, prefix } = definition;
	const fields = Object.fromEntries(definition.sections.flatMap(section => section.fields).map(field => [field.id, field]));
	const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
	const calculated = $derived(calculateWithholding(code, values));
	const individual = $derived(calculated[prefix + 'txtClassification'] === 'I');
	const taxType = $derived(values[prefix + 'txtTaxTypeCode'] ?? '');
	const availableTaxTypes = $derived(taxType && !taxTypeOptions.some(option => option.value === taxType)
		? [{ value: taxType, label: taxType, secondary: '' }, ...taxTypeOptions]
		: taxTypeOptions);
	const amounts = ['txtTax19', 'txtTax20A', 'txtTax20B', 'txtTax20C'];
	const invalidAmounts = $derived(amounts.some(name => normalizeCurrencyInput(values[prefix + name] ?? '') === null));
	const approvalApplies = $derived([
		'Preliminary/final assessment / deficiency',
		'Accounts receivable / delinquent account'
	].includes(values[prefix + 'itemMannerOfPayment']));

	function change(name: string, value: string) {
		const patch = { [prefix + name]: value };
		if (name === 'itemModeOfPayment' && value !== 'Installment') patch[prefix + 'txtNumOfInstallment'] = '';
		if (name === 'itemMannerOfPayment') {
			if (value !== 'Others') patch[prefix + 'txtOthersName'] = '';
			if (!['Preliminary/final assessment / deficiency', 'Accounts receivable / delinquent account'].includes(value)) {
				patch[prefix + 'itemApprovedYN'] = '';
			}
		}
		onvaluechange(patch);
	}
</script>

{#snippet input(name: string)}
	{@const field = fields[prefix + name]}
	{@const { id, type, options, required } = field}
	{@const label = field.label.replace(/^\d+[A-Z]?\s+/, '')}
	{@const value = calculated[id] ?? field.defaultValue ?? ''}
	{@const error = (errors[id] ?? '').replace(/^\d+[A-Z]?\s+/, '')}
	{#if name === 'txtATCCode'}
		<AtcPicker {id} {label} formCode={code} category="" fieldOptions={options ?? []} year={Number(values[definition.yearField])}
			{required} {value} {error} onchange={(next) => onvaluechange({ [id]: next })} />
	{:else if name === 'txtTaxTypeCode'}
		<div class="tax-type-field" data-slot="form-item">
			<Label for={id}>{label}<span class="required-mark" aria-hidden="true">*</span></Label>
			<Combobox {id} options={availableTaxTypes} value={taxType || null} aria-required={required}
				aria-describedby={error ? `${id}-error` : undefined} invalid={!!error} clearable
				placeholder="Choose tax type" searchPlaceholder="Search tax type code or name" emptyMessage="No matching tax types."
				wrapOptions itemHeight={44} maxVisibleItems={5}
				onValueChange={(next) => onvaluechange({ [id]: typeof next === 'string' ? next : '' })}>
				{#snippet trigger(option)}
					<span class="tax-type-selection">
						<strong>{option.label}</strong>
						{#if option.secondary}<span title={option.secondary}>{option.secondary}</span>{/if}
					</span>
				{/snippet}
				{#snippet option(option, matchedText)}
					<span class="tax-type-option">
						<strong>{@render matchedText('label')}</strong>
						{#if option.secondary}<span>{@render matchedText('secondary')}</span>{/if}
					</span>
				{/snippet}
			</Combobox>
			{#if error}<FieldErrors id={`${id}-error`} errors={[error]} />{/if}
		</div>
	{:else if name === 'itemApprovedYN' || name === 'itemModeOfPayment'}
		<RadioGroup {id} {label} options={options ?? []} required={required || name === 'itemApprovedYN'} {value} {error} onchange={(next) => change(name, next)} />
	{:else if type === 'select'}
		<Select {id} {label} options={options ?? []} {required} {value} {error}
			disabled={individual && (name === 'itemFiscalStartMonth' || name === 'itemYearEndMonth')}
			onchange={(next) => change(name, next)} />
	{:else if type === 'number'}
		<NumberInput {id} {label} {required} {value} {error}
			min={name === 'txtYearEnded' ? definition.minYear : name === 'txtNumOfInstallment' ? 1 : 0}
			max={name === 'txtYearEnded' ? 3000 : name === 'txtNumOfInstallment' ? 20 : 99}
			maxlength={name === 'txtYearEnded' ? 4 : 2}
			onchange={(next) => onvaluechange({ [id]: next })} />
	{:else if type === 'date'}
		<DateInput {id} {label} {required} {value} {error} onchange={(next) => onvaluechange({ [id]: next })} />
	{:else if type === 'money'}
		<CurrencyInput {id} {label} {required} {value} {error} onchange={(next) => onvaluechange({ [id]: next })} />
	{:else}
		<Input {id} {label} {required} {value} {error} oninput={(event) => onvaluechange({ [id]: event.currentTarget.value })} />
	{/if}
{/snippet}

{#snippet control(name: string, item?: string, cell = '')}
	{@const condition = fields[prefix + name].showWhen}
	{#if !condition || values[condition.field] === condition.value}
		<div class={['payment-cell', cell, { numbered: item }]}>
			{#if item}<span class="paper-item-number" aria-hidden="true">{item}</span>{/if}
			{@render input(name)}
		</div>
	{/if}
{/snippet}

{#snippet total(item: string, name: string, label: string, final = false)}
	<div class={['payment-total', { final }]}>
		<span class="paper-item-number" aria-hidden="true">{item}</span>
		<span id={`${prefix}${name}-label`}>{label}</span>
		<output id={prefix + name} aria-labelledby={`${prefix}${name}-label`} aria-live="off">
			{invalidAmounts ? '—' : currency.format(Number(calculated[prefix + name]))}
		</output>
	</div>
{/snippet}

<div class="paper-sheet">
	<PaperFormHeader number="0605" revision="September 2003 (ENCS)" title="Payment Form" />
	<section class="period-grid" aria-label="Return period">
		{@render control('itemFiscalStartMonth', '1', 'year-basis')}
		<div class="payment-cell numbered year-end">
			<span class="paper-item-number" aria-hidden="true">2</span>
			<div class="year-ended">
				{@render input('itemYearEndMonth')}
				{@render input('txtYearEnded')}
			</div>
		</div>
		{@render control('itemQuarter', '3', 'quarter')}
		{@render control('dueDate', '4', 'due-date')}
		{@render control('txtNoOfSheets', '5', 'sheets')}
		{@render control('txtATCCode', '6', 'atc')}
		{@render control('date', '7', 'return-date')}
		{@render control('txtTaxTypeCode', '8', 'tax-type')}
	</section>

	{@render taxpayerInformation()}
	<section class="payment-choices" aria-label="Payment choices">
		<div>
			{@render control('itemMannerOfPayment', '17')}
			{@render control('txtOthersName')}
		</div>
		<div>
			{@render control('itemModeOfPayment', '18')}
			{@render control('txtNumOfInstallment')}
		</div>
	</section>

	<section aria-labelledby="computation-of-tax">
		<h2 class="payment-section-heading" id="computation-of-tax">Part II · Computation of Tax</h2>
		{@render control('txtTax19', '19', 'basic-tax')}
		<div class="penalties">
			{@render control('txtTax20A', '20A')}
			{@render control('txtTax20B', '20B')}
			{@render control('txtTax20C', '20C')}
		</div>
		{@render total('20D', 'txtTax20D', 'Total penalties')}
		{@render total('21', 'txtTax21', 'Total amount payable', true)}
		{#if invalidAmounts}
			<p role="status" class="eq-amount-error payment-feedback">Correct the amounts to calculate the total.</p>
		{/if}
		{#if approvalApplies}
			{@render control('itemApprovedYN')}
		{/if}
	</section>
</div>

<style>
	.period-grid, .payment-choices, .penalties { display: grid; grid-template-columns: minmax(0, 1fr); }
	.period-grid { border-bottom: 1px solid var(--border); }
	.year-ended { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); align-items: start; gap: .5rem; }
	.tax-type-field { display: grid; min-width: 0; gap: var(--form-label-gap); }
	.required-mark { margin-inline-start: .25rem; color: var(--danger); }
	.tax-type-option { display: grid; grid-template-columns: 2rem minmax(0, 1fr); gap: .5rem; width: 100%; }
	.tax-type-selection { display: flex; gap: .5rem; align-items: baseline; min-width: 0; }
	.tax-type-selection > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.payment-cell {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: start;
		gap: .375rem;
		min-width: 0;
		padding: .75rem .875rem;
		border-top: 1px solid var(--border);
	}
	.payment-cell.numbered { grid-template-columns: 1.75rem minmax(0, 1fr); }
	.payment-cell > .paper-item-number { padding-top: .125rem; }
	.payment-cell :global([data-slot="form-item"]) { grid-template-columns: minmax(0, 1fr); }
	.payment-cell :global([data-slot="form-item"] input:not([type="radio"])) { width: 100%; min-width: 0; }
	.payment-cell :global([data-slot="form-item"]:has(input[inputmode="numeric"])) { max-inline-size: 9rem; }
	.payment-cell :global([data-slot="date-input"]) { max-inline-size: 18rem; }
	.payment-choices { --radio-choice-row-gap: .25rem; }
	.period-grid > .payment-cell:first-child { border-top: 0; }
	.payment-section-heading {
		margin: 0;
		padding: .5rem .875rem;
		border-top: 1px solid var(--border);
		background: var(--bg-hover);
		font-size: .875rem;
		font-weight: 600;
	}
	.payment-total {
		display: grid;
		grid-template-columns: 1.75rem minmax(0, 1fr) fit-content(48%);
		align-items: baseline;
		gap: .375rem;
		padding: .75rem .875rem;
		border-top: 1px solid var(--border);
		font-size: .875rem;
		font-weight: 600;
	}
	.payment-total output { text-align: end; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
	.payment-total.final { background: var(--bg-hover); }
	.payment-total.final output { font-size: 1.125rem; }
	.payment-feedback { margin: 0; padding: .75rem .875rem; border-top: 1px solid var(--border); }

	@container paper-form (min-width: 36rem) {
		.payment-choices { grid-template-columns: repeat(2, minmax(0, 1fr)); }
		.payment-choices > div + div { border-inline-start: 1px solid var(--border); }
		.penalties { grid-template-columns: repeat(3, minmax(0, 1fr)); }
		.penalties > .payment-cell + .payment-cell { border-inline-start: 1px solid var(--border); }
		.basic-tax :global([data-slot="currency-input"] > [data-slot="form-item"]) {
			grid-template-columns: minmax(0, 1fr) minmax(10rem, 16rem);
			align-items: center;
		}
	}
	@container paper-form (36rem <= width < 62rem) {
		.period-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
		.period-grid > .payment-cell:nth-child(-n + 2) { border-top: 0; }
		.period-grid > .payment-cell:nth-child(even) { border-inline-start: 1px solid var(--border); }
	}
	@container paper-form (min-width: 62rem) {
		.period-grid {
			grid-template-columns: minmax(0, 1.48fr) minmax(0, .85fr) minmax(0, 1.15fr) minmax(0, .88fr) minmax(0, 1fr);
			grid-template-areas:
				"basis quarter due sheets atc"
				"year-end quarter due sheets atc"
				"return-date return-date tax-type tax-type tax-type";
		}
		.period-grid > .payment-cell { border-top: 0; border-inline-start: 0; }
		.period-grid > :is(.quarter, .due-date, .sheets, .atc, .tax-type) { border-inline-start: 1px solid var(--border); }
		.period-grid > :is(.year-end, .return-date, .tax-type) { border-top: 1px solid var(--border); }
		.year-basis { grid-area: basis; }
		.year-end { grid-area: year-end; }
		.quarter { grid-area: quarter; }
		.due-date { grid-area: due; }
		.sheets { grid-area: sheets; }
		.atc { grid-area: atc; }
		.return-date { grid-area: return-date; }
		.tax-type { grid-area: tax-type; }
	}
</style>
