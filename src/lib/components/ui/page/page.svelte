<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './page-wrapper.styles';
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

	const sizeStyles = {
		md: wrapperStyles.md,
		lg: wrapperStyles.lg,
		xl: wrapperStyles.xl,
		full: wrapperStyles.full
	};
</script>

<section
	class={[
		stylex.attrs(wrapperStyles.root, sizeStyles[size]).class,
		className
	]}
>
	{@render children?.()}
</section>
