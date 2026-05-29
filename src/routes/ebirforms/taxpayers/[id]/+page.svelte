<script lang="ts">
	import { onMount } from 'svelte';
	import { buildTaxpayerRoute } from '$lib/apps/app-shell';
	import { ebirformsWorkspace as workspace } from '$lib/ebirforms/ebirforms-workspace.svelte';
	import { ButtonLink, Card, Page, PageHeader } from '$lib/components/ui';
	import CheckCircle from '@solar-icons/svelte/category/ui/Linear/CheckCircle.svelte';
	import DocumentAdd from '@solar-icons/svelte/category/notes/Linear/DocumentAdd.svelte';
	import FileText from '@solar-icons/svelte/category/files/Linear/FileText.svelte';
	import UserCheck from '@solar-icons/svelte/category/users/Linear/UserCheck.svelte';

	let { params } = $props();
	let formsHref = $derived(`${buildTaxpayerRoute(params.id)}/forms`);

	onMount(() => {
		void workspace.loadTaxpayerProfiles().then(() => workspace.selectTaxpayerProfile(params.id));
	});
</script>

<svelte:head>
	<title>Taxpayer | eBIRForms</title>
</svelte:head>

<Page size="md">
	<ButtonLink href="/ebirforms/taxpayers" variant="ghost" size="sm" class="w-fit">
		Back to taxpayers
	</ButtonLink>

	<PageHeader
		eyebrow="Taxpayer checkpoint"
		title={workspace.profile.taxpayerName || 'Selected taxpayer'}
		description="Confirm the taxpayer details, then continue to the available BIR forms."
	>
		{#snippet icon()}
			<UserCheck size={22} color="currentColor" />
		{/snippet}
		{#snippet actions()}
			<Card variant="muted" class="grid min-w-64 gap-2">
				<div class="flex items-center gap-2 text-sm font-semibold text-fg">
					<CheckCircle size={18} color="currentColor" />
					Ready for forms
				</div>
				<p class="font-mono text-xs text-fg-muted">{workspace.activeTin}</p>
			</Card>
		{/snippet}
	</PageHeader>

	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
		{#each [
			['RDO', workspace.profile.rdoCode || 'not set'],
			['Email', workspace.profile.email || 'not set'],
			['Profile file', workspace.profileFilename],
			['Current return', workspace.returnFilename]
		] as [label, value]}
			<Card variant="muted" class="grid gap-1">
				<p class="text-xs font-medium text-fg-muted">{label}</p>
				<p class="truncate font-mono text-sm font-semibold text-fg">{value}</p>
			</Card>
		{/each}
	</div>

	<Card variant="muted" class="grid gap-3 sm:grid-cols-2">
		<ButtonLink href={formsHref} size="touch" class="w-full">
			<DocumentAdd size={18} color="currentColor" />
			Create or manage forms
		</ButtonLink>
		<ButtonLink href="/ebirforms/taxpayers" variant="secondary" size="touch" class="w-full">
			<FileText size={18} color="currentColor" />
			Edit profile
		</ButtonLink>
	</Card>
</Page>
