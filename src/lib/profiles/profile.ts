import { isPackagedRdoCode } from './rdo-codes';

export type TinParts = {
	tin1: string;
	tin2: string;
	tin3: string;
	branchCode: string;
};

export type ReturnFilenameInput = TinParts & {
	formCode: string;
	returnPeriod: string;
	version?: number;
};

export type TaxpayerSize = 'micro' | 'small' | 'medium' | 'large' | '';

export const individualTaxpayerTypeOptions = [
	{ value: '', label: 'Not specified' },
	{ value: 'single-proprietor', label: 'Single' },
	{ value: 'professional', label: 'Professional' },
	{ value: 'estate', label: 'Estate' },
	{ value: 'trust', label: 'Trust' },
	{ value: 'compensation', label: 'Compensation earner', legacy: true },
	{ value: 'mixed-income', label: 'Mixed income earner', legacy: true }
] as const;
export type IndividualTaxpayerType = (typeof individualTaxpayerTypeOptions)[number]['value'];

const civilStatuses = ['Single', 'Married', 'Separated', 'Widowed'] as const;
export type CivilStatus = (typeof civilStatuses)[number];

export type TaxpayerSpouse = Partial<TinParts & {
	taxpayerName: string;
	rdoCode: string;
	birthDate: string;
	citizenship: string;
	address: string;
	address2: string;
	zipCode: string;
	contactNumber: string;
	email: string;
}>;

export type TaxpayerProfileInput = TinParts & {
	rdoCode: string;
	taxpayerName: string;
	address: string;
	address2: string;
	zipCode: string;
	contactNumber: string;
	category: string;
	email: string;
	tradeName?: string;
	lineOfBusiness?: string;
	taxpayerClassification?: 'I' | 'N' | '';
	taxpayerType?: IndividualTaxpayerType;
	psicCode?: string;
	psocCode?: string;
	taxpayerSize?: TaxpayerSize;
	birthDate?: string;
	citizenship?: string;
	civilStatus?: CivilStatus | '';
	spouse?: TaxpayerSpouse;
};

export type TaxpayerProfile = TaxpayerProfileInput & {
	id: string;
};

export type ProfileValidationErrors = Partial<
	Record<
		'taxpayerName' | 'tin' | 'rdoCode' | 'category' | 'zipCode' | 'email' | 'taxpayerClassification' | 'taxpayerType' | 'psicCode' | 'psocCode' | 'taxpayerSize' |
		'birthDate' | 'civilStatus' | 'spouseTin' | 'spouseRdoCode' | 'spouseBirthDate' | 'spouseZipCode' | 'spouseEmail',
		string
	>
>;

export function isValidPsocCode(value: string): boolean {
	return /^\d{4}$/.test(value.trim());
}

function isValidBirthDate(value: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000-')) return false;
	const date = new Date(`${value}T00:00:00Z`);
	if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return false;
	const today = new Date();
	const todayInUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
	return date.getTime() <= todayInUtc;
}

export function taxpayerEmailError(value: string, required = false): string {
	const email = value.trim();
	if (!email) return required ? 'Enter an email address in the taxpayer details.' : '';
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return 'Enter a valid email address, such as name@example.com.';
	}
	// The native return package uses the address between two # separators in a filename.
	if (/[#\/\\]/.test(email)) return 'Use an email address without #, /, or backslash.';
	return '';
}

export function validateTaxpayerProfile(
	profile: TaxpayerProfileInput & { id?: string },
	rawTin?: string,
	profiles: readonly TaxpayerProfile[] = []
): ProfileValidationErrors {
	const errors: ProfileValidationErrors = {};
	if (!profile.taxpayerName.trim()) {
		errors.taxpayerName = 'Enter the taxpayer name.';
	}
	const partsValid =
		[profile.tin1, profile.tin2, profile.tin3].every((part) => /^\d{3}$/.test(part)) &&
		/^\d{5}$/.test(profile.branchCode);
	const rawValid =
		rawTin === undefined || (/^[\d\s-]+$/.test(rawTin) && rawTin.replace(/\D/g, '').length === 14);
	if (!partsValid || !rawValid) {
		errors.tin = 'Enter 9 TIN digits and a 5-digit branch code.';
	} else if (profile.tin1 + profile.tin2 + profile.tin3 === '000000000') {
		errors.tin = 'TIN cannot be all zeros.';
	} else {
		const id = normalizeTinParts(profile);
		const existing = findMatchingTaxpayerProfile(profiles, profile) ?? profiles.find((item) => item.id === id);
		if (existing && existing.id !== profile.id) {
			errors.tin = 'This TIN and branch code already belong to another taxpayer.';
		}
	}
	if (!isPackagedRdoCode(profile.rdoCode)) {
		errors.rdoCode = 'Enter a supported RDO code, such as 040 or 17A.';
	}
	if (!['P', 'G'].includes(profile.category)) {
		errors.category = 'Choose Private or Government.';
	}
	if (profile.zipCode.trim() && !/^\d{4}$/.test(profile.zipCode.trim())) {
		errors.zipCode = 'Enter a 4-digit ZIP code.';
	}
	const emailError = taxpayerEmailError(profile.email);
	if (emailError) errors.email = emailError;
	if (profile.taxpayerClassification && !['I', 'N'].includes(profile.taxpayerClassification)) {
		errors.taxpayerClassification = 'Choose Individual or Non-individual.';
	}
	if (profile.taxpayerClassification === 'I' && profile.taxpayerType &&
		!individualTaxpayerTypeOptions.some(({ value }) => value === profile.taxpayerType)) {
		errors.taxpayerType = 'Choose a supported taxpayer type.';
	}
	if (profile.psicCode && !/^\d+$/.test(profile.psicCode)) {
		errors.psicCode = 'Enter a PSIC code using digits only.';
	}
	if (profile.psocCode?.trim() && !isValidPsocCode(profile.psocCode)) {
		errors.psocCode = 'Enter a four-digit PSOC code.';
	}
	if (profile.taxpayerSize && !['micro', 'small', 'medium', 'large'].includes(profile.taxpayerSize)) {
		errors.taxpayerSize = 'Choose Micro, Small, Medium, or Large.';
	}
	const birthDate = profile.birthDate?.trim();
	if (birthDate && !isValidBirthDate(birthDate)) {
		errors.birthDate = 'Enter a valid birth date on or before today.';
	}
	if (profile.civilStatus && !civilStatuses.includes(profile.civilStatus)) {
		errors.civilStatus = 'Choose a supported civil status.';
	}
	if (profile.spouse) {
		const { tin1, tin2, tin3, branchCode, rdoCode, birthDate, zipCode, email } = profile.spouse;
		const tinParts = [tin1, tin2, tin3].map((part) => part?.trim() ?? '');
		const branch = branchCode?.trim() ?? '';
		if (tinParts.some(Boolean) || branch) {
			if (!tinParts.every((part) => /^\d{3}$/.test(part)) || !/^\d{5}$/.test(branch)) {
				errors.spouseTin = 'Enter 9 spouse TIN digits and a 5-digit branch code.';
			} else if (tinParts.join('') === '000000000') {
				errors.spouseTin = 'Spouse TIN cannot be all zeros.';
			}
		}
		if (rdoCode?.trim() && !isPackagedRdoCode(rdoCode.trim().toUpperCase())) {
			errors.spouseRdoCode = 'Enter a supported spouse RDO code, such as 040 or 17A.';
		}
		if (birthDate?.trim() && !isValidBirthDate(birthDate.trim())) {
			errors.spouseBirthDate = 'Enter a valid spouse birth date on or before today.';
		}
		if (zipCode?.trim() && !/^\d{4}$/.test(zipCode.trim())) {
			errors.spouseZipCode = 'Enter a 4-digit spouse ZIP code.';
		}
		const spouseEmailError = taxpayerEmailError(email ?? '');
		if (spouseEmailError) errors.spouseEmail = spouseEmailError;
	}
	return errors;
}

function digitsOnly(value: string): string {
	return value.replace(/\D/g, '');
}

function padPart(value: string, length: number): string {
	return digitsOnly(value).padStart(length, '0').slice(-length);
}

export function normalizeTinParts(parts: TinParts): string {
	return [
		padPart(parts.tin1, 3),
		padPart(parts.tin2, 3),
		padPart(parts.tin3, 3),
		padPart(parts.branchCode, 5)
	].join('');
}

export function normalizeTinNumber(parts: Pick<TinParts, 'tin1' | 'tin2' | 'tin3'>): string {
	return [padPart(parts.tin1, 3), padPart(parts.tin2, 3), padPart(parts.tin3, 3)].join('');
}

export function parseTinInput(value: string): TinParts {
	const digits = digitsOnly(value);

	return {
		tin1: digits.slice(0, 3),
		tin2: digits.slice(3, 6),
		tin3: digits.slice(6, 9),
		branchCode: digits.slice(9, 14)
	};
}

export function formatTinInput(parts: TinParts): string {
	const tin1 = padPart(parts.tin1, 3);
	const tin2 = padPart(parts.tin2, 3);
	const tin3 = padPart(parts.tin3, 3);
	const branchCode = padPart(parts.branchCode, 5);

	return `${tin1}-${tin2}-${tin3}-${branchCode}`;
}

export function buildProfileFilename(parts: TinParts): string {
	return `${normalizeTinParts(parts)}.xml`;
}

export function buildReturnFilename(input: ReturnFilenameInput): string {
	const version = input.version && input.version > 0 ? `V${input.version}` : '';
	return `${normalizeTinParts(input)}-${input.formCode}-${input.returnPeriod}${version}.xml`;
}

export function findMatchingTaxpayerProfile(
	profiles: readonly TaxpayerProfile[],
	input: TaxpayerProfileInput & { id?: string }
): TaxpayerProfile | undefined {
	const normalizedId = normalizeTinParts(input);
	const matches = profiles.filter((item) =>
		[item.tin1, item.tin2, item.tin3].every((part) => /^\d{3}$/.test(part)) &&
		/^\d{3,5}$/.test(item.branchCode) && normalizeTinParts(item) === normalizedId
	);
	return matches.find((item) => item.id === input.id) ?? matches[0];
}

export function upsertTaxpayerProfile(
	profiles: TaxpayerProfile[],
	input: TaxpayerProfileInput & { id?: string }
): TaxpayerProfile[] {
	const normalizedId = normalizeTinParts(input);
	const existing = findMatchingTaxpayerProfile(profiles, input);
	const profileIndex = existing ? profiles.indexOf(existing) : -1;
	const { birthDate, citizenship, civilStatus, psocCode, spouse, taxpayerType, tradeName, ...base } = input;
	const spouseDetails = Object.fromEntries(
		Object.entries(spouse ?? {}).flatMap(([key, value]) => {
			const trimmed = value?.trim();
			if (!trimmed) return [];
			return [[key, key === 'email' ? trimmed.toLowerCase() : key === 'rdoCode' ? trimmed.toUpperCase() : trimmed]];
		})
	);
	const profile = {
		...base,
		email: (input.email ?? '').trim().toLowerCase(),
		...(tradeName?.trim() ? { tradeName: tradeName.trim() } : {}),
		...(birthDate?.trim() ? { birthDate: birthDate.trim() } : {}),
		...(citizenship?.trim() ? { citizenship: citizenship.trim() } : {}),
		...(civilStatus ? { civilStatus } : {}),
		...(psocCode?.trim() ? { psocCode: psocCode.trim() } : {}),
		...(input.taxpayerClassification === 'I' && taxpayerType ? { taxpayerType } : {}),
		...(Object.keys(spouseDetails).length ? { spouse: spouseDetails } : {}),
		// Keep legacy filenames and saved-return links when only branch padding changes.
		id: profileIndex === -1 ? normalizedId : profiles[profileIndex].id
	};

	if (profileIndex === -1) {
		return [...profiles, profile];
	}

	return profiles.map((item, index) => (index === profileIndex ? profile : item));
}

export function buildTaxpayerProfileFormValues(profile: TaxpayerProfile): Record<string, string> {
	return {
		'frm1601EQ:txtTIN1': profile.tin1,
		'frm1601EQ:txtTIN2': profile.tin2,
		'frm1601EQ:txtTIN3': profile.tin3,
		'frm1601EQ:txtBranchCode': profile.branchCode,
		'frm1601EQ:txtRDOCode': profile.rdoCode,
		'frm1601EQ:txtTaxpayerName': profile.taxpayerName,
		'frm1601EQ:txtAddress': profile.address,
		'frm1601EQ:txtAddress2': profile.address2,
		'frm1601EQ:txtZipCode': profile.zipCode,
		'frm1601EQ:txtTelNum': profile.contactNumber,
		'frm1601EQ:optCategory': profile.category,
		txtEmail: (profile.email ?? '').trim().toLowerCase()
	};
}
