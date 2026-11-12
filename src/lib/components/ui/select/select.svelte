<script lang="ts" generics="T extends string">
	import type { Snippet } from 'svelte';
	import { Select as PcstiSelect } from '@pcsti/ui/select';
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

<div class={['grid min-w-0 gap-1.5', className]} data-slot="form-item">
	{#if label}<Label id={labelId} for={triggerId}
			>{label}{#if required}<span class="text-danger" aria-hidden="true">*</span>{/if}</Label
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
			<span class="flex min-w-0 items-center gap-2">
				{#if selected}{@render leading?.()}{/if}
				<span class="grid min-w-0 gap-0.5">
					<span class="truncate font-medium">{option.label}</span>
					{#if !selected && option.description}<span class="text-xs text-fg-muted">{option.description}</span>{/if}
				</span>
			</span>
		{/snippet}
	</PcstiSelect>
	{#if error}<FieldErrors id={errorId} errors={[error]} />{/if}
</div>
