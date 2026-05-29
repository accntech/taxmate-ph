<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge, ButtonLink, Card, Page, PageHeader } from '$lib/components/ui';
	import ArrowRight from '@solar-icons/svelte/category/arrows/Linear/ArrowRight.svelte';
	import LockKeyhole from '@solar-icons/svelte/category/security/Linear/LockKeyhole.svelte';
	import ClockCircle from '@solar-icons/svelte/category/time/Linear/ClockCircle.svelte';
	import UsersGroupRounded from
		'@solar-icons/svelte/category/users/Linear/UsersGroupRounded.svelte';
</script>

<svelte:head>
	<title>Alphalist | TaxMate PH</title>
	<meta
		name="description"
		content="Alphalist is coming soon in the mobile-first BIR suite."
	/>
</svelte:head>

<Page size="md" class="place-items-start">
	<PageHeader
		eyebrow="Planned workspace"
		title="Alphalist"
		description="Withholding tax alphalist preparation is planned for this kit. The workspace stays visible so teams know it belongs in the suite before filing tools are enabled."
	>
		{#snippet icon()}
			<UsersGroupRounded size={23} color="currentColor" />
		{/snippet}
		{#snippet actions()}
			<Badge tone="warn">
				<LockKeyhole size={15} color="currentColor" />
				Unavailable
			</Badge>
		{/snippet}
	</PageHeader>

	<Card class="grid gap-4">
		<div class="flex items-start gap-3">
			<span
				class="grid size-9 shrink-0 place-items-center rounded-md bg-warn-soft text-warn"
				aria-hidden="true"
			>
				<ClockCircle size={18} color="currentColor" />
			</span>
			<div class="grid gap-1">
				<h2 class="text-base font-semibold text-fg">Not ready for filing work</h2>
				<p class="text-sm leading-6 text-fg-muted">
					Use eBIRForms for available taxpayer workflows while this module is being shaped.
				</p>
			</div>
		</div>

		<nav class="grid gap-2 sm:flex" aria-label="Alphalist navigation">
			<ButtonLink href={resolve('/ebirforms/taxpayers')} size="touch" class="w-full sm:w-auto">
				Open eBIRForms
				<ArrowRight size={16} color="currentColor" />
			</ButtonLink>
			<ButtonLink
				href={resolve('/')}
				variant="secondary"
				size="touch"
				class="w-full sm:w-auto"
			>
				Back to suite
			</ButtonLink>
		</nav>
	</Card>
</Page>
