<script lang="ts">
	import { onMount, untrack, type Snippet } from 'svelte';
	import AltArrowDown from '@solar-icons/svelte/category/arrows/Linear/AltArrowDown.svelte';

	type SidebarContext = {
		collapsed: boolean;
	};

	let {
		collapsed = $bindable(false),
		mobileOpen = $bindable(false),
		isMobile = $bindable(false),
		storageKey = 'sidebarCollapsed',
		ariaLabel = 'Primary',
		header,
		content,
		footer
	}: {
		collapsed?: boolean;
		mobileOpen?: boolean;
		isMobile?: boolean;
		storageKey?: string | null;
		ariaLabel?: string;
		header?: Snippet<[SidebarContext]>;
		content?: Snippet<[SidebarContext]>;
		footer?: Snippet<[SidebarContext]>;
	} = $props();

	const renderCollapsed = $derived(collapsed && !isMobile);
	const dataState = $derived(renderCollapsed ? 'collapsed' : 'expanded');
	const ctx: SidebarContext = $derived({ collapsed: renderCollapsed });
	let navEl: HTMLElement | null = $state(null);
	let canScrollUp = $state(false);
	let canScrollDown = $state(false);

	onMount(() => {
		const mq = window.matchMedia('(not (min-width: 48rem))');
		isMobile = mq.matches;
		const onMediaChange = (event: MediaQueryListEvent) => (isMobile = event.matches);
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && mobileOpen) {
				mobileOpen = false;
			}
		};

		mq.addEventListener('change', onMediaChange);
		window.addEventListener('keydown', onKey);

		return () => {
			mq.removeEventListener('change', onMediaChange);
			window.removeEventListener('keydown', onKey);
		};
	});

	$effect(() => {
		if (!storageKey) {
			return;
		}

		untrack(() => {
			document.cookie = `${storageKey}=${collapsed ? '1' : '0'}; path=/; max-age=31536000`;
		});
	});

	$effect(() => {
		if (!mobileOpen || !isMobile) {
			return;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	});

	function updateFades() {
		if (!navEl) {
			return;
		}

		const max = navEl.scrollHeight - navEl.clientHeight;
		canScrollUp = navEl.scrollTop > 0;
		canScrollDown = navEl.scrollTop < max - 1;
	}

	function handleLinkClick(event: MouseEvent) {
		if ((event.target as Element | null)?.closest('a')) {
			mobileOpen = false;
		}
	}
</script>

<aside
	class="sidebar group/sb fixed left-0 top-0 z-50 flex h-dvh max-h-dvh w-[17.5rem] flex-col overflow-hidden border-r border-border bg-bg shadow-[12px_0_32px_-16px_rgba(0,0,0,0.4)] max-md:-translate-x-full max-md:transition-transform max-md:duration-220 max-md:data-[mobile-open=true]:translate-x-0 md:sticky md:left-auto md:z-30 md:w-auto md:shadow-none md:data-[state=collapsed]:overflow-visible"
	data-state={dataState}
	data-mobile-open={mobileOpen ? 'true' : undefined}
	aria-label={ariaLabel}
>
	{#if header}
		<header class="sidebar-row-anim flex h-16 flex-none items-center gap-2.5 px-5 group-data-[state=collapsed]/sb:gap-0 group-data-[state=collapsed]/sb:px-3.5">
			{@render header(ctx)}
		</header>
	{/if}

	<div class="relative flex min-h-0 flex-1 flex-col">
		<nav
			bind:this={navEl}
			onscroll={updateFades}
			class="sidebar-body flex min-h-0 flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto overscroll-contain p-[8px_14px] group-data-[state=collapsed]/sb:gap-1.5 group-data-[state=collapsed]/sb:py-3"
			onclickcapture={handleLinkClick}
		>
			{@render content?.(ctx)}
		</nav>
		<div
			class="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-6 items-start justify-center bg-linear-to-b from-bg to-transparent pt-0.5 opacity-0 transition-opacity data-show:opacity-100"
			data-show={canScrollUp || undefined}
			aria-hidden="true"
		>
			<span class="rotate-180 text-fg-subtle">
				<AltArrowDown size={13} color="currentColor" />
			</span>
		</div>
		<div
			class="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-6 items-end justify-center bg-linear-to-t from-bg to-transparent pb-0.5 opacity-0 transition-opacity data-show:opacity-100"
			data-show={canScrollDown || undefined}
			aria-hidden="true"
		>
			<span class="text-fg-subtle">
				<AltArrowDown size={13} color="currentColor" />
			</span>
		</div>
	</div>

	<footer class="flex-none border-t border-border-soft" onclickcapture={handleLinkClick}>
		{@render footer?.(ctx)}
	</footer>
</aside>

{#if mobileOpen && isMobile}
	<button
		type="button"
		class="fixed inset-0 z-40 bg-black/45 md:hidden"
		aria-label="Close sidebar"
		onclick={() => (mobileOpen = false)}
	></button>
{/if}

<style>
	.sidebar-body {
		scrollbar-width: thin;
		scrollbar-color: var(--border) transparent;
	}

	.sidebar-body::-webkit-scrollbar {
		width: 6px;
	}

	.sidebar-body::-webkit-scrollbar-thumb {
		background: var(--border);
		border-radius: 999px;
	}
</style>
