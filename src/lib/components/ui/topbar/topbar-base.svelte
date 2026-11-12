<script lang="ts">
  import PanelLeftOpenIcon from "@solar-icons/svelte-v2/linear/panel-left-open";
  import PanelLeftCloseIcon from "@solar-icons/svelte-v2/linear/panel-left-close";
  import { topbar as topbarLayout } from "./topbar.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import { Button } from "../button/base";
  import { topbarShortcuts } from "../topbar-shortcuts";
  import type { TopbarCrumb } from "./types";

  let {
    onMenu,
    sidebarCollapsed = false,
    crumbs,
    actions,
  }: {
    onMenu: () => void;
    sidebarCollapsed?: boolean;
    crumbs: TopbarCrumb[];
    actions?: Snippet;
  } = $props();
  const SidebarIcon = $derived(
    sidebarCollapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon,
  );
</script>

<header class={[stylex.attrs(topbarLayout.root).class]}>
  <Button
    size="icon"
    variant="ghost"
    onclick={onMenu}
    aria-label="Toggle sidebar"
  >
    <SidebarIcon
      class={stylex.attrs(topbarLayout.menuIcon).class}
      aria-hidden="true"
      focusable="false"
    />
  </Button>

  <nav
    class={[stylex.attrs(topbarLayout.breadcrumbs).class]}
    aria-label="Breadcrumb"
  >
    {#each crumbs as crumb, i (i)}
      {#if i > 0}
        <span
          class={[stylex.attrs(topbarLayout.separator).class]}
          aria-hidden="true">/</span
        >
      {/if}
      {#if crumb.href}
        <a href={crumb.href} class={[stylex.attrs(topbarLayout.link).class]}>
          {crumb.label}
        </a>
      {:else}
        <span class={[stylex.attrs(topbarLayout.currentPage).class]}
          >{crumb.label}</span
        >
      {/if}
    {/each}
  </nav>

  <div class={[stylex.attrs(topbarLayout.actions).class]}>
    {@render topbarShortcuts.content?.()}
    {@render actions?.()}
  </div>
</header>
