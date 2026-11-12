<script lang="ts">
  import { Icon as SolarIcon } from "../icon";
  import type { IconComponent } from "../icon";

  import { toolButton } from "./index.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { Action } from "svelte/action";
  import { Button } from "../button";
  import { Tooltip } from "../tooltip";

  type Props = {
    label: string;
    variant?: "outlined" | "ghost";
    icon: IconComponent;
    tooltip?: string;
    loading?: boolean;
    loadingLabel?: string;
    disabled?: boolean;
    pressed?: boolean;
    onclick?: () => void | Promise<void>;
    class?: string;
    shortcut?: Action<HTMLElement, string>;
    shortcutId?: string;
  };

  let {
    label,
    variant = "outlined",
    icon,
    tooltip,
    loading = false,
    loadingLabel = `${label} in progress`,
    disabled = false,
    pressed,
    onclick,
    sx,
    class: className = "",
    shortcut,
    shortcutId = "",
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  const noopAction: Action<HTMLElement, string> = () => ({});
  const shortcutAction = $derived(shortcut ?? noopAction);
</script>

{#snippet button()}
  <span use:shortcutAction={shortcutId}>
    <Button
      type="button"
      size={variant === "ghost" ? "icon" : "icon-sm"}
      {variant}
      {onclick}
      aria-label={loading ? loadingLabel : label}
      aria-busy={loading}
      aria-pressed={pressed}
      disabled={disabled || loading}
      sx={[variant === "outlined" && toolButton.root, sx]}
      class={[className].filter(Boolean).join(" ")}
    >
      <span
        class={[stylex.attrs(toolButton.iconFrame).class]}
        aria-hidden="true"
      >
        <span
          data-icon
          class={[
            stylex.attrs(toolButton.icon, loading && toolButton.loadingIcon)
              .class,
          ]}><SolarIcon {icon} /></span
        >
        {#if loading}
          <span class={[stylex.attrs(toolButton.spinner).class]}></span>
        {/if}
      </span>
    </Button>
  </span>
{/snippet}

{#if tooltip}
  <Tooltip label={tooltip} sx={toolButton.tooltip}>
    {@render button()}
  </Tooltip>
{:else}
  {@render button()}
{/if}
