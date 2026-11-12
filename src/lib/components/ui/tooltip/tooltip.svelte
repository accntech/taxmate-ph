<script lang="ts">
  import { tooltip as tooltipLayout } from "./tooltip.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import { quartOut } from "svelte/easing";

  type Placement = "top" | "right" | "bottom" | "left";
  type Align = "start" | "center" | "end";

  let {
    label,
    placement = "bottom",
    align = "center",
    clamp = true,
    floating = false,
    offset = "8px",
    sx,
    class: className = "",
    children,
  }: {
    label: string;
    placement?: Placement;
    align?: Align;
    clamp?: boolean;
    floating?: boolean;
    offset?: string;
    class?: string;
    children: Snippet;
  } & { sx?: stylex.StyleXStyles } = $props();

  let rootEl = $state<HTMLSpanElement | null>(null);
  let triggerHovered = $state(false);
  let focused = $state(false);
  const floatingOpen = $derived(floating && (triggerHovered || focused));

  const sidePositionClass: Partial<Record<Placement, stylex.StyleXStyles>> = {
    left: [
      tooltipLayout.sideAnchor,
      tooltipLayout.left,
      tooltipLayout.leftOrigin,
      tooltipLayout.sideViewportShift,
      tooltipLayout.sideCenterShift,
    ],
    right: [
      tooltipLayout.sideAnchor,
      tooltipLayout.right,
      tooltipLayout.rightOrigin,
      tooltipLayout.sideViewportShift,
      tooltipLayout.sideCenterShift,
    ],
  };
  const verticalPositionClass: Record<"top" | "bottom", stylex.StyleXStyles> = {
    top: tooltipLayout.above,
    bottom: tooltipLayout.below,
  };
  const alignPositionClass: Record<Align, stylex.StyleXStyles> = {
    start: tooltipLayout.alignStart,
    center: tooltipLayout.alignCenter,
    end: tooltipLayout.alignEnd,
  };

  const positionClass = $derived(
    sidePositionClass[placement] ?? [
      verticalPositionClass[placement as "top" | "bottom"],
      alignPositionClass[align],
    ],
  );

  function prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function tooltipIn(_node: Element) {
    return {
      duration: prefersReducedMotion() ? 70 : 130,
      easing: quartOut,
      css: (t: number) =>
        prefersReducedMotion()
          ? `opacity: ${t};`
          : `opacity: ${t}; transform: scale(${0.97 + t * 0.03});`,
    };
  }

  function tooltipOut(_node: Element) {
    return {
      duration: prefersReducedMotion() ? 50 : 90,
      easing: quartOut,
      css: (t: number) =>
        prefersReducedMotion()
          ? `opacity: ${t}; pointer-events: none;`
          : `opacity: ${t}; transform: scale(${0.97 + t * 0.03}); pointer-events: none;`,
    };
  }

  function parsedOffset() {
    const value = Number.parseFloat(offset);
    return Number.isFinite(value) ? value : 8;
  }

  function alignedLeft(triggerRect: DOMRect, tooltipWidth: number) {
    if (align === "start") return triggerRect.left;
    if (align === "end") return triggerRect.right - tooltipWidth;
    return triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
  }

  function sidePosition(triggerRect: DOMRect, tooltipRect: DOMRect) {
    const gap = parsedOffset();
    if (placement === "left") {
      return {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.left - tooltipRect.width - gap,
      };
    }
    if (placement === "right") {
      return {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.right + gap,
      };
    }
    return {
      top:
        placement === "top"
          ? triggerRect.top - tooltipRect.height - gap
          : triggerRect.bottom + gap,
      left: alignedLeft(triggerRect, tooltipRect.width),
    };
  }

  function clampPosition(
    position: { top: number; left: number },
    tooltipRect: DOMRect,
  ) {
    if (!clamp) return position;
    const pad = 8;
    const vw =
      window.visualViewport?.width ?? document.documentElement.clientWidth;
    const vh =
      window.visualViewport?.height ?? document.documentElement.clientHeight;
    return {
      top: Math.max(pad, Math.min(position.top, vh - pad - tooltipRect.height)),
      left: Math.max(
        pad,
        Math.min(position.left, vw - pad - tooltipRect.width),
      ),
    };
  }

  function setArrowPosition(
    node: HTMLElement,
    triggerRect: DOMRect,
    tooltipRect: DOMRect,
  ) {
    const inset = 8;
    const inline = Math.max(
      inset,
      Math.min(
        triggerRect.left + triggerRect.width / 2 - tooltipRect.left,
        tooltipRect.width - inset,
      ),
    );
    const block = Math.max(
      inset,
      Math.min(
        triggerRect.top + triggerRect.height / 2 - tooltipRect.top,
        tooltipRect.height - inset,
      ),
    );
    node.style.setProperty("--tt-arrow-inline", `${inline}px`);
    node.style.setProperty("--tt-arrow-block", `${block}px`);
  }

  function positionFloatingTooltip(node: HTMLElement) {
    document.body.appendChild(node);

    function position() {
      if (!rootEl) return;
      node.style.top = "0px";
      node.style.left = "0px";
      const triggerRect = rootEl.getBoundingClientRect();
      const tooltipRect = node.getBoundingClientRect();
      const next = clampPosition(
        sidePosition(triggerRect, tooltipRect),
        tooltipRect,
      );
      node.style.top = `${next.top}px`;
      node.style.left = `${next.left}px`;
      setArrowPosition(node, triggerRect, node.getBoundingClientRect());
    }

    queueMicrotask(position);
    const ro = new ResizeObserver(position);
    if (rootEl) ro.observe(rootEl);
    ro.observe(node);
    ro.observe(document.documentElement);
    window.addEventListener("resize", position, { passive: true });
    window.addEventListener("scroll", position, {
      passive: true,
      capture: true,
    });

    return {
      destroy() {
        ro.disconnect();
        window.removeEventListener("resize", position);
        window.removeEventListener("scroll", position, true);
        node.remove();
      },
    };
  }

  function captureFloatingTrigger(node: HTMLSpanElement) {
    rootEl = node;
    function enter() {
      triggerHovered = true;
    }
    function leave() {
      triggerHovered = false;
    }
    function focusIn() {
      focused = true;
    }
    function focusOut(event: FocusEvent) {
      const nextTarget = event.relatedTarget;
      if (nextTarget instanceof Node && node.contains(nextTarget)) return;
      focused = false;
    }
    node.addEventListener("pointerenter", enter);
    node.addEventListener("pointerleave", leave);
    node.addEventListener("focusin", focusIn);
    node.addEventListener("focusout", focusOut);
    return {
      destroy() {
        if (rootEl === node) rootEl = null;
        node.removeEventListener("pointerenter", enter);
        node.removeEventListener("pointerleave", leave);
        node.removeEventListener("focusin", focusIn);
        node.removeEventListener("focusout", focusOut);
      },
    };
  }

  function clampTooltip(node: HTMLElement) {
    const parent = node.parentElement;
    function adjust() {
      node.style.setProperty("--tt-shift", "0px");
      if (clamp) {
        const rect = node.getBoundingClientRect();
        const pad = 8;
        const vw = document.documentElement.clientWidth;
        const leftOverflow = Math.max(0, pad - rect.left);
        const rightOverflow = Math.min(0, vw - pad - rect.right);
        const shift = leftOverflow + rightOverflow;
        node.style.setProperty("--tt-shift", `${shift}px`);
      }
      if (parent)
        setArrowPosition(
          node,
          parent.getBoundingClientRect(),
          node.getBoundingClientRect(),
        );
    }
    adjust();
    const ro = new ResizeObserver(adjust);
    const adjustNextFrame = () => requestAnimationFrame(adjust);
    ro.observe(document.documentElement);
    if (parent) ro.observe(parent);
    window.addEventListener("resize", adjust, { passive: true });
    parent?.addEventListener("pointerenter", adjustNextFrame);
    parent?.addEventListener("focusin", adjustNextFrame);
    return {
      destroy() {
        ro.disconnect();
        window.removeEventListener("resize", adjust);
        parent?.removeEventListener("pointerenter", adjustNextFrame);
        parent?.removeEventListener("focusin", adjustNextFrame);
      },
    };
  }
</script>

{#if floating}
  <span
    use:captureFloatingTrigger
    {...styleAttributes(
      [tooltipLayout.floatingTrigger, sx],
      [className].flat(Infinity).filter(Boolean).join(" "),
    )}
  >
    {@render children()}
    {#if floatingOpen}
      <span
        role="tooltip"
        data-placement={placement}
        use:positionFloatingTooltip
        in:tooltipIn
        out:tooltipOut
        class={[
          stylex.attrs(tooltipLayout.floatingPopup).class,
          "tooltip-bubble",
        ]}>{label}<span aria-hidden="true" class="tooltip-arrow"></span></span
      >
    {/if}
  </span>
{:else}
  <span
    {...styleAttributes(
      [tooltipLayout.trigger, sx],
      ["group/tt", className].flat(Infinity).filter(Boolean).join(" "),
    )}
  >
    {@render children()}
    <span
      role="tooltip"
      data-placement={placement}
      style:--tt-offset={offset}
      use:clampTooltip
      class={[
        stylex.attrs(tooltipLayout.popup, positionClass).class,
        "tooltip-bubble",
      ]}>{label}<span aria-hidden="true" class="tooltip-arrow"></span></span
    >
  </span>
{/if}

<style>
  .tooltip-arrow {
    position: absolute;
    box-sizing: border-box;
    width: 0.5rem;
    height: 0.5rem;
    background: var(--bg-elev);
    border-style: solid;
    border-color: var(--border);
    transform: rotate(45deg);
  }

  .tooltip-bubble[data-placement="top"] > .tooltip-arrow {
    bottom: calc(-0.25rem - 1px);
    left: var(--tt-arrow-inline, 50%);
    margin-left: -0.25rem;
    border-width: 0 1px 1px 0;
  }

  .tooltip-bubble[data-placement="right"] > .tooltip-arrow {
    top: var(--tt-arrow-block, 50%);
    left: calc(-0.25rem - 1px);
    margin-top: -0.25rem;
    border-width: 0 0 1px 1px;
  }

  .tooltip-bubble[data-placement="bottom"] > .tooltip-arrow {
    top: calc(-0.25rem - 1px);
    left: var(--tt-arrow-inline, 50%);
    margin-left: -0.25rem;
    border-width: 1px 0 0 1px;
  }

  .tooltip-bubble[data-placement="left"] > .tooltip-arrow {
    top: var(--tt-arrow-block, 50%);
    right: calc(-0.25rem - 1px);
    margin-top: -0.25rem;
    border-width: 1px 1px 0 0;
  }
</style>
