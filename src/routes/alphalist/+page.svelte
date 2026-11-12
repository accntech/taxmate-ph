<script lang="ts">
	import PlannedWorkspace from '$lib/apps/planned-workspace.svelte';
	import UsersGroupRounded from '@solar-icons/svelte/category/users/Linear/UsersGroupRounded.svelte';

	const steps = [
		{ title: 'Organize payees', description: 'Keep payee records together for alphalist preparation.' },
		{ title: 'Review withholding', description: 'Check payee details and withholding tax entries.' },
		{ title: 'Generate files', description: 'Prepare alphalist files from the reviewed entries.' }
	];
</script>

<svelte:head>
	<title>Alphalist | TaxMate PH</title>
	<meta name="description" content="Preview the planned Alphalist workspace in TaxMate PH." />
</svelte:head>

<PlannedWorkspace
	title="Alphalist"
	description="Payee lists for withholding tax reporting."
	{steps}
>
	{#snippet icon()}
		<UsersGroupRounded size={28} color="currentColor" />
	{/snippet}
</PlannedWorkspace>
