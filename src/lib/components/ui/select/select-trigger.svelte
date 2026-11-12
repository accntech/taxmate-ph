<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './select-trigger-wrapper.styles';
	// Adapted from PCSTI ERP's @erp/ui SelectTrigger.
	import { Select as SelectPrimitive } from 'bits-ui';
	import AltArrowDown from '@solar-icons/svelte/category/arrows/Linear/AltArrowDown.svelte';
	let {
		ref = $bindable(null),
		class: className = '',
		children,
		...rest
	}: Omit<SelectPrimitive.TriggerProps, 'child'> = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	data-slot="select-trigger"
	class={[
		["select-normal-size", stylex.attrs(wrapperStyles.root).class].join(' '),
		'field-focus',
		className
	]}
	{...rest}
>
	{@render children?.()}
	<span class={stylex.attrs(wrapperStyles.icon).class} aria-hidden="true"
		><AltArrowDown size={16} color="currentColor" /></span
	>
</SelectPrimitive.Trigger>

<style>
	:global(.select-normal-size[data-slot="select-trigger"]) { min-height: var(--form-control-height); font-size: var(--form-control-size); }
	:global(.field-focus[data-slot='select-trigger']:focus-visible) { border-color: var(--field-focus-border); background-color: var(--bg-elev); box-shadow: 0 0 0 3px var(--field-focus-halo); }
	:global(.field-focus[data-slot='select-trigger'][aria-invalid='true']) { border-color: var(--field-error-border); box-shadow: 0 0 0 3px var(--field-error-halo); }
	:global(.field-focus[data-slot='select-trigger'][aria-invalid='true']:focus-visible) { box-shadow: 0 0 0 3px var(--field-error-focus-halo); }
</style>
