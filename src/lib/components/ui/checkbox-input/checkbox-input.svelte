<script lang="ts">
  import { FieldControl } from "@ui-sdk/svelte/field";
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { StyleXStyles } from "@stylexjs/stylex";
  import { Checkbox } from "../checkbox/base";
  import { styleAttributes } from "../styles/style-attributes";

  type Props = Omit<
    HTMLInputAttributes,
    "type" | "role" | "checked" | "indeterminate"
  > & {
    label?: string;
    checked?: boolean;
    indeterminate?: boolean;
    sx?: StyleXStyles;
  };

  let {
    label = "",
    checked = $bindable(false),
    indeterminate = $bindable(false),
    disabled,
    sx,
    class: className,
    style,
    ...rest
  }: Props = $props();
</script>

<label class={{ disabled }}>
  <span class="checkbox-control">
    <!-- The native input keeps checked and indeterminate independently bindable. -->
    <FieldControl
      {...rest}
      {disabled}
      {...styleAttributes(sx, "", style)}
      class={["peer", styleAttributes(sx).class, className]}
    >
      {#snippet render({ props })}
        <input {...props} type="checkbox" bind:checked bind:indeterminate />
      {/snippet}
    </FieldControl>
    <span class="checkbox-mark" aria-hidden="true">
      <Checkbox {checked} {indeterminate} size="md" />
    </span>
  </span>
  {#if label}<span>{label}</span>{/if}
</label>

<style>
  label {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    min-height: 1.5rem;
    cursor: pointer;
  }
  label.disabled {
    cursor: default;
    opacity: 0.6;
  }
  .checkbox-control {
    position: relative;
    display: inline-flex;
    flex: none;
  }
  input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: inherit;
  }
  .checkbox-mark {
    display: inline-flex;
    pointer-events: none;
  }
  input:focus-visible + .checkbox-mark {
    outline: 2px solid var(--field-focus-border, var(--accent));
    outline-offset: 2px;
    border-radius: 3px;
  }
  @media (forced-colors: active) {
    input { opacity: 1; }
    .checkbox-mark { visibility: hidden; }
  }
</style>
