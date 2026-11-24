<script lang="ts">
	import SdkModal from "../dialog/sdk-modal.svelte";
	import { DialogClose } from '@ui-sdk/svelte/dialog';
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './drawer-wrapper.styles';
	import type { Snippet } from 'svelte';
	import CloseCircle from '@solar-icons/svelte/category/ui/Linear/CloseCircle.svelte';

	type Side = 'right' | 'left';
	type Size = 'sm' | 'md' | 'lg' | 'xl';

	let {
		open = $bindable(false),
		onOpenChange,
		side = 'right',
		size = 'md',
		closedByBackdrop = true,
		closedByEscape = true,
		hideCloseButton = false,
		title,
		description,
		header,
		children,
		footer,
		class: className = ''
	}: {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		side?: Side;
		size?: Size;
		closedByBackdrop?: boolean;
		closedByEscape?: boolean;
		hideCloseButton?: boolean;
		title?: string;
		description?: string;
		header?: Snippet;
		children?: Snippet;
		footer?: Snippet;
		class?: string;
	} = $props();

	const uid = $props.id();
	const titleId = `${uid}-title`;
	const descId = `${uid}-desc`;
	const showCloseButton = $derived(!hideCloseButton && (closedByBackdrop || closedByEscape));
	const sideStyle = $derived(side === 'right' ? wrapperStyles.right : wrapperStyles.left);
	const sizeStyles: Record<Size, stylex.StyleXStyles> = {
		sm: wrapperStyles.sm,
		md: wrapperStyles.md,
		lg: wrapperStyles.lg,
		xl: wrapperStyles.xl
	};

</script>

<SdkModal
	bind:open
	{onOpenChange}
	{closedByBackdrop}
	{closedByEscape}
	aria-labelledby={title ? titleId : undefined}
	aria-describedby={description ? descId : undefined}
	class={stylex.attrs(wrapperStyles.focus, wrapperStyles.root, wrapperStyles.visibility, sideStyle, sizeStyles[size]).class}
>
	<div
		class={[
			stylex.attrs(wrapperStyles.panel, wrapperStyles.panelShadow).class,
			className
		]}
	>
		{#if header}
			<div class={stylex.attrs(wrapperStyles.header, showCloseButton && wrapperStyles.headerWithClose).class}>
				{@render header()}
			</div>
		{:else if title || description}
			<div class={stylex.attrs(wrapperStyles.header, showCloseButton && wrapperStyles.headerWithClose).class}>
				{#if title}
					<h2 id={titleId} class={stylex.attrs(wrapperStyles.title).class}>
						{title}
					</h2>
				{/if}
				{#if description}
					<p id={descId} class={stylex.attrs(wrapperStyles.description, !!title && wrapperStyles.descriptionSpacing).class}>
						{description}
					</p>
				{/if}
			</div>
		{/if}
		{#if showCloseButton}
			<DialogClose
				type="button"
				aria-label="Close"
				class={stylex.attrs(wrapperStyles.closeButton).class}
			>
				<CloseCircle size={17} color="currentColor" aria-hidden="true" />
			</DialogClose>
		{/if}
		{#if children}
			<div class={stylex.attrs(wrapperStyles.body).class}>
				{@render children()}
			</div>
		{/if}
		{#if footer}
			<div class={stylex.attrs(wrapperStyles.footer).class}>
				{@render footer()}
			</div>
		{/if}
	</div>
</SdkModal>
