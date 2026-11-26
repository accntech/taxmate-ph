<script lang="ts">
	import { FieldErrors } from '../field-errors';

	let { id, label, value = '', source, error = '', for: inputs, amountColumn = false }: {
		id?: string;
		label: string;
		value?: string;
		source?: string;
		error?: string;
		for?: string;
		amountColumn?: boolean;
	} = $props();
	const uid = $props.id();
	const description = $derived([source && `${uid}-source`, error && `${uid}-error`].filter(Boolean).join(' ') || undefined);
</script>

<div data-slot="calculated-value" class="calculated-value">
	<span id={`${uid}-label`} class="value-label">{label}</span>
	<output
		{id}
		class:amount-column={amountColumn}
		for={inputs}
		aria-labelledby={`${uid}-label`}
		aria-describedby={description}
		aria-live="off"
	>{value || '—'}</output>
	{#if source}<span id={`${uid}-source`} class="value-source">{source}</span>{/if}
	{#if error}<FieldErrors id={`${uid}-error`} errors={[error]} />{/if}
</div>

<style>
	.calculated-value {
		display: grid;
		grid-template-columns: minmax(0, 1fr) fit-content(60%);
		align-items: baseline;
		min-width: 0;
		gap: var(--form-label-gap) .625rem;
		overflow-wrap: anywhere;
	}
	.value-label { color: var(--fg-muted); font-size: var(--form-label-size); font-weight: 500; line-height: var(--form-label-line-height); }
	output { font-size: var(--form-control-size); font-weight: 600; font-family: var(--font-mono); font-variant-numeric: tabular-nums; text-align: end; }
	.amount-column { margin-inline-end: var(--paper-amount-inset, calc(.75rem + 1px)); }
	.value-source { grid-column: 2; color: var(--fg-muted); font-size: .75rem; line-height: 1.4; text-align: end; }
	.calculated-value > :global([data-slot="form-field-errors"]) { grid-column: 1 / -1; }
</style>
