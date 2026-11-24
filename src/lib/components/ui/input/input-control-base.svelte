<script lang="ts">
  import { Input as SdkInput } from "@ui-sdk/svelte/input";
  import { styleAttributes } from "../styles/style-attributes";
  import { input as inputLayout, type InputSize } from "./input.styles";
  import type { InputControlProps } from "./types";

  let {
    value = $bindable(),
    defaultValue,
    defaultvalue,
    "data-slot": dataSlot,
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
  <SdkInput
    bind:value
    defaultValue={(defaultValue ?? defaultvalue)?.toString()}
    size={nativeSize}
    {...rest}
    disabled={rest.disabled ?? undefined}
    required={rest.required ?? undefined}
    {...styleAttributes([inputLayout.control, inputSx], "", rest.style)}
    aria-invalid={invalid || rest["aria-invalid"] || undefined}
  >
    {#snippet render({ props })}
      <input {...props} data-slot={dataSlot} />
    {/snippet}
  </SdkInput>
  {@render trailing?.()}
</div>

<style>
  div :global(input:-webkit-autofill) {
    -webkit-text-fill-color: var(--fg);
    -webkit-box-shadow: 0 0 0 1000px var(--bg-input) inset;
    caret-color: var(--fg);
    transition: background-color 9999s ease-out 0s;
  }
</style>
