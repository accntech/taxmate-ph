<script lang="ts">
	import { DialogClose } from '@ui-sdk/svelte/dialog';
	import * as stylex from '@stylexjs/stylex';
	import SdkModal from './sdk-modal.svelte';
	import { wrapperStyles } from './dialog-wrapper.styles';
	import type { Snippet } from 'svelte';
	import CloseCircle from '@solar-icons/svelte/category/ui/Linear/CloseCircle.svelte';

	type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

	let {
		open = $bindable(false),
		onOpenChange,
		size = 'md',
		layout = 'default',
		closedByBackdrop = true,
		closedByEscape = true,
		hideCloseButton = false,
		title,
		description,
		children,
		footer,
		class: className = ''
	}: {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		size?: Size;
		layout?: 'default' | 'command';
		closedByBackdrop?: boolean;
		closedByEscape?: boolean;
		hideCloseButton?: boolean;
		title?: string;
		description?: string;
		children?: Snippet;
		footer?: Snippet;
		class?: string;
	} = $props();

	const uid = $props.id();
	const titleId = `${uid}-title`;
	const descId = `${uid}-desc`;
	const showCloseButton = $derived(!hideCloseButton && (closedByBackdrop || closedByEscape));
	const sizeStyles: Record<Size, stylex.StyleXStyles> = {
		sm: wrapperStyles.sm,
		md: wrapperStyles.md,
		lg: wrapperStyles.lg,
		xl: wrapperStyles.xl,
		'2xl': wrapperStyles['2xl']
	};

</script>

<SdkModal
	bind:open
	{onOpenChange}
	{closedByBackdrop}
	{closedByEscape}
	aria-labelledby={title ? titleId : undefined}
	aria-describedby={description ? descId : undefined}
	class={["taxmate-dialog", stylex.attrs(wrapperStyles.focus, wrapperStyles.root, wrapperStyles.surface, sizeStyles[size]).class]}
>
	<div
		class={[
			stylex.attrs(wrapperStyles.panel, wrapperStyles.panelSurface, layout === 'command' ? wrapperStyles.commandPadding : wrapperStyles.defaultPadding).class,
			className
		]}
	>
		{#if layout !== 'command'}<div class={stylex.attrs(wrapperStyles.dragHandle).class}></div>{/if}
		{#if showCloseButton}
			<DialogClose
				type="button"
				aria-label="Close"
				class={stylex.attrs(wrapperStyles.closeButton).class}
			>
				<CloseCircle size={17} color="currentColor" aria-hidden="true" />
			</DialogClose>
		{/if}
		{#if title}
			<h2 id={titleId} class={layout === 'command' ? stylex.attrs(wrapperStyles.hiddenHeading).class : stylex.attrs(wrapperStyles.title).class}>
				{title}
			</h2>
		{/if}
		{#if description}
			<p id={descId} class={layout === 'command' ? stylex.attrs(wrapperStyles.hiddenHeading).class : stylex.attrs(wrapperStyles.description, !!title && wrapperStyles.descriptionSpacing).class}>
				{description}
			</p>
		{/if}
		{#if children}
			<div class={layout === 'command' ? stylex.attrs(wrapperStyles.commandBody).class : stylex.attrs(wrapperStyles.body, !!(title || description) && wrapperStyles.bodySpacing).class}>
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

<style>
	/* The closing state shares the initial opacity and transform. */
	:global(dialog.taxmate-dialog) {
		opacity: 0;
		translate: 0 100%;
		transition:
			opacity 180ms cubic-bezier(0.22, 1, 0.36, 1),
			translate 180ms cubic-bezier(0.22, 1, 0.36, 1),
			scale 180ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	:global(dialog.taxmate-dialog[data-open]:not([data-starting-style])) {
		opacity: 1;
		translate: 0 0;
		transition-duration: 240ms;
	}

	:global(dialog.taxmate-dialog)::backdrop {
		background: rgb(0 0 0 / 0.45);
		opacity: 0;
		transition: opacity 180ms ease-out;
	}

	:global(dialog.taxmate-dialog[data-open]:not([data-starting-style]))::backdrop {
		opacity: 1;
		transition-duration: 240ms;
	}

	@starting-style {
		:global(dialog.taxmate-dialog[data-open]:not([data-starting-style])) {
			opacity: 0;
			translate: 0 100%;
		}

		:global(dialog.taxmate-dialog[data-open]:not([data-starting-style]))::backdrop {
			opacity: 0;
		}
	}

	@media (min-width: 40rem) {
		:global(dialog.taxmate-dialog) {
			translate: 0 0;
			scale: 0.96;
		}

		:global(dialog.taxmate-dialog[data-open]:not([data-starting-style])) {
			scale: 1;
		}

		@starting-style {
			:global(dialog.taxmate-dialog[data-open]:not([data-starting-style])) {
				opacity: 0;
				translate: 0 0;
				scale: 0.96;
			}
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(dialog.taxmate-dialog),
		:global(dialog.taxmate-dialog[data-open]:not([data-starting-style])),
		:global(dialog.taxmate-dialog)::backdrop,
		:global(dialog.taxmate-dialog[data-open]:not([data-starting-style]))::backdrop {
			transition: none;
		}
	}
</style>
