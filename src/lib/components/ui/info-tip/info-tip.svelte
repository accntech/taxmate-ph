<script lang="ts">
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { infoTip } from "./info-tip.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";

  type Placement = "top" | "bottom";

  type Bounds = {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };

  const POPUP_PAD = 8;
  const POPUP_GAP = 8;
  const WILL_CHANGE_CONTAINING_BLOCK = ["transform", "filter", "perspective"];

  let {
    label,
    placement = "top",
    sx,
    class: className = "",
    children,
  }: {
    label: string;
    placement?: Placement;
    class?: string;
    children: Snippet;
  } & { sx?: stylex.StyleXStyles } = $props();

  let triggerEl: HTMLButtonElement | undefined;
  let popupEl: HTMLElement | undefined;
  let triggerHovered = $state(false);
  let popupHovered = $state(false);
  let focused = $state(false);
  const open = $derived(triggerHovered || popupHovered || focused);

  function blockWheel(event: WheelEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  function blockTouchMove(event: TouchEvent) {
    event.preventDefault();
  }

  function blockClick(event: MouseEvent) {
    event.stopPropagation();
  }

  function captureTrigger(node: HTMLButtonElement) {
    triggerEl = node;
  }

  function capturePopup(node: HTMLElement) {
    popupEl = node;
  }

  function hasContainingBlockStyle(styles: CSSStyleDeclaration): boolean {
    return [
      styles.transform,
      styles.translate,
      styles.rotate,
      styles.scale,
      styles.filter,
      styles.perspective,
    ].some((value) => value !== "none");
  }

  function hasContainingBlockHint(willChange: string): boolean {
    return WILL_CHANGE_CONTAINING_BLOCK.some((name) =>
      willChange.includes(name),
    );
  }

  function createsContainingBlock(styles: CSSStyleDeclaration): boolean {
    return (
      hasContainingBlockStyle(styles) ||
      hasContainingBlockHint(styles.willChange) ||
      styles.contain !== "none"
    );
  }

  function findContainingBlock(el: HTMLElement): HTMLElement | null {
    let node: HTMLElement | null = el.parentElement;
    while (node) {
      if (createsContainingBlock(getComputedStyle(node))) return node;
      node = node.parentElement;
    }
    return null;
  }

  function getHorizontalBounds(
    containingBlock: DOMRect | undefined,
  ): Pick<Bounds, "minX" | "maxX"> {
    if (!containingBlock) {
      return {
        minX: POPUP_PAD,
        maxX: window.innerWidth - POPUP_PAD,
      };
    }
    return {
      minX: Math.max(POPUP_PAD, containingBlock.left + POPUP_PAD),
      maxX: Math.min(
        window.innerWidth - POPUP_PAD,
        containingBlock.right - POPUP_PAD,
      ),
    };
  }

  function getVerticalBounds(
    containingBlock: DOMRect | undefined,
  ): Pick<Bounds, "minY" | "maxY"> {
    if (!containingBlock) {
      return {
        minY: POPUP_PAD,
        maxY: window.innerHeight - POPUP_PAD,
      };
    }
    return {
      minY: Math.max(POPUP_PAD, containingBlock.top + POPUP_PAD),
      maxY: Math.min(
        window.innerHeight - POPUP_PAD,
        containingBlock.bottom - POPUP_PAD,
      ),
    };
  }

  function getViewportBounds(containingBlock: DOMRect | undefined): Bounds {
    return {
      ...getHorizontalBounds(containingBlock),
      ...getVerticalBounds(containingBlock),
    };
  }

  function clampPopupLeft(
    left: number,
    popupWidth: number,
    bounds: Bounds,
  ): number {
    return Math.max(bounds.minX, Math.min(left, bounds.maxX - popupWidth));
  }

  function getPreferredPopupTop(
    triggerRect: DOMRect,
    popupHeight: number,
  ): number {
    return placement === "top"
      ? triggerRect.top - popupHeight - POPUP_GAP
      : triggerRect.bottom + POPUP_GAP;
  }

  function shouldFlipPopupDown(top: number, bounds: Bounds): boolean {
    return placement === "top" && top < bounds.minY;
  }

  function shouldFlipPopupUp(
    top: number,
    popupHeight: number,
    bounds: Bounds,
  ): boolean {
    return placement === "bottom" && top + popupHeight > bounds.maxY;
  }

  function getPopupTop(
    triggerRect: DOMRect,
    popupHeight: number,
    bounds: Bounds,
  ): number {
    const top = getPreferredPopupTop(triggerRect, popupHeight);
    if (shouldFlipPopupDown(top, bounds)) return triggerRect.bottom + POPUP_GAP;
    if (shouldFlipPopupUp(top, popupHeight, bounds)) {
      return triggerRect.top - popupHeight - POPUP_GAP;
    }
    return top;
  }

  function position() {
    if (!triggerEl || !popupEl) return;
    popupEl.style.top = "0px";
    popupEl.style.left = "0px";
    const triggerRect = triggerEl.getBoundingClientRect();
    const popupRect = popupEl.getBoundingClientRect();
    const containingBlock =
      findContainingBlock(popupEl)?.getBoundingClientRect();
    const bounds = getViewportBounds(containingBlock);
    const top = getPopupTop(triggerRect, popupRect.height, bounds);
    const centeredLeft =
      triggerRect.left + triggerRect.width / 2 - popupRect.width / 2;
    const left = clampPopupLeft(centeredLeft, popupRect.width, bounds);
    popupEl.style.top = `${top - popupRect.top}px`;
    popupEl.style.left = `${left - popupRect.left}px`;
  }

  $effect(() => {
    if (!open) return;
    position();
    const handler = () => position();
    window.addEventListener("resize", handler, { passive: true });
    window.addEventListener("scroll", handler, {
      passive: true,
      capture: true,
    });
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler, true);
    };
  });
</script>

<span
  {...styleAttributes(
    [infoTip.root, sx],
    [className].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  <button
    {@attach captureTrigger}
    type="button"
    aria-label={label}
    aria-expanded={open}
    onmouseenter={() => (triggerHovered = true)}
    onmouseleave={() => (triggerHovered = false)}
    onfocus={() => (focused = true)}
    onblur={() => (focused = false)}
    class={[stylex.attrs(infoTip.trigger).class]}
  >
    <span
      data-icon
      class={[stylex.attrs([infoTip.icon]).class]}
      aria-hidden="true"><SolarIcon icon={glyphs.infoCircle} /></span
    >
  </button>
  <span
    {@attach capturePopup}
    role="tooltip"
    aria-hidden={!open}
    data-open={open}
    onmouseenter={() => (popupHovered = true)}
    onmouseleave={() => (popupHovered = false)}
    onwheel={blockWheel}
    ontouchmove={blockTouchMove}
    onclick={blockClick}
    class={[stylex.attrs(infoTip.popup).class]}
  >
    {@render children()}
  </span>
</span>
