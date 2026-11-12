<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './label-wrapper.styles';
	// Adapted from PCSTI's @erp/ui/components/label/label.svelte.
	import { Label as LabelPrimitive } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className = '',
		...restProps
	}: LabelPrimitive.RootProps = $props();
</script>

<LabelPrimitive.Root
	bind:ref
	data-slot="label"
	class={[
		'field-label',
		stylex.attrs(wrapperStyles.root, wrapperStyles.disabledGroup, wrapperStyles.disabledPeer).class,
		className
	].join(' ')}
	{...restProps}
/>
