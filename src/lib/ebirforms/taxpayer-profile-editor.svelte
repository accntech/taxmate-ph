<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { buildTaxpayerRoute } from '$lib/apps/app-shell';
	import { ebirformsWorkspace as workspace } from '$lib/ebirforms/ebirforms-workspace.svelte';
	import { Button, ButtonLink, Card, Input, Page, Select, Textarea, TinInput } from '$lib/components/ui';
	import { formatTinInput, parseTinInput, validateTaxpayerProfile } from '$lib/profiles/profile';

	let { profileId }: { profileId?: string } = $props();
	let ready = $state(false);
	let notFound = $state(false);
	const categoryOptions = [
		{ value: 'P', label: 'Private', meta: 'individuals, corporations, estates, trusts' },
		{ value: 'G', label: 'Government', meta: 'national agencies and LGUs' }
	];

	let profileForm: HTMLFormElement | undefined = $state();
	let validationAttempted = $state(false);
	let isSavingProfile = $state(false);
	let tinInput = $state(formatTinInput(workspace.profile));
	let validationErrors = $derived(
		validationAttempted ? validateTaxpayerProfile(workspace.profile, tinInput) : {}
	);
	let activeProfileRoute = $derived(
		workspace.selectedProfileId ? `${buildTaxpayerRoute(workspace.selectedProfileId)}/forms` : ''
	);

	onMount(() => {
		let active = true;
		void workspace.loadTaxpayerProfiles().then(() => {
			if (!active) return;
			if (profileId) {
				notFound = !workspace.profiles.some((profile) => profile.id === profileId);
				if (!notFound) workspace.selectTaxpayerProfile(profileId);
			} else {
				workspace.startNewTaxpayerProfile();
			}
			tinInput = profileId ? formatTinInput(workspace.profile) : '';
			ready = true;
		});
		return () => {
			active = false;
		};
	});

	function updateTinParts(value: string) {
		tinInput = value;
		const parts = parseTinInput(value);

		workspace.profile.tin1 = parts.tin1;
		workspace.profile.tin2 = parts.tin2;
		workspace.profile.tin3 = parts.tin3;
		workspace.profile.branchCode = parts.branchCode;
	}

	async function saveProfile() {
		if (isSavingProfile) return;
		validationAttempted = true;
		if (Object.keys(validationErrors).length > 0) {
			await tick();
			profileForm?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
			return;
		}
		isSavingProfile = true;
		try {
			const saved = await workspace.saveTaxpayerProfile(tinInput);
			if (saved) await goto(resolve('/ebirforms/taxpayers'));
		} finally {
			isSavingProfile = false;
		}
	}
</script>

<svelte:head>
	<title>{profileId ? 'Edit taxpayer' : 'New taxpayer'} | eBIRForms</title>
</svelte:head>

<Page size="md">
	<ButtonLink href="/ebirforms/taxpayers" variant="ghost" size="sm" class="w-fit">
		Back to taxpayers
	</ButtonLink>
	{#if !ready}
		<Card>
			<p role="status">Loading taxpayer profile…</p>
		</Card>
	{:else if notFound}
		<Card>
			<h1>Taxpayer not found</h1>
			<p class="mt-2 text-sm text-fg-muted">
				This profile is unavailable. Return to the taxpayer list to select a profile.
			</p>
		</Card>
	{:else}
		<form
			class="profile-workspace"
			bind:this={profileForm}
			aria-label="Taxpayer profile"
			aria-busy={isSavingProfile}
			novalidate
			onsubmit={(event) => {
				event.preventDefault();
				void saveProfile();
			}}>
			<header class="editor-heading">
				<h1>{profileId ? 'Edit taxpayer' : 'New taxpayer'}</h1>
				{#if profileId && activeProfileRoute}
					<ButtonLink href={activeProfileRoute} variant="ghost" size="sm">
						Open forms
					</ButtonLink>
				{/if}
			</header>

			{#if Object.keys(validationErrors).length > 0}
				<div class="validation-summary" role="alert">
					Profile not saved. Correct the highlighted fields and try again.
				</div>
			{/if}

			<div class="editor-fields">
				<fieldset>
					<legend>Identity</legend>
					<div class="field-grid">
						<div class="full-width">
							<Input
								label="Taxpayer name"
								required
								error={validationErrors.taxpayerName}
								bind:value={workspace.profile.taxpayerName} />
						</div>
						<div class="full-width">
							<TinInput
								label="TIN and branch code"
								required
								error={validationErrors.tin}
								inputmode="numeric"
								placeholder="000-000-000-0000"
								value={tinInput}
								onchange={updateTinParts}
								class="font-mono" />
						</div>
						<Input
							label="RDO code"
							maxlength={3}
							pattern={'[0-9A-Z]{3}'}
							required
							error={validationErrors.rdoCode}
							bind:value={workspace.profile.rdoCode} />
						<Select
							label="Category"
							required
							error={validationErrors.category}
							options={categoryOptions}
							bind:value={workspace.profile.category} />
					</div>
				</fieldset>

				<fieldset>
					<legend>Registered address</legend>
					<div class="field-grid">
						<div class="full-width">
							<Textarea rows={2} label="Address line 1" bind:value={workspace.profile.address} />
						</div>
						<Textarea rows={2} label="Address line 2" bind:value={workspace.profile.address2} />
						<Input
							label="ZIP code"
							maxlength={4}
							pattern="[0-9]{4}"
							error={validationErrors.zipCode}
							inputmode="numeric"
							bind:value={workspace.profile.zipCode} />
					</div>
				</fieldset>

				<fieldset>
					<legend>Contact</legend>
					<div class="field-grid">
						<Input
							label="Email"
							error={validationErrors.email}
							type="email"
							bind:value={workspace.profile.email} />
						<Input
							label="Contact number"
							type="tel"
							inputmode="tel"
							bind:value={workspace.profile.contactNumber} />
					</div>
				</fieldset>
			</div>

			<footer class="editor-footer" aria-label="Taxpayer actions">
				<div class="editor-actions">
					<Button type="submit" disabled={isSavingProfile}>
						{isSavingProfile ? 'Saving…' : 'Save profile'}
					</Button>
					<ButtonLink href="/ebirforms/taxpayers" variant="secondary">
						Cancel
					</ButtonLink>
				</div>
				<div class="workspace-status" role="status" aria-live="polite">
					<span class="status-dot" aria-hidden="true"></span>
					<span>{workspace.statusMessage}</span>
				</div>
			</footer>
		</form>
	{/if}
</Page>

<style>
	.profile-workspace {
		container: taxpayer-workspace / inline-size;
		width: 100%;
		max-width: 56rem;
		margin-inline: auto;
		overflow: clip;
		border: 1px solid var(--border-soft);
		border-radius: 14px;
		background: var(--bg-elev);
	}
	.editor-heading {
		display: flex;
		min-height: 4rem;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border-soft);
	}
	h1 {
		margin: 0;
		min-width: 0;
		font-family: var(--font-sans);
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: -0.015em;
		overflow-wrap: anywhere;
	}
	.editor-heading :global(a) {
		flex-shrink: 0;
	}
	.validation-summary {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border-soft);
		background: var(--danger-soft);
		color: var(--danger);
		font-size: 0.8rem;
	}
	fieldset {
		min-width: 0;
		margin: 0;
		padding: 1.25rem 1rem;
		border: 0;
	}
	fieldset + fieldset {
		border-top: 1px solid var(--border-soft);
	}
	legend {
		float: left;
		width: 100%;
		margin-bottom: 1rem;
		font-size: 0.875rem;
		font-weight: 600;
	}
	.field-grid {
		clear: both;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1.125rem 1.25rem;
		align-items: start;
	}
	.field-grid > * {
		min-width: 0;
	}
	.editor-fields :global(input),
	.editor-fields :global(button),
	.editor-fields :global(textarea),
	.editor-fields :global([role='combobox']) {
		scroll-margin-block: 5rem 9rem;
	}
	.editor-footer {
		position: sticky;
		bottom: 0;
		z-index: 10;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--border-soft);
		background: var(--bg-elev);
	}
	.editor-actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		align-items: center;
	}
	.workspace-status {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 0.625rem;
		color: var(--fg-muted);
		font-size: 0.8rem;
		overflow-wrap: anywhere;
		line-height: 1.5;
	}
	.status-dot {
		width: 0.5rem;
		height: 0.5rem;
		flex-shrink: 0;
		border-radius: 50%;
		background: var(--fg-subtle);
	}
	@container taxpayer-workspace (min-width: 24rem) {
		.editor-heading,
		fieldset,
		.editor-footer,
		.validation-summary {
			padding-inline: 1.25rem;
		}
		.field-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.full-width {
			grid-column: 1 / -1;
		}
	}
	@container taxpayer-workspace (min-width: 36rem) {
		.editor-footer {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
		.workspace-status {
			justify-content: flex-end;
		}
	}
</style>
