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
	forms = listForms();
	selectedForm = getFormDefinition('1601EQ');
	importBuffer = $state('');
	finalFlag = $state('0');
	isSavingDraft = $state(false);
	isSubmitting = $state(false);
	isLoadingProfiles = $state(false);
	statusMessage = $state('Choose a taxpayer to begin a return.');
	submissionMode = $state<SubmissionMode>('dry_run');
	submissionReceipt = $state<SubmissionReceipt | null>(null);
	selectedProfileId = $state(initialProfile.id);
	profile = $state<TaxpayerProfile>({ ...initialProfile });
	profiles = $state<TaxpayerProfile[]>([{ ...initialProfile }]);
	formValues = $state<Record<string, string>>(createInitialFormValues(initialProfile));

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
			...this.formValues,
			txtEmail: this.formValues.txtEmail || this.profile.email,
			txtFinalFlag: this.finalFlag
		})
	);

	async loadTaxpayerProfiles() {
		if (this.isLoadingProfiles) {
			return;
		}

		this.isLoadingProfiles = true;

		try {
			const store = createProfileStoreClient();
			const savedProfiles = await store.load();

			if (savedProfiles.length === 0) {
				return;
			}

			this.profiles = savedProfiles;
			this.selectedProfileId = savedProfiles[0].id;
			this.profile = { ...savedProfiles[0] };
			this.formValues = {
				...this.formValues,
				...buildTaxpayerProfileFormValues(savedProfiles[0])
			};
			this.statusMessage = 'Taxpayer profiles loaded from disk.';
		} catch (error) {
			this.statusMessage = `Could not load taxpayer profiles: ${formatProfileStoreError(error)}`;
		} finally {
			this.isLoadingProfiles = false;
		}
	}

	startNewTaxpayerProfile() {
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
		this.statusMessage = 'Ready for a new taxpayer profile.';
	}

	async saveTaxpayerProfile() {
		this.profiles = upsertTaxpayerProfile(this.profiles, this.profile);
		this.selectedProfileId = normalizeTinParts(this.profile);
		this.profile = { ...this.profiles.find((item) => item.id === this.selectedProfileId)! };

		try {
			const store = createProfileStoreClient();
			const receipt = await store.save(this.profile);
			this.statusMessage = `Taxpayer profile saved to ${receipt.path}.`;
		} catch (error) {
			this.statusMessage = `Taxpayer profile was not saved to disk: ${formatProfileStoreError(error)}`;
		}
	}

	selectTaxpayerProfile(id: string) {
		const foundProfile = this.profiles.find((item) => item.id === id);

		if (!foundProfile) {
			return;
		}

		this.profile = { ...foundProfile };
		this.selectedProfileId = id;
		this.formValues = { ...this.formValues, ...buildTaxpayerProfileFormValues(foundProfile) };
		this.statusMessage = 'Taxpayer profile selected.';
	}

	syncProfileToForm() {
		this.formValues = { ...this.formValues, ...buildTaxpayerProfileFormValues(this.profile) };
		this.statusMessage = 'Profile values copied into the active return.';
	}

	async saveDraft() {
		this.isSavingDraft = true;
		this.submissionReceipt = null;
		this.statusMessage = 'Saving draft return...';

		try {
			const submitReturn = createSubmissionClient();
			const receipt = await submitReturn({
				xml: this.generatedXml,
				returnFilename: this.returnFilename,
				formCode: '1601EQ',
				tin: this.dispatcherTin,
				email: this.formValues.txtEmail || this.profile.email,
				mode: 'dry_run',
				dispatcher: undefined,
				fetchDispatcher: false
			});

			this.submissionReceipt = receipt;
			this.finalFlag = receipt.finalFlag;
			this.statusMessage = receipt.message;
		} catch (error) {
			this.statusMessage = `Draft save failed: ${formatSubmissionError(error)}`;
		} finally {
			this.isSavingDraft = false;
		}
	}

	markFinalCopy() {
		this.finalFlag = '1';
		this.statusMessage = 'Final copy state set locally. Encryption and upload are next-phase work.';
	}

	markNeedsResend() {
		this.finalFlag = '2';
		this.statusMessage = 'Return marked for resend, matching the legacy txtFinalFlag=2 state.';
	}

	importLegacyXml() {
		const parsed = parseLegacyXml(this.importBuffer);
		this.formValues = { ...this.formValues, ...parsed };
		this.finalFlag = parsed.txtFinalFlag ?? this.finalFlag;
		this.statusMessage = 'Imported legacy pseudo-XML into the active form.';
	}

	async submitCurrentReturn() {
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

			this.submissionReceipt = receipt;
			this.finalFlag = receipt.finalFlag;
			this.statusMessage = receipt.message;
		} catch (error) {
			this.statusMessage = `Submission failed: ${formatSubmissionError(error)}`;
		} finally {
			this.isSubmitting = false;
		}
	}
}

export const ebirformsWorkspace = new EbirformsWorkspace();
