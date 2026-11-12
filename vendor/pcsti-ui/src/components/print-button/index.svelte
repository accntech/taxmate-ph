<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { tick, type ComponentProps } from "svelte";
  import { Button } from "../button";
  import { button } from "../button/index.styles";
  import { Menu } from "../menu";
  import { MenuItem } from "../menu-item";
  import { Icon } from "../icon";
  import { glyphs } from "../../icons";
  import { printButton } from "./index.styles";
  import { formFooter } from "../form-footer/index.styles";

  type Props = ComponentProps<typeof Button> & {
    onSettings?: () => void;
    pending?: boolean;
    label?: string;
    pendingLabel?: string;
    settingsLabel?: string;
    optionsLabel?: string;
  };

  let {
    onSettings,
    pending = false,
    label = "Print",
    pendingLabel = "Generating…",
    settingsLabel,
    optionsLabel = "Print options",
    type = "button",
    disabled = false,
    size = "normal",
    variant = "outlined",
    children,
    leading,
    trailing,
    sx,
    ...rest
  }: Props = $props();

  let root: HTMLDivElement | undefined = $state();
  const blocked = $derived(disabled || pending);
  const settingsActionLabel = $derived(
    settingsLabel ?? (type === "submit" ? "Submit & Print As…" : "Print As…"),
  );
  const sizes = {
    normal: button.normal,
    compact: button.compact,
    icon: button.icon,
    "icon-sm": button.iconSmall,
  };
  const variants = {
    primary: button.primary,
    accent: button.accent,
    outlined: button.outlined,
    ghost: button.ghost,
    destructive: button.destructive,
    "destructive-ghost": button.destructiveGhost,
    "destructive-outlined": button.destructiveOutlined,
    "primary-soft": button.primarySoft,
    "accent-soft": button.accentSoft,
    "destructive-soft": button.destructiveSoft,
    "success-soft": button.successSoft,
  };

  let optionsOpen = false;
  async function focusOptions(open: boolean) {
    optionsOpen = open;
    if (!open) return;
    await tick();
    if (blocked || !optionsOpen) return;
    root?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  }
</script>

<div bind:this={root} {...stylex.attrs(printButton.root)}>
  <Button
    {...rest}
    {type}
    {size}
    {variant}
    disabled={blocked}
    aria-busy={pending}
    sx={[
      sx,
      variant === "outlined" && printButton.neutral,
      onSettings && printButton.main,
    ]}
  >
    {#if pending}
      {pendingLabel}
    {:else}
      {#if leading}
        {@render leading()}
      {:else if !children}
        <span data-icon aria-hidden="true" {...stylex.attrs(printButton.icon)}>
          <Icon
            icon={type === "submit"
              ? glyphs.arrowRight
              : glyphs.printerDocument}
          />
        </span>
      {/if}
      {#if children}
        {@render children()}
      {:else}
        {label}
      {/if}
      {#if trailing}
        {@render trailing()}
      {:else if type === "submit"}
        <span
          aria-hidden="true"
          {...stylex.attrs(formFooter.shortcutHint, printButton.shortcutHint)}
          >⏎</span
        >
      {/if}
    {/if}
  </Button>
  {#if onSettings}
    <Menu
      disabled={blocked}
      label={optionsLabel}
      align="right"
      triggerClass={[
        button.root,
        sizes[size],
        variants[variant],
        sx,
        variant.endsWith("-soft") && variants[variant],
        variant === "outlined" && printButton.neutral,
        printButton.moreButton,
      ]}
      onopenchange={focusOptions}
    >
      {#snippet trigger()}
        <span aria-hidden="true" {...stylex.attrs(printButton.icon)}>
          <Icon icon={glyphs.chevronDown} />
        </span>
      {/snippet}
      {#snippet content({ close })}
        <MenuItem
          disabled={blocked}
          variant="ghost"
          size="compact"
          sx={printButton.settingsItem}
          onSelect={() => {
            close();
            onSettings?.();
          }}
        >
          <span
            data-icon
            aria-hidden="true"
            {...stylex.attrs(printButton.icon)}
          >
            <Icon icon={glyphs.printerDocument} />
          </span>
          {settingsActionLabel}
        </MenuItem>
      {/snippet}
    </Menu>
  {/if}
</div>
