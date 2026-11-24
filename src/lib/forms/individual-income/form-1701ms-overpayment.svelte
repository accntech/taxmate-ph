<script lang="ts">
	import { CheckboxInput, CurrencyInput, FieldErrors } from '$lib/components/ui';
	import {
		get1701MSOverpaymentAllocation, has1701MSOverpayment, is1701MSOverpaymentSelected, overpaymentOptions1701MS
	} from './form-1701ms-overpayment';

	let { values, calculated, errors, ready = true, onvaluechange }: {
		values: Record<string, string>;
		calculated: Record<string, string>;
		errors: Record<string, string>;
		ready?: boolean;
		onvaluechange: (patch: Record<string, string>) => void;
	} = $props();

	const uid = $props.id();
	const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
	const [refund, certificate] = overpaymentOptions1701MS;
	const allocation = $derived(get1701MSOverpaymentAllocation(values, calculated));
	const choicesError = $derived(errors[refund.choice]);
</script>

{#if ready && has1701MSOverpayment(calculated)}
	<fieldset class="overpayment" aria-describedby={`${uid}-help ${uid}-allocation`}>
		<legend>31 · Overpayment disposition</legend>
		<p class="help" id={`${uid}-help`}>Choose up to two options. A refund and a tax credit certificate cannot be combined.</p>
		{#each overpaymentOptions1701MS as option (option.choice)}
			{@const checked = is1701MSOverpaymentSelected(option, values)}
			{@const incompatible = option === refund ? certificate : option === certificate ? refund : undefined}
			{@const error = option === refund ? undefined : errors[option.choice]}
			<div class="choice">
				<div class="choice-label">
					<CheckboxInput id={option.choice} label={option.label} {checked}
						disabled={!checked && !!incompatible && allocation.selected.includes(incompatible)}
						aria-invalid={error ? 'true' : undefined} aria-describedby={error ? `${option.choice}-error` : undefined}
						onchange={(event) => onvaluechange(event.currentTarget.checked
							? { [option.choice]: 'Y' }
							: { [option.choice]: '', [option.amount]: '' })} />
					{#if error}<FieldErrors id={`${option.choice}-error`} errors={[error]} />{/if}
				</div>
				{#if checked}
					<CurrencyInput id={option.amount} aria-label={option.amountLabel} value={values[option.amount] ?? ''}
						error={errors[option.amount]} maxlength={12} required
						onchange={(value) => onvaluechange({ [option.amount]: value })} />
				{/if}
			</div>
		{/each}
		<p class="allocation" id={`${uid}-allocation`}>
			<span>Allocated from Item 27 ({currency.format(allocation.requiredCents / 100)})</span>
			<strong>{currency.format(allocation.allocatedCents / 100)}</strong>
		</p>
		{#if choicesError}<FieldErrors errors={[choicesError]} />{/if}
	</fieldset>
{/if}

<style>
	.overpayment {
		min-inline-size: 0;
		margin: .625rem .875rem;
		padding: .625rem .75rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
	}
	legend { padding-inline: .375rem; font-weight: 650; }
	.help { margin: 0 0 .5rem; color: var(--fg-muted); font-size: .8125rem; }
	.choice {
		display: grid;
		gap: .375rem .75rem;
		padding-block: .375rem;
		border-block-end: 1px solid var(--border-soft);
	}
	.choice-label { min-inline-size: 0; }
	.choice > :global([data-slot='currency-input']) { inline-size: 100%; max-inline-size: 12rem; justify-self: end; }
	.choice :global([data-slot='currency-input'] > [data-slot='form-item']) { grid-template-columns: minmax(0, 1fr); }
	.allocation { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: .25rem .625rem; align-items: baseline; margin: .625rem 0 0; margin-inline-end: var(--paper-amount-inset); font-size: .8125rem; }
	.allocation span { color: var(--fg-muted); }
	.allocation strong { text-align: end; font-variant-numeric: tabular-nums; }
	@container paper-form (width >= 32rem) {
		.choice { grid-template-columns: minmax(0, 1fr) 12rem; align-items: center; }
	}
</style>
