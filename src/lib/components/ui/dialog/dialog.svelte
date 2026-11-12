<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './dialog-wrapper.styles';
	import type { Snippet } from 'svelte';
	import CloseCircle from '@solar-icons/svelte/category/ui/Linear/CloseCircle.svelte';

	type Size = 'sm' | 'md' | 'lg' | 'xl';

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

	let present = $state(false);

	const uid = $props.id();
	const titleId = `${uid}-title`;
	const descId = `${uid}-desc`;
	const showCloseButton = $derived(!hideCloseButton && (closedByBackdrop || closedByEscape));
	const sizeStyles: Record<Size, stylex.StyleXStyles> = {
		sm: wrapperStyles.sm,
		md: wrapperStyles.md,
		lg: wrapperStyles.lg,
		xl: wrapperStyles.xl
	};

	function setOpen(next: boolean) {
		if (open === next) {
			return;
		}

		open = next;
		onOpenChange?.(next);
	}

	function syncOpen(el: HTMLDialogElement) {
		$effect(() => {
			if (open) {
				delete el.dataset.closing;
				if (!el.open) {
					el.showModal();
					el.focus();
				}
				present = true;
			} else if (el.open) {
				// WebKit removes the top layer immediately on close(), so finish motion first.
				el.dataset.closing = '';
				getComputedStyle(el).opacity;
				let cancelled = false;
				void Promise.allSettled(el.getAnimations().map(animation => animation.finished)).then(() => {
					if (!cancelled) {
						el.close();
						present = false;
					}
				});
				return () => { cancelled = true; };
			}
		});

		$effect(() => {
			if (!present) {
				return;
			}

			const { body, documentElement: html } = document;
			const scrollbarWidth = window.innerWidth - html.clientWidth;
			const prevOverflow = body.style.overflow;
			const prevPaddingRight = body.style.paddingRight;
			body.style.overflow = 'hidden';

			if (scrollbarWidth > 0) {
				body.style.paddingRight = `${scrollbarWidth}px`;
			}

			return () => {
				body.style.overflow = prevOverflow;
				body.style.paddingRight = prevPaddingRight;
			};
		});
	}

	function onCancel(event: Event) {
		event.preventDefault();
		if (closedByEscape) setOpen(false);
	}

	function onDialogClick(event: MouseEvent) {
		if (closedByBackdrop && event.target === event.currentTarget) {
			setOpen(false);
		}
	}
</script>

<dialog
	{@attach syncOpen}
	onclose={(event) => {
		if (!event.currentTarget.open) {
			present = false;
			setOpen(false);
		}
	}}
	oncancel={onCancel}
	onclick={onDialogClick}
	aria-labelledby={title ? titleId : undefined}
	aria-describedby={description ? descId : undefined}
	class={stylex.attrs(wrapperStyles.focus, wrapperStyles.root, wrapperStyles.surface, wrapperStyles.centered, wrapperStyles.desktopBounds, sizeStyles[size]).class}
>
	<div
		class={[
			stylex.attrs(wrapperStyles.panel, wrapperStyles.panelSurface, layout === 'command' ? wrapperStyles.commandPadding : wrapperStyles.defaultPadding).class,
			className
		]}
	>
		{#if layout !== 'command'}<div class={stylex.attrs(wrapperStyles.dragHandle).class}></div>{/if}
		{#if showCloseButton}
			<button
				type="button"
				aria-label="Close"
				onclick={() => setOpen(false)}
				class={stylex.attrs(wrapperStyles.closeButton).class}
			>
				<CloseCircle size={17} color="currentColor" aria-hidden="true" />
			</button>
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
</dialog>

<style>
	/* The closing state shares the initial opacity and transform. */
	dialog {
		opacity: 0;
		translate: 0 100%;
		transition:
			opacity 180ms cubic-bezier(0.22, 1, 0.36, 1),
			translate 180ms cubic-bezier(0.22, 1, 0.36, 1),
			scale 180ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	dialog[open]:not([data-closing]) {
		opacity: 1;
		translate: 0 0;
		transition-duration: 240ms;
	}

	dialog::backdrop {
		background: rgb(0 0 0 / 0.45);
		opacity: 0;
		transition: opacity 180ms ease-out;
	}

	dialog[open]:not([data-closing])::backdrop {
		opacity: 1;
		transition-duration: 240ms;
	}

	@starting-style {
		dialog[open]:not([data-closing]) {
			opacity: 0;
			translate: 0 100%;
		}

		dialog[open]:not([data-closing])::backdrop {
			opacity: 0;
		}
	}

	@media (min-width: 40rem) {
		dialog {
			translate: 0 0;
			scale: 0.96;
		}

		dialog[open]:not([data-closing]) {
			scale: 1;
		}

		@starting-style {
			dialog[open]:not([data-closing]) {
				opacity: 0;
				translate: 0 0;
				scale: 0.96;
			}
		}
	}

	@media (prefers-reduced-motion: reduce) {
		dialog,
		dialog[open]:not([data-closing]),
		dialog::backdrop,
		dialog[open]:not([data-closing])::backdrop {
			transition: none;
		}
	}
</style>
