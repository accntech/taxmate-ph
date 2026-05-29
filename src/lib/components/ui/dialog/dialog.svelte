<script lang="ts">
	import type { Snippet } from 'svelte';
	import CloseCircle from '@solar-icons/svelte/category/ui/Linear/CloseCircle.svelte';

	type Size = 'sm' | 'md' | 'lg' | 'xl';

	let {
		open = $bindable(false),
		onOpenChange,
		size = 'md',
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
			if (open && !el.open) {
				el.showModal();
			} else if (!open && el.open) {
				el.close();
			}
		});

		$effect(() => {
			if (!open) {
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
		if (!closedByEscape) {
			event.preventDefault();
		}
	}

	function onDialogClick(event: MouseEvent) {
		if (closedByBackdrop && event.target === event.currentTarget) {
			setOpen(false);
		}
	}
</script>

<dialog
	{@attach syncOpen}
	onclose={() => setOpen(false)}
	oncancel={onCancel}
	onclick={onDialogClick}
	aria-labelledby={title ? titleId : undefined}
	aria-describedby={description ? descId : undefined}
	class={[
		'fixed inset-x-0 bottom-0 top-auto m-0 h-auto max-h-[90dvh] w-dvw max-w-none',
		'border-0 bg-transparent p-0 text-fg opacity-0 transition-[opacity,translate,scale]',
		'backdrop:bg-black/45 open:opacity-100 sm:inset-0 sm:m-auto sm:h-fit',
		'sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)]',
		'motion-safe:translate-y-0 motion-safe:sm:scale-96 motion-safe:sm:open:scale-100',
		sizeClass[size]
	]}
>
	<div
		class={[
			'relative flex max-h-[90dvh] flex-col overflow-hidden rounded-t-xl border',
			'border-border bg-bg-elev p-5 shadow-lg sm:max-h-[calc(100dvh-2rem)] sm:rounded-xl',
			className
		]}
	>
		<div class="mx-auto mb-3 h-1 w-9 flex-none rounded-full bg-fg-subtle/40 sm:hidden"></div>
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
			<h2 id={titleId} class="m-0 text-[15px] font-semibold tracking-tight text-fg">
				{title}
			</h2>
		{/if}
		{#if description}
			<p id={descId} class="text-[13px] leading-snug text-fg-subtle {title ? 'mt-1.5' : ''}">
				{description}
			</p>
		{/if}
		{#if children}
			<div class="-mx-5 min-h-0 flex-1 overflow-y-auto px-5 {title || description ? 'mt-4' : ''}">
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
