<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './sidebar-wrapper.styles';
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
	class="sidebar group/sb {stylex.attrs(wrapperStyles.root).class}"
	data-state={dataState}
	data-mobile-open={mobileOpen ? 'true' : undefined}
	aria-label={ariaLabel}
>
	{#if header}
		<header class="sidebar-row-anim {stylex.attrs(wrapperStyles.header).class}">
			{@render header(ctx)}
		</header>
	{/if}

	<div class={stylex.attrs(wrapperStyles.scrollFrame).class}>
		<nav
			bind:this={navEl}
			onscroll={updateFades}
			class="sidebar-body {stylex.attrs(wrapperStyles.navigation).class}"
			onclickcapture={handleLinkClick}
		>
			{@render content?.(ctx)}
		</nav>
		<div
			class={stylex.attrs(wrapperStyles.scrollUpFade).class}
			data-show={canScrollUp || undefined}
			aria-hidden="true"
		>
			<span class={stylex.attrs(wrapperStyles.scrollUpIcon).class}>
				<AltArrowDown size={13} color="currentColor" />
			</span>
		</div>
		<div
			class={stylex.attrs(wrapperStyles.scrollDownFade).class}
			data-show={canScrollDown || undefined}
			aria-hidden="true"
		>
			<span class={stylex.attrs(wrapperStyles.scrollDownIcon).class}>
				<AltArrowDown size={13} color="currentColor" />
			</span>
		</div>
	</div>

	<footer class={stylex.attrs(wrapperStyles.footer).class} onclickcapture={handleLinkClick}>
		{@render footer?.(ctx)}
	</footer>
</aside>

{#if mobileOpen && isMobile}
	<button
		type="button"
		class={stylex.attrs(wrapperStyles.backdrop).class}
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
