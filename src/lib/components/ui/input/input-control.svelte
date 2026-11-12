<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './input-control-wrapper.styles';
	// Adapted from PCSTI's @erp/ui/components/input/input.svelte.
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		value = $bindable(''),
		class: className = '',
		size = 'md',
		grouped = false,
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
</script>

<input
	bind:this={ref}
	bind:value
	data-slot={dataSlot}
	class={[
		stylex.attrs(wrapperStyles.root, wrapperStyles.textStates, wrapperStyles.disabledStates, grouped ? wrapperStyles.grouped : wrapperStyles.standalone, size === 'touch' && wrapperStyles.touch).class,
		!grouped && 'field-focus',
		size !== 'touch' && 'normal-size',
		className
	]}
	{...restProps}
/>

<style>
	.normal-size { min-height: var(--form-control-height); font-size: var(--form-control-size); }
	.field-focus:focus-visible { border-color: var(--field-focus-border); background-color: var(--bg-elev); box-shadow: 0 0 0 3px var(--field-focus-halo); }
	.field-focus[aria-invalid='true'] { border-color: var(--field-error-border); box-shadow: 0 0 0 3px var(--field-error-halo); }
	.field-focus[aria-invalid='true']:focus-visible { box-shadow: 0 0 0 3px var(--field-error-focus-halo); }
	input:-webkit-autofill {
		-webkit-text-fill-color: var(--fg);
		-webkit-box-shadow: 0 0 0 1000px var(--bg-input) inset;
		caret-color: var(--fg);
		transition: background-color 9999s ease-out 0s;
	}
</style>
