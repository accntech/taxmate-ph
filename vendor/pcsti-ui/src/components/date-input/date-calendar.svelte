<script lang="ts">
  import { Icon as SolarIcon } from "../icon";

  import { glyphs } from "../../icons";

  import { calendar as calendarLayout } from "./date-calendar.styles";

  import * as stylex from "@stylexjs/stylex";
  import {
    parseIso,
    formatIso,
    daysInMonth,
    firstWeekdayOfMonth,
    addMonths,
    clampIso,
    isWithin,
    monthNames,
    weekdayNames,
  } from "./date-helpers";

  type Props = {
    value?: string;
    min?: string;
    max?: string;
    locale?: string;
    weekStartsOn?: 0 | 1;
    disabled?: boolean;
    onSelect: (iso: string) => void;
  };

  let {
    value = "",
    min,
    max,
    locale = "en-US",
    weekStartsOn = 0,
    disabled: calendarDisabled = false,
    onSelect,
  }: Props = $props();

  let view = $state<"days" | "months" | "years">("days");

  let cursorYear = $state(0);
  let cursorMonth = $state(0);
  let focusedIso = $state("");

  function initCursor() {
    const now = new Date();
    const today = formatIso(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
    );
    focusedIso = clampIso(parseIso(value) ? value : today, min, max);
    const parts = parseIso(focusedIso)!;
    cursorYear = parts.y;
    cursorMonth = parts.m;
  }

  initCursor();

  const months = $derived(monthNames(locale));
  const weekdays = $derived(weekdayNames(locale, weekStartsOn));
  const todayIso = (() => {
    const n = new Date();
    return formatIso(n.getFullYear(), n.getMonth() + 1, n.getDate());
  })();

  type Cell = {
    y: number;
    m: number;
    d: number;
    outside: boolean;
    iso: string;
  };

  const dayKeyMoves: Record<string, number> = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -7,
    ArrowDown: 7,
  };
  const pageKeyMoves: Record<string, number> = { PageUp: -1, PageDown: 1 };
  const weekEdgeOffsets: Record<string, number> = { Home: 0, End: 6 };

  const cells = $derived.by<Cell[]>(() => {
    const first = firstWeekdayOfMonth(cursorYear, cursorMonth);
    const lead = (first - weekStartsOn + 7) % 7;
    const thisLen = daysInMonth(cursorYear, cursorMonth);
    const prev = addMonths(cursorYear, cursorMonth, -1);
    const prevLen = daysInMonth(prev.y, prev.m);
    const out: Cell[] = [];
    for (let i = lead - 1; i >= 0; i--) {
      const d = prevLen - i;
      out.push({
        y: prev.y,
        m: prev.m,
        d,
        outside: true,
        iso: formatIso(prev.y, prev.m, d),
      });
    }
    for (let d = 1; d <= thisLen; d++) {
      out.push({
        y: cursorYear,
        m: cursorMonth,
        d,
        outside: false,
        iso: formatIso(cursorYear, cursorMonth, d),
      });
    }
    const next = addMonths(cursorYear, cursorMonth, 1);
    let d = 1;
    while (out.length < 42) {
      out.push({
        y: next.y,
        m: next.m,
        d,
        outside: true,
        iso: formatIso(next.y, next.m, d),
      });
      d++;
    }
    return out;
  });

  function stepMonth(delta: number) {
    const next = addMonths(cursorYear, cursorMonth, delta);
    const day = parseIso(focusedIso)!.d;
    setCursor(
      formatIso(next.y, next.m, Math.min(day, daysInMonth(next.y, next.m))),
    );
  }

  let gridEl = $state<HTMLDivElement | undefined>();

  function focusDayButton(iso: string) {
    queueMicrotask(() => {
      const el = gridEl?.querySelector<HTMLButtonElement>(
        `[data-iso="${iso}"]`,
      );
      el?.focus();
    });
  }

  function setCursor(iso: string) {
    focusedIso = clampIso(iso, min, max);
    const parts = parseIso(focusedIso)!;
    cursorYear = parts.y;
    cursorMonth = parts.m;
  }

  function moveFocus(iso: string) {
    setCursor(iso);
    focusDayButton(focusedIso);
  }

  function nextFocusedDate(delta: number): string {
    const parts = parseIso(focusedIso)!;
    let { y, m } = parts;
    let d = parts.d + delta;
    const monthLen = daysInMonth(y, m);
    if (d < 1) {
      ({ y, m } = addMonths(y, m, -1));
      d += daysInMonth(y, m);
    } else if (d > monthLen) {
      ({ y, m } = addMonths(y, m, 1));
      d -= monthLen;
    }
    return formatIso(y, m, d);
  }

  function handleDayMove(key: string): boolean {
    if (!(key in dayKeyMoves)) return false;
    moveFocus(nextFocusedDate(dayKeyMoves[key]));
    return true;
  }

  function handlePageMove(e: KeyboardEvent): boolean {
    const delta = pageKeyMoves[e.key];
    if (!delta) return false;
    stepMonth(e.shiftKey ? delta * 12 : delta);
    focusDayButton(focusedIso);
    return true;
  }

  function focusedCellIndex(): number {
    return cells.findIndex((c) => c.iso === focusedIso);
  }

  function handleWeekEdge(key: string): boolean {
    const offset = weekEdgeOffsets[key];
    if (offset === undefined) return false;
    const idx = focusedCellIndex();
    if (idx < 0) return true;
    const weekStart = idx - (idx % 7);
    const target = cells[weekStart + offset];
    moveFocus(target.iso);
    return true;
  }

  function handleDaysKeyAction(e: KeyboardEvent): boolean {
    return handleDayMove(e.key) || handlePageMove(e) || handleWeekEdge(e.key);
  }

  function onDaysKey(e: KeyboardEvent) {
    if (calendarDisabled) return;
    if (!handleDaysKeyAction(e)) return;
    e.preventDefault();
  }
</script>

<div class={[stylex.attrs(calendarLayout.root).class, "root"]}>
  <div class={[stylex.attrs(calendarLayout.header).class]}>
    {#if view === "days"}
      <button
        type="button"
        class={[stylex.attrs(calendarLayout.navigationButton).class]}
        aria-label="Previous month"
        disabled={calendarDisabled}
        onclick={() => stepMonth(-1)}
      >
        <span
          data-icon
          class={[stylex.attrs([calendarLayout.navigationIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.chevronLeft} /></span
        >
      </button>
      <button
        type="button"
        class={[stylex.attrs(calendarLayout.viewButton).class]}
        aria-label="Switch to months view"
        disabled={calendarDisabled}
        onclick={() => (view = "months")}
        >{months[cursorMonth - 1]} {cursorYear}</button
      >
      <button
        type="button"
        class={[stylex.attrs(calendarLayout.navigationButton).class]}
        aria-label="Next month"
        disabled={calendarDisabled}
        onclick={() => stepMonth(1)}
      >
        <span
          data-icon
          class={[stylex.attrs([calendarLayout.navigationIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.chevronRight} /></span
        >
      </button>
    {:else if view === "months"}
      <button
        type="button"
        class={[stylex.attrs(calendarLayout.navigationButton).class]}
        aria-label="Previous year"
        disabled={calendarDisabled}
        onclick={() => (cursorYear -= 1)}
      >
        <span
          data-icon
          class={[stylex.attrs([calendarLayout.navigationIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.chevronLeft} /></span
        >
      </button>
      <button
        type="button"
        class={[stylex.attrs(calendarLayout.viewButton).class]}
        aria-label="Switch to years view"
        disabled={calendarDisabled}
        onclick={() => (view = "years")}>{cursorYear}</button
      >
      <button
        type="button"
        class={[stylex.attrs(calendarLayout.navigationButton).class]}
        aria-label="Next year"
        disabled={calendarDisabled}
        onclick={() => (cursorYear += 1)}
      >
        <span
          data-icon
          class={[stylex.attrs([calendarLayout.navigationIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.chevronRight} /></span
        >
      </button>
    {:else}
      {@const decadeStart = Math.floor(cursorYear / 10) * 10}
      <button
        type="button"
        class={[stylex.attrs(calendarLayout.navigationButton).class]}
        aria-label="Previous decade"
        disabled={calendarDisabled}
        onclick={() => (cursorYear -= 10)}
      >
        <span
          data-icon
          class={[stylex.attrs([calendarLayout.navigationIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.chevronLeft} /></span
        >
      </button>
      <span class={[stylex.attrs(calendarLayout.decadeLabel).class]}
        >{decadeStart}–{decadeStart + 9}</span
      >
      <button
        type="button"
        class={[stylex.attrs(calendarLayout.navigationButton).class]}
        aria-label="Next decade"
        disabled={calendarDisabled}
        onclick={() => (cursorYear += 10)}
      >
        <span
          data-icon
          class={[stylex.attrs([calendarLayout.navigationIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.chevronRight} /></span
        >
      </button>
    {/if}
  </div>

  {#if view === "days"}
    <div
      bind:this={gridEl}
      role="grid"
      aria-label={`${months[cursorMonth - 1]} ${cursorYear}`}
      tabindex="-1"
      onkeydown={onDaysKey}
      class={[stylex.attrs(calendarLayout.days).class]}
    >
      {#each weekdays as name (name)}
        <div
          role="columnheader"
          class={[stylex.attrs(calendarLayout.weekday).class]}
        >
          {name.slice(0, 2)}
        </div>
      {/each}
      {#each cells as cell (cell.iso)}
        {@const disabled = calendarDisabled || !isWithin(cell.iso, min, max)}
        {@const selected = cell.iso === value}
        {@const today = cell.iso === todayIso}
        <button
          type="button"
          role="gridcell"
          data-iso={cell.iso}
          aria-selected={selected}
          aria-disabled={disabled}
          data-outside-month={cell.outside ? "true" : undefined}
          data-selected={selected ? "true" : undefined}
          data-today={today ? "true" : undefined}
          data-disabled={disabled ? "true" : undefined}
          tabindex={!disabled && cell.iso === focusedIso ? 0 : -1}
          {disabled}
          onfocus={() => (focusedIso = cell.iso)}
          onclick={() => !disabled && onSelect(cell.iso)}
          class={[stylex.attrs(calendarLayout.day).class]}>{cell.d}</button
        >
      {/each}
    </div>
  {:else if view === "months"}
    <div class={[stylex.attrs(calendarLayout.periods).class]}>
      {#each months as name, i (name)}
        {@const m = i + 1}
        {@const firstOfMonth = formatIso(cursorYear, m, 1)}
        {@const lastOfMonth = formatIso(
          cursorYear,
          m,
          daysInMonth(cursorYear, m),
        )}
        {@const disabled =
          calendarDisabled ||
          (max ? firstOfMonth > max : false) ||
          (min ? lastOfMonth < min : false)}
        <button
          type="button"
          class={[stylex.attrs(calendarLayout.period).class]}
          data-selected={m === cursorMonth ? "true" : undefined}
          data-disabled={disabled ? "true" : undefined}
          {disabled}
          onclick={() => {
            const day = parseIso(focusedIso)!.d;
            setCursor(
              formatIso(
                cursorYear,
                m,
                Math.min(day, daysInMonth(cursorYear, m)),
              ),
            );
            view = "days";
          }}>{name.slice(0, 3)}</button
        >
      {/each}
    </div>
  {:else}
    {@const decadeStart = Math.floor(cursorYear / 10) * 10}
    <div class={[stylex.attrs(calendarLayout.periods).class]}>
      {#each Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i) as y (y)}
        {@const firstOfYear = formatIso(y, 1, 1)}
        {@const lastOfYear = formatIso(y, 12, 31)}
        {@const disabled =
          calendarDisabled ||
          (max ? firstOfYear > max : false) ||
          (min ? lastOfYear < min : false)}
        <button
          type="button"
          class={[stylex.attrs(calendarLayout.period).class]}
          data-selected={y === cursorYear ? "true" : undefined}
          data-disabled={disabled ? "true" : undefined}
          {disabled}
          onclick={() => {
            const day = parseIso(focusedIso)!.d;
            setCursor(
              formatIso(
                y,
                cursorMonth,
                Math.min(day, daysInMonth(y, cursorMonth)),
              ),
            );
            view = "months";
          }}>{y}</button
        >
      {/each}
    </div>
  {/if}
</div>

<style>
  @layer overrides {
    :where(.root > :global(:not(:last-child))) {
      --sx-space-y-reverse: 0;
      margin-block-start: calc(
        calc(var(--spacing) * 2) * var(--sx-space-y-reverse)
      );
      margin-block-end: calc(
        calc(var(--spacing) * 2) * calc(1 - var(--sx-space-y-reverse))
      );
    }
  }
</style>
