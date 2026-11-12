<script lang="ts">
  import { numberInput } from "./index.styles";

  import { styleAttributes } from "../../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import { shouldPreventNumberPaste } from "./helpers";

  let {
    value = $bindable(),
    invalid = false,
    decimal = false,
    step,
    sx,
    class: className = "",
    leading,
    trailing,
    onkeydown,
    onpaste,
    onbeforeinput,
    ...rest
  }: {
    value?: number | null | undefined;
    invalid?: boolean;
    decimal?: boolean;
    class?: string;
    leading?: Snippet;
    trailing?: Snippet;
  } & Omit<HTMLInputAttributes, "value" | "class" | "type"> & {
      sx?: stylex.StyleXStyles;
    } = $props();

  const resolvedStep = $derived(step ?? (decimal ? "any" : 1));
  const allowedPasteRe = $derived(decimal ? /^-?[\d.,]*$/ : /^-?\d*$/);
  const allowedIntegerKeyRe = /^[-\d]$/;
  const allowedDecimalKeyRe = /^[-\d.,]$/;

  function isAllowedChar(ch: string): boolean {
    return (
      ch.length !== 1 ||
      (decimal ? allowedDecimalKeyRe : allowedIntegerKeyRe).test(ch)
    );
  }

  function shouldFilterKey(e: KeyboardEvent) {
    return !e.ctrlKey && !e.metaKey && !e.altKey;
  }

  function handleKeydown(
    e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    if (shouldFilterKey(e) && !isAllowedChar(e.key)) {
      e.preventDefault();
    }
    onkeydown?.(e);
  }

  function handleBeforeInput(
    e: InputEvent & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    if (e.data && !allowedPasteRe.test(e.data)) {
      e.preventDefault();
    }
    onbeforeinput?.(e);
  }

  function handlePaste(
    e: ClipboardEvent & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    const text = e.clipboardData?.getData("text") ?? "";
    if (shouldPreventNumberPaste(text, allowedPasteRe)) {
      e.preventDefault();
    }
    onpaste?.(e);
  }
</script>

<div
  {...styleAttributes(
    [numberInput.root, sx],
    ["group", className].flat(Infinity).filter(Boolean).join(" "),
  )}
  data-invalid={invalid ? "true" : undefined}
>
  {@render leading?.()}
  <input
    bind:value
    type="number"
    inputmode={decimal ? "decimal" : "numeric"}
    step={resolvedStep}
    onkeydown={handleKeydown}
    onbeforeinput={handleBeforeInput}
    onpaste={handlePaste}
    class={[stylex.attrs(numberInput.control).class]}
    {...rest}
    aria-invalid={invalid || rest["aria-invalid"] || undefined}
  />
  {#if trailing}
    <span class={[stylex.attrs(numberInput.trailing).class]}>
      {@render trailing()}
    </span>
  {/if}
</div>

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input:-webkit-autofill {
    -webkit-text-fill-color: var(--fg);
    -webkit-box-shadow: 0 0 0 1000px var(--bg-input) inset;
    caret-color: var(--fg);
    transition: background-color 9999s ease-out 0s;
  }
</style>
