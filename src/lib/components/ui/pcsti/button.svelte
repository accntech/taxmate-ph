<!-- Uses the local PCSTI library; the disabled-link fallback preserves inert anchor semantics. -->
<script module lang="ts">
  export type ButtonSize = "normal" | "compact" | "icon" | "icon-sm";
  export type ButtonVariant =
    | "outlined"
    | "ghost"
    | "accent"
    | "accent-soft"
    | "destructive-ghost"
    | "destructive-soft";
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import { Button as PcstiButton } from "@pcsti/ui/button";
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes,
  } from "svelte/elements";
  let {
    href,
    type = "button",
    size = "normal",
    variant = "outlined",
    disabled = false,
    children,
    leading,
    trailing,
    class: className = "",
    ...rest
  }: {
    href?: string;
    type?: "button" | "submit" | "reset";
    size?: ButtonSize;
    variant?: ButtonVariant;
    disabled?: boolean;
    children?: Snippet;
    leading?: Snippet;
    trailing?: Snippet;
    class?: string;
  } & Omit<
    HTMLAnchorAttributes & HTMLButtonAttributes,
    "class" | "type" | "disabled"
  > = $props();
</script>

{#if href && disabled}
  <a
    {...rest}
    href={disabled ? undefined : href}
    aria-disabled={disabled || undefined}
    tabindex={disabled ? -1 : rest.tabindex}
    class={["pcsti-button", className]}
    data-button-size={size}
    data-button-variant={variant}
  >
    {@render leading?.()}{@render children?.()}{@render trailing?.()}
  </a>
{:else}
  <PcstiButton {...rest} {href} {type} {disabled} {size} {variant} class={className} {leading} {trailing}>
    {@render children?.()}
  </PcstiButton>
{/if}

<style>
  .pcsti-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    border: 1px solid;
    border-radius: var(--radius-field);
    font-weight: 500;
    outline: none;
    white-space: nowrap;
    text-decoration: none;
    cursor: pointer;
    transition:
      transform 160ms var(--ease-ui),
      background-color 160ms var(--ease-ui),
      border-color 160ms var(--ease-ui),
      color 160ms var(--ease-ui),
      box-shadow 160ms var(--ease-ui),
      opacity 160ms var(--ease-ui);
  }
  .pcsti-button:active {
    scale: 0.97;
  }
  .pcsti-button:disabled,
  .pcsti-button[aria-disabled="true"] {
    pointer-events: none;
    opacity: 0.6;
  }
  [data-button-size="normal"] {
    min-height: 2.25rem;
    padding: 0.375rem 0.875rem;
    font-size: 13px;
  }
  [data-button-size="compact"] {
    min-height: 1.875rem;
    padding: 0.25rem 0.625rem;
    font-size: 12.5px;
  }
  [data-button-size="icon"] {
    width: 2rem;
    height: 2rem;
    padding: 0;
  }
  [data-button-size="icon-sm"] {
    width: 1.875rem;
    height: 1.875rem;
    padding: 0;
  }
  [data-button-variant="outlined"] {
    border-color: var(--border);
    background: var(--bg-elev);
    color: var(--fg);
  }
  [data-button-variant="ghost"] {
    border-color: transparent;
    background: transparent;
    color: var(--fg-muted);
  }
  [data-button-variant="outlined"]:hover,
  [data-button-variant="ghost"]:hover {
    background: var(--bg-hover);
    color: var(--fg);
  }
  [data-button-variant="outlined"]:focus-visible,
  [data-button-variant="ghost"]:focus-visible {
    border-color: color-mix(in oklch, var(--accent) 60%, var(--border));
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
  }
  [data-button-variant="accent"] {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--accent-fg);
  }
  [data-button-variant="accent"]:hover {
    border-color: var(--accent-hover);
    background: var(--accent-hover);
  }
  [data-button-variant="accent"]:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 35%, transparent);
  }
  [data-button-variant="accent-soft"] {
    border-color: transparent;
    background: var(--accent-soft);
    color: color-mix(in oklab, var(--accent) 80%, var(--fg));
  }
  [data-button-variant="accent-soft"]:hover {
    background: color-mix(in oklch, var(--accent) 10%, var(--accent-soft));
  }
  [data-button-variant="accent-soft"]:focus-visible {
    border-color: color-mix(in oklch, var(--accent) 60%, var(--border));
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
  }
  [data-button-variant="destructive-ghost"] {
    border-color: transparent;
    background: transparent;
    color: var(--danger);
  }
  [data-button-variant="destructive-ghost"]:hover {
    background: var(--danger-soft);
  }
  [data-button-variant="destructive-soft"] {
    border-color: transparent;
    background: var(--destructive-button-bg, var(--danger-soft));
    color: var(
      --destructive-button-fg,
      color-mix(in oklab, var(--danger) 80%, var(--fg))
    );
  }
  [data-button-variant="destructive-soft"]:hover {
    background: var(
      --destructive-button-hover-bg,
      color-mix(in oklch, var(--danger) 10%, var(--danger-soft))
    );
  }
  [data-button-variant="destructive-ghost"]:focus-visible,
  [data-button-variant="destructive-soft"]:focus-visible {
    border-color: color-mix(in oklch, var(--danger) 60%, var(--border));
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--danger) 18%, transparent);
  }
  @media (prefers-reduced-motion: reduce) {
    .pcsti-button {
      transition: none;
    }
  }
  @media (forced-colors: active) {
    .pcsti-button:focus-visible {
      outline: 2px solid Highlight;
    }
  }
</style>
