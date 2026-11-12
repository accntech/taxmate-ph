<script lang="ts">
  import { dateInput } from "./date-input.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import { quartOut } from "svelte/easing";
  import { tick } from "svelte";
  import DateField from "./date-field.svelte";
  import DateCalendar from "./date-calendar.svelte";
  import { getPopoverPortalParent, pickSide, place } from "./date-popover";

  type Props = {
    value?: string;
    name?: string;
    id?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: "true" | "false" | boolean;
    invalid?: boolean;
    disabled?: boolean;
    min?: string;
    max?: string;
    locale?: string;
    weekStartsOn?: 0 | 1;
    picker?: boolean;
    size?: "sm" | "md";
    class?: string;
    onfocus?: () => void;
    onblur?: () => void;
  };

  let {
    value = $bindable(""),
    name,
    id,
    "aria-label": ariaLabel,
    "aria-labelledby": labelledBy,
    "aria-describedby": describedBy,
    "aria-invalid": ariaInvalid,
    invalid = false,
    disabled = false,
    min,
    max,
    locale = "en-US",
    weekStartsOn = 0,
    picker = true,
    size = "md",
    sx,
    class: className = "",
    onfocus,
    onblur,
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  const popoverId = `date-popover-${Math.random().toString(36).slice(2, 10)}`;

  let anchorEl = $state<HTMLElement | undefined>();
  let popoverEl = $state<HTMLElement | undefined>();
  let popoverOpen = $state(false);
  let placement = $state<"bottom" | "top">("bottom");

  function observeFocus(node: HTMLElement) {
    if (!onfocus && !onblur) return;
    let focused = false;
    const contains = (target: EventTarget | null) =>
      target instanceof Node &&
      (node.contains(target) || !!popoverEl?.contains(target));
    const focusIn = (event: FocusEvent) => {
      if (!contains(event.target) || focused) return;
      focused = true;
      onfocus?.();
    };
    const focusOut = async () => {
      // Segment blur commits its buffer before consumers validate the date.
      await tick();
      if (!focused || contains(document.activeElement)) return;
      focused = false;
      onblur?.();
    };
    document.addEventListener("focusin", focusIn);
    document.addEventListener("focusout", focusOut);
    return () => {
      focused = false;
      document.removeEventListener("focusin", focusIn);
      document.removeEventListener("focusout", focusOut);
    };
  }

  function estimatePlacement(): "bottom" | "top" {
    if (!anchorEl) return "bottom";
    return pickSide(anchorEl.getBoundingClientRect(), window.innerHeight);
  }

  function togglePopover() {
    if (disabled) return;
    if (!popoverOpen) placement = estimatePlacement();
    popoverOpen = !popoverOpen;
  }

  function handleSelect(iso: string) {
    if (disabled) return;
    value = iso;
    popoverOpen = false;
  }

  function reposition() {
    if (!anchorEl || !popoverEl) return;
    const a = anchorEl.getBoundingClientRect();
    const p = popoverEl.getBoundingClientRect();
    const next = place(a, p, {
      width: window.innerWidth,
      height: window.innerHeight,
    });

    placement = next.side;
    popoverEl.style.top = `${next.top}px`;
    popoverEl.style.left = `${next.left}px`;
  }

  function onDocPointerDown(e: PointerEvent) {
    const target = e.target as Node | null;
    if (!target) return;
    if (popoverEl?.contains(target)) return;
    if (anchorEl?.contains(target)) return;
    popoverOpen = false;
  }

  function getTabbables(root: HTMLElement): HTMLElement[] {
    const nodes = root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    return Array.from(nodes).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );
  }

  // fallow-ignore-next-line complexity
  function onDocKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      popoverOpen = false;
      return;
    }
    if (e.key !== "Tab" || !popoverEl) return;
    const tabbables = getTabbables(popoverEl);
    if (tabbables.length === 0) {
      e.preventDefault();
      return;
    }
    const first = tabbables[0];
    const last = tabbables[tabbables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (!active || !popoverEl.contains(active)) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
      return;
    }
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function popoverIn(_node: Element) {
    const yStart = placement === "top" ? 4 : -4;
    return {
      duration: 180,
      easing: quartOut,
      css: (t: number) =>
        `opacity: ${t}; transform: translateY(${(1 - t) * yStart}px) scale(${0.96 + t * 0.04});`,
    };
  }

  function popoverOut(_node: Element) {
    return {
      duration: 120,
      easing: quartOut,
      css: (t: number) =>
        `opacity: ${t}; transform: scale(${0.97 + t * 0.03}); pointer-events: none;`,
    };
  }

  function portal(node: HTMLElement) {
    getPopoverPortalParent(anchorEl, document.body).appendChild(node);

    const popover = node as HTMLElement & {
      showPopover?: () => void;
      hidePopover?: () => void;
    };

    queueMicrotask(() => {
      if (
        !node.isConnected ||
        !popover.showPopover ||
        node.matches(":popover-open")
      )
        return;
      popover.showPopover();
      reposition();
    });

    return () => {
      if (popover.hidePopover && node.matches(":popover-open"))
        popover.hidePopover();
      node.remove();
    };
  }

  $effect(() => {
    if (disabled || !picker) {
      popoverOpen = false;
      return;
    }
    if (!popoverOpen || !anchorEl || !popoverEl) return;

    reposition();

    const restoreTarget = document.activeElement as HTMLElement | null;

    queueMicrotask(() => {
      if (!popoverEl) return;
      const initial =
        popoverEl.querySelector<HTMLElement>('[tabindex="0"]') ??
        getTabbables(popoverEl)[0];
      initial?.focus();
    });

    const handler = () => reposition();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    document.addEventListener("pointerdown", onDocPointerDown, true);
    document.addEventListener("keydown", onDocKeydown, true);

    const ro = new ResizeObserver(handler);
    ro.observe(anchorEl);
    ro.observe(popoverEl);

    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
      document.removeEventListener("pointerdown", onDocPointerDown, true);
      document.removeEventListener("keydown", onDocKeydown, true);
      ro.disconnect();
      restoreTarget?.focus();
    };
  });
</script>

<div
  {@attach observeFocus}
  bind:this={anchorEl}
  {...styleAttributes(
    [dateInput.root, sx],
    [className].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  <DateField
    bind:value
    {id}
    aria-label={ariaLabel}
    aria-labelledby={labelledBy}
    aria-describedby={describedBy}
    {disabled}
    invalid={invalid || ariaInvalid === true || ariaInvalid === "true"}
    {min}
    {max}
    {picker}
    {size}
    triggerPopover={picker ? togglePopover : undefined}
    {popoverId}
    {popoverOpen}
  />

  {#if picker && popoverOpen && !disabled}
    <div
      {@attach portal}
      bind:this={popoverEl}
      id={popoverId}
      role="dialog"
      aria-label="Choose date"
      popover="manual"
      class={[
        stylex.attrs(
          dateInput.calendar,
          placement === "top" ? dateInput.above : dateInput.below,
        ).class,
      ]}
      in:popoverIn
      out:popoverOut
    >
      <DateCalendar
        {value}
        {min}
        {max}
        {locale}
        {weekStartsOn}
        {disabled}
        onSelect={handleSelect}
      />
    </div>
  {/if}

  {#if name}
    <input type="hidden" {name} value={value ?? ""} {disabled} />
  {/if}
</div>
