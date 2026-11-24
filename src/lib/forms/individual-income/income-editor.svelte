<script lang="ts">
	import { tick } from 'svelte';
	import { Button, ButtonLink, CalculatedValue, CheckboxInput, CurrencyInput, DateInput, FieldErrors, Input, NumberInput, RadioGroup, Select, TinInput } from '$lib/components/ui';
	import Icon from '$lib/components/ui/icon/icon.svelte';
	import { glyphs } from '$lib/components/ui/icons';
	import { annualFilingFields, calculateIndividualIncome, incomePaymentFieldIds, individualIncomePeriod, isShortFilingPeriod, type IncomeForm } from '.';
	import { annual1701AScheduleLabels, annual1701ASchedules, incomeChoiceLabel, incomeEditorFields, incomeEditorPageTitle, incomeEditorRows, type IncomeEditorField } from './editor-layout';
	import { legacy1700DependentClaim, legacy1700FirstYear, legacy1700IncomeSourceChecked, legacy1700LastYear, revised1700FieldApplies } from './compensation';
	import { quarterlyIncomeFieldApplies, quarterlyRateForAtc } from './quarterly';
	import { annualFieldApplies, legacy1701Filing, legacy1701IsOverpaid, revised1701RateForAtc } from './annual';
	import { annual1701ARateForAtc, shortAnnualFieldApplies } from './annual-short';
	import { hasActivityAttachment } from './paper';
	import { incomeIncludesSpouse, incomePersonalValues, incomeProfileFieldList, incomeSpouseFieldIds, incomeSpouseFiling, legacy1701ProfileIds } from './profile-fields';
	import PaperFormHeader from '../paper-form-header.svelte';
	import ReturnPagination from '../return-pagination.svelte';
	import ReturnTaxpayerInformation from '../return-taxpayer-information.svelte';
	import type { TaxpayerProfile } from '$lib/profiles/profile';
	import type { TaxpayerItemKey } from '../withholding-paper-layout';
	import '../form-editor-layout.css';

	let { form, values, errors, profile, taxpayerHref, onvaluechange: onPatch }: {
		form: IncomeForm;
		values: Record<string, string>;
		errors: Record<string, string>;
		profile: TaxpayerProfile;
		taxpayerHref: string;
		onvaluechange: (patch: Record<string, string>) => void;
	} = $props();

	let currentPage = $state('1');
	let addedDependentRows = $state(1);
	let addedSupplementalEntries = $state<string[]>([]);
	let scheduleOpen = $state<Record<string, boolean>>({});
	let heading: HTMLHeadingElement;
	const fields = $derived(incomeEditorFields(form));
	const calculated = $derived(calculateIndividualIncome(form, values));
	const selectors = $derived(Object.fromEntries(fields.filter(field => field.kind === 'select' || field.kind === 'radio').map(field => [field.id, values[field.id] ?? ''])));
	const computed = $derived(new Set(Object.keys(calculateIndividualIncome(form, selectors)).filter(id => !(id in selectors))));
	const spouseFieldIds = $derived(new Set(incomeSpouseFieldIds(form.code)));
	const groupedSpouseTin = $derived(({
		'1701v2018': ['frm1701:txtPg2I1TIN1', 'frm1701:txtPg2I1TIN2', 'frm1701:txtPg2I1TIN3', 'frm1701:txtPg2I1BranchCode'],
		'1701MS': ['frm1701MS:txtPg2TIN1Spouse', 'frm1701MS:txtPg2TIN2Spouse', 'frm1701MS:txtPg2TIN3Spouse', 'frm1701MS:txtPg2BranchCodeSpouse'],
		'1701Qv2018': ['frm1701q:txtSpouseTIN1', 'frm1701q:txtSpouseTIN2', 'frm1701q:txtSpouseTIN3', 'frm1701q:txtSpouseBranchCode'],
		'1701Q': ['frm1701q:txt7TIN1', 'frm1701q:txt7TIN2', 'frm1701q:txt7TIN3', 'frm1701q:txt7BranchCode']
	} as Record<string, string[]>)[form.code] ?? []);
	const legacyProfileMatches = $derived(form.code === '1701'
		? Object.values(legacy1701ProfileIds).filter(id => (values[incomeProfileFieldList] ?? '').split(',').includes(id))
		: []);
	const profileFields = $derived(new Set([
		...Object.values(form.identity), ...Object.keys(incomePersonalValues(form.code, profile, values)),
		...spouseFieldIds, ...legacyProfileMatches
	]));
	const includesSpouse = $derived(incomeIncludesSpouse(form.code, values));
	const paymentFields = $derived(incomePaymentFieldIds(form.code));
	const pages = $derived([...new Set(fields.map(field => field.page))].filter(page => /^\d+$/.test(page) || hasActivityAttachment(form, values)));
	const selectedPage = $derived(pages.includes(currentPage) ? currentPage : pages[0]);
	const legacy1700 = $derived(form.code === '1700');
	const annualFiling = $derived(annualFilingFields[form.code]);
	const spouseFiling = $derived(incomeSpouseFiling[form.code]);
	const taxpayerClaimId = 'frm1700:rdoPg1Pt1I14ClaimingAdditionalExemptions';
	const spouseClaimId = 'frm1700:rdoPg1Pt1I21SpouseClaimAdditionalExemption';
	const taxpayerCountId = 'frm1700:txtPg1Pt1I15QualifyDependent';
	const spouseCountId = 'frm1700:txtPg1Pt1I22SpouseQualifiedDependentChildren';
	const dependentClaim = $derived(legacy1700 ? legacy1700DependentClaim(values) : undefined);
	const visibleDependentRows = $derived(Math.max(addedDependentRows, ...fields.flatMap(field =>
		field.page === '4' && isDependentField(field) && (values[field.id]?.trim() || errors[field.id]) ? [Number(field.id.at(-1))] : []
	)));
	const addressChangedId = 'frm1700:txtPg1Pt1I9AddressChangedInd';
	const addressChanged = $derived(['Y', 'true', '1', 'on'].includes(values[addressChangedId]));
	const idType = $derived(form.code === '1701'
		? values[legacy1701Filing.type] === legacy1701Filing.certificate ? 'CTC' : values[legacy1701Filing.type] === legacy1701Filing.governmentId ? 'Gov' : ''
		: ['Gov', 'CTC'].includes(values.GovorCTC) ? values.GovorCTC : '');
	const legacySummaryFields = [
		'frm1700:txtPg1Pt1I7Psoc',
		'frm1700:txtPg1Pt1I8TaxFilerLastName', 'frm1700:txtPg1Pt1I8TaxFilerFirstName', 'frm1700:txtPg1Pt1I8TaxFilerMiddleName',
		'frm1700:txtPg1Pt1I9Address3', 'frm1700:txtPg1Pt1I10DOB', 'frm1700:rdoPg1Pt1I13CivilStatusInd'
	];
	const legacyIdentificationFields = [
		'GovorCTC', 'frm1700:txtPg1Pt2I32GovID', 'frm1700:txtPg1P23I33DateofIssue',
		'frm1700:txtPg1Pt2I34Amount', 'frm1700:txtPg1Pt2I35PlaceofIssue'
	];
	const legacyAnnual = $derived(form.code === '1701');
	const annualNameFields = ['frm1701:txtPg1Pt1I8TaxFiler', 'frm1701:txtPg1Pt1I8TaxFilerFirstName', 'frm1701:txtPg1Pt1I8TaxFilerMiddleName'];
	const annualIdentificationIds = [legacy1701Filing.pages, legacy1701Filing.type, legacy1701Filing.number,
		legacy1701Filing.issueDate, legacy1701Filing.issuePlace, legacy1701Filing.amount];
	const identificationType = $derived(legacyAnnual ? legacy1701Filing.type : 'GovorCTC');
	const taxpayerItemKeys = ['tin', 'rdoCode', 'taxpayerName', 'address', 'zipCode', 'contactNumber', 'email'] as const;
	const itemNumbers = $derived(legacy1700
		? { tin: '5', rdoCode: '6', psocCode: '7', taxpayerName: '8', address: '9', birthDate: '10', email: '11', contactNumber: '12', civilStatus: '13' }
		: Object.fromEntries(taxpayerItemKeys.flatMap(key => {
		if (legacyAnnual && key === 'taxpayerName') return [[key, '8']];
		const id = form.identity[key === 'tin' ? 'tin1' : key];
		if (!id) return [];
		const item = fields.find(field => field.id === id)?.label.match(/^\d+[A-Z]?\b/)?.[0];
		return item ? [[key, item]] : [];
	})) as Partial<Record<TaxpayerItemKey, string>>);
	const summaryIds = $derived(new Set([...(legacy1700 ? legacySummaryFields : legacyAnnual ? annualNameFields : []), ...Object.keys(itemNumbers).flatMap(key => key === 'tin'
		? [form.identity.tin1, form.identity.tin2, form.identity.tin3, form.identity.branchCode]
		: key === 'address' ? [form.identity.address, form.identity.address2] : [form.identity[key as keyof TaxpayerProfile]])]));
	const taxpayerExtras = $derived(fields.flatMap(field => {
		if (field.page !== '1' || !shouldShow(field) || summaryIds.has(field.id)) return [];
		if (!/^part\s+i\s*[-–.]?\s*background information (?:of|on) (?:taxpayer|tax filer)/i.test(field.section) &&
			!(form.code === '1701Q' && /^frm1701q:txt(?:13BirthMonth|19)$/.test(field.id)) &&
			!(legacy1700 && field.section === 'Part I - Background Information on Tax Filer and Spouse')) return [];
		const item = field.item;
		return item ? [{ id: field.id, item }] : [];
	}));
	const legacyIdFields = $derived((legacyAnnual ? annualIdentificationIds : legacyIdentificationFields).flatMap(id => {
		const field = fields.find(field => field.id === id);
		const isAmount = id === 'frm1700:txtPg1Pt2I34Amount' || id === legacy1701Filing.amount;
		return field && (id === identificationType || id === legacy1701Filing.pages || (idType && (!isAmount || idType === 'CTC'))) ? [field] : [];
	}));
	const visibleFields = $derived(fields.filter(field => field.page === selectedPage && shouldShow(field) &&
		!(legacyAnnual && annualIdentificationIds.includes(field.id)) && !summaryIds.has(field.id) && !isRepeatedIdentity(field) && !taxpayerExtras.some(extra => extra.id === field.id)));
	const [formNumber, revision] = $derived(form.revision.split(' · '));
	const description = $derived(form.title.split(' | ')[1].replace(/^(?:Annual|Quarterly) return for /i, 'For '));
	const shortTitle = $derived(form.quarter ? 'Quarterly Income Tax Return' : 'Annual Income Tax Return');
	const groups = $derived(visibleFields.reduce<{ title: string; fields: IncomeEditorField[] }[]>((groups, field) => {
		const group = groups.at(-1);
		if (group?.title === field.section) group.fields.push(field);
		else groups.push({ title: field.section, fields: [field] });
		return groups;
	}, []));
	const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
	const schedulePeople = $derived(includesSpouse ? ['taxpayer', 'spouse'] as const : ['taxpayer'] as const);
	const historicalRegimes = ['Regular', 'Special', 'Exempt', 'Total'];
	const supplementalAmountHeadings = {
		exempt: 'Exempt amount',
		amount: 'Amount or fair market value',
		withheld: 'Final tax withheld'
	};
	const supplementalEntryNames: Record<string, [name: string, addLabel: string]> = {
		'Real property transactions': ['Sale or exchange', 'Add second sale or exchange'],
		'Share transactions': ['Sale or exchange', 'Add second sale or exchange'],
		'Other income subject to final tax': ['Other income entry', 'Add second other income entry'],
		'Property received through gifts, bequests, or devises': ['Property', 'Add second property'],
		'Other exempt income or receipts': ['Exempt receipt', 'Add second exempt receipt']
	};
	const taxSummaryLabels: Partial<Record<string, string>> = {
		23: 'Taxpayer tax due',
		24: 'Spouse tax due',
		25: 'Total income tax due',
		26: 'Less taxpayer tax credits and payments',
		27: 'Less spouse tax credits and payments',
		28: 'Net tax payable or overpayment',
		29: 'Less second installment due by July 15',
		30: 'Add penalties',
		31: 'Amount payable upon filing'
	};
	const revisedTaxSummaryLabels: Partial<Record<string, string>> = {
		26: 'Tax due',
		27: 'Less tax credits and payments',
		28: 'Net tax payable or overpayment',
		29: 'Less second installment',
		30: 'Tax after installment',
		31: 'Interest',
		32: 'Surcharge',
		33: 'Compromise',
		34: 'Total penalties',
		35: 'Total payable or overpayment',
		36: 'Aggregate amount payable'
	};
	const otherTaxSummaries: Partial<Record<string, { total: string; labels: Record<string, string> }>> = {
		'1701': { total: '32', labels: {
			26: 'Income tax due', 27: 'Less tax credits and payments', 28: 'Net tax payable or overpayment',
			29: 'Less second installment', 30: 'Tax after installment', 31: 'Total penalties', 32: 'Amount payable upon filing'
		} },
		'1701v2018': { total: '32', labels: {
			22: 'Tax due', 23: 'Less tax credits and payments', 24: 'Net tax payable or overpayment', 25: 'Less second installment',
			26: 'Tax after installment', 27: 'Interest', 28: 'Surcharge', 29: 'Compromise', 30: 'Total penalties',
			31: 'Total payable or overpayment', 32: 'Aggregate amount payable'
		} },
		'1701A': { total: '30', labels: {
			20: 'Tax due', 21: 'Less tax credits and payments', 22: 'Net tax payable or overpayment', 23: 'Less second installment',
			24: 'Tax after installment', 25: 'Surcharge', 26: 'Interest', 27: 'Compromise', 28: 'Total penalties',
			29: 'Total payable or overpayment', 30: 'Aggregate amount payable'
		} },
		'1701MS': { total: '30', labels: {
			19: 'Tax due at special or preferential rate', 20: 'Less other government agency share', 21: 'Net special-rate tax due',
			22: 'Tax due at regular rate', 23: 'Total income tax due', 24: 'Less tax credits and payments',
			25: 'Net tax payable or overpayment', 26: 'Less second installment', 27: 'Tax after installment',
			'28A': 'Surcharge', '28B': 'Interest', '28C': 'Compromise', '28D': 'Total penalties',
			29: 'Total payable or overpayment', 30: 'Aggregate amount payable'
		} },
		'1701Qv2018': { total: '31', labels: {
			26: 'Tax due', 27: 'Less tax credits and payments', 28: 'Net tax payable or overpayment', 29: 'Total penalties',
			30: 'Total payable or overpayment', 31: 'Aggregate amount payable'
		} }
	};

	function isRepeatedIdentity(field: IncomeEditorField) {
		if (legacy1700 && /^frm1700:txtPg(?:2Pt4TaxFiler|3Pt5TaxFiler|4)LastName$/.test(field.id)) return true;
		if (legacyAnnual && /^frm1701:txtPg\d+(?:m|Pt9)?(?:TaxFiler|RegName|TaxName|RegisteredName)(?:TYPE)?$/.test(field.id)) return true;
		return !spouseFieldIds.has(field.id) && field.page !== '1' &&
			/^(?:txt)?Pg[1-9]\d*m?(?:Pt\d+)?(?:I\d+)?(?:TIN[1234]|BranchCode|Taxpayer(?:Name)?)(?:TYPE)?$/i.test(field.id.split(':').at(-1) ?? '');
	}

	function hasScheduleEntry(field: IncomeEditorField) {
		if (/PartVIEmployerName1$/.test(field.id) && values[field.id.replace(/Name1$/, 'Name2')]?.trim()) return true;
		if (/PartVIEmployerTIN1$/.test(field.id)) {
			return ['TIN1', 'TIN2', 'TIN3', 'BranchCode'].some(part => {
				const id = field.id.replace(/TIN1$/, part);
				return values[id]?.trim() || errors[id];
			});
		}
		if (/Sc1I[1-4]EmpTIN1C1$/.test(field.id)) {
			return [1, 2, 3, 4].some(part => {
				const id = field.id.replace('TIN1C1', `TIN${part}C1`);
				return values[id]?.trim() || errors[id];
			});
		}
		const value = values[field.id]?.trim();
		const numericField = field.kind === 'money' || isShareCount(field.id);
		return !!errors[field.id] || (!!value && !computed.has(field.id) && value !== form.defaults[field.id] &&
			(!numericField || Number(value.replaceAll(',', '')) !== 0));
	}

	function isShareCount(id: string) {
		return /^frm1700:txtPg3Pt5I14C[12]$/.test(id);
	}

	function isDependentField(field: IncomeEditorField) {
		return /(?:Pg4T2|P4T2)/.test(field.id);
	}

	function shouldShow(field: IncomeEditorField) {
		if (paymentFields.has(field.id)) return false;
		if (groupedSpouseTin.slice(1).includes(field.id)) return false;
		if (form.code === '1700v2018' && /PartVIEmployer(?:Name2|TIN[23]|BranchCode)$/.test(field.id)) return false;
		if (form.code === '1700v2018' && !includesSpouse && /^frm1700:rdoPg2I[1-4]PartVIEmployee$/.test(field.id)) {
			return values[field.id] === 'Spouse';
		}
		if (legacyAnnual && !includesSpouse && /^frm1701:rdoPg5Sc1I[1-4]TaxpayerSpouse$/.test(field.id)) return values[field.id] === '2';
		if (form.quarter && /Birth(?:Day|Year)$/.test(field.id)) return false;
		if (legacy1700) {
			if (legacyIdentificationFields.includes(field.id) || /^(?:summation|frm1700:txtPg1Pt2TaxFiler$)/.test(field.id)) return false;
			if (field.id.startsWith('frm1700:txtPg4T1')) return addressChanged;
			if (field.id === taxpayerCountId) return dependentClaim === 'taxpayer';
			if (field.id === spouseCountId) return dependentClaim === 'spouse';
			if (field.id === spouseClaimId) return includesSpouse;
			if (field.page === '4' && isDependentField(field)) {
				return !!errors[field.id] || (!!dependentClaim && Number(field.id.at(-1)) <= visibleDependentRows);
			}
		}
		if (errors[field.id]) return true;
		if (!annualFieldApplies(form.code, field.id, legacyAnnual ? calculated : values) || !shortAnnualFieldApplies(form.code, field.id, calculated)) return false;
		if (form.quarter && !quarterlyIncomeFieldApplies(form.code, field.id, values)) return false;
		if (form.code === '1701Q' && /^frm1701q:txt2[02][ABC]$/.test(field.id)) return false;
		if (spouseFiling && field.id === spouseFiling.income) return values[spouseFiling.civil] === 'Married';
		if (spouseFiling && field.id === spouseFiling.filing) {
			return values[spouseFiling.civil] === 'Married' && (!spouseFiling.income || values[spouseFiling.income] === spouseFiling.hasIncome);
		}
		if (spouseFieldIds.has(field.id)) return includesSpouse;
		if (!includesSpouse && /(?:background information (?:of|on) spouse|other relevant information - spouse)/i.test(field.section)) return false;
		if (field.person === 'spouse' && !/(?:SpouseHasIncome|SpouseIncome|FilingStatus)/i.test(field.id) && !includesSpouse) return false;
		if (form.code === '1701v2018') {
			if (field.id === 'frm1701:txtPg1I14ForeignTaxNumber') return values['frm1701:rdoPg1I13ForeignTaxCredits'] === 'Yes';
			if (field.id === 'frm1701:txtPg2I9ForeignTaxNumber') return values['frm1701:rdoPg2I8ForeignTaxCredits'] === 'Yes';
		}
		if (form.code === '1701MS') {
			const spouseField = /Spouse|frm1701MS:(?:txtRDOCodeb|txtTaxpayerNo8b|txtEmailb|txtTelNum10b|txtTaxpayerNo12b)$/.test(field.id);
			if (spouseField && !includesSpouse) return false;
			const special = field.id.match(/^frm1701MS:txtTaxpayerNo1[3-6]([ab])1?$/);
			if (special) return ['4', '5'].includes(values[`frm1701MS:txtTaxpayerNo12${special[1]}`]);
		}
		if (form.code === '1701A') {
			if (/Spouse/.test(field.id)) return includesSpouse;
		}
		if (form.code === '1700v2018') return revised1700FieldApplies(field.id, values);
		return true;
	}

	async function showPage(page: string, fieldId?: string) {
		currentPage = page;
		await tick();
		const targetId = fieldId?.replace(/(PartVIEmployer)(?:TIN[23]|BranchCode)$/, '$1TIN1')
			.replace(/Sc1I([1-4])EmpTIN[234]C1$/, 'Sc1I$1EmpTIN1C1')
			.replace(/(?:External|Signing|Spouse)TIN[234]$/, (tin) => `${tin.slice(0, -1)}1`);
		const field = targetId && document.getElementById(targetId);
		if (field) {
			const disclosure = field.closest('details');
			if (disclosure) {
				const schedule = disclosure.dataset.scheduleKey;
				if (schedule) scheduleOpen[schedule] = true;
				disclosure.open = true;
			}
			const target = field.matches('input, select, button, textarea') ? field : field.querySelector<HTMLElement>('input, select, button, textarea');
			(target ?? field).focus({ preventScroll: true });
			field.scrollIntoView({ block: 'center', behavior: 'instant' });
		} else {
			heading.focus({ preventScroll: true });
			heading.scrollIntoView({ block: 'nearest', behavior: 'instant' });
		}
	}

	function onvaluechange(patch: Record<string, string>) {
		const overpayment = legacy1701Filing.overpayment;
		if (legacyAnnual && values[overpayment] && !(overpayment in patch) &&
			(!legacy1701IsOverpaid(calculated) || !legacy1701IsOverpaid(calculateIndividualIncome(form, { ...values, ...patch })))) {
			onPatch({ ...patch, [overpayment]: '' });
		} else onPatch(patch);
	}

	function setValue(id: string, value: string) {
		if (value === values[id]) return;
		if (legacyAnnual && id === legacy1701Filing.type) {
			onvaluechange({ [id]: value, [legacy1701Filing.number]: '', [legacy1701Filing.amount]: '' });
			return;
		}
		if (spouseFiling && id === spouseFiling.civil && value !== 'Married') {
			const { income, filing } = spouseFiling;
			onvaluechange({ [id]: value, [filing]: form.defaults[filing] ?? '', ...(income ? { [income]: form.defaults[income] ?? '' } : {}) });
			return;
		}
		if (spouseFiling && id === spouseFiling.income && value !== spouseFiling.hasIncome) {
			onvaluechange({ [id]: value, [spouseFiling.filing]: form.defaults[spouseFiling.filing] ?? '' });
			return;
		}
		if (annualFiling && id === annualFiling.shortPeriod) {
			onvaluechange({ [id]: value, [annualFiling.month]: isShortFilingPeriod(annualFiling, { [id]: value }) ? '' : '12' });
			return;
		}
		if (form.code === '1701A' && /^frm1701A:opt(?:Spouse)?ATC$/.test(id)) {
			const rateId = id.replace(/ATC$/, 'TaxRate');
			onvaluechange({ [id]: value, [rateId]: annual1701ARateForAtc(value) ?? '' });
			return;
		}
		if (form.code === '1701v2018' && /^frm1701:rdo(?:Pg1I7|Pg2I4)ATC$/.test(id)) {
			const choice = id.includes('Pg1') ? 'frm1701:rdoPg1I21' : 'frm1701:rdoPg2I12';
			const rate = revised1701RateForAtc(value) ?? '';
			onvaluechange({ [id]: value, [`${choice}TaxRate`]: rate, ...(rate === 'Graduated' ? {} : { [`${choice}AMethodDeduction`]: '' }) });
			return;
		}
		if (form.code === '1701MS' && id === 'frm1701MS:sourceOfIncomeSpouse' && (value === '4' || values[id] === '4')) {
			onvaluechange({ [id]: value, 'frm1701MS:txtTaxpayerNo12b': value === '4' ? '2' : '' });
			return;
		}
		if (form.code === '1701MS' && /^frm1701MS:txtTaxpayerNo12[ab]$/.test(id)) {
			const deduction = id.endsWith('b') ? 'methodOfDeductionStandard' : 'methodOfDeductionMain';
			onvaluechange({ [id]: value, ...(value === '2' ? {} : { [deduction]: '' }) });
			return;
		}
		if (form.code === '1701Qv2018') {
			if (id === 'frm1701q:optTaxpayerType') {
				const entity = ['Estate', 'Trust'].includes(value);
				onvaluechange({ [id]: value, 'frm1701q:optATC': entity ? 'II012' : '', 'frm1701q:optTaxRate': entity ? 'Graduated' : '', 'frm1701q:optMethodOfDeduction': '' });
				return;
			}
			if (/^frm1701q:optSpouseType_[123]$/.test(id)) {
				const next = { ...values, [id]: value };
				const compensationOnly = next['frm1701q:optSpouseType_3'] === 'Compensation' && !next['frm1701q:optSpouseType_1'] && !next['frm1701q:optSpouseType_2'];
				onvaluechange({ [id]: value, 'frm1701q:optSpouseATC': compensationOnly ? 'II011' : '', 'frm1701q:optSpouseTaxRate': '', 'frm1701q:optSpouseMethod': '' });
				return;
			}
			if (id === 'frm1701q:optATC' || id === 'frm1701q:optSpouseATC') {
				const rateId = id === 'frm1701q:optATC' ? 'frm1701q:optTaxRate' : 'frm1701q:optSpouseTaxRate';
				const rate = quarterlyRateForAtc(value) ?? '';
				const deduction = id === 'frm1701q:optATC' ? 'frm1701q:optMethodOfDeduction' : 'frm1701q:optSpouseMethod';
				onvaluechange({ [id]: value, [rateId]: rate, ...(rate === 'Graduated' ? {} : { [deduction]: '' }) });
				return;
			}
		}
		if (form.code === '1701Q' && /^frm1701:optMethodOfDeduction2[34]$/.test(id) && values[id] === 'O' && value === 'I') {
			const deductionId = id.endsWith('3') ? 'frm1701q:txt33A' : 'frm1701q:txt33B';
			onvaluechange({ [id]: value, [deductionId]: '' });
			return;
		}
		if (legacy1700 && id === taxpayerClaimId && /YesInd$/.test(value) && includesSpouse) {
			onvaluechange({ [id]: value, [spouseClaimId]: 'frm1700:rdoPg1Pt1I21SpouseClaimAdditionalExemptionNo' });
		} else if (legacy1700 && id === spouseClaimId && /Yes$/.test(value)) {
			onvaluechange({ [id]: value, [taxpayerClaimId]: 'frm1700:rdoPg1Pt1I14NoInd' });
		} else {
			onvaluechange({ [id]: value });
		}
	}

	function asIsoDate(value: string): string {
		const date = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
		return date ? `${date[3]}-${date[1].padStart(2, '0')}-${date[2].padStart(2, '0')}` : value;
	}

	function asSourceDate(value: string): string {
		return value ? `${value.slice(5, 7)}/${value.slice(8, 10)}/${value.slice(0, 4)}` : '';
	}

	function isDate(field: IncomeEditorField) {
		if (legacyAnnual && /^frm1701:(?:txtPg1Pt2I35Month|txtPg1Pt1I11Month|ddlPg4Pt7I99Month|txtPg4Pt7AMonth[1-4]|txtPg4Pt8I11[78]Month)$/.test(field.id)) return true;
		if (/^frm1701MS:txtTaxpayerNo16[ab]1?$/.test(field.id)) return true;
		return field.kind === 'text' && !/Period|BirthMonth|BirthDay|BirthYear/i.test(field.id) &&
			(/BirthDate|DOB|DateofIssue|(?:Payment|Amount)Date/i.test(field.id) || /(?:Date\d*|DatePayment)$/.test(field.id));
	}
</script>

{#snippet signedScheduleAmount(field: IncomeEditorField, label: string)}
	<div class="signed-schedule-amount">
		<Input id={field.id} aria-label={label} inputmode="decimal"
			value={calculated[field.id] ?? ''} error={errors[field.id]}
			oninput={(event) => setValue(field.id, event.currentTarget.value)}>
			{#snippet leading()}<span aria-hidden="true">₱</span>{/snippet}
		</Input>
	</div>
{/snippet}

{#snippet historicalRegimeSchedule(scheduleFields: IncomeEditorField[])}
	<p class="regime-scroll-hint">Scroll sideways to see all tax regime amounts.</p>
	{#each schedulePeople as person, personIndex (person)}
		{@const title = person === 'spouse' ? 'Spouse tax regimes' : 'Taxpayer tax regimes'}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard access to the scrollable table) -->
		<div class="regime-viewport" role="region" aria-label={title} tabindex="0">
			<table class="tax-summary annual-schedule historical-regimes" aria-label={title}>
				<caption>{title}</caption>
				<colgroup>
					<col class="summary-number" />
					<col />
					{#each historicalRegimes as regime (regime)}
						<col class="summary-amount" />
					{/each}
				</colgroup>
				<thead>
					<tr>
						<th scope="col">Item</th>
						<th scope="col">Description</th>
						{#each historicalRegimes as regime (regime)}
							<th scope="col" class="summary-value">{regime}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each incomeEditorRows(scheduleFields) as row (row.key)}
						{@const label = row.fields[0].label.replace(/^\d+\s+| · (?:Taxpayer|Spouse)$/g, '')}
						<tr data-income-item={row.item}>
							<td>{row.item}</td>
							<th scope="row">{label}</th>
							{#each historicalRegimes as regime, index (regime)}
								{@const field = row.fields.find(field => field.id.endsWith(`C${personIndex * 4 + index + 1}`))}
								<td class="summary-value" class:summary-input={field && !computed.has(field.id)}>
									{#if !field}
										<span aria-label="Not applicable">—</span>
									{:else if computed.has(field.id)}
										<output id={field.id}>{currency.format(Number((calculated[field.id] ?? '').replaceAll(',', '')))}</output>
									{:else}
										{@render signedScheduleAmount(field, `Item ${row.item} ${label} · ${person} · ${regime}`)}
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/each}
{/snippet}

{#snippet annualSchedule(title: string, scheduleFields: IncomeEditorField[], lastItem?: number)}
	{@const people = form.code !== '1701A'
		? schedulePeople.filter(person => scheduleFields.some(field => field.kind === 'money' && (field.person ?? 'taxpayer') === person))
		: schedulePeople}
	{@const joint = people.length > 1}
	<table class="tax-summary annual-schedule" class:joint-summary={joint} aria-label={title}>
		<colgroup>
			<col class="summary-number" />
			<col />
			{#each people as person (person)}
				<col class="summary-amount" />
			{/each}
		</colgroup>
		<thead>
			<tr>
				<th scope="col">Item</th>
				<th scope="col">Description</th>
				{#each people as person (person)}
					<th scope="col" class="summary-value">{joint ? (person === 'spouse' ? 'Spouse' : 'Taxpayer') : 'Amount'}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each incomeEditorRows(scheduleFields) as row (row.key)}
				{@const item = row.item ?? ''}
				{@const label = form.code !== '1701A'
					? (row.fields.find(field => field.kind === 'money')?.label ?? '').replace(/^\d+[A-Z]?\s+| · (?:Taxpayer|Spouse)$/g, '')
					: annual1701AScheduleLabels[item]}
				{@const detail = row.fields.find(field => field.kind === 'text')}
				<tr class:schedule-total={Number(item) === lastItem} data-income-item={item}>
					<td>{item}</td>
					<th scope="row">
						{label}
						{#if form.code === '1701A' && item === '39'}<span class="schedule-note">40% of item 38</span>{/if}
						{#if detail}
							<Input id={detail.id} aria-label={`Item ${item} ${label.toLowerCase()} description`}
								value={values[detail.id] ?? ''} error={errors[detail.id]} maxlength={detail.maxLength ?? undefined}
								oninput={(event) => setValue(detail.id, event.currentTarget.value)} />
						{/if}
					</th>
					{#each people as person (person)}
						{@const field = row.fields.find(field => field.kind === 'money' && (field.person ?? 'taxpayer') === person)}
						{@const value = field ? calculated[field.id] ?? '' : ''}
						{@const inputLabel = `Item ${item} ${label.toLowerCase()} amount${joint ? ` · ${person === 'spouse' ? 'Spouse' : 'Taxpayer'}` : ''}`}
						<td class="summary-value" class:summary-input={field && !computed.has(field.id)}>
							{#if !field}
								<span aria-label="Not applicable">—</span>
							{:else if computed.has(field.id)}
								<output id={field.id}>{currency.format(Number(value.replaceAll(',', '')))}</output>
								{#if errors[field.id]}<FieldErrors errors={[errors[field.id]]} />{/if}
							{:else if /loss|overpayment|net income per books/i.test(label) || /^[(-]/.test(value)}
								{@render signedScheduleAmount(field, inputLabel)}
							{:else}
								<CurrencyInput id={field.id} aria-label={inputLabel}
									{value} error={errors[field.id]} onchange={(next) => setValue(field.id, next)} />
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
{/snippet}

{#snippet fieldControl(field: IncomeEditorField)}
	{@const { id, kind } = field}
	{@const fieldLabel = field.label.replace(/^\d+[A-Z]?(?:\/[A-Z])?\s+/, '')}
	{@const label = legacyAnnual && id === legacy1701Filing.type ? 'Identification type' :
		id === legacy1701Filing.overpayment ? 'Apply overpayment as' :
		id === legacy1701Filing.issueDate ? 'Date of issue' :
		id === legacy1701Filing.amount ? 'CTC amount' :
		id === 'frm1700:txtPg1Pt2I32GovID' || (legacyAnnual && id === legacy1701Filing.number) ? (idType === 'CTC' ? 'CTC number' : 'Government ID number') :
		form.code === '1700v2018' && !includesSpouse ? fieldLabel.replace(/ · Taxpayer$/, '') : fieldLabel}
	{@const value = calculated[id] ?? ''}
	{@const derivedRate = (form.code === '1701A' && /^frm1701A:opt(?:Spouse)?TaxRate$/.test(id) && annual1701ARateForAtc(values[id.replace(/TaxRate$/, 'ATC')])) ||
		(form.code === '1701v2018' && /^frm1701:rdo(?:Pg1I21|Pg2I12)TaxRate$/.test(id) && revised1701RateForAtc(values[id.includes('Pg1') ? 'frm1701:rdoPg1I7ATC' : 'frm1701:rdoPg2I4ATC'])) ||
		(form.code === '1701Qv2018' && /^frm1701q:opt(?:Spouse)?TaxRate$/.test(id) && quarterlyRateForAtc(calculated[id.replace(/TaxRate$/, 'ATC')])) ||
		(form.code === '1701MS' && id === 'frm1701MS:txtTaxpayerNo12b' && values['frm1701MS:sourceOfIncomeSpouse'] === '4')}
	{@const fixedQuarterlyAtc = form.code === '1701Qv2018' && (
		(id === 'frm1701q:optATC' && ['Estate', 'Trust'].includes(values['frm1701q:optTaxpayerType'])) ||
		(id === 'frm1701q:optSpouseATC' && values['frm1701q:optSpouseType_3'] === 'Compensation' && !values['frm1701q:optSpouseType_1'] && !values['frm1701q:optSpouseType_2'])
	)}
	{@const birthParts = form.quarter && id.endsWith('BirthMonth') ? ['Month', 'Day', 'Year'].map(part => id.replace(/Month$/, part)) : []}
	{@const filingMonth = annualFiling?.month === id}
	{@const error = errors[id] ?? errors[birthParts[1]] ?? ''}
	{@const locked = profileFields.has(id) && (!!value || spouseFieldIds.has(id))}
	{@const employerEarner = /^frm1700:rdoPg2(?:Pt4I[1-3]Employer|I\d+PartVIEmployee)$/.test(id) || /^frm1701:chkPg2IShed[12]a_[12]$/.test(id)}
	{@const addressZip = legacy1700 && id === 'frm1700:txtPg4T1ZipCde'}
	{@const wholeNumber = legacy1700 && isShareCount(id)}
	{@const historicalCount = legacyAnnual && /^frm1701:txt(?:Pg1Pt1I24Dependent|Pg4Pt7I111Dependent|Pg11Sc12AI14NumberOfSharesC[12])$/.test(id)}
	{@const historicalYear = (legacyAnnual && id.endsWith('YearIncurred')) || (form.code === '1701v2018' && /IShed6_\d+Year$/.test(id))}
	{@const employerName = legacy1700 && /^frm1700:txtPg2Pt4I[1-3]NameOfEmployer$/.test(id)}
	{@const revisedFilingChoice = form.code === '1700v2018' && /^frm1700:rdoPg1I(?:6TaxpayerType|15CivilStatus|16SpouseHasIncome|17FilingStatus|20SpouseTaxpayerType)$/.test(id)}
	{@const addressRequired = legacy1700 && /^frm1700:txtPg4T1(?:SubdivisionVillage|Barangay|MunicipalityCity|Province|ZipCde)$/.test(id)}
	{@const options = field.options.filter(option => option !== '' && option !== '000' && (!filingMonth || option !== '00') &&
		(!employerEarner || includesSpouse || !option.endsWith('Spouse')))
		.map((option, index) => ({ value: option, label: employerEarner
			? (option.endsWith('Spouse') ? 'Spouse' : 'Taxpayer') : incomeChoiceLabel(field, option, index) }))}
	{#if id === 'frm1701A:txtSpouseTIN1' || id === 'frm1701:txtPg4Pt7I95SpouseTIN1' || id === groupedSpouseTin[0]}
		{@const parts = id === groupedSpouseTin[0] ? groupedSpouseTin : [1, 2, 3, 4].map(part => part === 4 && form.code === '1701A' ? id.replace('TIN1', 'BranchCode') : id.replace('TIN1', `TIN${part}`))}
		<dl class="managed-value">
			<dt>Spouse TIN and branch code</dt>
			<dd>
				{#if parts.some(part => calculated[part])}
					{#each parts as part, index (part)}{index ? '-' : ''}<span id={part}>{calculated[part] || '—'}</span>{/each}
				{:else}
					<span {id}>—</span>
				{/if}
			</dd>
		</dl>
		{@const tinErrors = [...new Set(parts.flatMap(part => errors[part] ? [errors[part]] : []))]}
		{#if tinErrors.length}<FieldErrors errors={tinErrors} />{/if}
	{:else if form.code === '1700v2018' && /PartVIEmployerName1$/.test(id)}
		{@const continuation = id.replace(/Name1$/, 'Name2')}
		<Input {id} {label} {value} {error} maxlength={field.maxLength ?? undefined} oninput={(event) => setValue(id, event.currentTarget.value)} />
		<details class="employer-name-continuation" open={!!values[continuation]?.trim() || !!errors[continuation]}>
			<summary>
				<span class="schedule-chevron" aria-hidden="true"><Icon icon={glyphs.chevronRight} /></span>
				<span class="add-name-line">Add second name line</span>
				<span class="hide-name-line">Hide second name line</span>
			</summary>
			<Input id={continuation} label="Second name line" value={values[continuation] ?? ''} error={errors[continuation] ?? ''}
				maxlength={field.maxLength ?? undefined} oninput={(event) => setValue(continuation, event.currentTarget.value)} />
		</details>
	{:else if (form.code === '1700v2018' && /PartVIEmployerTIN1$/.test(id)) || (form.code === '1701v2018' && /IShed[12]a_TIN1$/.test(id)) || (legacyAnnual && /(?:Sc1I[1-4]EmpTIN1C1|(?:External|Signing)TIN1)$/.test(id))}
		{@const parts = legacyAnnual ? [1, 2, 3, 4].map(part => id.replace('TIN1', `TIN${part}`)) :
			['TIN1', 'TIN2', 'TIN3', 'BranchCode'].map(part => id.replace(/TIN1$/, part))}
		{@const tinLabel = /ExternalTIN/.test(id) ? 'Auditor or tax agent TIN and branch code' :
			/SigningTIN/.test(id) ? 'Signing partner TIN and branch code' : 'Employer TIN and branch code'}
		<div class="employer-tin">
			<TinInput {id} label={tinLabel} value={parts.map(part => values[part] ?? '').join('-')}
				error={parts.map(part => errors[part]).filter(Boolean).join(' ')} onchange={(next) => {
				const digits = next.replace(/\D/g, '');
				const slices = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9), digits.slice(9)];
				if (digits === parts.map(part => values[part] ?? '').join('')) return;
				onvaluechange(Object.fromEntries(parts.map((part, index) => [part, slices[index]])));
			}} />
		</div>
	{:else if id === form.year && legacy1700}
		{@const shortYear = /^\d{2}$/.test(value)}
		<NumberInput {id} {label} {value} {error} required maxlength={4} placeholder="YYYY"
			min={shortYear ? legacy1700FirstYear % 100 : legacy1700FirstYear} max={shortYear ? legacy1700LastYear % 100 : legacy1700LastYear}
			help={`${legacy1700FirstYear}–${legacy1700LastYear} for this revision`} onchange={(next) => setValue(id, next)} />
	{:else if id === form.year}
		<NumberInput {id} {label} {value} {error} required maxlength={4} placeholder="YYYY" onchange={(next) => setValue(id, next)} />
	{:else if birthParts.length}
		{@const birthDate = birthParts.map(part => calculated[part] ?? '').join('/')}
		{@const dateLabel = spouseFieldIds.has(id) ? 'Spouse date of birth' : 'Date of birth'}
		{#if locked}
			<dl class="managed-value" {id}>
				<dt>{dateLabel}</dt>
				<dd>{birthDate === '//' ? '—' : birthDate}</dd>
			</dl>
			{#if error}<FieldErrors errors={[error]} />{/if}
		{:else}
			<DateInput {id} label={dateLabel} value={birthDate === '//' ? '' : asIsoDate(birthDate)} {error} required onchange={(next) => {
				const date = asSourceDate(next).split('/');
				onvaluechange(Object.fromEntries(birthParts.map((part, index) => [part, date[index] ?? ''])));
			}} />
		{/if}
	{:else if /(?:PagesFiled|PagesFilled|Number(?:Of)?Attachments|txtSheets)$/.test(id)}
		<NumberInput {id} {label} {value} {error} min={0} max={99} maxlength={field.maxLength ?? undefined} onchange={(next) => setValue(id, next)} />
	{:else if historicalCount || historicalYear}
		<NumberInput {id} {label} {value} {error} min={historicalYear ? 1900 : 0}
			max={historicalYear ? 9999 : id.endsWith('Dependent') ? 4 : undefined}
			maxlength={field.maxLength ?? undefined} onchange={(next) => setValue(id, next)} />
	{:else if form.code === '1701MS' && /^frm1701MS:txtTaxRate[ab]$/.test(id)}
		<NumberInput {id} {label} value={value.replace(/%$/, '')} {error} decimal min={0} max={100}
			onchange={(next) => setValue(id, next ? `${next}%` : '')} />
	{:else if filingMonth && annualFiling && !isShortFilingPeriod(annualFiling, values)}
		<dl class="managed-value" id={id}>
			<dt>{label}</dt>
			<dd>December</dd>
		</dl>
	{:else if legacyAnnual && id === legacy1701Filing.number && idType === 'CTC'}
		<NumberInput {id} {label} {value} {error} maxlength={8} min={0} onchange={(next) => setValue(id, next)} />
	{:else if wholeNumber || addressZip}
		<NumberInput {id} {label} {value} {error} min={0} required={addressZip}
			maxlength={addressZip ? 4 : field.maxLength ?? undefined} onchange={(next) => setValue(id, next)} />
	{:else if legacy1700 && (id === taxpayerCountId || id === spouseCountId)}
		<div class="dependent-count">
			<div class="dependent-count-value">
				<span id={`${id}-label`}>{label}</span>
				<output {id} aria-labelledby={`${id}-label`}>{value || '0'}</output>
			</div>
			<Button size="sm" variant="secondary" aria-label="Edit dependents on page 4"
				onclick={() => void showPage('4', 'frm1700:txtPg4T2LastName1')}>Edit on page 4</Button>
		</div>
		{#if error}<FieldErrors errors={[error]} />{/if}
	{:else if form.code === '1700v2018' && id === 'frm1700:txtPg1I3ATC'}
		<dl class="managed-value" {id}>
			<dt>{label}</dt>
			<dd>{value || '—'}</dd>
		</dl>
	{:else if computed.has(id) && legacy1700 && field.page !== '1' && kind === 'money'}
		<div class="schedule-calculated">
			<span id={`${id}-label`}>{label}</span>
			<output {id} aria-labelledby={`${id}-label`} aria-live="off">{currency.format(Number(value.replaceAll(',', '')))}</output>
		</div>
		{#if error}<FieldErrors errors={[error]} />{/if}
	{:else if computed.has(id)}
		<CalculatedValue {id} {label} value={kind === 'money' && value !== '' ? currency.format(Number(value.replaceAll(',', ''))) : value} {error} />
	{:else if derivedRate || fixedQuarterlyAtc || (form.code === '1701MS' && /^taxCodeDropdown(?:Spouse)?$/.test(id))}
		<CalculatedValue {id} {label} value={options.find(option => option.value === value)?.label || value} {error} />
	{:else if locked}
		<dl class="managed-value" id={id}>
			<dt>{label}</dt>
			<dd>{options.find(option => option.value === value)?.label || value || '—'}</dd>
		</dl>
		{#if error}<FieldErrors errors={[error]} />{/if}
	{:else if kind === 'radio' && options.length > 3 && /tax code \(ATC\)/i.test(label)}
		<Select {id} {label} {value} {options} {error} placeholder="Select tax code" onchange={(next) => setValue(id, next)} />
	{:else if kind === 'radio' && (options.length > 1 || employerEarner)}
		<RadioGroup {id} {label} {value} {options} {error}
			required={id === legacy1701Filing.overpayment || revisedFilingChoice || employerEarner || (legacy1700 && id === 'frm1700:rdoPg1Pt1I3JointFiling')}
			help={employerEarner && !value ? 'Choose who earned this income to include it in the totals.' : undefined}
			onchange={(next) => setValue(id, next)} />
	{:else if kind === 'checkbox' || (kind === 'radio' && options.length === 1)}
		<CheckboxInput {id} {label}
			checked={kind === 'radio' ? value === options[0].value : legacy1700
				? legacy1700IncomeSourceChecked(id, value) : ['Y', '1', 'true', 'on'].includes(value)}
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={error ? `${id}-error` : undefined}
			onchange={(event) => setValue(id, event.currentTarget.checked ? (kind === 'radio' ? options[0].value : 'Y') : '')} />
		{#if error}<FieldErrors id={`${id}-error`} errors={[error]} />{/if}
	{:else if kind === 'select' && options.length}
		<Select {id} {label} {value} {options} {error}
			placeholder={/^frm1700:drpPg3Pt5I12/.test(id) ? 'Select share type' : undefined}
			onchange={(next) => setValue(id, next)} />
	{:else if isDate(field)}
		<DateInput {id} {label} value={asIsoDate(value)} {error} onchange={(next) => setValue(id, asSourceDate(next))} />
	{:else if kind === 'money' && !/Loss|Adjustment|Prior.*Income/i.test(label)}
		<CurrencyInput {id} label={field.shortLabel ?? label} aria-label={field.shortLabel ? label : undefined}
			{value} {error} onchange={(next) => setValue(id, next)} />
	{:else if kind === 'money'}
		<Input {id} {label} {value} {error} inputmode="decimal" oninput={(event) => setValue(id, event.currentTarget.value)} />
	{:else}
		<Input {id} {label} {value} {error} required={addressRequired || employerName} inputmode={id === form.year || /Psoc/i.test(id) || /TIN[123]|BranchCode|ZipCode/i.test(id) ? 'numeric' : undefined}
			maxlength={id === 'frm1700:txtPg1Pt2I32GovID' ? (idType === 'CTC' ? 8 : 17) : field.maxLength ?? undefined} oninput={(event) => setValue(id, event.currentTarget.value)} />
	{/if}
{/snippet}

{#snippet supplementalAmounts(sectionFields: IncomeEditorField[])}
	<div class="supplemental-amounts">
		<div class="supplemental-amount-row supplemental-column-head" aria-hidden="true">
			<span>Income type</span>
			{#each Object.entries(supplementalAmountHeadings) as [column, title] (column)}
				<span class={column}>{title}</span>
			{/each}
		</div>
		{#each incomeEditorRows(sectionFields) as row (row.key)}
			<div class="supplemental-amount-row" data-income-item={row.item}>
				<h4><span class="paper-item-number">{row.item}</span>{row.fields[0].rowHeading}</h4>
				{#each row.fields as field (field.id)}
					<div class="income-control {field.amountColumn}">{@render fieldControl(field)}</div>
				{/each}
			</div>
		{/each}
	</div>
{/snippet}

{#snippet supplementalTransactions(title: string, sectionFields: IncomeEditorField[], names: [string, string])}
	{@const [name, addLabel] = names}
	{@const entries = (['A', 'B'] as const).map(entry => sectionFields.filter(field => field.transaction === entry))}
	{@const showSecond = addedSupplementalEntries.includes(title) || entries[1].some(hasScheduleEntry)}
	{@const firstRows = incomeEditorRows(entries[0])}
	<div class="supplemental-transactions" style:--entry-row-count={firstRows.length + 1}>
		{#each entries.slice(0, showSecond ? 2 : 1) as entry, index (index)}
			{@const labelId = `${entry[0].id}-entry-title`}
			<div class="supplemental-entry" role="group" aria-labelledby={labelId}>
				<h4 id={labelId}>{name} {index + 1}</h4>
				{#each index === 0 ? firstRows : incomeEditorRows(entry) as row (row.key)}
					<div class="supplemental-entry-row numbered" data-income-item={row.item}>
						<span class="paper-item-number" aria-hidden="true">{row.item}</span>
						<div class="supplemental-entry-fields" class:paired={title === 'Share transactions' && row.item === '12'}>
							{#each row.fields as field (field.id)}
								<div class="income-control">
									{@render fieldControl({ ...field, label: field.shortLabel ?? field.label, shortLabel: undefined })}
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/each}
		{#if !showSecond}
			<div class="supplemental-add-entry">
				<Button size="sm" variant="secondary" onclick={() => {
					addedSupplementalEntries = [...addedSupplementalEntries, title];
					void showPage('3', entries[1][0].id);
				}}>{addLabel}</Button>
			</div>
		{/if}
	</div>
{/snippet}

<div class="paper-sheet income-editor" class:legacy-1700-editor={legacy1700} class:legacy-1701-editor={legacyAnnual} class:revised-1700-editor={form.code === '1700v2018'} role="region" aria-label={form.title}>
	<PaperFormHeader number={formNumber} {revision} title={shortTitle} subtitle={description} />
	{#if Object.keys(errors).length}
		<div class="income-errors" role="alert">
			<strong>Correct these items</strong>
			<ul>
				{#each Object.entries(errors) as [id, error] (id)}
					{@const targetId = form.quarter ? id.replace(/Birth(?:Day|Year)$/, 'BirthMonth') : id}
					{@const target = fields.find(field => field.id === targetId)}
					<li>
						{#if profileFields.has(id) || summaryIds.has(id) || (id === form.identity.email && !target)}
							<ButtonLink href={taxpayerHref} variant="ghost" size="sm">{error}</ButtonLink>
						{:else if target && pages.includes(target.page)}
							<button type="button" onclick={() => void showPage(target.page, targetId)}>{error}</button>
						{:else}
							{error}
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div class="page-context">
		<h2 bind:this={heading} tabindex="-1">{incomeEditorPageTitle(form, selectedPage ?? '1')}</h2>
		{#if values[form.year]}<p>{individualIncomePeriod(form, values)}</p>{/if}
	</div>
	{#if selectedPage !== '1'}
		<p class="schedule-taxpayer">{(legacy1700 ? profile.taxpayerName : values[form.identity.taxpayerName!]) || profile.taxpayerName}</p>
	{/if}
	{#if !['1700v2018', '1701A'].includes(form.code) && visibleFields.some(field => spouseFieldIds.has(field.id))}
		<div class="income-spouse-action">
			<ButtonLink href={taxpayerHref} size="icon" variant="ghost" aria-label="Edit spouse details" title="Edit spouse details">
				<span class="edit-spouse-icon"><Icon icon={glyphs.pencil} /></span>
			</ButtonLink>
		</div>
	{/if}
	{#snippet taxpayerDetails()}
		<ReturnTaxpayerInformation formCode={form.code} {values} {profile} {taxpayerHref} {itemNumbers} extraItems={taxpayerExtras}>
			{#snippet extraField(id)}
				{@const field = fields.find(field => field.id === id)}
				{#if field}{@render fieldControl(field)}{/if}
			{/snippet}
		</ReturnTaxpayerInformation>
		{#if form.quarter && !['Estate', 'Trust'].includes(values['frm1701q:optTaxpayerType'])}
			<div class="income-spouse-action">
				{#if includesSpouse}
					<Button variant="secondary" size="sm" onclick={() => setValue('income:useSavedSpouse', 'N')}>Remove spouse from this return</Button>
				{:else if profile.spouse}
					<Button variant="secondary" size="sm" onclick={() => setValue('income:useSavedSpouse', 'Y')}>Use saved spouse details</Button>
				{:else}
					<ButtonLink href={taxpayerHref} size="sm" variant="secondary">Add spouse details</ButtonLink>
				{/if}
			</div>
		{/if}
	{/snippet}
	{#each groups as group, index (`${selectedPage}-${index}`)}
		{#if selectedPage === '1' && index === 1 && Object.keys(itemNumbers).length}
			{@render taxpayerDetails()}
		{/if}
		{@const filingDetails = group.title === 'Filing details'}
		{@const legacySummary = legacy1700 && group.title === 'Part II - Total Tax Payable'}
		{@const revisedSummary = form.code === '1700v2018' && /^Part III - Total Tax Payable\b/i.test(group.title)}
		{@const otherSummary = /^Part [IVX]+ - Total (?:Income )?Tax Payable\b/i.test(group.title) ? otherTaxSummaries[form.code] : undefined}
		{@const summaryLabels = otherSummary?.labels ?? (revisedSummary ? revisedTaxSummaryLabels : taxSummaryLabels)}
		{@const summaryFields = legacySummary || revisedSummary || otherSummary ? group.fields.filter(field => field.item && summaryLabels[field.item]) : []}
		{@const jointSummary = !legacySummary && summaryFields.some(field => field.person === 'spouse')}
		{@const totalItem = otherSummary?.total ?? (revisedSummary ? '36' : '31')}
		{@const summaryPart = /^Part ([IVX]+)/i.exec(group.title)?.[1]}
		{@const revisedEmployer = (form.code === '1700v2018' || form.code === '1701v2018' || legacyAnnual) && /^Schedule 1 · Employer \d+$/.test(group.title)}
		{@const revisedSpouseSection = form.code === '1700v2018' && /^Part II - Background Information on Spouse$/i.test(group.title)}
		{@const supplementalTotal = legacy1700 && selectedPage === '3' && group.fields.length === 1 && computed.has(group.fields[0].id)}
		{@const transactionNames = legacy1700 && selectedPage === '3' ? supplementalEntryNames[group.title] : undefined}
		{@const annualScheduleEnd = form.code === '1701A' ? annual1701ASchedules[group.title as keyof typeof annual1701ASchedules] : undefined}
		{@const historicalAmounts = (legacyAnnual && selectedPage !== '1' && selectedPage !== '12' ||
			['1701v2018', '1701MS', '1701Qv2018'].includes(form.code) && selectedPage !== '1') &&
			incomeEditorRows(group.fields).every(row => {
				const amounts = row.fields.filter(field => field.kind === 'money');
				const detail = row.fields.find(field => field.kind !== 'money');
				return row.item && amounts.length > 0 && new Set(amounts.map(field => field.person ?? 'taxpayer')).size === amounts.length &&
					(!detail || (row.fields.length === amounts.length + 1 && detail.kind === 'text' &&
						/Description$|Desc$|Specify$|Particulars$|^frm1701:txtPg10Sc11|^frm1701MS:add/.test(detail.id)));
			})}
		{@const historicalRegime = legacyAnnual && selectedPage === '12' && group.fields.every(field => /:txtPg12Pt9I/.test(field.id))}
		{@const annualSpouse = form.code === '1701A' && /^Part V - Background Information on Spouse$/i.test(group.title)}
		<section class="income-section" class:annual-schedule-section={!!annualScheduleEnd || historicalAmounts} class:supplemental-total={supplementalTotal} aria-label={group.title}>
			{#snippet sectionHeading()}
				{#if group.title !== 'Filing details'}
					{#if !(selectedPage === '1' && index === 1 && Object.keys(itemNumbers).length && /background information (?:of|on) taxpayer/i.test(group.title))}
						<header class="eq-section-header">
							<h3>{summaryFields.length ? `Part ${summaryPart} · Total tax payable` : revisedSpouseSection ? 'Part II · Spouse information' : annualSpouse ? 'Part V · Spouse information' :
								form.code === '1701Q' && group.title === 'Part I' ? 'Filer and tax options' : group.title}</h3>
							{#if revisedSpouseSection || annualSpouse}
								<ButtonLink href={taxpayerHref} variant="ghost" size="icon" aria-label="Edit spouse details" title="Edit spouse details">
									<span class="edit-spouse-icon"><Icon icon={glyphs.pencil} /></span>
								</ButtonLink>
							{/if}
						</header>
					{/if}
				{/if}
			{/snippet}
			{#snippet sectionContents()}
				{#if historicalRegime}
					{@render historicalRegimeSchedule(group.fields)}
				{:else if annualScheduleEnd || historicalAmounts}
					{@render annualSchedule(group.title, group.fields, annualScheduleEnd)}
				{:else}
				{#if summaryFields.length}
					<table class="tax-summary" class:joint-summary={jointSummary} aria-label="Calculated tax amounts">
						<colgroup>
							<col class="summary-number" />
							<col />
							<col class="summary-amount" />
							{#if jointSummary}<col class="summary-amount" />{/if}
						</colgroup>
						<thead>
							<tr>
								<th scope="col">Item</th>
								<th scope="col">Description</th>
								<th scope="col" class="summary-value">{jointSummary ? 'Taxpayer' : 'Amount'}</th>
								{#if jointSummary}<th scope="col" class="summary-value">Spouse</th>{/if}
							</tr>
						</thead>
						<tbody>
							{#each incomeEditorRows(summaryFields) as row (row.key)}
								{@const item = row.item ?? ''}
								{@const label = summaryLabels[item] ?? ''}
								{@const total = item === totalItem}
								{@const negative = Number(calculated[row.fields[0].id]?.replaceAll(',', '') ?? 0) < 0}
								<tr class:tax-total={total}>
									<td>{item}</td>
									<th scope="row" title={legacySummary && total ? 'Item 28 less Item 29, plus Item 30' : row.fields[0].label}>
										{total && negative ? (label.startsWith('Aggregate') ? 'Aggregate overpayment' : 'Overpayment') : label}
									</th>
									{#each row.fields as field (field.id)}
										{@const value = calculated[field.id] ?? ''}
										{#if !legacySummary && !computed.has(field.id)}
											<td class="summary-value summary-input">
												<CurrencyInput id={field.id} aria-label={jointSummary ? `${label} · ${field.person === 'spouse' ? 'Spouse' : 'Taxpayer'}` : label}
													{value} error={errors[field.id]} onchange={(next) => setValue(field.id, next)} />
											</td>
										{:else}
											<td class="summary-value" id={field.id} colspan={jointSummary && row.fields.length === 1 ? 2 : undefined}>{currency.format(Number(value.replaceAll(',', '')))}</td>
										{/if}
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
				<div class="income-fields" class:annual-spouse-fields={annualSpouse} class:revised-employer={revisedEmployer} class:legacy-schedule={legacy1700 && selectedPage !== '1'}
					class:legacy-filing={legacy1700 && filingDetails} class:return-filing={!legacy1700 && filingDetails} class:quarter-filing={!!form.quarter && filingDetails}>
					{#each incomeEditorRows(group.fields.filter(field => !summaryFields.includes(field) &&
						!(form.code === '1701v2018' && revisedEmployer && /IShed[12]a_(?:TIN[23]|BranchCode)$/.test(field.id)) &&
						!(legacyAnnual && /(?:Sc1I[1-4]EmpTIN[234]C1|Pt7I\d+(?:External|Signing|Spouse)TIN[234])$/.test(field.id)) &&
						!(annualSpouse && /^frm1701A:txtSpouse(?:TIN[23]|BranchCode)$/.test(field.id)))) as row (row.key)}
						{#if row.item}
							{@const unnumbered = revisedEmployer || (legacy1700 && /^(?:Part IV · Employer [1-3]$|Table 1 · Current address$|Table 2 · Dependent)/.test(group.title))}
							<div class="income-row" class:numbered={!unnumbered} class:amount-row={row.fields.every(field => field.kind === 'money')} data-income-item={unnumbered ? undefined : row.item}>
								{#if !unnumbered}<span class="paper-item-number" aria-hidden="true">{row.item}</span>{/if}
								{#if legacy1700 && filingDetails && row.item === '4'}
									<fieldset class="filing-sources">
										<legend>Source of income</legend>
										{#each row.fields as field (field.id)}
											{@render fieldControl(field)}
										{/each}
									</fieldset>
								{:else}
									<div class="income-row-controls" class:income-description={row.fields.length > 1 && row.fields[0].id.endsWith('Desc') && row.fields.slice(1).every(field => field.kind === 'money')} style:--income-column-count={row.fields.length}>
										{#if row.fields[0].rowHeading}<div class="schedule-row-title">{row.fields[0].rowHeading}</div>{/if}
										{#each row.fields as field (field.id)}
											<div class="income-control">{@render fieldControl(field)}</div>
										{/each}
									</div>
								{/if}
							</div>
						{:else}
							{#each row.fields as field (field.id)}
								<div class="income-control" class:wide={field.kind === 'radio' || /Name|Address|Description/.test(field.id)} class:pages-filed={field.id === 'frm1700:txtPg1Pt2NumberofPagesFiled'}>
									{@render fieldControl(field)}
								</div>
							{/each}
						{/if}
					{/each}
				</div>
				{/if}
			{/snippet}
			{#if group.fields[0]?.optionalSection}
				{@const scheduleKey = `${selectedPage}:${group.title}`}
				{@const expanded = scheduleOpen[scheduleKey] ?? group.fields.some(hasScheduleEntry)}
				<details class="schedule-disclosure" data-schedule-key={scheduleKey} open={expanded}>
					<summary class="eq-section-header" onclick={(event) => {
						event.preventDefault();
						scheduleOpen[scheduleKey] = !expanded;
					}}>
						<h3>
							<span class="schedule-chevron" aria-hidden="true">
								<Icon icon={glyphs.chevronRight} />
							</span>
							{group.title}
						</h3>
					</summary>
					{#if transactionNames}
						{@render supplementalTransactions(group.title, group.fields, transactionNames)}
					{:else if group.fields[0]?.amountColumn}
						{@render supplementalAmounts(group.fields)}
					{:else}
						{@render sectionContents()}
					{/if}
				</details>
			{:else}
				{#if !supplementalTotal}{@render sectionHeading()}{/if}
				{@render sectionContents()}
			{/if}
		</section>
	{/each}
	{#if legacy1700 && selectedPage === '4' && dependentClaim && visibleDependentRows < 4}
		<div class="income-spouse-action">
			<Button size="sm" variant="secondary" onclick={() => {
				addedDependentRows = visibleDependentRows + 1;
				void showPage('4', `frm1700:txtPg4T2LastName${addedDependentRows}`);
			}}>Add dependent</Button>
		</div>
	{/if}
	{#if legacy1700 && selectedPage === '4' && !visibleFields.length}
		<div class="schedule-taxpayer schedule-empty">
			<p>This schedule applies when the registered address changed or qualified dependents are declared on page 1.</p>
			<div>
				<Button size="sm" variant="secondary" onclick={() => void showPage('1', addressChangedId)}>Review address on page 1</Button>
				<Button size="sm" variant="secondary" onclick={() => void showPage('1', taxpayerClaimId)}>Review exemptions on page 1</Button>
			</div>
		</div>
	{/if}
	{#if (legacy1700 || legacyAnnual) && selectedPage === '1'}
		<section class="income-section" aria-labelledby="legacy-1700-identification">
			<header class="eq-section-header"><h3 id="legacy-1700-identification">Filing identification</h3></header>
			<div class="filing-identification" class:annual-identification={legacyAnnual} class:government-id={idType === 'Gov'}>
				{#each legacyIdFields as field (field.id)}
					<div class:identification-type={field.id === identificationType} class:identification-pages={field.id === legacy1701Filing.pages}>
						{#if field.id !== identificationType}<span class="paper-item-number" aria-hidden="true">{field.item}</span>{/if}
						<div class="income-control">{@render fieldControl(field)}</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}
	{#if selectedPage === '1' && groups.length <= 1 && Object.keys(itemNumbers).length}
		{@render taxpayerDetails()}
	{/if}
	<ReturnPagination pages={pages.map(page => ({ id: page, title: incomeEditorPageTitle(form, page) }))}
		current={selectedPage} onchange={(page) => void showPage(page)} />
</div>

<style>
	.income-editor { min-width: 0; }
	.filing-identification {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1px;
		border-block-end: 1px solid var(--border);
		background: var(--border);
	}
	@container paper-form (min-width: 36rem) {
		.filing-identification { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	}
	@container paper-form (36rem <= width < 62rem) {
		.filing-identification.government-id > :last-child { grid-column: 1 / -1; }
	}
	@container paper-form (min-width: 62rem) {
		.filing-identification { grid-template-columns: repeat(4, minmax(0, 1fr)); }
		.filing-identification.government-id { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	}
	.filing-identification > div { min-width: 0; display: grid; grid-template-columns: 1.4rem minmax(0, 1fr); align-items: start; gap: .5rem; padding: .75rem .875rem; background: var(--bg-elev); }
	.filing-identification > .identification-type { grid-column: 1 / -1; grid-template-columns: minmax(0, 1fr); }
	.legacy-schedule .income-row { padding-block: .625rem; }
	.legacy-schedule .amount-row { background: var(--bg); }
	@container paper-form (min-width: 36rem) {
		.legacy-schedule .income-row-controls { grid-template-columns: repeat(var(--income-column-count, 1), minmax(0, 1fr)); }
	}
	.annual-identification > .identification-pages { grid-column: 1 / -1; }
	.annual-identification .identification-pages .income-control { max-inline-size: 13rem; }
	.income-editor :global(input[inputmode="decimal"]) { text-align: right; font-variant-numeric: tabular-nums; }
	.page-context { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .25rem 1rem; padding: .625rem .875rem; border-bottom: 1px solid var(--border); }
	.page-context h2, .income-section h3 { font: inherit; font-size: .875rem; font-weight: 650; margin: 0; }
	.page-context p, .schedule-taxpayer { font-size: .8rem; color: var(--fg-muted); margin: 0; }
	.schedule-empty { display: grid; gap: .625rem; }
	.schedule-empty p { margin: 0; }
	.schedule-empty > div { display: flex; flex-wrap: wrap; gap: .5rem; }
	.schedule-disclosure summary { list-style: none; cursor: pointer; }
	.schedule-disclosure summary::-webkit-details-marker { display: none; }
	.schedule-disclosure summary h3 { display: flex; align-items: center; gap: .375rem; }
	.schedule-chevron { display: inline-flex; flex: none; width: 1rem; height: 1rem; }
	.schedule-disclosure[open] > summary .schedule-chevron { transform: rotate(90deg); }
	.schedule-disclosure summary:focus-visible { outline: 2px solid var(--field-focus-border, var(--accent)); outline-offset: -2px; }
	.legacy-1700-editor .income-section:has(.supplemental-amounts, .supplemental-transactions) summary { min-block-size: 2.75rem; }
	.supplemental-amount-row, .supplemental-entry-row {
		padding: .625rem .875rem;
		border-block-end: 1px solid var(--border);
	}
	.supplemental-amount-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: .5rem .75rem;
	}
	.supplemental-amount-row h4, .supplemental-entry h4 {
		margin: 0;
		font-size: .875rem;
		font-weight: 650;
	}
	.supplemental-amount-row h4 {
		display: grid;
		grid-template-columns: 1.6rem minmax(0, 1fr);
		align-items: baseline;
		gap: .4rem;
	}
	.supplemental-amount-row .income-control { margin-inline-start: 2rem; }
	.supplemental-column-head {
		display: none;
		background: var(--bg);
		color: var(--fg-muted);
		font-size: .75rem;
	}
	.supplemental-entry { min-inline-size: 0; }
	.supplemental-entry h4 {
		padding: .625rem .875rem;
		background: var(--bg);
		border-block-end: 1px solid var(--border);
	}
	.supplemental-entry-fields { display: grid; grid-template-columns: minmax(0, 1fr); gap: .625rem; }
	.supplemental-add-entry { padding: .625rem .875rem; border-block-end: 1px solid var(--border); }
	.supplemental-total .income-row { padding-block: .625rem; }
	.supplemental-total .schedule-calculated { font-weight: 650; }
	.supplemental-total .schedule-calculated span { color: var(--fg); }
	@container paper-form (min-width: 46rem) {
		.supplemental-amount-row {
			grid-template-columns: minmax(10rem, 1.55fr) repeat(3, minmax(0, 1fr));
			align-items: baseline;
		}
		.supplemental-amount-row .income-control { margin-inline-start: 0; }
		.supplemental-amount-row .exempt { grid-column: 2; }
		.supplemental-amount-row .amount { grid-column: 3; }
		.supplemental-amount-row .withheld { grid-column: 4; }
		.supplemental-column-head { display: grid; }
		.supplemental-amount-row .income-control :global(label) {
			position: absolute;
			inline-size: 1px;
			block-size: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
		.supplemental-transactions:has(.supplemental-entry + .supplemental-entry) {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.supplemental-entry {
			display: grid;
			grid-template-rows: subgrid;
			grid-row: 1 / span var(--entry-row-count);
		}
		.supplemental-entry + .supplemental-entry { border-inline-start: 1px solid var(--border); }
		.supplemental-entry-fields.paired { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	}
	.schedule-row-title { grid-column: 1 / -1; font-size: .875rem; font-weight: 650; }
	.schedule-calculated { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .25rem .625rem; font-size: .875rem; }
	.schedule-calculated span { color: var(--fg-muted); }
	.schedule-calculated output { font-weight: 650; font-variant-numeric: tabular-nums; }
	.schedule-taxpayer { padding: .625rem .875rem; border-bottom: 1px solid var(--border); }
	.income-section .eq-section-header { margin: 0; padding: .375rem .875rem; background: var(--paper-section-background, var(--bg-hover)); border-bottom: 1px solid var(--border); }
	.annual-schedule-section + .income-section { border-top: 1px solid var(--border); }
	.annual-spouse-fields { --radio-choice-row-gap: .25rem; }
	@container paper-form (width >= 36rem) {
		.income-fields.annual-spouse-fields { grid-template-columns: repeat(2, minmax(0, 1fr)); }
		.annual-spouse-fields > .income-row { grid-column: auto; }
		.annual-spouse-fields > .income-row:nth-child(odd):not(:last-child) { border-inline-end: 1px solid var(--border); }
	}
	.edit-spouse-icon { display: inline-flex; inline-size: 1rem; block-size: 1rem; }
	.income-fields { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0; background: var(--bg-elev); }
	.income-fields > div { min-width: 0; padding: .75rem .875rem; background: var(--bg-elev); border-bottom: 1px solid var(--border); border-right: 1px solid var(--border-soft); }
	.income-fields > :is(.income-row, .wide) { border-inline-end: 0; }
	.return-filing > .income-row { grid-column: auto; }
	.revised-1700-editor .return-filing { --radio-choice-row-gap: .25rem; }
	.quarter-filing { --radio-choice-row-gap: .25rem; --radio-choice-column-gap: .75rem; }
	.income-fields :global([data-slot="form-item"]),
	.filing-identification :global([data-slot="form-item"]),
	.filing-identification :global([data-slot="date-input"]) { grid-template-columns: minmax(0, 1fr); }
	.numbered { display: grid; grid-template-columns: 1.6rem minmax(0, 1fr); align-items: start; gap: .4rem; }
	.paper-item-number { padding-top: .125rem; }
	.income-row { grid-column: 1 / -1; }
	.income-row-controls { display: grid; grid-template-columns: minmax(0, 1fr); gap: .75rem; min-width: 0; }
	.income-spouse-action { padding: .625rem .875rem; border-bottom: 1px solid var(--border); }
	.managed-value { margin: 0; font-size: .875rem; }
	.managed-value dt { color: var(--fg-muted); font-size: .75rem; }
	.managed-value dd { margin: .25rem 0 0; overflow-wrap: anywhere; }
	@container paper-form (min-width: 36rem) {
		.income-row-controls { grid-template-columns: repeat(var(--income-column-count, 1), minmax(0, 1fr)); }
	}
	.income-control { min-width: 0; }
	.employer-tin { --compact-number-width: none; }
	.employer-name-continuation { margin-block-start: .25rem; }
	.employer-name-continuation > summary { display: flex; align-items: center; gap: .25rem; cursor: pointer; list-style: none; min-block-size: 1.75rem; font-size: .75rem; color: var(--fg-muted); }
	.employer-name-continuation > summary::-webkit-details-marker { display: none; }
	.employer-name-continuation > summary:focus-visible { outline: 2px solid var(--field-focus-border, var(--accent)); outline-offset: 1px; }
	.employer-name-continuation[open] > summary { margin-block-end: .375rem; }
	.employer-name-continuation[open] > summary .schedule-chevron { transform: rotate(90deg); }
	.employer-name-continuation:not([open]) .hide-name-line, .employer-name-continuation[open] .add-name-line { display: none; }
	.revised-employer .income-row-controls:has(.employer-tin) :global([data-slot="currency-input"]) { max-inline-size: none; }
	@container paper-form (width >= 36rem) {
		.income-row-controls.income-description { grid-template-columns: minmax(0, 1fr) repeat(calc(var(--income-column-count) - 1), minmax(0, 12rem)); }
		.revised-employer .income-row-controls:has(.employer-tin) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	}
	@container paper-form (width >= 52rem) {
		.revised-employer .income-row-controls:has(.employer-tin) {
			grid-template-columns: minmax(0, 1.6fr) minmax(0, 1.3fr) repeat(calc(var(--income-column-count) - 2), minmax(0, 1fr));
		}
	}
	.income-control :global([data-slot="form-item"]:has(input[inputmode="numeric"]:not([placeholder="YYYY"]))) { max-inline-size: var(--compact-number-width, 11rem); }
	.income-control :global([data-slot="currency-input"]),
	.income-control :global([data-slot="form-item"]:has(input[inputmode="decimal"])),
	.income-control :global([data-slot="date-input"]) { max-inline-size: 18rem; }
	.dependent-count { display: flex; flex-wrap: wrap; align-items: center; gap: .375rem .75rem; }
	.dependent-count-value { display: flex; flex: 1 1 10rem; align-items: baseline; justify-content: space-between; gap: .5rem; }
	.dependent-count-value span { font-size: var(--form-label-size); color: var(--fg-muted); }
	.dependent-count-value output { font-weight: 650; font-variant-numeric: tabular-nums; }
	.tax-summary { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: .875rem; }
	.tax-summary .summary-number { width: 2.75rem; }
	.tax-summary .summary-amount { width: 8.5rem; }
	.tax-summary.joint-summary .summary-amount { width: 5.75rem; }
	.tax-summary th, .tax-summary td { padding: .45rem .625rem; border-bottom: 1px solid var(--border); text-align: start; overflow-wrap: anywhere; }
	.tax-summary thead th { color: var(--fg-muted); font-size: .75rem; font-weight: 550; white-space: nowrap; }
	.tax-summary tr > :first-child { padding-inline: .5rem; }
	.tax-summary tbody th { font-weight: 500; }
	.tax-summary .summary-value { text-align: end; font-variant-numeric: tabular-nums; }
	.tax-summary.joint-summary tr > :nth-child(4) { border-inline-start: 1px solid var(--border); }
	.tax-summary .summary-input { padding: .3rem .5rem; }
	.tax-summary .summary-input :global([data-slot="form-item"]) { grid-template-columns: minmax(0, 1fr); }
	.tax-summary.joint-summary .summary-input :global([data-slot="form-item"] > div:has(> input)) { padding-inline: .3125rem; gap: .25rem; }
	.tax-summary .summary-input :global(input) { min-width: 0; }
	@container paper-form (min-width: 36rem) {
		.tax-summary .summary-amount { width: 13rem; }
		.tax-summary.joint-summary .summary-amount { width: 11rem; }
	}
	.tax-summary .tax-total { background: var(--paper-section-background, var(--bg-hover)); border-top: 2px solid var(--border); }
	.tax-summary .tax-total > * { padding-block: .625rem; font-weight: 700; }
	.annual-schedule { background: var(--bg-elev); }
	.annual-schedule tbody tr:last-child > * { border-bottom: 0; }
	.annual-schedule tbody :is(td, th) { vertical-align: middle; }
	.annual-schedule tr:has(th :global(input)) > .summary-input { vertical-align: bottom; padding-block-end: .45rem; }
	.annual-schedule th :global([data-slot="form-item"]) { max-inline-size: 26rem; margin-block-start: .3rem; }
	.annual-schedule :global([data-slot="form-item"]) { grid-template-columns: minmax(0, 1fr); }
	.annual-schedule :global(input) { min-width: 0; width: 100%; }
	.signed-schedule-amount :global(input[inputmode="decimal"]) { text-align: end; font-variant-numeric: tabular-nums; }
	.annual-schedule .summary-value { padding-inline-end: .75rem; }
	.annual-schedule output { display: inline-block; padding-inline-end: .625rem; font-weight: 650; }
	.annual-schedule .schedule-total { background: var(--paper-section-background, var(--bg-hover)); }
	.annual-schedule .schedule-total th { font-weight: 700; }
	.regime-viewport { max-inline-size: 100%; overflow-x: auto; }
	.regime-scroll-hint { margin: 0; padding: .5rem .625rem; color: var(--fg-muted); font-size: .75rem; }
	@container paper-form (width >= 44rem) { .regime-scroll-hint { display: none; } }
	.regime-viewport + .regime-viewport { border-top: 1px solid var(--border); }
	.regime-viewport:focus-visible { outline: 2px solid var(--field-focus-border, var(--accent)); outline-offset: -2px; }
	.historical-regimes { min-inline-size: 44rem; }
	.historical-regimes caption { text-align: start; padding: .45rem .625rem; font-weight: 650; border-bottom: 1px solid var(--border); }
	.historical-regimes .summary-amount { width: 7rem; }
	.schedule-note { display: block; font-size: .75rem; color: var(--fg-muted); }
	@container paper-form (width < 36rem) {
		.annual-schedule .summary-number { width: 2.2rem; }
		.annual-schedule .summary-amount { width: 7.25rem; }
		.annual-schedule.joint-summary .summary-amount { width: 6.125rem; }
		.annual-schedule :is(td, th) { padding-inline: .375rem; }
		.annual-schedule output { padding-inline-end: .25rem; }
	}
	.income-control :global(input:not([type="checkbox"]):not([type="radio"])) { min-width: 0; max-width: 100%; }
	.wide { grid-column: 1 / -1; }
	.income-errors { border-bottom: 1px solid var(--border); padding: .75rem .875rem; }
	.income-errors ul { margin-block-end: 0; }
	.income-errors button { color: inherit; font: inherit; text-decoration: underline; cursor: pointer; text-align: left; }
	@container paper-form (min-width: 36rem) { .income-fields { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	@container paper-form (min-width: 58rem) { .income-fields { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
	@container paper-form (width < 36rem) { .income-fields > div { border-inline-end: 0; } }
	@container paper-form (36rem <= width < 58rem) {
		.return-filing > .income-row:not(:last-child):nth-child(odd) { border-inline-end: 1px solid var(--border-soft); }
	}
	@container paper-form (width >= 36rem) {
		.return-filing .income-control :global([data-slot="form-item"]:has(input[placeholder="YYYY"])) { max-inline-size: 12rem; }
	}
	@container paper-form (width >= 58rem) {
		.return-filing > .income-row:not(:last-child):not(:nth-child(3n)) { border-inline-end: 1px solid var(--border-soft); }
		.revised-1700-editor .return-filing { grid-template-columns: minmax(0, .75fr) minmax(0, 1fr) minmax(0, 1.25fr); }
	}
	@container paper-form (width >= 54rem) {
		.return-filing.quarter-filing { grid-template-columns: minmax(0, .8fr) minmax(0, 2fr) minmax(0, .9fr) minmax(0, 1fr); }
		.return-filing.quarter-filing > .income-row:not(:last-child) { border-inline-end: 1px solid var(--border-soft); }
	}
	.pages-filed :global([data-slot="form-item"]) { max-inline-size: 13rem; }
	.legacy-1700-editor .income-fields:not(.legacy-filing) { grid-template-columns: minmax(0, 1fr); }
	.legacy-1700-editor .income-fields > div { border-inline-end: 0; }
	.legacy-filing {
		gap: 1px;
		border-block-end: 1px solid var(--border);
		background: var(--border);
	}
	.legacy-filing > .income-row { grid-column: auto; grid-template-columns: 1rem minmax(0, 1fr); border-block-end: 0; }
	.legacy-1700-editor :global(legend > span[aria-hidden="true"]) { margin-inline-start: .25rem; }
	.legacy-filing > [data-income-item="1"] .income-row-controls { max-inline-size: 11rem; }
	.filing-sources { display: grid; gap: .375rem; min-inline-size: 0; border: 0; margin: 0; padding: 0; }
	.filing-sources legend {
		padding: 0;
		margin-block-end: var(--form-label-gap);
		color: var(--fg-muted);
		font-size: var(--form-label-size);
		font-weight: 500;
	}
	.filing-sources :global(label) { align-items: center; min-block-size: 1.75rem; font-size: .875rem; }
	@container paper-form (min-width: 35rem) {
		.legacy-filing { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	}
	@container paper-form (min-width: 53rem) {
		.legacy-filing { grid-template-columns: minmax(0, .85fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.3fr); }
	}
</style>
