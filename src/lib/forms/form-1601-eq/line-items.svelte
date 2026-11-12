<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { Sheet } from '$lib/components/ui/sheet';
	import TrashBinTrash from '@solar-icons/svelte/category/ui/Linear/TrashBinTrash.svelte';
	import BillList from '@solar-icons/svelte/category/money/Linear/BillList.svelte';
	import { Button, CalculatedValue, CurrencyInput } from '$lib/components/ui';
	import { normalizeCurrencyInput } from '$lib/components/ui/currency-input/currency';
	import AtcPicker from '../atc-picker.svelte';
	import { calculate1601EQ, form1601EQRows, validate1601EQ } from './form-1601-eq-rules';
	import { get1601EQATCDescription } from './form-1601-eq-atcs';

	let { values, errors = {}, onchange }: {
		values: Record<string, string>;
		errors?: Record<string, string>;
		onchange: (patch: Record<string, string>) => void;
	} = $props();

	const prefix = 'frm1601EQ:';
	const parts = ['txtATC', 'txtTaxBase', 'txtTaxRate', 'txtTaxWithheld'];
	const currency = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
	const rows: number[] = $derived(form1601EQRows.filter(line => parts.some(part => {
		const value = values[prefix + part + line]?.trim();
		return value && (part === 'txtATC' || Number(value.replaceAll(',', '')) !== 0);
	})));
	const calculated = $derived(calculate1601EQ(values));
	let open = $state(false);
	let line = $state(13);
	let isNew = $state(true);
	let draft = $state<Record<string, string>>({});
	let draftErrors = $state<Record<string, string>>({});
	let removed = $state<Record<string, string> | null>(null);
	let dragging = $state<number | null>(null);
	let previewRows = $state<number[] | null>(null);
	let rowKeys = $state<Record<number, number>>(Object.fromEntries(form1601EQRows.map(row => [row, row])));
	let nextKey = 19;
	let removedKeys: Record<number, number> | null = null;
	let listElement = $state<HTMLOListElement>();
	let pointerSession: { id: number; row: number; startY: number; offset: number; left: number; width: number; height: number; centers: { row: number; center: number }[] } | null = null;
	let dragPosition = $state<{ left: number; top: number; width: number; height: number } | null>(null);
	const displayRows = $derived(previewRows ?? rows);
	let announcement = $state('');
	let returnFocus: HTMLElement | null = null;
	const draftCalculated = $derived(calculate1601EQ({ ...values, ...draft }));
	const title = $derived(isNew ? 'New line item' : `Edit line item ${rows.indexOf(line) + 1}`);

	function snapshot(source = values) {
		return Object.fromEntries(form1601EQRows.flatMap(row => parts.map(part => [prefix + part + row, source[prefix + part + row] || ''])));
	}

	function setRowKeys(keys: number[]) {
		rowKeys = Object.fromEntries(form1601EQRows.map((row, index) => [row, keys[index] ?? nextKey++]));
	}

	function orderedPatch(ordered: string[][]) {
		return Object.fromEntries(form1601EQRows.flatMap((row, index) => parts.map((part, partIndex) => [prefix + part + row, ordered[index]?.[partIndex] || ''])));
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

	function edit(row?: number, field?: string, opener?: HTMLElement) {
		if (open) return;
		const target = row ?? form1601EQRows.find(slot => !rows.includes(slot));
		if (target === undefined) return;
		returnFocus = opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
		line = target;
		isNew = row === undefined;
		draft = Object.fromEntries(parts.map(part => [prefix + part + line, isNew ? '' : values[prefix + part + line] || '']));
		draftErrors = isNew ? {} : Object.fromEntries(parts.flatMap(part => errors[prefix + part + line] ? [[prefix + part + line, errors[prefix + part + line]]] : []));
		open = true;
		void focus(field || prefix + 'txtATC' + line);
	}

	function close() {
		open = false;
		draft = {};
		draftErrors = {};
		void tick().then(() => (returnFocus?.isConnected ? returnFocus : document.getElementById('add-atc-row'))?.focus());
	}

	function update(patch: Record<string, string>) {
		draft = { ...draft, ...patch };
		draftErrors = Object.fromEntries(Object.entries(draftErrors).filter(([id]) => !(id in patch)));
	}

	function commit() {
		const candidate = { ...values, ...draft };
		const validation = validate1601EQ(candidate);
		draftErrors = Object.fromEntries(parts.flatMap(part => {
			const id = prefix + part + line;
			return validation[id] ? [[id, validation[id]]] : [];
		}));
		const baseId = prefix + 'txtTaxBase' + line;
		const atcId = prefix + 'txtATC' + line;
		if (!draft[atcId]?.trim()) draftErrors[atcId] = 'Enter an expanded withholding ATC, such as WI010 or WC010.';
		const base = normalizeCurrencyInput(draft[baseId] || '');
		if (base === null || !Number.isFinite(Number(base)) || Number(base) <= 0) {
			draftErrors[baseId] = 'Enter a tax base greater than zero.';
		}
		if (Object.keys(draftErrors).length) {
			void focus(Object.keys(draftErrors)[0]);
			return;
		}
		const next = calculate1601EQ(candidate);
		const item = parts.map(part => next[prefix + part + line] || '');
		if (isNew) setRowKeys([...rows.map(row => rowKeys[row]), nextKey++]);
		onchange(isNew
			? orderedPatch([...rows.map(row => parts.map(part => values[prefix + part + row] || '')), item])
			: Object.fromEntries(parts.map((part, index) => [prefix + part + line, item[index]])));
		removed = null;
		announcement = isNew ? 'Line item added.' : 'Line item updated.';
		close();
	}

	function remove(row: number) {
		removed = snapshot();
		removedKeys = { ...rowKeys };
		onchange(Object.fromEntries(parts.map(part => [prefix + part + row, ''])));
		announcement = 'Line item removed.';
		void focus('add-atc-row');
	}

	function undo() {
		if (!removed) return;
		if (removedKeys) rowKeys = removedKeys;
		onchange(removed);
		removed = null;
		announcement = 'Line item restored.';
	}

	function move(from: number, to: number) {
		if (open || from === to || from < 0 || to < 0 || from >= rows.length || to >= rows.length) return;
		const ordered = rows.map(row => parts.map(part => values[prefix + part + row] || ''));
		const [item] = ordered.splice(from, 1);
		ordered.splice(to, 0, item);
		const keys = rows.map(row => rowKeys[row]);
		const [key] = keys.splice(from, 1);
		keys.splice(to, 0, key);
		setRowKeys(keys);
		onchange(orderedPatch(ordered));
		removed = null;
		announcement = `Line item moved to position ${to + 1} of ${rows.length}.`;
		void focus(`drag-atc-${form1601EQRows[to]}`);
	}

	function startPointer(event: PointerEvent, row: number) {
		if (!listElement || open || rows.length < 2 || event.button !== 0 || !event.isPrimary || pointerSession) return;
		const grip = event.currentTarget as HTMLButtonElement;
		if (grip.matches(':disabled')) return;
		event.preventDefault();
		grip.focus({ preventScroll: true });
		const card = grip.closest('li')!.getBoundingClientRect();
		pointerSession = {
			id: event.pointerId, row, startY: event.clientY, offset: event.clientY - card.top,
			left: card.left, width: card.width, height: card.height,
			centers: Array.from(listElement.children).map((element, index) => { const bounds = element.getBoundingClientRect(); return { row: rows[index], center: bounds.top + bounds.height / 2 }; })
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
		const next = rows.filter(row => row !== session.row);
		const target = session.centers.filter(point => point.row !== session.row).findIndex(point => event.clientY < point.center);
		next.splice(target === -1 ? next.length : target, 0, session.row);
		if (!previewRows || next.some((row, index) => row !== previewRows![index])) previewRows = next;
	}

	function finishPointer(event?: PointerEvent) {
		const session = pointerSession;
		if (!listElement || !session || (event && event.pointerId !== session.id)) return;
		const from = rows.indexOf(session.row);
		const to = previewRows?.indexOf(session.row) ?? from;
		const bounds = listElement.getBoundingClientRect();
		const inside = event && event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top - 24 && event.clientY <= bounds.bottom + 24;
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

	function dragPortal(node: HTMLElement) {
		document.body.appendChild(node);
		return () => node.remove();
	}

	function reorderKey(event: KeyboardEvent, index: number) {
		if (pointerSession) return;
		if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
		event.preventDefault();
		const target = event.key === 'Home' ? 0 : event.key === 'End' ? rows.length - 1 : index + (event.key === 'ArrowUp' ? -1 : 1);
		move(index, target);
	}

	function keydown(event: KeyboardEvent) {
		if (pointerSession && event.key === 'Escape') { event.preventDefault(); cancelPointer(); return; }
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'i') {
			if (event.defaultPrevented || values[prefix + 'optTaxesWithheld'] !== 'Y' || document.querySelector('dialog[open]')) return;
			const add = document.getElementById('add-atc-row') as HTMLButtonElement | null;
			if (!add || add.matches(':disabled')) return;
			event.preventDefault();
			add.focus();
			edit();
		}
		if (open && event.key === 'Enter' && !event.defaultPrevented && !event.isComposing && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey && event.target instanceof HTMLInputElement) {
			event.preventDefault();
			commit();
		}
	}

	// Error-summary links retain the legacy field IDs while their inputs live in the sheet.
	function errorLink(event: MouseEvent) {
		const anchor = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
		if (!anchor) return;
		const id = decodeURIComponent(anchor.getAttribute('href')!.slice(1));
		const match = id.match(/^frm1601EQ:txt(ATC|TaxBase|TaxRate|TaxWithheld)(1[3-8])$/);
		if (!match || values[prefix + 'optTaxesWithheld'] !== 'Y') return;
		event.preventDefault();
		const row = Number(match[2]);
		edit(rows.includes(row) ? row : undefined, id);
	}

	function money(value: string | undefined) {
		const normalized = normalizeCurrencyInput(value || '');
		return normalized === null ? '—' : currency.format(Number(normalized || 0));
	}
</script>

<svelte:window onkeydown={keydown} onblur={cancelPointer} />
<svelte:document onclick={errorLink} onscrollcapture={cancelPointer} />

{#snippet gripIcon()}
	<svg width="16" height="24" viewBox="0 0 16 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="6" r="1.5" /><circle cx="11" cy="6" r="1.5" /><circle cx="5" cy="12" r="1.5" /><circle cx="11" cy="12" r="1.5" /><circle cx="5" cy="18" r="1.5" /><circle cx="11" cy="18" r="1.5" /></svg>
{/snippet}

{#snippet rowSummary(row: number, index: number)}
	{@const atc = values[prefix + 'txtATC' + row] || ''}
	{@const invalid = parts.some(part => errors[prefix + part + row])}
	<span class="identity"><span class="ordinal">{index + 1}</span><strong>{atc || 'ATC not selected'}</strong><span class="rate">{calculated[prefix + 'txtTaxRate' + row] ? `${calculated[prefix + 'txtTaxRate' + row]}%` : 'Rate unavailable'}</span></span>
	<span class="description">{atc ? get1601EQATCDescription(atc, values[prefix + 'optCategory']) : 'Choose an ATC to complete this line.'}</span>
	<span class="amounts"><span>Tax base <b>{money(values[prefix + 'txtTaxBase' + row])}</b></span><span>Tax withheld <b>{normalizeCurrencyInput(values[prefix + 'txtTaxBase' + row] || '') === null ? '—' : money(calculated[prefix + 'txtTaxWithheld' + row])}</b></span></span>
	{#if invalid}<span class="error">Review this line item.</span>{/if}
{/snippet}

{#if dragging !== null && dragPosition}
	<div {@attach dragPortal} class="item drag-preview" aria-hidden="true"
		style:width={`${dragPosition.width}px`} style:min-height={`${dragPosition.height}px`}
		style:transform={`translate3d(${dragPosition.left}px, ${dragPosition.top}px, 0)`}>
		<span class="grip">{@render gripIcon()}</span>
		<div class="item-details">{@render rowSummary(dragging, rows.indexOf(dragging))}</div>
		<span class="row-actions"><TrashBinTrash size={18} color="currentColor" /></span>
	</div>
{/if}

<section aria-label="Taxes withheld" class="eq-section">
	<header class="eq-section-header">
		<h2>Taxes withheld</h2>
		{#if values[prefix + 'optTaxesWithheld'] === 'Y'}<span class="count">{rows.length} / 6 line items</span>{/if}
	</header>
	{#if values[prefix + 'optTaxesWithheld'] === 'Y'}
		{#if rows.length === 0}
			<div class="empty">
				<span class="empty-icon" aria-hidden="true"><BillList size={28} color="currentColor" /></span>
				<p class="empty-title">No line items yet</p>
				<p>Add an ATC and tax base to record taxes withheld.</p>
				<Button id="add-atc-row" aria-label="Add first line item" variant="secondary" size="sm" onclick={(event) => edit(undefined, undefined, event.currentTarget)} aria-keyshortcuts="Meta+i Control+i">Add first line item <kbd>⌘/Ctrl+I</kbd></Button>
			</div>
		{:else}
			<p id="atc-drag-help" class="help">Drag the grip to reorder. With the grip focused, use ↑ or ↓.</p>
			<ol bind:this={listElement} aria-label="ATC line items" class="items" onpointermove={movePointer} onpointerup={finishPointer} onpointercancel={cancelPointer} onlostpointercapture={cancelPointer}>
				{#each displayRows as row, index (rowKeys[row])}
					{@const invalid = parts.some(part => errors[prefix + part + row])}
					<li animate:flip={{ duration: prefersReducedMotion.current ? 0 : 180, easing: cubicOut }} class={['item', dragging === row && 'dragging', invalid && 'invalid']}>
						<button id={`drag-atc-${row}`} type="button" class="grip" disabled={rows.length < 2}
							aria-label={`Drag line item ${index + 1}`} aria-describedby="atc-drag-help"
							onpointerdown={(event) => startPointer(event, row)} onkeydown={(event) => reorderKey(event, index)}>
							{@render gripIcon()}
						</button>
						<button type="button" class="item-details" aria-label={`Edit line item ${index + 1}`} onclick={(event) => edit(row, undefined, event.currentTarget)}>
							{@render rowSummary(row, index)}
						</button>
						<div class="row-actions">
							<Button variant="ghost" size="icon" aria-label={`Remove line item ${index + 1}`} title="Remove line item" onclick={() => remove(row)}><TrashBinTrash size={18} color="currentColor" aria-hidden="true" /></Button>
						</div>
					</li>
				{/each}
			</ol>
			<div class="add-row"><Button id="add-atc-row" aria-label="Add line item" variant="secondary" size="sm" disabled={rows.length >= 6} onclick={(event) => edit(undefined, undefined, event.currentTarget)} aria-keyshortcuts="Meta+i Control+i">Add line item <kbd>⌘/Ctrl+I</kbd></Button>{#if rows.length >= 6}<span class="help">All six ATC lines are in use.</span>{/if}</div>
		{/if}
		{#if removed}<div class="eq-undo"><span>Line item removed.</span><Button variant="ghost" size="sm" onclick={undo}>Undo</Button></div>{/if}
		{#if rows.length === 0 && errors[prefix + 'txtATC13']}<p class="error">{errors[prefix + 'txtATC13']}</p>{/if}
	{:else if values[prefix + 'optTaxesWithheld'] === 'N'}
		<p class="eq-muted">No taxes withheld this quarter.</p>
	{:else}
		<p class="eq-muted">Choose whether taxes were withheld.</p>
	{/if}
	<p class="sr-only" role="status">{announcement}</p>
</section>

<Sheet {open} onOpenChange={(next) => { if (!next) close(); }} {title} description="Choose an ATC and enter its tax base. Add or update to apply this line to the return." size="md">
	{#if open}
		<fieldset class="editor-fields" aria-label={`ATC row ${line - 12}`}>
			<AtcPicker id={prefix + 'txtATC' + line} value={draft[prefix + 'txtATC' + line] || ''} category={values[prefix + 'optCategory'] || ''} year={Number(values[prefix + 'txtYear'])}
				error={draftErrors[prefix + 'txtATC' + line] || ''} onchange={(code) => update({ [prefix + 'txtATC' + line]: code, [prefix + 'txtTaxRate' + line]: '' })} />
			<CurrencyInput id={prefix + 'txtTaxBase' + line} label="Tax Base" required value={draft[prefix + 'txtTaxBase' + line] || ''}
				error={draftErrors[prefix + 'txtTaxBase' + line] || ''} onchange={(value) => update({ [prefix + 'txtTaxBase' + line]: value })} />
			<CalculatedValue id={prefix + 'txtTaxRate' + line} label="Rate (%)" source="From ATC" value={draftCalculated[prefix + 'txtTaxRate' + line] ? `${draftCalculated[prefix + 'txtTaxRate' + line]}%` : ''} />
			<CalculatedValue id={prefix + 'txtTaxWithheld' + line} label="Tax withheld" for={prefix + 'txtTaxBase' + line} value={normalizeCurrencyInput(draft[prefix + 'txtTaxBase' + line] || '') === null ? '' : money(draftCalculated[prefix + 'txtTaxWithheld' + line])} />
		</fieldset>
	{/if}
	{#snippet footer()}<div class="editor-actions"><Button variant="secondary" onclick={close}>Cancel</Button><Button onclick={commit}>{isNew ? 'Add' : 'Update'}</Button></div>{/snippet}
</Sheet>

<style>
	.count, .help, .empty > p, .description, .amounts, .rate { color: var(--fg-muted); font-size: .8rem; }
	.count { white-space: nowrap; font-variant-numeric: tabular-nums; }
	.empty { display: grid; justify-items: center; gap: .75rem; padding: 2.5rem 1rem; border: 1px dashed var(--border); border-radius: 10px; background: var(--bg); text-align: center; }
	.empty-icon { display: grid; width: 2.5rem; height: 2.5rem; place-items: center; border: 1px solid var(--border); border-radius: .5rem; color: var(--fg-muted); font-size: 1.5rem; }
	.empty .empty-title { color: var(--fg); font-size: .95rem; font-weight: 600; }
	kbd { margin-left: .4rem; color: var(--fg-subtle); font-family: var(--font-sans); font-size: .7rem; }
	.help { margin-bottom: .75rem; }
	.items { display: grid; gap: .5rem; margin: 0; padding: 0; list-style: none; }
	.item { display: grid; grid-template-columns: 2rem minmax(0, 1fr) auto; gap: .375rem; align-items: start; padding: .625rem; border: 1px solid var(--border-soft); border-radius: 8px; background: var(--bg-elev); }
	.item.dragging { opacity: .3; border-color: var(--accent); }
	.drag-preview { position: fixed; top: 0; left: 0; z-index: 100; pointer-events: none; box-shadow: 0 12px 32px rgb(0 0 0 / .25); border-color: var(--accent); }
	.drag-preview .item-details { cursor: grabbing; }
	.item.invalid { border-color: var(--danger); }
	.grip { display: grid; width: 2rem; height: 2.5rem; place-items: center; border: 1px solid transparent; border-radius: 4px; color: var(--fg-muted); background: transparent; font-size: 1.5rem; cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; }
	.grip:active { cursor: grabbing; }
	.grip:disabled { opacity: .35; cursor: default; }
	.item-details { display: grid; min-width: 0; gap: .5rem; padding: .5rem; border: 1px solid transparent; border-radius: 4px; background: transparent; color: var(--fg); text-align: left; cursor: pointer; }
	.item-details:hover:not(:focus-visible), .grip:hover:not(:disabled):not(:focus-visible) { background: var(--bg-hover); }
	.item-details:focus-visible, .grip:focus-visible { outline: none; border-color: var(--field-focus-border); box-shadow: 0 0 0 3px var(--field-focus-halo); }
	.identity { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; font-size: .875rem; }
	.ordinal { color: var(--fg-subtle); font-size: .75rem; }
	.rate { margin-left: auto; font-variant-numeric: tabular-nums; }
	.description { display: -webkit-box; overflow: hidden; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: anywhere; line-height: 1.5; }
	.amounts { display: flex; flex-wrap: wrap; gap: .5rem 1.5rem; }
	.amounts > span { display: grid; gap: .125rem; }
	.amounts b { color: var(--fg); font-weight: 500; font-variant-numeric: tabular-nums; }
	.row-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: end; gap: .125rem; }
	.add-row { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; margin-top: .875rem; }
	.add-row .help { margin: 0; }
	.error { color: var(--danger); font-size: .8rem; }
	.editor-fields { display: grid; gap: var(--form-field-row-gap); min-width: 0; margin: 0; padding: 1.25rem; border: 0; }
	.editor-actions { display: flex; justify-content: end; gap: .5rem; }
	@media (forced-colors: active) { .item-details:focus-visible, .grip:focus-visible { outline: 2px solid Highlight; box-shadow: none; } }
</style>
