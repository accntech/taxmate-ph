<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { styles } from './taxpayer.styles';
	import { onMount } from 'svelte';
	import { buildTaxpayerRoute } from '$lib/apps/app-shell';
	import { ebirformsWorkspace as workspace } from '$lib/ebirforms/ebirforms-workspace.svelte';
	import { ButtonLink, Card, Page, PageHeader } from '$lib/components/ui';
	import { formatTinInput } from '$lib/profiles/profile';
	import { describePsoc } from '$lib/profiles/psoc';
	import CheckCircle from '@solar-icons/svelte/category/ui/Linear/CheckCircle.svelte';
	import DocumentAdd from '@solar-icons/svelte/category/notes/Linear/DocumentAdd.svelte';
	import FileText from '@solar-icons/svelte/category/files/Linear/FileText.svelte';
	import UserCheck from '@solar-icons/svelte/category/users/Linear/UserCheck.svelte';

	let { params } = $props();
	let formsHref = $derived(`${buildTaxpayerRoute(params.id)}/forms`);
	let profile = $derived(workspace.profile.id === params.id ? workspace.profile : undefined);
	let spouse = $derived(profile?.spouse);
	const dateFormatter = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeZone: 'UTC' });

	function birthDate(value: string | undefined) {
		if (!value) return '';
		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date);
	}

	let personalDetails = $derived([
		['Civil status', profile?.civilStatus === 'Separated' ? 'Legally separated' : profile?.civilStatus],
		['Date of birth', birthDate(profile?.birthDate)],
		['Citizenship', profile?.citizenship],
		['Occupation code (PSOC)', profile?.taxpayerClassification === 'I' ? describePsoc(profile.psocCode) : undefined]
	].filter(([, value]) => !!value));
	let spouseDetails = $derived([
		['Spouse name', spouse?.taxpayerName],
		['TIN and branch code', spouse?.tin1 && spouse.tin2 && spouse.tin3 && spouse.branchCode
			? formatTinInput({ tin1: spouse.tin1, tin2: spouse.tin2, tin3: spouse.tin3, branchCode: spouse.branchCode })
			: ''],
		['RDO code', spouse?.rdoCode],
		['Date of birth', birthDate(spouse?.birthDate)],
		['Citizenship', spouse?.citizenship],
		['Address', [spouse?.address, spouse?.address2].filter(Boolean).join(', ')],
		['ZIP code', spouse?.zipCode],
		['Email', spouse?.email],
		['Contact number', spouse?.contactNumber]
	].filter(([, value]) => !!value));

	onMount(() => {
		void workspace.loadTaxpayerProfiles().then(() => workspace.selectTaxpayerProfile(params.id));
	});
</script>

<svelte:head>
	<title>Taxpayer | eBIRForms</title>
</svelte:head>

{#snippet details(id: string, title: string, rows: (string | undefined)[][])}
	<section aria-labelledby={id}>
		<Card variant="muted" class={stylex.attrs(styles.detailsCard).class}>
			<h2 id={id} class={stylex.attrs(styles.detailsHeading).class}>{title}</h2>
			{#if rows.length}
				<dl class={stylex.attrs(styles.detailsGrid).class}>
					{#each rows as [label, value] (label)}
						<div>
							<dt class={stylex.attrs(styles.summaryLabel).class}>{label}</dt>
							<dd class={stylex.attrs(styles.detailValue).class}>{value}</dd>
						</div>
					{/each}
				</dl>
			{:else}
				<p class={stylex.attrs(styles.detailsEmpty).class}>No spouse details saved.</p>
			{/if}
		</Card>
	</section>
{/snippet}

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


	{#if personalDetails.length}
		{@render details('personal-details', 'Personal details', personalDetails)}
	{/if}
	{#if spouseDetails.length || profile?.civilStatus === 'Married'}
		{@render details('spouse-details', 'Spouse details', spouseDetails)}
	{/if}

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
