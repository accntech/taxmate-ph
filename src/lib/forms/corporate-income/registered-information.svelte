<script lang="ts">
	import { CalculatedValue, Input } from '$lib/components/ui';
	import { joinRegisteredLines } from '$lib/profiles/profile';
	import type { CorporateField, CorporateValues } from './types';

	let { fields, values, errors }: {
		fields: CorporateField[];
		values: CorporateValues;
		errors: CorporateValues;
	} = $props();

	const primary = $derived(fields[0]);
	const managedText = $derived(joinRegisteredLines(fields.map(field => values[field.id])));
	const managedError = $derived(fields.map(field => errors[field.id]).find(Boolean));
</script>

<div class="registered-information">
	{#if managedText}
		<CalculatedValue id={primary.id} label={primary.label ?? ''} value={managedText} error={managedError} />
	{:else}
		<Input id={primary.id} label={primary.label} error={managedError} readonly
			title="Use Edit taxpayer information for profile details." />
	{/if}
</div>
