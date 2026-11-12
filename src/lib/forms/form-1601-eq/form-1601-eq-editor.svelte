<script lang="ts">
	import { tick } from 'svelte';
	import AltArrowRight from '@solar-icons/svelte/category/arrows/Linear/AltArrowRight.svelte';
	import { Button, CalculatedValue, CurrencyInput, NumberInput, RadioGroup, Select } from '$lib/components/ui';
	import { normalizeCurrencyInput } from '$lib/components/ui/currency-input/currency';
	import type { FormDefinition } from '$lib/forms';
	import { calculate1601EQ } from './form-1601-eq-rules';
	import AtcPicker from '../atc-picker.svelte';

	let { definition, values = $bindable(), errors = {}, onvaluechange }: {
		definition: FormDefinition;
		values: Record<string, string>;
		errors?: Record<string, string>;
		onvaluechange?: (patch: Record<string, string>) => void;
	} = $props();
	const prefix = 'frm1601EQ:';
	const lines = [13, 14, 15, 16, 17, 18];
	const rowParts = ['txtATC', 'txtTaxBase', 'txtTaxRate', 'txtTaxWithheld'];
	let addedRows = $state<number[]>([]);
	let removedRow = $state<{ line: number; values: Record<string, string>; rows: number[] } | null>(null);
	const calculated = $derived(calculate1601EQ(values));
	const withheld = $derived(values[prefix + 'optTaxesWithheld'] === 'Y');
	const amended = $derived(values[prefix + 'optAmendedReturn'] === 'Y');
	const rows = $derived.by(() => {
		const active = lines.filter(line => addedRows.includes(line) || rowParts.some(part => {
			const value = values[prefix + part + line]?.trim();
			return value && (part === 'txtATC' || Number(value.replaceAll(',', '')) !== 0);
		}));
		return active.length ? active : [13];
	});
	const due = $derived(Number(calculated[prefix + 'txtTotalAmountDue'] || 0));
	const creditFields = $derived(['txtRemittanceFirstMonth', 'txtRemittanceSecondMonth', ...(amended ? ['txtTaxRemittedPreviousReturn'] : []), ...(['Q2', 'Q3', 'Q4'].includes(values[prefix + 'optQuarter']) ? ['txtOverremittancePreviousQuarter'] : [])]);
	const penaltyFields = ['txtSurcharge', 'txtInterest', 'txtCompromise'];
	const invalidAmounts = $derived([...creditFields, ...penaltyFields, ...(withheld ? rows.map(line => 'txtTaxBase' + line) : [])].some(id => normalizeCurrencyInput(values[prefix + id] || '') === null));
	const hasCredits = $derived(creditFields.some(id => Number(values[prefix + id] || 0) !== 0 || errors[prefix + id]));
	const hasPenalties = $derived(penaltyFields.some(id => Number(values[prefix + id] || 0) !== 0 || errors[prefix + id]));
	const yesNo = [{ value: 'N', label: 'No' }, { value: 'Y', label: 'Yes' }];
	const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
	function change(patch: Record<string, string>) {
		if (removedRow && rowParts.some(part => {
			const id = prefix + part + removedRow!.line;
			return id in patch && patch[id] !== '' && patch[id] !== values[id];
		})) removedRow = null;
		if (onvaluechange) onvaluechange(patch);
		else Object.assign(values, patch);
	}
	function set(id: string, value: string) { change({ [id]: value }); }
	async function focus(id: string) {
		await tick();
		document.getElementById(id)?.focus();
	}
	function addRow() {
		const next = lines.find(line => !rows.includes(line));
		if (next !== undefined) {
			if (removedRow?.line === next) removedRow = null;
			addedRows = [...rows, next];
			void focus(prefix + 'txtATC' + next);
		}
	}
	function removeRow(line: number) {
		const snapshot = Object.fromEntries(rowParts.map(part => [prefix + part + line, values[prefix + part + line] || '']));
		removedRow = Object.values(snapshot).some(value => value && value !== '0.00') ? { line, values: snapshot, rows: [...rows] } : null;
		const remaining = rows.filter(row => row !== line);
		change(Object.fromEntries(rowParts.map(part => [prefix + part + line, ''])));
		addedRows = remaining;
		void focus('add-atc-row');
	}
	function undoRemove() {
		if (!removedRow) return;
		const { line, values: snapshot, rows: previousRows } = removedRow;
		addedRows = previousRows;
		removedRow = null;
		change(snapshot);
		void focus(prefix + 'txtATC' + line);
	}
	function money(id: string) { return invalidAmounts ? '—' : currency.format(Number(calculated[prefix + id] || 0)); }
</script>

{#snippet amount(id: string, label: string, required = false)}
	<CurrencyInput id={prefix + id} {label} {required} value={values[prefix + id] || ''}
		error={errors[prefix + id] || ''} onchange={(value) => set(prefix + id, value)} />
{/snippet}
<div class="eq-layout">
	<div class="eq-fields">
		<section aria-label="Return period" class="eq-section">
			<header class="eq-section-header">
				<h2>Return period</h2>
			</header>
			<div class="eq-field-grid">
				<div class="eq-year">
					<NumberInput id={prefix + 'txtYear'} label="Year" required min={1900} max={9999}
						value={values[prefix + 'txtYear'] || ''} error={errors[prefix + 'txtYear'] || ''} onchange={(value) => set(prefix + 'txtYear', value)} />
				</div>
				<Select id={prefix + 'optQuarter'} label="Quarter" required value={values[prefix + 'optQuarter'] || ''} error={errors[prefix + 'optQuarter'] || ''}
					options={['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter'].map((label, index) => ({ value: `Q${index + 1}`, label }))} onchange={(value) => set(prefix + 'optQuarter', value)} />
				<RadioGroup id={prefix + 'optAmendedReturn'} label="Amended return?" required value={values[prefix + 'optAmendedReturn'] || ''} options={yesNo}
					help="Choose Yes if this replaces a previously filed return for the same period."
					error={errors[prefix + 'optAmendedReturn'] || ''} onchange={(value) => set(prefix + 'optAmendedReturn', value)} />
				<RadioGroup id={prefix + 'optTaxesWithheld'} label="Any taxes withheld?" required value={values[prefix + 'optTaxesWithheld'] || ''} options={yesNo}
					help="Choosing No excludes ATC entries from calculations. Switch back to Yes to restore draft entries."
					error={errors[prefix + 'optTaxesWithheld'] || ''} onchange={(value) => set(prefix + 'optTaxesWithheld', value)} />
			</div>
		</section>

		<section aria-label="Taxes withheld" class="eq-section">
			<header class="eq-section-header">
				<h2>Taxes withheld</h2>
				{#if withheld}
					<Button id="add-atc-row" type="button" variant="secondary" size="sm" disabled={rows.length >= 6} onclick={addRow}>
						Add ATC row
					</Button>
				{/if}
			</header>
			{#if withheld}
				<p class="eq-scroll-hint">Scroll horizontally to review amounts and row actions.</p>
				<div class="eq-atc-viewport" role="region" aria-label="ATC entries">
					{#each rows as line (line)}
						<fieldset class="eq-atc-row" aria-label={`ATC row ${line - 12}`}>
							<AtcPicker id={prefix + 'txtATC' + line} value={values[prefix + 'txtATC' + line] || ''} category={values[prefix + 'optCategory'] || ''} year={Number(values[prefix + 'txtYear'])}
								error={errors[prefix + 'txtATC' + line] || ''}
								onchange={(code) => change({ [prefix + 'txtATC' + line]: code, [prefix + 'txtTaxRate' + line]: '' })} />
							{@render amount('txtTaxBase' + line, 'Tax Base', true)}
							<CalculatedValue id={prefix + 'txtTaxRate' + line} label="Rate (%)" source="From ATC"
								value={calculated[prefix + 'txtTaxRate' + line] ? `${calculated[prefix + 'txtTaxRate' + line]}%` : ''} error={errors[prefix + 'txtTaxRate' + line] || ''} />
							<CalculatedValue id={prefix + 'txtTaxWithheld' + line} label="Tax withheld" for={prefix + 'txtTaxBase' + line}
								value={invalidAmounts ? '' : currency.format(Number(calculated[prefix + 'txtTaxWithheld' + line] || 0))} />
							<Button class="eq-remove-row" type="button" variant="ghost" size="sm" onclick={() => removeRow(line)} aria-label={`Remove ATC row ${line - 12}`}>
								Remove
							</Button>
						</fieldset>
					{/each}
				</div>
				{#if removedRow}
					<div role="status" class="eq-undo">
						<span>ATC row removed.</span>
						<Button type="button" variant="ghost" size="sm" onclick={undoRemove}>
							Undo
						</Button>
					</div>
				{/if}
			{:else if values[prefix + 'optTaxesWithheld'] === 'N'}
				<p class="eq-muted">No taxes withheld this quarter.</p>
			{:else}
				<p class="eq-muted">Choose whether taxes were withheld.</p>
			{/if}
		</section>

		<details class="eq-section eq-disclosure" open={hasCredits || amended}>
			<summary>
				<span class="eq-disclosure-icon" aria-hidden="true"><AltArrowRight size={16} color="currentColor" /></span>
				Remittances and credits
			</summary>
			<div class="eq-field-grid">
				{@render amount('txtRemittanceFirstMonth', 'First month')}
				{@render amount('txtRemittanceSecondMonth', 'Second month')}
				{#if amended}
					{@render amount('txtTaxRemittedPreviousReturn', 'Previously filed return')}
				{/if}
				{#if ['Q2', 'Q3', 'Q4'].includes(values[prefix + 'optQuarter'])}
					{@render amount('txtOverremittancePreviousQuarter', 'Over-remittance from previous quarter')}
				{/if}
			</div>
		</details>
		<details class="eq-section eq-disclosure" open={hasPenalties}>
			<summary>
				<span class="eq-disclosure-icon" aria-hidden="true"><AltArrowRight size={16} color="currentColor" /></span>
				Penalties
			</summary>
			<div class="eq-field-grid">
				{@render amount('txtSurcharge', 'Surcharge')}
				{@render amount('txtInterest', 'Interest')}
				{@render amount('txtCompromise', 'Compromise')}
			</div>
		</details>
		<details class="eq-section eq-disclosure" open={!!errors[prefix + 'txtSheetsAttached']}>
			<summary>
				<span class="eq-disclosure-icon" aria-hidden="true"><AltArrowRight size={16} color="currentColor" /></span>
				Attachments
			</summary>
			<div class="eq-field-grid">
				<NumberInput id={prefix + 'txtSheetsAttached'} label="Sheets attached" min={0} value={values[prefix + 'txtSheetsAttached'] || ''} error={errors[prefix + 'txtSheetsAttached'] || ''} onchange={(value) => set(prefix + 'txtSheetsAttached', value)} />
			</div>
		</details>
	</div>

	<aside aria-label="Summary" class="eq-totals">
		<div class="eq-totals-content">
			<section class="eq-summary">
				<h2 class="eq-summary-heading">Summary</h2>
				<dl class="eq-breakdown">
					{#each [['Taxes withheld', 'txtTotalTaxesWithheld'], ['Remittances and credits', 'txtTotalRemittances'], ['Balance', 'txtTaxStillDue'], ['Penalties', 'txtTotalPenalties']] as [label, id] (id)}
						<div>
							<dt>{label}</dt>
							<dd>{money(id)}</dd>
						</div>
					{/each}
				</dl>
				<div class="eq-amount-due">
					<p>{!invalidAmounts && due < 0 ? 'Over-remittance' : 'Amount due'}</p>
					<p class="eq-total">{money('txtTotalAmountDue')}</p>
				</div>
				{#if invalidAmounts}
					<p role="status" class="eq-amount-error">Correct the amounts to calculate the total.</p>
				{/if}
			</section>
			{#if !invalidAmounts && due < 0}
				<div class="eq-overpayment">
					<Select id={prefix + 'overpaymentOption'} label="Apply over-remittance as" required value={values[prefix + 'overpaymentOption'] || ''} error={errors[prefix + 'overpaymentOption'] || ''}
						options={[{ value: 'refund', label: 'Refund' }, { value: 'certificate', label: 'Tax credit certificate' }, { value: 'carry', label: 'Carry over to next quarter' }].filter(option => option.value !== 'carry' || values[prefix + 'optQuarter'] !== 'Q4')}
						onchange={(value) => set(prefix + 'overpaymentOption', value)} />
				</div>
			{/if}
		</div>
	</aside>
</div>
