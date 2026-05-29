<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		eyebrow = '',
		title,
		description = '',
		icon,
		actions,
		class: className = ''
	}: {
		eyebrow?: string;
		title: string;
		description?: string;
		icon?: Snippet;
		actions?: Snippet;
		class?: string;
	} = $props();
</script>

<header
	class={[
		'grid min-w-0 gap-4 rounded-panel border border-border bg-bg-elev p-4 shadow-[var(--shadow-ui-sm)]',
		'lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start',
		className
	]}
>
	<div class="flex w-full min-w-0 items-start gap-3">
		{#if icon}
			<span
				class="grid size-10 shrink-0 place-items-center rounded-md bg-accent-soft text-accent"
				aria-hidden="true"
			>
				{@render icon()}
			</span>
		{/if}
		<div class="min-w-0 flex-1">
			{#if eyebrow}
				<p class="font-mono text-xs font-semibold uppercase text-accent">{eyebrow}</p>
			{/if}
			<h1 class="mt-1 text-2xl font-semibold leading-tight text-fg sm:text-3xl">{title}</h1>
			{#if description}
				<p class="mt-2 max-w-3xl text-sm leading-6 text-fg-muted">{description}</p>
			{/if}
		</div>
	</div>
	{#if actions}
		<div class="flex flex-wrap gap-2 lg:justify-end">
			{@render actions()}
		</div>
	{/if}
</header>
