<script lang="ts">
	import { getFieldKitSteps, listSuiteApps } from '$lib/apps/app-shell';
	import { Badge, ButtonLink, Card, Page, PageHeader } from '$lib/components/ui';
	import ArrowRight from '@solar-icons/svelte/category/arrows/Linear/ArrowRight.svelte';
	import CheckCircle from '@solar-icons/svelte/category/ui/Linear/CheckCircle.svelte';
	import ClockCircle from '@solar-icons/svelte/category/time/Linear/ClockCircle.svelte';
	import DocumentText from '@solar-icons/svelte/category/notes/Linear/DocumentText.svelte';
	import BillList from '@solar-icons/svelte/category/money/Linear/BillList.svelte';
	import UsersGroupRounded from
		'@solar-icons/svelte/category/users/Linear/UsersGroupRounded.svelte';

	const suiteApps = listSuiteApps();
	const kitSteps = getFieldKitSteps();

	function statusLabel(status: string) {
		return status === 'active' ? 'Available now' : 'Planned module';
	}
</script>

{#snippet appIcon(id: string, size = 24)}
	{#if id === 'ebirforms'}
		<DocumentText {size} color="currentColor" />
	{:else if id === 'vat-relief'}
		<BillList {size} color="currentColor" />
	{:else}
		<UsersGroupRounded {size} color="currentColor" />
	{/if}
{/snippet}

{#snippet statusIcon(status: string)}
	{#if status === 'active'}
		<CheckCircle size={15} color="currentColor" />
	{:else}
		<ClockCircle size={15} color="currentColor" />
	{/if}
{/snippet}

<svelte:head>
	<title>TaxMate PH</title>
	<meta
		name="description"
		content="Open eBIRForms, VAT Relief, and Alphalist workspaces from TaxMate PH."
	/>
</svelte:head>

<Page size="lg" class="@container">
	<PageHeader
		eyebrow="Local tax workspace"
		title="Prepare Philippine tax files in guided workspaces."
		description="TaxMate PH organizes BIR utilities around the job: choose the taxpayer, prepare the return, review validation, then export the local files you need."
	>
		{#snippet icon()}
			<CheckCircle size={22} color="currentColor" />
		{/snippet}
		{#snippet actions()}
			<ButtonLink href="/ebirforms/taxpayers" size="touch">
				Open eBIRForms
				<ArrowRight size={17} color="currentColor" />
			</ButtonLink>
		{/snippet}
	</PageHeader>

	<div class="grid gap-3 @md:grid-cols-2 @3xl:grid-cols-3 @4xl:grid-cols-5" aria-label="Preparation workflow">
		{#each kitSteps as step, index (step.id)}
			<Card variant="panel" class="grid gap-3">
				<span class="grid size-8 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent">
					{index + 1}
				</span>
				<div class="grid gap-1">
					<h2 class="text-sm font-semibold text-fg">{step.label}</h2>
					<p class="text-sm leading-6 text-fg-muted">{step.description}</p>
				</div>
			</Card>
		{/each}
	</div>

	<div class="grid gap-3 @md:grid-cols-2 @4xl:grid-cols-3" aria-label="Products">
		{#each suiteApps as app (app.id)}
			<a
				class={[
					'grid min-h-52 gap-4 rounded-panel border border-border bg-bg-elev p-4',
					'shadow-[var(--shadow-ui-sm)] transition-[border-color,box-shadow,transform]',
					'hover:border-accent/40 hover:shadow-[var(--shadow-ui-md)] active:scale-[0.99]',
					app.status === 'active' && 'bg-accent-soft/35'
				]}
				href={app.href}
			>
				<span class="flex flex-wrap items-start justify-between gap-2">
					<span
						class="grid size-11 place-items-center rounded-md border border-border-soft bg-bg-elev-2 text-accent"
						aria-hidden="true"
					>
						{@render appIcon(app.id)}
					</span>
					<Badge tone={app.status === 'active' ? 'success' : 'warn'}>
						{@render statusIcon(app.status)}
						{statusLabel(app.status)}
					</Badge>
				</span>
				<span class="grid content-start gap-2">
					<span class="text-lg font-semibold text-fg">{app.name}</span>
					<span class="text-sm leading-6 text-fg-muted">{app.description}</span>
				</span>
				<span class="mt-auto flex items-center gap-2 text-sm font-semibold text-accent">
					{app.status === 'active' ? 'Open workspace' : 'Preview module'}
					<ArrowRight size={16} color="currentColor" />
				</span>
			</a>
		{/each}
	</div>
</Page>
