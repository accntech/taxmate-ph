<script lang="ts">
  import { menu as menuLayout } from "./menu.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import { quartOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import { Tooltip } from "../tooltip";

  type Side = "left" | "right";
  type Placement = "bottom" | "top";

  type Props = {
    label: string;
    panelRole?: "menu" | "dialog";
    disabled?: boolean;
    align?: Side;
    rootClass?: stylex.StyleXStyles;
    triggerClass?: stylex.StyleXStyles;
    panelClass?: stylex.StyleXStyles;
    mobileSheet?: boolean;
    topLayer?: boolean;
    tooltip?: string;
    onopenchange?: (open: boolean) => void;
    trigger: Snippet<[{ open: boolean }]>;
    content: Snippet<[{ close: () => void }]>;
  };
  let {
    label,
    panelRole = "menu",
    disabled = false,
    align = "left",
    rootClass = null,
    triggerClass = null,
    panelClass = null,
    mobileSheet = false,
    topLayer = false,
    tooltip,
    onopenchange,
    trigger,
    content,
  }: Props = $props();

  const PANEL_PAD = 8;
  const PANEL_GAP = 4;

  let placement = $state<Placement>("bottom");
  let sideOverride = $state<Side | null>(null);
  let sideState = $derived(sideOverride ?? align);

  function getVerticalPositionClass(): stylex.StyleXStyles {
    if (mobileSheet) {
      return placement === "top"
        ? menuLayout.mobileAbove
        : menuLayout.mobileBelow;
    }
    return placement === "top" ? menuLayout.above : menuLayout.below;
  }

  function getHorizontalPositionClass(): stylex.StyleXStyles {
    if (mobileSheet)
      return sideState === "right"
        ? menuLayout.mobileRight
        : menuLayout.mobileLeft;
    return sideState === "right" ? menuLayout.right : menuLayout.left;
  }

  let positionClasses = $derived.by(() => {
    if (mobileSheet) {
      return [
        menuLayout.mobilePosition,
        getVerticalPositionClass(),
        getHorizontalPositionClass(),
      ];
    }
    return [
      menuLayout.desktopPosition,
      getVerticalPositionClass(),
      getHorizontalPositionClass(),
    ];
  });
  let originClass = $derived(
    placement === "top"
      ? sideState === "right"
        ? menuLayout.aboveRightOrigin
        : menuLayout.aboveLeftOrigin
      : sideState === "right"
        ? menuLayout.belowRightOrigin
        : menuLayout.belowLeftOrigin,
  );

  let open = $state(false);

  function setOpen(next: boolean) {
    if (next === open || (next && disabled)) return;
    open = next;
    onopenchange?.(next);
  }
  $effect(() => {
    if (disabled && open) setOpen(false);
  });
  let root: HTMLDivElement | null = $state(null);
  let triggerBtn: HTMLButtonElement | null = $state(null);

  function close() {
    setOpen(false);
    triggerBtn?.focus();
  }

  function onPointer(e: PointerEvent) {
    if (!open || !root) return;
    if (!root.contains(e.target as Node)) {
      setOpen(false);
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      close();
    }
  }

  $effect(() => {
    if (!open) return;
    document.addEventListener("pointerdown", onPointer, true);
    return () => document.removeEventListener("pointerdown", onPointer, true);
  });

  function isMobileSheetActive(): boolean {
    return mobileSheet && window.matchMedia("(max-width: 767px)").matches;
  }

  function prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function panelOffset(): number {
    return placement === "top" ? 4 : -4;
  }

  function pickPanelSide(
    triggerRect: DOMRect,
    panelWidth: number,
    viewportWidth: number,
  ): Side {
    const sideFits = {
      left: triggerRect.left + panelWidth <= viewportWidth - PANEL_PAD,
      right: triggerRect.right - panelWidth >= PANEL_PAD,
    };
    const fallback = align === "left" ? "right" : "left";
    return sideFits[align] || !sideFits[fallback] ? align : fallback;
  }

  function getPanelLeft(
    triggerRect: DOMRect,
    panelWidth: number,
    side: Side,
  ): number {
    return side === "right" ? triggerRect.right - panelWidth : triggerRect.left;
  }

  function getPanelShift(
    panelLeft: number,
    panelWidth: number,
    viewportWidth: number,
  ): number {
    const panelRight = panelLeft + panelWidth;
    if (panelRight > viewportWidth - PANEL_PAD)
      return viewportWidth - PANEL_PAD - panelRight;
    if (panelLeft < PANEL_PAD) return PANEL_PAD - panelLeft;
    return 0;
  }

  function pickPlacement(
    triggerRect: DOMRect,
    panelHeight: number,
    viewportHeight: number,
  ): Placement {
    const spaceBelow =
      viewportHeight - triggerRect.bottom - PANEL_GAP - PANEL_PAD;
    const spaceAbove = triggerRect.top - PANEL_GAP - PANEL_PAD;
    return spaceBelow < panelHeight && spaceAbove > spaceBelow
      ? "top"
      : "bottom";
  }

  function popIn(_node: Element) {
    if (prefersReducedMotion()) {
      return {
        duration: prefersReducedMotion() ? 80 : 180,
        easing: quartOut,
        css: (t: number) => `opacity: ${t}; transform: scale(1);`,
      };
    }
    if (isMobileSheetActive()) {
      return {
        duration: 220,
        easing: quartOut,
        css: (t: number) =>
          `opacity: ${t}; transform: translateY(${(1 - t) * 16}px);`,
      };
    }
    return {
      duration: prefersReducedMotion() ? 80 : 180,
      easing: quartOut,
      css: (t: number) =>
        `opacity: ${t}; transform: translateY(${(1 - t) * panelOffset()}px) scale(${0.97 + t * 0.03});`,
    };
  }

  function popOut(_node: Element) {
    if (prefersReducedMotion()) {
      return {
        duration: prefersReducedMotion() ? 60 : 120,
        easing: quartOut,
        css: (t: number) =>
          `opacity: ${t}; transform: scale(1); pointer-events: none;`,
      };
    }
    if (isMobileSheetActive()) {
      return {
        duration: 160,
        easing: quartOut,
        css: (t: number) =>
          `opacity: ${t}; transform: translateY(${(1 - t) * 12}px); pointer-events: none;`,
      };
    }
    return {
      duration: prefersReducedMotion() ? 60 : 120,
      easing: quartOut,
      css: (t: number) =>
        `opacity: ${t}; transform: translateY(${(1 - t) * panelOffset()}px) scale(${0.97 + t * 0.03}); pointer-events: none;`,
    };
  }

  function clampPanel(node: HTMLElement) {
    if (topLayer) node.showPopover();
    function adjust() {
      node.style.setProperty("--menu-shift-x", "0px");
      if (isMobileSheetActive() || !triggerBtn) return;
      const triggerRect = triggerBtn.getBoundingClientRect();
      const panelWidth = node.offsetWidth;
      const nextSide = pickPanelSide(
        triggerRect,
        panelWidth,
        window.innerWidth,
      );
      sideOverride = nextSide;
      const left = getPanelLeft(triggerRect, panelWidth, nextSide);
      const shift = getPanelShift(left, panelWidth, window.innerWidth);
      node.style.setProperty("--menu-shift-x", `${shift}px`);
      placement = pickPlacement(
        triggerRect,
        node.offsetHeight,
        window.innerHeight,
      );
      if (topLayer) {
        const top =
          placement === "top"
            ? triggerRect.top - PANEL_GAP - node.offsetHeight
            : triggerRect.bottom + PANEL_GAP;
        Object.assign(node.style, {
          position: "fixed",
          inset: "auto",
          margin: "0",
          left: `${left + shift}px`,
          top: `${Math.max(PANEL_PAD, top)}px`,
          translate: "none",
        });
      }
    }
    const raf = requestAnimationFrame(adjust);
    const ro = new ResizeObserver(adjust);
    ro.observe(node);
    ro.observe(document.documentElement);
    window.addEventListener("resize", adjust, { passive: true });
    window.addEventListener("scroll", adjust, { passive: true, capture: true });
    return {
      destroy() {
        if (topLayer && node.matches(":popover-open")) node.hidePopover();
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener("resize", adjust);
        window.removeEventListener("scroll", adjust, { capture: true });
      },
    };
  }
</script>

<svelte:window onkeydown={onKey} />

{#snippet triggerButton()}
  <button
    bind:this={triggerBtn}
    type="button"
    {disabled}
    onclick={() => setOpen(!open)}
    aria-haspopup={panelRole}
    aria-expanded={open}
    aria-label={label}
    class={[
      stylex.attrs(menuLayout.trigger, triggerClass).class,
      "menu-trigger",
    ]}
  >
    {@render trigger({ open })}
  </button>
{/snippet}

<div
  bind:this={root}
  class={[stylex.attrs(menuLayout.root, rootClass).class, "menu-root"]}
>
  {#if tooltip}
    <Tooltip label={tooltip}>
      {@render triggerButton()}
    </Tooltip>
  {:else}
    {@render triggerButton()}
  {/if}
  {#if open && mobileSheet}
    <button
      type="button"
      class={[stylex.attrs(menuLayout.backdrop).class]}
      aria-label="Close menu"
      onclick={close}
      transition:fade={{ duration: 150, easing: quartOut }}
    ></button>
  {/if}
  {#if open}
    <div
      popover={topLayer ? "manual" : undefined}
      role={panelRole === "dialog" ? "dialog" : "menu"}
      aria-label={panelRole === "dialog" ? label : undefined}
      aria-hidden={disabled || !open}
      inert={disabled || !open}
      use:clampPanel
      style="translate: var(--menu-shift-x, 0px) 0;"
      data-placement={placement}
      data-align={sideState}
      data-mobile-sheet={mobileSheet ? "true" : undefined}
      in:popIn
      out:popOut
      class={[
        stylex.attrs(menuLayout.panel, originClass, positionClasses, panelClass)
          .class,
        "menu-panel",
      ]}
    >
      {@render content({ close })}
    </div>
  {/if}
</div>

<style>
  .menu-root {
    position: relative;
    display: inline-flex;
    flex: none;
  }

  .menu-trigger :global([data-icon]) {
    display: block;
    flex: none;
  }

  .menu-panel {
    position: absolute;
    z-index: 50;
    display: block;
    border-width: 1px;
    border-style: solid;
    border-radius: 0.5rem;
    padding: 0.25rem;
    background: var(--bg-elev);
  }

  .menu-panel[data-placement="bottom"] {
    top: calc(100% + 0.25rem);
  }

  .menu-panel[data-placement="top"] {
    bottom: calc(100% + 0.25rem);
  }

  .menu-panel[data-align="left"] {
    left: 0;
    right: auto;
  }

  .menu-panel[data-align="right"] {
    right: 0;
    left: auto;
  }

  .menu-panel :global([data-icon]) {
    display: block;
    flex: none;
  }

  @media (max-width: 767px) {
    .menu-panel[data-mobile-sheet="true"] {
      position: fixed;
      inset-inline: 0.75rem;
      width: auto;
      top: auto;
      right: 0.75rem;
      bottom: calc(0.75rem + env(safe-area-inset-bottom));
      left: 0.75rem;
      z-index: 80;
      max-height: 60vh;
      overflow-y: auto;
      border-radius: 0.75rem;
    }
  }
</style>
