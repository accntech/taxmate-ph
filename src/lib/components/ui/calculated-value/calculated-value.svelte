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
	.calculated-value { display: grid; min-width: 0; gap: .5rem; }
	.value-label { color: var(--fg-muted); font-size: .875rem; font-weight: 500; line-height: 1; }
	output { display: block; min-height: 2.25rem; padding-block: .5rem; border-bottom: 1px solid var(--border-soft); font-size: .875rem; font-weight: 600; font-variant-numeric: tabular-nums; text-align: right; overflow-wrap: anywhere; }
	.value-source { color: var(--fg-muted); font-size: .75rem; line-height: 1.4; text-align: right; }
</style>
