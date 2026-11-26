<script lang="ts">
	import { Pagination } from '$lib/components/ui';
	import ReturnPageCommand from './return-page-command.svelte';

	let { pages, current, onchange }: {
		pages: { id: string; title: string }[];
		current: string;
		onchange: (page: string) => void | Promise<void>;
	} = $props();

	const page = $derived(Math.max(1, pages.findIndex((item) => item.id === current) + 1));
</script>

{#if pages.length > 1}
	<Pagination
		{page}
		pageSize={1}
		total={pages.length}
		summary={false}
		label="Return pages"
		class="return-pagination"
		pageTitle={(index) => pages[index - 1].title}
		onchange={(index) => void onchange(pages[index - 1].id)}
	>
		{#snippet pagePicker()}
			<ReturnPageCommand {pages} {current} {onchange} />
		{/snippet}
	</Pagination>
{:else}
	<p class="single-page-status">Page 1 of 1</p>
{/if}

<style>
	:global(.taxmate-pagination.return-pagination) {
		border-block-start: 0;
		scroll-margin-block-end: 5rem;
	}
	.single-page-status {
		margin: 0;
		padding: .625rem .75rem;
		color: var(--fg-muted);
		font-size: .8rem;
	}
</style>
