<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'panel',
		padding = 'md',
		interactive = false,
		class: className = '',
		children
	}: {
		variant?: 'panel' | 'muted' | 'flat';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		interactive?: boolean;
		class?: string;
		children?: Snippet;
	} = $props();

	const variantClass = {
		panel: 'border-border bg-bg-elev shadow-[var(--shadow-ui-sm)]',
		muted: 'border-border-soft bg-bg-elev-2',
		flat: 'border-border-soft bg-transparent'
	};

	const paddingClass = {
		none: '',
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-5'
	};
</script>

<section
	class={[
		'rounded-panel border',
		variantClass[variant],
		paddingClass[padding],
		interactive &&
			'transition-[border-color,box-shadow,transform] duration-150 hover:border-accent/40 hover:shadow-[var(--shadow-ui-md)] active:scale-[0.99]',
		className
	]}
>
	{@render children?.()}
</section>
