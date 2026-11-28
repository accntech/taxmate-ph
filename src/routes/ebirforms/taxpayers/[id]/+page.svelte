<script lang="ts">
	import { onMount } from 'svelte';
	import { buildTaxpayerRoute } from '$lib/apps/app-shell';
	import { ebirformsWorkspace as workspace } from '$lib/ebirforms/ebirforms-workspace.svelte';
	import { Badge, Button, ButtonLink, Card, Page } from '$lib/components/ui';
	import { buildProfileFilename, formatTinInput } from '$lib/profiles/profile';
	import { describePsoc } from '$lib/profiles/psoc';
	import ChevronLeft from '@solar-icons/svelte/category/arrows/Linear/AltArrowLeft.svelte';
	import CheckCircle from '@solar-icons/svelte/category/ui/Linear/CheckCircle.svelte';
	import DocumentAdd from '@solar-icons/svelte/category/notes/Linear/DocumentAdd.svelte';
	import FileText from '@solar-icons/svelte/category/files/Linear/FileText.svelte';
	import UserCheck from '@solar-icons/svelte/category/users/Linear/UserCheck.svelte';

	let { params } = $props();
	let formsHref = $derived(`${buildTaxpayerRoute(params.id)}/forms`);
	const profile = $derived(workspace.profiles.find(candidate => candidate.id === params.id));
	let spouse = $derived(profile?.spouse);
	const numericLabels = ['TIN and branch code', 'RDO code', 'Date of birth', 'ZIP code', 'Contact number'];
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

	async function loadProfile() {
		await workspace.loadTaxpayerProfiles();
		if (workspace.profileLoadState === 'loaded' && profile) workspace.selectTaxpayerProfile(profile.id);
	}
	onMount(() => { void loadProfile(); });
</script>

<svelte:head>
	<title>Taxpayer | eBIRForms</title>
</svelte:head>

{#snippet field(label: string, value: string | undefined, mono = false)}
	<div>
		<dt>{label}</dt>
		<dd class={{ 'font-mono': mono }}>{value}</dd>
	</div>
{/snippet}

{#snippet details(id: string, title: string, rows: (string | undefined)[][])}
	<section class="detail-section" aria-labelledby={id}>
		<h2 id={id}>{title}</h2>
		{#if rows.length}
			<dl class="detail-grid">
				{#each rows as [label, value] (label)}
					{#if label === 'Occupation code (PSOC)'}
						<div>
							<dt>{label}</dt>
							<dd>
								<span class="font-mono">{value?.split(' · ')[0]}</span>{value?.includes(' · ') ? value.slice(value.indexOf(' · ')) : ''}
							</dd>
						</div>
					{:else if label}
						{@render field(label, value, numericLabels.includes(label))}
					{/if}
				{/each}
			</dl>
		{:else}
			<p class="empty">No spouse details saved.</p>
		{/if}
	</section>
{/snippet}

<Page size="lg" class="taxpayer-checkpoint">
	<ButtonLink href="/ebirforms/taxpayers" variant="ghost" size="sm" class="checkpoint-back">
		<ChevronLeft size={16} color="currentColor" aria-hidden="true" />
		Back to taxpayers
	</ButtonLink>

	{#if workspace.profileLoadState === 'error'}
		<Card>
			<div role="alert">
				<h1>Could not load taxpayer</h1>
				<p>{workspace.profileLoadError}</p>
			</div>
			<Button variant="secondary" onclick={() => void loadProfile()}>Retry</Button>
		</Card>
	{:else if workspace.profileLoadState !== 'loaded'}
		<Card><p role="status">Loading taxpayer…</p></Card>
	{:else if !profile}
		<Card><div role="alert"><h1>Taxpayer not found</h1><p>Return to the taxpayers list and select a saved profile.</p></div></Card>
	{:else}
	<div class="checkpoint">
		<header class="checkpoint-header">
			<div class="identity">
				<div class="identity-icon">
					<UserCheck size={24} color="currentColor" aria-hidden="true" />
				</div>
				<div>
					<h1>{profile.taxpayerName || 'Selected taxpayer'}</h1>
					<div class="identity-meta">
						<dl class="tin">
							<dt>TIN</dt>
							<dd class="font-mono">{formatTinInput(profile)}</dd>
						</dl>
						<Badge tone="success" size="sm">
							<CheckCircle size={14} color="currentColor" aria-hidden="true" />
							Ready for forms
						</Badge>
					</div>
				</div>
			</div>
			<div class="actions">
				<ButtonLink href={formsHref} size="touch">
					<DocumentAdd size={18} color="currentColor" aria-hidden="true" />
					Create or manage forms
				</ButtonLink>
				<ButtonLink href={`${buildTaxpayerRoute(params.id)}/edit`} variant="secondary" size="touch">
					<FileText size={18} color="currentColor" aria-hidden="true" />
					Edit profile
				</ButtonLink>
			</div>
		</header>

		<div class="checkpoint-content">
			<div class="profile-details">
				<section class="detail-section" aria-labelledby="registration-details">
					<h2 id="registration-details">Registration</h2>
					<dl class="detail-grid">
						{@render field('RDO', profile.rdoCode || 'Not set', Boolean(profile.rdoCode))}
						{@render field('Email', profile.email || 'Not set')}
					</dl>
				</section>

				{#if personalDetails.length}
					{@render details('personal-details', 'Personal details', personalDetails)}
				{/if}
				{#if spouseDetails.length || profile?.civilStatus === 'Married'}
					{@render details('spouse-details', 'Spouse details', spouseDetails)}
				{/if}
			</div>

			<section class="files detail-section" aria-labelledby="taxpayer-files">
				<h2 id="taxpayer-files">Files</h2>
				<dl class="file-list">
					{@render field('Profile file', buildProfileFilename(profile), true)}
					{#if workspace.selectedProfileId === profile.id}
						{@render field('Return filename', workspace.returnFilename, true)}
					{/if}
				</dl>
			</section>
		</div>
	</div>
	{/if}
</Page>

<style>
	:global(.taxpayer-checkpoint > .checkpoint-back) {
		justify-self: start;
	}

	.checkpoint {
		--checkpoint-padding: clamp(1rem, 3vw, 1.75rem);
		container: taxpayer-checkpoint / inline-size;
		border: 1px solid var(--border);
		border-radius: 14px;
		background: var(--bg-elev);
	}

	.checkpoint-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1.25rem 1.5rem;
		padding: var(--checkpoint-padding);
		border-block-end: 1px solid var(--border);
	}

	.identity {
		display: grid;
		flex: 1 1 21rem;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: start;
		gap: 0.875rem;
		min-width: 0;
	}

	.identity-icon {
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 10px;
		background: var(--accent-soft);
		color: var(--accent);
	}

	h1 {
		margin: 0;
		font-family: var(--font-sans);
		font-size: clamp(1.375rem, 2.7vw, 2rem);
		font-weight: 650;
		letter-spacing: -0.03em;
		line-height: 1.18;
		overflow-wrap: anywhere;
	}

	.identity-meta,
	.tin,
	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	.identity-meta {
		gap: 0.5rem 0.875rem;
		margin-block-start: 0.625rem;
	}

	.tin {
		gap: 0.25rem 0.5rem;
		min-width: 0;
		margin: 0;
	}

	.tin dd {
		margin: 0;
	}

	.actions {
		gap: 0.5rem;
		max-width: 100%;
	}

	.checkpoint-content {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}

	.detail-section {
		padding: var(--checkpoint-padding);
	}

	.detail-section + .detail-section,
	.files {
		border-block-start: 1px solid var(--border-soft);
	}

	.files {
		border-end-start-radius: 13px;
		border-end-end-radius: 13px;
		background: var(--bg-elev-2);
	}

	h2 {
		margin: 0 0 0.875rem;
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		font-weight: 650;
		line-height: 1.4;
	}

	.detail-grid,
	.file-list {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0.875rem 1.25rem;
		margin: 0;
	}

	dt {
		color: var(--fg-muted);
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1.4;
	}

	dd {
		margin: 0.25rem 0 0;
		font-size: 0.875rem;
		line-height: 1.45;
		overflow-wrap: anywhere;
	}

	.file-list dd {
		font-size: 0.8125rem;
	}

	.empty {
		margin: 0;
		color: var(--fg-muted);
		font-size: 0.875rem;
	}

	@container taxpayer-checkpoint (width >= 30rem) {
		.detail-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@container taxpayer-checkpoint (width >= 48rem) {
		.checkpoint-content {
			grid-template-columns: minmax(0, 1fr) minmax(16rem, 34%);
		}

		.files {
			border-block-start: 0;
			border-inline-start: 1px solid var(--border-soft);
			border-end-start-radius: 0;
		}
	}

	@container taxpayer-checkpoint (width < 30rem) {
		.actions {
			display: grid;
			grid-template-columns: minmax(0, 1fr);
			width: 100%;
		}
	}
</style>
