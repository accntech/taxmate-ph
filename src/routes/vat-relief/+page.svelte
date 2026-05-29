<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge, ButtonLink, Card, Page, PageHeader } from '$lib/components/ui';
	import ArrowRight from '@solar-icons/svelte/category/arrows/Linear/ArrowRight.svelte';
	import BillList from '@solar-icons/svelte/category/money/Linear/BillList.svelte';
	import ClockCircle from '@solar-icons/svelte/category/time/Linear/ClockCircle.svelte';
	import FolderCheck from '@solar-icons/svelte/category/folders/Linear/FolderCheck.svelte';
	import LockKeyhole from '@solar-icons/svelte/category/security/Linear/LockKeyhole.svelte';
</script>

<svelte:head>
	<title>VAT Relief | TaxMate PH</title>
	<meta
		name="description"
		content="VAT Relief is coming soon in the mobile-first BIR suite."
	/>
</svelte:head>

<Page size="lg" class="place-items-start">
	<PageHeader
		eyebrow="Planned workspace"
		title="VAT Relief"
		description="The VAT Relief module will use the same workflow pattern: import records, validate schedules, review exceptions, then generate the required local files."
	>
		{#snippet icon()}
			<BillList size={24} color="currentColor" />
		{/snippet}
		{#snippet actions()}
			<Badge tone="warn">
				<LockKeyhole size={15} color="currentColor" />
				Unavailable
			</Badge>
		{/snippet}
	</PageHeader>

	<div class="grid w-full gap-3 md:grid-cols-2">
		<Card class="flex items-start gap-3">
			<span
				class="grid size-9 shrink-0 place-items-center rounded-md bg-info-soft text-info"
				aria-hidden="true"
			>
				<FolderCheck size={18} color="currentColor" />
			</span>
			<div class="grid gap-1">
				<h2 class="text-base font-semibold text-fg">Schedule workspace</h2>
				<p class="text-sm leading-6 text-fg-muted">
					Sales and purchases lists will be grouped by validation status.
				</p>
			</div>
		</Card>
		<Card class="flex items-start gap-3">
			<span
				class="grid size-9 shrink-0 place-items-center rounded-md bg-warn-soft text-warn"
				aria-hidden="true"
			>
				<ClockCircle size={18} color="currentColor" />
			</span>
			<div class="grid gap-1">
				<h2 class="text-base font-semibold text-fg">Not ready for filing</h2>
				<p class="text-sm leading-6 text-fg-muted">
					Continue using eBIRForms for available taxpayer workflows.
				</p>
			</div>
		</Card>
	</div>

	<nav class="grid w-full gap-2 sm:flex" aria-label="VAT Relief navigation">
		<ButtonLink href={resolve('/ebirforms/taxpayers')} size="touch" class="w-full sm:w-auto">
			Open eBIRForms
			<ArrowRight size={16} color="currentColor" />
		</ButtonLink>
		<ButtonLink href={resolve('/')} variant="secondary" size="touch" class="w-full sm:w-auto">
			Back to suite
		</ButtonLink>
	</nav>
</Page>
