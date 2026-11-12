<script lang="ts">
	// Standalone presentation port of PCSTI's @erp/ui form-field-errors.svelte.
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		errors = [],
		class: className = '',
		...restProps
	}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & { errors?: string[] } = $props();
</script>

{#if errors.length > 0}
	<div
		data-slot="form-field-errors"
		class={['grid gap-1 text-sm font-medium text-danger', className]}
		{...restProps}
	>
		{#each errors as error, index (`${index}-${error}`)}
			<div data-slot="form-field-error">{error}</div>
		{/each}
	</div>
{/if}
