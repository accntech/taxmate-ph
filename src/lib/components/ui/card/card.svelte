<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './card-wrapper.styles';
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

	const variantStyles = {
		panel: wrapperStyles.panel,
		muted: wrapperStyles.muted,
		flat: wrapperStyles.flat
	};

	const paddingStyles = {
		none: undefined,
		sm: wrapperStyles.sm,
		md: wrapperStyles.md,
		lg: wrapperStyles.lg
	};
</script>

<section
	class={[
		stylex.attrs(wrapperStyles.root, variantStyles[variant], paddingStyles[padding], interactive && wrapperStyles.interactive).class,
		className
	]}
>
	{@render children?.()}
</section>
