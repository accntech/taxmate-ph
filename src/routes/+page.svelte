<script lang="ts">
	import { onMount } from 'svelte';
	import Form1601EQ from '$lib/forms/form-1601-eq.svelte';
	import { getFormDefinition, listForms } from '$lib/forms';
	import { parseLegacyXml, serializeLegacyXml } from '$lib/legacy/xml';
	import {
		buildProfileFilename,
		buildReturnFilename,
		buildTaxpayerProfileFormValues,
		normalizeTinNumber,
		normalizeTinParts,
		upsertTaxpayerProfile,
		type TaxpayerProfile
	} from '$lib/profiles/profile';
	import { createProfileStoreClient, formatProfileStoreError } from '$lib/tauri/profile-store';
	import {
		createSubmissionClient,
		formatSubmissionError,
		type SubmissionMode,
		type SubmissionReceipt
	} from '$lib/tauri/submission';

	type Tab = 'profile' | 'forms' | 'saved' | 'submission';

	const forms = listForms();
	const selectedForm = getFormDefinition('1601EQ');
	const initialProfile: TaxpayerProfile = {
		id: '1234567890000',
		tin1: '123',
		tin2: '456',
		tin3: '789',
		branchCode: '0000',
		rdoCode: '040',
		taxpayerName: 'Sample Taxpayer',
		address: '',
		address2: '',
		zipCode: '',
		contactNumber: '',
		category: 'P',
		email: 'taxpayer@example.com'
	};

	let activeTab: Tab = $state('forms');
	let importBuffer = $state('');
	let finalFlag = $state('0');
	let isSubmitting = $state(false);
	let statusMessage = $state('Draft return ready for local compatibility testing.');
	let submissionMode = $state<SubmissionMode>('dry_run');
	let submissionReceipt = $state<SubmissionReceipt | null>(null);
	let selectedProfileId = $state(initialProfile.id);
	let profile = $state<TaxpayerProfile>({ ...initialProfile });
	let profiles = $state<TaxpayerProfile[]>([{ ...initialProfile }]);
	let formValues = $state<Record<string, string>>({
		...buildTaxpayerProfileFormValues(initialProfile),
		'frm1601EQ:txtYear': '2026',
		'frm1601EQ:optQuarter': 'Q1',
		'frm1601EQ:optAmendedReturn': 'N',
		'frm1601EQ:optTaxesWithheld': 'Y',
		'frm1601EQ:txtSheetsAttached': '0',
		'frm1601EQ:txtTotalTaxesWithheld': '0.00',
		'frm1601EQ:txtRemittanceFirstMonth': '0.00',
		'frm1601EQ:txtRemittanceSecondMonth': '0.00',
		'frm1601EQ:txtTaxRemittedPreviousReturn': '0.00',
		'frm1601EQ:txtOverremittancePreviousQuarter': '0.00',
		'frm1601EQ:txtTotalRemittances': '0.00',
		'frm1601EQ:txtTaxStillDue': '0.00',
		'frm1601EQ:txtSurcharge': '0.00',
		'frm1601EQ:txtInterest': '0.00',
		'frm1601EQ:txtCompromise': '0.00',
		'frm1601EQ:txtTotalPenalties': '0.00',
		'frm1601EQ:txtTotalAmountDue': '0.00'
	});

	let returnPeriod = $derived(
		`${formValues['frm1601EQ:txtYear'] || 'YYYY'}${formValues['frm1601EQ:optQuarter'] || 'Q'}`
	);
	let profileFilename = $derived(buildProfileFilename(profile));
	let returnFilename = $derived(
		buildReturnFilename({
			tin1: formValues['frm1601EQ:txtTIN1'] || profile.tin1,
			tin2: formValues['frm1601EQ:txtTIN2'] || profile.tin2,
			tin3: formValues['frm1601EQ:txtTIN3'] || profile.tin3,
			branchCode: formValues['frm1601EQ:txtBranchCode'] || profile.branchCode,
			formCode: '1601EQ',
			returnPeriod
		})
	);
	let activeTin = $derived(
		normalizeTinParts({
			tin1: formValues['frm1601EQ:txtTIN1'] || profile.tin1,
			tin2: formValues['frm1601EQ:txtTIN2'] || profile.tin2,
			tin3: formValues['frm1601EQ:txtTIN3'] || profile.tin3,
			branchCode: formValues['frm1601EQ:txtBranchCode'] || profile.branchCode
		})
	);
	let dispatcherTin = $derived(
		normalizeTinNumber({
			tin1: formValues['frm1601EQ:txtTIN1'] || profile.tin1,
			tin2: formValues['frm1601EQ:txtTIN2'] || profile.tin2,
			tin3: formValues['frm1601EQ:txtTIN3'] || profile.tin3
		})
	);
	let generatedXml = $derived(
		serializeLegacyXml({
			...formValues,
			txtEmail: formValues.txtEmail || profile.email,
			txtFinalFlag: finalFlag
		})
	);

	const tabs: Array<{ id: Tab; label: string }> = [
		{ id: 'profile', label: 'Profile' },
		{ id: 'forms', label: 'Forms' },
		{ id: 'saved', label: 'Saved Returns' },
		{ id: 'submission', label: 'Submission' }
	];

	function syncProfileToForm() {
		formValues = { ...formValues, ...buildTaxpayerProfileFormValues(profile) };
		statusMessage = 'Profile values copied into the active return.';
	}

	function startNewTaxpayerProfile() {
		profile = {
			id: '',
			tin1: '',
			tin2: '',
			tin3: '',
			branchCode: '0000',
			rdoCode: '',
			taxpayerName: '',
			address: '',
			address2: '',
			zipCode: '',
			contactNumber: '',
			category: 'P',
			email: ''
		};
		selectedProfileId = '';
		statusMessage = 'Ready for a new taxpayer profile.';
	}

	async function loadTaxpayerProfiles() {
		try {
			const store = createProfileStoreClient();
			const savedProfiles = await store.load();

			if (savedProfiles.length === 0) {
				return;
			}

			profiles = savedProfiles;
			selectedProfileId = savedProfiles[0].id;
			profile = { ...savedProfiles[0] };
			statusMessage = 'Taxpayer profiles loaded from disk.';
		} catch (error) {
			statusMessage = `Could not load taxpayer profiles: ${formatProfileStoreError(error)}`;
		}
	}

	async function saveTaxpayerProfile() {
		profiles = upsertTaxpayerProfile(profiles, profile);
		selectedProfileId = normalizeTinParts(profile);
		profile = { ...profiles.find((item) => item.id === selectedProfileId)! };

		try {
			const store = createProfileStoreClient();
			const receipt = await store.save(profile);
			statusMessage = `Taxpayer profile saved to ${receipt.path}.`;
		} catch (error) {
			statusMessage = `Taxpayer profile was not saved to disk: ${formatProfileStoreError(error)}`;
		}
	}

	function selectTaxpayerProfile(id: string) {
		const foundProfile = profiles.find((item) => item.id === id);

		if (!foundProfile) {
			return;
		}

		profile = { ...foundProfile };
		selectedProfileId = id;
		statusMessage = 'Taxpayer profile selected.';
	}

	function markFinalCopy() {
		finalFlag = '1';
		statusMessage = 'Final copy state set locally. Encryption and upload are next-phase work.';
	}

	function markNeedsResend() {
		finalFlag = '2';
		statusMessage = 'Return marked for resend, matching the legacy txtFinalFlag=2 state.';
	}

	function importLegacyXml() {
		const parsed = parseLegacyXml(importBuffer);
		formValues = { ...formValues, ...parsed };
		finalFlag = parsed.txtFinalFlag ?? finalFlag;
		statusMessage = 'Imported legacy pseudo-XML into the active form.';
	}

	async function submitCurrentReturn(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;
		submissionReceipt = null;
		statusMessage = 'Preparing submission package...';

		try {
			const submitReturn = createSubmissionClient();
			const receipt = await submitReturn({
				xml: generatedXml,
				returnFilename,
				formCode: '1601EQ',
				tin: dispatcherTin,
				email: formValues.txtEmail || profile.email,
				mode: submissionMode,
				dispatcher: undefined,
				fetchDispatcher: submissionMode === 'legacy_sftp'
			});

			submissionReceipt = receipt;
			finalFlag = receipt.finalFlag;
			statusMessage = receipt.message;
		} catch (error) {
			statusMessage = `Submission failed: ${formatSubmissionError(error)}`;
		} finally {
			isSubmitting = false;
		}
	}

	onMount(() => {
		void loadTaxpayerProfiles();
	});
</script>

<svelte:head>
	<title>eBIRForms Tauri</title>
</svelte:head>

<main class="codex-shell min-h-screen text-text-main">
	<header class="border-b border-line-soft bg-white/95 backdrop-blur">
		<div class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4">
			<div>
				<p class="codex-code font-semibold uppercase text-codex-accent">
					Tauri workspace
				</p>
				<h1 class="text-2xl font-semibold">eBIRForms Tauri</h1>
			</div>
			<div class="codex-code text-right text-text-muted">
				<p class="font-medium text-text-main">{returnFilename}</p>
				<p>Profile: {profileFilename}</p>
			</div>
		</div>
	</header>

	<div class="mx-auto grid max-w-7xl gap-5 px-5 py-5 lg:grid-cols-[220px_1fr]">
		<nav class="h-fit rounded-panel bg-codex-rail p-2 shadow-[0_14px_40px_rgba(32,33,35,0.16)]">
			{#each tabs as tab (tab.id)}
				<button
					class={[
						'mb-1 w-full rounded-md px-3 py-2 text-left text-sm font-medium transition',
						activeTab === tab.id
							? 'bg-white text-codex-rail'
							: 'text-white/64 hover:bg-white/10 hover:text-white'
					]}
					type="button"
					onclick={() => (activeTab = tab.id)}
				>
					{tab.label}
				</button>
			{/each}
		</nav>

		<section class="grid gap-5">
			<div class="codex-section">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div>
						<p class="text-sm font-semibold text-text-main">Current status</p>
						<p class="text-sm text-text-muted">{statusMessage}</p>
					</div>
					<span class="codex-code rounded-md border border-line-soft bg-surface-muted px-2 py-1 font-semibold">
						txtFinalFlag={finalFlag}
					</span>
				</div>
			</div>

			{#if activeTab === 'profile'}
				<section class="codex-section">
					<div class="mb-4 flex items-start justify-between gap-4">
						<div>
							<h2 class="text-lg font-semibold">Taxpayer Profile</h2>
							<p class="text-sm text-text-muted">Manage saved taxpayer details for returns.</p>
						</div>
						<div class="flex flex-wrap justify-end gap-2">
							<button
								class="codex-button"
								type="button"
								onclick={startNewTaxpayerProfile}
							>
								New profile
							</button>
							<button
								class="codex-button-warn"
								type="button"
								onclick={saveTaxpayerProfile}
							>
								Save profile
							</button>
							<button
								class="codex-button-primary"
								type="button"
								onclick={syncProfileToForm}
							>
								Apply to form
							</button>
						</div>
					</div>

					<div class="mb-4 overflow-hidden rounded-md border border-line-soft">
						<table class="codex-table">
							<thead>
								<tr>
									<th>TIN</th>
									<th>Taxpayer</th>
									<th>RDO</th>
									<th>Category</th>
									<th>Email</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{#each profiles as savedProfile (savedProfile.id)}
									<tr>
										<td class="codex-code font-semibold">{savedProfile.id}</td>
										<td>{savedProfile.taxpayerName}</td>
										<td>{savedProfile.rdoCode}</td>
										<td>{savedProfile.category === 'G' ? 'Government' : 'Private'}</td>
										<td>{savedProfile.email}</td>
										<td>
											<button
												class={[
													'rounded-md px-2 py-1 text-xs font-semibold transition',
													selectedProfileId === savedProfile.id
														? 'bg-codex-accent text-white'
														: 'border border-line-soft hover:bg-surface-muted'
												]}
												type="button"
												onclick={() => selectTaxpayerProfile(savedProfile.id)}
											>
												Select
											</button>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
						<label class="codex-label">
							<span class="codex-label-text">TIN 1</span>
							<input class="codex-input" bind:value={profile.tin1} />
						</label>
						<label class="codex-label">
							<span class="codex-label-text">TIN 2</span>
							<input class="codex-input" bind:value={profile.tin2} />
						</label>
						<label class="codex-label">
							<span class="codex-label-text">TIN 3</span>
							<input class="codex-input" bind:value={profile.tin3} />
						</label>
						<label class="codex-label">
							<span class="codex-label-text">Branch Code</span>
							<input class="codex-input" bind:value={profile.branchCode} />
						</label>
						<label class="codex-label">
							<span class="codex-label-text">RDO Code</span>
							<input class="codex-input" bind:value={profile.rdoCode} />
						</label>
						<label class="codex-label md:col-span-2">
							<span class="codex-label-text">Taxpayer Name</span>
							<input class="codex-input" bind:value={profile.taxpayerName} />
						</label>
						<label class="codex-label md:col-span-2">
							<span class="codex-label-text">Registered Address</span>
							<input class="codex-input" bind:value={profile.address} />
						</label>
						<label class="codex-label md:col-span-2">
							<span class="codex-label-text">Registered Address Line 2</span>
							<input class="codex-input" bind:value={profile.address2} />
						</label>
						<label class="codex-label">
							<span class="codex-label-text">ZIP Code</span>
							<input class="codex-input" bind:value={profile.zipCode} />
						</label>
						<label class="codex-label">
							<span class="codex-label-text">Contact Number</span>
							<input class="codex-input" bind:value={profile.contactNumber} />
						</label>
						<label class="codex-label">
							<span class="codex-label-text">Category</span>
							<select class="codex-input" bind:value={profile.category}>
								<option value="P">Private</option>
								<option value="G">Government</option>
							</select>
						</label>
						<label class="codex-label">
							<span class="codex-label-text">Email</span>
							<input class="codex-input" bind:value={profile.email} />
						</label>
					</div>
				</section>
			{:else if activeTab === 'forms'}
				<section class="codex-section">
					<div class="mb-4 grid gap-2">
						<h2 class="text-lg font-semibold">Available Forms</h2>
						<div class="overflow-hidden rounded-md border border-line-soft">
							<table class="codex-table">
								<thead>
									<tr>
										<th>Code</th>
										<th>Title</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{#each forms as form (form.code)}
										<tr>
											<td class="codex-code font-semibold">{form.code}</td>
											<td>{form.title}</td>
											<td>{form.status}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>

					{#if selectedForm}
						<Form1601EQ definition={selectedForm} bind:values={formValues} />
					{/if}
				</section>
			{:else if activeTab === 'saved'}
				<section class="codex-section grid gap-4">
					<div class="flex flex-wrap gap-2">
						<button
							class="codex-button-primary"
							type="button"
							onclick={markFinalCopy}
						>
							Mark final copy
						</button>
						<button
							class="codex-button"
							type="button"
							onclick={markNeedsResend}
						>
							Mark for resend
						</button>
					</div>
					<label class="codex-label">
						<span class="codex-label-text">Generated legacy pseudo-XML</span>
						<textarea
							class="codex-input min-h-56 bg-surface-muted p-3 font-mono text-xs"
							readonly
							value={generatedXml}
						></textarea>
					</label>
					<label class="codex-label">
						<span class="codex-label-text">Import pseudo-XML</span>
						<textarea
							class="codex-input min-h-36 p-3 font-mono text-xs"
							bind:value={importBuffer}
						></textarea>
					</label>
					<button
						class="codex-button-warn w-fit"
						type="button"
						onclick={importLegacyXml}
					>
						Import into form
					</button>
				</section>
			{:else}
				<section class="codex-section grid gap-4">
					<div>
						<h2 class="text-lg font-semibold">Submission Adapter</h2>
						<p class="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
							Dry run writes the legacy savefile and email-named RDO copy without contacting BIR.
							Legacy SFTP uses the extracted helper only when explicitly selected.
						</p>
					</div>

					<form class="grid gap-4" onsubmit={submitCurrentReturn}>
						<div class="grid gap-3 md:grid-cols-3">
							<label class="codex-label">
								<span class="codex-label-text">Mode</span>
								<select
									class="codex-input"
									bind:value={submissionMode}
								>
									<option value="dry_run">Dry run</option>
									<option value="legacy_sftp">Legacy SFTP helper</option>
								</select>
							</label>
							<label class="codex-label">
								<span class="codex-label-text">TIN</span>
								<input class="codex-input codex-code" readonly value={activeTin} />
							</label>
							<label class="codex-label">
								<span class="codex-label-text">Return file</span>
								<input class="codex-input codex-code" readonly value={returnFilename} />
							</label>
						</div>

						{#if submissionMode === 'legacy_sftp'}
							<div class="grid gap-3 rounded-md border border-line-soft bg-surface-muted p-3">
								<p class="text-sm font-medium text-text-muted">
									Direct dispatcher settings are loaded from BIR during submission.
								</p>
							</div>
						{/if}

						<button
							class="codex-button-accent w-fit"
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Submitting...' : 'Submit return'}
						</button>
					</form>

					{#if submissionReceipt}
						<div class="grid gap-2 rounded-md border border-line-soft bg-surface-muted p-3 text-sm">
							<p class="font-semibold text-text-main">Receipt: {submissionReceipt.status}</p>
							<p class="text-text-muted">Final flag: {submissionReceipt.finalFlag}</p>
							<p class="codex-code break-all text-text-muted">Savefile: {submissionReceipt.savePath}</p>
							<p class="codex-code break-all text-text-muted">RDO copy: {submissionReceipt.sendPath}</p>
							{#if submissionReceipt.logPath}
								<p class="codex-code break-all text-text-muted">
									Log: {submissionReceipt.logPath}
								</p>
							{/if}
							{#if submissionReceipt.dispatcherUrl}
								<p class="codex-code break-all text-text-muted">
									Dispatcher: {submissionReceipt.dispatcherUrl}
								</p>
							{/if}
						</div>
					{/if}
				</section>
			{/if}
		</section>
	</div>
</main>
