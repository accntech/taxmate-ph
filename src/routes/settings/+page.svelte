<script lang="ts">
	import { Badge, Button, Card, Dialog, Input, Page, PageHeader, Select } from '$lib/components/ui';
	import { settings, type FilingPeriod, type PaperSize } from '$lib/settings.svelte';
	import { createSubmissionLogClient, formatSubmissionError, formatSubmissionLog, type SubmissionLog } from '$lib/tauri/submission';
	import { isTauri } from '@tauri-apps/api/core';
	import Settings from '@solar-icons/svelte/category/settings/Linear/Settings.svelte';
	import Palette from '@solar-icons/svelte/category/tools/Linear/Palette.svelte';
	import Printer from '@solar-icons/svelte/category/devices/Linear/Printer.svelte';
	import Database from '@solar-icons/svelte/category/ui/Linear/Database.svelte';
	import InfoCircle from '@solar-icons/svelte/category/ui/Linear/InfoCircle.svelte';
	import TrashBin from '@solar-icons/svelte/category/ui/Linear/TrashBinMinimalistic.svelte';
	import Copy from '@solar-icons/svelte/category/ui/Linear/Copy.svelte';
	import type { Snippet, Component } from 'svelte';

	const appVersion = '0.1.0';

	const themeOptions = [
		{ value: 'light', label: 'Light' },
		{ value: 'system', label: 'System' },
		{ value: 'dark', label: 'Dark' }
	] as const;

	const sidebarOptions = [
		{ value: 'expanded', label: 'Expanded' },
		{ value: 'collapsed', label: 'Collapsed' }
	] as const;

	const paperOptions: { value: PaperSize; label: string; meta: string }[] = [
		{ value: 'a4', label: 'A4', meta: '210 × 297 mm' },
		{ value: 'letter', label: 'Letter', meta: '8.5 × 11 in' },
		{ value: 'long', label: 'Long / Folio', meta: '8.5 × 13 in' }
	];

	const periodOptions: { value: FilingPeriod; label: string; meta: string }[] = [
		{ value: 'monthly', label: 'Monthly', meta: 'e.g. 2550M' },
		{ value: 'quarterly', label: 'Quarterly', meta: 'e.g. 2550Q' },
		{ value: 'annual', label: 'Annual', meta: 'e.g. 1701' }
	];

	const birLinks = [
		{ label: 'eBIRForms — official BIR page', href: 'https://www.bir.gov.ph/eservices/ebirforms' },
		{ label: 'Bureau of Internal Revenue', href: 'https://www.bir.gov.ph' }
	];

	let taxpayerName = $state(settings.prefs.defaultTaxpayer);
	let resetOpen = $state(false);
	let logOpen = $state(false);
	let logLoading = $state(false);
	let submissionLog = $state<SubmissionLog | null>(null);
	let logError = $state('');
	let logCopied = $state(false);
	let logCopying = $state(false);
	let logCopyError = $state('');
	const logContent = $derived(formatSubmissionLog(submissionLog?.content ?? ''));

	async function copySubmissionLog() {
		logCopied = false;
		logCopyError = '';
		logCopying = true;
		try {
			await navigator.clipboard.writeText(logContent);
			logCopied = true;
		} catch {
			logCopyError = 'Could not copy the log. Select the text and copy it manually.';
		} finally {
			logCopying = false;
		}
	}

	async function loadSubmissionLog() {
		if (logLoading) return;
		logError = '';
		logCopied = false;
		logCopyError = '';
		submissionLog = null;
		if (!isTauri()) {
			logError = 'Submission logs are available in the desktop app.';
			return;
		}
		logLoading = true;
		try {
			submissionLog = await createSubmissionLogClient()();
		} catch (error) {
			logError = `Could not read the submission log: ${formatSubmissionError(error)}`;
		} finally {
			logLoading = false;
		}
	}

	function toggleSubmissionLog() {
		logOpen = !logOpen;
		if (logOpen) void loadSubmissionLog();
	}

	const themeNote = $derived(
		settings.themeMode === 'system'
			? `Following your operating system — currently ${settings.resolvedTheme}.`
			: `Always ${settings.themeMode}, ignoring system changes.`
	);

	function confirmReset() {
		settings.resetToDefaults();
		taxpayerName = settings.prefs.defaultTaxpayer;
		resetOpen = false;
	}
</script>

{#snippet sectionTitle(label: string, desc: string, Icon: Component<{ size?: number; color?: string }>)}
	<div class="flex items-start gap-3 border-b border-border-soft pb-3">
		<span
			class="grid size-8 shrink-0 place-items-center rounded-md bg-accent-soft text-accent"
			aria-hidden="true"
		>
			<Icon size={17} color="currentColor" />
		</span>
		<div class="min-w-0">
			<h2 class="text-base font-semibold tracking-tight text-fg">{label}</h2>
			<p class="mt-0.5 text-sm text-fg-muted">{desc}</p>
		</div>
	</div>
{/snippet}

{#snippet row(label: string, desc: string, control: Snippet, last = false)}
	<div
		class={[
			'grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6',
			!last && 'border-b border-border-soft'
		]}
	>
		<div class="min-w-0">
			<p class="text-sm font-medium text-fg">{label}</p>
			<p class="mt-0.5 text-[13px] leading-5 text-fg-muted">{desc}</p>
		</div>
		<div class="sm:justify-self-end">
			{@render control()}
		</div>
	</div>
{/snippet}

{#snippet segmented(active: boolean, onclick: () => void, label: string)}
	<button
		type="button"
		aria-pressed={active}
		{onclick}
		class={[
			'min-h-8 rounded-sm px-3 text-sm font-medium outline-none',
			'transition-[color,background-color,box-shadow] duration-150 focus-visible:shadow-[0_0_0_3px_var(--ring)]',
			active ? 'bg-bg-elev text-fg shadow-sm' : 'text-fg-muted hover:text-fg'
		]}
	>
		{label}
	</button>
{/snippet}

{#snippet themeControl()}
	<div class="grid gap-1.5 sm:justify-items-end">
		<div
			role="group"
			aria-label="Theme mode"
			class="inline-flex rounded-md border border-border bg-bg-elev-2 p-0.5"
		>
			{#each themeOptions as option (option.value)}
				{@render segmented(
					settings.themeMode === option.value,
					() => settings.setThemeMode(option.value),
					option.label
				)}
			{/each}
		</div>
		<p class="text-xs text-fg-subtle">{themeNote}</p>
	</div>
{/snippet}

{#snippet sidebarControl()}
	<div
		role="group"
		aria-label="Sidebar default"
		class="inline-flex rounded-md border border-border bg-bg-elev-2 p-0.5"
	>
		{#each sidebarOptions as option (option.value)}
			{@render segmented(
				(option.value === 'collapsed') === settings.sidebarCollapsed,
				() => settings.setSidebarCollapsed(option.value === 'collapsed'),
				option.label
			)}
		{/each}
	</div>
{/snippet}

{#snippet paperControl()}
	<Select
		value={settings.prefs.paperSize}
		options={paperOptions}
		onchange={(value) => settings.updatePrefs({ paperSize: value })}
		class="w-56"
	/>
{/snippet}

{#snippet periodControl()}
	<Select
		value={settings.prefs.filingPeriod}
		options={periodOptions}
		onchange={(value) => settings.updatePrefs({ filingPeriod: value })}
		class="w-56"
	/>
{/snippet}

{#snippet taxpayerControl()}
	<Input
		bind:value={taxpayerName}
		placeholder="None"
		class="w-56"
		onblur={() => settings.updatePrefs({ defaultTaxpayer: taxpayerName.trim() })}
	/>
{/snippet}

{#snippet sendingControl()}
	<div role="group" aria-label="Sending mode" class="inline-flex rounded-md border border-border bg-bg-elev-2 p-0.5">
		{@render segmented(settings.prefs.submissionMode === 'legacy_sftp', () => settings.updatePrefs({ submissionMode: 'legacy_sftp' }), 'Send to BIR')}
		{@render segmented(settings.prefs.submissionMode === 'dry_run', () => settings.updatePrefs({ submissionMode: 'dry_run' }), 'Prepare locally')}
	</div>
{/snippet}

{#snippet storageControl()}
	<Badge tone="success"><InfoCircle size={13} color="currentColor" />On this device only</Badge>
{/snippet}

{#snippet submissionLogControl()}
	<Button variant="secondary" aria-expanded={logOpen} aria-controls="submission-log" onclick={toggleSubmissionLog}>
		{logOpen ? 'Hide submission log' : 'View submission log'}
	</Button>
{/snippet}

{#snippet resetControl()}
	<Button variant="secondary" onclick={() => (resetOpen = true)}>
		<TrashBin size={16} color="currentColor" />
		Reset preferences
	</Button>
{/snippet}

<svelte:head>
	<title>Settings · TaxMate PH</title>
	<meta name="description" content="Appearance, defaults, data, and app information for TaxMate PH." />
</svelte:head>

<Page size="md">
	<PageHeader
		eyebrow="Preferences"
		title="Settings"
		description="Tune how TaxMate PH looks and behaves. Everything here is stored locally on this device."
	>
		{#snippet icon()}
			<Settings size={22} color="currentColor" />
		{/snippet}
	</PageHeader>

	<Card variant="panel" padding="lg" class="grid gap-1">
		{@render sectionTitle('Appearance', 'Theme and layout of the workspace.', Palette)}
		{@render row('Theme', 'Light, dark, or match your system appearance.', themeControl)}
		{@render row('Sidebar', 'Show the full navigation rail or a compact icon rail.', sidebarControl, true)}
	</Card>

	<Card variant="panel" padding="lg" class="grid gap-1">
		{@render sectionTitle('Defaults', 'Pre-filled values when you start new work.', Printer)}
		{@render row('Paper size', 'Default page size for printouts and PDF exports.', paperControl)}
		{@render row('Filing period', 'Suggested period when preparing a new return.', periodControl)}
		{@render row('Default taxpayer', 'Selected first when you open a workspace.', taxpayerControl, true)}
	</Card>

	<Card variant="panel" padding="lg" class="grid gap-1">
		{@render sectionTitle('Sending', 'BIR submission is available for Form 1601-EQ first.', Settings)}
		{@render row('Sending mode', 'Send to BIR uploads the return. Prepare locally saves a package on this device without sending it.', sendingControl, true)}
		<p class="pb-2 text-[13px] leading-5 text-fg-muted">Server settings are retrieved automatically from the BIR dispatcher when sending.</p>
		{@render row('Submission log', 'Review saved preparation, connection, and upload results on this device.', submissionLogControl, true)}
		{#if logOpen}
			<section id="submission-log" aria-labelledby="submission-log-title" class="min-w-0 border-t border-border-soft py-4">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<h3 id="submission-log-title" class="text-sm font-semibold text-fg">Submission log</h3>
					<Button variant="secondary" size="sm" disabled={logLoading} onclick={() => void loadSubmissionLog()}>Refresh log</Button>
				</div>
				<p class="mt-2 text-[13px] leading-5 text-fg-muted">Upload success does not confirm BIR receipt or acceptance.</p>
				{#if logLoading}
					<p role="status" class="mt-3 text-sm text-fg-muted">Loading submission log…</p>
				{:else if logError}
					<p role="alert" class="mt-3 text-sm text-danger">{logError}</p>
				{:else if submissionLog}
					<p class="mt-3 break-all text-xs leading-5 text-fg-subtle">{submissionLog.path}</p>
					{#if submissionLog.truncated}
						<p class="mt-2 text-xs text-fg-muted">Showing the latest 128 KiB. Earlier entries remain in the log file.</p>
					{/if}
					{#if submissionLog.content}
						<div class="relative mt-3">
							<div class="absolute right-2 top-2">
								<Button variant="secondary" size="sm" aria-label="Copy log" disabled={logCopying} onclick={() => void copySubmissionLog()}>
									<Copy size={14} color="currentColor" aria-hidden="true" />
									{logCopying ? 'Copying…' : logCopied ? 'Copied' : 'Copy log'}
								</Button>
							</div>
							<textarea readonly rows="12" aria-label="Log entries" value={logContent} class="block w-full resize-y rounded-md border border-border bg-bg-elev-2 p-3 pt-14 font-mono text-xs leading-5 text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"></textarea>
						</div>
						{#if logCopied}
							<p role="status" class="sr-only">Log copied to clipboard.</p>
						{/if}
						{#if logCopyError}
							<p role="alert" class="mt-2 text-sm text-danger">{logCopyError}</p>
						{/if}
					{:else}
						<p role="status" class="mt-3 text-sm text-fg-muted">No submission log entries yet. Prepare or submit a return to create an entry.</p>
					{/if}
				{/if}
			</section>
		{/if}
	</Card>

	<Card variant="panel" padding="lg" class="grid gap-1">
		{@render sectionTitle('Data & storage', 'Where your information lives.', Database)}
		{@render row(
			'Local-first',
			'Preferences and working copies are stored on this device. Returns are sent to BIR when you submit them.',
			storageControl
		)}
		{@render row(
			'Reset preferences',
			'Restore theme, sidebar, sending mode, and defaults to their original values.',
			resetControl,
			true
		)}
	</Card>

	<Card variant="panel" padding="lg" class="grid gap-1">
		{@render sectionTitle('About', 'App information and references.', InfoCircle)}

		<div class="grid gap-3 py-4 sm:grid-cols-2">
			<div class="flex items-center justify-between gap-3 sm:block">
				<span class="text-[13px] text-fg-muted">Application</span>
				<p class="font-medium text-fg sm:mt-0.5">TaxMate PH</p>
			</div>
			<div class="flex items-center justify-between gap-3 sm:block">
				<span class="text-[13px] text-fg-muted">Version</span>
				<p class="font-mono text-sm tabular-nums text-fg sm:mt-0.5">v{appVersion}</p>
			</div>
		</div>

		<p class="border-t border-border-soft pt-4 text-[13px] leading-6 text-fg-muted">
			Proof-of-concept cross-platform app for Philippine BIR tools. Not an official BIR application
			and not intended for production tax filing or regulatory compliance.
		</p>

		<div class="mt-3 flex flex-wrap gap-x-5 gap-y-2">
			{#each birLinks as link (link.href)}
				<a
					href={link.href}
					target="_blank"
					rel="noreferrer"
					class="text-sm font-medium text-accent underline-offset-4 hover:underline"
				>
					{link.label}
				</a>
			{/each}
		</div>
	</Card>
</Page>

<Dialog
	bind:open={resetOpen}
	size="sm"
	title="Reset preferences?"
	description="Theme, sidebar, sending mode, and default values return to their originals. Taxpayer records are not affected."
>
	{#snippet footer()}
		<Button variant="secondary" onclick={() => (resetOpen = false)}>Cancel</Button>
		<Button variant="danger" onclick={confirmReset}>Reset</Button>
	{/snippet}
</Dialog>
