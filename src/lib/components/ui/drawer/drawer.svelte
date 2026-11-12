<script lang="ts">
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
	const sideClass = $derived(side === 'right' ? 'right-0 left-auto' : 'left-0 right-auto');
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
				el.focus();
			} else if (!open && el.open) {
				el.close();
			}
		});

		$effect(() => {
			if (!open) {
				return;
			}

			const prevOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';

			return () => {
				document.body.style.overflow = prevOverflow;
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
		'focus:outline-none focus-visible:[box-shadow:none]',
		'fixed inset-y-0 m-0 h-dvh max-h-none w-dvw max-w-none border-0 bg-transparent p-0',
		'text-fg opacity-0 transition-[opacity,translate] backdrop:bg-black/45 open:opacity-100',
		sideClass,
		sizeClass[size]
	]}
>
	<div
		class={[
			'relative flex h-dvh min-h-0 flex-col overflow-hidden border border-border bg-bg-elev',
			'shadow-xl',
			className
		]}
	>
		{#if header}
			<div class="flex-none border-b border-border-soft p-5 {showCloseButton ? 'pr-12' : ''}">
				{@render header()}
			</div>
		{:else if title || description}
			<div class="flex-none border-b border-border-soft p-5 {showCloseButton ? 'pr-12' : ''}">
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
			</div>
		{/if}
		{#if showCloseButton}
			<button
				type="button"
				aria-label="Close"
				onclick={() => setOpen(false)}
				class="absolute right-3 top-3 z-20 grid size-7 place-items-center rounded-md text-fg-subtle transition hover:bg-bg-hover hover:text-fg"
			>
				<CloseCircle size={17} color="currentColor" aria-hidden="true" />
			</button>
		{/if}
		{#if children}
			<div class="min-h-0 flex-1 overflow-y-auto">
				{@render children()}
			</div>
		{/if}
		{#if footer}
			<div class="flex flex-none justify-end gap-2 border-t border-border-soft p-4">
				{@render footer()}
			</div>
		{/if}
	</div>
</dialog>
