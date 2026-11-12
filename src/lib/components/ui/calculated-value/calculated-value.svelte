<script lang="ts">
	import { FieldErrors } from '../field-errors';

	let { id, label, value = '', source = 'Calculated', error = '', for: inputs }: {
		id?: string;
		label: string;
		value?: string;
		source?: string;
		error?: string;
		for?: string;
	} = $props();
	const uid = $props.id();
</script>

<div data-slot="calculated-value" class="calculated-value">
	<span id={`${uid}-label`} class="value-label">{label}</span>
	<output
		{id}
		for={inputs}
		aria-labelledby={`${uid}-label`}
		aria-describedby={`${uid}-source${error ? ` ${uid}-error` : ''}`}
		aria-live="off"
	>{value || '—'}</output>
	<span id={`${uid}-source`} class="value-source">{source}</span>
	{#if error}<FieldErrors id={`${uid}-error`} errors={[error]} />{/if}
</div>

<style>
	.calculated-value { display: grid; min-width: 0; gap: var(--form-label-gap); }
	.value-label { color: var(--fg-muted); font-size: var(--form-label-size); font-weight: 500; line-height: var(--form-label-line-height); }
	output { display: block; min-height: var(--form-control-height); padding-block: .5rem; border-bottom: 1px solid var(--border-soft); font-size: var(--form-control-size); font-weight: 600; font-variant-numeric: tabular-nums; text-align: right; overflow-wrap: anywhere; }
	.value-source { color: var(--fg-muted); font-size: .75rem; line-height: 1.4; text-align: right; }
</style>
