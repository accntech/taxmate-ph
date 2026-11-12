<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './select-item-wrapper.styles';
	// Adapted from PCSTI ERP's @erp/ui SelectItem.
	import { Select as SelectPrimitive } from 'bits-ui';
	import CheckCircle from '@solar-icons/svelte/category/ui/Linear/CheckCircle.svelte';
	let {
		ref = $bindable(null),
		class: className = '',
		value,
		label,
		children: content,
		...rest
	}: Omit<SelectPrimitive.ItemProps, 'child'> = $props();
</script>

<SelectPrimitive.Item
	bind:ref
	{value}
	{label}
	data-slot="select-item"
	class={[
		stylex.attrs(wrapperStyles.root).class,
		className
	]}
	{...rest}
>
	{#snippet children({ selected, highlighted })}
		<span class={stylex.attrs(wrapperStyles.selectionIndicator).class} aria-hidden="true"
			>{#if selected}<CheckCircle size={16} color="currentColor" />{/if}</span
		>
		{#if content}{@render content({ selected, highlighted })}{:else}{label || value}{/if}
	{/snippet}
</SelectPrimitive.Item>
