<script lang="ts">
  import { Icon as SolarIcon } from "../icon";

  import { glyphs } from "../../icons";

  import { type Snippet } from "svelte";

  import { sidebar as sidebarLayout } from "./index.styles";

  import * as stylex from "@stylexjs/stylex";

  import { onMount, untrack } from "svelte";
  import { lockBodyScroll } from "../../utils/body-scroll-lock";
  import { activeScrollOffset, revealScrollOffset } from "./active-scroll";

  type SidebarCtx = { collapsed: boolean };

  let {
    collapsed = $bindable(false),
    mobileOpen = $bindable(false),
    isMobile = $bindable(false),
    storageKey = "sidebarCollapsed",
    ariaLabel = "Primary",
    header,
    content,
    footer,
  }: {
    collapsed?: boolean;
    mobileOpen?: boolean;
    isMobile?: boolean;
    storageKey?: string | null;
    ariaLabel?: string;
    header?: Snippet<[SidebarCtx]>;
    content?: Snippet<[SidebarCtx]>;
    footer?: Snippet<[SidebarCtx]>;
  } = $props();

  onMount(() => {
    const mq = window.matchMedia("(not (min-width: 48rem))");
    isMobile = mq.matches;
    const onMediaChange = (e: MediaQueryListEvent) => (isMobile = e.matches);
    mq.addEventListener("change", onMediaChange);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) mobileOpen = false;
    };
    window.addEventListener("keydown", onKey);

    return () => {
      mq.removeEventListener("change", onMediaChange);
      window.removeEventListener("keydown", onKey);
    };
  });

  $effect(() => {
    if (!storageKey) return;
    const value = collapsed ? "1" : "0";
    untrack(() => {
      document.cookie = `${storageKey}=${value}; path=/; max-age=31536000; samesite=lax`;
    });
  });

  const renderCollapsed: boolean = $derived(collapsed && !isMobile);
  const dataState: "collapsed" | "expanded" = $derived(
    renderCollapsed ? "collapsed" : "expanded",
  );
  const ctx: SidebarCtx = $derived({ collapsed: renderCollapsed });

  function handleLinkClick(e: MouseEvent) {
    if ((e.target as Element | null)?.closest("a")) mobileOpen = false;
  }

  let navEl: HTMLElement | null = $state(null);
  let canScrollUp = $state(false);
  let canScrollDown = $state(false);

  function updateFades() {
    if (!navEl) return;
    const max = navEl.scrollHeight - navEl.clientHeight;
    canScrollUp = navEl.scrollTop > 0;
    canScrollDown = navEl.scrollTop < max - 1;
  }

  $effect(() => {
    if (!navEl) return;
    updateFades();
    const ro = new ResizeObserver(updateFades);
    ro.observe(navEl);
    for (const child of Array.from(navEl.children))
      ro.observe(child as Element);
    return () => ro.disconnect();
  });

  function trackActiveScroll() {
    if (!navEl) return;
    const offset = activeScrollOffset(navEl);
    if (offset === null) return;
    navEl.scrollTop += offset;
  }

  function revealExpandedGroup(group: HTMLElement) {
    if (!navEl || renderCollapsed) return;
    const offset = revealScrollOffset(
      navEl.getBoundingClientRect(),
      group.getBoundingClientRect(),
    );
    if (offset === null) return;
    navEl.scrollBy({
      top: offset,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    updateFades();
  }

  function scheduleRevealExpandedGroup(group: HTMLElement) {
    requestAnimationFrame(() => revealExpandedGroup(group));
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  $effect(() => {
    void renderCollapsed;
    if (!navEl) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      trackActiveScroll();
      if (now - start < 320) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });

  $effect(() => {
    if (!mobileOpen || !isMobile) return;
    return lockBodyScroll();
  });

  $effect(() => {
    if (!navEl) return;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== "attributes") continue;
        const group = mutation.target;
        if (!(group instanceof HTMLElement)) continue;
        if (!group.matches('[data-sidebar-group][data-state="open"]')) continue;
        scheduleRevealExpandedGroup(group);
      }
    });
    observer.observe(navEl, {
      attributeFilter: ["data-state"],
      attributes: true,
      subtree: true,
    });
    return () => observer.disconnect();
  });
</script>

<aside
  class={[stylex.attrs(sidebarLayout.root).class, "sidebar group/sb"]}
  data-state={dataState}
  data-mobile-open={mobileOpen ? "true" : undefined}
  aria-label={ariaLabel}
>
  <header class={[stylex.attrs(sidebarLayout.header).class]}>
    {@render header?.(ctx)}
  </header>

  <div
    class={[
      stylex.attrs(sidebarLayout.scrollFrame).class,
      "sidebar-scroll-region",
    ]}
  >
    <nav
      bind:this={navEl}
      onscroll={updateFades}
      class={[stylex.attrs(sidebarLayout.navigation).class, "sidebar-body"]}
      onclickcapture={handleLinkClick}
    >
      {@render content?.(ctx)}
    </nav>
    <div
      class={[stylex.attrs(sidebarLayout.scrollUpFade).class]}
      data-show={canScrollUp || undefined}
      aria-hidden="true"
    >
      <span
        data-icon
        class={[stylex.attrs([sidebarLayout.scrollIcon]).class]}
        aria-hidden="true"><SolarIcon icon={glyphs.chevronUp} /></span
      >
    </div>
    <div
      class={[stylex.attrs(sidebarLayout.scrollDownFade).class]}
      data-show={canScrollDown || undefined}
      aria-hidden="true"
    >
      <span
        data-icon
        class={[stylex.attrs([sidebarLayout.scrollIcon]).class]}
        aria-hidden="true"><SolarIcon icon={glyphs.chevronDown} /></span
      >
    </div>
  </div>

  <footer
    class={[stylex.attrs(sidebarLayout.footer).class]}
    onclickcapture={handleLinkClick}
  >
    {@render footer?.(ctx)}
  </footer>
</aside>

<style>
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
    max-height: 100vh;
    max-height: 100dvh;
    overflow: hidden;
  }

  @media (min-width: 48rem) {
    .sidebar {
      position: sticky;
      left: auto;
      z-index: 30;
      align-self: start;
      width: auto;
      box-shadow: none;
    }
  }

  .sidebar[data-state="collapsed"] {
    overflow: visible;
  }

  @media (max-width: 47.999rem) {
    .sidebar[data-state="collapsed"] {
      overflow: hidden;
    }
  }

  .sidebar > header,
  .sidebar > footer {
    flex: none;
  }

  .sidebar > header {
    height: 4rem;
  }

  .sidebar-scroll-region {
    position: relative;
    display: flex;
    min-height: 0;
    flex: 1 1 0%;
    flex-direction: column;
    overflow: hidden;
  }

  .sidebar-body {
    display: flex;
    min-height: 0;
    flex: 1 1 0%;
    flex-direction: column;
    gap: 0.125rem;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 8px 14px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }
  .sidebar-body::-webkit-scrollbar {
    width: 6px;
  }
  .sidebar-body::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 999px;
  }
</style>
