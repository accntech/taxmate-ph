<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { styles } from './settings.styles';
	import { Badge, Button, Card, Dialog, Page, PageHeader, Select } from '$lib/components/ui';
	import { settings, type ColorTheme, type PaperSize } from '$lib/settings.svelte';
	import { createSubmissionLogClient, formatSubmissionError, formatSubmissionLog, type SubmissionLog } from '$lib/tauri/submission';
	import { isTauri } from '@tauri-apps/api/core';
	import Settings from '@solar-icons/svelte/category/settings/Linear/Settings.svelte';
	import Palette from '@solar-icons/svelte/category/tools/Linear/Palette.svelte';
	import Printer from '@solar-icons/svelte/category/devices/Linear/Printer.svelte';
	import Database from '@solar-icons/svelte/category/ui/Linear/Database.svelte';
	import InfoCircle from '@solar-icons/svelte/category/ui/Linear/InfoCircle.svelte';
	import TrashBin from '@solar-icons/svelte/category/ui/Linear/TrashBinMinimalistic.svelte';
	import Copy from '@solar-icons/svelte/category/ui/Linear/Copy.svelte';
	import Sun from '@solar-icons/svelte/category/weather/Linear/Sun.svelte';
	import Moon from '@solar-icons/svelte/category/weather/Linear/Moon.svelte';
	import Monitor from '@solar-icons/svelte/category/devices/Linear/Monitor.svelte';
	import type { Snippet, Component } from 'svelte';

	const appVersion = '0.1.0';

	const colorThemes: { value: ColorTheme; label: string; description: string }[] = [
		{ value: 'ebirforms', label: 'eBIRForms', description: 'Classic blue / red' },
		{ value: 'teal', label: 'Teal', description: 'Original palette' },
		{ value: 'catppuccin', label: 'Catppuccin', description: 'Latte / Mocha' }
	];

	const themeOptions = [
		{ value: 'light', label: 'Light', description: 'A bright workspace', icon: Sun },
		{ value: 'system', label: 'System', description: 'Follow your device', icon: Monitor },
		{ value: 'dark', label: 'Dark', description: 'A softer glow', icon: Moon }
	] as const;

	const paperOptions: { value: PaperSize; label: string; meta: string }[] = [
		{ value: 'a4', label: 'A4', meta: '210 × 297 mm' },
		{ value: 'letter', label: 'Letter', meta: '8.5 × 11 in' },
		{ value: 'long', label: 'Long / Folio', meta: '8.5 × 13 in' }
	];

	const birLinks = [
		{ label: 'eBIRForms — official BIR page', href: 'https://www.bir.gov.ph/eservices/ebirforms' },
		{ label: 'Bureau of Internal Revenue', href: 'https://www.bir.gov.ph' }
	];

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
			? `Matches your device — currently ${settings.resolvedTheme}.`
			: `${settings.themeMode === 'light' ? 'Light' : 'Dark'} appearance is always on.`
	);

	function confirmReset() {
		settings.resetToDefaults();
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

{#snippet colorThemeControl()}
	<div class="palette-picker" role="radiogroup" aria-label="Color theme">
		{#each colorThemes as theme (theme.value)}
			<label class="palette-option" data-palette={theme.value} data-mode={settings.resolvedTheme}>
				<span class="palette-preview" aria-hidden="true">
					<span class="preview-rail">
						<span class="preview-mark"></span>
						<span class="preview-nav selected"></span>
						<span class="preview-nav"></span>
						<span class="preview-nav"></span>
					</span>
					<span class="preview-workspace">
						<span class="preview-toolbar"><span></span><span></span></span>
						<span class="preview-content">
							<span class="preview-heading"></span>
							<span class="preview-line"></span>
							<span class="preview-panel"><span></span><span></span><span></span></span>
						</span>
					</span>
				</span>
				<span class="palette-details">
					<span class="palette-name">{theme.label}</span>
					<span class="palette-description">{theme.description}</span>
				</span>
				<input
					class="appearance-radio palette-radio"
					type="radio"
					name="color-theme"
					value={theme.value}
					checked={settings.colorTheme === theme.value}
					onchange={() => settings.setColorTheme(theme.value)}
					aria-label={theme.label}
				/>
			</label>
		{/each}
	</div>
	<p role="status" class={stylex.attrs(styles.visuallyHidden).class}>
		{colorThemes.find(theme => theme.value === settings.colorTheme)?.label} color theme selected.
	</p>
{/snippet}

{#snippet themeControl()}
	<div class="mode-picker" role="radiogroup" aria-label="Color mode">
		{#each themeOptions as option (option.value)}
			{@const ModeIcon = option.icon}
			<label class="mode-option">
				<span class="mode-icon" aria-hidden="true"><ModeIcon size={22} color="currentColor" /></span>
				<input
					class="appearance-radio"
					type="radio"
					name="color-mode"
					value={option.value}
					checked={settings.themeMode === option.value}
					onchange={() => settings.setThemeMode(option.value)}
					aria-label={option.label}
				/>
				<span class="mode-details">
					<span class="mode-name">{option.label}</span>
					<span class="mode-description">{option.description}</span>
				</span>
			</label>
		{/each}
	</div>
	<p class="appearance-note" aria-live="polite">{themeNote}</p>
{/snippet}

{#snippet paperControl()}
	<Select
		value={settings.prefs.paperSize}
		options={paperOptions}
		onchange={(value) => settings.updatePrefs({ paperSize: value })}
		class={stylex.attrs(styles.select).class}
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
		{@render sectionTitle('Appearance', 'Make the workspace feel right for you.', Palette)}
		<div class="appearance-section">
			<div class="appearance-heading">
				<h3>Color theme</h3>
				<p>Choose a palette for the whole workspace.</p>
			</div>
			{@render colorThemeControl()}
		</div>
		<div class="appearance-section appearance-mode-section">
			<div class="appearance-heading">
				<h3>Color mode</h3>
				<p>Choose a light or dark workspace, or let your device decide.</p>
			</div>
			{@render themeControl()}
		</div>
	</Card>

	<Card variant="panel" padding="lg" class={stylex.attrs(styles.card).class}>
		{@render sectionTitle('Defaults', 'Pre-filled values when you start new work.', Printer)}
		{@render row('Paper size', 'Default page size for printouts and PDF exports.', paperControl, true)}
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

<style>
	.appearance-section {
		display: grid;
		gap: 1rem;
		min-width: 0;
		padding-block: 1.25rem .25rem;
	}
	.appearance-mode-section {
		margin-top: 1rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-soft);
	}
	.appearance-heading { display: grid; gap: .25rem; }
	.appearance-heading h3 { font-size: .875rem; font-weight: 600; color: var(--fg); }
	.appearance-heading p { font-size: .8125rem; line-height: 1.5; color: var(--fg-muted); }
	.palette-picker, .mode-picker {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: .875rem;
		min-width: 0;
		width: 100%;
	}
	.palette-option, .mode-option {
		position: relative;
		min-width: 0;
		border: 1px solid var(--border);
		border-radius: .625rem;
		background: var(--bg-input);
		cursor: pointer;
	}
	.palette-option:hover, .mode-option:hover { border-color: var(--fg-muted); }
	.palette-option:has(input:checked), .mode-option:has(input:checked) {
		border-color: var(--accent);
		box-shadow: inset 0 0 0 1px var(--accent);
		background: var(--accent-soft);
	}
	.palette-option:has(input:focus-visible), .mode-option:has(input:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}
	.appearance-radio {
		width: 1rem;
		height: 1rem;
		margin: 0;
		accent-color: var(--accent);
		cursor: pointer;
	}
	.palette-option { display: grid; padding: .5rem .5rem 0; }
	.palette-radio { position: absolute; right: 1rem; bottom: 1.5rem; }
	.palette-details { display: grid; gap: .25rem; padding: .875rem 2rem 1rem .5rem; }
	.palette-name, .mode-name { font-size: .875rem; line-height: 1.25rem; font-weight: 600; color: var(--fg); }
	.palette-description, .mode-description { font-size: .75rem; line-height: 1.25rem; color: var(--fg-muted); }
	.palette-preview {
		display: grid;
		grid-template-columns: 23% 1fr;
		height: 7rem;
		overflow: hidden;
		border: 1px solid var(--preview-border);
		border-radius: .375rem;
		background: var(--preview-bg);
	}
	.preview-rail { display: flex; flex-direction: column; gap: .5rem; padding: .75rem .5rem; background: var(--preview-rail); border-right: 1px solid var(--preview-border); }
	.preview-mark { width: .75rem; height: .75rem; margin-bottom: .375rem; border-radius: .25rem; background: var(--preview-accent); }
	.preview-nav { width: 100%; height: .25rem; border-radius: .125rem; background: var(--preview-line); }
	.preview-nav.selected { height: .5rem; background: var(--preview-accent); opacity: .6; }
	.preview-workspace { min-width: 0; }
	.preview-toolbar { display: flex; align-items: center; justify-content: space-between; height: 1.5rem; padding-inline: .625rem; border-bottom: 1px solid var(--preview-border); background: var(--preview-surface); }
	.preview-toolbar span:first-child { width: 34%; height: .25rem; border-radius: .125rem; background: var(--preview-line); }
	.preview-toolbar span:last-child { width: .5rem; height: .5rem; border-radius: 50%; background: var(--preview-accent); }
	.preview-content { display: grid; gap: .4rem; padding: .75rem; }
	.preview-heading { width: 45%; height: .35rem; border-radius: .125rem; background: var(--preview-accent); }
	.preview-line { width: 72%; height: .2rem; border-radius: .125rem; background: var(--preview-line); }
	.preview-panel { display: grid; gap: .3rem; padding: .5rem; border: 1px solid var(--preview-border); border-radius: .25rem; background: var(--preview-surface); }
	.preview-panel span { height: .2rem; background: var(--preview-line); border-radius: .125rem; }
	.preview-panel span:last-child { width: 68%; }
	[data-palette='ebirforms'] {
		--preview-bg: linear-gradient(180deg, #a6c8ee, #e0f6fc 30%, #ffffff 50%, #fde1e5 70%, #f2aeba);
		--preview-rail: #f1f8fc; --preview-surface: #ffffff; --preview-border: #bfd2e5; --preview-line: #c6d5e5; --preview-accent: #2269b5;
	}
	[data-palette='teal'] {
		--preview-bg: #f5f7f3; --preview-rail: #edf2ea; --preview-surface: #ffffff; --preview-border: #d7e0d1; --preview-line: #c6d5c5; --preview-accent: #00796b;
	}
	[data-palette='catppuccin'] {
		--preview-bg: #eff1f5; --preview-rail: #e6e9ef; --preview-surface: #ffffff; --preview-border: #ccd0da; --preview-line: #ccd0da; --preview-accent: #8839ef;
	}
	[data-palette='ebirforms'][data-mode='dark'] {
		--preview-bg: linear-gradient(180deg, #14283f, #10202d 32%, #0c1422 50%, #211b29 72%, #302030);
		--preview-rail: #0c1422; --preview-surface: #121e31; --preview-border: #374c66; --preview-line: #374c66; --preview-accent: #83c9ff;
	}
	[data-palette='teal'][data-mode='dark'] {
		--preview-bg: #111511; --preview-rail: #181e18; --preview-surface: #212a21; --preview-border: #354235; --preview-line: #4b5e4e; --preview-accent: #42d6bd;
	}
	[data-palette='catppuccin'][data-mode='dark'] {
		--preview-bg: #171722; --preview-rail: #13131d; --preview-surface: #222332; --preview-border: #4a4d63; --preview-line: #50546c; --preview-accent: #cba6f7;
	}
	.mode-option { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: .75rem; padding: 1rem; }
	.mode-icon { display: flex; color: var(--fg-muted); }
	.mode-option:has(input:checked) .mode-icon { color: var(--accent); }
	.mode-details { display: grid; grid-column: 1 / -1; gap: .125rem; }
	.appearance-note { margin-top: -.25rem; font-size: .75rem; line-height: 1.25rem; color: var(--fg-muted); }
	@media (width <= 30rem) {
		.palette-picker, .mode-picker { grid-template-columns: minmax(0, 1fr); gap: .625rem; }
		.palette-option { grid-template-columns: 6rem 1fr; align-items: center; padding: .5rem; }
		.palette-preview { height: 5rem; }
		.preview-rail { padding: .5rem .25rem; gap: .375rem; }
		.preview-mark { width: .5rem; height: .5rem; margin-bottom: .25rem; }
		.preview-toolbar { height: 1.125rem; padding-inline: .375rem; }
		.preview-content { padding: .5rem .375rem; gap: .3rem; }
		.preview-panel { padding: .375rem; gap: .2rem; }
		.palette-details { padding: .5rem 1.5rem .5rem .75rem; }
		.palette-radio { right: .75rem; bottom: auto; top: calc(50% - .5rem); }
		.mode-option { grid-template-columns: auto 1fr auto; gap: .875rem; padding: .875rem 1rem; }
		.mode-details { grid-column: 2; grid-row: 1; }
		.mode-option input { grid-column: 3; grid-row: 1; }
	}
</style>
