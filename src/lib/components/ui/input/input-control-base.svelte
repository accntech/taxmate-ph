<script lang="ts">
  import { type InputSize } from "./input.styles";

  import type { InputControlProps } from "./types";
  import * as stylex from "@stylexjs/stylex";

  import { input as inputLayout } from "./input.styles";
  import { styleAttributes } from "../styles/style-attributes";

  let {
    value = $bindable(),
    invalid = false,
    size = "normal",
    class: className = "",
    sx,
    inputSx,
    leading,
    trailing,
    ...rest
  }: InputControlProps = $props();

  const wrapperSize: InputSize = $derived(
    size === "compact" ? "compact" : "normal",
  );
  const nativeSize = $derived(typeof size === "number" ? size : undefined);
</script>

<div
  {...styleAttributes(
    [
      inputLayout.wrapper,
      inputLayout[wrapperSize],
      sx,
      invalid && inputLayout.invalid,
    ],
    className,
  )}
  data-invalid={invalid ? "true" : undefined}
>
  {@render leading?.()}
  <input
    bind:value
    size={nativeSize}
    {...rest}
    {...styleAttributes([inputLayout.control, inputSx], "", rest.style)}
    aria-invalid={invalid || rest["aria-invalid"] || undefined}
  />
  {@render trailing?.()}
</div>

<style>
  input:-webkit-autofill {
    -webkit-text-fill-color: var(--fg);
    -webkit-box-shadow: 0 0 0 1000px var(--bg-input) inset;
    caret-color: var(--fg);
    transition: background-color 9999s ease-out 0s;
  }
</style>
