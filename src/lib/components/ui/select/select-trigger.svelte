<script lang="ts">
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
		'flex min-h-9 w-full min-w-0 items-center justify-between gap-2 rounded-md border border-border bg-bg-input px-3 py-1.5 text-left text-sm text-fg shadow-[var(--shadow-ui-sm)] outline-none transition-[color,box-shadow,border-color] disabled:cursor-not-allowed disabled:opacity-50',
		'field-focus',
		className
	]}
	{...rest}
>
	{@render children?.()}
	<span class="shrink-0 text-fg-subtle" aria-hidden="true"
		><AltArrowDown size={16} color="currentColor" /></span
	>
</SelectPrimitive.Trigger>

<style>
	:global(.field-focus[data-slot='select-trigger']:focus-visible) { border-color: var(--field-focus-border); background-color: var(--bg-elev); box-shadow: 0 0 0 3px var(--field-focus-halo); }
	:global(.field-focus[data-slot='select-trigger'][aria-invalid='true']) { border-color: var(--field-error-border); box-shadow: 0 0 0 3px var(--field-error-halo); }
	:global(.field-focus[data-slot='select-trigger'][aria-invalid='true']:focus-visible) { box-shadow: 0 0 0 3px var(--field-error-focus-halo); }
</style>
