<script lang="ts">
  import { timeInput } from "./index.styles";

  import * as stylex from "@stylexjs/stylex";
  import { createSegmentFocus } from "../../utils/segment-focus";
  import {
    backspaceDigitBuffer,
    digitBufferIsComplete,
    formatTimeValue,
    parseTimeValue,
    pad2,
    type DigitSegment,
    type Period,
  } from "./helpers";

  type Segment = "hour" | "minute" | "period";

  import type { AriaAttributes } from "svelte/elements";

  type Props = {
    "aria-label"?: AriaAttributes["aria-label"];
    "aria-labelledby"?: AriaAttributes["aria-labelledby"];
    "aria-describedby"?: AriaAttributes["aria-describedby"];
    "aria-invalid"?: AriaAttributes["aria-invalid"];
    value?: string;
    name?: string;
    id?: string;
    disabled?: boolean;
    invalid?: boolean;
    size?: "sm" | "md";
  };

  let {
    "aria-label": ariaLabel,
    "aria-labelledby": labelledBy,
    "aria-describedby": describedBy,
    "aria-invalid": ariaInvalid,
    value = $bindable(""),
    name,
    id,
    disabled = false,
    invalid = false,
    size = "md",
  }: Props = $props();

  let hour12 = $state<string | null>(null);
  let minute = $state<string | null>(null);
  let period = $state<Period | null>(null);
  let buffers: Record<"hour" | "minute", string> = $state({
    hour: "",
    minute: "",
  });

  let hourEl = $state<HTMLSpanElement | undefined>();
  let minuteEl = $state<HTMLSpanElement | undefined>();
  let periodEl = $state<HTMLSpanElement | undefined>();

  const order: Segment[] = ["hour", "minute", "period"];
  const commitDigitKeys = new Set(["ArrowRight", ":", " "]);
  const periodByKey: Record<string, Period> = {
    a: "AM",
    p: "PM",
  };

  function elFor(seg: Segment): HTMLSpanElement | undefined {
    return seg === "hour" ? hourEl : seg === "minute" ? minuteEl : periodEl;
  }

  const segmentFocus = createSegmentFocus(order, elFor);

  let lastSeenValue = value ?? "";

  function syncFromValue() {
    const parsed = parseTimeValue(value);
    if (parsed === null) {
      hour12 = null;
      minute = null;
      period = null;
      buffers = { hour: "", minute: "" };
      return;
    }

    hour12 = parsed.hour12;
    minute = parsed.minute;
    period = parsed.period;
    buffers = { hour: hour12, minute };
  }

  syncFromValue();

  $effect(() => {
    const current = value ?? "";
    if (current !== lastSeenValue) {
      lastSeenValue = current;
      syncFromValue();
    }
  });

  function emitValue() {
    const next = formatTimeValue(hour12, minute, period) ?? "";
    lastSeenValue = next;
    value = next;
  }

  function rangeFor(seg: "hour" | "minute") {
    return seg === "hour" ? { lo: 1, hi: 12 } : { lo: 0, hi: 59 };
  }

  function clampToRange(value: number, seg: "hour" | "minute"): number {
    const { lo, hi } = rangeFor(seg);
    return Math.min(Math.max(value, lo), hi);
  }

  function wrapToRange(value: number, seg: "hour" | "minute"): number {
    const { lo, hi } = rangeFor(seg);
    if (value < lo) return hi;
    if (value > hi) return lo;
    return value;
  }

  function valueFor(seg: "hour" | "minute"): string | null {
    return seg === "hour" ? hour12 : minute;
  }

  function setDigitValue(seg: "hour" | "minute", next: string | null) {
    if (seg === "hour") {
      hour12 = next;
      buffers.hour = next ?? "";
      return;
    }
    minute = next;
    buffers.minute = next ?? "";
  }

  function ensurePeriod() {
    if (period === null) period = "AM";
  }

  function parseBuffer(seg: "hour" | "minute"): string | null {
    const buf = buffers[seg];
    if (buf.length === 0) return null;

    const n = Number(buf);
    if (!Number.isFinite(n)) return null;

    return pad2(clampToRange(n, seg));
  }

  function commitBuffer(seg: "hour" | "minute") {
    const next = parseBuffer(seg);
    setDigitValue(seg, next);
    if (seg === "hour" && next !== null) ensurePeriod();
    emitValue();
  }

  function bufferIsUnambiguouslyFull(seg: DigitSegment): boolean {
    return digitBufferIsComplete(seg, buffers[seg]);
  }

  function onDigit(seg: "hour" | "minute", digit: string) {
    let buf = buffers[seg];
    if (buf.length >= 2) buf = "";
    buf += digit;
    buffers[seg] = buf;
    if (bufferIsUnambiguouslyFull(seg)) {
      commitBuffer(seg);
      segmentFocus.advanceFrom(seg);
    } else {
      if (seg === "hour") hour12 = buf;
      else minute = buf;
    }
  }

  function onBackspace(seg: "hour" | "minute") {
    const result = backspaceDigitBuffer(buffers[seg]);
    if (result.shouldRetreat) {
      segmentFocus.retreatFrom(seg);
      return;
    }
    setDigitValue(seg, result.nextValue);
    emitValue();
  }

  function onArrowDigit(seg: "hour" | "minute", delta: number) {
    const { lo, hi } = rangeFor(seg);
    const current = valueFor(seg);
    const n =
      current === null
        ? delta > 0
          ? lo
          : hi
        : wrapToRange(Number(current) + delta, seg);
    setDigitValue(seg, pad2(n));
    if (seg === "hour") ensurePeriod();
    emitValue();
  }

  function togglePeriod() {
    period = period === "PM" ? "AM" : "PM";
    if (hour12 === null) hour12 = "12";
    if (minute === null) minute = "00";
    buffers.hour = hour12;
    buffers.minute = minute;
    emitValue();
  }

  function setPeriod(p: Period) {
    period = p;
    if (hour12 === null) hour12 = "12";
    if (minute === null) minute = "00";
    buffers.hour = hour12;
    buffers.minute = minute;
    emitValue();
  }

  function onDigitKey(seg: "hour" | "minute", e: KeyboardEvent) {
    const action = actionForDigitKey(seg, e.key);
    if (action === null) return;

    e.preventDefault();
    action();
  }

  function actionForDigitKey(
    seg: "hour" | "minute",
    key: string,
  ): (() => void) | null {
    if (key >= "0" && key <= "9") return () => onDigit(seg, key);
    if (commitDigitKeys.has(key)) return () => commitAndAdvance(seg);

    return digitNavigationAction(seg, key);
  }

  function commitAndAdvance(seg: "hour" | "minute") {
    commitBuffer(seg);
    segmentFocus.advanceFrom(seg);
  }

  function digitNavigationAction(
    seg: "hour" | "minute",
    key: string,
  ): (() => void) | null {
    const actions: Record<string, () => void> = {
      ArrowUp: () => onArrowDigit(seg, 1),
      ArrowDown: () => onArrowDigit(seg, -1),
      ArrowLeft: () => segmentFocus.retreatFrom(seg),
      Backspace: () => onBackspace(seg),
    };

    return actions[key] ?? null;
  }

  function clearPeriod() {
    period = null;
    emitValue();
  }

  function actionForPeriodKey(key: string): (() => void) | null {
    const nextPeriod = periodByKey[key.toLowerCase()];
    if (nextPeriod) return () => setPeriod(nextPeriod);

    const actions: Record<string, () => void> = {
      ArrowUp: togglePeriod,
      ArrowDown: togglePeriod,
      ArrowLeft: () => segmentFocus.retreatFrom("period"),
      Backspace: clearPeriod,
    };

    return actions[key] ?? null;
  }

  function onPeriodKey(e: KeyboardEvent) {
    const action = actionForPeriodKey(e.key);
    if (action === null) return;

    e.preventDefault();
    action();
  }

  function onBlurDigit(seg: "hour" | "minute") {
    commitBuffer(seg);
  }
</script>

<div
  class={[
    stylex.attrs(
      timeInput.root,
      size === "sm" ? timeInput.small : timeInput.medium,
    ).class,
    "group",
  ]}
  role="group"
  aria-label={ariaLabel}
  aria-labelledby={labelledBy}
  aria-describedby={describedBy}
  data-invalid={invalid || ariaInvalid === true || ariaInvalid === "true"
    ? "true"
    : undefined}
  {id}
>
  <div class={[stylex.attrs(timeInput.segments).class]}>
    <span
      bind:this={hourEl}
      class={[
        stylex.attrs(
          timeInput.digit,
          hour12 === null && timeInput.placeholder,
          hour12 !== null && timeInput.filled,
        ).class,
      ]}
      role="spinbutton"
      aria-describedby={describedBy}
      aria-invalid={invalid || ariaInvalid || undefined}
      tabindex={disabled ? -1 : 0}
      aria-label="Hour"
      aria-valuemin={1}
      aria-valuemax={12}
      aria-valuenow={hour12 !== null ? Number(hour12) : undefined}
      onkeydown={(e) => onDigitKey("hour", e)}
      onblur={() => onBlurDigit("hour")}>{hour12 ?? "HH"}</span
    >
    <span class={[stylex.attrs(timeInput.placeholder).class]}>:</span>
    <span
      bind:this={minuteEl}
      class={[
        stylex.attrs(
          timeInput.digit,
          minute === null && timeInput.placeholder,
          minute !== null && timeInput.filled,
        ).class,
      ]}
      role="spinbutton"
      aria-describedby={describedBy}
      aria-invalid={invalid || ariaInvalid || undefined}
      tabindex={disabled ? -1 : 0}
      aria-label="Minute"
      aria-valuemin={0}
      aria-valuemax={59}
      aria-valuenow={minute !== null ? Number(minute) : undefined}
      onkeydown={(e) => onDigitKey("minute", e)}
      onblur={() => onBlurDigit("minute")}>{minute ?? "MM"}</span
    >
    <span
      bind:this={periodEl}
      class={[
        stylex.attrs(
          timeInput.period,
          period === null && timeInput.placeholder,
          period !== null && timeInput.filled,
        ).class,
      ]}
      role="spinbutton"
      aria-describedby={describedBy}
      aria-invalid={invalid || ariaInvalid || undefined}
      tabindex={disabled ? -1 : 0}
      aria-label="AM or PM"
      aria-valuetext={period ?? "empty"}
      onkeydown={onPeriodKey}>{period ?? "AM"}</span
    >
  </div>

  {#if name}
    <input type="hidden" {name} value={value ?? ""} />
  {/if}
</div>
