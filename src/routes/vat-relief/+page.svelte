<script lang="ts">
	import PlannedWorkspace from '$lib/apps/planned-workspace.svelte';
	import BillList from '@solar-icons/svelte/category/money/Linear/BillList.svelte';

	const steps = [
		{ title: 'Import records', description: 'Bring sales and purchase records into one workspace.' },
		{ title: 'Review schedules', description: 'Check schedule details and resolve validation issues.' },
		{ title: 'Generate files', description: 'Prepare local files from the reviewed schedules.' }
	];
</script>

<svelte:head>
	<title>VAT Relief | TaxMate PH</title>
	<meta name="description" content="Preview the planned VAT Relief workspace in TaxMate PH." />
</svelte:head>

<PlannedWorkspace
	title="VAT Relief"
	description="Sales and purchase schedules for VAT reporting."
	{steps}
>
	{#snippet icon()}
		<BillList size={28} color="currentColor" />
	{/snippet}
</PlannedWorkspace>
