<script lang="ts" generics="T extends string">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './select-wrapper.styles';
	import type { Snippet } from 'svelte';
	import { Select as PcstiSelect } from '$lib/components/ui/select/base';
	import Label from '../label/label.svelte';
	import FieldErrors from '../field-errors/field-errors.svelte';

	type SelectOption<TValue extends string> = { value: TValue; label: string; meta?: string };
	let {
		id,
		value = $bindable<T>(),
		options,
		onchange,
		label = '',
		placeholder = 'Select an option',
		invalid = false,
		required = false,
		error = '',
		disabled = false,
		class: className = '',
		leading
	}: {
		id?: string;
		value: T;
		options: SelectOption<T>[];
		onchange?: (value: T) => void;
		label?: string;
		placeholder?: string;
		invalid?: boolean;
		required?: boolean;
		error?: string;
		disabled?: boolean;
		class?: string;
		leading?: Snippet;
	} = $props();
	const uid = $props.id();
	const labelId = `${uid}-label`;
	const triggerId = $derived(id ?? `${uid}-trigger`);
	const errorId = `${uid}-error`;
	const sourceOptions = $derived(options.map((option) => ({ ...option, description: option.meta })));
</script>

<div class={[["form-select", stylex.attrs(wrapperStyles.field).class].join(' '), className]} data-slot="form-item">
	{#if label}<Label id={labelId} for={triggerId}
			>{label}{#if required}<span class={stylex.attrs(wrapperStyles.required).class} aria-hidden="true">*</span>{/if}</Label
		>{/if}
	<PcstiSelect
		id={triggerId}
		{value}
		options={sourceOptions}
		{placeholder}
		invalid={invalid || !!error}
		disabled={disabled || options.length === 0}
		aria-labelledby={label ? labelId : undefined}
		aria-label={label ? undefined : placeholder}
		aria-required={required || undefined}
		aria-describedby={error ? errorId : undefined}
		onValueChange={(next) => {
			value = next as T;
			onchange?.(value);
		}}
	>
		{#snippet optionContent(option, selected)}
			<span class={stylex.attrs(wrapperStyles.option).class}>
				{#if selected}{@render leading?.()}{/if}
				<span class={stylex.attrs(wrapperStyles.optionDetails).class}>
					<span class={stylex.attrs(wrapperStyles.optionLabel).class}>{option.label}</span>
					{#if !selected && option.description}<span class={stylex.attrs(wrapperStyles.optionDescription).class}>{option.description}</span>{/if}
				</span>
			</span>
		{/snippet}
	</PcstiSelect>
	{#if error}<FieldErrors id={errorId} errors={[error]} />{/if}
</div>

<style>
	.form-select :global([role="combobox"]) { font-size: var(--form-control-size); }
</style>
