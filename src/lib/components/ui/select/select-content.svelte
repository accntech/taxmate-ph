<script lang="ts">
	// Adapted from PCSTI ERP's @erp/ui SelectContent, Portal and scroll controls.
	import { Select as SelectPrimitive } from 'bits-ui';
	import AltArrowDown from '@solar-icons/svelte/category/arrows/Linear/AltArrowDown.svelte';
	import AltArrowUp from '@solar-icons/svelte/category/arrows/Linear/AltArrowUp.svelte';
	let {
		ref = $bindable(null),
		class: className = '',
		sideOffset = 4,
		children,
		...rest
	}: Omit<SelectPrimitive.ContentProps, 'child'> = $props();
</script>

<SelectPrimitive.Portal>
	<SelectPrimitive.Content
		bind:ref
		{sideOffset}
		data-slot="select-content"
		class={[
			'z-50 max-h-[min(18rem,var(--bits-select-content-available-height))] min-w-[var(--bits-select-anchor-width)] overflow-x-hidden overflow-y-auto rounded-md border border-border bg-bg-elev text-fg shadow-[var(--shadow-ui-md)] outline-none',
			className
		]}
		{...rest}
	>
		<SelectPrimitive.ScrollUpButton class="flex items-center justify-center py-1"
			><AltArrowUp size={16} color="currentColor" /></SelectPrimitive.ScrollUpButton
		>
		<SelectPrimitive.Viewport
			class="w-full min-w-[var(--bits-select-anchor-width)] scroll-my-1 p-1"
		>
			{@render children?.()}
		</SelectPrimitive.Viewport>
		<SelectPrimitive.ScrollDownButton class="flex items-center justify-center py-1"
			><AltArrowDown size={16} color="currentColor" /></SelectPrimitive.ScrollDownButton
		>
	</SelectPrimitive.Content>
</SelectPrimitive.Portal>
