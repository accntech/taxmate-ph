<script lang="ts">
  import { Icon as SolarIcon } from "../icon";
  import { icons as dateFieldIcons } from "./date-field.icons";

  import { dateField } from "./date-field.styles";

  import * as stylex from "@stylexjs/stylex";
  import { createSegmentFocus } from "../../utils/segment-focus";
  import {
    parseIso,
    formatIso,
    daysInMonth,
    isWithin,
    clampIso,
  } from "./date-helpers";

  type Segment = "month" | "day" | "year";

  type Props = {
    value?: string;
    id?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    disabled?: boolean;
    invalid?: boolean;
    min?: string;
    max?: string;
    picker?: boolean;
    size?: "sm" | "md";
    triggerPopover?: () => void;
    popoverId?: string;
    popoverOpen?: boolean;
  };

  let {
    value = $bindable(""),
    id,
    "aria-label": ariaLabel,
    "aria-labelledby": labelledBy,
    "aria-describedby": describedBy,
    disabled = false,
    invalid = false,
    min,
    max,
    picker = true,
    size = "md",
    triggerPopover,
    popoverId,
    popoverOpen = false,
  }: Props = $props();

  let month = $state<string | null>(null);
  let day = $state<string | null>(null);
  let year = $state<string | null>(null);
  let buffers: Record<Segment, string> = $state({
    month: "",
    day: "",
    year: "",
  });

  let committed: Record<Segment, boolean> = $state({
    month: false,
    day: false,
    year: false,
  });
  const elements: Partial<Record<Segment, HTMLInputElement>> = {};
  const order: Segment[] = ["month", "day", "year"];
  const labels: Record<Segment, string> = {
    month: "Month",
    day: "Day",
    year: "Year",
  };
  const placeholders: Record<Segment, string> = {
    month: "MM",
    day: "DD",
    year: "YYYY",
  };
  const maxLen: Record<Segment, number> = { month: 2, day: 2, year: 4 };
  const minVal: Record<Segment, number> = { month: 1, day: 1, year: 1 };
  const fixedMaxVal: Record<Exclude<Segment, "day">, number> = {
    month: 12,
    year: 9999,
  };
  const singleDigitCommitFloor: Partial<Record<Segment, number>> = {
    month: 2,
    day: 4,
  };
  const dateSeparatorKeys = new Set(["ArrowRight", "/", "-", " "]);

  function maxDayVal(): number {
    // Keep February 29 available until the user has supplied a complete year.
    const y = committed.year && year !== null ? Number(year) : 2000;
    const m = committed.month && month !== null ? Number(month) : 1;
    return daysInMonth(y, m);
  }

  function maxVal(seg: Segment): number {
    return seg === "day" ? maxDayVal() : fixedMaxVal[seg];
  }

  const segmentFocus = createSegmentFocus(order, (seg) => elements[seg]);

  function get(seg: Segment): string | null {
    return seg === "month" ? month : seg === "day" ? day : year;
  }

  function set(seg: Segment, v: string | null) {
    if (seg === "month") month = v;
    else if (seg === "day") day = v;
    else year = v;
  }

  function pad(seg: Segment, n: number): string {
    return String(n).padStart(maxLen[seg], "0");
  }

  let lastSeenValue = value ?? "";

  function syncFromValue() {
    const parts = parseIso(value ?? "");
    if (!parts) {
      month = null;
      day = null;
      year = null;
      buffers = { month: "", day: "", year: "" };
      committed = { month: false, day: false, year: false };
      return;
    }
    month = pad("month", parts.m);
    day = pad("day", parts.d);
    year = pad("year", parts.y);
    buffers = { month, day, year };
    committed = { month: true, day: true, year: true };
  }

  syncFromValue();

  $effect(() => {
    const current = value ?? "";
    if (current !== lastSeenValue) {
      lastSeenValue = current;
      syncFromValue();
    }
  });

  function currentDateValue(): string {
    if (!hasCompleteDate()) return "";
    const candidate = formatIso(Number(year), Number(month), Number(day));
    return parseIso(candidate) ? candidate : "";
  }

  function emitValue() {
    const candidate = currentDateValue();
    const next = candidate ? clampIso(candidate, min, max) : "";
    lastSeenValue = next;
    value = next;
    if (next && next !== candidate) syncFromValue();
  }

  function clearSegmentValue(seg: Segment) {
    set(seg, null);
    buffers[seg] = "";
    committed[seg] = false;
    emitValue();
  }

  function bufferNumber(seg: Segment): number | null {
    const buf = buffers[seg];
    if (buf.length === 0) return null;
    const n = Number(buf);
    return Number.isFinite(n) ? n : null;
  }

  function clampSegmentValue(seg: Segment, n: number): number {
    const lo = minVal[seg];
    const hi = maxVal(seg);
    return Math.min(Math.max(n, lo), hi);
  }

  function commitBuffer(seg: Segment) {
    const n = bufferNumber(seg);
    if (n === null) {
      clearSegmentValue(seg);
      return;
    }
    if (seg === "year" && !isBufferAtMaxLength(seg)) {
      committed.year = false;
      emitValue();
      return;
    }
    applySegmentValue(seg, clampSegmentValue(seg, n));
  }

  function isBufferAtMaxLength(seg: Segment): boolean {
    return buffers[seg].length >= maxLen[seg];
  }

  function isSingleDigitAutocommit(seg: Segment): boolean {
    const floor = singleDigitCommitFloor[seg];
    return (
      floor !== undefined &&
      buffers[seg].length === 1 &&
      Number(buffers[seg]) >= floor
    );
  }

  function bufferIsUnambiguouslyFull(seg: Segment): boolean {
    return isBufferAtMaxLength(seg) || isSingleDigitAutocommit(seg);
  }

  function onDigit(seg: Segment, digit: string) {
    let buf = buffers[seg];
    if (buf.length >= maxLen[seg]) buf = "";
    buf += digit;
    buffers[seg] = buf;
    if (bufferIsUnambiguouslyFull(seg)) {
      commitBuffer(seg);
      segmentFocus.advanceFrom(seg);
    } else {
      set(seg, buf);
      committed[seg] = false;
      emitValue();
    }
  }

  function onBackspace(seg: Segment) {
    const buf = buffers[seg];
    if (buf.length === 0) {
      segmentFocus.retreatFrom(seg);
      return;
    }
    const next = buf.slice(0, -1);
    buffers[seg] = next;
    set(seg, next === "" ? null : next);
    committed[seg] = false;
    emitValue();
  }

  function rawArrowValue(seg: Segment, delta: number): number {
    const current = get(seg);
    if (current !== null) return Number(current) + delta;
    return delta > 0 ? minVal[seg] : maxVal(seg);
  }

  function wrapValue(n: number, lo: number, hi: number): number {
    const span = hi - lo + 1;
    return ((n - lo + span) % span) + lo;
  }

  function wrappedArrowValue(seg: Segment, delta: number): number {
    return wrapValue(rawArrowValue(seg, delta), minVal[seg], maxVal(seg));
  }

  function hasCompleteDate(): boolean {
    return committed.month && committed.day && committed.year;
  }

  function shouldCheckArrowBounds(): boolean {
    return (min !== undefined || max !== undefined) && hasCompleteDate();
  }

  function arrowProbeIso(seg: Segment, n: number): string {
    const probeY = seg === "year" ? n : Number(year);
    const probeM = seg === "month" ? n : Number(month);
    const probeD = Math.min(
      seg === "day" ? n : Number(day),
      daysInMonth(probeY, probeM),
    );
    return formatIso(probeY, probeM, probeD);
  }

  function arrowValueIsAllowed(seg: Segment, n: number): boolean {
    if (!shouldCheckArrowBounds()) return true;
    return isWithin(arrowProbeIso(seg, n), min, max);
  }

  function applySegmentValue(seg: Segment, n: number) {
    const padded = pad(seg, n);
    set(seg, padded);
    buffers[seg] = padded;
    committed[seg] = true;
    if (committed.month && committed.day) {
      const adjustedDay = pad("day", Math.min(Number(day), maxDayVal()));
      day = adjustedDay;
      buffers.day = adjustedDay;
    }
    emitValue();
  }

  function onArrow(seg: Segment, delta: number) {
    const n = wrappedArrowValue(seg, delta);
    if (!arrowValueIsAllowed(seg, n)) return;
    applySegmentValue(seg, n);
  }

  function commitAndAdvance(seg: Segment) {
    commitBuffer(seg);
    segmentFocus.advanceFrom(seg);
  }

  const arrowKeyHandlers: Record<string, (seg: Segment) => void> = {
    ArrowUp: (seg) => onArrow(seg, 1),
    ArrowDown: (seg) => onArrow(seg, -1),
    ArrowLeft: segmentFocus.retreatFrom,
    ArrowRight: commitAndAdvance,
  };

  function handleArrowKey(seg: Segment, key: string): boolean {
    const handler = arrowKeyHandlers[key];
    if (!handler) return false;
    handler(seg);
    return true;
  }

  function handleDateSeparatorKey(seg: Segment, key: string): boolean {
    if (!dateSeparatorKeys.has(key)) return false;
    commitAndAdvance(seg);
    return true;
  }

  function isDigitKey(key: string): boolean {
    return key >= "0" && key <= "9";
  }

  function handleBackspaceKey(seg: Segment, key: string): boolean {
    if (key !== "Backspace") return false;
    onBackspace(seg);
    return true;
  }

  function handleSegmentKey(seg: Segment, key: string): boolean {
    if (key === "Delete") {
      clearSegmentValue(seg);
      return true;
    }
    if (isDigitKey(key)) {
      onDigit(seg, key);
      return true;
    }
    if (handleArrowKey(seg, key) || handleDateSeparatorKey(seg, key))
      return true;
    return handleBackspaceKey(seg, key);
  }

  function onKey(seg: Segment, e: KeyboardEvent) {
    if (disabled || e.ctrlKey || e.metaKey || e.altKey) return;
    if (!handleSegmentKey(seg, e.key)) return;
    e.preventDefault();
  }

  function onBlur(seg: Segment) {
    if (disabled) return;
    const shortYear =
      seg === "year" && buffers.year.length <= 2 ? bufferNumber(seg) : null;
    if (shortYear !== null) {
      applySegmentValue("year", 2000 + shortYear);
      return;
    }
    commitBuffer(seg);
  }

  function onInput(
    seg: Segment,
    e: Event & { currentTarget: HTMLInputElement },
  ) {
    if (disabled) return;
    const buf = e.currentTarget.value.replace(/\D/g, "").slice(0, maxLen[seg]);
    buffers[seg] = buf;
    set(seg, buf || null);
    committed[seg] = false;
    if (bufferIsUnambiguouslyFull(seg)) {
      commitBuffer(seg);
      segmentFocus.advanceFrom(seg);
    } else {
      emitValue();
    }
    e.currentTarget.value = get(seg) ?? "";
  }
</script>

<div
  class={[
    stylex.attrs(
      dateField.root,
      size === "sm" ? dateField.small : dateField.medium,
    ).class,
    "group",
  ]}
  role="group"
  aria-label={ariaLabel ?? (labelledBy ? undefined : "Date")}
  aria-labelledby={labelledBy}
  aria-describedby={describedBy}
  aria-disabled={disabled}
  data-invalid={invalid ? "true" : undefined}
>
  <div class={[stylex.attrs(dateField.segments).class]}>
    {#each order as seg (seg)}
      {#if seg !== "month"}
        <span
          class={[stylex.attrs(dateField.mutedSegment).class]}
          aria-hidden="true">/</span
        >
      {/if}
      <input
        {@attach (element) => {
          elements[seg] = element;
          return () => {
            delete elements[seg];
          };
        }}
        id={seg === "month" ? id : undefined}
        type="text"
        role="spinbutton"
        inputmode="numeric"
        autocomplete="off"
        {disabled}
        value={get(seg) ?? ""}
        placeholder={placeholders[seg]}
        maxlength={maxLen[seg]}
        class={[
          stylex.attrs(
            dateField.segment,
            seg === "year" ? dateField.year : dateField.shortSegment,
          ).class,
        ]}
        aria-label={labels[seg]}
        aria-describedby={describedBy}
        aria-invalid={invalid ? "true" : undefined}
        aria-disabled={disabled}
        aria-valuemin={minVal[seg]}
        aria-valuemax={maxVal(seg)}
        aria-valuenow={get(seg) !== null ? Number(get(seg)) : undefined}
        onfocus={(e) => e.currentTarget.select()}
        onkeydown={(e) => onKey(seg, e)}
        oninput={(e) => onInput(seg, e)}
        onblur={() => onBlur(seg)}
      />
    {/each}
  </div>

  {#if picker}
    <button
      data-icon
      type="button"
      class={[
        stylex.attrs(
          dateField.calendarButton,
          size === "sm"
            ? dateField.smallCalendarButton
            : dateField.mediumCalendarButton,
        ).class,
      ]}
      aria-label="Open calendar"
      aria-expanded={popoverOpen}
      aria-controls={popoverId}
      onclick={() => triggerPopover?.()}
      {disabled}
    >
      <SolarIcon icon={dateFieldIcons.calendarButton} />
    </button>
  {/if}
</div>
