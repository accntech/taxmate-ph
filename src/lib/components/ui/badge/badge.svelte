<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './badge-wrapper.styles';
	import type { Snippet } from 'svelte';

	type Tone = 'neutral' | 'accent' | 'success' | 'warn' | 'danger' | 'info';

	let {
		tone = 'neutral',
		size = 'md',
		class: className = '',
		children
	}: {
		tone?: Tone;
		size?: 'sm' | 'md';
		class?: string;
		children?: Snippet;
	} = $props();

	const toneStyles: Record<Tone, stylex.StyleXStyles> = {
		neutral: wrapperStyles.neutral,
		accent: wrapperStyles.accent,
		success: wrapperStyles.success,
		warn: wrapperStyles.warn,
		danger: wrapperStyles.danger,
		info: wrapperStyles.info
	};

	const sizeStyle = $derived(size === 'sm' ? wrapperStyles.small : wrapperStyles.medium);
</script>

<span
	class={[stylex.attrs(toneStyles[tone], sizeStyle, wrapperStyles.root, wrapperStyles.singleLine).class, className]}
>
	{@render children?.()}
</span>
