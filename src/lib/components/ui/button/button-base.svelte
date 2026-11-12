<script module lang="ts">
  export type ButtonSize = "normal" | "compact" | "icon" | "icon-sm";
  export type ButtonVariant =
    | "primary"
    | "accent"
    | "outlined"
    | "ghost"
    | "destructive"
    | "destructive-ghost"
    | "destructive-outlined"
    | "primary-soft"
    | "accent-soft"
    | "destructive-soft"
    | "success-soft";
</script>

<script lang="ts">
  import type { StyleXStyles } from "@stylexjs/stylex";
  import { styleAttributes } from "../styles/style-attributes";
  import { button as buttonLayout } from "./button.styles";
  import type { Action } from "svelte/action";
  import type { Snippet } from "svelte";
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes,
  } from "svelte/elements";

  type ButtonAction = Action<HTMLAnchorElement | HTMLButtonElement, string>;

  let {
    href,
    type = "button",
    size = "normal",
    variant = "outlined",
    class: className = "",
    sx,
    style,
    children,
    leading,
    trailing,
    shortcut,
    shortcutId = "",
    ...rest
  }: {
    href?: HTMLAnchorAttributes["href"];
    type?: HTMLButtonAttributes["type"];
    size?: ButtonSize;
    variant?: ButtonVariant;
    class?: string;
    sx?: StyleXStyles;
    children?: Snippet;
    leading?: Snippet;
    trailing?: Snippet;
    shortcut?: ButtonAction;
    shortcutId?: string;
  } & Omit<HTMLAnchorAttributes, "class" | "href"> &
    Omit<HTMLButtonAttributes, "class" | "type"> = $props();

  const sizes = {
    normal: buttonLayout.normal,
    compact: buttonLayout.compact,
    icon: buttonLayout.icon,
    "icon-sm": buttonLayout.iconSmall,
  } satisfies Record<ButtonSize, StyleXStyles>;

  const variants = {
    primary: buttonLayout.primary,
    accent: buttonLayout.accent,
    outlined: buttonLayout.outlined,
    ghost: buttonLayout.ghost,
    destructive: buttonLayout.destructive,
    "destructive-ghost": buttonLayout.destructiveGhost,
    "destructive-outlined": buttonLayout.destructiveOutlined,
    "primary-soft": buttonLayout.primarySoft,
    "accent-soft": buttonLayout.accentSoft,
    "destructive-soft": buttonLayout.destructiveSoft,
    "success-soft": buttonLayout.successSoft,
  } satisfies Record<ButtonVariant, StyleXStyles>;

  const attributes = $derived(
    styleAttributes(
      [
        buttonLayout.root,
        sizes[size],
        variants[variant],
        sx,
        // Keep the soft action treatment when callers supply legacy layout styles.
        variant.endsWith("-soft") && variants[variant],
      ],
      className,
      style,
    ),
  );

  const noopAction: ButtonAction = () => ({});
  const shortcutAction = $derived(shortcut ?? noopAction);
</script>

{#if href}
  <a
    {...rest}
    {href}
    use:shortcutAction={shortcutId}
    {...attributes}
    data-button-variant={variant}
    data-button-size={size}
  >
    {@render leading?.()}
    {@render children?.()}
    {@render trailing?.()}
  </a>
{:else}
  <button
    {...rest}
    {type}
    use:shortcutAction={shortcutId}
    {...attributes}
    data-button-variant={variant}
    data-button-size={size}
  >
    {@render leading?.()}
    {@render children?.()}
    {@render trailing?.()}
  </button>
{/if}
