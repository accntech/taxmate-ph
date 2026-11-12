<script lang="ts">
	import { onDestroy, tick, type Snippet } from 'svelte';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { Sheet } from '$lib/components/ui/sheet';
	import AltArrowRight from '@solar-icons/svelte/category/arrows/Linear/AltArrowRight.svelte';
	import TrashBinTrash from '@solar-icons/svelte/category/ui/Linear/TrashBinTrash.svelte';
	import BillList from '@solar-icons/svelte/category/money/Linear/BillList.svelte';
	import { Button, CalculatedValue, CurrencyInput, DateInput, Input, NumberInput, RadioGroup, Select } from '$lib/components/ui';
	import AtcPicker from './atc-picker.svelte';
	import { calculateWithholding } from './withholding-rules';
	import { withholdingSchedules, type WithholdingDefinition, type WithholdingField, type WithholdingRow, type WithholdingSchedule } from './withholding-definitions';
	import { activeScheduleRows, isReorderableSchedule, nextScheduleDraft, scheduleItemValues, validateScheduleDraft, writeScheduleItems } from './schedule-items';

	type Values = Record<string, string>;
	let { definition, schedule, values, errors = {}, onchange, totals }: {
		definition: WithholdingDefinition;
		schedule: WithholdingSchedule;
		values: Values;
		errors?: Values;
		onchange: (patch: Values) => void;
		totals?: Snippet;
	} = $props();

	const uid = $props.id();
	const addId = `${uid}-add`;
	const dragHelpId = `${uid}-drag-help`;
	const rows = $derived(activeScheduleRows(schedule, values, errors));
	const reorderable = $derived(isReorderableSchedule(schedule));
	const calculated = $derived(calculateWithholding(definition.code, values));
	const nextDraft = $derived(nextScheduleDraft(definition, schedule, values));
	const availableRows = $derived(schedule.rows.filter(row => !rows.some(item => item.id === row.id)));
	const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

	let open = $state(false);
	let isNew = $state(true);
	let editingRowId = $state('');
	let allocationPatch = $state<Values>({});
	let draft = $state<Values>({});
	let draftErrors = $state<Values>({});
	let removed = $state<Values | null>(null);
	let rowKeys = $state<Record<string, string>>({});
	let removedKeys: Record<string, string> | null = null;
	let serial = 0;
	let returnFocus: HTMLElement | null = null;
	let detailsElement = $state<HTMLDetailsElement>();
	let listElement = $state<HTMLOListElement>();
	let announcement = $state('');
	let dragging = $state<string | null>(null);
	let previewRows = $state<WithholdingRow[] | null>(null);
	let dragPosition = $state<{ left: number; top: number; width: number; height: number } | null>(null);
	let pointerSession: { id: number; row: string; startY: number; offset: number; left: number; width: number; height: number; centers: { row: string; center: number }[] } | null = null;

	const displayRows = $derived(previewRows ?? rows);
	const editorValues = $derived({ ...values, ...allocationPatch, ...draft });
	const editorSchedule = $derived(withholdingSchedules(definition, editorValues).find(item => item.id === schedule.id) ?? schedule);
	const editorRow = $derived(editorSchedule.rows.find(row => row.id === editingRowId));
	const draftCalculated = $derived(calculateWithholding(definition.code, editorValues));
	const title = $derived(isNew ? 'New line item' : `Edit line item ${Math.max(0, rows.findIndex(row => row.id === editingRowId)) + 1}`);
	const contextErrors = $derived(Object.entries(draftErrors).filter(([id]) => !editorRow?.fields.some(field => field.id === id)));
	const draggedRow = $derived(rows.find(row => row.id === dragging));
	const draftInvalidAmounts = $derived(editorRow?.fields.some(field => {
		if (field.readonly || field.type !== 'money' || !visible(field, editorValues)) return false;
		const value = (draft[field.id] ?? '').trim();
		return value !== '' && (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(value) || !Number.isFinite(Number(value.replaceAll(',', ''))) || (!field.allowNegative && Number(value.replaceAll(',', '')) < 0));
	}) ?? false);

	function displayLabel(label: string) {
		return label.replace(/^\d+[A-Z]?(?:[.):-])?\s+/i, '');
	}

	function visible(field: WithholdingField, source = values) {
		return !field.showWhen || source[field.showWhen.field] === field.showWhen.value;
	}

	function display(field: WithholdingField, value: string) {
		if (!value) return '—';
		if (field.type === 'money') {
			const numeric = value.trim().replaceAll(',', '');
			return /^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(numeric) && Number.isFinite(Number(numeric)) ? currency.format(Number(numeric)) : '—';
		}
		return field.options?.find(option => option.value === value)?.label ?? value;
	}

	function rowTitle(row: WithholdingRow) {
		if (!reorderable) return row.label;
		const primary = row.fields.find(field => /payee name|^ATC$|treaty code/i.test(displayLabel(field.label)));
		return (primary && values[primary.id]) || 'Line item';
	}

	function keyFor(row: WithholdingRow) { return rowKeys[row.id] ?? row.id; }
	function gripId(row: WithholdingRow) { return `${uid}-drag-${row.id}`; }
	function assignKeys(keys: string[], target: WithholdingSchedule) {
		rowKeys = Object.fromEntries(target.rows.map((row, index) => [row.id, keys[index] ?? `new-${serial++}`]));
	}

	async function focus(id: string) {
		await tick();
		const control = document.getElementById(id);
		const dialog = control?.closest('dialog');
		if (dialog) {
			await Promise.all(dialog.getAnimations().map(animation => animation.finished.catch(() => {})));
			if (!open || !dialog.open) return;
		}
		control?.focus();
	}

	function startDraft(row: WithholdingRow, initial: Values) {
		editingRowId = row.id;
		draft = initial;
		draftErrors = {};
	}

	function edit(row?: WithholdingRow, fieldId?: string, opener?: HTMLElement) {
		if (open || document.querySelector('dialog[open]')) return;
		cancelPointer();
		const next = row ? null : nextScheduleDraft(definition, schedule, values);
		const target = row ?? next?.row;
		if (!target) return;
		isNew = !row;
		allocationPatch = next?.allocationPatch ?? {};
		returnFocus = opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
		startDraft(target, Object.fromEntries(target.fields.map(field => [field.id, row ? values[field.id] ?? '' : field.defaultValue ?? ''])));
		if (row) draftErrors = Object.fromEntries(target.fields.flatMap(field => errors[field.id] ? [[field.id, errors[field.id]]] : []));
		if (detailsElement) detailsElement.open = true;
		open = true;
		void focus(fieldId ?? target.fields.find(field => !field.readonly && visible(field, editorValues))?.id ?? '');
	}

	function selectAssignedRow(id: string) {
		const target = availableRows.find(row => row.id === id);
		if (!target) return;
		startDraft(target, Object.fromEntries(target.fields.map(field => [field.id, field.defaultValue ?? ''])));
	}

	function close() {
		open = false;
		draft = {};
		draftErrors = {};
		allocationPatch = {};
		void tick().then(() => (returnFocus?.isConnected ? returnFocus : document.getElementById(addId))?.focus());
	}

	function changeDraft(field: WithholdingField, value: string) {
		const patch: Values = { [field.id]: value };
		if (['atc', 'payees'].includes(schedule.id) && displayLabel(field.label) === 'ATC') {
			for (const rate of editorRow?.fields.filter(item => /rate.*\(%\)/i.test(item.label)) ?? []) patch[rate.id] = '';
		}
		draft = { ...draft, ...patch };
		draftErrors = Object.fromEntries(Object.entries(draftErrors).filter(([id]) => !(id in patch)));
	}

	function commit() {
		if (!editorRow) return;
		const context = { ...values, ...allocationPatch };
		draftErrors = validateScheduleDraft(definition, editorSchedule, editorRow, draft, context);
		if (Object.keys(draftErrors).length) {
			const target = editorRow.fields.find(field => !field.readonly && draftErrors[field.id]) ?? editorRow.fields.find(field => !field.readonly);
			void focus(target?.id ?? '');
			return;
		}
		const next = calculateWithholding(definition.code, editorValues);
		let patch: Values;
		if (isNew && reorderable) {
			patch = { ...allocationPatch, ...writeScheduleItems(definition, schedule, [...rows.map(row => scheduleItemValues(row, values)), scheduleItemValues(editorRow, next)], context) };
			const target = withholdingSchedules(definition, { ...context, ...patch }).find(item => item.id === schedule.id) ?? editorSchedule;
			assignKeys([...rows.map(keyFor), `new-${serial++}`], target);
		} else {
			patch = { ...allocationPatch, ...Object.fromEntries(editorRow.fields.map(field => [field.id, next[field.id] ?? draft[field.id] ?? ''])) };
		}
		onchange(patch);
		removed = null;
		announcement = isNew ? 'Line item added.' : 'Line item updated.';
		close();
	}

	function remove(row: WithholdingRow) {
		removed = Object.fromEntries(schedule.rows.flatMap(item => item.fields.map(field => [field.id, values[field.id] ?? ''])));
		removedKeys = { ...rowKeys };
		onchange(Object.fromEntries(row.fields.map(field => [field.id, ''])));
		announcement = 'Line item removed.';
		void focus(addId);
	}

	function undo() {
		if (!removed) return;
		if (removedKeys) rowKeys = removedKeys;
		onchange(removed);
		removed = null;
		announcement = 'Line item restored.';
	}

	function move(from: number, to: number) {
		if (!reorderable || open || from === to || from < 0 || to < 0 || from >= rows.length || to >= rows.length) return;
		const ordered = rows.map(row => scheduleItemValues(row, values));
		const keys = rows.map(keyFor);
		const [item] = ordered.splice(from, 1);
		const [key] = keys.splice(from, 1);
		ordered.splice(to, 0, item);
		keys.splice(to, 0, key);
		const patch = writeScheduleItems(definition, schedule, ordered, values);
		const target = withholdingSchedules(definition, { ...values, ...patch }).find(item => item.id === schedule.id) ?? schedule;
		assignKeys(keys, target);
		onchange(patch);
		removed = null;
		announcement = `Line item moved to position ${to + 1} of ${rows.length}.`;
		void focus(gripId(target.rows[to]));
	}

	function startPointer(event: PointerEvent, row: WithholdingRow) {
		if (!listElement || !reorderable || open || rows.length < 2 || event.button !== 0 || !event.isPrimary || pointerSession) return;
		const grip = event.currentTarget as HTMLButtonElement;
		if (grip.matches(':disabled')) return;
		event.preventDefault();
		grip.focus({ preventScroll: true });
		const card = grip.closest('li')!.getBoundingClientRect();
		pointerSession = {
			id: event.pointerId, row: row.id, startY: event.clientY, offset: event.clientY - card.top,
			left: card.left, width: card.width, height: card.height,
			centers: Array.from(listElement.children).map((element, index) => { const bounds = element.getBoundingClientRect(); return { row: rows[index].id, center: bounds.top + bounds.height / 2 }; })
		};
		listElement.setPointerCapture(event.pointerId);
	}

	function movePointer(event: PointerEvent) {
		const session = pointerSession;
		if (!session || session.id !== event.pointerId) return;
		if (dragging === null && Math.abs(event.clientY - session.startY) < 5) return;
		event.preventDefault();
		dragging = session.row;
		dragPosition = { left: session.left, top: event.clientY - session.offset, width: session.width, height: session.height };
		const next = rows.filter(row => row.id !== session.row);
		const target = session.centers.filter(point => point.row !== session.row).findIndex(point => event.clientY < point.center);
		const source = rows.find(row => row.id === session.row);
		if (!source) return;
		next.splice(target === -1 ? next.length : target, 0, source);
		if (!previewRows || next.some((row, index) => row.id !== previewRows![index].id)) previewRows = next;
	}

	function finishPointer(event: PointerEvent) {
		const session = pointerSession;
		if (!listElement || !session || event.pointerId !== session.id) return;
		const from = rows.findIndex(row => row.id === session.row);
		const to = previewRows?.findIndex(row => row.id === session.row) ?? from;
		const bounds = listElement.getBoundingClientRect();
		const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top - 24 && event.clientY <= bounds.bottom + 24;
		cancelPointer();
		if (inside && from !== to) move(from, to);
	}

	function cancelPointer() {
		const session = pointerSession;
		pointerSession = null;
		dragging = null;
		previewRows = null;
		dragPosition = null;
		if (session && listElement?.hasPointerCapture(session.id)) listElement.releasePointerCapture(session.id);
	}

	onDestroy(cancelPointer);
	function dragPortal(node: HTMLElement) { document.body.appendChild(node); return () => node.remove(); }

	function reorderKey(event: KeyboardEvent, index: number) {
		if (pointerSession || !['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
		event.preventDefault();
		move(index, event.key === 'Home' ? 0 : event.key === 'End' ? rows.length - 1 : index + (event.key === 'ArrowUp' ? -1 : 1));
	}

	function keydown(event: KeyboardEvent) {
		if (pointerSession && event.key === 'Escape') { event.preventDefault(); cancelPointer(); return; }
		if (open && event.key === 'Enter' && !event.defaultPrevented && !event.isComposing && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey && event.target instanceof HTMLInputElement) {
			event.preventDefault();
			commit();
		}
	}

	function errorLink(event: MouseEvent) {
		const anchor = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
		if (!anchor) return;
		let id: string;
		try { id = decodeURIComponent(anchor.getAttribute('href')!.slice(1)); } catch { return; }
		const row = schedule.rows.find(item => item.fields.some(field => field.id === id));
		if (!row) return;
		event.preventDefault();
		edit(row, id, anchor as HTMLElement);
	}
</script>

<svelte:window onkeydown={keydown} onblur={cancelPointer} />
<svelte:document onclick={errorLink} onscrollcapture={cancelPointer} />

{#snippet gripIcon()}
	<svg width="16" height="24" viewBox="0 0 16 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="6" r="1.5" /><circle cx="11" cy="6" r="1.5" /><circle cx="5" cy="12" r="1.5" /><circle cx="11" cy="12" r="1.5" /><circle cx="5" cy="18" r="1.5" /><circle cx="11" cy="18" r="1.5" /></svg>
{/snippet}

{#snippet rowSummary(row: WithholdingRow, index: number)}
	<span class="identity"><span class="ordinal">{index + 1}</span><strong>{rowTitle(row)}</strong></span>
	<span class="amounts">
		{#each row.fields.filter(field => visible(field)) as field (field.id)}
			<span><span>{displayLabel(field.label)}</span><b>{display(field, calculated[field.id] ?? values[field.id] ?? '')}</b></span>
		{/each}
	</span>
	{#if row.fields.some(field => errors[field.id])}<span class="error">Review this line item.</span>{/if}
{/snippet}

{#snippet control(field: WithholdingField)}
	{#if visible(field, editorValues)}
		{#if field.readonly}
			<CalculatedValue id={field.id} label={displayLabel(field.label)} value={draftInvalidAmounts && field.type === 'money' ? '' : display(field, draftCalculated[field.id] ?? draft[field.id] ?? '')} error={draftErrors[field.id] ?? ''} />
		{:else if displayLabel(field.label) === 'ATC'}
			<AtcPicker id={field.id} label={displayLabel(field.label)} formCode={definition.code} fieldOptions={field.options ?? []} category={editorValues[definition.prefix + 'optCategory'] ?? ''} year={Number(editorValues[definition.yearField])} required={field.required ?? false} value={draft[field.id] ?? ''} error={draftErrors[field.id] ?? ''} onchange={(value) => changeDraft(field, value)} />
		{:else if field.type === 'money' && !field.allowNegative}
			<CurrencyInput id={field.id} label={displayLabel(field.label)} required={field.required ?? false} value={draft[field.id] ?? ''} error={draftErrors[field.id] ?? ''} onchange={(value) => changeDraft(field, value)} />
		{:else if field.type === 'money'}
			<Input id={field.id} label={displayLabel(field.label)} inputmode="decimal" required={field.required ?? false} value={draft[field.id] ?? ''} error={draftErrors[field.id] ?? ''} oninput={(event) => changeDraft(field, event.currentTarget.value)} />
		{:else if field.type === 'number'}
			<NumberInput id={field.id} label={displayLabel(field.label)} required={field.required ?? false} value={draft[field.id] ?? ''} error={draftErrors[field.id] ?? ''} decimal={!/year|sheet|count|number|month|day/i.test(field.id)} onchange={(value) => changeDraft(field, value)} />
		{:else if field.type === 'select'}
			{#if field.options?.length === 2 && field.options.every(option => ['Y', 'N'].includes(option.value))}
				<RadioGroup id={field.id} label={displayLabel(field.label)} required={field.required ?? false} options={field.options} value={draft[field.id] ?? ''} error={draftErrors[field.id] ?? ''} onchange={(value) => changeDraft(field, value)} />
			{:else}
				<Select id={field.id} label={displayLabel(field.label)} required={field.required ?? false} options={field.options ?? []} value={draft[field.id] ?? ''} error={draftErrors[field.id] ?? ''} onchange={(value) => changeDraft(field, value)} />
			{/if}
		{:else if field.type === 'date'}
			<DateInput id={field.id} label={displayLabel(field.label)} required={field.required ?? false} value={draft[field.id] ?? ''} error={draftErrors[field.id] ?? ''} onchange={(value) => changeDraft(field, value)} />
		{:else}
			<Input id={field.id} label={displayLabel(field.label)} required={field.required ?? false} value={draft[field.id] ?? ''} error={draftErrors[field.id] ?? ''} oninput={(event) => changeDraft(field, event.currentTarget.value)} />
		{/if}
	{/if}
{/snippet}

{#if draggedRow && dragPosition}
	<div {@attach dragPortal} class="item drag-preview" aria-hidden="true" style:width={`${dragPosition.width}px`} style:min-height={`${dragPosition.height}px`} style:transform={`translate3d(${dragPosition.left}px, ${dragPosition.top}px, 0)`}>
		<span class="grip">{@render gripIcon()}</span>
		<div class="item-details">{@render rowSummary(draggedRow, rows.indexOf(draggedRow))}</div>
		<span><TrashBinTrash size={18} color="currentColor" /></span>
	</div>
{/if}

<details bind:this={detailsElement} class="eq-section eq-disclosure wh-schedule" open={schedule.id === 'atc' || rows.length > 0 || open}>
	<summary><span class="eq-disclosure-icon" aria-hidden="true"><AltArrowRight size={16} color="currentColor" /></span>{schedule.title}</summary>
	<section aria-label={schedule.title}>
		<div class="count">{rows.length} {rows.length === 1 ? 'line item' : 'line items'}</div>
		{#if rows.length === 0}
			<div class="empty">
				<span class="empty-icon" aria-hidden="true"><BillList size={28} color="currentColor" /></span>
				<p class="empty-title">No line items yet</p>
				<p>Add a line item to complete this schedule.</p>
				<Button id={addId} aria-label={`Add line item to ${schedule.title}`} variant="secondary" size="sm" disabled={!nextDraft} onclick={(event) => edit(undefined, undefined, event.currentTarget)}>Add first line item</Button>
			</div>
		{:else}
			{#if reorderable}<p id={dragHelpId} class="help">Drag the grip to reorder. With the grip focused, use ↑ or ↓.</p>{/if}
			<ol bind:this={listElement} aria-label={`${schedule.title} line items`} class="items" onpointermove={movePointer} onpointerup={finishPointer} onpointercancel={cancelPointer} onlostpointercapture={cancelPointer}>
				{#each displayRows as row, index (keyFor(row))}
					<li animate:flip={{ duration: prefersReducedMotion.current ? 0 : 180, easing: cubicOut }} class={['item', !reorderable && 'fixed-item', dragging === row.id && 'dragging', row.fields.some(field => errors[field.id]) && 'invalid']}>
						{#if reorderable}<button id={gripId(row)} type="button" class="grip" disabled={rows.length < 2} aria-label={`Drag line item ${index + 1}`} aria-describedby={dragHelpId} onpointerdown={(event) => startPointer(event, row)} onkeydown={(event) => reorderKey(event, index)}>{@render gripIcon()}</button>{/if}
						<button type="button" class="item-details" aria-label={`Edit line item ${index + 1}`} onclick={(event) => edit(row, undefined, event.currentTarget)}>{@render rowSummary(row, index)}</button>
						<Button variant="ghost" size="icon" aria-label={`Remove line item ${index + 1}`} title="Remove line item" onclick={() => remove(row)}><TrashBinTrash size={18} color="currentColor" aria-hidden="true" /></Button>
					</li>
				{/each}
			</ol>
			<div class="add-row"><Button id={addId} aria-label={`Add line item to ${schedule.title}`} variant="secondary" size="sm" disabled={!nextDraft} onclick={(event) => edit(undefined, undefined, event.currentTarget)}>Add line item</Button>{#if !nextDraft}<span class="help">All available lines are in use.</span>{/if}</div>
		{/if}
		{#if removed}<div class="eq-undo"><span>Line item removed.</span><Button variant="ghost" size="sm" onclick={undo}>Undo</Button></div>{/if}
		<p class="sr-only" role="status">{announcement}</p>
	</section>
	{@render totals?.()}
</details>

<Sheet {open} onOpenChange={(next) => { if (!next) close(); }} {title} description={schedule.title} size="md">
	{#if open && editorRow}
		<div class="editor-fields">
			{#if isNew && !reorderable}<Select id={`${uid}-assigned-row`} label="Schedule row" required options={availableRows.map(row => ({ value: row.id, label: row.label }))} value={editingRowId} onchange={selectAssignedRow} />{/if}
			{#if contextErrors.length}<div role="alert" class="error">{#each contextErrors as [id, message] (id)}<p>{message}</p>{/each}</div>{/if}
			<fieldset class="editor-row" aria-label={`${schedule.title}: ${editorRow.label}`}>
				<legend class="sr-only">{editorRow.label}</legend>
				{#each editorRow.fields as field (field.id)}{@render control(field)}{/each}
			</fieldset>
		</div>
	{/if}
	{#snippet footer()}<div class="editor-actions"><Button variant="secondary" onclick={close}>Cancel</Button><Button onclick={commit}>{isNew ? 'Add' : 'Update'}</Button></div>{/snippet}
</Sheet>

<style>
	.count, .help, .empty > p, .amounts { color: var(--fg-muted); font-size: .8rem; }
	.count { margin-bottom: .75rem; text-align: right; font-variant-numeric: tabular-nums; }
	.empty { display: grid; justify-items: center; gap: .75rem; padding: 2.5rem 1rem; border: 1px dashed var(--border); border-radius: 10px; background: var(--bg); text-align: center; }
	.empty-icon { display: grid; width: 2.5rem; height: 2.5rem; place-items: center; border: 1px solid var(--border); border-radius: .5rem; color: var(--fg-muted); }
	.empty .empty-title { color: var(--fg); font-size: .95rem; font-weight: 600; }
	.help { margin-bottom: .75rem; }
	.items { display: grid; gap: .5rem; margin: 0; padding: 0; list-style: none; }
	.item { display: grid; grid-template-columns: 2rem minmax(0, 1fr) auto; gap: .375rem; align-items: start; padding: .625rem; border: 1px solid var(--border-soft); border-radius: 8px; background: var(--bg-elev); }
	.fixed-item { grid-template-columns: minmax(0, 1fr) auto; }
	.item.dragging { opacity: .3; border-color: var(--accent); }
	.drag-preview { position: fixed; top: 0; left: 0; z-index: 100; pointer-events: none; box-shadow: 0 12px 32px rgb(0 0 0 / .25); border-color: var(--accent); }
	.item.invalid { border-color: var(--danger); }
	.grip { display: grid; width: 2rem; height: 2.5rem; place-items: center; border: 1px solid transparent; border-radius: 4px; color: var(--fg-muted); background: transparent; cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; }
	.grip:active { cursor: grabbing; }
	.grip:disabled { opacity: .35; cursor: default; }
	.item-details { display: grid; min-width: 0; gap: .5rem; padding: .5rem; border: 1px solid transparent; border-radius: 4px; background: transparent; color: var(--fg); text-align: left; cursor: pointer; }
	.item-details:hover:not(:focus-visible), .grip:hover:not(:disabled):not(:focus-visible) { background: var(--bg-hover); }
	.item-details:focus-visible, .grip:focus-visible { outline: none; border-color: var(--field-focus-border); box-shadow: 0 0 0 3px var(--field-focus-halo); }
	.identity { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; font-size: .875rem; }
	.identity strong { overflow-wrap: anywhere; }
	.ordinal { color: var(--fg-subtle); font-size: .75rem; }
	.amounts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 8rem), 1fr)); gap: .5rem 1.25rem; }
	.amounts > span { display: grid; gap: .125rem; min-width: 0; }
	.amounts b { color: var(--fg); font-weight: 500; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
	.add-row { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; margin-top: .875rem; }
	.add-row .help { margin: 0; }
	.error { color: var(--danger); font-size: .8rem; }
	.editor-fields { display: grid; gap: var(--form-field-row-gap); padding: 1.25rem; }
	.editor-row { display: grid; gap: var(--form-field-row-gap); min-width: 0; margin: 0; padding: 0; border: 0; }
	.editor-actions { display: flex; justify-content: end; gap: .5rem; }
	@media (forced-colors: active) { .item-details:focus-visible, .grip:focus-visible { outline: 2px solid Highlight; box-shadow: none; } }
</style>
