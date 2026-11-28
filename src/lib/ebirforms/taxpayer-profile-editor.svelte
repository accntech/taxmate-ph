<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { profileEditor } from './taxpayer-profile-editor.styles';
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { buildTaxpayerRoute } from '$lib/apps/app-shell';
	import { ebirformsWorkspace as workspace } from '$lib/ebirforms/ebirforms-workspace.svelte';
	import { Button, ButtonLink, Card, Combobox, DateInput, FieldErrors, Input, Label, Page, Select, Textarea, TinInput } from '$lib/components/ui';
	import { formatTinInput, individualTaxpayerTypeOptions, parseTinInput, validateTaxpayerProfile } from '$lib/profiles/profile';
	import { psocOptions } from '$lib/profiles/psoc';
	import { psicOptionsForCode } from '$lib/profiles/psic';
	import type { CivilStatus, TaxpayerSize, TaxpayerSpouse } from '$lib/profiles/profile';

	let { profileId }: { profileId?: string } = $props();
	let ready = $state(false);
	let notFound = $state(false);
	const categoryOptions = [
		{ value: 'P', label: 'Private', meta: 'individuals, corporations, estates, trusts' },
		{ value: 'G', label: 'Government', meta: 'national agencies and LGUs' }
	];
	const civilStatusOptions = [
		{ value: '', label: 'Not specified' },
		{ value: 'Single', label: 'Single' },
		{ value: 'Married', label: 'Married' },
		{ value: 'Separated', label: 'Legally separated' },
		{ value: 'Widowed', label: 'Widowed' }
	];
	const spouseFields = [
		{ key: 'citizenship', label: 'Spouse citizenship' },
		{ key: 'address', label: 'Spouse address line 1' },
		{ key: 'address2', label: 'Spouse address line 2' },
		{ key: 'zipCode', label: 'Spouse ZIP code' },
		{ key: 'email', label: 'Spouse email' },
		{ key: 'contactNumber', label: 'Spouse contact number' }
	] as const;

	let profileForm: HTMLFormElement | undefined = $state();
	let validationAttempted = $state(false);
	let isSavingProfile = $state(false);
	let tinInput = $state(formatTinInput(workspace.profile));
	let isIndividual = $derived(workspace.profile.taxpayerClassification === 'I');
	let savedProfile = $derived(workspace.profiles.find((profile) => profile.id === profileId));
	let taxpayerTypeOptions = $derived(individualTaxpayerTypeOptions.filter(
		(option) => !('legacy' in option) || option.value === savedProfile?.taxpayerType
	));
	let profileToSave = $derived(isIndividual ? workspace.profile : {
		...workspace.profile,
		spouse: savedProfile?.spouse
	});
	let validationErrors = $derived(
		validationAttempted ? validateTaxpayerProfile(profileToSave, tinInput, workspace.profiles) : {}
	);
	let activeProfileRoute = $derived(
		workspace.selectedProfileId ? `${buildTaxpayerRoute(workspace.selectedProfileId)}/forms` : ''
	);
	let spouse = $derived(workspace.profile.spouse);
	let spouseTin = $derived(
		spouse && (spouse.tin1 || spouse.tin2 || spouse.tin3 || spouse.branchCode)
			? `${spouse.tin1 ?? ''}${spouse.tin2 ?? ''}${spouse.tin3 ?? ''}${spouse.branchCode ?? ''}`
			: ''
	);
	let showPersonalDetails = $derived(
		workspace.profile.taxpayerClassification !== 'N' ||
		!!(workspace.profile.birthDate || workspace.profile.citizenship || workspace.profile.civilStatus || spouse)
	);
	let showSpouseDetails = $derived(isIndividual && (workspace.profile.civilStatus === 'Married' || !!spouse));
	let spouseFieldErrors = $derived({
		zipCode: validationErrors.spouseZipCode,
		email: validationErrors.spouseEmail
	});

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

	function updateSpouse(patch: TaxpayerSpouse) {
		workspace.profile.spouse = { ...workspace.profile.spouse, ...patch };
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
			const saved = await workspace.saveTaxpayerProfile(tinInput, profileToSave);
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
	<ButtonLink href="/ebirforms/taxpayers" variant="ghost" size="sm" class={stylex.attrs(profileEditor.backLink).class}>
		Back to taxpayers
	</ButtonLink>
	{#if !ready}
		<Card>
			<p role="status">Loading taxpayer profile…</p>
		</Card>
	{:else if notFound}
		<Card>
			<h1>Taxpayer not found</h1>
			<p class={stylex.attrs(profileEditor.loadError).class}>
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
						<Input label="Registered name line 2"
							bind:value={() => workspace.profile.taxpayerName2 ?? '', (value) => workspace.profile.taxpayerName2 = value} />
						<Input label="Registered name line 3"
							bind:value={() => workspace.profile.taxpayerName3 ?? '', (value) => workspace.profile.taxpayerName3 = value} />
						<div class="full-width">
							<TinInput
								label="TIN and branch code"
								required
								error={validationErrors.tin}
								inputmode="numeric"
								placeholder="000-000-000-00000"
								value={tinInput}
								onchange={updateTinParts}
								class={stylex.attrs(profileEditor.tin).class} />
						</div>
						<Input
							label="RDO code"
							class="font-mono"
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

				{#if showPersonalDetails}
					<fieldset>
						<legend>Personal details</legend>
						<div class="field-grid">
							<Select
								label="Civil status"
								options={civilStatusOptions}
								error={validationErrors.civilStatus}
								value={workspace.profile.civilStatus ?? ''}
								onchange={(value) => workspace.profile.civilStatus = value as CivilStatus | ''} />
							<DateInput
								id="taxpayer-birth-date"
								label="Date of birth"
								error={validationErrors.birthDate}
								value={workspace.profile.birthDate ?? ''}
								onchange={(value) => workspace.profile.birthDate = value} />
							<Input
								label="Citizenship"
								value={workspace.profile.citizenship ?? ''}
								oninput={(event) => workspace.profile.citizenship = event.currentTarget.value} />
							{#if isIndividual}
								<div class="classification-picker">
									<Label for="taxpayer-psoc">Occupation code (PSOC)</Label>
									<Combobox
										id="taxpayer-psoc"
										monospace="secondary"
										options={psocOptions}
										value={workspace.profile.psocCode || null}
										placeholder="Choose occupation"
										searchPlaceholder="Search code or occupation"
										emptyMessage="No matching occupations."
										invalid={!!validationErrors.psocCode}
										aria-describedby={validationErrors.psocCode ? 'taxpayer-psoc-error' : undefined}
										wrapOptions
										itemHeight={40}
										maxVisibleItems={6}
										onValueChange={(value) => workspace.profile.psocCode = typeof value === 'string' ? value : ''} />
									{#if validationErrors.psocCode}
										<FieldErrors id="taxpayer-psoc-error" errors={[validationErrors.psocCode]} />
									{/if}
								</div>
							{/if}
						</div>
					</fieldset>
				{/if}

				<fieldset>
					<legend>Taxpayer information</legend>
					<div class="field-grid">
						<div class="full-width">
							<Input
								label="Trade name"
								value={workspace.profile.tradeName ?? ''}
								oninput={(event) => workspace.profile.tradeName = event.currentTarget.value} />
						</div>
						<Input
							label="Line of business / occupation"
							value={workspace.profile.lineOfBusiness ?? ''}
							oninput={(event) => workspace.profile.lineOfBusiness = event.currentTarget.value} />
						<div class="classification-picker">
							<Label for="taxpayer-psic">PSIC code</Label>
							<Combobox
								id="taxpayer-psic"
								monospace="secondary"
								options={psicOptionsForCode(workspace.profile.psicCode)}
								value={workspace.profile.psicCode || null}
								placeholder="Choose industry"
								searchPlaceholder="Search code or industry"
								emptyMessage="No matching industries."
								invalid={!!validationErrors.psicCode}
								aria-describedby={validationErrors.psicCode ? 'taxpayer-psic-error' : undefined}
								wrapOptions
								itemHeight={40}
								maxVisibleItems={6}
								onValueChange={(value) => workspace.profile.psicCode = typeof value === 'string' ? value : ''} />
							{#if validationErrors.psicCode}
								<FieldErrors id="taxpayer-psic-error" errors={[validationErrors.psicCode]} />
							{/if}
						</div>
						<Select
							label="Tax classification"
							error={validationErrors.taxpayerClassification}
							options={[{ value: 'I', label: 'Individual' }, { value: 'N', label: 'Non-individual' }]}
							value={workspace.profile.taxpayerClassification ?? ''}
							onchange={(value) => workspace.profile.taxpayerClassification = value as 'I' | 'N' | ''} />
						{#if isIndividual}
							<Select
								label="Taxpayer type"
								error={validationErrors.taxpayerType}
								options={taxpayerTypeOptions}
								value={workspace.profile.taxpayerType ?? ''}
								onchange={(value) => workspace.profile.taxpayerType = value}
							/>
						{/if}
							<Select
								label="Taxpayer size classification"
								error={validationErrors.taxpayerSize}
								options={[
									{ value: '', label: 'Not specified' },
									{ value: 'micro', label: 'Micro' },
									{ value: 'small', label: 'Small' },
									{ value: 'medium', label: 'Medium' },
									{ value: 'large', label: 'Large' }
								]}
								value={workspace.profile.taxpayerSize ?? ''}
								onchange={(value) => workspace.profile.taxpayerSize = value as TaxpayerSize} />
					</div>
				</fieldset>

				<fieldset>
					<legend>Registered address</legend>
					<div class="field-grid">
						<div class="full-width">
							<Textarea rows={2} label="Address line 1" bind:value={workspace.profile.address} />
						</div>
						<Textarea rows={2} label="Address line 2" bind:value={workspace.profile.address2} />
						<Textarea rows={2} label="Address line 3"
							bind:value={() => workspace.profile.address3 ?? '', (value) => workspace.profile.address3 = value} />
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

				{#if showSpouseDetails}
					<fieldset>
						<legend>Spouse details</legend>
						<div class="field-grid">
							<div class="full-width">
								<Input
									label="Spouse name"
									value={spouse?.taxpayerName ?? ''}
									oninput={(event) => updateSpouse({ taxpayerName: event.currentTarget.value })} />
							</div>
							<TinInput
								label="Spouse TIN and branch code"
								error={validationErrors.spouseTin}
								value={spouseTin}
								onchange={(value) => updateSpouse(parseTinInput(value))}
								class={stylex.attrs(profileEditor.tin).class} />
							<Input
								label="Spouse RDO code"
								maxlength={3}
								pattern="[0-9A-Z]{3}"
								error={validationErrors.spouseRdoCode}
								value={spouse?.rdoCode ?? ''}
								oninput={(event) => updateSpouse({ rdoCode: event.currentTarget.value })} />
							<DateInput
								id="spouse-birth-date"
								label="Spouse date of birth"
								error={validationErrors.spouseBirthDate}
								value={spouse?.birthDate ?? ''}
								onchange={(value) => updateSpouse({ birthDate: value })} />
							{#each spouseFields as { key, label } (key)}
								<div class={key === 'address' ? 'full-width' : undefined}>
									<Input
										{label}
										type={key === 'email' ? 'email' : key === 'contactNumber' ? 'tel' : 'text'}
										inputmode={key === 'zipCode' ? 'numeric' : key === 'contactNumber' ? 'tel' : undefined}
										maxlength={key === 'zipCode' ? 4 : undefined}
										error={key === 'zipCode' || key === 'email' ? spouseFieldErrors[key] : undefined}
										value={spouse?.[key] ?? ''}
										oninput={(event) => updateSpouse({ [key]: event.currentTarget.value })} />
								</div>
							{/each}
						</div>
					</fieldset>
				{/if}
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
		gap: var(--form-field-row-gap) var(--form-field-column-gap);
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
	.classification-picker {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-content: start;
		gap: var(--form-label-gap);
		min-width: 0;
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
