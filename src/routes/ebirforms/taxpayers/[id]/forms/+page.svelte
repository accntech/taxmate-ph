<script lang="ts">
	import { onMount } from 'svelte';
	import { buildTaxpayerFormsRoute } from '$lib/apps/app-shell';
	import { ebirformsWorkspace as workspace } from '$lib/ebirforms/ebirforms-workspace.svelte';
	import { Badge, ButtonLink, Card, Page, PageHeader } from '$lib/components/ui';
	import CheckCircle from '@solar-icons/svelte/category/ui/Linear/CheckCircle.svelte';
	import ClipboardList from '@solar-icons/svelte/category/notes/Linear/ClipboardList.svelte';
	import DocumentAdd from '@solar-icons/svelte/category/notes/Linear/DocumentAdd.svelte';
	import FileText from '@solar-icons/svelte/category/files/Linear/FileText.svelte';

	let { params } = $props();

	onMount(() => {
		void workspace.loadTaxpayerProfiles().then(() => workspace.selectTaxpayerProfile(params.id));
	});
</script>

<svelte:head>
	<title>Forms | eBIRForms</title>
</svelte:head>

<Page size="lg">
	<ButtonLink href="/ebirforms/taxpayers" variant="ghost" size="sm" class="w-fit">
		Back to taxpayers
	</ButtonLink>

	<PageHeader
		eyebrow="Step 2"
		title="Choose a BIR form"
		description={`Prepare a return for ${workspace.profile.taxpayerName || 'this taxpayer'}. The selected taxpayer details are attached to every draft created here.`}
	>
		{#snippet icon()}
			<DocumentAdd size={22} color="currentColor" />
		{/snippet}
		{#snippet actions()}
			<Card variant="muted" class="grid min-w-64 gap-2">
				<div class="flex items-center gap-2 text-sm font-semibold text-fg">
					<CheckCircle size={18} color="currentColor" />
					{workspace.activeTin}
				</div>
				<p class="text-sm leading-6 text-fg-muted">{workspace.statusMessage}</p>
			</Card>
		{/snippet}
	</PageHeader>

	<Card variant="muted" class="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
		<div class="flex items-center gap-2">
			<ClipboardList size={18} color="currentColor" />
			<p class="text-sm font-semibold text-fg">Available forms</p>
		</div>
		<Badge tone="neutral" class="font-mono">{workspace.returnFilename}</Badge>
	</Card>

	<div class="grid gap-3 md:grid-cols-2">
		{#each workspace.forms as form (form.code)}
			<a
				class={[
					'grid min-h-36 gap-3 rounded-panel border border-border bg-bg-elev p-4',
					'shadow-[var(--shadow-ui-sm)] transition-[border-color,box-shadow,transform]',
					'hover:border-accent/45 hover:shadow-[var(--shadow-ui-md)] active:scale-[0.99]'
				]}
				href={buildTaxpayerFormsRoute(params.id, form.code)}
			>
				<span class="flex items-start justify-between gap-3">
					<span class="flex min-w-0 gap-3">
						<span
							class="grid size-10 shrink-0 place-items-center rounded-md bg-bg-elev-2 text-accent"
							aria-hidden="true"
						>
							<FileText size={21} color="currentColor" />
						</span>
						<span class="min-w-0">
							<span class="font-mono text-xs font-semibold text-accent">
								BIR Form {form.code}
							</span>
							<span class="mt-1 block font-semibold text-fg">{form.title}</span>
						</span>
					</span>
					<Badge tone="success">{form.status}</Badge>
				</span>
				<p class="text-sm text-fg-muted">{form.category}</p>
			</a>
		{/each}
	</div>
</Page>
