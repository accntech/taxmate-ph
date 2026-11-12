<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './topbar-wrapper.styles';
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

<div
	data-app-topbar
	data-tauri-drag-region
	class={stylex.attrs(wrapperStyles.root).class}
>
	<button
		type="button"
		class={stylex.attrs(wrapperStyles.menuButton).class}
		onclick={onMenu}
		aria-label="Toggle sidebar"
	>
		<SidebarMinimalistic size={18} color="currentColor" aria-hidden="true" />
	</button>

	<nav data-tauri-drag-region aria-label="Breadcrumb" class={stylex.attrs(wrapperStyles.breadcrumbs).class}>
		{#each crumbs as crumb, index (index)}
			{#if index > 0}
				<span class={stylex.attrs(wrapperStyles.separator).class} aria-hidden="true">/</span>
			{/if}
			{#if crumb.href}
				<a
					href={crumb.href}
					class={stylex.attrs(wrapperStyles.link).class}
				>
					{crumb.label}
				</a>
			{:else}
				<span data-tauri-drag-region aria-current={index === crumbs.length - 1 ? 'page' : undefined} class={stylex.attrs(wrapperStyles.currentPage).class}>{crumb.label}</span>
			{/if}
		{/each}
	</nav>

	<div data-tauri-drag-region class={stylex.attrs(wrapperStyles.actions).class}>
		{@render shortcuts?.()}
		{@render actions?.()}
	</div>
</div>
