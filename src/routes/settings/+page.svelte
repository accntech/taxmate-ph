<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { styles } from './settings.styles';
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
	<div class={stylex.attrs(styles.sectionHeading).class}>
		<span
			class={stylex.attrs(styles.sectionIcon).class}
			aria-hidden="true"
		>
			<Icon size={17} color="currentColor" />
		</span>
		<div class={stylex.attrs(styles.copy).class}>
			<h2 class={stylex.attrs(styles.sectionTitle).class}>{label}</h2>
			<p class={stylex.attrs(styles.sectionDescription).class}>{desc}</p>
		</div>
	</div>
{/snippet}

{#snippet row(label: string, desc: string, control: Snippet, last = false)}
	<div
		class={(last ? stylex.attrs(styles.settingRow).class : stylex.attrs(styles.settingRow, styles.rowSeparator).class)}
	>
		<div class={stylex.attrs(styles.copy).class}>
			<p class={stylex.attrs(styles.settingLabel).class}>{label}</p>
			<p class={stylex.attrs(styles.settingDescription).class}>{desc}</p>
		</div>
		<div class={stylex.attrs(styles.settingControl).class}>
			{@render control()}
		</div>
	</div>
{/snippet}

{#snippet segmented(active: boolean, onclick: () => void, label: string)}
	<button
		type="button"
		aria-pressed={active}
		{onclick}
		class={(active ? stylex.attrs(styles.segment, styles.segmentInteraction, styles.selectedSegment).class : stylex.attrs(styles.segment, styles.segmentInteraction, styles.unselectedSegment).class)}
	>
		{label}
	</button>
{/snippet}

{#snippet themeControl()}
	<div class={stylex.attrs(styles.themeControl).class}>
		<div
			role="group"
			aria-label="Theme mode"
			class={stylex.attrs(styles.segmentGroup).class}
		>
			{#each themeOptions as option (option.value)}
				{@render segmented(
					settings.themeMode === option.value,
					() => settings.setThemeMode(option.value),
					option.label
				)}
			{/each}
		</div>
		<p class={stylex.attrs(styles.themeNote).class}>{themeNote}</p>
	</div>
{/snippet}

{#snippet sidebarControl()}
	<div
		role="group"
		aria-label="Sidebar default"
		class={stylex.attrs(styles.segmentGroup).class}
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
		class={stylex.attrs(styles.select).class}
	/>
{/snippet}

{#snippet periodControl()}
	<Select
		value={settings.prefs.filingPeriod}
		options={periodOptions}
		onchange={(value) => settings.updatePrefs({ filingPeriod: value })}
		class={stylex.attrs(styles.select).class}
	/>
{/snippet}

{#snippet taxpayerControl()}
	<Input
		bind:value={taxpayerName}
		placeholder="None"
		class={stylex.attrs(styles.select).class}
		onblur={() => settings.updatePrefs({ defaultTaxpayer: taxpayerName.trim() })}
	/>
{/snippet}

{#snippet sendingControl()}
	<div role="group" aria-label="Sending mode" class={stylex.attrs(styles.segmentGroup).class}>
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

	<Card variant="panel" padding="lg" class={stylex.attrs(styles.card).class}>
		{@render sectionTitle('Appearance', 'Theme and layout of the workspace.', Palette)}
		{@render row('Theme', 'Light, dark, or match your system appearance.', themeControl)}
		{@render row('Sidebar', 'Show the full navigation rail or a compact icon rail.', sidebarControl, true)}
	</Card>

	<Card variant="panel" padding="lg" class={stylex.attrs(styles.card).class}>
		{@render sectionTitle('Defaults', 'Pre-filled values when you start new work.', Printer)}
		{@render row('Paper size', 'Default page size for printouts and PDF exports.', paperControl)}
		{@render row('Filing period', 'Suggested period when preparing a new return.', periodControl)}
		{@render row('Default taxpayer', 'Selected first when you open a workspace.', taxpayerControl, true)}
	</Card>

	<Card variant="panel" padding="lg" class={stylex.attrs(styles.card).class}>
		{@render sectionTitle('Sending', 'BIR submission is available for Form 1601-EQ first.', Settings)}
		{@render row('Sending mode', 'Send to BIR uploads the return. Prepare locally saves a package on this device without sending it.', sendingControl, true)}
		<p class={stylex.attrs(styles.dispatcherDescription).class}>Server settings are retrieved automatically from the BIR dispatcher when sending.</p>
		{@render row('Submission log', 'Review saved preparation, connection, and upload results on this device.', submissionLogControl, true)}
		{#if logOpen}
			<section id="submission-log" aria-labelledby="submission-log-title" class={stylex.attrs(styles.submissionLog).class}>
				<div class={stylex.attrs(styles.logHeading).class}>
					<h3 id="submission-log-title" class={stylex.attrs(styles.logTitle).class}>Submission log</h3>
					<Button variant="secondary" size="sm" disabled={logLoading} onclick={() => void loadSubmissionLog()}>Refresh log</Button>
				</div>
				<p class={stylex.attrs(styles.logDescription).class}>Upload success does not confirm BIR receipt or acceptance.</p>
				{#if logLoading}
					<p role="status" class={stylex.attrs(styles.logStatus).class}>Loading submission log…</p>
				{:else if logError}
					<p role="alert" class={stylex.attrs(styles.logError).class}>{logError}</p>
				{:else if submissionLog}
					<p class={stylex.attrs(styles.logPath).class}>{submissionLog.path}</p>
					{#if submissionLog.truncated}
						<p class={stylex.attrs(styles.logTruncatedNote).class}>Showing the latest 128 KiB. Earlier entries remain in the log file.</p>
					{/if}
					{#if submissionLog.content}
						<div class={stylex.attrs(styles.logField).class}>
							<div class={stylex.attrs(styles.logActions).class}>
								<Button variant="secondary" size="sm" aria-label="Copy log" disabled={logCopying} onclick={() => void copySubmissionLog()}>
									<Copy size={14} color="currentColor" aria-hidden="true" />
									{logCopying ? 'Copying…' : logCopied ? 'Copied' : 'Copy log'}
								</Button>
							</div>
							<textarea readonly rows="12" aria-label="Log entries" value={logContent} class={stylex.attrs(styles.logEntries).class}></textarea>
						</div>
						{#if logCopied}
							<p role="status" class={stylex.attrs(styles.visuallyHidden).class}>Log copied to clipboard.</p>
						{/if}
						{#if logCopyError}
							<p role="alert" class={stylex.attrs(styles.copyError).class}>{logCopyError}</p>
						{/if}
					{:else}
						<p role="status" class={stylex.attrs(styles.logStatus).class}>No submission log entries yet. Prepare or submit a return to create an entry.</p>
					{/if}
				{/if}
			</section>
		{/if}
	</Card>

	<Card variant="panel" padding="lg" class={stylex.attrs(styles.card).class}>
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

	<Card variant="panel" padding="lg" class={stylex.attrs(styles.card).class}>
		{@render sectionTitle('About', 'App information and references.', InfoCircle)}

		<div class={stylex.attrs(styles.aboutGrid).class}>
			<div class={stylex.attrs(styles.aboutRow).class}>
				<span class={stylex.attrs(styles.aboutLabel).class}>Application</span>
				<p class={stylex.attrs(styles.applicationValue).class}>TaxMate PH</p>
			</div>
			<div class={stylex.attrs(styles.aboutRow).class}>
				<span class={stylex.attrs(styles.aboutLabel).class}>Version</span>
				<p class={stylex.attrs(styles.versionValue).class}>v{appVersion}</p>
			</div>
		</div>

		<p class={stylex.attrs(styles.aboutDescription).class}>
			Proof-of-concept cross-platform app for Philippine BIR tools. Not an official BIR application
			and not intended for production tax filing or regulatory compliance.
		</p>

		<div class={stylex.attrs(styles.links).class}>
			{#each birLinks as link (link.href)}
				<a
					href={link.href}
					target="_blank"
					rel="noreferrer"
					class={stylex.attrs(styles.externalLink).class}
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
