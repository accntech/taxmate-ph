<script lang="ts">
	import { onMount } from 'svelte';
	import Form1601EQ from '$lib/forms/form-1601-eq.svelte';
	import { ebirformsWorkspace as workspace } from '$lib/ebirforms/ebirforms-workspace.svelte';
	import {
		Badge,
		Button,
		ButtonLink,
		Card,
		Input,
		Page,
		PageHeader,
		Select,
		Textarea
	} from '$lib/components/ui';
	import ArchiveCheck from '@solar-icons/svelte/category/notes/Linear/ArchiveCheck.svelte';
	import CheckCircle from '@solar-icons/svelte/category/ui/Linear/CheckCircle.svelte';
	import ClipboardList from '@solar-icons/svelte/category/notes/Linear/ClipboardList.svelte';
	import FileSend from '@solar-icons/svelte/category/files/Linear/FileSend.svelte';
	import SendSquare from '@solar-icons/svelte/category/arrows-action/Linear/SendSquare.svelte';
	import UploadSquare from '@solar-icons/svelte/category/arrows-action/Linear/UploadSquare.svelte';

	let { params } = $props();
	let formsHref = $derived(`/ebirforms/taxpayers/${params.id}/forms`);

	const submissionModeOptions = [
		{ value: 'dry_run', label: 'Dry run', meta: 'write local files only' },
		{ value: 'legacy_sftp', label: 'Legacy SFTP helper', meta: 'use extracted helper' }
	];

	onMount(() => {
		void workspace.loadTaxpayerProfiles().then(() => workspace.selectTaxpayerProfile(params.id));
	});

	function submitCurrentReturn(event: SubmitEvent) {
		event.preventDefault();
		void workspace.submitCurrentReturn();
	}
</script>

<svelte:head>
	<title>{params.formCode} | eBIRForms</title>
</svelte:head>

<Page size="xl" class="pb-28 lg:pb-8">
	<ButtonLink href={formsHref} variant="ghost" size="sm" class="w-fit">
		Back to forms
	</ButtonLink>

	<PageHeader
		eyebrow="Step 3"
		title={`Prepare BIR Form ${params.formCode}`}
		description={`${workspace.profile.taxpayerName || 'Selected taxpayer'} can complete the form, save a draft, mark a final copy, then submit or export from the action area below.`}
	>
		{#snippet icon()}
			<ClipboardList size={22} color="currentColor" />
		{/snippet}
		{#snippet actions()}
			<div class="hidden gap-2 lg:flex">
				<Button
					variant="secondary"
					disabled={workspace.isSavingDraft}
					onclick={() => void workspace.saveDraft()}
				>
					<ArchiveCheck size={18} color="currentColor" />
					{workspace.isSavingDraft ? 'Saving...' : 'Save draft'}
				</Button>
				<Button variant="warn" onclick={() => workspace.markFinalCopy()}>
					<CheckCircle size={18} color="currentColor" />
					Mark final
				</Button>
			</div>
		{/snippet}
	</PageHeader>

	<Card variant="muted" class="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
		<div>
			<p class="text-sm font-semibold text-fg">Current status</p>
			<p class="text-sm text-fg-muted">{workspace.statusMessage}</p>
		</div>
		<Badge tone={workspace.finalFlag === 'Y' ? 'success' : 'neutral'} class="font-mono">
			txtFinalFlag={workspace.finalFlag}
		</Badge>
	</Card>

	{#if workspace.selectedForm}
		<Card class="grid gap-3">
			<div class="flex items-center gap-2">
				<FileSend size={18} color="currentColor" />
				<h2 class="text-lg font-semibold text-fg">Fill return fields</h2>
			</div>
			<Form1601EQ definition={workspace.selectedForm} bind:values={workspace.formValues} />
		</Card>
	{/if}

	<Card class="grid gap-4">
		<div class="flex items-start gap-3">
			<span
				class="grid size-9 shrink-0 place-items-center rounded-md bg-bg-elev-2 text-accent"
				aria-hidden="true"
			>
				<SendSquare size={19} color="currentColor" />
			</span>
			<div>
				<h2 class="text-lg font-semibold text-fg">Savefile and submission</h2>
				<p class="mt-1 max-w-3xl text-sm leading-6 text-fg-muted">
					Dry run writes the legacy savefile and email-named RDO copy without contacting BIR.
					Legacy SFTP uses the extracted helper only when explicitly selected.
				</p>
			</div>
		</div>

		<div class="grid gap-4 lg:grid-cols-2">
			<div class="grid gap-4">
				<form class="grid gap-4" onsubmit={submitCurrentReturn}>
					<div class="grid gap-3 md:grid-cols-3">
						<Select
							label="Mode"
							options={submissionModeOptions}
							bind:value={workspace.submissionMode}
						/>
						<Input label="TIN" readonly value={workspace.activeTin} class="font-mono" />
						<Input
							label="Return file"
							readonly
							value={workspace.returnFilename}
							class="font-mono"
						/>
					</div>

					{#if workspace.submissionMode === 'legacy_sftp'}
						<Card variant="muted" class="text-sm font-medium text-fg-muted">
							Direct dispatcher settings are loaded from BIR during submission.
						</Card>
					{/if}

					<Button
						variant="primary"
						size="touch"
						type="submit"
						disabled={workspace.isSubmitting}
						class="w-full sm:w-fit"
					>
						<SendSquare size={18} color="currentColor" />
						{workspace.isSubmitting ? 'Submitting...' : 'Submit return'}
					</Button>
				</form>

				{#if workspace.submissionReceipt}
					<Card variant="muted" class="grid gap-2 text-sm">
						<p class="font-semibold text-fg">Receipt: {workspace.submissionReceipt.status}</p>
						<p class="text-fg-muted">Final flag: {workspace.submissionReceipt.finalFlag}</p>
						<p class="break-all font-mono text-fg-muted">
							Savefile: {workspace.submissionReceipt.savePath}
						</p>
						<p class="break-all font-mono text-fg-muted">
							RDO copy: {workspace.submissionReceipt.sendPath}
						</p>
						{#if workspace.submissionReceipt.logPath}
							<p class="break-all font-mono text-fg-muted">
								Log: {workspace.submissionReceipt.logPath}
							</p>
						{/if}
						{#if workspace.submissionReceipt.dispatcherUrl}
							<p class="break-all font-mono text-fg-muted">
								Dispatcher: {workspace.submissionReceipt.dispatcherUrl}
							</p>
						{/if}
					</Card>
				{/if}
			</div>

			<div class="grid gap-3">
				<div class="flex flex-wrap gap-2">
					<Button variant="secondary" size="touch" onclick={() => workspace.markFinalCopy()}>
						<CheckCircle size={18} color="currentColor" />
						Mark final copy
					</Button>
					<Button variant="secondary" size="touch" onclick={() => workspace.markNeedsResend()}>
						<UploadSquare size={18} color="currentColor" />
						Mark for resend
					</Button>
				</div>
				<Textarea
					label="Generated legacy pseudo-XML"
					readonly
					value={workspace.generatedXml}
					class="min-h-56 bg-bg-elev-2 font-mono text-xs"
				/>
				<Textarea
					label="Import pseudo-XML"
					bind:value={workspace.importBuffer}
					class="min-h-36 font-mono text-xs"
				/>
				<Button
					variant="warn"
					size="touch"
					class="w-full sm:w-fit"
					onclick={() => workspace.importLegacyXml()}
				>
					<UploadSquare size={18} color="currentColor" />
					Import into form
				</Button>
			</div>
		</div>
	</Card>

	<div
		class={[
			'fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg-elev/95 p-3',
			'shadow-[0_-12px_28px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden'
		]}
	>
		<div class="mx-auto grid max-w-3xl grid-cols-2 gap-2">
			<Button
				variant="secondary"
				size="touch"
				disabled={workspace.isSavingDraft}
				onclick={() => void workspace.saveDraft()}
			>
				<ArchiveCheck size={18} color="currentColor" />
				{workspace.isSavingDraft ? 'Saving...' : 'Save'}
			</Button>
			<Button variant="warn" size="touch" onclick={() => workspace.markFinalCopy()}>
				<CheckCircle size={18} color="currentColor" />
				Final
			</Button>
		</div>
	</div>
</Page>
