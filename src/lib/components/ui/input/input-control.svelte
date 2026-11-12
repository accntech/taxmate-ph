<script lang="ts">
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
		'flex w-full min-w-0 py-1 text-fg outline-none',
		'placeholder:text-fg-subtle selection:bg-accent selection:text-accent-fg',
		'disabled:cursor-not-allowed disabled:opacity-50 transition-[color,box-shadow,border-color]',
		grouped
			? 'flex-1 border-0 bg-transparent px-0 focus-visible:shadow-none'
			: 'rounded-md border border-border px-3 bg-bg-input shadow-[var(--shadow-ui-sm)] field-focus',
		size === 'touch' ? 'min-h-12 text-base' : 'normal-size',
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
