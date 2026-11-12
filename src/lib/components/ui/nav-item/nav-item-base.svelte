<script lang="ts">
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { type NavigationItem } from "./types";

  import { navItem } from "./nav-item.styles";

  import * as stylex from "@stylexjs/stylex";

  import { isActivePath, isParent } from "./types";
  let {
    item,
    activePath,
    collapsed = false,
    expanded = false,
    onToggle,
  }: {
    item: NavigationItem;
    activePath: string;
    collapsed?: boolean;
    expanded?: boolean;
    onToggle?: () => void;
  } = $props();

  const parent = $derived(isParent(item));

  const selfActive = $derived(
    !parent && isActivePath((item as { href: string }).href, activePath),
  );

  const descendantActive = $derived(
    parent &&
      (item as { children: { href: string }[] }).children.some((c) =>
        isActivePath(c.href, activePath),
      ),
  );

  const active = $derived(selfActive || descendantActive);

  // Prefer the most specific view when a parent also links to its root.
  const activeChildHref = $derived(
    isParent(item)
      ? item.children
          .filter((child) => isActivePath(child.href, activePath))
          .sort((a, b) => b.href.length - a.href.length)[0]?.href
      : undefined,
  );

  const rowBase = navItem.row;
  const rowCollapsed = navItem.collapsed;
  const rowExpanded = navItem.expanded;
  const icoBase = navItem.icon;
  const labelBase = navItem.label;
  const caretBase = [navItem.caret];

  let triggerEl: HTMLElement | null = $state(null);
  let popEl: HTMLElement | null = $state(null);
  let popTop = $state(0);
  let popLeft = $state(0);
  let popArrowTop = $state(0);

  function centeredTop(rect: DOMRect, popoverHeight: number) {
    return rect.top + rect.height / 2 - popoverHeight / 2;
  }

  function preferredTop(rect: DOMRect, popoverHeight: number) {
    return parent ? rect.top : centeredTop(rect, popoverHeight);
  }

  function clampPopoverTop(top: number, popoverHeight: number) {
    const pad = 8;
    if (popoverHeight <= 0) return top;
    return Math.min(
      Math.max(top, pad),
      window.innerHeight - pad - popoverHeight,
    );
  }

  function displayTop(top: number, popoverHeight: number) {
    return parent ? top : top + popoverHeight / 2;
  }

  function submenuArrowTop(
    rect: DOMRect,
    popoverTop: number,
    popoverHeight: number,
  ) {
    const inset = 12;
    if (popoverHeight <= 0) return rect.height / 2;
    const triggerCenter = rect.top + rect.height / 2 - popoverTop;
    return Math.min(
      Math.max(triggerCenter, inset),
      Math.max(inset, popoverHeight - inset),
    );
  }

  function updatePopPos() {
    if (!triggerEl) return;
    const r = triggerEl.getBoundingClientRect();
    const ph = popEl?.offsetHeight ?? 0;
    const boxTop = clampPopoverTop(preferredTop(r, ph), ph);

    popTop = displayTop(boxTop, ph);
    popLeft = r.right + 10;
    if (parent) popArrowTop = submenuArrowTop(r, boxTop, ph);
  }
</script>

{#if parent}
  {@const p = item as Extract<NavigationItem, { children: unknown }>}
  <div
    class="group/ng"
    data-sidebar-group
    data-state={expanded ? "open" : "closed"}
  >
    <button
      bind:this={triggerEl}
      type="button"
      class={[
        stylex.attrs(rowBase, collapsed ? [rowCollapsed] : [rowExpanded]).class,
        "group/nr",
      ]}
      data-active={active ? "true" : undefined}
      aria-expanded={expanded}
      onclick={() => onToggle?.()}
      onpointerenter={collapsed ? updatePopPos : undefined}
      onfocus={collapsed ? updatePopPos : undefined}
    >
      {#if p.icon}
        <span data-icon class={[stylex.attrs(icoBase).class]} aria-hidden="true"
          ><SolarIcon
            icon={active && p.selectedIcon ? p.selectedIcon : p.icon}
          /></span
        >
      {/if}
      <span
        class={[
          stylex.attrs(
            collapsed ? navItem.hiddenLabel : navItem.visibleLabel,
            labelBase,
          ).class,
        ]}>{p.label}</span
      >
      <span
        class={[
          stylex.attrs(
            collapsed ? navItem.hiddenCaret : navItem.visibleCaret,
            caretBase,
          ).class,
        ]}
        data-rotate={expanded ? "true" : undefined}
        aria-hidden="true"><SolarIcon icon={glyphs.chevronRight} /></span
      >
    </button>

    {#if collapsed}
      <ul
        bind:this={popEl}
        style="top: {popTop}px; left: {popLeft}px; --nav-pop-arrow-top: {popArrowTop}px;"
        class={[stylex.attrs(navItem.flyout).class, "nav-submenu-popover"]}
      >
        <li
          class={[stylex.attrs(navItem.flyoutTitle).class]}
          aria-hidden="true"
        >
          {p.label}
        </li>
        {#each p.children as child (child.href)}
          <li>
            <a
              href={child.href}
              class={[stylex.attrs(navItem.flyoutLink).class, "group/nc"]}
              data-active={child.href === activeChildHref
                ? "true"
                : undefined}
              aria-current={child.href === activeChildHref
                ? "page"
                : undefined}
            >
              <span
                class={[stylex.attrs(navItem.childMarker).class]}
                aria-hidden="true"
              ></span>
              <span class={[stylex.attrs(navItem.childLabel).class]}
                >{child.label}</span
              >
            </a>
          </li>
        {/each}
      </ul>
    {:else if expanded}
      <ul class={[stylex.attrs(navItem.children).class]}>
        {#each p.children as child, ci (child.href)}
          <li
            class={[stylex.attrs(navItem.childRow).class]}
            style="--d: {ci * 24 + 40}ms"
          >
            <a
              href={child.href}
              class={[stylex.attrs(navItem.childLink).class, "group/nc"]}
              data-active={child.href === activeChildHref
                ? "true"
                : undefined}
              aria-current={child.href === activeChildHref
                ? "page"
                : undefined}
            >
              <span
                class={[stylex.attrs(navItem.childMarker).class]}
                aria-hidden="true"
              ></span>
              <span class={[stylex.attrs(navItem.childLabel).class]}
                >{child.label}</span
              >
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
{:else}
  {@const leaf = item as Extract<NavigationItem, { href: string }>}
  <div class="group/nl">
    <a
      bind:this={triggerEl}
      href={leaf.href}
      class={[
        stylex.attrs(rowBase, collapsed ? [rowCollapsed] : [rowExpanded]).class,
        "group/nr",
      ]}
      data-active={selfActive ? "true" : undefined}
      aria-current={selfActive ? "page" : undefined}
      onpointerenter={collapsed ? updatePopPos : undefined}
      onfocus={collapsed ? updatePopPos : undefined}
    >
      {#if leaf.icon}
        <span data-icon class={[stylex.attrs(icoBase).class]} aria-hidden="true"
          ><SolarIcon
            icon={selfActive && leaf.selectedIcon
              ? leaf.selectedIcon
              : leaf.icon}
          /></span
        >
      {/if}
      <span
        class={[
          stylex.attrs(
            collapsed ? navItem.hiddenLabel : navItem.visibleLabel,
            labelBase,
          ).class,
        ]}>{leaf.label}</span
      >
    </a>
    {#if collapsed}
      <span
        bind:this={popEl}
        style="top: {popTop}px; left: {popLeft}px;"
        class={[stylex.attrs(navItem.tooltip).class]}
        role="tooltip"
        >{leaf.label}<span aria-hidden="true" class="nav-tooltip-arrow"
        ></span></span
      >
    {/if}
  </div>
{/if}

<style>
  .nav-submenu-popover::after {
    position: absolute;
    top: var(--nav-pop-arrow-top);
    left: calc(-0.25rem - 1px);
    box-sizing: border-box;
    width: 0.5rem;
    height: 0.5rem;
    margin-top: -0.25rem;
    background: var(--bg-elev);
    border-style: solid;
    border-width: 0 0 1px 1px;
    border-color: var(--border);
    content: "";
    transform: rotate(45deg);
  }

  .nav-tooltip-arrow {
    position: absolute;
    top: 50%;
    left: calc(-0.25rem - 1px);
    box-sizing: border-box;
    width: 0.5rem;
    height: 0.5rem;
    margin-top: -0.25rem;
    background: var(--bg-elev);
    border-style: solid;
    border-width: 0 0 1px 1px;
    border-color: var(--border);
    transform: rotate(45deg);
  }
</style>
