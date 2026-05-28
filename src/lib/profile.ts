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

export type TaxpayerProfileInput = TinParts & {
	rdoCode: string;
	taxpayerName: string;
	address: string;
	address2: string;
	zipCode: string;
	contactNumber: string;
	category: string;
	email: string;
};

export type TaxpayerProfile = TaxpayerProfileInput & {
	id: string;
};

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
		padPart(parts.branchCode, 4)
	].join('');
}

export function normalizeTinNumber(parts: Pick<TinParts, 'tin1' | 'tin2' | 'tin3'>): string {
	return [padPart(parts.tin1, 3), padPart(parts.tin2, 3), padPart(parts.tin3, 3)].join('');
}

export function buildProfileFilename(parts: TinParts): string {
	return `${normalizeTinParts(parts)}.xml`;
}

export function buildReturnFilename(input: ReturnFilenameInput): string {
	const version = input.version && input.version > 0 ? `V${input.version}` : '';
	return `${normalizeTinParts(input)}-${input.formCode}-${input.returnPeriod}${version}.xml`;
}

export function upsertTaxpayerProfile(
	profiles: TaxpayerProfile[],
	input: TaxpayerProfileInput
): TaxpayerProfile[] {
	const profile = {
		...input,
		id: normalizeTinParts(input)
	};
	const profileIndex = profiles.findIndex((item) => item.id === profile.id);

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
