<script lang="ts">
  import { currencyInput } from "./index.styles";

  import { styleAttributes } from "../../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import { clampCurrencyValue, parseCurrencyValue } from "./helpers";

  import type { HTMLInputAttributes } from "svelte/elements";

  type Props = {
    "aria-describedby"?: HTMLInputAttributes["aria-describedby"];
    "aria-invalid"?: HTMLInputAttributes["aria-invalid"];
    id?: string;
    name?: string;
    value: number | null;
    onValueChange: (v: number | null) => void;
    placeholder?: string;
    symbol?: string;
    locale?: string;
    min?: number;
    max?: number;
    decimals?: number;
    invalid?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
    class?: string;
  };

  let {
    id,
    name,
    value,
    onValueChange,
    placeholder = "0.00",
    symbol = "₱",
    locale = "en-PH",
    min,
    max,
    decimals = 2,
    invalid = false,
    disabled = false,
    ariaLabel,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    sx,
    class: klass = "",
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  const formatter = $derived(
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: true,
    }),
  );

  let inputEl = $state<HTMLInputElement | null>(null);
  let focused = $state(false);
  let editing = $state("");
  const display = $derived(focused ? editing : formatValue(value));

  function formatValue(v: number | null): string {
    if (v == null || !Number.isFinite(v)) return "";
    return formatter.format(v);
  }

  function onInput(e: Event) {
    const el = e.currentTarget as HTMLInputElement;
    const next = el.value.replace(/[^\d.,\-]/g, "");
    if (next !== el.value) el.value = next;
    editing = next;
    onValueChange(parseCurrencyValue(next));
  }

  function onFocus() {
    focused = true;
    editing = value == null ? "" : String(value);
    queueMicrotask(() => inputEl?.select());
  }

  function onBlur() {
    focused = false;
    const parsed = parseCurrencyValue(editing);
    if (parsed == null) {
      editing = "";
      onValueChange(null);
      return;
    }
    const clamped = clampCurrencyValue(parsed, { min, max });
    editing = "";
    onValueChange(clamped);
  }

  const hiddenValue = $derived(value == null ? "" : String(value));
</script>

<div
  {...styleAttributes(
    [currencyInput.root, sx],
    ["group", klass].flat(Infinity).filter(Boolean).join(" "),
  )}
  data-invalid={invalid ? "true" : undefined}
>
  <span class={[stylex.attrs(currencyInput.symbol).class]} aria-hidden="true">
    {symbol}
  </span>
  <input
    bind:this={inputEl}
    {id}
    type="text"
    inputmode="decimal"
    autocomplete="off"
    {placeholder}
    {disabled}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedBy}
    aria-invalid={invalid || ariaInvalid || undefined}
    value={display}
    oninput={onInput}
    onfocus={onFocus}
    onblur={onBlur}
    class={[stylex.attrs(currencyInput.control).class]}
  />
  {#if name}
    <input type="hidden" {name} value={hiddenValue} />
  {/if}
</div>

<style>
  input:-webkit-autofill {
    -webkit-text-fill-color: var(--fg);
    -webkit-box-shadow: 0 0 0 1000px var(--bg-input) inset;
    caret-color: var(--fg);
    transition: background-color 9999s ease-out 0s;
  }
</style>
