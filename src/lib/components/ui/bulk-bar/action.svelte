<script lang="ts">
  import { Icon as SolarIcon } from "../icon/base";
  import type { IconComponent } from "../icon/base";

  import { bulkAction } from "./action.styles";
  import { button } from "../button/button.styles";

  import * as stylex from "@stylexjs/stylex";
  type Props = {
    icon: IconComponent;
    label: string;
    variant?: "default" | "danger" | "destructive-soft";
    onclick: () => void;
    disabled?: boolean;
    pending?: boolean;
    pendingLabel?: string;
  };
  let {
    icon,
    label,
    variant = "default",
    onclick,
    disabled = false,
    pending = false,
    pendingLabel,
  }: Props = $props();
</script>

{#if !disabled || pending}
  <button
    type="button"
    aria-label={pending ? (pendingLabel ?? label) : label}
    title={pending ? (pendingLabel ?? label) : label}
    disabled={disabled || pending}
    {onclick}
    class={[
      stylex.attrs(
        bulkAction.root,
        pending ? bulkAction.pending : bulkAction.idle,
        variant === "destructive-soft"
          ? button.destructiveSoft
          : variant === "danger"
            ? bulkAction.danger
            : bulkAction.neutral,
      ).class,
    ]}
  >
    {#if pending}
      <span
        class={[
          stylex.attrs(
            bulkAction.spinner,
            variant !== "default"
              ? bulkAction.dangerSpinner
              : bulkAction.neutralSpinner,
          ).class,
        ]}
        aria-hidden="true"
      ></span>
      <span class={[stylex.attrs(bulkAction.label).class]}
        >{pendingLabel ?? label}</span
      >
    {:else}
      <span
        data-icon
        class={[stylex.attrs(bulkAction.icon).class]}
        aria-hidden="true"><SolarIcon {icon} /></span
      >
      <span class={[stylex.attrs(bulkAction.label).class]}>{label}</span>
    {/if}
  </button>
{/if}
