<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './page-header-wrapper.styles';
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
		stylex.attrs(wrapperStyles.root, wrapperStyles.wideLayout).class,
		className
	]}
>
	<div class={stylex.attrs(wrapperStyles.identity).class}>
		{#if icon}
			<span
				class={stylex.attrs(wrapperStyles.icon).class}
				aria-hidden="true"
			>
				{@render icon()}
			</span>
		{/if}
		<div class={stylex.attrs(wrapperStyles.heading).class}>
			{#if eyebrow}
				<p class={stylex.attrs(wrapperStyles.eyebrow).class}>{eyebrow}</p>
			{/if}
			<h1 class={stylex.attrs(wrapperStyles.title).class}>{title}</h1>
			{#if description}
				<p class={stylex.attrs(wrapperStyles.description).class}>{description}</p>
			{/if}
		</div>
	</div>
	{#if actions}
		<div class={stylex.attrs(wrapperStyles.actions).class}>
			{@render actions()}
		</div>
	{/if}
</header>
