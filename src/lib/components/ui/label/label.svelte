<script lang="ts">
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
		'flex items-center gap-1.5 text-sm font-medium leading-none text-fg',
		'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
		'peer-disabled:cursor-not-allowed peer-disabled:opacity-50 select-none',
		className
	].join(' ')}
	{...restProps}
/>
