<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import { Button, Label } from '$lib/components/ui';
	import { Combobox } from '$lib/components/ui/combobox';
	import { incomeEditorRows, type IncomeEditorField } from './editor-layout';

	type Row = ReturnType<typeof incomeEditorRows>[number];

	let {
		page, groups, values, includesSpouse, fieldControl, references, hasEntry, onpage
	}: {
		page: string;
		groups: { title: string; fields: IncomeEditorField[] }[];
		values: Record<string, string>;
		includesSpouse: boolean;
		fieldControl: Snippet<[IncomeEditorField, string?]>;
		references: Snippet<[IncomeEditorField[]]>;
		hasEntry: (field: IncomeEditorField) => boolean;
		onpage: (page: string) => void;
	} = $props();

	const uid = $props.id();
	const activityCount = 'frm1701:rdoPg1m';
	const activityRegime = 'frm1701:Pg3mTaxRegimeTYPE';
	const titles: Record<string, string> = {
		'1m': 'Consolidated income tax',
		'2m': 'Consolidated ordinary itemized deductions',
		'1mTYPE': 'Activity profile for tax relief',
		'2mTYPE': 'Activity ordinary itemized deductions'
	};
	const schedules = $derived(groups.filter(group => group.title.startsWith('Schedule ')));
	const choices = $derived(groups.flatMap(group => group.fields).filter(field => field.id === activityCount || field.id === activityRegime));
	let filer = $state<'taxpayer' | 'spouse'>('taxpayer');
	const activeFiler = $derived(includesSpouse ? filer : 'taxpayer');
	let openSchedules = $state<Record<string, boolean>>({});
	let showAll = $state<Record<string, boolean>>({});
	let selectedRegimes = $state<Record<string, string>>({});
	let addedRows = $state<Record<string, boolean>>({});

	function rowLabel(row: Row) {
		const first = row.fields[0];
		return first.rowHeading ?? first.label.replace(/^\d+[A-Z]?\s+| description$/gi, '');
	}

	function regime(column: string) {
		return column.split(' · ').at(-1) ?? column;
	}

	function isDeductionTotal(schedule: string, row: Row) {
		return schedule === 'C' ? row.item === '18' : row.item === '5' || row.item === '10';
	}

	export function reveal(field: IncomeEditorField) {
		if (field.person) filer = field.person;
		if (!field.section.startsWith('Schedule ')) return;
		const scheduleKey = `${field.page}:${field.section}`;
		const key = `${scheduleKey}:${field.person ?? activeFiler}`;
		openSchedules[scheduleKey] = true;
		const column = field.column && regime(field.column);
		if (column && ['Exempt', 'Special', 'Regular', 'Total'].includes(column)) selectedRegimes[key] = column;
		if (field.item) {
			const sectionNumber = field.section.split(' ')[1];
			if (/^[CD]/.test(sectionNumber)) addedRows[`${key}:${field.item}`] = true;
			else showAll[key] = true;
		}
	}

	async function addDeduction(key: string, selected: string | string[] | null, rows: Row[]) {
		const row = rows.find(candidate => candidate.key === selected);
		if (!row) return;
		addedRows[`${key}:${row.item}`] = true;
		await tick();
		const controls = row.fields
			.map(field => document.getElementById(field.id))
			.filter(control => control?.getClientRects().length && control.matches('input,select,button,textarea'));
		controls[0]?.focus();
	}
</script>

<div class="attachment-content">
	<p class="attachment-part">
		{#if page.endsWith('TYPE')}
			Part XI · Activity attachment · Part {page.startsWith('1') ? '1' : '2'} of 2
			{#if page === '2mTYPE' && values[activityRegime]} · {values[activityRegime]}{/if}
		{:else}
			Part X · Consolidated computation by tax regime
		{/if}
	</p>
	{#each choices as field (field.id)}
		<div class="attachment-choice">
			{@render fieldControl(field.id === activityCount
				? { ...field, label: 'How many exempt or special-rate activities?' }
				: field)}
			{#if field.id === activityCount && values[activityCount] === '2'}
				<Button type="button" size="sm" variant="secondary" onclick={() => onpage('1mTYPE')}>Open activity attachment</Button>
			{/if}
		</div>
	{/each}
	{#if includesSpouse}
		<div class="attachment-filer">
			<label>Editing details for
				<select bind:value={filer}>
					<option value="taxpayer">Taxpayer</option>
					<option value="spouse">Spouse</option>
				</select>
			</label>
		</div>
	{/if}
	{#each schedules as group (`${page}:${group.title}`)}
		{@const [scheduleLabel, title] = group.title.split(' · ')}
		{@const number = scheduleLabel.split(' ')[1]}
		{@const filerFields = group.fields.filter(field => !field.person || field.person === activeFiler)}
		{@const scheduleKey = `${page}:${group.title}`}
		{@const key = `${scheduleKey}:${activeFiler}`}
		{@const expanded = openSchedules[scheduleKey] ?? title === titles[page]}
		{@const columns = [...new Set(filerFields.flatMap(field => field.column?.includes(' · ') ? [field.column] : []))]}
		{@const availableRegimes = columns.map(regime)}
		{@const activeRegime = selectedRegimes[key] ?? (availableRegimes.includes('Special') ? 'Special' : availableRegimes[0])}
		{@const rows = incomeEditorRows(filerFields)}
		{@const deductions = /^[CD]/.test(number)}
		{@const unused = deductions ? rows.filter(row => !isDeductionTotal(number, row) &&
			!addedRows[`${key}:${row.item}`] && !row.fields.some(hasEntry)) : []}
		{@const compactIncome = page === '1m' && number === 'B'}
		{@const extraIncome = compactIncome ? rows.filter(row => Number(row.item) > 5 && !row.fields.some(hasEntry)) : []}
		{@const shown = showAll[key] ? rows : rows.filter(row => !unused.includes(row) && !extraIncome.includes(row))}
		{#if filerFields.length}
			<details open={expanded} data-schedule-key={scheduleKey}>
				<summary onclick={(event) => {
					event.preventDefault();
					openSchedules[scheduleKey] = !expanded;
				}}>
					<span>
						<strong>{title}</strong>
						<small>{scheduleLabel}{#if page.endsWith('TYPE') && number === 'C'} · {page === '1mTYPE' ? 'Items 1–3' : 'Items 4–18'}{/if}</small>
					</span>
				</summary>
				<div class="schedule-body">
					{#if columns.length > 1}
						<div class="regime-picker">
							<label>{availableRegimes.includes('Total') ? 'Tax regime or total' : 'Tax regime'}
								<select aria-label={`${availableRegimes.includes('Total') ? 'Tax regime or total' : 'Tax regime'} · ${scheduleLabel}`}
									value={activeRegime}
									onchange={(event) => selectedRegimes[key] = event.currentTarget.value}>
									{#each availableRegimes as option (option)}
										<option value={option}>{option}</option>
									{/each}
								</select>
							</label>
						</div>
					{/if}
					{#if deductions && unused.length}
						{@const pickerId = `${uid}-deduction-${number}`}
						<div class="deduction-picker">
							{#if !showAll[key]}
								<Label for={pickerId}>{number === 'C' ? 'Add a deduction' : 'Add a special deduction'}</Label>
							{/if}
							<div class={['deduction-actions', { 'with-chooser': !showAll[key] }]}>
								{#if !showAll[key]}
									<Combobox
										id={pickerId}
										value={null}
										options={unused.map(row => ({ value: row.key, label: `${row.item} · ${rowLabel(row)}` }))}
										placeholder="Choose a deduction"
										searchPlaceholder="Search deductions"
										emptyMessage="No matching deductions."
										wrapOptions
										onValueChange={(value) => void addDeduction(key, value, unused)}
									/>
								{/if}
								<Button type="button" variant="secondary" size="sm" aria-expanded={!!showAll[key]}
									onclick={() => showAll[key] = !showAll[key]}>
									{showAll[key] ? 'Show entered deductions' : `Show all ${rows.filter(row => !isDeductionTotal(number, row)).length} deduction items`}
								</Button>
							</div>
						</div>
					{/if}
					<!-- svelte-ignore a11y_no_redundant_roles (Preserve table semantics in the stacked layout) -->
					<table role="table" aria-label={group.title} class={{ 'four-regimes': columns.length === 4 }}>
						<thead>
							<tr>
								<th scope="col">Item and description</th>
								{#each columns as column (column)}
									<th scope="col" class={{ 'mobile-hidden': regime(column) !== activeRegime }}>{regime(column)}</th>
								{:else}
									<th scope="col">Entry</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each shown as row (row.key)}
								{@const detailFields = row.fields.filter(field => ['Description', 'Legal basis'].includes(field.column ?? ''))}
								<tr data-income-item={row.item} class={{ 'total-row': deductions && isDeductionTotal(number, row) }}>
									<th scope="row">
										<span class="item-label">
											<span class="item-number">{row.item}</span>
											{rowLabel(row)}
										</span>
										{#each detailFields as field (field.id)}
											{@render fieldControl({ ...field, label: `Item ${row.item} · ${field.column}` })}
										{/each}
										{@render references(row.fields)}
									</th>
									{#each columns as column (column)}
										<td class={{ 'mobile-hidden': regime(column) !== activeRegime }}>
											{#each row.fields.filter(field => field.column === column) as field (field.id)}
												{@render fieldControl(field, column)}
											{:else}
												<span aria-label="Not applicable">—</span>
											{/each}
										</td>
									{:else}
										<td>
											{#each row.fields.filter(field => !detailFields.includes(field)) as field (field.id)}
												{@render fieldControl(field, field.column === 'Amount' ? undefined : field.column)}
											{/each}
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
					{#if extraIncome.length}
						<div class="more-income">
							<Button type="button" variant="secondary" size="sm" aria-expanded={!!showAll[key]}
								onclick={() => showAll[key] = !showAll[key]}>
								{showAll[key] ? 'Show fewer income items' : `Show ${extraIncome.length} more income items`}
							</Button>
						</div>
					{/if}
					{#if page === '1mTYPE' && number === 'C'}
						<div class="schedule-next">
							<Button type="button" size="sm" variant="secondary" onclick={() => onpage('2mTYPE')}>Continue Schedule C on page 8</Button>
						</div>
					{/if}
				</div>
			</details>
		{/if}
	{/each}
	{#if page === '2mTYPE'}
		<div class="schedule-next review-consolidation">
			<Button type="button" size="sm" variant="secondary" onclick={() => onpage('1m')}>Review consolidation</Button>
		</div>
	{/if}
</div>

<style>
	.attachment-content {
		min-inline-size: 0;
		border-block-start: 1px solid var(--border);
		container: activity-content / inline-size;
	}
	.attachment-part, .attachment-choice, .attachment-filer { padding: .75rem 1rem; border-block-end: 1px solid var(--border); }
	.attachment-part { margin: 0; color: var(--fg-muted); font-size: .875rem; }
	.attachment-choice { display: grid; gap: .625rem; justify-items: start; }
	.attachment-filer { background: var(--bg-subtle, var(--bg-elev)); }
	.attachment-filer label, .regime-picker label { display: grid; gap: .25rem; color: var(--fg-muted); font-size: .8125rem; font-weight: 600; }
	select { padding: .5rem .625rem; width: 100%; min-width: 0; min-height: 2.75rem; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--bg-elev); color: var(--fg); font: inherit; }
	select:focus-visible, summary:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
	details + details { border-block-start: 1px solid var(--border); }
	summary { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: .625rem 1rem; min-height: 3.5rem; list-style: none; cursor: pointer; }
	summary::-webkit-details-marker { display: none; }
	summary::after { content: ''; border: solid currentColor; border-width: 0 1.5px 1.5px 0; width: .45rem; height: .45rem; margin: 0 .125rem .25rem 0; transform: rotate(45deg); flex: none; }
	details[open] > summary { background: var(--paper-section-background, var(--bg-hover)); border-block-end: 1px solid var(--border); }
	details[open] > summary::after { margin: .25rem .125rem 0 0; transform: rotate(225deg); }
	summary small { display: block; font-size: .75rem; color: var(--fg-muted); }
	.schedule-body { padding: 0 1rem; }
	.regime-picker, .deduction-picker, .more-income, .schedule-next { padding: .625rem 0; }
	.deduction-picker { display: grid; gap: .25rem; }
	.deduction-actions { display: grid; gap: .5rem; }
	tr { border-block-end: 1px solid var(--border); }
	table { width: 100%; table-layout: fixed; border-collapse: collapse; font-size: .875rem; }
	th, td { text-align: start; padding: .5rem 0; vertical-align: top; overflow-wrap: anywhere; }
	tbody th { font-weight: 600; }
	thead th { color: var(--fg-muted); font-size: .75rem; font-weight: 600; }
	.item-label { display: grid; grid-template-columns: 1.6rem minmax(0, 1fr); gap: .5rem; align-items: baseline; }
	.item-number { color: var(--fg-muted); font-variant-numeric: tabular-nums; }
	td :global([data-slot="form-item"]), td :global([data-slot="date-input"]) { position: relative; }
	.schedule-body :global(input:not([role="spinbutton"])) { min-width: 0; width: 100%; }
	td :global([data-slot="form-item"] > label), td :global([data-slot="date-input"] > label),
	td :global([data-slot="calculated-value"] > .value-label) { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
	th :global([data-slot="form-item"]) { margin-block-start: .5rem; }
	td :global(output) { display: block; text-align: end; font-weight: 650; padding: .25rem .5rem; }
	.total-row { background: var(--paper-section-background, var(--bg-hover)); }
	.total-row th, .total-row td { padding-inline: .4rem; }
	.review-consolidation { padding-inline: 1rem; border-block-start: 1px solid var(--border); }
	@container activity-content (min-width: 50rem) {
		.regime-picker { display: none; }
		.attachment-filer label { inline-size: min(100%, 20rem); }
		.deduction-actions { grid-template-columns: max-content; }
		.deduction-actions.with-chooser { grid-template-columns: minmax(0, 20rem) max-content; }
		th, td { padding-inline: .375rem; }
		thead th:first-child { width: 34%; }
		.four-regimes thead th:first-child { width: 27%; }
	}
	@container activity-content (width < 50rem) {
		table, tbody { display: block; }
		thead { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); }
		tbody tr { display: grid; grid-template-columns: minmax(0, 1fr); }
		.mobile-hidden { display: none; }
		th, td { padding: .375rem 0; }
		tbody th { padding-block-start: .625rem; }
		td { padding-block-end: .625rem; }
		.schedule-body :global(input:not([type="checkbox"], [type="radio"])) { font-size: 1rem; }
	}
</style>
