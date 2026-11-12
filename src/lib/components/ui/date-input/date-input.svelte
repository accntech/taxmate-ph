<script lang="ts">
	import { DateInput as PcstiDateInput } from '$lib/components/ui/date-input/base';
	import Label from '../label/label.svelte';
	import FieldErrors from '../field-errors/field-errors.svelte';
	let { id, label = '', value = $bindable(''), error = '', required = false, disabled = false, min, max, onchange, onblur }: {
		id: string;
		label?: string;
		value?: string;
		error?: string;
		required?: boolean;
		disabled?: boolean;
		min?: string;
		max?: string;
		onchange?: (value: string) => void;
		onblur?: () => void;
	} = $props();
	const uid = $props.id();
	function change(next: string) {
		// PCSTI consumes and returns ISO calendar strings directly.
		value = next;
		onchange?.(next);
	}
</script>

<div data-slot="date-input" class="grid min-w-0 gap-2">
	{#if label}
		<Label id={`${uid}-label`} for={id} class="text-fg-muted">{label}{#if required}<span class="text-danger" aria-hidden="true">*</span>{/if}</Label>
	{/if}
	<PcstiDateInput
		{id}
		bind:value={() => value, change}
		aria-labelledby={label ? `${uid}-label` : undefined}
		aria-label={label ? undefined : 'Date'}
		aria-describedby={error ? `${uid}-error` : undefined}
		invalid={!!error}
		{disabled}
		{min}
		{max}
		locale="en-PH"
		{onblur}
	/>
	{#if error}<FieldErrors id={`${uid}-error`} errors={[error]} />{/if}
</div>
