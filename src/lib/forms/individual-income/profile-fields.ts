import type { IndividualTaxpayerType, TaxpayerProfile } from '../../profiles/profile';
import { jointRevised } from './compensation';
import { quarterlyIncludesSpouse } from './quarterly';

type IdentityDetails = Omit<TaxpayerProfile, 'spouse'>;
type Details = Pick<Partial<IdentityDetails>,
	'taxpayerName' | 'tin1' | 'tin2' | 'tin3' | 'branchCode' | 'rdoCode' |
	'address' | 'address2' | 'zipCode' | 'contactNumber' | 'email' | 'birthDate' | 'citizenship' |
	'civilStatus' | 'lineOfBusiness' | 'psicCode' | 'psocCode'>;
type Part = keyof Details | 'surname' | 'givenName' | 'middleName' | 'birthMonth' | 'birthDay' | 'birthYear';
type Binding = [id: string, part: Part];
type ProfileBindings = {
	prefix: string;
	individual: Binding[];
	spouse: Binding[];
	filing?: [field: string, jointValue: string];
};

export const incomeProfileFieldList = 'income:profileFields';
export const legacy1701ProfileIds = {
	taxpayerType: 'frm1701:rdoPg1Pt1I7Type',
	tradeName: 'frm1701:txtPg1Pt1I9TradeName'
} as const;

type TaxpayerTypeDefaults = Partial<Record<Exclude<IndividualTaxpayerType, ''>, Record<string, string>>>;

const taxpayerTypeDefaults: Partial<Record<string, TaxpayerTypeDefaults>> = {
	'1700': {
		compensation: { 'frm1700:SourceOfIncome_1': 'Y' }
	},
	'1700v2018': {
		compensation: { 'frm1700:rdoPg1I6TaxpayerType': 'Employee' }
	},
	'1701': {
		compensation: { 'frm1701:rdoPg1Pt1I4ATC': 'Compensation' },
		'single-proprietor': { 'frm1701:rdoPg1Pt1I4ATC': 'Business', 'frm1701:rdoPg1Pt1I7Type': 'Single' },
		professional: { 'frm1701:rdoPg1Pt1I4ATC': 'Business', 'frm1701:rdoPg1Pt1I7Type': 'Professional' },
		'mixed-income': { 'frm1701:rdoPg1Pt1I4ATC': 'Mixed' },
		estate: { 'frm1701:rdoPg1Pt1I7Type': 'Estate' },
		trust: { 'frm1701:rdoPg1Pt1I7Type': 'Trust' }
	},
	'1701v2018': {
		compensation: { 'frm1701:rdoPg1I6TaxpayerTypeC': 'Y', 'frm1701:rdoPg1I7ATC': 'II011' },
		'single-proprietor': { 'frm1701:rdoPg1I6TaxpayerTypeS': 'Y' },
		professional: { 'frm1701:rdoPg1I6TaxpayerTypeP': 'Y' },
		estate: { 'frm1701:rdoPg1I6TaxpayerTypeE': 'Y' },
		trust: { 'frm1701:rdoPg1I6TaxpayerTypeT': 'Y' }
	},
	'1701A': {
		'single-proprietor': { 'frm1701A:optTaxType': 'S' },
		professional: { 'frm1701A:optTaxType': 'P' }
	},
	'1701MS': {
		'single-proprietor': { 'frm1701MS:sourceOfIncomeTaxpayer': '1' },
		'mixed-income': { 'frm1701MS:sourceOfIncomeTaxpayer': '2' },
		professional: { 'frm1701MS:sourceOfIncomeTaxpayer': '3' }
	},
	'1701Q': {
		compensation: { 'frm1701q:optATC20': 'II011' },
		'single-proprietor': { 'frm1701q:optATC20': 'II012' },
		professional: { 'frm1701q:optATC20': 'II012' },
		'mixed-income': { 'frm1701q:optATC20': 'II013' }
	},
	'1701Qv2018': {
		'single-proprietor': { 'frm1701q:optTaxpayerType': 'Single' },
		professional: { 'frm1701q:optTaxpayerType': 'Professional' },
		estate: { 'frm1701q:optTaxpayerType': 'Estate' },
		trust: { 'frm1701q:optTaxpayerType': 'Trust' }
	}
};

const relatedTaxpayerFields: Partial<Record<string, string[]>> = {
	'1700': ['frm1700:SourceOfIncome_2'],
	'1701': ['frm1701:rdoPg1Pt1I4ATC', 'frm1701:rdoPg1Pt1I7Type'],
	'1701v2018': ['S', 'P', 'E', 'T', 'C'].map(type => `frm1701:rdoPg1I6TaxpayerType${type}`)
};

const rateAtcFields: Partial<Record<string, string>> = {
	'1701v2018': 'frm1701:rdoPg1I7ATC',
	'1701A': 'frm1701A:optATC',
	'1701Qv2018': 'frm1701q:optATC'
};
const compatibleRateAtcs: Partial<Record<IndividualTaxpayerType, string[]>> = {
	compensation: ['II011'],
	'single-proprietor': ['II012', 'II015'],
	professional: ['II014', 'II017'],
	estate: ['II012'],
	trust: ['II012']
};

export function incomeTaxpayerTypeValues(code: string, profile: TaxpayerProfile, values: Record<string, string>) {
	const type = profile.taxpayerType;
	if (profile.taxpayerClassification !== 'I' || !type) return {};
	const defaults = taxpayerTypeDefaults[code]?.[type];
	if (!defaults) return {};

	const atc = values[rateAtcFields[code] ?? ''];
	if (atc && !compatibleRateAtcs[type]?.includes(atc)) return {};
	const related = [...Object.keys(defaults), ...(relatedTaxpayerFields[code] ?? [])];
	// An existing choice, including an explicit clear, takes precedence over the profile.
	if (related.some(id => values[id] !== undefined && values[id] !== defaults[id])) return {};
	return Object.fromEntries(Object.entries(defaults).filter(([id]) => values[id] === undefined));
}

export const incomeSpouseFiling: Partial<Record<string, { civil: string; income?: string; hasIncome?: string; filing: string }>> = {
	'1700v2018': { civil: 'frm1700:rdoPg1I15CivilStatus', income: 'frm1700:rdoPg1I16SpouseHasIncome', hasIncome: 'Yes', filing: 'frm1700:rdoPg1I17FilingStatus' },
	'1701': { civil: 'frm1701:rdoPg1Pt1I14Status', income: 'frm1701:rdoPg1Pt1I15Income', hasIncome: 'WithIncome', filing: 'frm1701:rdoPg1Pt1I16FilingStatus' },
	'1701v2018': { civil: 'frm1701:rdoPg1I16CivilStatus', income: 'frm1701:rdoPg1I17SpouseIncome', hasIncome: 'Yes', filing: 'frm1701:rdoPg1I18FilingStatus' },
	'1701A': { civil: 'frm1701A:optCivilStatus', income: 'frm1701A:optSpouseIncome', hasIncome: 'Y', filing: 'frm1701A:optFilingStatus' },
	'1701MS': { civil: 'frm1701MS:civilStatus', filing: 'frm1701MS:txtIfMarried' }
};

const bindings: Record<string, ProfileBindings> = {
	'1700': {
		prefix: 'frm1700:',
		individual: [['txtPg1Pt1I7Psoc', 'psocCode'], ['txtPg1Pt1I8TaxFilerLastName', 'surname'], ['txtPg1Pt1I8TaxFilerFirstName', 'givenName'], ['txtPg1Pt1I8TaxFilerMiddleName', 'middleName'], ['txtPg1Pt2TaxFiler', 'taxpayerName'], ['txtPg2Pt4TaxFilerLastName', 'surname'], ['txtPg3Pt5TaxFilerLastName', 'surname'], ['txtPg4LastName', 'surname'], ['txtPg1Pt1I10DOB', 'birthDate'], ['rdoPg1Pt1I13CivilStatusInd', 'civilStatus']],
		spouse: [['txtPg1Pt1I16TaxSpouseLastName', 'surname'], ['txtPg1Pt1I16TaxSpouseFirstName', 'givenName'], ['txtPg1Pt1I16TaxSpouseMiddleName', 'middleName'], ['txtPg1Pt1I17SpouseTIN1', 'tin1'], ['txtPg1Pt1I17SpouseTIN2', 'tin2'], ['txtPg1Pt1I17SpouseTIN3', 'tin3'], ['txtPg1Pt1I17SpouseBranchCode', 'branchCode'], ['txtPg1Pt1I18SpouseContactNumber', 'contactNumber'], ['txtPg1Pt1I19SpouseDOB', 'birthDate'], ['txtPg1Pt1I20SpouseEmailAddress', 'email']],
		filing: ['rdoPg1Pt1I3JointFiling', 'frm1700:rdoPg1Pt1I3JointFilingYes']
	},
	'1700v2018': {
		prefix: 'frm1700:',
		individual: [['txtPg1I9BirthDate', 'birthDate'], ['txtPg1I11Citizenship', 'citizenship'], ['rdoPg1I15CivilStatus', 'civilStatus']],
		spouse: [['txtPg1I18STIN1', 'tin1'], ['txtPg1I18STIN2', 'tin2'], ['txtPg1I18STIN3', 'tin3'], ['txtPg1I18SBranchCode', 'branchCode'], ['txtSpouseRDOCode', 'rdoCode'], ['txtPg1I21SpouseName', 'taxpayerName'], ['txtPg1I22TSpouseTelNum', 'contactNumber'], ['txtPg1I23SpouseCitizenship', 'citizenship']],
		filing: ['rdoPg1I17FilingStatus', 'Joint']
	},
	'1701': {
		prefix: 'frm1701:',
		individual: [['txtPg1Pt1I8TaxFiler', 'surname'], ['txtPg1Pt1I8TaxFilerFirstName', 'givenName'], ['txtPg1Pt1I8TaxFilerMiddleName', 'middleName'], ['txtPg1Pt1I11Month', 'birthDate'], ['rdoPg1Pt1I14Status', 'civilStatus'], ['txtPg1Pt1I17Business', 'lineOfBusiness'], ['txtPg1Pt1I18PSIC', 'psicCode']],
		spouse: [['txtPg4Pt7I95SpouseTIN1', 'tin1'], ['txtPg4Pt7I95SpouseTIN2', 'tin2'], ['txtPg4Pt7I95SpouseTIN3', 'tin3'], ['txtPg4Pt7I95SpouseTIN4', 'branchCode'], ['ddlPg1Pt4I96RDOCode', 'rdoCode'], ['txtPg4Pt7I97SpouseName', 'taxpayerName'], ['ddlPg4Pt7I99Month', 'birthDate'], ['txtPg4Pt7I100Email', 'email'], ['txtPg4Pt7I101Contact', 'contactNumber'], ['txtPg4Pt7BZipCode', 'zipCode']],
		filing: ['rdoPg1Pt1I16FilingStatus', 'Joint']
	},
	'1701v2018': {
		prefix: 'frm1701:',
		individual: [['txtPg1I10BirthDate', 'birthDate'], ['txtPg1I12Citizenship', 'citizenship'], ['rdoPg1I16CivilStatus', 'civilStatus']],
		spouse: [['txtPg2I1TIN1', 'tin1'], ['txtPg2I1TIN2', 'tin2'], ['txtPg2I1TIN3', 'tin3'], ['txtPg2I1BranchCode', 'branchCode'], ['txtPg2I2SpouseRDOCode', 'rdoCode'], ['txtPg2I5SpouseName', 'taxpayerName'], ['txtPg2I6TelNum', 'contactNumber'], ['txtPg2I7Citizenship', 'citizenship']],
		filing: ['rdoPg1I18FilingStatus', 'Joint']
	},
	'1701A': {
		prefix: 'frm1701A:',
		individual: [['txtBirthDate', 'birthDate'], ['txtCitizenship', 'citizenship'], ['optCivilStatus', 'civilStatus']],
		spouse: [['txtSpouseTIN1', 'tin1'], ['txtSpouseTIN2', 'tin2'], ['txtSpouseTIN3', 'tin3'], ['txtSpouseBranchCode', 'branchCode'], ['txtSpouseRDOCode', 'rdoCode'], ['txtSpouseName', 'taxpayerName'], ['txtSpouseTelNum', 'contactNumber'], ['txtSpouseCitizenship', 'citizenship']],
		filing: ['optFilingStatus', 'Joint']
	},
	'1701MS': {
		prefix: 'frm1701MS:',
		individual: [['civilStatus', 'civilStatus']],
		spouse: [['txtPg2TIN1Spouse', 'tin1'], ['txtPg2TIN2Spouse', 'tin2'], ['txtPg2TIN3Spouse', 'tin3'], ['txtPg2BranchCodeSpouse', 'branchCode'], ['txtRDOCodeb', 'rdoCode'], ['txtTaxpayerNo8b', 'taxpayerName'], ['txtEmailb', 'email'], ['txtTelNum10b', 'contactNumber']],
		filing: ['txtIfMarried', '1']
	},
	'1701Q': {
		prefix: 'frm1701q:',
		individual: [['txt13BirthMonth', 'birthMonth'], ['txt13BirthDay', 'birthDay'], ['txt13BirthYear', 'birthYear'], ['txt19', 'lineOfBusiness']],
		spouse: [['txt7TIN1', 'tin1'], ['txt7TIN2', 'tin2'], ['txt7TIN3', 'tin3'], ['txt7BranchCode', 'branchCode'], ['txt7RDOCode', 'rdoCode'], ['txtSpousename', 'taxpayerName'], ['txt12Address', 'address'], ['txt16BirthMonth', 'birthMonth'], ['txt16BirthDay', 'birthDay'], ['txt16BirthYear', 'birthYear'], ['txt17', 'zipCode'], ['txt18Telno', 'contactNumber']]
	},
	'1701Qv2018': {
		prefix: 'frm1701q:',
		individual: [['txtBirthMonth', 'birthMonth'], ['txtBirthDay', 'birthDay'], ['txtBirthYear', 'birthYear'], ['txtCitizenship', 'citizenship']],
		spouse: [['txtSpouseTIN1', 'tin1'], ['txtSpouseTIN2', 'tin2'], ['txtSpouseTIN3', 'tin3'], ['txtSpouseBranchCode', 'branchCode'], ['txtSpouseRDOCode', 'rdoCode'], ['txtSpouseName', 'taxpayerName'], ['txtSpouseCitizenship', 'citizenship']]
	}
};

const civilStatus: Record<string, Record<string, string>> = {
	'1700': { Single: 'frm1700:rdoPg1Pt1I13SingleInd', Married: 'frm1700:rdoPg1Pt1I13MarriedInd', Separated: 'frm1700:rdoPg1Pt1I13LegalSeparatedInd', Widowed: 'frm1700:rdoPg1Pt1I13WidowerInd' },
	'1700v2018': { Separated: 'Legally Separated', Widowed: 'Widow' },
	'1701': { Widowed: 'Widow' },
	'1701v2018': { Separated: 'LegallySeparated', Widowed: 'Widow' },
	'1701A': { Widowed: 'Widow' }
};

function parts(details: Details, code: string): Record<Part, string | undefined> {
	const [surname, givenName, ...middle] = (details.taxpayerName ?? '').split(',').map(part => part.trim());
	const [, birthYear, birthMonth, birthDay] = details.birthDate?.match(/^(\d{4})-(\d{2})-(\d{2})$/) ?? [];
	return {
		...details, surname, givenName, middleName: middle.join(' ') || undefined, birthYear, birthMonth, birthDay,
		birthDate: birthYear ? `${birthMonth}/${birthDay}/${birthYear}` : undefined,
		branchCode: details.branchCode,
		email: details.email?.trim().toLowerCase(),
		civilStatus: details.civilStatus && (civilStatus[code]?.[details.civilStatus] ?? details.civilStatus),
		taxpayerName: details.taxpayerName, tin1: details.tin1, tin2: details.tin2, tin3: details.tin3,
		rdoCode: details.rdoCode, address: details.address, address2: details.address2,
		zipCode: details.zipCode, contactNumber: details.contactNumber, citizenship: details.citizenship,
		lineOfBusiness: details.lineOfBusiness, psicCode: details.psicCode, psocCode: details.psocCode?.trim()
	};
}

export function incomeSpouseFieldIds(code: string): string[] {
	const config = bindings[code];
	return config.spouse.map(([id]) => config.prefix + id);
}

export function incomeIncludesSpouse(code: string, values: Record<string, string>): boolean {
	if (code === '1700v2018') return jointRevised(values);
	if (code === '1701Q' || code === '1701Qv2018') return quarterlyIncludesSpouse(code, values);
	const { prefix, filing } = bindings[code];
	const prerequisite = incomeSpouseFiling[code];
	if (prerequisite) {
		const civil = values[prerequisite.civil];
		const income = prerequisite.income ? values[prerequisite.income] : '';
		// Older imported drafts may contain the filing choice without its prerequisite fields.
		if ((civil && civil !== 'Married') || (income && income !== prerequisite.hasIncome)) return false;
	}
	if (filing) return values[prefix + filing[0]] === filing[1];
	return values['income:useSavedSpouse'] === 'Y' || incomeSpouseFieldIds(code).some(id => {
		const value = values[id]?.trim();
		return value && !/^0+$/.test(value);
	});
}

export function incomePersonalValues(code: string, profile: TaxpayerProfile, values: Record<string, string>) {
	const { prefix, individual, spouse } = bindings[code];
	function project(fields: Binding[], details: Details) {
		const data = parts(details, code);
		return Object.fromEntries(fields.flatMap(([id, part]) => {
			if (part === 'psocCode' && profile.taxpayerClassification !== 'I') return [];
			const source = data[part];
			// Legacy 1701 has room for the class, while the profile can store a subclass.
			const value = part === 'psicCode' && source && /^\d{5}$/.test(source) ? source.slice(0, 4) : source;
			return value ? [[prefix + id, value]] : [];
		}));
	}
	const projected = {
		...project(individual, profile),
		...(profile.spouse && incomeIncludesSpouse(code, values) ? project(spouse, profile.spouse) : {})
	};
	const personalFields = new Set([...individual, ...spouse].map(([id]) => prefix + id));
	const previous = (values[incomeProfileFieldList] ?? '').split(',');
	const cleared = previous.filter(id => personalFields.has(id) && !(id in projected)).map(id => [id, '']);
	// Only clear fields that this draft previously took from the profile.
	return {
		...Object.fromEntries(cleared),
		...projected,
		[incomeProfileFieldList]: Object.keys(projected).join(',')
	};
}
