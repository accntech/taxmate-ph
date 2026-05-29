<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
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
		type = 'button',
		class: className = '',
		children,
		...rest
	}: {
		variant?: ButtonVariant;
		size?: ButtonSize;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		children?: Snippet;
	} & Omit<HTMLButtonAttributes, 'class' | 'type'> = $props();
</script>

<button
	{type}
	{...rest}
	class={[
		buttonBaseClass,
		buttonVariantClass[variant],
		buttonSizeClass[size],
		className
	]}
>
	{@render children?.()}
</button>
