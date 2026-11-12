<script lang="ts" module>
  import { field } from "./field.styles";

  import { styleAttributes } from "../styles/style-attributes";

  export type FieldControlAttrs = {
    id: string;
    "aria-describedby"?: string;
    "aria-invalid"?: "true";
  };
</script>

<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import { FormMessage } from "../form-message";

  type FieldError = string | string[] | undefined;

  let {
    id,
    label,
    hideLabel = false,
    error,
    help,
    required = false,
    sx,
    class: className = "",
    meta,
    children,
  }: {
    id: string;
    label: string;
    hideLabel?: boolean;
    error?: FieldError;
    help?: string;
    required?: boolean;
    class?: string;
    meta?: Snippet;
    children: Snippet<[FieldControlAttrs]>;
  } & { sx?: stylex.StyleXStyles } = $props();

  const errorMessage = $derived.by(() => firstMessage(error));
  const helpId = $derived(help ? `${id}-help` : undefined);
  const errorId = $derived(errorMessage ? `${id}-error` : undefined);
  const describedBy = $derived([helpId, errorId].filter(Boolean).join(" "));
  const controlAttrs: FieldControlAttrs = $derived.by(() => ({
    id,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": errorMessage ? "true" : undefined,
  }));
  const classes = $derived(field.root);

  function firstMessage(value: FieldError): string {
    if (!value) return "";
    return Array.isArray(value) ? (value[0] ?? "") : value;
  }
</script>

<div
  {...styleAttributes(
    [classes, sx],
    [className].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  {#snippet fieldLabel()}
    <label
      for={id}
      class={[stylex.attrs(field.label, hideLabel && field.hiddenLabel).class]}
    >
      {label}
      {#if required}
        <span class={[stylex.attrs(field.requiredMarker).class]}>*</span>
      {/if}
    </label>
  {/snippet}
  {#if !hideLabel || meta}
    <div class={[stylex.attrs(field.header).class]}>
      {@render fieldLabel()}
      {@render meta?.()}
    </div>
  {:else}
    {@render fieldLabel()}
  {/if}
  {@render children(controlAttrs)}
  {#if help}
    <div id={helpId} class={[stylex.attrs(field.help).class]}>
      {help}
    </div>
  {/if}
  <FormMessage id={errorId} kind="error" message={errorMessage} />
</div>
