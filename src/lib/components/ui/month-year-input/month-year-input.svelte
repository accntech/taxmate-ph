<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import * as stylex from '@stylexjs/stylex';
	import { createSegmentFocus } from '../utils/segment-focus';
	import { calendar as calendarLayout } from '../date-input/date-calendar.styles';
	import { dateField } from '../date-input/date-field.styles';
	import { dateInput } from '../date-input/date-input.styles';
	import FieldErrors from '../field-errors/field-errors.svelte';
	import Label from '../label/label.svelte';
	import Back from '@solar-icons/svelte-v2/linear/alt-arrow-left';
	import Forward from '@solar-icons/svelte-v2/linear/alt-arrow-right';
	import DateCalendarTrigger from '../date-input/date-calendar-trigger.svelte';
	import { containDatePopoverTab, datePopoverIntro, datePopoverOutro, focusDatePopover, getPopoverPortalParent, place, type Side } from '../date-input/date-popover';
	import { calendarMonths, monthNumber, splitMonthYear } from './month-year';

	let {
		id, alternateId, label, month = '', year = '', value, yearDigits = 4, fixedMonth = '',
		required = false, disabled = false, error = '', minYear, maxYear,
		onchange, onvaluechange
	}: {
		id: string;
		alternateId?: string;
		label: string;
		month?: string;
		year?: string;
		value?: string;
		yearDigits?: 2 | 4;
		fixedMonth?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		minYear?: number;
		maxYear?: number;
		onchange?: (month: string, year: string) => void;
		onvaluechange?: (value: string) => void;
	} = $props();

	const uid = $props.id();
	const format = $derived(yearDigits === 4 ? 'MM/YYYY' : 'MM/YY');
	const earliest = $derived(minYear ?? (yearDigits === 2 ? 0 : 1));
	const latest = $derived(maxYear ?? (yearDigits === 2 ? 99 : 9999));
	const stored = $derived(value ?? (fixedMonth ? year : month || year ? `${month}/${year}` : ''));
	const selection = $derived(splitMonthYear(stored, ''));
	let edit = $state<{ text: string; fixedMonth: string; error: string }>();
	const activeEdit = $derived(edit?.fixedMonth === fixedMonth ? edit : undefined);
	let open = $state(false);
	let placement = $state<Side>('bottom');
	let restoreFocus: HTMLElement | undefined;
	let pickerYear = $state('');
	let focusedMonth = $state(0);
	let pickerElement: HTMLElement | undefined;
	let field: HTMLDivElement;
	const message = $derived(error || activeEdit?.error || '');
	type EntrySegment = 'month' | 'year';
	const order = ['month', 'year'] as const;
	const elements: Partial<Record<EntrySegment, HTMLInputElement>> = {};
	const segmentFocus = createSegmentFocus(order, segment => elements[segment]);
	const entry = $derived(splitMonthYear(activeEdit?.text ?? stored, fixedMonth));
	const monthId = $derived(value !== undefined ? id : alternateId ?? `${uid}-month`);
	const yearId = $derived(value !== undefined ? `${uid}-year` : id);

	$effect(() => {
		const monthLock = fixedMonth;
		if (disabled || monthLock) open = false;
		untrack(() => {
			if (edit && edit.fixedMonth !== monthLock) edit = undefined;
		});
	});

	function validYear(candidate: string) {
		return /^\d+$/.test(candidate) && candidate.length === yearDigits &&
			Number(candidate) >= earliest && Number(candidate) <= latest;
	}

	function validMonth(candidate: string) {
		return /^(0[1-9]|1[0-2])$/.test(candidate);
	}

	function commit(m: string, y: string, raw: string) {
		if (onvaluechange) {
			if (raw !== value) onvaluechange(raw);
		} else if (m !== month || y !== year) {
			onchange?.(m, y);
		}
	}

	function finishEntry() {
		if (!activeEdit) return;
		const raw = activeEdit.text.trim();
		const parts = splitMonthYear(raw, fixedMonth);
		const normalMonth = parts.month.padStart(2, '0');
		const accepted = !raw || (validMonth(normalMonth) && validYear(parts.year));
		if (accepted) {
			const nextMonth = fixedMonth || (raw ? normalMonth : '');
			const next = fixedMonth ? parts.year : raw ? `${nextMonth}/${parts.year}` : '';
			edit = undefined;
			commit(nextMonth, parts.year, next);
			return;
		}
		const hint = fixedMonth ? `Enter a ${yearDigits}-digit year.` : `Enter a valid month and year as ${format}.`;
		const outsideYearRange = /^\d+$/.test(parts.year) && parts.year.length === yearDigits && !validYear(parts.year);
		const range = `Enter a year from ${String(earliest).padStart(yearDigits, '0')} to ${String(latest).padStart(yearDigits, '0')}.`;
		edit = { text: raw, fixedMonth, error: outsideYearRange ? range : hint };
		const draftMonth = validMonth(normalMonth) ? normalMonth : '';
		const draftYear = /^\d*$/.test(parts.year) && parts.year.length <= yearDigits ? parts.year : '';
		commit(draftMonth, draftYear, raw);
	}

	function setDraft({ month, year }: { month: string; year: string }) {
		const text = fixedMonth ? year : month || year ? `${month}/${year}` : '';
		edit = { text, fixedMonth, error: '' };
	}

	function changeSegment(segment: EntrySegment, value: string) {
		setDraft({ ...entry, [segment]: value });
	}

	function completeSegment(segment: EntrySegment) {
		const value = entry[segment];
		if (segment === 'month' && /^[1-9]$/.test(value)) changeSegment(segment, value.padStart(2, '0'));
		if (segment === 'year' && yearDigits === 4 && /^\d{1,2}$/.test(value)) {
			changeSegment(segment, String(2000 + Number(value)));
		}
	}

	function bulkEntry(event: InputEvent) {
		if (fixedMonth || event.isComposing || !event.data) return;
		if (event.inputType !== 'insertText' && event.inputType !== 'insertFromPaste') return;
		const text = event.data.trim();
		const fullPeriod = /^\d{0,2}\s*\/\s*\d*$/.test(text) || (/^\d+$/.test(text) && text.length === yearDigits + 2);
		if (text.length <= 1 || !fullPeriod) return;
		event.preventDefault();
		setDraft(splitMonthYear(text, ''));
	}

	function typeSegment(segment: EntrySegment, event: Event & { currentTarget: HTMLInputElement }) {
		const size = segment === 'month' ? 2 : yearDigits;
		const value = event.currentTarget.value.replace(/\D/g, '').slice(0, size);
		const done = value.length === size || (segment === 'month' && Number(value) > 1);
		const shown = done && segment === 'month' ? value.padStart(2, '0') : value;
		changeSegment(segment, shown);
		event.currentTarget.value = shown;
		if (done && segment === 'month') segmentFocus.advanceFrom(segment);
		else if (done) event.currentTarget.select();
	}

	function stepSegment(segment: EntrySegment, direction: number) {
		const value = entry[segment];
		const min = segment === 'month' ? 1 : earliest;
		const max = segment === 'month' ? 12 : latest;
		const candidate = value ? Number(value) + direction : NaN;
		const next = candidate >= min && candidate <= max ? candidate : direction > 0 ? min : max;
		changeSegment(segment, String(next).padStart(segment === 'month' ? 2 : yearDigits, '0'));
		void tick().then(() => { if (document.activeElement === elements[segment]) elements[segment]?.select(); });
	}

	function handleSegmentKey(segment: EntrySegment, event: KeyboardEvent) {
		if (event.isComposing) return;
		if (event.altKey && event.key === 'ArrowDown' && !fixedMonth) {
			event.preventDefault();
			if (!open) toggle(elements[segment]);
			return;
		}
		if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return;
		switch (event.key) {
			case 'Enter':
				completeSegment(segment);
				finishEntry();
				break;
			case 'ArrowUp':
			case 'ArrowDown':
				stepSegment(segment, event.key === 'ArrowUp' ? 1 : -1);
				break;
			case 'ArrowLeft':
				segmentFocus.retreatFrom(segment);
				break;
			case 'ArrowRight':
			case '/':
			case '-':
			case ' ':
				completeSegment(segment);
				segmentFocus.advanceFrom(segment);
				break;
			case 'Backspace':
				if (entry[segment]) changeSegment(segment, entry[segment].slice(0, -1));
				else segmentFocus.retreatFrom(segment);
				break;
			case 'Delete':
				changeSegment(segment, '');
				break;
			default:
				return;
		}
		event.preventDefault();
	}

	function finishWhenLeaving(event: FocusEvent) {
		if (event.relatedTarget instanceof Node && field.contains(event.relatedTarget)) return;
		finishEntry();
	}

	function defaultPickerYear() {
		const candidate = splitMonthYear(activeEdit?.text ?? stored, fixedMonth).year;
		if (validYear(candidate)) return candidate;
		const thisYear = new Date().getFullYear() % (10 ** yearDigits);
		return String(Math.min(latest, Math.max(earliest, thisYear))).padStart(yearDigits, '0');
	}

	function closePicker() {
		if (!open) return;
		open = false;
		restoreFocus?.focus();
	}

	function toggle(trigger?: HTMLElement) {
		if (disabled || fixedMonth) return;
		if (open) {
			closePicker();
			return;
		}
		finishEntry();
		restoreFocus = trigger;
		pickerYear = defaultPickerYear();
		focusedMonth = validMonth(selection.month) ? Number(selection.month) - 1 : new Date().getMonth();
		open = true;
		void tick().then(() => { if (open && pickerElement) focusDatePopover(pickerElement); });
	}

	function stepYear(step: number) {
		const current = validYear(pickerYear) ? pickerYear : defaultPickerYear();
		pickerYear = String(Math.min(latest, Math.max(earliest, Number(current) + step))).padStart(yearDigits, '0');
	}

	function selectMonth(m: string) {
		if (!validYear(pickerYear)) return;
		edit = undefined;
		commit(m, pickerYear, `${m}/${pickerYear}`);
		closePicker();
	}

	function attachPicker(node: HTMLElement) {
		pickerElement = node;
		getPopoverPortalParent(field, document.body).appendChild(node);
		node.showPopover?.();

		function reposition() {
			const position = place(field.getBoundingClientRect(), {
				width: node.offsetWidth, height: node.offsetHeight
			}, {
				width: window.innerWidth, height: window.innerHeight
			});
			placement = position.side;
			node.style.top = `${position.top}px`;
			node.style.left = `${position.left}px`;
		}

		reposition();
		function onOutside(event: PointerEvent) {
			if (event.target instanceof Node && !node.contains(event.target) && !field.contains(event.target)) closePicker();
		}

		function onPickerKey(event: KeyboardEvent) {
			if (!open) return;
			if (event.key === 'Escape') {
				event.preventDefault();
				event.stopPropagation();
				closePicker();
			} else {
				containDatePopoverTab(event, node);
			}
		}

		window.addEventListener('resize', reposition);
		window.addEventListener('scroll', reposition, true);
		document.addEventListener('pointerdown', onOutside, true);
		document.addEventListener('keydown', onPickerKey, true);
		return () => {
			window.removeEventListener('resize', reposition);
			window.removeEventListener('scroll', reposition, true);
			document.removeEventListener('pointerdown', onOutside, true);
			document.removeEventListener('keydown', onPickerKey, true);
			if (pickerElement === node) pickerElement = undefined;
			node.remove();
		};
	}

	function pickerIntro(_node: Element) { return datePopoverIntro(placement, prefersReducedMotion.current); }
	function pickerOutro(_node: Element) { return datePopoverOutro(prefersReducedMotion.current); }

	function moveMonthFocus(event: KeyboardEvent, index: number) {
		const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 };
		const step = steps[event.key];
		if (step === undefined || !(event.currentTarget instanceof HTMLButtonElement)) return;
		const next = Math.max(0, Math.min(11, index + step));
		const buttons = event.currentTarget.parentElement?.querySelectorAll('button');
		if (!buttons?.[next]?.disabled) buttons?.[next]?.focus();
		event.preventDefault();
	}
</script>

<div class="month-year" data-slot="month-year-input">
	<Label id={`${uid}-label`} for={fixedMonth ? yearId : monthId} class="month-year-label">
		{label}{#if required}<span class="required" aria-hidden="true">*</span>{/if}
	</Label>
	<div class={['period-field', stylex.attrs(dateField.medium).class, { invalid: !!message, disabled }]}
		role="group" aria-labelledby={`${uid}-label`} bind:this={field} onfocusout={finishWhenLeaving}>
		<div class={stylex.attrs(dateField.segments).class}>
			{#each order as segment (segment)}
				{#if segment === 'year'}
					<span class={stylex.attrs(dateField.mutedSegment).class} aria-hidden="true">/</span>
				{/if}
				{#if segment === 'month' && fixedMonth}
					<span class={stylex.attrs(dateField.mutedSegment).class} aria-hidden="true">{fixedMonth}</span>
				{:else}
					<input
						{@attach (element) => {
							elements[segment] = element;
							return () => { delete elements[segment]; };
						}}
						class={['entry-segment', stylex.attrs(dateField.segment, segment === 'month' || yearDigits === 2 ? dateField.shortSegment : dateField.year).class]}
						type="text"
						role="spinbutton"
						id={segment === 'month' ? monthId : yearId}
						data-field-alias={fixedMonth ? alternateId : undefined}
						aria-label={segment === 'month' ? 'Month' : 'Year'}
						aria-valuemin={segment === 'month' ? 1 : earliest}
						aria-valuemax={segment === 'month' ? 12 : latest}
						aria-valuenow={entry[segment] ? Number(entry[segment]) : undefined}
						aria-required={required || undefined}
						aria-invalid={!!message || undefined}
						aria-describedby={message ? `${uid}-format ${uid}-error` : `${uid}-format`}
						value={entry[segment]}
						placeholder={segment === 'month' ? 'MM' : 'Y'.repeat(yearDigits)}
						maxlength={segment === 'month' ? 2 : yearDigits}
						inputmode="numeric"
						autocomplete="off"
						{disabled}
						onfocus={(event) => event.currentTarget.select()}
						onbeforeinput={bulkEntry}
						oninput={(event) => typeSegment(segment, event)}
						onblur={() => completeSegment(segment)}
						onkeydown={(event) => handleSegmentKey(segment, event)}
					/>
				{/if}
			{/each}
		</div>
		{#if !fixedMonth}
			<DateCalendarTrigger class="picker-trigger" {disabled} label="Choose month and year"
				open={open && !disabled} controls={`${uid}-picker`} ontrigger={toggle} />
		{/if}
	</div>
	<span class="period-description" id={`${uid}-format`}>
		{#if fixedMonth}
			Month fixed to {calendarMonths[Number(fixedMonth) - 1]}. Enter the year.
		{:else}
			Enter the month and year as {format}. Use Tab or Left and Right to switch parts, and Up and Down to adjust. Alt plus Down opens the picker.
		{/if}
	</span>
	{#if message}<FieldErrors id={`${uid}-error`} errors={[message]} />{/if}

	{#if open && !disabled && !fixedMonth}
		<div {@attach attachPicker} id={`${uid}-picker`} popover="manual"
			role="dialog" aria-label="Choose month and year"
			class={['period-picker', stylex.attrs(dateInput.calendar, calendarLayout.root, placement === 'top' ? dateInput.above : dateInput.below).class]}
			in:pickerIntro out:pickerOutro>
			<div class={['period-picker-header', stylex.attrs(calendarLayout.header).class]}>
				<button type="button" class={stylex.attrs(calendarLayout.navigationButton).class} aria-label="Previous year"
					disabled={validYear(pickerYear) && Number(pickerYear) === earliest} onclick={() => stepYear(-1)}>
					<Back size={16} aria-hidden="true" />
				</button>
				<input bind:value={pickerYear} type="text" aria-label="Year"
					aria-invalid={!validYear(pickerYear) || undefined} inputmode="numeric" maxlength={yearDigits} autocomplete="off" />
				<button type="button" class={stylex.attrs(calendarLayout.navigationButton).class} aria-label="Next year"
					disabled={validYear(pickerYear) && Number(pickerYear) === latest} onclick={() => stepYear(1)}>
					<Forward size={16} aria-hidden="true" />
				</button>
			</div>
			<div class={stylex.attrs(calendarLayout.periods).class} role="group" aria-label="Months">
				{#each calendarMonths as name, index (name)}
					{@const candidate = monthNumber(index)}
					<button type="button" aria-label={`${name} ${pickerYear}`}
						class={stylex.attrs(calendarLayout.period).class}
						data-selected={candidate === selection.month && pickerYear === selection.year ? 'true' : undefined}
						aria-pressed={candidate === selection.month && pickerYear === selection.year}
						tabindex={index === focusedMonth ? 0 : -1}
						onfocus={() => { focusedMonth = index; }}
						disabled={!validYear(pickerYear)}
						onclick={() => selectMonth(candidate)} onkeydown={(event) => moveMonthFocus(event, index)}>
						{name.slice(0, 3)}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.month-year { display: grid; min-width: 0; gap: var(--form-label-gap, .5rem); }
	.period-description { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
	.month-year :global(.month-year-label) { color: var(--fg-muted); }
	.required { color: var(--danger); margin-inline-start: .25rem; }
	.period-field {
		display: flex; min-width: 0; align-items: center;
		border: 1px solid var(--border); border-radius: var(--radius-md);
		background: var(--bg-input); color: var(--fg);
	}
	.period-field:focus-within {
		border-color: var(--field-focus-border);
		background: var(--bg-elev);
		box-shadow: 0 0 0 3px var(--field-focus-halo);
	}
	.period-field.invalid { border-color: var(--field-error-border); }
	.period-field.invalid:has(.entry-segment:focus) { box-shadow: 0 0 0 3px var(--field-error-focus-halo); }
	.period-field.disabled { opacity: .6; }
	.entry-segment:focus-visible { outline: none; box-shadow: none; }
	.entry-segment::selection { color: var(--accent-fg); background: var(--accent); }
	.period-picker-header > input { font: inherit; font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
	button { cursor: pointer; }
	button:disabled { color: var(--fg-muted); cursor: default; opacity: .55; }

	.period-picker-header > input:focus-visible {
		outline: none;
		border-color: var(--field-focus-border);
		box-shadow: 0 0 0 3px var(--field-focus-halo);
	}
	.period-picker {
		inset: auto; margin: 0; color: var(--fg);
		max-width: calc(100vw - 1rem); max-height: calc(100vh - 1rem); overflow: auto;
	}
	.period-picker-header { gap: calc(var(--spacing) * 2); margin-bottom: var(--spacing); }
	.period-picker-header > input {
		width: 5rem; min-width: 0; height: calc(var(--spacing) * 7); text-align: center; background: transparent; font-size: 13px;
		border: 1px solid var(--border); border-radius: var(--radius-md);
	}
	.period-picker-header > input[aria-invalid="true"] { border-color: var(--field-error-border); }
	.period-picker-header > input[aria-invalid="true"]:focus-visible { box-shadow: 0 0 0 3px var(--field-error-focus-halo); }
	@media (forced-colors: active) {
		.period-field:focus-within { outline: 2px solid Highlight; outline-offset: 2px; box-shadow: none; }
		.period-picker :is(button, input):focus-visible {
			outline: 2px solid Highlight; outline-offset: 1px; box-shadow: none;
		}
	}
	@media (pointer: coarse) {
		.period-field, .period-picker button, .period-picker-header > input { min-height: 2.75rem; }
		.period-field :global(.picker-trigger), .period-picker-header > button { min-width: 2.75rem; min-height: 2.75rem; }
	}
</style>
