<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { Textarea as PcstiTextarea } from '$lib/components/ui/textarea/base';
	import { Label } from '../label';
	import { FieldErrors } from '../field-errors';

	let {
		value = $bindable(''),
		invalid = false,
		label = '',
		help = '',
		error = '',
		class: className = '',
		...rest
	}: {
		value?: string;
		invalid?: boolean;
		label?: string;
		help?: string;
		error?: string;
		class?: string;
	} & Omit<HTMLTextareaAttributes, 'value' | 'class'> = $props();

	const uid = $props.id();
	const controlId = $derived(rest.id ?? `${uid}-textarea`);
	const helpId = `${uid}-help`;
	const hasError = $derived(invalid || !!error);
	const describedBy = $derived(
		[rest['aria-describedby'], (help || error) && helpId].filter(Boolean).join(' ') || undefined
	);
</script>

<div data-slot="form-item" class="grid min-w-0 gap-2">
	{#if label}
		<Label for={controlId} class="text-fg-muted">
			{label}{#if rest.required}<span class="text-danger" aria-hidden="true">*</span>{/if}
		</Label>
	{/if}
	<PcstiTextarea
		{...rest}
		id={controlId}
		bind:value
		invalid={hasError}
		aria-invalid={hasError || rest['aria-invalid'] || undefined}
		aria-describedby={describedBy}
		class={className}
	/>
	{#if error}
		<FieldErrors id={helpId} errors={[error]} />
	{:else if help}
		<p id={helpId} class="text-xs text-fg-subtle">{help}</p>
	{/if}
</div>
