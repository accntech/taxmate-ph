<script lang="ts">
  // Ported from PCSTI packages/ui/src/components/menu; StyleX translated to CSS.

  import { tick, type Snippet } from "svelte";
  import { quartOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import { watchTriggerVisibility } from "$lib/components/ui/utils/trigger-visibility";

  type Side = "left" | "right";
  type Placement = "bottom" | "top";

  type Props = {
    label: string;
    open?: boolean;
    panelRole?: "menu" | "dialog";
    disabled?: boolean;
    align?: Side;
    rootClass?: string;
    triggerClass?: string;
    panelClass?: string;
    mobileSheet?: boolean;
    topLayer?: boolean;
    tooltip?: string;
    onopenchange?: (open: boolean) => void;
    trigger: Snippet<[{ open: boolean }]>;
    content: Snippet<[{ close: () => void }]>;
  };
  let {
    label,
    open = $bindable(false),
    panelRole = "menu",
    disabled = false,
    align = "left",
    rootClass = "",
    triggerClass = "",
    panelClass = "",
    mobileSheet = false,
    topLayer = true,
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
    triggerBtn?.focus({ preventScroll: true });
  }

  function onPointer(e: PointerEvent) {
    if (!open || !root) return;
    if (!root.contains(e.target as Node)) {
      setOpen(false);
    }
  }

  function onKey(e: KeyboardEvent) {
    if (!open) return;
    // A manual popover stays open when Tab moves focus beyond its root.
    // Preserve PCSTI's global Escape dismissal before restricting navigation keys.
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (!root?.contains(document.activeElement)) return;
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      const items = [
        ...root.querySelectorAll<HTMLElement>(
          ".menu-panel button:not([disabled]), .menu-panel input:not([disabled]), .menu-panel [role^='menuitem']:not([disabled])",
        ),
      ];
      if (!items.length) return;
      e.preventDefault();
      const current = items.indexOf(document.activeElement as HTMLElement);
      const next =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? items.length - 1
            : e.key === "ArrowUp"
              ? (current - 1 + items.length) % items.length
              : (current + 1) % items.length;
      items[next]?.focus({ preventScroll: true });
      return;
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

  async function onTriggerKey(event: KeyboardEvent) {
    if (!["ArrowDown", "ArrowUp"].includes(event.key) || disabled) return;
    event.preventDefault();
    // The trigger owns opening keys; the window handler owns keys inside the panel.
    // Do not process the same Arrow key a second time while the opening state flushes.
    event.stopPropagation();
    setOpen(true);
    await tick();
    const items = root?.querySelectorAll<HTMLElement>(
      ".menu-panel button:not([disabled]), .menu-panel input:not([disabled]), .menu-panel [role^='menuitem']:not([disabled])",
    );
    if (items?.length)
      items[event.key === "ArrowUp" ? items.length - 1 : 0]?.focus({ preventScroll: true });
  }

  function clampPanel(node: HTMLElement) {
    if (topLayer) {
      // Establish viewport coordinates before the popover enters the top layer.
      // An initial absolute frame can otherwise move the document's scroll anchor.
      const rect = triggerBtn?.getBoundingClientRect();
      Object.assign(node.style, {
        position: "fixed",
        inset: "auto",
        margin: "0",
        left: `${rect?.left ?? PANEL_PAD}px`,
        top: `${rect ? rect.bottom + PANEL_GAP : PANEL_PAD}px`,
        translate: "none",
      });
      if (isMobileSheetActive()) {
        Object.assign(node.style, {
          inset: "auto .75rem calc(.75rem + env(safe-area-inset-bottom))",
          left: ".75rem",
          right: ".75rem",
          top: "auto",
        });
      }
      node.showPopover();
    }
    function adjust() {
      if (!open) return;
      node.style.setProperty("--menu-shift-x", "0px");
      if (isMobileSheetActive()) {
        if (topLayer)
          Object.assign(node.style, {
            position: "fixed",
            margin: "0",
            inset: "auto .75rem calc(.75rem + env(safe-area-inset-bottom))",
            left: ".75rem",
            right: ".75rem",
            top: "auto",
            translate: "none",
          });
        return;
      }
      if (!triggerBtn) return;
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
    const stopWatching = triggerBtn
      ? watchTriggerVisibility(
          triggerBtn,
          node,
          () => setOpen(false),
          root?.querySelector<HTMLElement>(".menu-backdrop") ?? undefined,
        )
      : undefined;
    // Measure the visible panel and clamp it before the first painted frame.
    adjust();
    const raf = requestAnimationFrame(adjust);
    const ro = new ResizeObserver(adjust);
    ro.observe(node);
    ro.observe(document.documentElement);
    window.addEventListener("resize", adjust, { passive: true });
    window.addEventListener("scroll", adjust, { passive: true, capture: true });
    return {
      destroy() {
        stopWatching?.();
        if (topLayer && node.matches(":popover-open")) node.hidePopover();
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener("resize", adjust);
        window.removeEventListener("scroll", adjust, { capture: true });
      },
    };
  }

  function attachPanel(node: HTMLElement) {
    const action = clampPanel(node);
    return () => action.destroy();
  }
</script>

<svelte:window onkeydown={onKey} />

<div bind:this={root} class={["menu-root", rootClass]}>
  <button
    bind:this={triggerBtn}
    type="button"
    {disabled}
    onclick={() => setOpen(!open)}
    onkeydown={onTriggerKey}
    aria-haspopup={panelRole}
    aria-expanded={open}
    aria-label={label}
    title={tooltip}
    class={["menu-trigger", triggerClass]}
  >
    {@render trigger({ open })}
  </button>
  {#if open && mobileSheet}
    <button
      type="button"
      class="menu-backdrop"
      aria-label="Close menu"
      onclick={close}
      transition:fade={{ duration: 150, easing: quartOut }}
    ></button>
  {/if}
  {#if open}
    <div
      popover={topLayer ? "manual" : undefined}
      role={panelRole}
      aria-label={label}
      aria-hidden={disabled || !open}
      inert={disabled || !open}
      {@attach attachPanel}
      style="translate: var(--menu-shift-x, 0px) 0;"
      data-placement={placement}
      data-align={sideState}
      data-mobile-sheet={mobileSheet ? "true" : undefined}
      data-top-layer={topLayer ? "true" : undefined}
      in:popIn
      out:popOut
      class={["menu-panel", panelClass]}
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
  .menu-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    min-height: 1.875rem;
    white-space: nowrap;
    border: 1px solid var(--border);
    border-radius: var(--radius-field);
    background: var(--bg-elev);
    font-weight: 500;
    color: var(--fg);
    cursor: pointer;
    transition:
      transform 160ms,
      background-color 160ms,
      border-color 160ms,
      color 160ms,
      box-shadow 160ms,
      opacity 160ms;
  }
  .menu-trigger:hover {
    background: var(--bg-hover);
  }
  .menu-trigger:active {
    scale: 0.97;
  }
  .menu-trigger:disabled {
    opacity: 0.6;
    pointer-events: none;
  }
  .menu-trigger:focus-visible {
    outline: none;
    border-color: color-mix(in oklch, var(--accent) 60%, var(--border));
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
  }
  .menu-trigger :global([data-icon]),
  .menu-panel :global([data-icon]) {
    display: block;
    flex: none;
  }
  .menu-panel {
    position: absolute;
    z-index: 50;
    display: block;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 0.25rem;
    background: var(--bg-elev);
    color: var(--fg);
    box-shadow: 0 18px 48px rgba(20, 22, 30, 0.1);
    max-width: calc(100vw - 16px);
  }
  /* Source shadow values: PCSTI apps/erp/src/routes/layout.css. */
  :global([data-theme="dark"]) .menu-panel {
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  }
  .menu-panel[data-placement="bottom"] {
    top: calc(100% + 0.25rem);
    transform-origin: 0 0;
  }
  .menu-panel[data-placement="top"] {
    bottom: calc(100% + 0.25rem);
    transform-origin: 0 100%;
  }
  .menu-panel[data-align="left"] {
    left: 0;
    right: auto;
  }
  .menu-panel[data-align="right"] {
    right: 0;
    left: auto;
    transform-origin: 100% 0;
  }
  .menu-panel[data-align="right"][data-placement="top"] {
    transform-origin: 100% 100%;
  }
  .menu-backdrop {
    display: none;
  }
  @media (max-width: 767px) {
    .menu-backdrop {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 70;
      background: rgb(0 0 0 / 0.4);
    }
    .menu-panel[data-mobile-sheet="true"] {
      position: fixed;
      inset-inline: 0.75rem;
      top: auto;
      bottom: calc(0.75rem + env(safe-area-inset-bottom));
      width: auto;
      max-width: none;
      z-index: 80;
      max-height: 60vh;
      overflow-y: auto;
      border-radius: 0.75rem;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .menu-trigger {
      transition: none;
    }
  }
  @media (forced-colors: active) {
    .menu-trigger:focus-visible {
      outline: 2px solid Highlight;
    }
  }
</style>
