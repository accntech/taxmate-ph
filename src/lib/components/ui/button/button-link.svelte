<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import { Button as PcstiButton, type ButtonVariant as PcstiButtonVariant, type ButtonSize as PcstiButtonSize } from '$lib/components/ui/button/base';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import {
		type ButtonSize,
		type ButtonVariant
	} from './styles';

	let {
		variant = 'primary',
		size = 'md',
		class: className = '',
		type,
		children,
		...rest
	}: {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
		children?: Snippet;
	} & Omit<HTMLAnchorAttributes, 'class'> = $props();
	// The source uses intersected anchor/button handlers; this wrapper selects one native element.
	const SourceButton = PcstiButton as unknown as Component<Omit<HTMLAnchorAttributes, 'type'> & {
		children?: Snippet;
		type?: 'button' | 'submit' | 'reset';
		variant?: PcstiButtonVariant;
		size?: PcstiButtonSize;
	}>;
</script>

<SourceButton
	{...rest}
	variant={variant === 'primary' ? 'accent' : variant === 'secondary' ? 'outlined' : variant === 'danger' ? 'destructive' : variant === 'warn' ? 'primary-soft' : 'ghost'}
	size={size === 'sm' ? 'compact' : size === 'icon' ? 'icon' : 'normal'}
	class={[size === 'touch' ? 'min-h-12 px-4 text-base' : '', variant === 'warn' ? 'ui-warning-action' : '', className].filter(Boolean).join(' ')}
>
	{@render children?.()}
</SourceButton>
