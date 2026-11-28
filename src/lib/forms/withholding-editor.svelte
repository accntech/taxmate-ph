<script lang="ts">
	import { tick } from 'svelte';
	import type { TaxpayerProfile } from '$lib/profiles/profile';
	import PaperFormHeader from './paper-form-header.svelte';
	import ReturnPagination from './return-pagination.svelte';
	import { getReturnPage, selectReturnPage } from './return-page-navigation';
	import ReturnRecord from './return-record.svelte';
	import ReturnTaxpayerInformation from './return-taxpayer-information.svelte';
	import { compareFormItems, getWithholdingPaperLayout, getWithholdingSupportingPages } from './withholding-paper-layout';
	import AtcPicker from './atc-picker.svelte';
	import { Button, CalculatedValue, CurrencyInput, DateInput, Input, NumberInput, RadioGroup, Select, TinInput } from '$lib/components/ui';
	import MonthYearInput from '$lib/components/ui/month-year-input/month-year-input.svelte';
	import { commitCurrencyInput, normalizeCurrencyInput } from '$lib/components/ui/currency-input/currency';
	import { withholdingPriorRemittanceFields, withholdingSchedules, withholdingSchedulesEnabled, type WithholdingDefinition, type WithholdingField, type WithholdingSchedule } from './withholding-definitions';
	import { calculateWithholding, hasConflictingInstallmentPrices } from './withholding-rules';
	import ScheduleItems from './schedule-items.svelte';
	import './withholding-layout.css';
	import './form-editor-layout.css';

	let { definition, values, errors = {}, onvaluechange, profile, taxpayerHref }: {
		definition: WithholdingDefinition;
		values: Record<string, string>;
		errors?: Record<string, string>;
		onvaluechange: (patch: Record<string, string>) => void;
		profile: TaxpayerProfile;
		taxpayerHref: string;
	} = $props();
	const calculated = $derived(calculateWithholding(definition.code, values));
	const schedulesEnabled = $derived(withholdingSchedulesEnabled(definition, values));
	const schedules = $derived(schedulesEnabled ? withholdingSchedules(definition, values) : []);
	const layout = $derived(getWithholdingPaperLayout(definition.code));
	const supporting = $derived(getWithholdingSupportingPages(definition.code).map((page, index) => ({
		...page, id: String(index + 2)
	})));
	const pages = $derived([{ id: '1', title: 'Taxpayer details and return summary' }, ...supporting]);
	const primarySchedules = $derived(schedules.filter(schedule =>
		!supporting.some(page => 'schedules' in page && page.schedules.includes(schedule.id))
	));
	const selectedPage = $derived(getReturnPage());
	const current = $derived(pages.find(item => item.id === selectedPage)?.id ?? '1');
	let heading = $state<HTMLHeadingElement>();
	const headingId = $props.id();
	const annual = $derived(definition.period === 'year');
	const propertyReturn = $derived(definition.code === '1606');
	const installmentSale = $derived(propertyReturn && values['frm1606:transactionType'] === 'Installment sale');
	const conflictingSellingPrices = $derived(propertyReturn && hasConflictingInstallmentPrices(values));
	const sectionFields = $derived(definition.sections.flatMap(section => section.fields));
	const byName = $derived(Object.fromEntries(sectionFields.map(field => [shortName(field), field])));
	const periodGroups = $derived(Object.entries(layout.period).reduce<{ item: string; fields: WithholdingField[] }[]>((groups, [name, item]) => {
		const field = byName[name];
		if (!field || !visible(field)) return groups;
		const last = groups.at(-1);
		if (last?.item === item) last.fields.push(field);
		else groups.push({ item, fields: [field] });
		return groups;
	}, []));
	const backgroundItems = $derived([
		...Object.entries(layout.background).flatMap(([name, item]) => {
			const field = byName[name];
			return field && visible(field) ? [{ id: field.id, item }] : [];
		}),
		...(layout.fixedAtc && !layout.fixedAtc.inPeriod ? [{ id: 'fixed-atc', item: layout.fixedAtc.item }] : [])
	]);
	const propertyItems: Record<string, string> = {
		propertyType: '15', txtLocation: '16', propertyRdo: '16A', txtTCT: '17', txtArea: '17', txtTaxDC: '17',
		j_id394: '18', optRelief: '19', reliefDescription: '19', transactionType: '20', txtOthers20: '20',
		Habitual: '29', txtSurcharge: '35A', txtInterest: '35B', txtCompromise: '35C', txtTotalPenalties: '35D',
		overpaymentOption: ''
	};
	const propertyFields = $derived(propertyReturn ? [
		...definition.sections.find(section => section.id === 'property')!.fields.filter(field => shortName(field) !== 'Habitual'),
		byName.optRelief, byName.reliefDescription
	].filter(field => field && visible(field)).sort(byItem) : []);
	const propertyGroups = $derived(propertyFields.reduce<{ item: string; fields: WithholdingField[] }[]>((groups, field) => {
		const item = itemNumber(field);
		const previous = groups.at(-1);
		if (item && previous?.item === item) previous.fields.push(field);
		else groups.push({ item, fields: [field] });
		return groups;
	}, []));
	const propertyDetailItems = ['15', '16', '16A', '17', '18'];
	const propertyDetails = $derived(propertyGroups.filter(group => propertyDetailItems.includes(group.item)));
	const propertyLabel = $derived(values[byName.txtLocation?.id]?.trim() ||
		values[byName.txtTCT?.id]?.trim() ||
		(values[byName.propertyType?.id] && display(byName.propertyType, values[byName.propertyType.id])));
	let propertyRecord = $state<ReturnType<typeof ReturnRecord>>();
	const valuation = $derived(propertyReturn ? [
		...sectionFields.filter(field => /^(27|28)[A-E]/.test(field.label)).sort(byItem),
		byName.Habitual
	].filter(field => visible(field)) : []);
	const computation = $derived(definition.sections.find(section => section.id === 'computation')?.fields
		.filter(field => visible(field) && (!propertyReturn || !/^(27|28)[A-E]/.test(field.label)))
		.sort((a, b) => {
			const first = itemNumber(a);
			const second = itemNumber(b);
			return first && second ? compareFormItems(first, second) : Number(!first) - Number(!second);
		}) ?? []);
	const computationGroups = $derived(computation.reduce<{ item: string; fields: WithholdingField[] }[]>((groups, field) => {
		const item = itemNumber(field);
		const previous = groups.at(-1);
		if (item && previous?.item === item) previous.fields.push(field);
		else groups.push({ item, fields: [field] });
		return groups;
	}, []));
	const separateSchedules = $derived(primarySchedules.filter(schedule => !Object.hasOwn(layout.inlineSchedules ?? {}, schedule.id)));
	const fields = $derived([
		...definition.sections.flatMap(section => section.fields),
		...schedules.flatMap(schedule => [...schedule.rows.flatMap(row => row.fields), ...(schedule.totals ?? [])])
	]);
	const invalidAmounts = $derived(fields.some(field => field.type === 'money' && !field.readonly && visible(field) && normalizeMoney(values[field.id] ?? '', !!field.allowNegative) === null));
	const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

	async function showPage(id: string) {
		await selectReturnPage(id);
		await tick();
		heading?.focus({ preventScroll: true });
		heading?.scrollIntoView({ block: 'start', behavior: 'instant' });
	}

	export async function revealField(id: string) {
		const schedule = schedules.find(schedule => schedule.totals?.some(field => field.id === id) ||
			schedule.rows.some(row => row.fields.some(field => field.id === id)));
		const page = schedule && supporting.find(page => 'schedules' in page && page.schedules.includes(schedule.id));
		await selectReturnPage(page?.id ?? '1');
		await tick();
		if (propertyDetails.some(group => group.fields.some(field => field.id === id))) {
			await propertyRecord?.revealField(id);
		}
	}

	function shortName(field: WithholdingField) {
		return field.id.slice(definition.prefix.length);
	}
	function itemNumber(field: WithholdingField) {
		const name = shortName(field);
		if (propertyReturn && name in propertyItems) return propertyItems[name];
		if (name === 'txt20Other') return '20';
		if (name === 'txt29Other') return '29';
		return /^(\d+[A-Z]?)\s+/.exec(field.label)?.[1] ?? /^txt(?:Tax)?(\d+[A-Z]?)$/.exec(name)?.[1] ?? '';
	}
	function byItem(a: WithholdingField, b: WithholdingField) {
		return compareFormItems(itemNumber(a), itemNumber(b));
	}
	function hasTransactionDescription(transaction: string) {
		return transaction === 'Exempt' || transaction === 'Others';
	}
	function displayLabel(label: string) {
		return label.replace(/^\d+[A-Z]?(?:[.):-])?\s+/i, '');
	}
	function visible(field: WithholdingField) {
		if (propertyReturn && shortName(field) === 'txtOthers20' &&
			!hasTransactionDescription(values[definition.prefix + 'transactionType'])) return false;
		if (shortName(field) === 'overpaymentOption' && Number(calculated[definition.totalField]) >= 0) return false;
		return !field.showWhen || values[field.showWhen.field] === field.showWhen.value;
	}
	function applyChange(patch: Record<string, string>) {
		const disposition = definition.prefix + 'overpaymentOption';
		if (values[disposition] && !(disposition in patch) &&
			(Number(calculated[definition.totalField]) >= 0 ||
				Number(calculateWithholding(definition.code, { ...values, ...patch })[definition.totalField]) >= 0)) {
			patch = { ...patch, [disposition]: '' };
		}
		onvaluechange(patch);
	}
	function change(id: string, value: string) {
		const prior = withholdingPriorRemittanceFields[definition.code];
		const patch = { [id]: value };
		if (installmentSale && id === 'frm1606:txtGross' &&
			(!conflictingSellingPrices || value !== commitCurrencyInput(values[id] ?? ''))) {
			patch['frm1606:txtSelling'] = value;
		}
		if (id === definition.prefix + 'optAmend' && value === 'N' && prior) patch[definition.prefix + prior] = '';
		if (propertyReturn && id === definition.prefix + 'transactionType') {
			if (!hasTransactionDescription(value)) patch[definition.prefix + 'txtOthers20'] = '';
			for (const field of sectionFields) {
				if (field.showWhen?.field === id && field.showWhen.value !== value) patch[field.id] = '';
			}
		}
		applyChange(patch);
	}
	function normalizeMoney(value: string, allowNegative = false) {
		const trimmed = value.trim();
		if (allowNegative && trimmed.startsWith('-')) {
			const magnitude = normalizeCurrencyInput(trimmed.slice(1));
			return magnitude === null || magnitude === '' ? null : `-${magnitude}`;
		}
		return normalizeCurrencyInput(value);
	}
	function display(field: WithholdingField, value: string) {
		if (!value) return '—';
		if (field.type === 'money') {
			const normalized = normalizeMoney(value, !!field.allowNegative || !!field.readonly);
			return normalized === null ? '—' : currency.format(Number(normalized));
		}
		return field.options?.find(option => option.value === value)?.label ?? value;
	}
</script>

{#snippet control(field: WithholdingField, labelOverride?: string, source = values, write = change)}
	{@const label = labelOverride ?? displayLabel(field.label)}
	{#if visible(field)}
		{#if field.readonly}
			<CalculatedValue id={field.id} label={label} value={invalidAmounts && field.type === 'money' ? '' : display(field, calculated[field.id] ?? source[field.id] ?? '')} error={displayLabel(errors[field.id] ?? '')} />
		{:else if label === 'ATC'}
			<AtcPicker
				id={field.id}
				{label}
				formCode={definition.code}
				fieldOptions={field.options ?? []}
				category={source[definition.prefix + 'optCategory'] ?? ''}
				year={Number(source[definition.yearField])}
				month={definition.monthField ? Number(source[definition.monthField]) : undefined}
				required={field.required ?? false}
				value={source[field.id] ?? ''}
				error={displayLabel(errors[field.id] ?? '')}
				onchange={(value) => write(field.id, value)}
			/>
		{:else if propertyReturn && shortName(field) === 'sellerTin'}
			<div class="seller-tin-control">
				<TinInput id={field.id} label={label} required={field.required ?? false} value={source[field.id] ?? ''} error={errors[field.id] ?? ''} onchange={(value) => write(field.id, value)} />
			</div>
		{:else if propertyReturn && ['sellerRdo', 'propertyRdo'].includes(shortName(field))}
			<div class="property-rdo-control">
				<Input id={field.id} label={label} class="font-mono" maxlength={3} required={field.required ?? false} value={source[field.id] ?? ''} error={errors[field.id] ?? ''} oninput={(event) => write(field.id, event.currentTarget.value.toUpperCase())} />
			</div>
		{:else if field.type === 'money'}
			<CurrencyInput allowNegative={field.allowNegative} id={field.id} label={label} required={field.required ?? false}
				value={(installmentSale && field.id === 'frm1606:txtGross' ? calculated[field.id] : source[field.id]) ?? ''}
				error={displayLabel(errors[field.id] ?? '')} onchange={(value) => write(field.id, value)} />
		{:else if field.type === 'number'}
			<NumberInput id={field.id} label={label} required={field.required ?? false} value={source[field.id] ?? ''} error={displayLabel(errors[field.id] ?? '')}
				decimal={propertyReturn && shortName(field) === 'txtArea'} min={field.id === definition.yearField ? definition.minYear : 0}
				max={field.id === definition.yearField ? definition.maxYear : undefined} maxlength={field.id === definition.yearField ? 4 : undefined}
				onchange={(value) => write(field.id, value)} />
		{:else if field.type === 'select'}
			{#if shortName(field) === 'overpaymentOption'}
				<RadioGroup id={field.id} label={label} required options={field.options ?? []} value={source[field.id] ?? ''} error={errors[field.id] ?? ''} onchange={(value) => write(field.id, value)} />
			{:else if field.options?.length === 2 && field.options.every(option => ['Y', 'N'].includes(option.value))}
				<RadioGroup id={field.id} label={label} required={field.required ?? false} options={field.options} value={source[field.id] ?? ''} error={displayLabel(errors[field.id] ?? '')} onchange={(value) => write(field.id, value)} />
			{:else}
				<Select id={field.id} label={label} required={field.required ?? false} options={field.options ?? []} value={source[field.id] ?? ''} error={displayLabel(errors[field.id] ?? '')} onchange={(value) => write(field.id, value)} />
			{/if}
		{:else if field.type === 'date'}
			<DateInput id={field.id} label={label} required={field.required ?? false} value={source[field.id] ?? ''} error={displayLabel(errors[field.id] ?? '')} onchange={(value) => write(field.id, value)} />
		{:else}
			<Input id={field.id} label={label} class={/\b(?:code|TIN|number)\b/i.test(label) ? "font-mono" : undefined} required={field.required ?? false} value={source[field.id] ?? ''} error={displayLabel(errors[field.id] ?? '')} oninput={(event) => write(field.id, event.currentTarget.value)} />
		{/if}
	{/if}
{/snippet}

{#snippet scheduleEditor(schedule: WithholdingSchedule)}
	<ScheduleItems {definition} {schedule} {values} {errors} onchange={applyChange} printedRange={layout.scheduleItems?.[schedule.id]}>
		{#snippet totals()}
			{#if !annual && schedule.totals?.length}
				<div class="eq-field-grid wh-schedule-totals">
					{#each schedule.totals as field (field.id)}{@render control(field)}{/each}
				</div>
			{/if}
		{/snippet}
	</ScheduleItems>
{/snippet}

{#snippet numberedField(field: WithholdingField, row = false)}
	{@const item = itemNumber(field)}
	{@const label = displayLabel(field.label)}
	{@const result = row && field.readonly && field.type === 'money'}
	<div class={['form-paper-field', { numbered: item, 'form-paper-money': row && field.type === 'money', 'form-paper-total': result, 'final-total': row && field.id === definition.totalField }]}>
		{#if item}<span class="paper-item-number" aria-hidden="true">{item}</span>{/if}
		{#if result}
			<span id={`${field.id}-label`}>{label}</span>
			<output id={field.id} aria-labelledby={`${field.id}-label`} aria-live="off">
				{invalidAmounts ? '—' : display(field, calculated[field.id] ?? values[field.id] ?? '')}
			</output>
		{:else}
			{@render control(field)}
		{/if}
	</div>
{/snippet}

<div class="paper-sheet wh-preparation">
	<PaperFormHeader number={layout.number} title={layout.title} subtitle={layout.subtitle}
		revision={layout.revision} />

	{#if supporting.length}
		<div class="return-page-context">
			<h2 id={headingId} bind:this={heading} class="return-page-heading" tabindex="-1">{pages.find(page => page.id === current)?.title}</h2>
		</div>
	{/if}
	<div data-return-page="1" hidden={current !== '1'}>
	<section class="form-paper-grid form-period" aria-label="Return period">
		{#each periodGroups as group (group.item)}
			{@const monthField = group.fields.find(field => field.id === definition.monthField)?.id}
			{@const yearField = definition.yearField}
			<div class="form-paper-field numbered">
				<span class="paper-item-number" aria-hidden="true">{group.item}</span>
				{#if monthField && group.fields.some(field => field.id === yearField)}
					<MonthYearInput id={yearField} alternateId={monthField} label="For the month" required
						month={values[monthField]} year={values[yearField]} minYear={definition.minYear} maxYear={definition.maxYear}
						error={displayLabel(errors[yearField] || errors[monthField] || '')}
						onchange={(month, year) => applyChange({ [monthField]: month, [yearField]: year })} />
				{:else}
					<div class={['period-controls', { 'paired-period': group.fields.length > 1 }]}>
						{#each group.fields as field (field.id)}{@render control(field)}{/each}
					</div>
				{/if}
			</div>
		{/each}
		{#if layout.fixedAtc?.inPeriod}
			<div class="form-paper-field numbered">
				<span class="paper-item-number" aria-hidden="true">{layout.fixedAtc.item}</span>
				<dl class="fixed-atc"><dt>ATC</dt><dd class="font-mono">WW010</dd></dl>
			</div>
		{/if}
	</section>

	<ReturnTaxpayerInformation formCode={definition.code} {values} {profile} {taxpayerHref}
		itemNumbers={layout.taxpayer} extraItems={backgroundItems}>
		{#snippet extraField(id)}
			{#if id === 'fixed-atc'}
				<dl class="fixed-atc"><dt>ATC</dt><dd class="font-mono">WW010</dd></dl>
			{:else}
				{@render control(byName[id.slice(definition.prefix.length)])}
			{/if}
		{/snippet}
	</ReturnTaxpayerInformation>

	{#if propertyReturn}
		<section aria-labelledby="property-and-transaction">
			<h2 class="form-paper-heading" id="property-and-transaction">Property and transaction</h2>
			<ReturnRecord bind:this={propertyRecord} title="Property details" item="15–18" label={propertyLabel}
				action={propertyLabel ? 'Edit property details' : 'Enter property details'} {values} onapply={applyChange}>
				{#snippet fields(source, write)}
					{#each propertyDetails as group (group.item)}
						<div class="record-property-item" data-property-item={group.item}>
							<span class="paper-item-number" aria-hidden="true">{group.item}</span>
							<div class="record-property-fields">
								{#each group.fields as field (field.id)}
									{@render control(field, undefined, source, (id, value) => write({ [id]: value }))}
								{/each}
							</div>
						</div>
					{/each}
				{/snippet}
			</ReturnRecord>
			<div class="form-paper-grid">
				{#each propertyGroups.filter(group => !propertyDetailItems.includes(group.item)) as group (group.fields[0].id)}
					{#if group.fields.length > 1}
						<div class="form-paper-field numbered property-item-group" data-property-item={group.item}>
							<span class="paper-item-number" aria-hidden="true">{group.item}</span>
							<div class="property-item-controls" style:--property-control-count={group.fields.length}>
								{#each group.fields as field (field.id)}{@render control(field)}{/each}
							</div>
						</div>
					{:else}
					{@render numberedField(group.fields[0], group.fields[0].readonly)}
					{/if}
				{/each}
			</div>
		</section>
		<section aria-labelledby="property-valuation">
			<h2 class="form-paper-heading" id="property-valuation">Property valuation</h2>
		{#each valuation as field (field.id)}
			{@render numberedField(field, true)}
			{#if field.id === 'frm1606:txtGross' && conflictingSellingPrices}
				<div class="selling-price-conflict">
					<p role="status">The saved selling price in Item 21 differs from Item 28A. Confirm the gross selling price or enter the correct amount.</p>
					<Button variant="secondary" size="sm" disabled={normalizeCurrencyInput(values[field.id] ?? '') === null}
						onclick={() => applyChange({ 'frm1606:txtSelling': values[field.id] })}>Use gross selling price for both items</Button>
				</div>
			{/if}
		{/each}
		</section>
	{/if}

	<section class="form-paper-part-two" aria-labelledby="computation-title">
		<h2 class="form-paper-heading" id="computation-title">Part II · {layout.computation ?? 'Computation of Tax'}</h2>
		{#if !schedulesEnabled}
			<p class="eq-muted form-paper-feedback">No taxes withheld this {definition.period === 'month' ? 'month' : 'quarter'}.</p>
		{/if}
		{#if annual}
			<aside class="form-paper-summary" aria-label="Summary">
				{#each primarySchedules as schedule (`${definition.code}:${schedule.id}`)}
					{@render scheduleEditor(schedule)}
					{#each schedule.totals ?? [] as field (field.id)}{@render numberedField(field, true)}{/each}
				{/each}
			</aside>
		{:else}
			{#each primarySchedules.filter(schedule => layout.inlineSchedules?.[schedule.id] === '') as schedule (schedule.id)}
				{@render scheduleEditor(schedule)}
			{/each}
			{#each computationGroups as group (group.fields[0].id)}
				{#each primarySchedules.filter(schedule => group.fields.some(field => layout.inlineSchedules?.[schedule.id] === shortName(field))) as schedule (schedule.id)}
					{@render scheduleEditor(schedule)}
				{/each}
				{#if group.fields.length > 1}
					<div class="form-paper-field numbered" role="group" aria-label={displayLabel(group.fields[0].label)} data-computation-item={group.item}>
						<span class="paper-item-number" aria-hidden="true">{group.item}</span>
						<div class="computation-item-controls">
							<p>{displayLabel(group.fields[0].label)}</p>
							<div class="computation-item-inputs">
								{#each [...group.fields].sort((a, b) => Number(a.type === 'money') - Number(b.type === 'money')) as field (field.id)}
									{@render control(field, field.type === 'money' ? 'Amount' : 'Description')}
								{/each}
							</div>
						</div>
					</div>
				{:else}
					{@render numberedField(group.fields[0], true)}
				{/if}
			{/each}
		{/if}
		{#if invalidAmounts}
			<p role="status" class="eq-amount-error form-paper-feedback">Correct the amounts to calculate the total.</p>
		{/if}
	</section>

	{#if !annual && separateSchedules.length}
		<section aria-labelledby="supporting-schedules">
			<h2 class="form-paper-heading" id="supporting-schedules">{layout.schedulePart ?? 'Schedules'}</h2>
			{#each separateSchedules as schedule (`${definition.code}:${schedule.id}`)}{@render scheduleEditor(schedule)}{/each}
		</section>
	{/if}
	</div>

	{#each supporting as page (page.id)}
		<section data-return-page={page.id} hidden={current !== page.id} aria-labelledby={headingId}>
			{#if 'reference' in page}
				<div class="return-reference">
					<p>These schedules are included in the return PDF.</p>
					<ul>
						{#each page.reference as label (label)}
							<li>{label}</li>
						{/each}
					</ul>
				</div>
			{:else if schedulesEnabled}
				{#each schedules.filter(schedule => page.schedules.includes(schedule.id)) as schedule (schedule.id)}
					{@render scheduleEditor(schedule)}
				{/each}
			{:else}
				<p class="eq-muted form-paper-feedback">No taxes withheld this {definition.period === 'month' ? 'month' : 'quarter'}.</p>
			{/if}
		</section>
	{/each}
	{#if supporting.length}
		<ReturnPagination {pages} {current} onchange={showPage} />
	{/if}
</div>

<style>
	.selling-price-conflict { display: grid; justify-items: start; gap: .5rem; padding: .75rem .875rem; border-block-start: 1px solid var(--border); }
	.selling-price-conflict p { margin: 0; font-size: var(--form-label-size); }
	.record-property-item { display: grid; grid-template-columns: 2rem minmax(0, 1fr); gap: .5rem; }
	.record-property-fields { display: grid; gap: .75rem; min-width: 0; }
	.return-page-context {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: .25rem 1rem;
		padding: .625rem .875rem;
		border-block-end: 1px solid var(--border);
	}
	.return-page-heading {
		margin: 0;
		font: 650 .875rem/1.4 var(--font-sans);
		scroll-margin-block-start: 4rem;
	}
	.paper-sheet:has(> :global(.return-pagination)) > [data-return-page] { border-block-end: 1px solid var(--border); }
	.return-reference { padding: .75rem .875rem; font-size: .875rem; }
	.return-reference p { margin: 0; color: var(--fg-muted); }
	.return-reference ul { margin: .5rem 0 0; padding-inline-start: 1.25rem; }
	.return-reference li + li { margin-block-start: .375rem; }
	.form-paper-field :global(input[inputmode="decimal"]) { text-align: end; font-variant-numeric: tabular-nums; }
	.form-paper-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 1px;
		background: var(--border);
		border-block-start: 1px solid var(--border);
	}
	.form-period { border-block-start: 0; }
	.form-paper-grid > .form-paper-field {
		flex: 1 0 100%;
		border-block-start: 0;
		background: var(--bg-elev);
	}
	.paper-sheet :global(.wh-schedule) { border-block-start: 1px solid var(--border); }
	.form-paper-heading {
		margin: 0;
		padding: .5rem .875rem;
		border-block-start: 1px solid var(--border);
		background: var(--paper-section-background, var(--bg-hover));
		font: 600 .875rem/1.4 var(--font-sans);
	}
	.form-paper-field, .period-controls {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: start;
		min-width: 0;
		gap: .375rem;
	}
	.form-paper-field { padding: .75rem .875rem; border-block-start: 1px solid var(--border); }
	.form-paper-field.numbered { grid-template-columns: 1.75rem minmax(0, 1fr); }
	.form-paper-field > .paper-item-number { padding-top: .15rem; }
	.paired-period { grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); }
	.form-paper-field :global([data-slot="form-item"]) { grid-template-columns: minmax(0, 1fr); min-width: 0; }
	.form-paper-field :global([data-slot="input"]:not([role="spinbutton"])) { min-width: 0; width: 100%; }
	.form-paper-total {
		grid-template-columns: minmax(0, 1fr) fit-content(48%);
		align-items: baseline;
		font-size: .875rem;
		font-weight: 600;
	}
	.form-paper-total.numbered { grid-template-columns: 1.75rem minmax(0, 1fr) fit-content(48%); }
	.form-paper-total output { font-family: var(--font-mono); min-width: 0; margin-inline-end: var(--paper-amount-inset); text-align: end; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
	.final-total { background: var(--bg-hover); }
	.final-total output { font-size: 1.125rem; }
	.fixed-atc { margin: 0; font-size: .875rem; }
	.fixed-atc dt { color: var(--fg-muted); font-size: .8rem; }
	.fixed-atc dd { margin: .375rem 0 0; font-weight: 600; }
	.form-paper-feedback { margin: 0; padding: .75rem .875rem; border-block-start: 1px solid var(--border); }
	section[data-return-page] > :global(.wh-schedule):first-child, section[data-return-page] > .form-paper-feedback:first-child { border-block-start: 0; }
	.property-item-controls { display: grid; grid-template-columns: minmax(0, 1fr); gap: .75rem; min-width: 0; }
	.seller-tin-control { max-inline-size: 19rem; }
	.property-rdo-control :global([data-slot="form-item"] > div:has(> input)) { max-inline-size: 8rem; }
	.computation-item-controls { min-width: 0; }
	.computation-item-controls > p { margin: 0 0 .5rem; font-size: .875rem; }
	.computation-item-inputs { display: grid; grid-template-columns: minmax(0, 1fr); gap: .75rem; }
	.form-paper-field :global([data-slot="form-item"]:has(input[inputmode="numeric"])) { max-inline-size: 11rem; }
	.form-paper-field :global([data-slot="form-item"]:has(input[placeholder="000-000-000-00000"])) { max-inline-size: 19rem; }
	.form-paper-field :global([data-slot="currency-input"]),
	.form-paper-field :global([data-slot="date-input"]) { max-inline-size: 18rem; }
	:is(.form-paper-money, .computation-item-inputs) :global([data-slot="currency-input"]) { max-inline-size: none; }

	@container paper-form (min-width: 36rem) {
		.form-paper-grid > .form-paper-field { flex-basis: calc((100% - 1px) / 2); }
		.form-paper-grid > .property-item-group { flex-basis: 100%; }
		.property-item-controls { grid-template-columns: repeat(var(--property-control-count), minmax(0, 1fr)); }
		.computation-item-inputs { grid-template-columns: minmax(0, 1fr) minmax(10rem, 16rem); }
		.form-paper-money :global([data-slot="currency-input"] > [data-slot="form-item"]) {
			grid-template-columns: minmax(0, 1fr) minmax(10rem, 16rem);
			align-items: center;
		}
	}

	@container paper-form (min-width: 58rem) {
		.computation-item-inputs { grid-template-columns: minmax(0, 1fr) minmax(0, var(--paper-inline-amount-width)); }
		.form-period > .form-paper-field { flex-basis: 0; }
		.form-period > .form-paper-field:has(.paired-period) { flex-grow: 2; }
	}
</style>
