<script lang="ts">
	import AccreditationNumberInput from './accreditation-number-input.svelte';
	import { corporateBackgroundCell, corporateBackgroundRows } from './background-layout';
	import { legacyExemptIdentificationFields, legacyExemptIdentificationPatch } from './exempt';
	import { legacyMixedIdentificationFields } from './mixed/identification';
	import { corporateScheduleReferences } from './schedule-references';
	import { Sheet } from '$lib/components/ui/sheet';
	import { corporateLists, ownerListLabel, type CorporateEntry, type CorporateList } from './editor-lists';
	import { tick } from 'svelte';
	import { Button, ButtonLink, CalculatedValue, CheckboxInput, CurrencyInput, DateInput, FieldErrors, Input, NumberInput, RadioGroup, Select, TinInput } from '$lib/components/ui';
	import { splitTinSegments } from '$lib/components/ui/tin-input/tin';
	import { formatCurrencyInput } from '$lib/components/ui/currency-input/currency';
	import Icon from '$lib/components/ui/icon/icon.svelte';
	import { glyphs } from '$lib/components/ui/icons';
	import { calculateCorporateIncome, corporateAttachmentInstances, corporateEditorPages, corporateFieldRequired, corporateReturnPeriod, validateCorporateIncome } from '.';
	import AtcPicker from '../atc-picker.svelte';
	import PaperFormHeader from '../paper-form-header.svelte';
	import ReturnPagination from '../return-pagination.svelte';
	import type { CorporateField, CorporateForm, CorporateRow, CorporateSection, CorporateValues } from './types';
	import '../form-editor-layout.css';

	let { form, values, errors, taxpayerHref, onvaluechange }: {
		form: CorporateForm;
		values: CorporateValues;
		errors: CorporateValues;
		taxpayerHref: string;
		onvaluechange: (patch: CorporateValues) => void;
	} = $props();

	let selectedPage = $state('1');
	let editing = $state.raw<CorporateEntry>();
	let editingList = $state.raw<CorporateList>();
	let draft = $state<CorporateValues>({});
	let editErrors = $state<CorporateValues>({});
	let trigger: HTMLElement | undefined;
	let adding = $state(false);
	const headingId = $props.id();
	const incomeCounterId = 'Pg4S3I3PopLength';
	const legacyExempt = $derived(form.code === '1702EX');
	const legacyIdentification = $derived(legacyExempt || form.code === '1702MX');
	const identificationFields = $derived(form.code === '1702MX' ? legacyMixedIdentificationFields : legacyExemptIdentificationFields);
	const calculated = $derived(calculateCorporateIncome(form, values));
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
	const current = $derived(Number(selectedPage) <= pages.length ? selectedPage : '1');
	const legacyExemptCover = $derived(legacyExempt && current === '1');
	const active = $derived(allPages[Number(current) - 1] ?? allPages[0]);
	const decimals = $derived(form.decimals ?? 2);
	const number = $derived(form.code.replace(/v\d+C?$/, '').replace(/1702(EX|MX|RT)/, '1702-$1'));
	const title = $derived(form.quarter ? 'Quarterly Income Tax Return' : 'Annual Income Tax Return');
	const subtitle = $derived(form.title.replace(/^.*?income tax return\s*/i, '').replace(/^for\s+/i, 'For '));

	function shortTitle(title: string) {
		return title.replace(/\s+/g, ' ').replace(/\s*\((?:attach|to |from |do not|if applicable)[^)]*\)/gi, '').trim();
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
		adding = !!counter;
		editErrors = {};
		draft = Object.fromEntries(editableFields(entry).map(field => [field.id, source[field.id] ?? field.defaultValue ?? '']));
		if (counter) draft[counter.id] = source[counter.id];
		editing = entry;
		void focusEntryField(focusId ?? editableFields(entry)[0]?.id);
	}

	function openListEntry(list: CorporateList, entry: CorporateEntry, control?: HTMLElement, isNew = false, focusId?: string) {
		openEntry(entry, calculated, control, undefined, focusId);
		editingList = list;
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
	}

	function removeEntry(list: CorporateList, index: number, restoreFocus = true) {
		const counter = list.counter;
		if (!counter) return;
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
		onvaluechange(patch);
		if (restoreFocus) void tick().then(() => document.getElementById(listAnchor(counter.id))?.focus());
	}

	function deleteListEntry() {
		const list = editingList;
		const entry = editing;
		if (!list || !entry) return;
		if (entry.rows[0].entry) {
			removeEntry(list, list.entries.indexOf(entry), false);
		} else {
			onvaluechange(Object.fromEntries(editableFields(entry).map(field => [field.id, ''])));
		}
		trigger = document.getElementById(`${listAnchor(list.counter?.id ?? list.entries[0]?.rows[0].fields[0].id)}-add`) ?? undefined;
		closeEntry();
	}

	function entryHasValues(entry: CorporateEntry) {
		return entryFields(entry).some(field => {
			const value = calculated[field.id]?.trim();
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
		onvaluechange(draft);
		closeEntry();
	}

	function applies(field: CorporateField) {
		return field.id !== form.pagesFiledField && (form.fieldApplies?.(field.id, calculated) ?? true);
	}

	function hasVisibleFields(section: CorporateSection) {
		return section.rows.some(row => row.fields.some(applies));
	}

	function change(id: string, value: string) {
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
		return legacyExempt ? fields.filter(field => /I49BIRAccreditedNoC[1-4]$/.test(field.id)) : [];
	}

	function writeTin(fields: CorporateField[], value: string) {
		const segments = splitTinSegments(value);
		onvaluechange(Object.fromEntries(fields.map((field, index) => [field.id, segments[index] ?? ''])));
	}

	async function showPage(id: string) {
		selectedPage = id;
		await tick();
		const heading = document.getElementById(headingId);
		heading?.focus({ preventScroll: true });
		heading?.scrollIntoView({ block: 'start', behavior: 'instant' });
	}

	export async function revealField(id: string) {
		const index = allPages.findIndex(page => page.sections.some(section => section.rows.some(row =>
			row.fields.some(field => field.id === id))));
		if (index !== -1) selectedPage = String(index + 1);
		await tick();
		const section = allPages[index]?.sections.find(section => section.rows.some(row => row.fields.some(field => field.id === id)));
		const row = section?.rows.find(row => row.fields.some(field => field.id === id));
		if (!row && /:total(?:EX|SP)Attach$/.test(id)) return `${headingId}-section-activities`;
		if (section && row) {
			for (const [anchor, list] of corporateLists(section)) {
				if (list.counter?.id === id) return listAnchor(id);
				const entry = list.entries.find(entry => entry.rows.includes(row));
				if (entry && editableFields(entry).some(field => field.id === id)) {
					const tin = tinFields(row.fields);
					const target = tin.some(field => field.id === id) ? tin[0].id : id;
					const control = document.getElementById(listAnchor(list.counter?.id ?? anchor.fields[0].id)) ?? undefined;
					openListEntry(list, entry, control, false, target);
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

{#snippet control(field: CorporateField, fallback: string, column?: string, row?: CorporateRow, inSheet = false)}
	{@const id = field.id}
	{@const baseLabel = field.label && field.label !== column ? field.label : fallback}
	{@const source = inSheet ? { ...calculated, ...draft } : calculated}
	{@const certificate = source[identificationFields.type]}
	{@const ctc = certificate === 'CTC'}
	{@const legacyNumber = legacyIdentification && id === identificationFields.number}
	{@const legacyCertificateAmount = legacyIdentification && id === identificationFields.amount}
	{@const label = id === form.year ? 'Year ended' : id === form.month ? 'Year-end month'
		: legacyNumber && ctc ? 'CTC number'
		: legacyNumber && certificate === identificationFields.registration ? 'SEC registration number'
		: column && !baseLabel.includes(column) ? `${baseLabel} · ${column}` : baseLabel}
	{@const value = source[id] ?? field.defaultValue ?? ''}
	{@const error = (inSheet ? editErrors : errors)[id] ?? ''}
	{@const newIncomeDescription = inSheet && editingList?.counter?.id === incomeCounterId && adding && field.kind === 'text'}
	{@const required = legacyNumber ? ctc || certificate === identificationFields.registration
		: legacyCertificateAmount ? ctc : !!newIncomeDescription || corporateFieldRequired(form, field, source, row)}
	{@const write = inSheet ? (key: string, next: string) => { draft[key] = next; } : change}
	{#if field.profileKey}
		{@render managedValue(id, label, display(field, value), error, ['rdoCode', 'zipCode', 'contactNumber', 'birthDate', 'psicCode', 'psocCode'].includes(field.profileKey))}
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
		<AtcPicker {id} {label} {value} {error} {required} category="P" formCode={form.code} fieldOptions={field.options}
			allowCustom={false} onchange={(next) => write(id, next)} />
	{:else if field.options}
		<Select {id} {label} {value} options={field.options} {error} {required} onchange={(next) => write(id, next)} />
	{:else if field.kind === 'money'}
		<CurrencyInput {id} {label} value={legacyCertificateAmount && !ctc ? '' : value} {decimals} {error} {required}
			disabled={legacyCertificateAmount && !ctc} allowNegative={!legacyCertificateAmount}
			data-taxmate-agent-currency={legacyCertificateAmount ? undefined : 'signed'} onchange={(next) => write(id, next)} />
	{:else if field.kind === 'integer' || field.kind === 'percent'}
		<NumberInput {id} {label} {value} {error} {required} min={0} max={field.kind === 'percent' ? 100 : undefined}
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
		<Input {id} {label} {value} {error} {required} inputmode="text" maxlength={field.maxLength} oninput={(event) => write(id, event.currentTarget.value)} />
	{/if}
{/snippet}

{#snippet managedValue(id: string, label: string, value: string, error: string | undefined, monospace: boolean)}
	<div class="managed-value" class:monospace>
		<CalculatedValue {id} {label} {value} {error} />
	</div>
{/snippet}

{#snippet percentUnit()}<span class="percent-unit" aria-hidden="true">%</span>{/snippet}

<div class={['paper-sheet corporate-editor', legacyExemptCover && 'legacy-exempt-cover']} style:--exempt-amount-width={legacyIdentification ? '14rem' : undefined} style:--exempt-item-gutter={legacyIdentification ? '2.5rem' : undefined} role="region" aria-label={form.title}>
	<PaperFormHeader {number} revision={form.revision} {title} {subtitle} />
	<div class="page-context">
		<h2 id={headingId} tabindex="-1">{pages[Number(current) - 1].title}</h2>
		<p>{corporateReturnPeriod(form, values)}</p>
	</div>
	{#each active.sections as section, index (index)}
		{#if hasVisibleFields(section)}
			{@const lists = corporateLists(section)}
			{@const filing = current === '1' && /^filing information$/i.test(section.title)}
			{@const mixedFiling = current === '1' && section.title === 'Taxpayer and filing information'}
			{@const exemptIdentification = legacyIdentification && current === '1' && section.title === 'Filing identification'}
			{@const managed = current === '1' && section.rows.some(row => row.fields.some(field => field.profileKey))}
			{@const background = managed && /background information/i.test(section.title)}
			{@const annualTaxSummary = current === '1' && !form.quarter && /total tax payable/i.test(section.title)}
			<section class={['corporate-section', { filing, background, 'annual-background': background && !form.quarter,
				'quarterly-filing': filing && !!form.quarter, 'mixed-filing': mixedFiling,
				'legacy-exempt-totals': legacyIdentification && current === '1' && section.title.startsWith('Part II - Total Tax Payable'),
				'legacy-exempt-identification': exemptIdentification
			}]} aria-label={section.title || active.title}>
				{#if section.title}
					<header class="eq-section-header">
						<h3 id={`${headingId}-section-${index}`} tabindex="-1">{shortTitle(section.title)}</h3>
						{#if managed}
							<ButtonLink href={taxpayerHref} variant="ghost" size="icon" aria-label="Edit taxpayer information" title="Edit taxpayer information">
								<span class="edit-icon"><Icon icon={glyphs.pencil} /></span>
							</ButtonLink>
						{/if}
					</header>
				{/if}
				{#if section.columns?.length}
					<div class="corporate-columns" style:--column-count={section.columns.length}>
						{#each section.columns as column, columnIndex (columnIndex)}
							<span>{column}</span>
						{/each}
					</div>
				{/if}
				<div class="corporate-rows">
					{#each background ? corporateBackgroundRows(form, section.rows) : section.rows as row, rowIndex (rowIndex)}
						{@const list = lists.get(row)}
						{@const visible = row.fields.filter(field => !field.repeatable && applies(field))}
						{@const hiddenEntry = row.entry || row.list || (list && list.entries.some(entry => entry.rows.includes(row)))}
						{@const labelColumns = !!section.columns?.length && visible.every(field => field.column !== undefined)}
						{@const tin = tinFields(visible)}
						{@const accreditation = accreditationFields(visible)}
						{@const periodEnd = visible.some(field => field.id === form.year) && visible.some(field => field.id === form.month)}
						{@const wide = visible.some(field => field.id === form.quarter)}
						{@const atcChoice = visible.some(field => /ATC|alphanumeric tax code/i.test(field.label ?? field.id))}
						{@const columnRow = !!section.columns?.length && visible.some(field => field.column !== undefined)}
						{#if visible.length && !hiddenEntry}
							<div class={['corporate-row', background && corporateBackgroundCell(row), {
								wide, 'period-end': periodEnd, 'atc-choice': atcChoice, total: visible.some(field => field.id === form.amount),
								'signatory-row': annualTaxSummary && visible.some(field =>
									/signature|signatory|authorizedrepresentative|treasurer|pagesfilled|numberofpagesfiled/i.test(field.id)),
								'certificate-row': annualTaxSummary && visible.some(field =>
									/pg1pt2i(?:22(?:ctc)?|23date|24placeofissue|25amountctc)$/i.test(field.id)),
								'identification-type': exemptIdentification && visible.some(field => field.id === identificationFields.type),
								'identification-date': exemptIdentification && visible.some(field => field.id === identificationFields.issueDate),
								'identification-place': exemptIdentification && visible.some(field => field.id === identificationFields.issuePlace),
								'identification-amount': exemptIdentification && visible.some(field => field.id === identificationFields.amount),
								'managed-cell': background && visible.every(field => field.profileKey) && (visible.length === 1 || tin.length === visible.length)
							}]}
								data-corporate-item={row.item}>
								{#if row.item}<span class="paper-item-number" aria-hidden="true">{row.item}</span>{/if}
								{#if accreditation.length}
									<div class="accreditation-row">
										<AccreditationNumberInput fields={accreditation} values={calculated} {errors} {onvaluechange} />
										{#each visible.filter(field => !accreditation.includes(field)) as field (field.id)}
											{@render control(field, row.label, undefined, row)}
										{/each}
									</div>
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
								{:else if columnRow || (!exemptIdentification && visible.every(field => field.kind === 'money' || field.kind === 'percent'))}
									<div class="amount-row">
										<div class="amount-caption">
											<span>{row.label}</span>
											{#each visible.flatMap(field => references.get(field.id) ?? []) as reference (reference.target + reference.label)}
												<button type="button" class="schedule-reference" data-reference-target={reference.target}
													data-reference-page={reference.page} onclick={() => void followReference(reference.target)}>
													{reference.label}
												</button>
											{/each}
										</div>
										<div class={['amount-controls', { single: !section.columns?.length && visible.length === 1,
												'label-columns': labelColumns, required: visible.some(field => corporateFieldRequired(form, field, calculated, row)) }]} style:--column-count={section.columns?.length || visible.length}>
											{#each row.fields.filter(field => !field.repeatable && (section.columns?.length || applies(field))) as field, columnIndex (field.id)}
												<div class={['amount-control', { standalone: columnRow && field.column === undefined }]} style:--amount-column={field.column}>
													{#if applies(field)}
														{@render control(field, row.label, columnRow && field.column === undefined ? undefined : section.columns?.[(field.column ?? columnIndex + 1) - 1], row)}
													{/if}
												</div>
											{/each}
										</div>
									</div>
								{:else}
									<div class="field-row">
										{#each visible as field (field.id)}
											<div class={['field-control', { 'numeric-short': field.kind === 'integer' && (field.id === form.year || (field.maxLength ?? 8) <= 4) }]}>
												{@render control(field, row.label, undefined, row)}
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/if}
						{#if list}
							{@const counter = list.counter}
							{@const income = counter?.id === incomeCounterId}
							{@const owners = list.label === ownerListLabel}
							{@const editable = list.entries.filter(entry => editableFields(entry).length > 0)}
							{@const entries = editable.filter(entry => entry.rows[0].entry || entryHasValues(entry))}
							{@const emptyEntry = editable.find(entry => !entries.includes(entry) &&
								(!entryFields(entry).some(field => field.kind === 'money') || editableFields(entry).some(field => field.kind === 'money')))}
							{@const fixed = !counter || counter.repeatable?.fixed}
							{@const sourceSlots = list.entries.filter(entry => !entry.rows[0].entry).length}
							{@const limit = fixed ? sourceSlots : counter.repeatable!.limit + sourceSlots
								- (counter.repeatable!.rollup || counter.repeatable!.seedFrom ? 1 : 0)}
							{@const anchor = listAnchor(counter?.id ?? row.fields[0].id)}
							<div class="line-list income-list"
								id={`${headingId}-section-${index}-list-${Array.from(lists.keys()).indexOf(row)}`} tabindex="-1">
								<div class="line-list-header">
									<h4 id={anchor} tabindex="-1">
										{list.label}<span class="income-count">{` (${entries.length}/${limit})`}</span>
									</h4>
									<Button id={`${anchor}-add`} size="sm" variant="secondary"
										disabled={fixed ? !emptyEntry || entries.length >= limit
											: !emptyEntry && Number(calculated[counter!.id] || 0) >= counter!.repeatable!.limit}
										onclick={(event) => emptyEntry ? openListEntry(list, emptyEntry, event.currentTarget, true)
											: counter && addEntry(index, counter, event.currentTarget)}>
										Add item
									</Button>
								</div>
								{#if counter && errors[counter.id]}<FieldErrors errors={[errors[counter.id]]} />{/if}
								{#if entries.length}
									<ul aria-label={`${list.label} line items`}>
										{#each entries as entry (entry.rows[0].fields[0].id)}
											{@const fields = entryFields(entry)}
											{@const description = fields.find(field => (field.kind === 'text' || field.kind === 'integer') && !/tin|legal|basis/i.test(field.label ?? field.id))}
											{@const amounts = fields.filter(field => field.kind === 'money' || field.kind === 'percent')}
											<li class="income-item">
												<span class="entry-number">{entry.item}</span>
												<button type="button" class="income-description" onclick={(event) => openListEntry(list, entry, event.currentTarget)}>
													{(description && calculated[description.id]?.trim()) || `Item ${entry.item || entries.indexOf(entry) + 1}`}
												</button>
												<div class="entry-values entry-amounts">
													{#each amounts as field (field.id)}
														<span class="entry-amount" title={field.label}>
															{#if amounts.length > 1}<span class="entry-amount-label">{field.label}</span>{/if}
															<span class="font-mono">{display(field, calculated[field.id] ?? '') || '0'}</span>
														</span>
													{/each}
												</div>
											</li>
										{/each}
									</ul>
								{:else}
									<p class="schedule-empty-message">{income ? 'No income items added' : owners ? 'No owners entered' : 'No items added'}</p>
								{/if}
							</div>
						{/if}
					{/each}
				</div>
			</section>
		{/if}
	{/each}
	{#if form.attachmentGroups?.some(group => group.applies(calculated))}
		<section class="corporate-section attachments" aria-label="Activity attachments">
			<header class="eq-section-header"><h3 id={`${headingId}-section-activities`} tabindex="-1">Activity attachments</h3></header>
			{#each form.attachmentGroups.filter(group => group.applies(calculated)) as group (group.key)}
				{@const instances = attachments.filter(attachment => attachment.group.key === group.key)}
				{@const count = instances.length}
				<div class="attachment-actions">
					<span>{group.label}</span>
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
			{/each}
		</section>
	{/if}
	<ReturnPagination {pages} {current} onchange={showPage} />
</div>

<Sheet bind:open={() => !!editing, (open) => { if (!open) closeEntry(); }}
	title={editingList ? (editingList.counter?.id === incomeCounterId ? (adding ? 'Add income item' : 'Edit income item') : adding ? 'Add item' : 'Edit item')
		: editing ? (adding ? 'Add entry' : `Edit item ${editing.item}`) : ''}
	context={editingList?.label ?? editing?.rows[0]?.label}>
	{#if editing}
		<div class="entry-editor">
			{#each editing.rows as row (row.fields[0].id)}
				{@const fields = editableFields(editing).filter(field => row.fields.includes(field))}
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
			{#if editingList && !adding}
				<Button variant="danger" data-agent-confirm="delete" onclick={deleteListEntry}>Delete item</Button>
			{/if}
			<Button variant="secondary" onclick={closeEntry}>Cancel</Button>
			<Button onclick={saveEntry}>{adding ? 'Add item' : 'Update'}</Button>
		</div>
	{/snippet}
</Sheet>

<style>
	.corporate-editor {
		--corporate-row-inset: .875rem;
		--corporate-item-width: 2rem;
	}
	.entry-number { font-family: var(--font-mono); color: var(--fg-muted); font-size: var(--form-label-size); font-weight: 500; font-variant-numeric: tabular-nums; }
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
	.income-count { font-family: var(--font-mono); color: var(--fg-muted); font-variant-numeric: tabular-nums; }
	.income-list ul { margin: 0; border: 0; border-radius: 0; }
	.income-list .income-item {
		grid-template-columns: var(--corporate-item-width) minmax(0, 1fr) auto;
		padding: .125rem var(--corporate-row-inset);
		border-block-start: 1px solid var(--border-soft);
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
	.background .corporate-row:has(.paper-item-number) { grid-template-columns: 1.1rem minmax(0, 1fr); }
	.background .paper-item-number { padding-top: 0; }
	.background .managed-cell:has(.paper-item-number) { grid-template-columns: minmax(0, 1fr); }
	.background .managed-cell:has(.paper-item-number) > * { grid-area: 1 / 1; }
	.background .managed-cell .paper-item-number { font-size: .75rem; }
	.background .managed-cell .paper-item-number ~ * :global(.value-label) { padding-inline-start: 1.2rem; }
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
	.corporate-row { display: grid; grid-template-columns: minmax(0, 1fr); gap: .5rem; padding: .5rem var(--corporate-row-inset); }
	.corporate-row:has(.paper-item-number) { grid-template-columns: var(--corporate-item-width) minmax(0, 1fr); }
	.corporate-row + .corporate-row, .line-list + .corporate-row { border-block-start: 1px solid var(--border-soft); }
	.corporate-row.total { font-weight: 650; }
	.corporate-row.signatory-row + .corporate-row.signatory-row,
	.corporate-row.certificate-row + .corporate-row.certificate-row { border-block-start: 0; }
	.paper-item-number { padding-top: .125rem; }
	.field-row, .profile-row, .amount-controls { display: grid; gap: var(--form-field-column-gap); }
	.accreditation-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--form-field-column-gap);
	}
	@container paper-form (min-width: 42rem) {
		.accreditation-row {
			grid-template-columns: minmax(0, 2fr) repeat(2, minmax(0, 1fr));
			align-items: start;
		}
	}
	.profile-row > :global(*), .field-control, .amount-control { min-width: 0; max-width: 100%; }
	.field-control.numeric-short { max-width: 10rem; }
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
	.amount-row { display: grid; gap: .375rem 1rem; min-width: 0; font-size: var(--form-label-size); align-items: center; }
	.amount-caption:not(:has(.schedule-reference)), .amount-caption > span { display: none; }
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
	.managed-value :global([data-slot='calculated-value']) { grid-template-columns: minmax(0, 1fr); gap: .25rem; }
	.managed-value :global(.value-label) { font: inherit; font-size: .75rem; }
	.managed-value :global(output) { font-family: inherit; font-weight: inherit; line-height: inherit; font-size: .875rem; text-align: start; }
	.managed-value.monospace :global(output) { font-family: var(--font-mono); }
	.edit-icon { display: inline-flex; width: 1rem; height: 1rem; align-items: center; justify-content: center; }
	.edit-icon :global(svg) { width: 100%; height: 100%; }
	.percent-unit { color: var(--fg-muted); }
	.corporate-columns { margin-inline: var(--corporate-row-inset); padding-block: .5rem; }
	@container paper-form (min-width: 48rem) {
		.filing .corporate-rows { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); }
		.filing .corporate-row { grid-column: span 3; padding: .625rem .875rem; border-top: 0; border-inline-end: 1px solid var(--border-soft); box-shadow: inset 0 -1px var(--border-soft); }
		.filing .corporate-row.wide { grid-column: span 6; }
		.filing .corporate-row.atc-choice { grid-column: 1 / -1; }
		.quarterly-filing .corporate-row.atc-choice { grid-column: span 9; }
		.filing:not(.quarterly-filing) .corporate-row:nth-child(4),
		.filing .corporate-row.atc-choice,
		.quarterly-filing .corporate-row.wide { border-inline-end: 0; }
		.filing .corporate-row:last-child,
		.quarterly-filing .corporate-row.wide ~ .corporate-row { box-shadow: none; }
		.filing .period-end .field-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: .5rem; }
	}
	@container paper-form (min-width: 42rem) {
		.profile-row { grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr)); }
		.field-row { display: flex; flex-wrap: wrap; }
		.field-control { flex: 1 1 11rem; }
		.amount-row { grid-template-columns: minmax(0, 1fr) min(55%, 32rem); }
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
		.corporate-columns { width: min(calc((100% - 2.5rem) * .55), 32rem); margin-inline-start: auto; }
	}
	.mixed-filing .period-end .field-row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 9rem));
	}
	.mixed-filing .atc-choice .field-row {
		display: grid;
		grid-template-columns: minmax(0, 24rem);
	}
	@container paper-form (min-width: 36rem) {
		.mixed-filing .atc-choice .field-row {
			grid-template-columns: minmax(0, 24rem) minmax(0, 1fr);
		}
		.mixed-filing .atc-choice .field-control:first-child { grid-column: 1 / -1; }
	}
	.legacy-exempt-identification .field-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}
	.legacy-exempt-cover {
		--exempt-amount-width: 14rem;
		--exempt-item-gutter: 2.5rem;
	}
	.legacy-exempt-cover .background .managed-cell .paper-item-number ~ * :global(.value-label) {
		padding-inline-start: 1.5rem;
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
	@container paper-form (20rem <= width < 48rem) {
		.legacy-exempt-cover .filing .corporate-rows {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.legacy-exempt-cover .filing .corporate-row { padding-inline: .625rem; }
		.legacy-exempt-cover .filing .corporate-row:nth-child(2) { border-block-start: 0; }
		.legacy-exempt-cover .filing .corporate-row.atc-choice { grid-column: 1 / -1; }
	}
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
		.legacy-exempt-cover .background .corporate-rows {
			display: grid;
			grid-template-columns: repeat(12, minmax(0, 1fr));
		}
		.legacy-exempt-cover .background .corporate-row { grid-column: span 4; }
		.legacy-exempt-cover .background :is([data-corporate-item='6'], [data-corporate-item='9'], [data-corporate-item='10'], [data-corporate-item='19']) {
			grid-column: span 8;
		}
		.legacy-exempt-cover .background [data-corporate-item='12'] { grid-column: span 6; }
		.legacy-exempt-cover .background [data-corporate-item='14'] { grid-column: span 2; }
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
	}
</style>
