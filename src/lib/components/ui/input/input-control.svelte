<script lang="ts">
	import { Input as SdkInput } from '@ui-sdk/svelte/input';
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './input-control-wrapper.styles';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		value = $bindable(''),
		class: className = '',
		size = 'md',
		grouped = false,
		defaultValue,
		defaultvalue,
		'data-slot': dataSlot = 'input',
		...restProps
	}: Omit<HTMLInputAttributes, 'value' | 'class' | 'size'> & {
		ref?: HTMLInputElement | null;
		value?: string;
		class?: string;
		size?: 'md' | 'touch';
		grouped?: boolean;
		'data-slot'?: string;
	} = $props();
	const classList = $derived([
		stylex.attrs(
			wrapperStyles.root,
			wrapperStyles.textStates,
			wrapperStyles.disabledStates,
			grouped ? wrapperStyles.grouped : wrapperStyles.standalone,
			size === 'touch' && wrapperStyles.touch
		).class,
		!grouped && 'field-focus',
		size !== 'touch' && 'normal-size',
		'local-input-control',
		className
	].filter(Boolean).join(' '));

	// Keep native value semantics for input types outside the SDK text control's contract.
	const nativeValue = $derived(
		!['text', 'search', 'email', 'tel', 'url', 'password'].includes(restProps.type ?? 'text')
	);
</script>

{#if nativeValue}
	<input
		bind:this={ref}
		bind:value
		data-slot={dataSlot}
		class={classList}
		defaultValue={defaultValue ?? defaultvalue}
		{...restProps}
	/>
{:else}
	<SdkInput
		bind:value
		data-slot={dataSlot}
		class={classList}
		defaultValue={(defaultValue ?? defaultvalue)?.toString()}
		{...restProps}
		disabled={restProps.disabled ?? undefined}
		required={restProps.required ?? undefined}
	>
		{#snippet render({ props })}
			<input bind:this={ref} {...props} data-slot={dataSlot} />
		{/snippet}
	</SdkInput>
{/if}

<style>
	:global(.local-input-control.normal-size) { min-height: var(--form-control-height); font-size: var(--form-control-size); }
	:global(.local-input-control.field-focus:focus-visible) { border-color: var(--field-focus-border); background-color: var(--bg-elev); box-shadow: 0 0 0 3px var(--field-focus-halo); }
	:global(.local-input-control.field-focus[aria-invalid='true']) { border-color: var(--field-error-border); box-shadow: 0 0 0 3px var(--field-error-halo); }
	:global(.local-input-control.field-focus[aria-invalid='true']:focus-visible) { box-shadow: 0 0 0 3px var(--field-error-focus-halo); }
	:global(.local-input-control:-webkit-autofill) {
		-webkit-text-fill-color: var(--fg);
		-webkit-box-shadow: 0 0 0 1000px var(--bg-input) inset;
		caret-color: var(--fg);
		transition: background-color 9999s ease-out 0s;
	}
</style>
