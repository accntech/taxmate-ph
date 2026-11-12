<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { wrapperStyles } from './field-errors-wrapper.styles';
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
		class={[stylex.attrs(wrapperStyles.root).class, className]}
		{...restProps}
	>
		{#each errors as error, index (`${index}-${error}`)}
			<div data-slot="form-field-error">{error}</div>
		{/each}
	</div>
{/if}
