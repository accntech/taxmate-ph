<script lang="ts">
  import type { Snippet } from "svelte";
  import { Icon as SolarIcon } from "../icon/base";
  import type { IconComponent } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { shortcuts as shortcutsLayout } from "./list-topbar-shortcuts.styles";

  import * as stylex from "@stylexjs/stylex";
  import { toast } from "../toaster";
  import { Tooltip } from "../tooltip";
  import { isShortcutHidden } from "../topbar-shortcuts";
  import { TopbarShortcuts } from "../topbar-shortcuts";

  type ShortcutAction = {
    shortcut: string;
    label: string;
    icon: IconComponent;
    onclick: () => void;
  };

  type TopbarAction = {
    shortcut?: string;
    label: string;
    text: string;
    icon?: IconComponent;
    iconClass?: stylex.StyleXStyles;
    href?: string;
    onclick?: () => void;
    always?: boolean;
    variant?: "cta" | "icon";
  };

  type Props = {
    searchShortcut: string;
    searchLabel: string;
    isMobile?: boolean;
    importShortcut?: string;
    exportShortcut?: string;
    actionShortcut?: string;
    actionLabel?: string;
    actionText?: string;
    actionIcon?: IconComponent;
    actionIconClass?: stylex.StyleXStyles;
    actionHref?: string;
    actionContent?: Snippet;
    actions?: TopbarAction[];
    onSearch: () => void;
    onImport?: () => void;
    onExport?: () => void;
    onAction?: () => void;
    extraTools?: Snippet;
  };

  let {
    searchShortcut,
    searchLabel,
    isMobile = false,
    importShortcut,
    exportShortcut,
    actionShortcut,
    actionLabel,
    actionText = "New",
    actionIcon = glyphs.addCircle,
    actionIconClass = shortcutsLayout.icon,
    actionHref,
    actionContent,
    actions = [],
    onSearch,
    onImport = () => toast.info("CSV import coming soon."),
    onExport,
    onAction,
    extraTools,
  }: Props = $props();

  const iconButtonClass = shortcutsLayout.iconButton;

  const visibleClasses = [
    shortcutsLayout.immediateReveal,
    shortcutsLayout.earlyReveal,
    shortcutsLayout.lateReveal,
  ] as const;

  const hiddenClass = shortcutsLayout.hidden;

  let tools = $derived.by(() => {
    const items: ShortcutAction[] = [
      {
        shortcut: searchShortcut,
        label: searchLabel,
        icon: glyphs.search,
        onclick: onSearch,
      },
    ];

    if (importShortcut) {
      items.push({
        shortcut: importShortcut,
        label: "Import",
        icon: glyphs.upload,
        onclick: onImport,
      });
    }

    if (exportShortcut && onExport) {
      items.push({
        shortcut: exportShortcut,
        label: "Export",
        icon: glyphs.download,
        onclick: onExport,
      });
    }

    return items;
  });

  let visibleActions = $derived.by(() => {
    return [...actions, primaryAction()].filter(
      (action): action is TopbarAction =>
        action !== null && isVisibleAction(action),
    );
  });
  let customActionVisible = $derived(
    !!actionContent &&
      !!actionShortcut &&
      !isMobile &&
      !isShortcutHidden(actionShortcut),
  );
  let anyVisible = $derived(
    tools.some((tool) => !isShortcutHidden(tool.shortcut)) ||
      visibleActions.length > 0 ||
      customActionVisible,
  );

  function toolClass(hidden: boolean, index: number) {
    return [iconButtonClass, hidden ? hiddenClass : visibleClasses[index]];
  }

  function actionClass(): stylex.StyleXStyles {
    return shortcutsLayout.primaryAction;
  }

  function primaryAction(): TopbarAction | null {
    if (
      actionContent ||
      !actionShortcut ||
      !actionLabel ||
      (!onAction && !actionHref)
    )
      return null;
    return {
      shortcut: actionShortcut,
      label: actionLabel,
      text: actionText,
      icon: actionIcon,
      iconClass: actionIconClass,
      href: actionHref,
      onclick: onAction,
    };
  }

  function isVisibleAction(action: TopbarAction): boolean {
    return isRenderableAction(action) && !topbarActionHidden(action);
  }

  function isRenderableAction(action: TopbarAction): boolean {
    return Boolean(action.onclick || action.href);
  }

  function topbarActionHidden(action: TopbarAction): boolean {
    if (isMobile || action.always || !action.shortcut) return isMobile;
    return isShortcutHidden(action.shortcut);
  }

  function goAction(action: TopbarAction) {
    if (action.onclick) {
      action.onclick();
    }
  }
</script>

<TopbarShortcuts>
  {#each tools as tool, i (tool.shortcut)}
    {@const hidden = isShortcutHidden(tool.shortcut)}
    <Tooltip
      label={tool.label}
      placement="bottom"
      sx={[
        shortcutsLayout.tooltip,
        hidden ? shortcutsLayout.hiddenTooltip : null,
      ]}
      class={[hidden ? "" : ""].filter(Boolean).join(" ")}
    >
      <button
        type="button"
        onclick={tool.onclick}
        aria-label={tool.label}
        tabindex={hidden ? -1 : 0}
        aria-hidden={hidden}
        class={[stylex.attrs(toolClass(hidden, i)).class]}
      >
        <span
          data-icon
          class={[stylex.attrs(shortcutsLayout.icon).class]}
          aria-hidden="true"><SolarIcon icon={tool.icon} /></span
        >
      </button>
    </Tooltip>
  {/each}

  {@render extraTools?.()}

  {#each visibleActions as action (action.shortcut ?? action.label)}
    {@const icon = action.icon ?? glyphs.addCircle}
    {@const iconClass = action.iconClass ?? shortcutsLayout.icon}
    {#if action.variant === "icon"}
      <Tooltip
        label={action.label}
        placement="bottom"
        sx={shortcutsLayout.tooltip}
      >
        {#if action.onclick}
          <button
            type="button"
            onclick={() => goAction(action)}
            aria-label={action.label}
            class={[stylex.attrs(shortcutsLayout.iconButton).class]}
          >
            <span
              data-icon
              class={[stylex.attrs(iconClass).class]}
              aria-hidden="true"><SolarIcon {icon} /></span
            >
          </button>
        {:else if action.href}
          <a
            href={action.href}
            aria-label={action.label}
            class={[stylex.attrs(shortcutsLayout.iconButton).class]}
          >
            <span
              data-icon
              class={[stylex.attrs(iconClass).class]}
              aria-hidden="true"><SolarIcon {icon} /></span
            >
          </a>
        {/if}
      </Tooltip>
    {:else if action.onclick}
      <button
        type="button"
        onclick={() => goAction(action)}
        aria-label={action.label}
        class={[stylex.attrs(actionClass()).class]}
      >
        <span
          data-icon
          class={[stylex.attrs(iconClass).class]}
          aria-hidden="true"><SolarIcon {icon} /></span
        >
        <span>{action.text}</span>
      </button>
    {:else if action.href}
      <a
        href={action.href}
        aria-label={action.label}
        class={[stylex.attrs(actionClass()).class]}
      >
        <span
          data-icon
          class={[stylex.attrs(iconClass).class]}
          aria-hidden="true"><SolarIcon {icon} /></span
        >
        <span>{action.text}</span>
      </a>
    {/if}
  {/each}

  {#if customActionVisible}
    {@render actionContent?.()}
  {/if}

  <span
    aria-hidden="true"
    class={[
      stylex.attrs(
        shortcutsLayout.separator,
        anyVisible
          ? shortcutsLayout.visibleSeparator
          : shortcutsLayout.hiddenSeparator,
      ).class,
    ]}
  ></span>
</TopbarShortcuts>
