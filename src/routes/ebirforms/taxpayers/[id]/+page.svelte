<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { styles } from './taxpayer.styles';
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
	<ButtonLink href="/ebirforms/taxpayers" variant="ghost" size="sm" class={stylex.attrs(styles.backLink).class}>
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
			<Card variant="muted" class={stylex.attrs(styles.taxpayerCard).class}>
				<div class={stylex.attrs(styles.taxpayerIdentity).class}>
					<CheckCircle size={18} color="currentColor" />
					Ready for forms
				</div>
				<p class={stylex.attrs(styles.tin).class}>{workspace.activeTin}</p>
			</Card>
		{/snippet}
	</PageHeader>

	<div class={stylex.attrs(styles.summaryGrid).class}>
		{#each [['RDO', workspace.profile.rdoCode || 'not set'], ['Email', workspace.profile.email || 'not set'], ['Profile file', workspace.profileFilename], ['Current return', workspace.returnFilename]] as [label, value] (label)}
			<Card variant="muted" class={stylex.attrs(styles.summaryCard).class}>
				<p class={stylex.attrs(styles.summaryLabel).class}>{label}</p>
				<p class={stylex.attrs(styles.summaryValue).class}>{value}</p>
			</Card>
		{/each}
	</div>

	<Card variant="muted" class={stylex.attrs(styles.actions).class}>
		<ButtonLink href={formsHref} size="touch" class={stylex.attrs(styles.action).class}>
			<DocumentAdd size={18} color="currentColor" />
			Create or manage forms
		</ButtonLink>
		<ButtonLink
			href={`${buildTaxpayerRoute(params.id)}/edit`}
			variant="secondary"
			size="touch"
			class={stylex.attrs(styles.action).class}
		>
			<FileText size={18} color="currentColor" />
			Edit profile
		</ButtonLink>
	</Card>
</Page>
