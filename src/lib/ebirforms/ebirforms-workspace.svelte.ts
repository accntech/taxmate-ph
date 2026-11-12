import { loadCreatedReturnsData, saveCreatedReturnsData, type CreatedReturn, type CreatedReturnStatus } from './created-returns';
import { getFormDefinition, listForms } from '$lib/forms';
import { calculate1601EQ, validate1601EQ } from '$lib/forms/form-1601-eq-rules';
import { parseLegacyXml, serializeLegacyXml } from '$lib/legacy/xml';
import {
	buildProfileFilename,
	buildReturnFilename,
	buildTaxpayerProfileFormValues,
	normalizeTinNumber,
	normalizeTinParts,
	upsertTaxpayerProfile,
	validateTaxpayerProfile,
	type TaxpayerProfile
} from '$lib/profiles/profile';
import { createProfileStoreClient, formatProfileStoreError } from '$lib/tauri/profile-store';
import {
	createSubmissionClient,
	formatSubmissionError,
	type SubmissionMode,
	type SubmissionReceipt
} from '$lib/tauri/submission';

export const initialProfile: TaxpayerProfile = {
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

export function createInitialFormValues(profile: TaxpayerProfile): Record<string, string> {
	return {
		...buildTaxpayerProfileFormValues(profile),
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
	};
}

class EbirformsWorkspace {
	#pendingReturn = $state<CreatedReturn | null>(null);
	#profileLoad: Promise<void> | null = null;
	#workingCopiesLoaded = false;
	#workingCopiesLoadFailed = false;
	createdReturns = $state<CreatedReturn[]>([]);
	archivedTaxpayerIds = $state<string[]>([]);
	activeReturnId = $state<string | null>(null);
	forms = listForms();
	selectedForm = getFormDefinition('1601EQ');
	importBuffer = $state('');
	finalFlag = $state('0');
	validationErrors = $state<Record<string, string>>({});
	historyRevision = $state(0);
	isSavingDraft = $state(false);
	isSubmitting = $state(false);
	isLoadingProfiles = $state(false);
	profileLoadState = $state<'idle' | 'loading' | 'loaded' | 'error'>('idle');
	profileLoadError = $state('');
	profileLoadErrorDetails = $state('');
	hasLoadedProfiles = $state(false);
	statusMessage = $state('Choose a taxpayer to begin a return.');
	submissionMode = $state<SubmissionMode>('dry_run');
	submissionReceipt = $state<SubmissionReceipt | null>(null);
	selectedProfileId = $state(initialProfile.id);
	profile = $state<TaxpayerProfile>({ ...initialProfile });
	profiles = $state<TaxpayerProfile[]>([{ ...initialProfile }]);
	formValues = $state<Record<string, string>>(createInitialFormValues(initialProfile));

	get hasUnsavedChanges(): boolean {
		const active = this.createdReturns.find(item => item.id === this.activeReturnId);
		return this.#pendingReturn?.id === this.activeReturnId || !!active && JSON.stringify(active.values) !== JSON.stringify(this.formValues);
	}

	get currentReturnStatus(): CreatedReturnStatus {
		if (this.hasUnsavedChanges) return 'Draft';
		return this.createdReturns.find(item => item.id === this.activeReturnId)?.status ?? 'Draft';
	}

	editFormField(id: string, value: string): void {
		this.updateFormValues({ [id]: value });
	}

	updateFormValues(patch: Record<string, string>): void {
		if (!Object.entries(patch).some(([id, value]) => this.formValues[id] !== value)) return;
		Object.assign(this.formValues, patch);
		this.finalFlag = '0';
		this.submissionReceipt = null;
		this.statusMessage = 'Unsaved changes.';
		if (Object.keys(this.validationErrors).length) {
			this.validationErrors = validate1601EQ(this.formValues);
		}
	}

	discardReturnChanges(): void {
		this.#pendingReturn = null;
		if (this.activeReturnId && this.createdReturns.some(item => item.id === this.activeReturnId)
			&& this.openReturn(this.activeReturnId)) return;
		this.activeReturnId = null;
		this.formValues = createInitialFormValues(this.profile);
		this.finalFlag = '0';
		this.validationErrors = {};
		this.submissionReceipt = null;
		this.importBuffer = '';
		this.statusMessage = 'Unsaved form discarded.';
	}

	returnPeriod = $derived(
		`${this.formValues['frm1601EQ:txtYear'] || 'YYYY'}${
			this.formValues['frm1601EQ:optQuarter'] || 'Q'
		}`
	);
	profileFilename = $derived(buildProfileFilename(this.profile));
	returnFilename = $derived(
		buildReturnFilename({
			tin1: this.formValues['frm1601EQ:txtTIN1'] || this.profile.tin1,
			tin2: this.formValues['frm1601EQ:txtTIN2'] || this.profile.tin2,
			tin3: this.formValues['frm1601EQ:txtTIN3'] || this.profile.tin3,
			branchCode: this.formValues['frm1601EQ:txtBranchCode'] || this.profile.branchCode,
			formCode: '1601EQ',
			returnPeriod: this.returnPeriod
		})
	);
	activeTin = $derived(
		normalizeTinParts({
			tin1: this.formValues['frm1601EQ:txtTIN1'] || this.profile.tin1,
			tin2: this.formValues['frm1601EQ:txtTIN2'] || this.profile.tin2,
			tin3: this.formValues['frm1601EQ:txtTIN3'] || this.profile.tin3,
			branchCode: this.formValues['frm1601EQ:txtBranchCode'] || this.profile.branchCode
		})
	);
	dispatcherTin = $derived(
		normalizeTinNumber({
			tin1: this.formValues['frm1601EQ:txtTIN1'] || this.profile.tin1,
			tin2: this.formValues['frm1601EQ:txtTIN2'] || this.profile.tin2,
			tin3: this.formValues['frm1601EQ:txtTIN3'] || this.profile.tin3
		})
	);
	generatedXml = $derived(
		serializeLegacyXml({
			...calculate1601EQ(this.formValues),
			txtEmail: this.formValues.txtEmail || this.profile.email,
			txtFinalFlag: this.finalFlag
		})
	);


	loadCreatedReturns(): boolean {
		try {
			const data = loadCreatedReturnsData();
			this.createdReturns = data.returns;
			this.archivedTaxpayerIds = data.archivedTaxpayerIds;
			this.#workingCopiesLoaded = true;
			this.#workingCopiesLoadFailed = false;
			return true;
		} catch (error) {
			this.#workingCopiesLoadFailed = true;
			this.statusMessage = `Could not load saved forms: ${formatSubmissionError(error)}`;
			return false;
		}
	}

	#persistWorkingCopies(returns: CreatedReturn[], archivedTaxpayerIds = this.archivedTaxpayerIds): boolean {
		if (this.#workingCopiesLoadFailed || (!this.#workingCopiesLoaded && !this.loadCreatedReturns())) return false;
		try {
			saveCreatedReturnsData({ version: 1, returns, archivedTaxpayerIds });
			this.createdReturns = returns;
			this.archivedTaxpayerIds = archivedTaxpayerIds;
			return true;
		} catch (error) {
			this.statusMessage = `Changes were not saved: ${formatSubmissionError(error)}`;
			return false;
		}
	}

	createReturn(taxpayerId: string, formCode: string): string | null {
		if (this.isSavingDraft || this.isSubmitting) return null;
		if ((!this.#workingCopiesLoaded && !this.loadCreatedReturns()) || this.#workingCopiesLoadFailed) return null;
		const profile = this.profiles.find(item => item.id === taxpayerId);
		const form = getFormDefinition(formCode);
		if (!profile || !form || form.status !== 'ready' || this.archivedTaxpayerIds.includes(taxpayerId)) {
			this.statusMessage = 'Choose an active taxpayer and an available form.';
			return null;
		}
		const values = createInitialFormValues(profile);
		const id = crypto.randomUUID();
		const record: CreatedReturn = {
			id, taxpayerId, formCode, values, returnPeriod: `${values['frm1601EQ:txtYear']}${values['frm1601EQ:optQuarter']}`,
			status: 'Draft', finalFlag: '0', updatedAt: Date.now()
		};
		this.#pendingReturn = record;
		this.openReturn(id);
		this.statusMessage = 'New form. Choose Save to create it on this device.';
		return id;
	}

	openReturn(id: string): boolean {
		if (this.isSavingDraft || this.isSubmitting) return false;
		if ((!this.#workingCopiesLoaded && !this.loadCreatedReturns()) || this.#workingCopiesLoadFailed) return false;
		const record = this.createdReturns.find(item => item.id === id) ?? (this.#pendingReturn?.id === id ? this.#pendingReturn : undefined);
		const form = record && getFormDefinition(record.formCode);
		if (!record || !form || !this.profiles.some(item => item.id === record.taxpayerId)) {
			this.statusMessage = 'The saved form or its taxpayer could not be found.';
			return false;
		}
		this.selectTaxpayerProfile(record.taxpayerId);
		this.activeReturnId = id;
		this.selectedForm = form;
		this.formValues = { ...record.values };
		this.finalFlag = record.finalFlag;
		this.validationErrors = {};
		this.submissionReceipt = null;
		this.importBuffer = '';
		this.statusMessage = 'Saved form opened.';
		return true;
	}

	saveActiveReturn(status?: CreatedReturnStatus): boolean {
		const active = this.createdReturns.find(item => item.id === this.activeReturnId)
			?? (this.#pendingReturn?.id === this.activeReturnId ? this.#pendingReturn : undefined);
		if (!active || active.taxpayerId !== this.selectedProfileId) {
			this.statusMessage = 'Open or create a saved form before saving changes.';
			return false;
		}
		const nextStatus = status ?? (this.hasUnsavedChanges ? 'Draft' : active.status);
		const calculated = calculate1601EQ(this.formValues);
		const values = { ...this.formValues };
		// Keep raw draft inputs intact; only refresh fields the form calculates.
		for (const name of ['txtTotalTaxesWithheld', 'txtTotalRemittances', 'txtTaxStillDue', 'txtTotalPenalties', 'txtTotalAmountDue']) {
			values[`frm1601EQ:${name}`] = calculated[`frm1601EQ:${name}`];
		}
		for (const row of [13, 14, 15, 16, 17, 18]) {
			for (const part of ['txtTaxRate', 'txtTaxWithheld']) {
				const id = `frm1601EQ:${part}${row}`;
				if (id in calculated) values[id] = calculated[id];
			}
		}
		const record: CreatedReturn = { ...active, values, returnPeriod: this.returnPeriod,
			status: nextStatus, finalFlag: nextStatus === 'Draft' ? '0' : this.finalFlag, updatedAt: Date.now() };
		const returns = this.createdReturns.some(item => item.id === active.id)
			? this.createdReturns.map(item => item.id === active.id ? record : item)
			: [...this.createdReturns, record];
		if (!this.#persistWorkingCopies(returns)) return false;
		this.#pendingReturn = null;
		this.formValues = { ...values };
		this.finalFlag = record.finalFlag;
		this.statusMessage = 'Form changes saved on this device.';
		return true;
	}

	#returnForLifecycleChange(id: string): CreatedReturn | undefined {
		if (this.isSavingDraft || this.isSubmitting) {
			this.statusMessage = 'Wait for the current operation to finish before changing saved forms.';
			return;
		}
		if ((!this.#workingCopiesLoaded && !this.loadCreatedReturns()) || this.#workingCopiesLoadFailed) return;
		const record = this.createdReturns.find(item => item.id === id);
		if (!record) this.statusMessage = 'The saved form could not be found.';
		return record;
	}

	archiveReturn(id: string): boolean {
		const record = this.#returnForLifecycleChange(id);
		if (!record) return false;
		const archived = { ...record, archived: true, updatedAt: Date.now() };
		if (!this.#persistWorkingCopies(this.createdReturns.map(item => item.id === id ? archived : item))) return false;
		this.statusMessage = 'Form archived. The saved return has been retained.';
		return true;
	}

	restoreReturn(id: string): boolean {
		const record = this.#returnForLifecycleChange(id);
		if (!record) return false;
		const restored = { ...record, archived: false, updatedAt: Date.now() };
		if (!this.#persistWorkingCopies(this.createdReturns.map(item => item.id === id ? restored : item))) return false;
		this.statusMessage = 'Form restored.';
		return true;
	}

	deleteReturn(id: string): boolean {
		if (!this.#returnForLifecycleChange(id)) return false;
		if (!this.#persistWorkingCopies(this.createdReturns.filter(item => item.id !== id))) return false;
		if (this.activeReturnId === id) {
			this.activeReturnId = null;
			this.formValues = createInitialFormValues(this.profile);
			this.finalFlag = '0';
			this.validationErrors = {};
			this.submissionReceipt = null;
			this.importBuffer = '';
		}
		this.statusMessage = 'Saved form deleted. Submission history has been kept.';
		return true;
	}

	archiveTaxpayerProfile(id: string): boolean {
		if (!this.#workingCopiesLoaded && !this.loadCreatedReturns()) return false;
		if (!this.profiles.some(item => item.id === id)) return false;
		if (!this.#persistWorkingCopies(this.createdReturns, [...new Set([...this.archivedTaxpayerIds, id])])) return false;
		this.statusMessage = 'Taxpayer archived. Their saved forms are retained.';
		return true;
	}

	restoreTaxpayerProfile(id: string): boolean {
		if (!this.#workingCopiesLoaded && !this.loadCreatedReturns()) return false;
		if (!this.#persistWorkingCopies(this.createdReturns, this.archivedTaxpayerIds.filter(item => item !== id))) return false;
		this.statusMessage = 'Taxpayer restored.';
		return true;
	}

	loadTaxpayerProfiles(): Promise<void> {
		if (this.#profileLoad) return this.#profileLoad;
		this.isLoadingProfiles = true;
		this.profileLoadState = 'loading';
		this.profileLoadError = '';
		this.profileLoadErrorDetails = '';
		this.#profileLoad = Promise.resolve()
			.then(async () => {
				try {
					const store = createProfileStoreClient();
					const savedProfiles = await store.load();
					this.profileLoadState = 'loaded';
					this.hasLoadedProfiles = true;

					if (savedProfiles.length === 0) {
						this.profiles = [];
						this.startNewTaxpayerProfile();
						this.statusMessage = 'No saved taxpayers. Create a taxpayer to begin.';
						return;
					}

					this.profiles = savedProfiles;
					const selected = savedProfiles.find(item => item.id === this.selectedProfileId) ?? savedProfiles[0];
					this.selectTaxpayerProfile(selected.id);
					this.statusMessage = 'Taxpayer profiles loaded from disk.';
				} catch (error) {
					this.profileLoadState = 'error';
					this.profileLoadError = 'Taxpayer profiles could not be loaded. Try again.';
					this.profileLoadErrorDetails = formatProfileStoreError(error);
					this.statusMessage = this.profileLoadError;
				}
			})
			.finally(() => {
				this.isLoadingProfiles = false;
				this.#profileLoad = null;
			});
		return this.#profileLoad;
	}

	startNewTaxpayerProfile() {
		this.#pendingReturn = null;
		this.profile = {
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
		this.selectedProfileId = '';
		this.activeReturnId = null;
		this.finalFlag = '0';
		this.submissionReceipt = null;
		this.validationErrors = {};
		this.importBuffer = '';
		this.formValues = createInitialFormValues(this.profile);
		this.statusMessage = 'Ready for a new taxpayer profile.';
	}

	async saveTaxpayerProfile(rawTin?: string) {
		if (Object.keys(validateTaxpayerProfile(this.profile, rawTin)).length > 0) {
			this.statusMessage = 'Profile not saved. Correct the highlighted details and try again.';
			return false;
		}
		const profiles = upsertTaxpayerProfile(this.profiles, this.profile);
		const id = normalizeTinParts(this.profile);
		const profile = { ...profiles.find((item) => item.id === id)! };
		try {
			const store = createProfileStoreClient();
			const receipt = await store.save(profile);
			this.profiles = profiles;
			this.selectedProfileId = id;
			this.profile = profile;
			this.statusMessage = `Taxpayer profile saved to ${receipt.path}.`;
			return true;
		} catch (error) {
			this.statusMessage = `Taxpayer profile was not saved to disk: ${formatProfileStoreError(error)}`;
			return false;
		}
	}

	selectTaxpayerProfile(id: string) {
		const foundProfile = this.profiles.find((item) => item.id === id);

		if (!foundProfile) {
			return;
		}

		if (this.selectedProfileId !== id) {
			this.formValues = createInitialFormValues(foundProfile);
			this.finalFlag = '0';
			this.validationErrors = {};
			this.submissionReceipt = null;
			this.activeReturnId = null;
			this.importBuffer = '';
		}
		this.profile = { ...foundProfile };
		this.selectedProfileId = id;
		if (!this.activeReturnId) {
			this.formValues = { ...this.formValues, ...buildTaxpayerProfileFormValues(foundProfile) };
		}
		this.statusMessage = 'Taxpayer profile selected.';
	}

	async saveDraft() {
		if (this.isSavingDraft || this.isSubmitting) return;
		if (this.activeReturnId && !this.saveActiveReturn('Draft')) return;
		const draftId = this.activeReturnId;
		const taxpayerId = this.selectedProfileId;
		const draftValues = { ...this.formValues };
		this.isSavingDraft = true;
		this.submissionReceipt = null;
		this.statusMessage = 'Saving draft return...';

		try {
			const submitReturn = createSubmissionClient();
			const receipt = await submitReturn({
				xml: serializeLegacyXml({
					...this.formValues,
					txtEmail: this.formValues.txtEmail || this.profile.email,
					txtFinalFlag: '2'
				}),
				returnFilename: this.returnFilename,
				formCode: '1601EQ',
				tin: this.dispatcherTin,
				email: this.formValues.txtEmail || this.profile.email,
				mode: 'dry_run',
				dispatcher: undefined,
				fetchDispatcher: false
			});

			if (this.activeReturnId === draftId && this.selectedProfileId === taxpayerId) {
				const unchanged = JSON.stringify(this.formValues) === JSON.stringify(draftValues);
				this.submissionReceipt = unchanged ? receipt : null;
				this.finalFlag = unchanged ? receipt.finalFlag : '0';
				this.statusMessage = receipt.message;
			}
		} catch (error) {
			if (this.activeReturnId === draftId && this.selectedProfileId === taxpayerId) {
				this.statusMessage = `Draft save failed: ${formatSubmissionError(error)}`;
			}
		} finally {
			this.isSavingDraft = false;
		}
	}

	validateReturn({ applyCalculations = true }: { applyCalculations?: boolean } = {}) {
		this.validationErrors = validate1601EQ(this.formValues);
		if (Object.keys(this.validationErrors).length) {
			this.statusMessage =
				'Correct the highlighted return details before saving, finalizing or submitting.';
			return false;
		}
		if (applyCalculations) this.formValues = calculate1601EQ(this.formValues);
		return true;
	}

	markFinalCopy() {
		if (!this.validateReturn()) return;
		const previousFlag = this.finalFlag;
		this.finalFlag = '1';
		if (this.activeReturnId && !this.saveActiveReturn('Final')) { this.finalFlag = previousFlag; return; }
		this.statusMessage = 'Return validated and marked final locally. Submit to send it to BIR.';
	}

	markNeedsResend() {
		const previousFlag = this.finalFlag;
		this.finalFlag = '2';
		if (this.activeReturnId && !this.saveActiveReturn('For resubmission')) { this.finalFlag = previousFlag; return; }
		this.statusMessage = 'Return marked for resend, matching the legacy txtFinalFlag=2 state.';
	}

	importLegacyXml() {
		const parsed = parseLegacyXml(this.importBuffer);
		this.formValues = { ...this.formValues, ...parsed };
		this.finalFlag = parsed.txtFinalFlag ?? this.finalFlag;
		this.statusMessage = 'Imported legacy pseudo-XML into the active form.';
	}

	async submitCurrentReturn() {
		if (this.isSubmitting || this.isSavingDraft || !this.validateReturn()) return;
		// Capture the exact return being transmitted before yielding to the client.
		// Navigation and edits while the upload runs must not alter its saved identity.
		const returnId = this.activeReturnId;
		const taxpayerId = this.selectedProfileId;
		const submittedValues = { ...this.formValues };
		const submittedPeriod = this.returnPeriod;
		this.isSubmitting = true;
		this.submissionReceipt = null;
		this.statusMessage = 'Preparing submission package...';

		try {
			const submitReturn = createSubmissionClient();
			const receipt = await submitReturn({
				xml: this.generatedXml,
				returnFilename: this.returnFilename,
				formCode: '1601EQ',
				tin: this.dispatcherTin,
				email: this.formValues.txtEmail || this.profile.email,
				mode: this.submissionMode,
				dispatcher: undefined,
				fetchDispatcher: this.submissionMode === 'legacy_sftp'
			});
			const current = this.activeReturnId === returnId && this.selectedProfileId === taxpayerId;
			const unchanged = current && JSON.stringify(this.formValues) === JSON.stringify(submittedValues);
			if (current) {
				this.submissionReceipt = unchanged ? receipt : null;
				this.finalFlag = unchanged ? receipt.finalFlag : '0';
				this.statusMessage = receipt.message;
			}
			if (receipt.status === 'submitted') this.historyRevision += 1;
			if (returnId && receipt.status !== 'failed') {
				const active = this.createdReturns.find(item => item.id === returnId && item.taxpayerId === taxpayerId);
				if (active) {
					const status: CreatedReturnStatus = receipt.status === 'submitted' ? 'Submitted' : receipt.finalFlag === '1' ? 'Final' : 'Draft';
					const record: CreatedReturn = { ...active, values: submittedValues, returnPeriod: submittedPeriod,
						status, finalFlag: receipt.finalFlag, updatedAt: Date.now() };
					if (!this.#persistWorkingCopies(this.createdReturns.map(item => item.id === returnId ? record : item))) {
						this.statusMessage = `${receipt.message} The working copy could not be updated on this device.`;
					}
				}
			}
		} catch (error) {
			if (this.activeReturnId === returnId && this.selectedProfileId === taxpayerId) {
				this.statusMessage = `Submission failed: ${formatSubmissionError(error)}`;
			}

		} finally {
			this.isSubmitting = false;
		}
	}
}

export const ebirformsWorkspace = new EbirformsWorkspace();
