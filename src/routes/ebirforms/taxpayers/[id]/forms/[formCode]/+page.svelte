<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import Form1601EQ from '$lib/forms/form-1601-eq.svelte';
	import ReturnErrors from '$lib/forms/return-errors.svelte';
	import { ebirformsWorkspace as workspace } from '$lib/ebirforms/ebirforms-workspace.svelte';
	import { Badge, Button, ButtonLink, Page } from '$lib/components/ui';

	let { params } = $props();
	let ready = $state(false);
	let recordError = $state('');
	const recordId = $derived(page.url.searchParams.get('return'));
	const busy = $derived(workspace.isSavingDraft || workspace.isSubmitting);
	onMount(() => {
		workspace.loadCreatedReturns();
		void workspace.loadTaxpayerProfiles().then(() => { ready = true; openRequestedReturn(); });
	});
	afterNavigate(() => { if (ready) openRequestedReturn(); });
	beforeNavigate(({ cancel }) => {
		if (busy) {
			workspace.statusMessage = 'Wait for the current operation to finish before leaving.';
			cancel();
		} else {
			workspace.discardReturnChanges();
		}
	});
	function openRequestedReturn() {
		if (!recordId && page.url.searchParams.get('new') === 'true') {
			recordError = workspace.createReturn(params.id, params.formCode) ? '' : workspace.statusMessage;
			return;
		}
		const record = workspace.createdReturns.find(item => item.id === recordId);
		if (!record || record.taxpayerId !== params.id || record.formCode !== params.formCode) {
			recordError = 'Choose a saved form from this taxpayer’s forms list, or create a new form there.';
		} else {
			recordError = workspace.openReturn(record.id) ? '' : workspace.statusMessage;
		}
	}
	function save() {
		if (!busy && workspace.validateReturn({ applyCalculations: false }) && workspace.saveActiveReturn()) {
			void goto(`/ebirforms/taxpayers/${params.id}/forms`);
		}
	}
	function cancel() {
		if (busy) return;
		void goto(`/ebirforms/taxpayers/${params.id}/forms`);
	}
</script>

<svelte:head>
	<title>{params.formCode} | eBIRForms</title>
</svelte:head>

<Page size="xl">
	<ButtonLink href={`/ebirforms/taxpayers/${params.id}/forms`} variant="ghost" size="sm" class="w-fit">
		← Back to forms
	</ButtonLink>
	{#if !ready}
		<p role="status">Loading saved form…</p>
	{:else if recordError}
		<p role="alert" class="text-sm text-danger">{recordError}</p>
	{:else}
		<section class="eq-workspace" aria-label="BIR Form 1601EQ workspace">
			<header class="eq-header">
				<div class="eq-heading">
					<div class="eq-title-row">
						<h1>BIR Form {params.formCode}</h1>
						<Badge tone={workspace.currentReturnStatus === 'Submitted' ? 'success' : workspace.currentReturnStatus === 'Final' ? 'info' : 'neutral'}>
							{workspace.currentReturnStatus}
						</Badge>
						{#if workspace.hasUnsavedChanges}
							<span class="eq-muted">Unsaved changes</span>
						{/if}
					</div>
					<p class="eq-description">Quarterly expanded withholding tax</p>
				</div>
			</header>
			{#if workspace.selectedForm}
				{#if Object.keys(workspace.validationErrors).length}
					<div class="eq-errors">
						<ReturnErrors definition={workspace.selectedForm} errors={workspace.validationErrors} taxpayerHref={`/ebirforms/taxpayers/${params.id}/edit`} />
					</div>
				{/if}
				<fieldset disabled={busy} class="eq-form-controls">
					<legend class="sr-only">BIR form details</legend>
					<Form1601EQ definition={workspace.selectedForm} bind:values={workspace.formValues} errors={workspace.validationErrors} onvaluechange={(patch) => workspace.updateFormValues(patch)} />
				</fieldset>
			{/if}
			<footer class="eq-action-bar" aria-label="Return actions">
				<div class="eq-actions">
					<Button disabled={busy} onclick={save}>Save</Button>
					<Button variant="secondary" disabled={busy} onclick={cancel}>Cancel</Button>
				</div>
				<div class="eq-status" role="status">
					<span class="eq-status-dot" aria-hidden="true"></span>
					<span>{workspace.statusMessage}</span>
				</div>
			</footer>
		</section>
	{/if}
</Page>
