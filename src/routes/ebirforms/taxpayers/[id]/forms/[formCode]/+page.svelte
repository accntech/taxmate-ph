<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { styles } from './return.styles';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { corporateFieldLabel, getCorporateIncomeForm } from '$lib/forms/corporate-income';
	import type CorporateEditor from '$lib/forms/corporate-income/corporate-editor.svelte';
	import { getIndividualIncomeForm } from '$lib/forms/individual-income';
	import type WithholdingEditor from '$lib/forms/withholding-editor.svelte';
	import { getWithholdingDefinition } from '$lib/forms/withholding-definitions';
	import Form0605Editor from '$lib/forms/form-0605/form-0605-editor.svelte';
	import Form0619Editor from '$lib/forms/form-0619/form-0619-editor.svelte';
	import Form1601EQ from '$lib/forms/form-1601-eq/form-1601-eq.svelte';
	import FormSkeleton from '$lib/forms/form-skeleton.svelte';
	import ReturnErrors from '$lib/forms/return-errors.svelte';
	import ReturnTaxpayerInformation from '$lib/forms/return-taxpayer-information.svelte';
	import { ebirformsWorkspace as workspace } from '$lib/ebirforms/ebirforms-workspace.svelte';
	import { Badge, Button, ButtonLink, Page } from '$lib/components/ui';

	let { params } = $props();
	let ready = $state(false);
	let recordError = $state('');
	let corporateEditor = $state<ReturnType<typeof CorporateEditor>>();
	let withholdingEditor = $state<ReturnType<typeof WithholdingEditor>>();
	const corporateForm = $derived(getCorporateIncomeForm(params.formCode));
	const incomeForm = $derived(getIndividualIncomeForm(params.formCode));
	const withholdingDefinition = $derived(getWithholdingDefinition(params.formCode));
	const editorModule = $derived.by(() => {
		if (corporateForm) {
			return import('$lib/forms/corporate-income/corporate-editor.svelte')
				.then(({ default: Component }) => ({ kind: 'corporate' as const, Component }));
		}
		if (incomeForm) {
			return import('$lib/forms/individual-income/income-editor.svelte')
				.then(({ default: Component }) => ({ kind: 'income' as const, Component }));
		}
		if (withholdingDefinition && !['1601EQ', '0605', '0619E', '0619F'].includes(params.formCode)) {
			return import('$lib/forms/withholding-editor.svelte')
				.then(({ default: Component }) => ({ kind: 'withholding' as const, Component }));
		}
		return null;
	});
	const recordId = $derived(page.url.searchParams.get('return'));
	const busy = $derived(workspace.isSavingDraft || workspace.isSubmitting || workspace.isPersisting);
	onMount(() => {
		let mounted = true;
		void workspace.ensureReturnEditorData().then(() => {
			if (!mounted) return;
			openRequestedReturn();
			ready = true;
		});
		return () => { mounted = false; };
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
			if (!recordError && page.url.searchParams.get('validate') === 'true') workspace.validateReturn({ applyCalculations: false });
		}
	}
	async function save() {
		if (!busy && await workspace.saveActiveReturn()) {
			void goto(resolve('/ebirforms/taxpayers/[id]/forms', { id: params.id }));
		}
	}
	function cancel() {
		if (busy) return;
		void goto(resolve('/ebirforms/taxpayers/[id]/forms', { id: params.id }));
	}
</script>

<svelte:head>
	<title>{params.formCode} | eBIRForms</title>
</svelte:head>

<Page size="xl">
	<ButtonLink href={`/ebirforms/taxpayers/${params.id}/forms`} variant="ghost" size="sm" class={stylex.attrs(styles.backLink).class}>
		← Back to forms
	</ButtonLink>
	{#if !ready}
		<FormSkeleton />
	{:else if recordError}
		<p role="alert" class={stylex.attrs(styles.error).class}>{recordError}</p>
	{:else}
		{#await editorModule}
			<FormSkeleton />
		{:then editor}
			<section class="eq-workspace paper-workspace" aria-label={`BIR Form ${params.formCode} workspace`}>
				<header class="eq-header paper-status">
					<div class="eq-heading">
						<div class="eq-title-row">
							<Badge tone={workspace.currentReturnStatus === 'Submitted' ? 'success' : workspace.currentReturnStatus === 'Final' ? 'info' : 'neutral'}>
								{recordId ? workspace.currentReturnStatus : 'New draft'}
							</Badge>
							{#if recordId && workspace.hasUnsavedChanges}
								<span class="eq-muted">Unsaved changes</span>
							{/if}
						</div>
					</div>
				</header>
				{#if workspace.selectedForm}
					{#snippet taxpayerInformation()}
						<ReturnTaxpayerInformation formCode={params.formCode} values={workspace.formValues} profile={workspace.profile} taxpayerHref={`/ebirforms/taxpayers/${params.id}/edit`} />
					{/snippet}
					{#if !incomeForm && Object.keys(workspace.validationErrors).length}
						<div class="eq-errors">
							<ReturnErrors definition={workspace.selectedForm} errors={workspace.validationErrors}
								taxpayerHref={`/ebirforms/taxpayers/${params.id}/edit`} fieldLabel={corporateForm ? (id) => corporateFieldLabel(corporateForm, workspace.formValues, id) : undefined}
								onreveal={corporateEditor?.revealField ?? withholdingEditor?.revealField} />
						</div>
					{/if}
					<fieldset disabled={busy} class="eq-form-controls">
						<legend class={stylex.attrs(styles.visuallyHidden).class}>BIR form details</legend>
						{#if incomeForm && editor?.kind === 'income'}
							{#key incomeForm.code}
								<editor.Component form={incomeForm} profile={workspace.profile} values={workspace.formValues} errors={workspace.validationErrors} taxpayerHref={`/ebirforms/taxpayers/${params.id}/edit`} onvaluechange={(patch) => workspace.updateFormValues(patch)} />
							{/key}
						{:else if corporateForm && editor?.kind === 'corporate'}
							{#key `${params.formCode}:${recordId ?? ''}`}
								<editor.Component bind:this={corporateEditor} form={corporateForm} values={workspace.formValues}
									errors={workspace.validationErrors} taxpayerHref={`/ebirforms/taxpayers/${params.id}/edit`}
									onvaluechange={(patch) => workspace.updateFormValues(patch)} />
							{/key}
						{:else if workspace.selectedForm.code === '1601EQ'}
							<Form1601EQ definition={workspace.selectedForm} bind:values={workspace.formValues} errors={workspace.validationErrors} onvaluechange={(patch) => workspace.updateFormValues(patch)} {taxpayerInformation} />
						{:else if workspace.selectedForm.code === '0605'}
							<Form0605Editor values={workspace.formValues} errors={workspace.validationErrors} onvaluechange={(patch) => workspace.updateFormValues(patch)} {taxpayerInformation} />
						{:else if workspace.selectedForm.code === '0619E' || workspace.selectedForm.code === '0619F'}
							<Form0619Editor code={workspace.selectedForm.code} values={workspace.formValues} errors={workspace.validationErrors} onvaluechange={(patch) => workspace.updateFormValues(patch)} {taxpayerInformation} />
						{:else if withholdingDefinition && editor?.kind === 'withholding'}
							{#key `${params.formCode}:${recordId ?? ''}`}
								<editor.Component bind:this={withholdingEditor} definition={withholdingDefinition} values={workspace.formValues} errors={workspace.validationErrors} profile={workspace.profile} taxpayerHref={`/ebirforms/taxpayers/${params.id}/edit`} onvaluechange={(patch) => workspace.updateFormValues(patch)} />
							{/key}
						{/if}
					</fieldset>
				{/if}
				<footer class="eq-action-bar" aria-label="Return actions">
					<div class="eq-actions">
						<Button data-taxmate-agent="Save draft" data-taxmate-agent-sdk="" disabled={busy} onclick={save}>Save draft</Button>
						<Button variant="secondary" disabled={busy} onclick={cancel}>Cancel</Button>
					</div>
					<div class="eq-status" role="status">
						<span class="eq-status-dot" aria-hidden="true"></span>
						<span>{workspace.statusMessage}</span>
					</div>
				</footer>
			</section>
		{:catch}
			<p role="alert" class={stylex.attrs(styles.error).class}>The form editor could not be loaded. Return to the forms list and try again.</p>
		{/await}
	{/if}
</Page>

<style>
	.paper-status { min-height: 0; }
	@container return-workspace (max-width: 28rem) {
		.paper-workspace .eq-action-bar { gap: .375rem; padding-block: .5rem; }
		.paper-workspace .eq-actions :global(button) { min-height: 38px; }
	}
</style>
