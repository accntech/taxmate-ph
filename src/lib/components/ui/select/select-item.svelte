<script lang="ts">
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
		'relative flex w-full cursor-default items-center gap-2 rounded-sm py-2 pr-8 pl-2.5 text-sm outline-none select-none data-[highlighted]:bg-bg-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		className
	]}
	{...rest}
>
	{#snippet children({ selected, highlighted })}
		<span class="absolute right-2 flex items-center text-accent" aria-hidden="true"
			>{#if selected}<CheckCircle size={16} color="currentColor" />{/if}</span
		>
		{#if content}{@render content({ selected, highlighted })}{:else}{label || value}{/if}
	{/snippet}
</SelectPrimitive.Item>
