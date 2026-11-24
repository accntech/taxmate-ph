<script lang="ts">
	import type { Snippet } from 'svelte';
	import AltArrowRight from '@solar-icons/svelte/category/arrows/Linear/AltArrowRight.svelte';
	import { CurrencyInput, NumberInput, RadioGroup, Select } from '$lib/components/ui';
	import { normalizeCurrencyInput } from '$lib/components/ui/currency-input/currency';
	import type { FormDefinition } from '$lib/forms';
	import { calculate1601EQ } from './form-1601-eq-rules';
	import LineItems from './line-items.svelte';
	import PaperFormHeader from '../paper-form-header.svelte';

	let { definition, values = $bindable(), errors = {}, onvaluechange, taxpayerInformation }: {
		definition: FormDefinition;
		values: Record<string, string>;
		errors?: Record<string, string>;
		onvaluechange?: (patch: Record<string, string>) => void;
		taxpayerInformation?: Snippet;
	} = $props();
	const prefix = 'frm1601EQ:';
	const lines = [13, 14, 15, 16, 17, 18];
	const calculated = $derived(calculate1601EQ(values));
	const withheld = $derived(values[prefix + 'optTaxesWithheld'] === 'Y');
	const amended = $derived(values[prefix + 'optAmendedReturn'] === 'Y');
	const due = $derived(Number(calculated[prefix + 'txtTotalAmountDue'] || 0));
	const creditFields = $derived(['txtRemittanceFirstMonth', 'txtRemittanceSecondMonth', ...(amended ? ['txtTaxRemittedPreviousReturn'] : []), ...(['Q2', 'Q3', 'Q4'].includes(values[prefix + 'optQuarter']) ? ['txtOverremittancePreviousQuarter'] : [])]);
	const penaltyFields = ['txtSurcharge', 'txtInterest', 'txtCompromise'];
	const invalidAmounts = $derived([...creditFields, ...penaltyFields, ...(withheld ? lines.map(line => 'txtTaxBase' + line) : [])].some(id => normalizeCurrencyInput(values[prefix + id] || '') === null));
	const hasPenalties = $derived(penaltyFields.some(id => Number(values[prefix + id] || 0) !== 0 || errors[prefix + id]));
	const yesNo = [{ value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }];
	const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
	function change(patch: Record<string, string>) {
		if (onvaluechange) onvaluechange(patch);
		else Object.assign(values, patch);
	}
	function set(id: string, value: string) { change({ [id]: value }); }
	function setQuarter(quarter: string) {
		const carryOverApplies = quarter !== 'Q4' && values[prefix + 'optQuarter'] !== 'Q4';
		change({
			[prefix + 'optQuarter']: quarter,
			...(!carryOverApplies && values[prefix + 'overpaymentOption'] === 'carry'
				? { [prefix + 'overpaymentOption']: '' } : {})
		});
	}
	function money(id: string) { return invalidAmounts ? '—' : currency.format(Number(calculated[prefix + id] || 0)); }
</script>

{#snippet amount(item: number, id: string, label: string)}
	<div class="paper-amount-row">
		<span class="paper-item-number" aria-hidden="true">{item}</span>
		<CurrencyInput id={prefix + id} {label} value={values[prefix + id] || ''}
			error={errors[prefix + id] || ''} onchange={(value) => set(prefix + id, value)} />
	</div>
{/snippet}

{#snippet total(item: number, id: string, label: string)}
	<dl class="paper-total-row">
		<div>
			<dt><span class="paper-item-number">{item}</span><span>{label}</span></dt>
			<dd>{money(id)}</dd>
		</div>
	</dl>
{/snippet}

<div class="paper-sheet">
	<PaperFormHeader number="1601-EQ" revision="January 2018" title="Quarterly Remittance Return"
		subtitle="of Creditable Income Taxes Withheld (Expanded)" />
	<section aria-label="Return period" class="paper-period">
		<div class="paper-period-field">
			<span class="paper-item-number" aria-hidden="true">1</span>
			<NumberInput id={prefix + 'txtYear'} label="Year" required min={1900} max={9999}
				value={values[prefix + 'txtYear'] || ''} error={errors[prefix + 'txtYear'] || ''} onchange={(value) => set(prefix + 'txtYear', value)} />
		</div>
		<div class="paper-period-field">
			<span class="paper-item-number" aria-hidden="true">2</span>
			<Select id={prefix + 'optQuarter'} label="Quarter" required value={values[prefix + 'optQuarter'] || ''} error={errors[prefix + 'optQuarter'] || ''}
				options={['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter'].map((label, index) => ({ value: `Q${index + 1}`, label }))} onchange={setQuarter} />
		</div>
		<div class="paper-period-field">
			<span class="paper-item-number" aria-hidden="true">3</span>
			<RadioGroup id={prefix + 'optAmendedReturn'} label="Amended return?" required value={values[prefix + 'optAmendedReturn'] || ''} options={yesNo}
				help="Choose Yes if this replaces a previously filed return for the same period."
				error={errors[prefix + 'optAmendedReturn'] || ''} onchange={(value) => set(prefix + 'optAmendedReturn', value)} />
		</div>
		<div class="paper-period-field">
			<span class="paper-item-number" aria-hidden="true">4</span>
			<RadioGroup id={prefix + 'optTaxesWithheld'} label="Any taxes withheld?" required value={values[prefix + 'optTaxesWithheld'] || ''} options={yesNo}
				help="Choosing No excludes ATC entries from calculations. Switch back to Yes to restore draft entries."
				error={errors[prefix + 'optTaxesWithheld'] || ''} onchange={(value) => set(prefix + 'optTaxesWithheld', value)} />
		</div>
		<div class="paper-period-field">
			<span class="paper-item-number" aria-hidden="true">5</span>
			<NumberInput id={prefix + 'txtSheetsAttached'} label="Sheets attached" min={0} value={values[prefix + 'txtSheetsAttached'] || ''} error={errors[prefix + 'txtSheetsAttached'] || ''} onchange={(value) => set(prefix + 'txtSheetsAttached', value)} />
		</div>
	</section>

	{@render taxpayerInformation?.()}

	<div class="paper-computation">
		<LineItems {values} {errors} onchange={change} />
		<aside aria-label="Summary" class="paper-summary">
			{@render total(19, 'txtTotalTaxesWithheld', 'Total taxes withheld for the quarter')}
			<details class="eq-disclosure paper-disclosure" open>
				<summary><span class="eq-disclosure-icon" aria-hidden="true"><AltArrowRight size={16} color="currentColor" /></span>Remittances and credits</summary>
				{@render amount(20, 'txtRemittanceFirstMonth', 'First month')}
				{@render amount(21, 'txtRemittanceSecondMonth', 'Second month')}
				{#if amended}
					{@render amount(22, 'txtTaxRemittedPreviousReturn', 'Previously filed return')}
				{/if}
				{#if ['Q2', 'Q3', 'Q4'].includes(values[prefix + 'optQuarter'])}
					{@render amount(23, 'txtOverremittancePreviousQuarter', 'Over-remittance from previous quarter')}
				{/if}
			</details>
			{@render total(24, 'txtTotalRemittances', 'Total remittances made')}
			{@render total(25, 'txtTaxStillDue', 'Tax still due / (over-remittance)')}
			<details class="eq-disclosure paper-disclosure" open={hasPenalties}>
				<summary><span class="eq-disclosure-icon" aria-hidden="true"><AltArrowRight size={16} color="currentColor" /></span>Penalties</summary>
				{@render amount(26, 'txtSurcharge', 'Surcharge')}
				{@render amount(27, 'txtInterest', 'Interest')}
				{@render amount(28, 'txtCompromise', 'Compromise')}
			</details>
			{@render total(29, 'txtTotalPenalties', 'Total penalties')}
			<div class="eq-amount-due paper-final-total">
				<p><span class="paper-item-number">30</span><span>Total amount still due / (over-remittance)</span></p>
				<p class="eq-total">{money('txtTotalAmountDue')}</p>
			</div>
			{#if invalidAmounts}
				<p role="status" class="eq-amount-error paper-feedback">Correct the amounts to calculate the total.</p>
			{/if}
			{#if !invalidAmounts && due < 0}
				<div class="paper-overpayment">
					<Select id={prefix + 'overpaymentOption'} label="Apply over-remittance as" required value={values[prefix + 'overpaymentOption'] || ''} error={errors[prefix + 'overpaymentOption'] || ''}
						options={[{ value: 'refund', label: 'Refund' }, { value: 'certificate', label: 'Tax credit certificate' }, { value: 'carry', label: 'Carry over to next quarter' }].filter(option => option.value !== 'carry' || values[prefix + 'optQuarter'] !== 'Q4')}
						onchange={(value) => set(prefix + 'overpaymentOption', value)} />
				</div>
			{/if}
		</aside>
	</div>
</div>

<style>
	.paper-period { display: grid; grid-template-columns: minmax(0, 1fr); }
	.paper-period-field { display: grid; grid-template-columns: 1rem minmax(0, 1fr); align-items: start; gap: .375rem; min-width: 0; padding: .875rem; border-bottom: 1px solid var(--border); }
	.paper-period-field :global([data-slot="form-item"]), .paper-amount-row :global([data-slot="form-item"]) { grid-template-columns: minmax(0, 1fr); }
	.paper-period-field :global(input:not([type="radio"])), .paper-amount-row :global(input) { width: 100%; min-width: 0; }
	.paper-period-field > .paper-item-number { padding-top: .125rem; }
	.paper-computation { min-width: 0; container: return-fields / inline-size; }
	.paper-summary { min-width: 0; border-top: 1px solid var(--border); }
	.paper-total-row { margin: 0; font-size: .875rem; }
	.paper-total-row > div { display: grid; grid-template-columns: minmax(0, 1fr) fit-content(48%); gap: .75rem; align-items: baseline; padding: .75rem .875rem; border-bottom: 1px solid var(--border); }
	.paper-total-row dt { display: grid; grid-template-columns: 1.5rem minmax(0, 1fr); gap: .375rem; }
	.paper-total-row dd { margin: 0; margin-inline-end: var(--paper-amount-inset); text-align: end; font-weight: 600; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
	.paper-amount-row { display: grid; grid-template-columns: 1.5rem minmax(0, 1fr); gap: .375rem; min-width: 0; padding: .75rem .875rem; border-top: 1px solid var(--border-soft); }
	.paper-amount-row > .paper-item-number { padding-top: .125rem; }
	.paper-disclosure { border-bottom: 1px solid var(--border); }
	.paper-disclosure > summary { padding: .625rem .875rem; width: 100%; border-radius: 0; color: var(--fg-muted); font-size: .8rem; }
	.paper-disclosure[open] > summary { margin-bottom: 0; }
	.paper-final-total { padding: .875rem; border-top: 0; background: var(--bg-hover); }
	.paper-final-total > p:first-child { display: grid; grid-template-columns: 1.5rem minmax(0, 1fr); gap: .375rem; color: var(--fg); font-size: .875rem; font-weight: 650; }
	.paper-final-total .eq-total { margin-inline: auto var(--paper-amount-inset); text-align: end; font-size: 1.125rem; letter-spacing: 0; }
	.paper-feedback, .paper-overpayment { padding: .875rem; border-top: 1px solid var(--border); }
	@container paper-form (min-width: 36rem) {
		.paper-period { grid-template-columns: repeat(2, minmax(0, 1fr)); }
		.paper-period-field:nth-child(odd) { border-right: 1px solid var(--border); }
		.paper-period-field:last-child { grid-column: 1 / -1; border-right: 0; }
		.paper-amount-row :global([data-slot="currency-input"] > [data-slot="form-item"]) { display: grid; grid-template-columns: minmax(0, 1fr) minmax(10rem, 16rem); gap: .375rem 1rem; align-items: center; }
	}
	@container paper-form (19rem <= width < 36rem) {
		.paper-period { grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); }
		.paper-period-field:first-child { border-right: 1px solid var(--border); }
		.paper-period-field:nth-child(n + 3) { grid-column: 1 / -1; }
	}
	@container paper-form (min-width: 52rem) {
		.paper-period { grid-template-columns: .8fr 1.15fr 1.45fr 1.6fr .9fr; }
		.paper-period-field { border-right: 1px solid var(--border); }
		.paper-period-field:last-child { grid-column: auto; border-right: 0; }
	}
	@container return-workspace (max-width: 28rem) {
		.paper-period-field { padding: .625rem .75rem; }
		.paper-amount-row { padding-block: .625rem; }
		.paper-period-field :global([data-slot="form-item"] > div:has(> input)) {
			min-height: 38px;
			padding-block: .25rem;
		}
		.paper-amount-row :global([data-slot="form-item"] > div:has(> input)) { min-height: 38px; }
		.paper-disclosure > summary,
		.paper-period-field :global([role="combobox"]),
		.paper-overpayment :global([role="combobox"]) { min-height: 38px; }
		.paper-period-field :global([data-slot="radio-group"] label) { min-height: 36px; }
		.paper-period-field :global(input:not([type="radio"])),
		.paper-period-field :global([role="combobox"]),
		.paper-amount-row :global(input),
		.paper-overpayment :global([role="combobox"]) { font-size: 14px; }
		@media (pointer: coarse) {
			.paper-period-field :global(input:not([type="radio"])),
			.paper-amount-row :global(input) { font-size: 16px; }
		}
	}
</style>
