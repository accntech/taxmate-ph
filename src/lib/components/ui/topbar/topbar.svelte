<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Crumb } from '../types';
	import SidebarMinimalistic from '@solar-icons/svelte/category/it/Linear/SidebarMinimalistic.svelte';

	let {
		onMenu,
		crumbs,
		shortcuts,
		actions
	}: {
		onMenu: () => void;
		crumbs: Crumb[];
		shortcuts?: Snippet;
		actions?: Snippet;
	} = $props();
</script>

<header
	class="sticky top-0 z-20 flex min-h-14 items-center gap-3.5 border-b border-border-soft bg-bg/95 px-4 py-3 backdrop-blur lg:px-7"
>
	<button
		type="button"
		class="grid size-8 place-items-center rounded-md border border-transparent bg-transparent text-fg outline-none transition hover:bg-bg-hover focus-visible:border-[color-mix(in_oklch,var(--accent)_60%,var(--border))] focus-visible:shadow-[0_0_0_3px_color-mix(in_oklch,var(--accent)_18%,transparent)] active:scale-95"
		onclick={onMenu}
		aria-label="Toggle sidebar"
	>
		<SidebarMinimalistic size={18} color="currentColor" aria-hidden="true" />
	</button>

	<nav class="hidden min-w-0 flex-1 items-center gap-2 text-[13px] text-fg-muted md:flex">
		{#each crumbs as crumb, index (index)}
			{#if index > 0}
				<span class="text-fg-subtle" aria-hidden="true">/</span>
			{/if}
			{#if crumb.href}
				<a
					href={crumb.href}
					class="truncate rounded-sm border border-transparent text-fg-subtle transition hover:text-fg last:text-fg last:font-medium"
				>
					{crumb.label}
				</a>
			{:else}
				<span class="truncate text-fg-subtle last:text-fg last:font-medium">{crumb.label}</span>
			{/if}
		{/each}
	</nav>

	<div class="ml-auto flex items-center gap-2">
		{@render shortcuts?.()}
		{@render actions?.()}
	</div>
</header>
