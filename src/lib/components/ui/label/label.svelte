<script lang="ts">
	import { Label as SdkLabel } from '@ui-sdk/svelte/label';
	import * as stylex from '@stylexjs/stylex';
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import { wrapperStyles } from './label-wrapper.styles';

	let {
		ref = $bindable(null),
		class: className = '',
		child,
		children,
		...restProps
	}: HTMLLabelAttributes & {
		ref?: HTMLElement | null;
		child?: Snippet<[{ props: Record<string, unknown> }]>;
	} = $props();

	const trackRef: Attachment<HTMLElement> = (element) => {
		ref = element;
		return () => { ref = null; };
	};
</script>

<SdkLabel
	data-slot="label"
	class={[
		'field-label',
		stylex.attrs(wrapperStyles.root, wrapperStyles.disabledGroup, wrapperStyles.disabledPeer).class,
		className
	].join(' ')}
	{...restProps}
	{@attach trackRef}
>
	{#snippet render({ props })}
		{#if child}
			{@render child({ props })}
		{:else}
			<label {...props}>
				{@render children?.()}
			</label>
		{/if}
	{/snippet}
</SdkLabel>
