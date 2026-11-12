<script lang="ts">
	import { onMount } from 'svelte';
	import { toast, Toaster } from '$lib/components/ui/toaster';
	import { resolve } from '$app/paths';
	import { beforeNavigate, goto } from '$app/navigation';
	import { save } from '@tauri-apps/plugin-dialog';
	import { openPath } from '@tauri-apps/plugin-opener';
	import { buildTaxpayerFormsRoute } from '$lib/apps/app-shell';
	import { ebirformsWorkspace as workspace } from '$lib/ebirforms/ebirforms-workspace.svelte';
	import type { CreatedReturn } from '$lib/ebirforms/created-returns';
	import { getReturnAmount, getReturnPeriod, getManagedTaxpayerValues } from '$lib/forms/form-runtime';
	import { getFormDefinition } from '$lib/forms';
	import FormCommand from '$lib/ebirforms/form-command.svelte';
	import { settings } from '$lib/settings.svelte';
	import { buildReturnReport } from '$lib/printing/return-report';
	import { buildPdfExportFilename, cancelPdfExport, createPdfExportClient, formatPdfExportError, type PdfExportProgress } from '$lib/tauri/pdf-export';
	import { Badge, Button, ButtonLink, Dialog, Page } from '$lib/components/ui';
	import Menu from '$lib/components/ui/menu/menu.svelte';
	import MenuItem from '$lib/components/ui/menu-item/menu-item.svelte';
	import Icon from '$lib/components/ui/icon/icon.svelte';
	import { glyphs } from '$lib/components/ui/icons';
	import RecordTable from '$lib/ebirforms/record-table.svelte';
	import { formatTinInput } from '$lib/profiles/profile';
	import AddCircle from '@solar-icons/svelte/category/ui/Linear/AddCircle.svelte';

	let { params } = $props();
	let ready = $state(false);
	let storageReady = $state(false);
	let createOpen = $state(false);
	let createError = $state('');
	let deleteId = $state('');
	let isPrinting = $state(false);
	let isGenerating = $state(false);
	let pdfProgress = $state<PdfExportProgress>({ completedSteps: 0, totalSteps: 7, stage: 'Loading print template' });
	let isCanceling = $state(false);
	let pdfJob: { id: string; submitted: boolean; canceled: boolean } | undefined;
	let generatedPdfPath = $state('');
	let errorRecordId = $state('');
	let actionErrors = $state<Record<string, string>>({});
	let submissionNotice = $state<{ message: string; error: boolean } | null>(null);
	let archivedNotice = $state<string | null>(null);
	const profile = $derived(workspace.profiles.find(profile => profile.id === params.id));
	const archived = $derived(workspace.archivedTaxpayerIds.includes(params.id));
	const busy = $derived(workspace.isSavingDraft || workspace.isSubmitting || workspace.isPersisting || isPrinting);
	const deletingRecord = $derived(workspace.createdReturns.find(record => record.id === deleteId));
	const errorRecord = $derived(workspace.createdReturns.find(record => record.id === errorRecordId));
	const columns = [
		{ key: 'form', label: 'BIR form', locked: true },
		{ key: 'period', label: 'Return period' },
		{ key: 'status', label: 'Status' },
		{ key: 'updatedAt', label: 'Last updated', numeric: true },
		{ key: 'amount', label: 'Amount due', numeric: true }
	];
	const filters = [
		{ key: 'status', label: 'Status', options: ['Draft', 'Final', 'Submitted', 'Simulated', 'For resubmission', 'Archived'].map(value => ({ value, label: value })) },
		{ key: 'form', label: 'Form type', options: workspace.forms.map(form => ({ value: form.code, label: `BIR Form ${form.code}` })) }
	];
	const rows = $derived(workspace.createdReturns.filter(record => record.taxpayerId === params.id).map(record => ({
		id: record.id, form: record.formCode, period: record.returnPeriod,
		status: record.archived ? 'Archived' : record.status, updatedAt: record.updatedAt,
		amount: getReturnAmount(record.formCode, record.values) === undefined ? '—' : Number(getReturnAmount(record.formCode, record.values)!.replaceAll(',', ''))
	})));
	function route(id: string, code: string) {
		return `${buildTaxpayerFormsRoute(params.id, code)}?return=${encodeURIComponent(id)}`;
	}
	function create(formCode: string) {
		if (busy || !profile || archived || !storageReady) return;
		createOpen = false;
		void goto(resolve('/ebirforms/taxpayers/[id]/forms/[formCode]?new=true', { id: params.id, formCode }));
	}
	function recordForAction(id: string): CreatedReturn | undefined {
		if (busy || !storageReady) return;
		return workspace.createdReturns.find(record => record.id === id && record.taxpayerId === params.id);
	}
	function clearErrors() { errorRecordId = ''; actionErrors = {}; submissionNotice = null; }
	function captureErrors(id: string) {
		errorRecordId = id;
		actionErrors = { ...workspace.validationErrors };
	}
	async function archiveForm(id: string) {
		if (recordForAction(id) && await workspace.archiveReturn(id)) { archivedNotice = id; clearErrors(); }
	}
	async function restoreForm(id: string) {
		if (recordForAction(id) && await workspace.restoreReturn(id)) archivedNotice = null;
	}
	async function deleteForm() {
		if (!recordForAction(deleteId)) return;
		if (await workspace.deleteReturn(deleteId)) {
			if (errorRecordId === deleteId) clearErrors();
			if (archivedNotice === deleteId) archivedNotice = null;
			deleteId = '';
		}
	}
	async function finalize(id: string) {
		if (!recordForAction(id) || !workspace.openReturn(id)) return;
		clearErrors();
		await workspace.markFinalCopy();
		captureErrors(id);
	}
	async function submit(id: string) {
		const record = recordForAction(id);
		if (!record || !workspace.openReturn(id)) return;
		clearErrors();
		if (record.status === 'Submitted' || record.status === 'For resubmission') {
			await workspace.markNeedsResend();
			if (workspace.finalFlag !== '2') return;
		}
		submissionNotice = { message: settings.prefs.submissionMode === 'legacy_sftp' ? 'Submitting to BIR…' : 'Preparing local package…', error: false };
		await workspace.submitCurrentReturn();
		captureErrors(id);
		submissionNotice = Object.keys(actionErrors).length ? null : {
			message: workspace.statusMessage,
			error: !workspace.submissionReceipt || workspace.submissionReceipt.status === 'failed'
		};
	}
	async function print(id: string) {
		const record = recordForAction(id);
		const definition = record && getFormDefinition(record.formCode);
		if (!record || !definition) return;
		isPrinting = true;
		const job = { id: crypto.randomUUID(), submitted: false, canceled: false };
		pdfJob = job;
		const values = { ...record.values, ...(profile ? getManagedTaxpayerValues(record.formCode, profile, record.status) : {}) };
		const paperSize = settings.prefs.paperSize;
		try {
			const suggestedFilename = buildPdfExportFilename({ formCode: record.formCode,
				period: getReturnPeriod(record.formCode, values) });
			const outputPath = await save({ defaultPath: suggestedFilename, filters: [{ name: 'PDF document', extensions: ['pdf'] }] });
			if (!outputPath) { toast.info('PDF export canceled.'); return; }
			pdfProgress = { completedSteps: 0, totalSteps: 7, stage: 'Loading print template' };
			isGenerating = true;
			const updateProgress = (progress: PdfExportProgress) => {
				if (pdfJob === job && !isCanceling && !job.canceled && progress.completedSteps >= pdfProgress.completedSteps) pdfProgress = progress;
			};
			const html = await buildReturnReport(definition, values, record.status, paperSize, (completedSteps, stage) => updateProgress({ completedSteps, totalSteps: 7, stage }));
			if (job.canceled) { toast.info('PDF export canceled.'); return; }
			updateProgress({ completedSteps: 4, totalSteps: 7, stage: 'Starting PDF renderer' });
			job.submitted = true;
			const receipt = await createPdfExportClient()({ jobId: job.id, formCode: record.formCode, paperSize,
				html, suggestedFilename, outputPath }, updateProgress);
			toast.success(`PDF saved to ${receipt.path}`);
			generatedPdfPath = receipt.path;
		} catch (error) {
			const message = formatPdfExportError(error);
			if (message === 'PDF export canceled.') toast.info(message);
			else toast.error(`PDF export failed: ${message}`);
		} finally {
			pdfJob = undefined;
			isGenerating = false;
			isCanceling = false;
			isPrinting = false;
		}
	}
	async function cancelGeneration() {
		const job = pdfJob;
		if (!job || isCanceling) return;
		isCanceling = true;
		if (!job.submitted) { job.canceled = true; return; }
		try {
			await cancelPdfExport(job.id);
		} catch (error) {
			toast.error(`Could not cancel PDF export: ${formatPdfExportError(error)}`);
			if (pdfJob === job) isCanceling = false;
		}
	}
	async function openGeneratedPdf() {
		if (!generatedPdfPath || busy) return;
		const path = generatedPdfPath;
		generatedPdfPath = '';
		isPrinting = true;
		try {
			await openPath(path);
		} catch (error) {
			toast.error(`PDF saved to ${path}, but could not open it: ${formatPdfExportError(error)}`);
		} finally { isPrinting = false; }
	}
	function date(timestamp: number) { return new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Manila' }).format(timestamp); }
	function amount(value: number) { return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value); }
	onMount(() => {
		void Promise.all([workspace.loadCreatedReturns().then(loaded => { storageReady = loaded; }), workspace.loadTaxpayerProfiles()]).then(() => {
			if (profile) workspace.selectTaxpayerProfile(params.id);
			ready = true;
		});
	});
	beforeNavigate(({ cancel }) => {
		if (busy) { toast.info('Wait for the current operation to finish before leaving.'); cancel(); }
	});
</script>

<svelte:head><title>Tax Returns | eBIRForms</title></svelte:head>
<Page size="full">
	<ButtonLink href="/ebirforms/taxpayers" variant="ghost" size="sm" class="w-fit">← Back to taxpayers</ButtonLink>
	{#if !ready}
		<p role="status" class="p-6 text-fg-muted">Loading taxpayer…</p>
	{:else if !profile}
		<div role="alert"><h1 class="text-xl font-semibold">Taxpayer not found</h1><p class="mt-2 text-sm text-fg-muted">Return to the taxpayers list and select a saved profile.</p></div>
	{:else}
		<header class="flex flex-wrap items-center justify-between gap-4 py-2">
			<div><h1 class="font-sans text-2xl font-semibold tracking-tight">Tax Returns</h1><p class="mt-1 text-sm text-fg-muted">{profile.taxpayerName} · <span class="font-mono text-xs">{formatTinInput(profile)}</span> · {rows.length} {rows.length === 1 ? 'return' : 'returns'}</p></div>
			<Button disabled={busy || archived || !storageReady} onclick={() => { createError = ''; createOpen = true; }}><AddCircle size={18} color="currentColor" />Create return</Button>
		</header>
		{#if archived}<p class="text-sm text-fg-muted">This taxpayer is archived. Restore the profile to create new returns.</p>{/if}
		{#if archivedNotice}
			<div class="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-bg-elev px-4 py-3">
				<p class="text-sm">Return archived. Use the Archived status filter to find it later.</p>
				<Button variant="secondary" size="sm" disabled={busy} onclick={() => archivedNotice && restoreForm(archivedNotice)}>Undo archive</Button>
			</div>
		{/if}
		{#if errorRecord && Object.keys(actionErrors).length}
			<div role="alert" class="rounded-md border border-danger/30 bg-bg-elev p-4 text-sm">
				<p class="font-medium">Review BIR Form {errorRecord.formCode}, {errorRecord.returnPeriod} before continuing.</p>
				<ul class="my-2 list-disc pl-5">
					{#each Object.entries(actionErrors) as [id, message] (id)}
						<li>{getFormDefinition(errorRecord.formCode)?.fields.find(field => field.id === id)?.label.replace(/^\d+[A-Z]?\s+/, '') || (id.endsWith(':overpaymentOption') ? 'Over-remittance treatment' : 'Return details')}: {message}</li>
					{/each}
				</ul>
				<ButtonLink href={`${route(errorRecord.id, errorRecord.formCode)}&validate=true`} variant="secondary" size="sm">Edit return to fix errors</ButtonLink>
			</div>
		{/if}
		{#if submissionNotice}
			<p role={submissionNotice.error ? 'alert' : 'status'} class={['rounded-md border border-border bg-bg-elev p-4 text-sm break-words', submissionNotice.error ? 'text-danger' : 'text-fg']}>
				{submissionNotice.message}
			</p>
		{/if}
		{#if !storageReady}<p role="alert" class="text-sm text-danger">{workspace.statusMessage}</p>{/if}
		<RecordTable {rows} {columns} {filters} label="Tax returns" stateKey={`forms-${params.id}`}
			initialFilters={{ status: ['Draft', 'Final', 'Submitted', 'Simulated', 'For resubmission'] }}
			emptyMessage="No returns created yet. Choose Create return to get started.">
			{#snippet cell(row, key)}
				{#if key === 'form'}<span class="font-mono font-medium text-accent">BIR Form {row.form}</span>
				{:else if key === 'status'}<Badge size="sm" tone={row.status === 'Submitted' ? 'success' : row.status === 'Final' ? 'info' : row.status === 'For resubmission' ? 'warn' : 'neutral'}>{row.status}</Badge>
				{:else if key === 'updatedAt'}<span class="whitespace-nowrap text-xs text-fg-muted">{date(Number(row.updatedAt))}</span>
				{:else if key === 'amount'}{row.amount === '—' ? '—' : amount(Number(row.amount))}
				{:else}{row[key]}{/if}
			{/snippet}
			{#snippet actions(row)}
				{#if busy || !storageReady}
					<Button variant="secondary" size="sm" disabled><span class="action-icon"><Icon icon={glyphs.pencil} /></span>Edit</Button>
				{:else}
					<ButtonLink href={route(row.id, String(row.form))} variant="secondary" size="sm"><span class="action-icon"><Icon icon={glyphs.pencil} /></span>Edit</ButtonLink>
				{/if}
				<Menu label={`More actions for BIR Form ${row.form}, ${row.period}`} tooltip="More actions" align="right" disabled={busy || !storageReady} triggerClass="form-actions-trigger" panelClass="form-actions-panel">
					{#snippet trigger()}<span class="action-icon"><Icon icon={glyphs.more} /></span>{/snippet}
					{#snippet content({ close })}
						<div class="flex flex-col">
						<p class="action-heading">BIR Form {row.form} · {row.period}</p>
						<MenuItem variant="ghost" size="compact" class="form-action" onSelect={() => { close(); row.status === 'Archived' ? restoreForm(row.id) : archiveForm(row.id); }}><span class="action-icon"><Icon icon={row.status === 'Archived' ? glyphs.refresh : glyphs.archive} /></span>{row.status === 'Archived' ? 'Restore' : 'Archive'}</MenuItem>
						<MenuItem variant="ghost" size="compact" class="form-action" onSelect={() => { close(); finalize(row.id); }}><span class="action-icon"><Icon icon={glyphs.checkCircle} /></span>Mark as final</MenuItem>
						<MenuItem variant="ghost" size="compact" class="form-action" disabled={settings.prefs.submissionMode === 'legacy_sftp' && row.form !== '1601EQ'} onSelect={() => { close(); void submit(row.id); }}><span class="action-icon"><Icon icon={glyphs.send} /></span>{settings.prefs.submissionMode === 'legacy_sftp' ? 'Submit to BIR' : 'Prepare locally'}</MenuItem>
						<MenuItem variant="ghost" size="compact" class="form-action" onSelect={() => { close(); void print(row.id); }}><span class="action-icon"><Icon icon={glyphs.printer} /></span>Generate PDF</MenuItem>
						<div class="action-separator" role="separator"></div>
						<MenuItem variant="destructive-ghost" size="compact" class="form-action" onSelect={() => { close(); deleteId = row.id; }}><span class="action-icon"><Icon icon={glyphs.trash} /></span>Delete…</MenuItem>
						</div>
					{/snippet}
				</Menu>
			{/snippet}
		</RecordTable>
	{/if}
</Page>
<Dialog bind:open={createOpen} layout="command" size="xl" hideCloseButton title="Create a tax return" description={`Choose the form type for a new return for ${profile?.taxpayerName || 'this taxpayer'}.`}>
	{#if createOpen}
		<FormCommand forms={workspace.forms} taxpayerName={profile?.taxpayerName} status={createError} disabled={busy || !profile || archived || !storageReady} onselect={create} oncancel={() => createOpen = false} />
	{/if}
</Dialog>
<Dialog open={!!deleteId} onOpenChange={(open) => { if (!open) deleteId = ''; }} title="Delete return?"
	description={`Delete BIR Form ${deletingRecord?.formCode || ''}, ${deletingRecord?.returnPeriod || ''}? This removes the working copy permanently. Submitted return history is kept.`}>
	<p class="text-sm text-fg-muted">{workspace.statusMessage}</p>
	{#snippet footer()}
		<Button variant="secondary" onclick={() => deleteId = ''}>Cancel</Button>
		<Button variant="danger" disabled={busy || !storageReady} onclick={deleteForm}>Delete return</Button>
	{/snippet}
</Dialog>
<Toaster />
<Dialog open={isGenerating} title="Generating PDF" description={isCanceling ? 'Canceling PDF generation…' : 'Please wait while your tax return is prepared.'}
	closedByBackdrop={false} closedByEscape={false} hideCloseButton>
	{#if isGenerating}
		<div role="progressbar" aria-label="PDF generation progress" aria-valuetext={isCanceling ? 'Stopping the export…' : pdfProgress.stage} class="pdf-progress mt-1 h-1.5 overflow-hidden rounded-full bg-bg-hover">
			<span class="pdf-progress-indicator block h-full rounded-full bg-accent"></span>
		</div>
	{/if}
	<p role="status" class="mt-3 text-sm text-fg-muted">{isCanceling ? 'Stopping the export…' : pdfProgress.stage}</p>
	{#snippet footer()}
		<Button variant="secondary" disabled={isCanceling} onclick={cancelGeneration}>{isCanceling ? 'Canceling…' : 'Cancel'}</Button>
	{/snippet}
</Dialog>
<Dialog open={!!generatedPdfPath} onOpenChange={(open) => { if (!open) generatedPdfPath = ''; }} title="Open generated PDF?"
	description="Your PDF has been saved. Open it in your default PDF viewer?">
	<p class="break-all text-sm text-fg-muted">{generatedPdfPath}</p>
	{#snippet footer()}
		<Button variant="secondary" onclick={() => generatedPdfPath = ''}>Not now</Button>
		<Button disabled={busy} onclick={openGeneratedPdf}>Open PDF</Button>
	{/snippet}
</Dialog>

<style>
	.pdf-progress-indicator { width: 40%; animation: pdf-activity 1.4s ease-in-out infinite; }
	@keyframes pdf-activity {
		from { transform: translateX(-100%); }
		to { transform: translateX(350%); }
	}
	@media (prefers-reduced-motion: reduce) {
		.pdf-progress-indicator { animation: none; margin-inline: auto; }
	}

	:global(.form-actions-trigger) { min-width: 1.875rem; min-height: 1.875rem; padding: .375rem; background: var(--bg); color: var(--fg-muted); }
	:global(.form-actions-panel) { min-width: 12.5rem; max-width: calc(100vw - 1rem); }
	.action-icon { display: block; flex: none; width: 1rem; height: 1rem; }
	.action-heading { max-width: 15rem; padding: .375rem .625rem; color: var(--fg-subtle); font-size: 10.5px; font-weight: 600; text-transform: uppercase; overflow-wrap: anywhere; }
	:global(.form-action) { width: 100%; min-height: 2rem; justify-content: flex-start; gap: .5rem; padding: .375rem .625rem; font-size: 12.5px; font-weight: 400; }
	.action-separator { height: 1px; margin: .25rem 0; background: var(--border-soft); }
</style>
