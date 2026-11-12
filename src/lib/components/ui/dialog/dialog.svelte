<script lang="ts">
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
	const sizeClass: Record<Size, string> = {
		sm: 'sm:max-w-sm',
		md: 'sm:max-w-md',
		lg: 'sm:max-w-lg',
		xl: 'sm:max-w-2xl'
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
				if (!el.open) el.showModal();
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
	class={[
		'fixed inset-x-0 bottom-0 top-auto m-0 h-auto max-h-[90dvh] w-dvw max-w-none',
		'border-0 bg-transparent p-0 text-fg',
		'sm:inset-0 sm:m-auto sm:h-fit',
		'sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)]',
		sizeClass[size]
	]}
>
	<div
		class={[
			'relative flex max-h-[90dvh] flex-col overflow-hidden rounded-t-xl border',
			'border-border bg-bg-elev shadow-lg sm:max-h-[calc(100dvh-2rem)] sm:rounded-xl',
			layout === 'command' ? 'p-0' : 'p-5',
			className
		]}
	>
		{#if layout !== 'command'}<div class="mx-auto mb-3 h-1 w-9 flex-none rounded-full bg-fg-subtle/40 sm:hidden"></div>{/if}
		{#if showCloseButton}
			<button
				type="button"
				aria-label="Close"
				onclick={() => setOpen(false)}
				class="absolute right-3 top-3 hidden size-7 place-items-center rounded-md text-fg-subtle transition hover:bg-bg-hover hover:text-fg sm:grid"
			>
				<CloseCircle size={17} color="currentColor" aria-hidden="true" />
			</button>
		{/if}
		{#if title}
			<h2 id={titleId} class={layout === 'command' ? 'sr-only' : 'm-0 text-[15px] font-semibold tracking-tight text-fg'}>
				{title}
			</h2>
		{/if}
		{#if description}
			<p id={descId} class={layout === 'command' ? 'sr-only' : `text-[13px] leading-snug text-fg-subtle ${title ? 'mt-1.5' : ''}`}>
				{description}
			</p>
		{/if}
		{#if children}
			<div class={layout === 'command' ? 'flex min-h-0 flex-col overflow-hidden' : `-mx-5 min-h-0 flex-1 overflow-y-auto px-5 ${title || description ? 'mt-4' : ''}`}>
				{@render children()}
			</div>
		{/if}
		{#if footer}
			<div class="mt-5 flex flex-wrap justify-end gap-2">
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
