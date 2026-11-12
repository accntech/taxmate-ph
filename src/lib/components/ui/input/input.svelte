<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './input-wrapper.styles';
	import type { Snippet } from 'svelte';
	import { Input as PcstiInput, type InputProps } from '$lib/components/ui/input/base';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { FieldErrors } from '../field-errors';
	import { Label } from '../label';
	import InputControl from './input-control.svelte';

	let {
		value = $bindable(''),
		invalid = false,
		class: className = '',
		label = '',
		help = '',
		error = '',
		size = 'md',
		type = 'text',
		list,
		leading,
		trailing,
		...rest
	}: {
		value?: string;
		invalid?: boolean;
		class?: string;
		label?: string;
		help?: string;
		error?: string;
		size?: 'md' | 'touch';
		leading?: Snippet;
		trailing?: Snippet;
	} & Omit<HTMLInputAttributes, 'value' | 'class' | 'size'> = $props();

	const uid = $props.id();
	const helpId = `${uid}-help`;
	const controlId = $derived(rest.id ?? `${uid}-input`);
	const hasError = $derived(invalid || !!error);
	const grouped = $derived(!!leading || !!trailing);
	const textType = $derived(type as InputProps['type']);
	const sourceAttributes = $derived(rest as Omit<InputProps, 'type' | 'list' | 'value'>);
	const describedBy = $derived(
		[rest['aria-describedby'], (help || error) && helpId].filter(Boolean).join(' ') || undefined
	);
</script>

{#snippet field()}
	{#if !list && (type === 'text' || type === 'search' || type === 'email' || type === 'tel' || type === 'url')}
		<PcstiInput
			{...sourceAttributes}
			id={controlId}
			autocapitalize={type === 'email' ? 'none' : rest.autocapitalize}
			bind:value={() => type === 'email' ? value.toLowerCase() : value, (next) => { value = type === 'email' ? next.toLowerCase() : next; }}
			type={textType}
			{leading}
			{trailing}
			invalid={hasError}
			sx={size === 'touch' ? wrapperStyles.touch : undefined}
			class={className}
			data-slot={grouped ? 'input-group-control' : 'input'}
			aria-invalid={hasError || rest['aria-invalid'] || undefined}
			aria-describedby={describedBy}
		/>
	{:else}
		<InputControl
			{...rest}
			{type}
			{list}
			id={controlId}
			autocapitalize={type === 'email' ? 'none' : rest.autocapitalize}
			bind:value={() => type === 'email' ? value.toLowerCase() : value, (next) => { value = type === 'email' ? next.toLowerCase() : next; }}
			{size}
			class={className}
			aria-invalid={hasError || rest['aria-invalid'] || undefined}
			aria-describedby={describedBy}
		/>
	{/if}
{/snippet}

<div data-slot="form-item" class={stylex.attrs(wrapperStyles.field).class}>
	{#if label}
		<Label for={controlId} class={stylex.attrs(wrapperStyles.label).class}>
			{label}{#if rest.required}<span class={stylex.attrs(wrapperStyles.required).class} aria-hidden="true">*</span>{/if}
		</Label>
	{/if}
	{@render field()}
	{#if error}
		<FieldErrors id={helpId} errors={[error]} />
	{:else if help}
		<p id={helpId} data-slot="form-description" class={stylex.attrs(wrapperStyles.help).class}>{help}</p>
	{/if}
</div>
