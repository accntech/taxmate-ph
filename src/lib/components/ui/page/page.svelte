<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		size = 'xl',
		class: className = '',
		children
	}: {
		size?: 'md' | 'lg' | 'xl' | 'full';
		class?: string;
		children?: Snippet;
	} = $props();

	const sizeClass = {
		md: 'max-w-4xl',
		lg: 'max-w-6xl',
		xl: 'max-w-7xl',
		full: 'max-w-none'
	};
</script>

<section
	class={[
		'mx-auto grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-4 px-1 pb-8 sm:px-2 lg:gap-5',
		sizeClass[size],
		className
	]}
>
	{@render children?.()}
</section>
