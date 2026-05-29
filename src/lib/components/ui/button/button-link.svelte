<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import {
		buttonBaseClass,
		buttonSizeClass,
		buttonVariantClass,
		type ButtonSize,
		type ButtonVariant
	} from './styles';

	let {
		variant = 'primary',
		size = 'md',
		class: className = '',
		children,
		...rest
	}: {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
		children?: Snippet;
	} & Omit<HTMLAnchorAttributes, 'class'> = $props();
</script>

<a
	{...rest}
	class={[
		buttonBaseClass,
		buttonVariantClass[variant],
		buttonSizeClass[size],
		className
	]}
>
	{@render children?.()}
</a>
