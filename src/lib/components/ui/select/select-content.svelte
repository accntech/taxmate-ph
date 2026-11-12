<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './select-content-wrapper.styles';
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
			stylex.attrs(wrapperStyles.root).class,
			className
		]}
		{...rest}
	>
		<SelectPrimitive.ScrollUpButton class={stylex.attrs(wrapperStyles.scrollButton).class}
			><AltArrowUp size={16} color="currentColor" /></SelectPrimitive.ScrollUpButton
		>
		<SelectPrimitive.Viewport
			class={stylex.attrs(wrapperStyles.viewport).class}
		>
			{@render children?.()}
		</SelectPrimitive.Viewport>
		<SelectPrimitive.ScrollDownButton class={stylex.attrs(wrapperStyles.scrollButton).class}
			><AltArrowDown size={16} color="currentColor" /></SelectPrimitive.ScrollDownButton
		>
	</SelectPrimitive.Content>
</SelectPrimitive.Portal>
