<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Snippet } from 'svelte';
	import {
		setTopbarShortcutsContent,
		clearTopbarShortcutsContent
	} from './context.svelte';

	let { children }: { children: Snippet } = $props();

	$effect(() => {
		setTopbarShortcutsContent(children);
	});
	onDestroy(() => clearTopbarShortcutsContent(children));
</script>
