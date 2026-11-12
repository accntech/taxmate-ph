<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { startWindowChrome } from './window-chrome';

	let { children }: { children: Snippet } = $props();
	onMount(startWindowChrome);
</script>

<header aria-label="Window title bar" data-tauri-drag-region class="window-titlebar">
	{@render children()}
</header>

<style>
	.window-titlebar {
		display: flex;
		position: fixed;
		inset: 0 0 auto;
		z-index: 50;
		align-items: center;
		height: var(--desktop-titlebar-height, 64px);
		padding-left: calc(var(--desktop-titlebar-left-inset, 0px) + 16px);
		padding-right: calc(var(--desktop-titlebar-right-inset, 0px) + 16px);
		border-bottom: 1px solid var(--border-soft);
		background: var(--bg);
		color: var(--fg);
		user-select: none;
	}

	.window-titlebar :global([data-app-topbar]) {
		position: static;
		flex: 1;
		min-width: 0;
		min-height: 0;
		height: 100%;
		padding: 0;
		border: 0;
		background: transparent;
		backdrop-filter: none;
	}
</style>
