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

export type TaxpayerProfileInput = TinParts & {
	rdoCode: string;
	taxpayerName: string;
	address: string;
	address2: string;
	zipCode: string;
	contactNumber: string;
	category: string;
	email: string;
	lineOfBusiness?: string;
	taxpayerClassification?: 'I' | 'N' | '';
	psicCode?: string;
	taxpayerSize?: TaxpayerSize;
};

export type TaxpayerProfile = TaxpayerProfileInput & {
	id: string;
};

export type ProfileValidationErrors = Partial<
	Record<'taxpayerName' | 'tin' | 'rdoCode' | 'category' | 'zipCode' | 'email' | 'taxpayerClassification' | 'psicCode' | 'taxpayerSize', string>
>;

export function validateTaxpayerProfile(
	profile: TaxpayerProfileInput,
	rawTin?: string
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
	if (profile.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
		errors.email = 'Enter a valid email address, such as name@example.com.';
	}
	if (profile.taxpayerClassification && !['I', 'N'].includes(profile.taxpayerClassification)) {
		errors.taxpayerClassification = 'Choose Individual or Non-individual.';
	}
	if (profile.psicCode && !/^\d+$/.test(profile.psicCode)) {
		errors.psicCode = 'Enter a PSIC code using digits only.';
	}
	if (profile.taxpayerSize && !['micro', 'small', 'medium', 'large'].includes(profile.taxpayerSize)) {
		errors.taxpayerSize = 'Choose Micro, Small, Medium, or Large.';
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
	profiles: TaxpayerProfile[],
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
	const profile = {
		...input,
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
		txtEmail: profile.email
	};
}
