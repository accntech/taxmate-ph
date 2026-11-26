<script lang="ts">
	import { CalculatedValue, Input } from '$lib/components/ui';
	import type { CorporateField, CorporateValues } from './types';

	let { fields, values, errors, onvaluechange }: {
		fields: CorporateField[];
		values: CorporateValues;
		errors: CorporateValues;
		onvaluechange: (patch: CorporateValues) => void;
	} = $props();

	const primary = $derived(fields[0]);
	const managed = $derived(fields.filter(field => field.profileKey || field.readonly));
	const continuation = $derived(fields.filter(field => !field.profileKey && !field.readonly));
	const managedText = $derived(managed.map(field => values[field.id]).filter(value => value?.trim())
		.join('\n').replace(/\r\n?/g, '\n'));
	const managedError = $derived(managed.map(field => errors[field.id]).find(Boolean));
</script>

<div class="registered-information">
	{#if managedText}
		<CalculatedValue id={primary.id} label={primary.label ?? ''} value={managedText} error={managedError} />
	{:else}
		<Input id={primary.id} label={primary.label} error={managedError} readonly
			title="Use Edit taxpayer information for profile details." />
	{/if}
	{#each continuation as field (field.id)}
		<Input id={field.id} label={field.label} value={values[field.id] ?? ''} error={errors[field.id]}
			maxlength={field.maxLength} oninput={(event) => onvaluechange({ [field.id]: event.currentTarget.value })} />
	{/each}
</div>

<style>
	.registered-information {
		display: grid;
		gap: .5rem;
		min-inline-size: 0;
	}
	.registered-information :global(output) { white-space: pre-wrap; }
</style>
