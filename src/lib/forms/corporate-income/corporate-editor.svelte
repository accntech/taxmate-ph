<script lang="ts">
	import AccreditationNumberInput from './accreditation-number-input.svelte';
	import { corporateBackgroundCell, corporateBackgroundRows, isRegisteredInformationRow } from './background-layout';
	import { legacyExemptIdentificationFields, legacyExemptIdentificationPatch } from './exempt';
	import { legacyMixedAtc, legacyMixedOtherAtc, legacyMixedOtherAtcElected } from './mixed/atc';
	import { legacyMixedIdentificationFields } from './mixed/identification';
	import { legacyRegularIdentificationFields } from './regular/identification';
	import RegisteredInformation from './registered-information.svelte';
	import { corporateScheduleReferences } from './schedule-references';
	import { Sheet } from '$lib/components/ui/sheet';
	import { corporateLists, nolcoListLabel, ownerListLabel, type CorporateEntry, type CorporateList } from './editor-lists';
	import { tick } from 'svelte';
	import { Button, ButtonLink, CalculatedValue, CheckboxInput, Combobox, CurrencyInput, DateInput, FieldErrors, Input, Label, NumberInput, RadioGroup, Select, TinInput } from '$lib/components/ui';
	import MonthYearInput from '$lib/components/ui/month-year-input/month-year-input.svelte';
	import { splitTinSegments } from '$lib/components/ui/tin-input/tin';
	import { psicClassCode, psicOptionsForCode } from '$lib/profiles/psic';
	import { formatCurrencyInput } from '$lib/components/ui/currency-input/currency';
	import Icon from '$lib/components/ui/icon/icon.svelte';
	import { glyphs } from '$lib/components/ui/icons';
	import { calculateCorporateIncome, corporateAttachmentInstances, corporateAuditorSectionTitle, corporateEditorPages, corporateFieldRequired, corporateReturnPeriod, validateCorporateIncome } from '.';
	import AtcPicker from '../atc-picker.svelte';
	import PaperFormHeader from '../paper-form-header.svelte';
	import ReturnPagination from '../return-pagination.svelte';
	import { getReturnPage, selectReturnPage } from '../return-page-navigation';
	import type { CorporateField, CorporateForm, CorporateRow, CorporateSection, CorporateValues } from './types';
	import '../form-editor-layout.css';

	let { form, values, errors, taxpayerHref, hasProfileBusinessLine = false, profilePsicCode, onvaluechange }: {
		form: CorporateForm;
		values: CorporateValues;
		errors: CorporateValues;
		taxpayerHref: string;
		hasProfileBusinessLine?: boolean;
		profilePsicCode?: string;
		onvaluechange: (patch: CorporateValues) => void;
	} = $props();

	const selectedPage = $derived(getReturnPage());
	let editing = $state.raw<CorporateEntry>();
	let editingList = $state.raw<CorporateList>();
	let removed = $state.raw<{ anchor: string; focusId: string; previous: CorporateValues; patch: CorporateValues; source: CorporateValues }>();
	const canUndo = $derived(removed?.source === values && Object.entries(removed.patch).every(([id, value]) => values[id] === value));
	let editingContext = $state('');
	let draft = $state<CorporateValues>({});
	let editErrors = $state<CorporateValues>({});
	let trigger: HTMLElement | undefined;
	let adding = $state(false);
	const headingId = $props.id();
	const incomeCounterId = 'Pg4S3I3PopLength';
	const deductionCounterId = 'frm1702RT:txtPg3Sc1I17iCtrModal';
	const revisedRegular = $derived(form.code === '1702RTv2018' || form.code === '1702RTv2018C');
	const legacyExempt = $derived(form.code === '1702EX');
	const legacyRegular = $derived(form.code === '1702RT');
	const legacyMixed = $derived(form.code === '1702MX');
	const profilePsicClass = $derived(psicClassCode(profilePsicCode));
	const legacyIdentification = $derived(legacyExempt || form.code === '1702MX' || legacyRegular);
	const identificationFields = $derived(legacyRegular ? legacyRegularIdentificationFields
		: form.code === '1702MX' ? legacyMixedIdentificationFields : legacyExemptIdentificationFields);
	const calculated = $derived(calculateCorporateIncome(form, values));
	const editingNolco = $derived(editingList?.label === nolcoListLabel);
	const editingDeduction = $derived(editingList?.counter?.id === deductionCounterId);
	const draftSource = $derived(editingNolco && editing
		? calculateCorporateIncome(form, { ...values, ...draft })
		: { ...calculated, ...draft });
	const allPages = $derived(corporateEditorPages(form, calculated));
	const attachments = $derived(corporateAttachmentInstances(form, calculated));
	const references = $derived(corporateScheduleReferences(form.code, allPages, applies, attachments.map(attachment => attachment.id)));
	const pages = $derived(allPages.map((page, index) => ({
		id: String(index + 1),
		title: /^Page \d+$/.test(page.title) ? ({
			'1702RT': ['Filing and tax payable', 'Tax computation and auditor', 'Sales and costs', 'Other income and deductions', 'Deductions and losses', 'Credits, MCIT and reconciliation', 'Balance sheet and owners', 'Final-tax and exempt income'],
			'1702MX': ['Filing and tax payable', 'Tax computation', 'Tax relief and auditor', 'Sales and costs', 'Other income and deductions', 'Deductions and losses', 'Credits, MCIT and reconciliation', 'Balance sheet and owners', 'Final-tax and exempt income']
		}[form.code] ?? ['Filing and tax payable', 'Tax computation', form.code.includes('MX') ? 'Tax relief, deductions and losses' : 'Deductions', 'Carryovers and reconciliation'])[index] ?? page.title : page.title
	})));
	const current = $derived(pages.find(item => item.id === selectedPage)?.id ?? '1');
	const legacyMixedSchedules = $derived(legacyMixed && Number(current) >= 2 && Number(current) <= 9);
	const mixed2018 = $derived(form.code === '1702MXv2018');
	const mixed2018Schedules = $derived(mixed2018 && Number(current) >= 2 && Number(current) <= 4);
	const mixedScheduleLayout = $derived(legacyMixedSchedules || mixed2018Schedules);
	const inlineActivities = $derived((legacyMixed || mixed2018) && current === '2');
	const activityGroups = $derived(form.attachmentGroups?.filter(group => group.applies(calculated)) ?? []);
	const legacyExemptCover = $derived(legacyExempt && current === '1');
	const active = $derived(allPages[Number(current) - 1] ?? allPages[0]);
	const decimals = $derived(form.decimals ?? 2);
	const number = $derived(form.code.replace(/v\d+C?$/, '').replace(/1702(EX|MX|RT)/, '1702-$1'));
	const title = $derived(form.quarter ? 'Quarterly Income Tax Return' : 'Annual Income Tax Return');
	const subtitle = $derived(form.title.replace(/^.*?income tax return\s*/i, '').replace(/^for\s+/i, 'For '));

	function shortTitle(title: string) {
		const heading = legacyMixedSchedules ? title.replace(/\s+A\. Total Exempt B\. Total Special C\. Total Regular D\. Total All Columns$/, '') : title;
		return heading.replace(/\s+/g, ' ').replace(/\s*\((?:attach|to |from |do not|if applicable)[^)]*\)/gi, '').trim();
	}

	const legacyListItems: Record<string, string> = {
		'Other taxable income': 'income item',
		'Other amortizations': 'amortization',
		'Other ordinary allowable deductions': 'ordinary deduction',
		'Special allowable deductions': 'special deduction',
		[nolcoListLabel]: 'NOLCO carryover',
		'Other tax credits': 'tax credit',
		'MCIT carryovers': 'MCIT carryover',
		'Reconciliation additions': 'reconciliation addition',
		'Reconciliation income exclusions': 'income exclusion',
		'Reconciliation deductions': 'reconciliation deduction',
		[ownerListLabel]: 'owner',
		'Real properties subject to final tax': 'real property',
		'Shares of stock subject to final tax': 'stock transaction',
		'Other income subject to final tax': 'other final-tax income',
		'Exempt properties received': 'exempt property',
		'Other exempt income': 'other exempt income'
	};
	const balanceGroupLabels: Record<string, string> = { '1': 'Assets', '8': 'Liabilities', '13': 'Equity' };
	const balanceDifference = $derived(Number(calculated['frm1702MX:txtPg8Sc11I7'] ?? 0) - Number(calculated['frm1702MX:txtPg8Sc11I17'] ?? 0));
	const balanceHasEntries = $derived(active.sections.some(section => section.title.startsWith('Schedule 11 - Balance Sheet')
		&& section.rows.some(row => row.fields.some(field => !field.readonly && Number(calculated[field.id]) !== 0 && !!calculated[field.id]))));
	const editingItemName = $derived(editingList && legacyMixedSchedules ? legacyListItems[editingList.label] : undefined);

	function continuation(section: CorporateSection) {
		if (!legacyMixedSchedules) return;
		if (section.title.startsWith('Schedule 5 ')) {
			if (current === '5') return { label: 'Continue Schedule 5 on page 6', page: '6', heading: 'Schedule 5 ' };
			if (current === '6') return { label: 'Go to the start of Schedule 5 on page 5', page: '5', heading: 'Schedule 5 ' };
		}
		if (section.title.startsWith('Schedule 8 ')) {
			if (current === '6') return { label: 'Continue Schedule 8 on page 7', page: '7', heading: 'Schedule 8 ' };
			if (current === '7') return { label: 'Go to the start of Schedule 8 on page 6', page: '6', heading: 'Schedule 8 ' };
		}
	}

	function withoutItemPrefix(label: string, item?: string) {
		const prefix = `${item} `;
		return item && label.slice(0, prefix.length).toUpperCase() === prefix.toUpperCase() ? label.slice(prefix.length) : label;
	}

	function filingField(field: CorporateField, row: CorporateRow): CorporateField {
		const label = field.id === form.periodType ? 'Accounting period' : field.label || row.label;
		return { ...field, label: withoutItemPrefix(label, row.item) };
	}


	function editableFields(entry: CorporateEntry) {
		return entry.rows.flatMap(row => row.fields).filter(field => !field.readonly && !field.profileKey && !field.repeatable && applies(field));
	}

	function entryFields(entry: CorporateEntry) {
		return entry.rows.flatMap(row => row.fields).filter(field => !field.repeatable);
	}

	function openEntry(entry: CorporateEntry, source: CorporateValues, control?: HTMLElement, counter?: CorporateField, focusId?: string) {
		trigger = control;
		editingList = undefined;
		editingContext = '';
		adding = !!counter;
		editErrors = {};
		draft = Object.fromEntries(editableFields(entry).map(field => [field.id, source[field.id] ?? field.defaultValue ?? '']));
		if (counter) draft[counter.id] = source[counter.id];
		editing = entry;
		void focusEntryField(focusId ?? editableFields(entry)[0]?.id);
	}

	function openListEntry(list: CorporateList, entry: CorporateEntry, control?: HTMLElement, isNew = false, focusId?: string, context?: string) {
		openEntry(entry, calculated, control, undefined, focusId);
		editingList = list;
		editingContext = [active.title.match(/^(.+?) · Mandatory attachment /)?.[1],
			context ?? active.sections.find(section => section.rows.includes(entry.rows[0]))?.title].filter(Boolean).join(' · ');
		adding = isNew;
	}

	async function focusEntryField(id?: string) {
		await tick();
		if (!id) return;
		const control = document.getElementById(id);
		const dialog = control?.closest('dialog');
		if (!dialog) return;
		await Promise.all(dialog.getAnimations().map(animation => animation.finished.catch(() => {})));
		if (dialog.open) control?.focus();
	}

	function addEntry(sectionIndex: number, counter: CorporateField, button: HTMLElement) {
		const sourceRow = active.sections[sectionIndex].rows.find(row => row.fields.includes(counter));
		const occupiedBase = Number(calculated[counter.id] || 0) === 0 && (
			counter.repeatable?.rollup && sourceRow && entryHasValues({ item: sourceRow.item ?? '', rows: [sourceRow] })
			|| counter.repeatable?.seedFrom?.some(id => calculated[id]?.trim() && calculated[id] !== '0')
		);
		const next = Number(calculated[counter.id] || 0) + (occupiedBase ? 2 : 1);
		const prospective = calculateCorporateIncome(form, { ...values, [counter.id]: String(next) });
		const section = corporateEditorPages(form, prospective)[Number(current) - 1].sections[sectionIndex];
		const list = Array.from(corporateLists(section).values()).find(item => item.counter?.id === counter.id);
		const entry = list?.entries.at(-1);
		if (!entry) return;
		if (next === 1) {
			const anchor = active.sections[sectionIndex].rows.find(row => row.fields.includes(counter));
			const sourceIds = counter.repeatable?.seedFrom ?? (counter.repeatable?.rollup
				? anchor?.fields.filter(field => !field.repeatable && !field.readonly).map(field => field.id)
				: undefined);
			sourceIds?.forEach((id, index) => {
				const field = editableFields(entry)[index];
				if (field) prospective[field.id] = calculated[id] ?? '';
			});
		}
		openEntry(entry, prospective, button, counter);
		editingList = list;
		editingContext = section.title;
	}

	function removalPatch(list: CorporateList, entry: CorporateEntry): CorporateValues {
		const counter = list.counter;
		if (!counter || !entry.rows[0].entry) return Object.fromEntries(editableFields(entry).map(field => [field.id, '']));
		const index = list.entries.indexOf(entry);
		const entries = list.entries.filter(entry => entry.rows[0].entry);
		const offset = list.entries.length - entries.length;
		const patch: CorporateValues = { [counter.id]: String(entries.length - 1) };
		for (let at = index - offset; at < entries.length; at++) {
			const following = entries[at + 1] ? entryFields(entries[at + 1]) : [];
			entryFields(entries[at]).forEach((field, column) => {
				patch[field.id] = following[column] ? calculated[following[column].id] ?? '' : '';
			});
		}
		if (entries.length === 1 && (counter.repeatable?.rollup || counter.repeatable?.fixed)) {
			const anchor = active.sections.flatMap(section => section.rows).find(row => row.fields.includes(counter));
			for (const field of anchor?.fields ?? []) if (field !== counter) patch[field.id] = '';
		}
		if (entries.length === 1) for (const id of counter.repeatable?.seedFrom ?? []) patch[id] = '';
		return patch;
	}

	function deleteListEntry() {
		const list = editingList;
		const entry = editing;
		if (!list || !entry) return;
		const anchor = listAnchor(list.counter?.id ?? list.entries[0].rows[0].fields[0].id);
		const patch = removalPatch(list, entry);
		removed = {
			anchor, focusId: listAnchor(entry.rows[0].fields[0].id) + '-edit', source: values, patch,
			previous: Object.fromEntries(Object.keys(patch).map(id => [id, values[id] ?? '']))
		};
		onvaluechange(patch);
		trigger = document.getElementById(anchor + '-add') ?? undefined;
		closeEntry();
	}

	async function undoRemoval() {
		if (!removed || !canUndo) return;
		const { previous, focusId } = removed;
		removed = undefined;
		onvaluechange(previous);
		await tick();
		document.getElementById(focusId)?.focus();
	}

	function nolcoYear(entry: CorporateEntry) {
		return entryFields(entry).find(field => field.label === 'Year incurred');
	}

	function isCurrentNolco(entry: CorporateEntry) {
		return nolcoYear(entry)?.readonly && !entry.rows.some(row => row.fields.some(field => field.repeatable));
	}

	function entryHasValues(entry: CorporateEntry, source = calculated) {
		return entryFields(entry).some(field => {
			const value = source[field.id]?.trim();
			if (field.kind === 'select' && value === field.defaultValue) return false;
			return value && (field.kind !== 'money' && field.kind !== 'percent' || Number(value.replaceAll(',', '')) !== 0);
		});
	}

	function listAnchor(id: string) {
		return `${headingId}-list-${id}`;
	}

	function closeEntry() {
		const control = trigger;
		editing = undefined;
		void tick().then(() => {
			if (control instanceof HTMLButtonElement && control.disabled) {
				control.closest('.line-list')?.querySelector('h4')?.focus();
			} else {
				control?.focus();
			}
		});
	}

	function rowRequired(row: CorporateRow, field: CorporateField, source: CorporateValues) {
		return corporateFieldRequired(form, field, source, row);
	}

	function saveEntry() {
		if (!editing) return;
		const source = calculateCorporateIncome(form, { ...values, ...draft });
		const validation = validateCorporateIncome(form, source);
		editErrors = Object.fromEntries(editableFields(editing).flatMap(field =>
			validation[field.id] ? [[field.id, validation[field.id]]] : []
		));
		if (editingList?.counter?.id === incomeCounterId && adding) {
			const description = editableFields(editing).find(field => field.kind === 'text');
			if (description && !draft[description.id]?.trim()) editErrors[description.id] = 'Enter a description.';
		}
		if (adding && editingList?.counter?.repeatable?.continuationOnly && !entryHasValues(editing, source)) {
			const first = editableFields(editing)[0];
			if (first) editErrors[first.id] ??= 'Enter property details.';
		}
		if (editingNolco) {
			const year = nolcoYear(editing);
			if (year && !year.readonly && !/^\d{4}$/.test(source[year.id] ?? '')) {
				editErrors[year.id] ??= 'Enter the four-digit year the loss was incurred.';
			}
			const [loss, previous, expired, applied] = entryFields(editing).filter(field => field.kind === 'money');
			if (loss && previous && expired && applied && !applied.readonly) {
				const amount = (field: CorporateField) => Number(source[field.id]?.replaceAll(',', '') || 0);
				if (amount(previous) + amount(expired) + amount(applied) > amount(loss)) {
					editErrors[applied.id] ??= 'Applied and expired amounts together cannot exceed the available loss.';
				}
			}
		}
		for (const row of editing.rows) {
			for (const field of row.fields) {
				if (!field.readonly && rowRequired(row, field, source) && !source[field.id]?.trim()) {
					editErrors[field.id] ??= 'Required.';
				}
			}
		}
		if (Object.keys(editErrors).length) {
			void focusEntryField(Object.keys(editErrors)[0]);
			return;
		}
		if (removed && Object.keys(removed.patch).some(id => id in draft)) removed = undefined;
		onvaluechange(draft);
		closeEntry();
	}

	function applies(field: CorporateField) {
		return form.fieldApplies?.(field.id, calculated) ?? true;
	}

	function legacyReliefDateFields(fields: CorporateField[]) {
		if (!legacyMixed) return;
		const month = fields.find(field => /^frm1702MX:txtPg1(?:EX|SP)\d+ScAI[56]month$/.test(field.id));
		if (!month) return;
		const year = fields.find(field => field.id === month.id.replace(/month$/, 'year'));
		if (year) return { month, year };
	}

	function hasVisibleFields(section: CorporateSection) {
		return section.rows.some(row => row.fields.some(applies));
	}

	function change(id: string, value: string) {
		if (legacyMixed && id === legacyMixedOtherAtc && value === 'N') {
			onvaluechange({ [id]: value, [legacyMixedAtc]: '' });
			return;
		}
		onvaluechange(legacyIdentification ? legacyExemptIdentificationPatch(calculated, id, value, identificationFields) : { [id]: value });
	}

	function tinFields(fields: CorporateField[]) {
		const number = (field: CorporateField) => field.profileKey === 'branchCode'
			? 4 : Number(/tinc?([1-4])$/i.exec(field.id)?.[1] ?? 0);
		const segments = fields.filter(field => number(field)).sort((left, right) => number(left) - number(right));
		return (segments.length === 3 || segments.length === 4) &&
			segments.every((field, index) => number(field) === index + 1) ? segments : [];
	}

	function accreditationFields(fields: CorporateField[]) {
		return fields.filter(field => /:txtPg2Pt6I(?:49BIRAccreditedNoC|59BIR)[1-4]$/.test(field.id));
	}

	function writeTin(fields: CorporateField[], value: string) {
		const segments = splitTinSegments(value);
		onvaluechange(Object.fromEntries(fields.map((field, index) => [field.id, segments[index] ?? ''])));
	}

	async function showPage(id: string) {
		await selectReturnPage(id);
		await tick();
		const heading = document.getElementById(headingId);
		heading?.focus({ preventScroll: true });
		heading?.scrollIntoView({ block: 'start', behavior: 'instant' });
	}

	async function showSection(id: string, title: string) {
		await selectReturnPage(id);
		await tick();
		const index = active.sections.findIndex(section => section.title.startsWith(title));
		const heading = document.getElementById(`${headingId}-section-${index}`);
		heading?.focus({ preventScroll: true });
		heading?.scrollIntoView({ block: 'start', behavior: 'instant' });
	}

	export async function revealField(id: string) {
		const index = allPages.findIndex(page => page.sections.some(section => section.rows.some(row =>
			row.fields.some(field => field.id === id))));
		if (index !== -1) await selectReturnPage(String(index + 1));
		await tick();
		const section = allPages[index]?.sections.find(section => section.rows.some(row => row.fields.some(field => field.id === id)));
		const row = section?.rows.find(row => row.fields.some(field => field.id === id));
		if (!row && /:total(?:EX|SP)Attach$/.test(id)) return `${headingId}-section-activities`;
		if (index === 0 && section && /background information/i.test(section.title)) {
			const registered = corporateBackgroundRows(form, section.rows).find(row =>
				isRegisteredInformationRow(row) && row.fields.some(field => field.id === id));
			if (registered) return registered.fields[0].id;
		}
		if (section && row) {
			for (const [anchor, list] of corporateLists(section)) {
				if (list.counter?.id === id) return listAnchor(id);
				const entry = list.entries.find(entry => entry.rows.includes(row));
				if (entry && list.counter?.repeatable?.continuationOnly && !entry.rows[0].entry && !entryHasValues(entry)) {
					return listAnchor(list.counter.id);
				}
				if (entry && (editableFields(entry).some(field => field.id === id) || list.label === nolcoListLabel)) {
					const tin = tinFields(row.fields);
					const target = tin.some(field => field.id === id) ? tin[0].id : id;
					const control = document.getElementById(listAnchor(list.counter?.id ?? anchor.fields[0].id)) ?? undefined;
					openListEntry(list, entry, control, false, target, section.title);
					await tick();
					editErrors = errors;
					return target;
				}
				if (entry) return listAnchor(list.counter?.id ?? anchor.fields[0].id);
			}
		}
		const grouped = row ? [...tinFields(row.fields), ...accreditationFields(row.fields)] : [];
		return grouped.some(field => field.id === id) ? grouped[0].id : id;
	}

	async function followReference(id: string) {
		const target = document.getElementById(await revealField(id));
		if (target instanceof HTMLOutputElement) target.tabIndex = -1;
		target?.focus({ preventScroll: true });
		target?.scrollIntoView({ block: 'center', behavior: 'instant' });
	}

	function dateValue(value: string) {
		const legacy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
		return legacy ? `${legacy[3]}-${legacy[1].padStart(2, '0')}-${legacy[2].padStart(2, '0')}` : value;
	}

	function saveDate(id: string, value: string, write = change) {
		write(id, /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value.slice(5).replace('-', '/')}/${value.slice(0, 4)}` : value);
	}

	function display(field: CorporateField, value: string) {
		if (field.kind === 'money') return value ? formatCurrencyInput(value, decimals, true) : '';
		if (field.kind === 'percent' && value && !value.endsWith('%')) return `${value}%`;
		return field.options?.find(option => option.value === value)?.label ?? value;
	}
</script>

{#snippet control(field: CorporateField, fallback: string, column?: string, row?: CorporateRow, inSheet = false, amountContext?: string, useColumnLabel = false)}
	{@const id = field.id}
	{@const fieldLabel = field.label && field.label !== column ? field.label : fallback}
	{@const baseLabel = (legacyRegular || revisedRegular) && !inSheet ? withoutItemPrefix(fieldLabel, row?.item) : fieldLabel}
	{@const source = inSheet ? draftSource : calculated}
	{@const certificate = source[identificationFields.type]}
	{@const ctc = certificate === 'CTC'}
	{@const legacyNumber = legacyIdentification && id === identificationFields.number}
	{@const legacyCertificateAmount = legacyIdentification && id === identificationFields.amount}
	{@const label = id === form.year ? 'Year ended' : id === form.month ? 'Year-end month'
		: legacyNumber && ctc ? 'CTC number'
		: legacyNumber && certificate === identificationFields.registration ? 'SEC registration number'
		: useColumnLabel && column ? column
		: column && !baseLabel.includes(column) ? `${baseLabel} · ${column}` : baseLabel}
	{@const value = source[id] ?? field.defaultValue ?? ''}
	{@const error = (inSheet ? editErrors : errors)[id] ?? ''}
	{@const newIncomeDescription = inSheet && editingList?.counter?.id === incomeCounterId && adding && field.kind === 'text'}
	{@const required = legacyNumber ? ctc || certificate === identificationFields.registration
		: legacyCertificateAmount ? ctc : !!newIncomeDescription || corporateFieldRequired(form, field, source, row)}
	{@const write = inSheet ? (key: string, next: string) => { draft[key] = next; } : change}
	{@const legacyBusiness = legacyMixed && field.profileKey === 'lineOfBusiness'}
	{@const disabledAtc = legacyMixed && id === legacyMixedAtc && !legacyMixedOtherAtcElected(source)}
	{#if legacyBusiness && !hasProfileBusinessLine}
		<Input {id} {label} {value} {error} required maxlength={field.maxLength}
			oninput={(event) => write(id, event.currentTarget.value)} />
	{:else if legacyMixed && field.profileKey === 'psicCode' && !profilePsicClass}
		<div class="psic-picker">
			<Label for={id}>{label}<span aria-hidden="true" class="required-marker">*</span></Label>
			<Combobox
				{id}
				options={psicOptionsForCode(value, true)}
				value={value || null}
				placeholder="Choose industry"
				searchPlaceholder="Search code or industry"
				emptyMessage="No matching industries."
				monospace="secondary"
				popupWidth={360}
				wrapOptions
				itemHeight={40}
				maxVisibleItems={6}
				invalid={!!error}
				aria-required={required || undefined}
				aria-describedby={error ? `${id}-error` : undefined}
				onValueChange={(code) => write(id, typeof code === 'string' ? code : '')}
			>
				{#snippet trigger(option)}<span class="font-mono">{option.value}</span>{/snippet}
			</Combobox>
			{#if error}<FieldErrors id={`${id}-error`} errors={[error]} />{/if}
		</div>
	{:else if field.profileKey}
		{@render managedValue(id, label, display(field, value), error, ['rdoCode', 'zipCode', 'contactNumber', 'birthDate', 'psicCode', 'psocCode'].includes(field.profileKey))}
	{:else if legacyMixed && id === 'frm1702MX:rdoPg1Pt1I15MethodofDeduction'}
		<CalculatedValue {id} {label} value={display(field, field.defaultValue ?? '')}
			source="Section 34 (A–J), NIRC" />
	{:else if field.readonly}
		<CalculatedValue {id} {label} value={display(field, value)} {error} amountColumn={field.kind === 'money'} />
	{:else if field.kind === 'checkbox'}
		<CheckboxInput {id} {label} checked={value === 'Y'}
			aria-invalid={error ? 'true' : undefined} aria-describedby={error ? `${id}-error` : undefined}
			onchange={(event) => write(id, event.currentTarget.checked ? 'Y' : 'N')} />
		{#if error}<FieldErrors id={`${id}-error`} errors={[error]} />{/if}
	{:else if field.kind === 'radio' && field.options}
		<RadioGroup {id} {label} {value} options={field.options} {error} {required} onchange={(next) => write(id, next)} />
	{:else if field.options && field.options.length > 8 && /ATC|alphanumeric tax code/i.test(label)}
		<AtcPicker {id} {label} {error} {required} category="P" formCode={form.code} fieldOptions={field.options}
			value={disabledAtc ? '' : value} disabled={disabledAtc} allowCustom={false} onchange={(next) => write(id, next)} />
	{:else if field.options}
		<Select {id} {label} {value} options={field.options} {error} {required}
			wrapLabels={id === form.month || (row?.item === '5' && /\bATC\b/i.test(label))}
			onchange={(next) => write(id, next)} />
	{:else if field.kind === 'money'}
		<CurrencyInput {id} {label} value={legacyCertificateAmount && !ctc ? '' : value} {decimals} {error} {required}
			aria-label={amountContext ? `${amountContext} · ${label}` : undefined}
			disabled={row?.disabled || legacyCertificateAmount && !ctc} allowNegative={!legacyCertificateAmount}
			data-taxmate-agent-currency={legacyCertificateAmount ? undefined : 'signed'} onchange={(next) => write(id, next)} />
	{:else if field.kind === 'integer' || field.kind === 'percent'}
		<NumberInput {id} {label} {value} {error} {required} min={0}
			max={field.kind === 'percent' ? 100 : undefined}
			decimal={field.kind === 'percent'} maxlength={field.maxLength} onchange={(next) => write(id, next)}
			trailing={field.kind === 'percent' ? percentUnit : undefined} />
	{:else if field.kind === 'date'}
		<DateInput {id} {label} value={dateValue(value)} {error} {required} onchange={(next) => saveDate(id, next, write)} />
	{:else if legacyNumber}
		<Input {id} {label} {value} {error} {required} class="font-mono" inputmode={ctc ? 'numeric' : 'text'}
			maxlength={ctc ? 8 : certificate === identificationFields.registration ? 10 : field.maxLength}
			oninput={(event) => {
				const input = event.currentTarget;
				const patch = legacyExemptIdentificationPatch(calculated, id, input.value, identificationFields);
				if (input.value !== patch[id]) input.value = patch[id];
				onvaluechange(patch);
			}} />
	{:else}
		<Input {id} {label} {value} {error} {required} disabled={row?.disabled} inputmode="text" maxlength={field.maxLength} oninput={(event) => write(id, event.currentTarget.value)} />
	{/if}
{/snippet}

{#snippet monthYearControl(month: CorporateField, year: CorporateField, label: string, row: CorporateRow, yearDigits: 2 | 4 = 4)}
	<div class="month-year-control">
		<MonthYearInput
			id={year.id}
			alternateId={month.id}
			{label}
			month={calculated[month.id] ?? month.defaultValue}
			year={calculated[year.id] ?? year.defaultValue}
			{yearDigits}
			fixedMonth={!applies(month) || month.readonly ? calculated[month.id] || month.defaultValue : undefined}
			disabled={row.disabled || year.readonly}
			required={corporateFieldRequired(form, year, calculated, row) || corporateFieldRequired(form, month, calculated, row)}
			error={errors[month.id] || errors[year.id]}
			onchange={(nextMonth, nextYear) => onvaluechange({ [month.id]: nextMonth, [year.id]: nextYear })}
		/>
	</div>
{/snippet}

{#snippet managedValue(id: string, label: string, value: string, error: string | undefined, monospace: boolean)}
	<div class={['managed-value', { monospace }]}>
		<CalculatedValue {id} {label} {value} {error} />
	</div>
{/snippet}

{#snippet percentUnit()}<span class="percent-unit" aria-hidden="true">%</span>{/snippet}

{#snippet scheduleContinuationLink(destination: { label: string; page: string; heading: string })}
	<div class="schedule-jumps">
		<button type="button" class="schedule-reference" onclick={() => void showSection(destination.page, destination.heading)}>
			{destination.label}
		</button>
	</div>
{/snippet}

{#snippet columnHeadings(columns: string[])}
	<div class="corporate-columns" style:--column-count={columns.length}>
		{#each columns as column, index (index)}
			<span>{column}</span>
		{/each}
	</div>
{/snippet}

{#snippet activityAttachments(inline: boolean)}
		<section class={['attachments', inline ? 'inline-attachments' : 'corporate-section']} aria-label="Activity attachments">
			{#if inline}
				<p id={`${headingId}-section-activities`} tabindex="-1">Use a Part {legacyMixed ? 'VIII' : 'V'} attachment for each exempt or special-rate activity.</p>
			{:else}
				<header class="eq-section-header">
					<h3 id={`${headingId}-section-activities`} tabindex="-1">Activity attachments</h3>
				</header>
			{/if}
			<div class="attachment-groups">
				{#each activityGroups as group (group.key)}
					{@const instances = attachments.filter(attachment => attachment.group.key === group.key)}
					{@const count = instances.length}
					<div>
						<div class="attachment-actions">
							{#if !inline}<span>{group.label}</span>{/if}
							<Button size="sm" variant="secondary" disabled={count >= 99} onclick={() => {
								const title = `${group.label} ${count + 1} · `;
								change(group.countField, String(count + 1));
								void tick().then(() => {
									const index = allPages.findIndex(page => page.title.startsWith(title));
									if (index !== -1) void showPage(String(index + 1));
								});
							}}>Add {group.label.toLowerCase()}</Button>
							{#if count > 0}
								<Button size="sm" variant="ghost" data-agent-confirm="delete" onclick={() => {
									const id = new RegExp(`${instances[count - 1].id}(?!\\d)`);
									const patch = Object.fromEntries(Object.keys(values).filter(key => id.test(key)).map(key => [key, '']));
									onvaluechange({ ...patch, [group.countField]: String(count - 1) });
									if (Number(current) > form.pages.length) void showPage(String(form.pages.length));
								}}>Remove last {group.label.toLowerCase()}</Button>
							{/if}
						</div>
						{#if count > 0}
							<ul class="activity-list" aria-label={`${group.label} attachments`}>
								{#each instances as instance (instance.id)}
									{@const destination = String(allPages.findIndex(page => page.title.startsWith(`${instance.title} · `)) + 1)}
									<li><a href={`#${headingId}`} onclick={(event) => {
										event.preventDefault();
										void showPage(destination);
									}}>{instance.title}</a></li>
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			</div>
		</section>
	{/snippet}

<div class={['paper-sheet corporate-editor', legacyRegular && current === '1' && 'legacy-regular-cover', legacyExemptCover && 'legacy-exempt-cover', mixedScheduleLayout && 'mixed-schedules']} style:--exempt-amount-width={legacyIdentification ? '14rem' : undefined} style:--exempt-item-gutter={legacyIdentification ? '2.5rem' : undefined} role="region" aria-label={form.title}>
	<PaperFormHeader {number} revision={form.revision} {title} {subtitle} />
	<div class="page-context">
		<h2 id={headingId} tabindex="-1">{pages[Number(current) - 1].title}</h2>
		<p>{corporateReturnPeriod(form, values)}</p>
	</div>
	{#if legacyMixed && current === '4'}
		<nav class="schedule-jumps" aria-label="Sales and costs sections">
			<button type="button" class="schedule-reference" onclick={() => void showSection('4', 'Schedule 3 ')}>Sales</button>
			<button type="button" class="schedule-reference" onclick={() => void showSection('4', 'Schedule 3A ')}>Trading</button>
			<button type="button" class="schedule-reference" onclick={() => void showSection('4', 'Schedule 3B ')}>Manufacturing</button>
			<button type="button" class="schedule-reference" onclick={() => void showSection('4', 'Schedule 3C ')}>Services</button>
		</nav>
	{/if}
	{#each active.sections as section, index (index)}
		{#if hasVisibleFields(section)}
			{@const lists = corporateLists(section)}
			{@const scheduleContinuation = continuation(section)}
			{@const reliefBasis = inlineActivities && /^(?:Part IV|Schedule 1) - Basis of Tax Relief/.test(section.title)}
			{@const regimePayable = inlineActivities && section.title.startsWith('Part V - Computation of Amount Payable')}
			{@const balanceSheet = legacyMixed && current === '8' && section.title.startsWith('Schedule 11 - Balance Sheet')}
			{@const serviceCosts = legacyMixed && current === '4' && section.title.startsWith('Schedule 3C ')}
			{@const auditor = section.title === corporateAuditorSectionTitle}
			{@const filing = current === '1' && /^(?:taxpayer and )?filing (?:information|details)$/i.test(section.title)}
			{@const exemptIdentification = legacyIdentification && current === '1' && section.title === 'Filing identification'}
			{@const managed = current === '1' && section.rows.some(row => row.fields.some(field => field.profileKey))}
			{@const background = managed && /background information/i.test(section.title)}
			<section class={['corporate-section', { filing, background, 'annual-background': background && !form.quarter,
				'quarterly-filing': filing && !!form.quarter,
				'legacy-mixed-background': background && legacyMixed, 'relief-basis': reliefBasis,
				'regime-payable': regimePayable,
				'legacy-exempt-totals': legacyIdentification && !legacyRegular && current === '1' && section.title.startsWith('Part II - Total Tax Payable'),
				'legacy-exempt-identification': exemptIdentification
			}]} aria-label={section.title || active.title}>
				{#if section.title}
					<header class="eq-section-header">
						<h3 id={`${headingId}-section-${index}`} tabindex="-1">{serviceCosts ? 'Schedule 3C - Cost of Services' : shortTitle(section.title)}</h3>
						{#if managed}
							<ButtonLink href={taxpayerHref} variant="ghost" size="icon" aria-label="Edit taxpayer information" title="Edit taxpayer information">
								<span class="edit-icon"><Icon icon={glyphs.pencil} /></span>
							</ButtonLink>
						{/if}
					</header>
				{/if}
				{#if serviceCosts}
					<p class="schedule-instruction">Enter only costs directly incurred or related to gross revenue from rendering services.</p>
				{/if}
				{#if scheduleContinuation && Number(scheduleContinuation.page) < Number(current)}
					{@render scheduleContinuationLink(scheduleContinuation)}
				{/if}
				{#if legacyMixed && current === '9' && section.title.startsWith('Schedule 13 ')}
					<h4 class="schedule-subheading">Gross income / receipts subject to final withholding</h4>
				{/if}
				{#if section.columns?.length && !reliefBasis}
					{@render columnHeadings(section.columns)}
				{/if}
				<div class={['corporate-rows', auditor && 'external-auditor-grid']}>
					{#each background ? corporateBackgroundRows(form, section.rows) : section.rows as row, rowIndex (rowIndex)}
						{@const list = lists.get(row)}
						{@const visible = row.fields.filter(field => !field.repeatable && applies(field))}
						{@const registered = background && isRegisteredInformationRow(row)}
						{@const hiddenEntry = row.entry || row.list || (list && list.entries.some(entry => entry.rows.includes(row)))}
						{@const labelColumns = !!section.columns?.length && visible.every(field => field.column !== undefined)}
						{@const tin = tinFields(visible)}
						{@const accreditation = accreditationFields(visible)}
						{@const closingMonth = filing && row.fields.find(field => field.id === form.month)}
						{@const closingYear = closingMonth && visible.find(field => field.id === form.year)}
						{@const reliefDate = legacyReliefDateFields(visible)}
						{@const wide = visible.some(field => field.id === form.quarter)}
						{@const atcChoice = filing && /\bATC\b|alphanumeric tax code/i.test(row.label)}
						{@const columnRow = !!section.columns?.length && visible.some(field => field.column !== undefined)}
						{@const amountColumns = columnRow || !mixedScheduleLayout ? section.columns : undefined}
						{@const groupedAmounts = mixedScheduleLayout && columnRow && labelColumns && !!row.label && !!row.item}
						{@const totalOnly = groupedAmounts && regimePayable && Number(row.item) >= 40 && Number(row.item) <= 44}
						{@const rowReferences = visible.flatMap(field => references.get(field.id) ?? [])}
						{@const caption = regimePayable && rowReferences.length ? row.label.replace(/\s*\((?:From|To) [^)]*\)/gi, '') : row.label}
						{@const groupLabel = `${headingId}-section-${index}-row-${rowIndex}`}
						{@const activityElection = inlineActivities && visible.some(field => field.id === (legacyMixed
							? 'frm1702MX:chkPg2Pt4I30MoreThanOne' : 'frm1702MX:rdoPg2I1'))}
						{@const inlineAmounts = visible.filter(field => field.kind === 'money')}
						{@const sectionLabeledAmounts = (mixed2018Schedules || legacyMixedSchedules && current === '6')
							&& section.columns?.length === inlineAmounts.length
							&& inlineAmounts.every((field, index) => field.label === section.columns?.[index])}
						{@const inlineDescription = !columnRow && (inlineAmounts.some(field => !field.readonly) || sectionLabeledAmounts)
							&& visible.every(field => field.kind === 'text' || field.kind === 'money')
							&& visible.some(field => field.kind === 'text' && !field.readonly && field.label === 'Description')}
						{@const deductionCategory = revisedRegular && /^17[abc]$/.test(row.item ?? '')}
						{@const deductionEntry = row.layout === 'deduction'}
						{@const supplementalAmounts = legacyRegular && /^frm1702RT:txtPg8Sc12I[1-3]C1$/.test(row.fields[0]?.id ?? '')}
						{#if reliefBasis && row.item === (legacyMixed ? '31' : '1') && section.columns?.length}
							<div class="relief-regime-header">
								<div class="amount-row">
									{@render columnHeadings(section.columns)}
								</div>
							</div>
						{/if}
						{#if visible.length && !hiddenEntry}
							{#if row.heading}
								<h4 class="schedule-subheading">{row.heading}</h4>
							{/if}
							{#if balanceSheet && row.item && balanceGroupLabels[row.item]}
								<h4 class="schedule-subheading">{balanceGroupLabels[row.item]}</h4>
							{/if}
							{#if supplementalAmounts && row.item === '1'}
								<div class="corporate-row supplemental-headers" aria-hidden="true">
									<div class="amount-row">
										<span>Income item</span>
										<div class="amount-controls">
											{#each visible as field (field.id)}
												<span>{field.label}</span>
											{/each}
										</div>
									</div>
								</div>
							{/if}
							{#if deductionCategory && row.item === '17a'}
								<h4 class="corporate-row deduction-heading">
									<span class="paper-item-number">17</span>
									<span>Others (Deductions Subject to Withholding Tax and Other Expenses)</span>
								</h4>
							{/if}
							<div class={['corporate-row', background && corporateBackgroundCell(row), {
								'deduction-category': deductionCategory,
								'supplemental-amounts': supplementalAmounts,
								'final-payable': totalOnly && row.item === '44',
								wide, 'atc-choice': atcChoice,
								total: visible.some(field => field.id === form.amount),
								'identification-type': exemptIdentification && visible.some(field => field.id === identificationFields.type),
								'identification-date': exemptIdentification && visible.some(field => field.id === identificationFields.issueDate),
								'identification-place': exemptIdentification && visible.some(field => field.id === identificationFields.issuePlace),
								'identification-amount': exemptIdentification && visible.some(field => field.id === identificationFields.amount),
								'managed-cell': background && !registered && !(legacyMixed && (row.item === '13' || row.item === '14')) && visible.every(field => field.profileKey)
									&& (visible.length === 1 || tin.length === visible.length)
							}]}
								data-corporate-item={row.item}>
								{#if row.item}<span class="paper-item-number" aria-hidden={legacyRegular || revisedRegular ? undefined : 'true'}>{row.item.toUpperCase()}</span>{/if}
								{#if registered}
									<div class="managed-value">
										<RegisteredInformation fields={visible} values={calculated} {errors} />
									</div>
								{:else if atcChoice && form.code.startsWith('1702MX')}
									<div class="mixed-atc-fields">
										<h4>
											{row.label}
											{#if !legacyMixed && visible.some(field => field.id === legacyMixedAtc && corporateFieldRequired(form, field, calculated, row))}
												<span aria-hidden="true" class="required-marker">*</span>
											{/if}
										</h4>
										{#each visible as field (field.id)}
											<div class={['field-control', field.id === legacyMixedAtc && 'mixed-atc-picker']}>
												{@render control(filingField(field, row), row.label, undefined, row)}
											</div>
										{/each}
									</div>
								{:else if accreditation.length}
									<AccreditationNumberInput fields={accreditation} values={calculated} {errors} {onvaluechange} />
								{:else if tin.length}
									{@const label = tin[0].profileKey ? 'TIN and branch code' : (row.label || 'TIN and branch code')}
									{@const tinValue = tin.map(field => calculated[field.id] ?? '').join('-').replace(/-+$/, '')}
									{@const tinError = tin.map(field => errors[field.id]).find(Boolean)}
									<div class="profile-row">
										{#if tin.every(field => field.profileKey || field.readonly)}
											{@render managedValue(tin[0].id, label, tinValue, tinError, true)}
										{:else}
											<TinInput id={tin[0].id} {label} value={tinValue} error={tinError} preserveSegments
												onchange={(next) => writeTin(tin, next)} />
										{/if}
										{#each visible.filter(field => !tin.includes(field)) as field (field.id)}
											{@render control(field, row.label, undefined, row)}
										{/each}
									</div>
								{:else if closingMonth && closingYear}
									{@render monthYearControl(closingMonth, closingYear, 'Year ended', row)}
								{:else if reliefDate}
									{@render monthYearControl(reliefDate.month, reliefDate.year, row.item === '5' ? 'Relief from' : 'Relief to', row, 2)}
								{:else if inlineDescription || deductionEntry}
									<div class={['inline-entry', inlineAmounts.length > 1 && 'multiple-amounts', sectionLabeledAmounts && 'section-labeled-amounts', deductionEntry && 'deduction-entry']}
										role={deductionEntry ? 'group' : undefined} aria-label={deductionEntry ? row.label : undefined}>
										<div class="inline-entry-details">
											{#each visible.filter(field => field.kind === 'text') as field (field.id)}
												<div class="field-control">
													{@render control(field, row.label, undefined, row)}
												</div>
											{/each}
										</div>
										<div class="inline-entry-amounts" style:--column-count={inlineAmounts.length}>
											{#each inlineAmounts as field (field.id)}
												<div class="field-control">
													{@render control(field, row.label, undefined, row)}
												</div>
											{/each}
										</div>
									</div>
								{:else if columnRow || (!exemptIdentification && visible.every(field => field.kind === 'money' || field.kind === 'percent'))}
									<div class={['amount-row', groupedAmounts && 'grouped-amounts']}
										role={groupedAmounts ? 'group' : undefined} aria-labelledby={groupedAmounts ? groupLabel : undefined}>
										<div class="amount-caption">
											<span id={groupedAmounts ? groupLabel : undefined}>{caption}</span>
											{#each rowReferences as reference (reference.target + reference.label)}
												<button type="button" class="schedule-reference" data-reference-target={reference.target}
													data-reference-page={reference.page} onclick={() => void followReference(reference.target)}>
													{reference.label}
												</button>
											{/each}
										</div>
										<div class={['amount-controls', { single: !amountColumns?.length && visible.length === 1,
												'label-columns': labelColumns, required: visible.some(field => corporateFieldRequired(form, field, calculated, row)) }]} style:--column-count={amountColumns?.length || visible.length}>
											{#each row.fields.filter(field => !field.repeatable && (amountColumns?.length || applies(field))) as field, columnIndex (field.id)}
												<div class={['amount-control', { standalone: columnRow && field.column === undefined }]} style:--amount-column={field.column}>
													{#if applies(field)}
														{@render control(field, row.label, columnRow && field.column === undefined ? undefined : amountColumns?.[(field.column ?? columnIndex + 1) - 1], row, false,
															(supplementalAmounts || groupedAmounts) ? row.label : undefined, groupedAmounts)}
													{/if}
												</div>
											{/each}
										</div>
									</div>
								{:else}
									<div class="field-row">
										{#each visible as field (field.id)}
											<div class={['field-control', {
												'auditor-date': auditor && field.kind === 'date',
												'numeric-short': field.kind === 'integer' && (field.id === form.year || (field.maxLength ?? 8) <= 4),
												'atc-checkbox': atcChoice && field.kind === 'checkbox'
											}]}>
												{@render control(filing ? filingField(field, row) : field, row.label, undefined, row)}
											</div>
										{/each}
									</div>
								{/if}
								{#if activityElection && activityGroups.length}
									{@render activityAttachments(true)}
								{/if}
							</div>
						{/if}
						{#if list}
							{@const counter = list.counter}
							{@const listItem = legacyMixedSchedules ? legacyListItems[list.label]
								: !legacyMixed && counter?.id.endsWith('CtrPg2MScDI17i') ? 'ordinary deduction'
								: !legacyMixed && counter?.id.endsWith('CtrPg4MScHI4') ? 'special deduction' : undefined}
							{@const alignEntryAmounts = (legacyMixed && current === '5' && list.label === 'Other taxable income')
								|| (mixed2018Schedules && current === '3' && counter?.id === 'frm1702MX:txtCtrmodalPg3Sc5I17i')}
							{@const separateItem = legacyMixedSchedules ? {
								'Other ordinary allowable deductions': '39O', 'Special allowable deductions': '4D', 'Other tax credits': '12'
								}[list.label] : undefined}
							{@const income = counter?.id === incomeCounterId}
							{@const deductions = counter?.id === deductionCounterId}
							{@const owners = list.label === ownerListLabel}
							{@const nolco = list.label === nolcoListLabel}
							{@const editable = list.entries.filter(entry => editableFields(entry).length > 0)}
							{@const entries = (nolco ? list.entries : editable).filter(entry =>
								entry.rows[0].entry || (nolco && isCurrentNolco(entry) && editable.includes(entry))
								|| (editable.includes(entry) || nolco && isCurrentNolco(entry)) && entryHasValues(entry))}
							{@const continuationOnly = counter?.repeatable?.continuationOnly}
							{@const emptyEntry = continuationOnly ? undefined : editable.find(entry => !entries.includes(entry) && (!nolco || !isCurrentNolco(entry)) &&
								(!entryFields(entry).some(field => field.kind === 'money') || editableFields(entry).some(field => field.kind === 'money')))}
							{@const fixed = !counter || counter.repeatable?.fixed}
							{@const sourceSlots = list.entries.filter(entry => !entry.rows[0].entry).length}
							{@const limit = continuationOnly ? counter!.repeatable!.limit : fixed ? sourceSlots : counter.repeatable!.limit + sourceSlots
								- (counter.repeatable!.rollup || counter.repeatable!.seedFrom ? 1 : 0)}
							{@const anchor = listAnchor(counter?.id ?? row.fields[0].id)}
							<div class="line-list income-list"
								id={`${headingId}-section-${index}-list-${Array.from(lists.keys()).indexOf(row)}`} tabindex="-1">
								<div class="line-list-header">
									<div>
										<h4 id={anchor} tabindex="-1">
											{list.label}{#if !deductions}<span class="income-count">{` (${entries.length}/${limit})`}</span>{/if}
										</h4>
										{#if separateItem && (current === '6' || current === '7')}
											<p class="deduction-status">Item {separateItem} below is entered separately.</p>
										{/if}
										{#if deductions}
											{#if !entries.length}
												<p class="deduction-status">No deductions added</p>
											{:else if entries.length >= limit - 5}
												<p class="deduction-status">{entries.length} of {limit} deduction slots used</p>
											{/if}
										{/if}
									</div>
									<Button id={`${anchor}-add`} size="sm" variant="secondary"
										disabled={continuationOnly ? entries.length >= limit : fixed ? !emptyEntry || (!nolco && entries.length >= limit)
											: !emptyEntry && Number(calculated[counter!.id] || 0) >= counter!.repeatable!.limit}
										onclick={(event) => emptyEntry ? openListEntry(list, emptyEntry, event.currentTarget, true)
											: counter && addEntry(index, counter, event.currentTarget)}>
										{listItem ? `Add ${listItem}` : deductions ? 'Add deduction' : 'Add item'}
									</Button>
								</div>
								{#if counter && errors[counter.id]}<FieldErrors errors={[errors[counter.id]]} />{/if}
								{#if entries.length}
									<ul aria-label={`${list.label} line items`}>
										{#each entries as entry (entry.rows[0].fields[0].id)}
											{@const fields = entryFields(entry)}
											{@const description = nolco ? nolcoYear(entry) : fields.find(field => (field.kind === 'text' || field.kind === 'integer') && !/tin|legal|basis/i.test(field.label ?? field.id))}
											{@const amounts = fields.filter(field => nolco ? /net operating loss|balance/i.test(field.label ?? '') : field.kind === 'money' || field.kind === 'percent')}
											{@const item = entry.item.toUpperCase()}
											{@const summary = (description && calculated[description.id]?.trim()) ||
												(nolco && isCurrentNolco(entry) ? 'Current year' : `Item ${item || entries.indexOf(entry) + 1}`)}
											<li class={['income-item', alignEntryAmounts && 'aligned-income-item']}>
												<span class="entry-number">{item}</span>
												<div class={['entry-summary', alignEntryAmounts && 'amount-row']}>
													{#if editable.includes(entry)}
														<button id={listAnchor(entry.rows[0].fields[0].id) + '-edit'} type="button" class="income-description" onclick={(event) => openListEntry(list, entry, event.currentTarget)}>{summary}</button>
													{:else}
														<span>{summary}</span>
													{/if}
													<div class={['entry-values', 'entry-amounts', alignEntryAmounts && 'amount-controls']} style:--column-count={alignEntryAmounts ? amounts.length : undefined}>
														{#each amounts as field (field.id)}
															<span class="entry-amount" title={field.label}>
																{#if amounts.length > 1}<span class="entry-amount-label">{field.label}</span>{/if}
																<span class="font-mono">{display(field, calculated[field.id] ?? '') || '0'}</span>
															</span>
														{/each}
													</div>
												</div>
											</li>
										{/each}
									</ul>
								{:else if !deductions}
									<p class="schedule-empty-message">{income ? 'No income items added' : owners ? 'No owners entered' : 'No items added'}</p>
								{/if}
								{#if canUndo && removed?.anchor === anchor}
									<div class="eq-undo"><span role="status">Line item removed.</span><Button variant="ghost" size="sm" onclick={undoRemoval}>Undo</Button></div>
								{/if}
							</div>
						{/if}
					{/each}
				</div>
				{#if balanceSheet && balanceHasEntries}
					<p class="balance-status" aria-live="polite">
						{#if balanceDifference === 0}
							Total assets equal total liabilities and equity.
						{:else}
							Total assets are ₱{formatCurrencyInput(String(Math.abs(balanceDifference)), decimals, true)}
							{balanceDifference > 0 ? 'higher' : 'lower'} than total liabilities and equity.
						{/if}
					</p>
				{/if}
				{#if scheduleContinuation && Number(scheduleContinuation.page) > Number(current)}
					{@render scheduleContinuationLink(scheduleContinuation)}
				{/if}
			</section>
		{/if}
	{/each}
	{#if activityGroups.length && !inlineActivities}
		{@render activityAttachments(false)}
	{/if}
	<ReturnPagination {pages} {current} onchange={showPage} />
</div>

<Sheet bind:open={() => !!editing, (open) => { if (!open) closeEntry(); }}
	title={editingItemName ? `${adding ? 'Add' : 'Edit'} ${editingItemName}` : editingDeduction ? (adding ? 'Add deduction' : 'Edit deduction')
		: editingList ? (editingList.counter?.id === incomeCounterId ? (adding ? 'Add income item' : 'Edit income item') : adding ? 'Add item' : 'Edit item')
		: editing ? (adding ? 'Add entry' : `Edit item ${editing.item.toUpperCase()}`) : ''}
	context={editingNolco ? editingContext : editingList?.label ?? editing?.rows[0]?.label}>
	{#if editing}
		{@const editable = editableFields(editing)}
		<div class="entry-editor">
			{#each editing.rows as row (row.fields[0].id)}
				{@const fields = row.fields.filter(field => applies(field) && (editingNolco ? !field.repeatable : editable.includes(field)))}
				{@const tin = tinFields(fields)}
				{#if editing.rows.length > 1}<h3>{row.label}</h3>{/if}
				{#each fields as field (field.id)}
					{#if field === tin[0]}
						<TinInput id={field.id} label="TIN and branch code" preserveSegments
							required={tin.some(segment => rowRequired(row, segment, { ...calculated, ...draft }))}
							value={tin.map(segment => draft[segment.id] ?? '').join('-').replace(/-+$/, '')}
							error={tin.map(segment => editErrors[segment.id]).find(Boolean)}
							onchange={(value) => {
								const segments = splitTinSegments(value);
								tin.forEach((segment, index) => { draft[segment.id] = segments[index] ?? ''; });
							}} />
					{:else if !tin.includes(field)}
						{@render control(field, row.label, undefined, row, true)}
					{/if}
				{/each}
			{/each}
		</div>
	{/if}
	{#snippet footer()}
		<div class="entry-actions">
			{#if editingList && editing && !adding && editableFields(editing).length && (!editingNolco || !isCurrentNolco(editing))}
				<Button variant="danger" data-agent-confirm="delete" onclick={deleteListEntry}>Delete item</Button>
			{/if}
			<Button variant="secondary" onclick={closeEntry}>Cancel</Button>
			{#if editing && (!editingNolco || editableFields(editing).length)}
				<Button onclick={saveEntry}>{adding ? (editingItemName ? `Add ${editingItemName}` : editingDeduction ? 'Add deduction' : 'Add item') : 'Update'}</Button>
			{/if}
		</div>
	{/snippet}
</Sheet>

<style>
	.corporate-editor {
		--corporate-row-inset: .875rem;
		--corporate-item-width: 2rem;
	}
	.entry-number { font-family: var(--font-mono); color: var(--fg-muted); font-size: var(--form-label-size); font-weight: 500; font-variant-numeric: tabular-nums; }
	.mixed-schedules {
		--schedule-amount-share: .72;
		--schedule-amount-width: 48rem;
	}
	.line-list { padding: .75rem var(--corporate-row-inset); border-block-start: 1px solid var(--border-soft); scroll-margin-top: 5rem; }
	.eq-section-header + .corporate-rows > .line-list:first-child { border-block-start: 0; }
	.line-list-header, .entry-actions { display: flex; align-items: center; flex-wrap: wrap; gap: .5rem; }
	.line-list-header { justify-content: space-between; }
	.line-list h4, .entry-editor h3 { margin: 0; font-size: .875rem; font-weight: 650; }
	.line-list ul { margin: .5rem 0 0; padding: 0; list-style: none; border: 1px solid var(--border); border-radius: .375rem; }
	.line-list li { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: .5rem; align-items: center; padding: .375rem .5rem; }
	.line-list li + li { border-top: 1px solid var(--border-soft); }
	.entry-values { display: flex; flex-wrap: wrap; gap: .25rem .75rem; font-size: .875rem; overflow-wrap: anywhere; }
	.entry-amount { font-weight: 550; font-variant-numeric: tabular-nums; }
	.income-list { padding: 0; --schedule-empty-inset: var(--corporate-row-inset); }
	.income-list .line-list-header {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		padding: .5rem var(--corporate-row-inset);
	}
	.entry-amounts { justify-content: end; gap: .375rem 1rem; min-inline-size: 0; max-inline-size: min(50cqi, 32rem); }
	.entry-amount-label { display: block; font-size: .75rem; font-weight: 400; color: var(--fg-muted); }
	.deduction-status { margin: .125rem 0 0; color: var(--fg-muted); font-size: var(--form-label-size); }
	.income-count { font-family: var(--font-mono); color: var(--fg-muted); font-variant-numeric: tabular-nums; }
	.income-list ul { margin: 0; border: 0; border-radius: 0; }
	.income-list .income-item {
		grid-template-columns: var(--corporate-item-width) minmax(0, 1fr) auto;
		padding: .125rem var(--corporate-row-inset);
		border-block-start: 1px solid var(--border-soft);
	}
	.entry-summary:not(.amount-row) { display: contents; }
	.income-list .aligned-income-item { grid-template-columns: var(--corporate-item-width) minmax(0, 1fr); }
	.aligned-income-item .entry-amounts {
		display: grid;
		max-inline-size: none;
		gap: var(--form-field-column-gap);
	}
	.income-item .entry-amount {
		margin-inline-end: var(--paper-amount-inset);
		font-size: var(--form-control-size);
		text-align: end;
	}
	.entry-editor { display: grid; gap: 1rem; padding: 1.25rem; }

	@container paper-form (max-width: 26rem) {
		.line-list li { grid-template-columns: auto minmax(0, 1fr); }
	}
	.page-context { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .25rem 1rem; padding: .625rem .875rem; border-bottom: 1px solid var(--border); }
	.page-context h2, .corporate-section h3 { font: inherit; font-size: .875rem; font-weight: 650; margin: 0; scroll-margin-top: 5rem; }
	.page-context p { margin: 0; color: var(--fg-muted); font-size: .8rem; }
	.corporate-section { min-width: 0; border-bottom: 1px solid var(--border); }
	.corporate-section .eq-section-header { margin: 0; padding: .375rem .875rem; background: var(--paper-section-background, var(--bg-hover)); border-bottom: 1px solid var(--border); }
	.attachment-actions { padding-inline: var(--corporate-row-inset); }
	.background .corporate-rows {
		display: flex;
		flex-wrap: wrap;
		gap: 1px;
		padding: 0;
		background: var(--border);
	}
	.background .corporate-rows > .corporate-row {
		flex: 1 0 var(--background-cell-width, 100%);
		min-width: 0;
		padding: .75rem .875rem;
		border: 0;
		background: var(--bg-elev);
	}
	.background .corporate-row:has(.paper-item-number) {
		--background-item-width: 1.1rem;
		--background-item-gap: .5rem;
		grid-template-columns: var(--background-item-width) minmax(0, 1fr);
		column-gap: var(--background-item-gap);
	}
	.background .paper-item-number { padding-top: 0; }
	.background .managed-cell .paper-item-number { font-size: .75rem; }
	.legacy-regular-cover { --corporate-item-width: 1.1rem; }
	@container paper-form (width < 36rem) {
		.annual-background :is(.identity-cell, .short-cell) {
			--background-cell-width: calc((100% - 1px) / 2);
		}
		.annual-background .corporate-rows > .corporate-row { padding-block: .5rem; }
	}
	@container paper-form (min-width: 36rem) {
		.background .corporate-rows { --background-cell-width: calc((100% - 1px) / 2); }
		.background .wide-cell { --background-cell-width: 100%; }
	}
	@container paper-form (min-width: 58rem) {
		.background .corporate-rows { --background-cell-width: calc((100% - 3px) / 4); }
		.background :is(.identity-cell, .wide-cell) { --background-cell-width: calc((100% - 1px) / 2); }
	}
	.legacy-mixed-background .corporate-row:is([data-corporate-item='12'], [data-corporate-item='13'], [data-corporate-item='14'], [data-corporate-item='15']) {
		--background-cell-width: 100%;
	}
	@container paper-form (min-width: 32rem) {
		.legacy-mixed-background .corporate-row[data-corporate-item='13'] { --background-cell-width: calc(72% - 1px); }
		.legacy-mixed-background .corporate-row[data-corporate-item='14'] { --background-cell-width: 28%; }
	}
	.psic-picker { display: grid; gap: var(--form-label-gap); max-inline-size: 12rem; }
	.required-marker { color: var(--danger); margin-inline-start: .25rem; }
	.legacy-mixed-background :is([data-corporate-item='13'], [data-corporate-item='15']) :global([data-slot='calculated-value']) {
		grid-template-columns: minmax(0, 1fr);
	}
	.legacy-mixed-background :is([data-corporate-item='13'], [data-corporate-item='15']) :global(output) {
		font-family: inherit;
		text-align: start;
	}
	.legacy-mixed-background [data-corporate-item='15'] :global(.value-source) {
		grid-column: 1;
		text-align: start;
	}
	.mixed-atc-fields { display: grid; grid-template-columns: minmax(0, 1fr); gap: .5rem; min-width: 0; }
	.mixed-atc-fields h4 { margin: 0; font: inherit; font-size: var(--form-label-size); font-weight: 600; }
	.mixed-atc-fields .mixed-atc-picker { margin-inline-start: 1.5rem; max-inline-size: 24rem; }
	.mixed-atc-picker :global(label) { position: absolute; clip-path: inset(50%); overflow: hidden; width: 1px; height: 1px; white-space: nowrap; }
	.corporate-row { display: grid; grid-template-columns: minmax(0, 1fr); gap: .5rem; padding: .5rem var(--corporate-row-inset); }
	.corporate-row:has(.paper-item-number) { grid-template-columns: var(--corporate-item-width) minmax(0, 1fr); }
	.corporate-row + .corporate-row, .line-list + .corporate-row { border-block-start: 1px solid var(--border-soft); }
	.corporate-row.deduction-heading {
		margin: 0;
		align-items: baseline;
		background: var(--paper-section-background, var(--bg-hover));
		font-size: var(--form-label-size);
		font-weight: 650;
	}
	.deduction-heading .paper-item-number { padding: 0; }
	.corporate-row.total { font-weight: 650; }
	.paper-item-number { padding-top: .125rem; }
	.field-row, .profile-row, .amount-controls { display: grid; gap: var(--form-field-column-gap); }
	.inline-entry, .inline-entry-details, .inline-entry-amounts { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--form-field-column-gap); min-inline-size: 0; }
	.profile-row > :global(*), .field-control, .amount-control { min-width: 0; max-width: 100%; }
	.field-control.auditor-date { max-inline-size: 17rem; }
	.field-control.numeric-short { max-width: 10rem; }
	.background .field-control:has(:global([data-slot='date-input'])) { max-inline-size: 15rem; }
	.field-control :global(input:not([type="radio"]):not([type="checkbox"])),
	.amount-control :global(input) { min-width: 0; max-width: 100%; }
	.field-control :global([data-slot="form-item"]), .amount-control :global([data-slot="form-item"]) {
		min-width: 0;
		grid-template-columns: minmax(0, 1fr);
	}
	.amount-control { grid-column: var(--amount-column, auto); }
	.amount-control.standalone { grid-column: 1 / -1; width: min(100%, 18rem); }
	.activity-list { margin: 0 .875rem .75rem; padding-inline-start: 1.25rem; }
	.activity-list a { color: var(--accent); }
	.attachment-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem .75rem; margin-block: .5rem; }
	.inline-attachments { grid-column: 2; min-inline-size: 0; }
	.corporate-row:not(:has(.paper-item-number)) .inline-attachments { grid-column: 1; }
	.inline-attachments p { margin: 0; font-size: var(--form-label-size); color: var(--fg-muted); }
	.inline-attachments .attachment-groups { display: flex; flex-wrap: wrap; gap: .375rem .75rem; margin-block-start: .5rem; }
	.inline-attachments .attachment-actions { margin: 0; padding: 0; }
	.inline-attachments .activity-list { margin: .25rem 0 0; }
	.relief-regime-header {
		display: none;
		padding: .375rem var(--corporate-row-inset);
		padding-inline-start: calc(var(--corporate-row-inset) + var(--corporate-item-width) + .5rem);
	}
	@container paper-form (min-width: 52rem) {
		.section-labeled-amounts .inline-entry-amounts { align-items: center; }
		.section-labeled-amounts .inline-entry-amounts :global(label),
		.section-labeled-amounts .inline-entry-amounts :global(.value-label) {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
		.section-labeled-amounts .inline-entry-amounts :global([data-slot='calculated-value']) {
			grid-template-columns: minmax(0, 1fr);
		}
		.relief-regime-header {
			display: block;
			border-block: 1px solid var(--border-soft);
		}
		.relief-regime-header .corporate-columns { grid-column: -2 / -1; width: auto; margin: 0; padding: 0; align-items: end; }
		.relief-regime-header .corporate-columns span { text-align: start; }
	}
	@container paper-form (width < 30rem) {
		.inline-attachments .attachment-groups, .inline-attachments .attachment-actions { display: grid; gap: .375rem; }
		.inline-attachments .attachment-actions :global(button) { min-block-size: 2.75rem; }
	}
	.schedule-jumps { display: flex; flex-wrap: wrap; gap: .25rem 1rem; padding: .25rem var(--corporate-row-inset); }
	.schedule-instruction { margin: 0; padding: .5rem var(--corporate-row-inset); font-size: var(--form-label-size); color: var(--fg-muted); }
	.schedule-subheading, .balance-status {
		margin: 0;
		border-block-start: 1px solid var(--border-soft);
		padding: .375rem var(--corporate-row-inset);
		font-size: var(--form-label-size);
	}
	.schedule-subheading { background: var(--bg-hover); font-weight: 650; }
	.schedule-subheading + .corporate-row { border-block-start: 1px solid var(--border-soft); }
	.balance-status { padding-inline-start: calc(var(--corporate-row-inset) + var(--corporate-item-width) + .5rem); }
	.amount-row { display: grid; gap: .375rem 1rem; min-width: 0; font-size: var(--form-label-size); align-items: center; }
	.amount-caption:not(:has(.schedule-reference)), .amount-caption > span { display: none; }
	.grouped-amounts .amount-caption, .grouped-amounts .amount-caption > span { display: block; overflow-wrap: anywhere; }
	.final-payable { background: var(--bg-hover); font-weight: 650; }
	.supplemental-headers { display: none; }
	.supplemental-amounts .amount-caption,
	.supplemental-amounts .amount-caption > span { display: block; }
	.supplemental-amounts .amount-controls { grid-template-columns: minmax(0, 1fr); }
	.schedule-reference, .income-description {
		display: block;
		min-block-size: 1.5rem;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--accent);
		font: inherit;
		font-size: .75rem;
		text-align: start;
		text-decoration: underline;
		overflow-wrap: anywhere;
		cursor: pointer;
	}
	.income-description { min-block-size: 2rem; font-size: .875rem; text-underline-offset: .15em; }
	.income-description:hover { text-decoration-thickness: 2px; }
	.amount-controls { grid-template-columns: repeat(var(--column-count), minmax(0, 1fr)); }
	.corporate-columns { display: grid; grid-template-columns: repeat(var(--column-count), minmax(0, 1fr)); gap: var(--form-field-column-gap); color: var(--fg-muted); font-size: .75rem; font-weight: 550; }
	.corporate-columns span { text-align: end; }
	.mixed-schedules .corporate-section > .corporate-columns { align-items: end; }
	.mixed-schedules .corporate-section > .corporate-columns span {
		padding-inline-end: var(--paper-amount-inset, calc(.75rem + 1px));
	}
	.managed-value :global([data-slot='calculated-value']) { grid-template-columns: minmax(0, 1fr); gap: .25rem; }
	.managed-value :global(.value-label) { font: inherit; font-size: .75rem; }
	.managed-value :global(output) { font-family: inherit; font-weight: inherit; line-height: inherit; font-size: .875rem; text-align: start; }
	.managed-value.monospace :global(output) { font-family: var(--font-mono); }
	.edit-icon { display: inline-flex; width: 1rem; height: 1rem; align-items: center; justify-content: center; }
	.edit-icon :global(svg) { width: 100%; height: 100%; }
	.percent-unit { color: var(--fg-muted); }
	.corporate-columns { margin-inline: var(--corporate-row-inset); padding-block: .5rem; }
	.filing {
		--radio-choice-column-gap: 1rem;
		--radio-choice-row-gap: .25rem;
	}
	.filing .corporate-rows { display: grid; grid-template-columns: minmax(0, 1fr); }
	.filing .corporate-row {
		--corporate-item-width: 1.1rem;
		min-inline-size: 0;
		align-items: start;
		padding-block: .625rem;
	}
	.filing .corporate-row :global(legend) { margin-block-end: .5rem; }
	.month-year-control { inline-size: min(100%, 12rem); }
	.filing .atc-choice .field-row {
		display: flex;
		flex-wrap: wrap;
		align-items: end;
		gap: .625rem 1.25rem;
	}
	.filing .atc-choice .field-control { flex: 0 1 auto; }
	.filing .atc-checkbox { font-size: var(--form-control-size); }
	.filing .atc-checkbox > :global(label) { min-block-size: 2.375rem; }
	.filing .atc-choice .field-row .field-control:has(:global([role='combobox'])) {
		inline-size: min(100%, 24rem);
	}
	@container paper-form (min-width: 30rem) {
		.filing .corporate-row:nth-child(2),
		.filing:not(.quarterly-filing) .corporate-row:nth-child(4),
		.quarterly-filing .corporate-row:last-child {
			border-inline-start: 1px solid var(--border-soft);
		}
	}
	@container paper-form (30rem <= width < 50rem) {
		.filing .corporate-rows { grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); }
		.filing .corporate-row:nth-child(2) { border-block-start: 0; }
		.filing .corporate-row:is(.atc-choice, .wide) { grid-column: 1 / -1; }
		.quarterly-filing .corporate-row:last-child { grid-column: auto; }
	}
	@container paper-form (min-width: 50rem) {
		.filing .corporate-rows {
			grid-template-columns: minmax(9rem, 1fr) minmax(18.5rem, 1.6fr) repeat(2, minmax(9rem, 1fr));
		}
		.filing .corporate-row:nth-child(n + 2):nth-child(-n + 4) { border-block-start: 0; }
		.filing .corporate-row:nth-child(3) { border-inline-start: 1px solid var(--border-soft); }
		.quarterly-filing .corporate-row.wide { grid-column: span 2; }
		.filing .corporate-row.atc-choice { grid-column: 1 / -1; }
		.quarterly-filing .corporate-row:nth-child(4) { border-block-start: 1px solid var(--border-soft); }
		.quarterly-filing .corporate-row:last-child { grid-column: 2 / -1; }
	}
	@container paper-form (min-width: 42rem) {
		.aligned-income-item .entry-amount-label {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
		}
		.deduction-category > .paper-item-number { align-self: center; padding: 0; }
		.inline-entry { grid-template-columns: minmax(0, 1fr) var(--paper-inline-amount-width); align-items: start; }
		.deduction-entry .inline-entry-details { grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); }
		.inline-entry.multiple-amounts { grid-template-columns: minmax(0, 1fr) min(calc(100% * var(--schedule-amount-share, .55)), var(--schedule-amount-width, 32rem)); }
		.inline-entry-amounts { grid-template-columns: repeat(var(--column-count), minmax(0, 1fr)); align-items: start; }
		.profile-row { grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr)); }
		.field-row { display: flex; flex-wrap: wrap; }
		.field-control { flex: 1 1 11rem; }
		.amount-row { grid-template-columns: minmax(0, 1fr) min(calc(100% * var(--schedule-amount-share, .55)), var(--schedule-amount-width, 32rem)); }
		.amount-caption:not(:has(.schedule-reference)), .amount-caption > span { display: block; overflow-wrap: anywhere; }
		.amount-row:has(.amount-controls.single.required) { grid-template-columns: minmax(0, 1fr); }
		.amount-row:has(.amount-controls.single.required) .amount-caption > span { display: none; }
		.amount-controls.single { inline-size: min(100%, 12rem); justify-self: end; }
		.amount-controls:is(.single, .label-columns):not(.required) .amount-control:not(.standalone) :global(label),
		.amount-controls:is(.single, .label-columns) .amount-control:not(.standalone) :global(.value-label) {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
		.amount-controls:is(.single, .label-columns) .amount-control :global([data-slot='calculated-value']) { grid-template-columns: minmax(0, 1fr); }
		.corporate-columns { width: min(calc((100% - 2.5rem) * var(--schedule-amount-share, .55)), var(--schedule-amount-width, 32rem)); margin-inline-start: auto; }
		.supplemental-headers {
			display: grid;
			grid-template-columns: var(--corporate-item-width) minmax(0, 1fr);
			color: var(--fg-muted);
			font-weight: 550;
		}
		.supplemental-headers .amount-row { grid-column: 2; align-items: end; }
		:is(.supplemental-headers, .supplemental-amounts) .amount-row {
			grid-template-columns: minmax(7rem, 1fr) minmax(0, 3.4fr);
		}
		:is(.supplemental-headers, .supplemental-amounts) .amount-controls {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) minmax(0, 1fr);
		}
		.supplemental-headers .amount-controls { align-items: end; }
		.supplemental-amounts { align-items: center; }
		.supplemental-amounts .paper-item-number { padding: 0; }
		.supplemental-amounts .amount-control :global(label) {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
	}
	@container paper-form (width < 52rem) {
		.mixed-schedules .corporate-columns { display: none; }
		.relief-regime-header + .corporate-row { border-block-start: 1px solid var(--border-soft); }
		.mixed-schedules :is(.grouped-amounts, .inline-entry.multiple-amounts, .aligned-income-item .amount-row) {
			grid-template-columns: minmax(0, 1fr);
			align-items: start;
		}
		.mixed-schedules :is(.amount-controls, .inline-entry-amounts, .aligned-income-item .entry-amounts) {
			grid-template-columns: minmax(0, 1fr);
			row-gap: .5rem;
		}
		.mixed-schedules .amount-control { grid-column: 1; }
		.mixed-schedules .amount-control:empty { display: none; }
		.mixed-schedules .grouped-amounts .amount-caption > span { font-weight: 650; }
		.mixed-schedules .grouped-amounts .amount-controls.label-columns :global([data-slot='calculated-value']) {
			grid-template-columns: minmax(0, 1fr) fit-content(60%);
		}
		.mixed-schedules .grouped-amounts .amount-controls.label-columns:not(.required) .amount-control:not(.standalone) :global(label),
		.mixed-schedules .grouped-amounts .amount-controls.label-columns .amount-control:not(.standalone) :global(.value-label),
		.mixed-schedules .aligned-income-item .entry-amount-label {
			position: static;
			width: auto;
			height: auto;
			padding: 0;
			margin: 0;
			overflow: visible;
			clip-path: none;
			white-space: normal;
		}
		.mixed-schedules .aligned-income-item .entry-amount { display: flex; justify-content: space-between; gap: .5rem; }
	}
	@container paper-form (52rem <= width < 68rem) {
		.mixed-schedules .amount-row:not(:has(.amount-controls.single)),
		.mixed-schedules .inline-entry.multiple-amounts { grid-template-columns: minmax(0, 1fr); }
		.mixed-schedules .corporate-section > .corporate-columns {
			width: auto;
			margin-inline-start: calc(var(--corporate-row-inset) + var(--corporate-item-width) + .5rem);
		}
	}
	@container paper-form (width >= 68rem) {
		.section-labeled-amounts .inline-entry-amounts {
			padding-block-start: calc(var(--form-label-line-height) + var(--form-label-gap));
		}
		.mixed-schedules .corporate-section > .corporate-columns {
			width: min(
				calc((100% - 2 * var(--corporate-row-inset) - var(--corporate-item-width) - .5rem) * var(--schedule-amount-share)),
				var(--schedule-amount-width)
			);
		}
	}
	.legacy-exempt-identification .field-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}
	.legacy-exempt-cover {
		--exempt-amount-width: 14rem;
		--exempt-item-gutter: 2.5rem;
	}
	.legacy-exempt-cover .background [data-corporate-item='15'] :global([data-slot='calculated-value']) {
		grid-template-columns: minmax(0, 1fr);
		gap: .25rem;
	}
	.legacy-exempt-cover .background [data-corporate-item='15'] :global(output) { text-align: start; }
	.legacy-exempt-cover .background [data-corporate-item='17'] :global(label) { display: block; }
	.legacy-exempt-identification .eq-section-header { background: transparent; }
	.legacy-exempt-identification :global(legend > [aria-hidden='true']) { margin-inline-start: .25rem; }
	.legacy-exempt-identification .identification-date .field-row { inline-size: min(100%, 15rem); }
	.legacy-exempt-identification .identification-amount .field-row { inline-size: min(100%, var(--exempt-amount-width)); }
	@container paper-form (min-width: 36rem) {
		.legacy-exempt-identification .identification-type .field-row {
			grid-template-columns: minmax(0, 23rem) minmax(0, 16rem);
			align-items: start;
		}
	}
	@container paper-form (min-width: 42rem) {
		.legacy-exempt-totals .corporate-row { align-items: center; }
		.legacy-exempt-totals .paper-item-number { padding-block-start: 0; }
		.legacy-exempt-totals .amount-caption:has(.schedule-reference) {
			display: flex;
			flex-wrap: wrap;
			align-items: baseline;
			gap: .25rem .75rem;
		}
	}
	@container paper-form (min-width: 48rem) {
		.legacy-exempt-cover .background [data-corporate-item='19'] .field-row {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 15rem));
		}
	}
	@container paper-form (min-width: 52rem) {
		.legacy-exempt-totals .amount-row { grid-template-columns: minmax(0, 1fr) var(--exempt-amount-width); }
		.legacy-exempt-totals .amount-controls.single { inline-size: 100%; }
		.legacy-exempt-identification .corporate-rows {
			display: grid;
			grid-template-columns: minmax(0, 1fr)
				calc(var(--exempt-amount-width) + var(--exempt-item-gutter) + 2 * var(--corporate-row-inset));
		}
		.legacy-exempt-identification .corporate-row { align-items: start; }
		.legacy-exempt-identification .identification-date { border-block-start: 0; }
		.legacy-exempt-identification .identification-place .field-row { inline-size: min(100%, 30rem); }
	}
	@container paper-form (max-width: 26rem) {
		.amount-controls { grid-template-columns: minmax(0, 1fr); }
		.amount-control { grid-column: 1; }
		.amount-control:empty { display: none; }
		.corporate-columns { display: none; }
		.grouped-amounts .amount-controls { row-gap: .5rem; }
		.grouped-amounts .amount-caption > span { font-weight: 650; }
		.aligned-income-item .entry-amounts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	}
</style>
