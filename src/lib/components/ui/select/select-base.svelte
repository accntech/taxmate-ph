<script lang="ts" module>
  import { glyphs } from "../glyphs";

  import { type KeyboardListAction } from "../utils/keyboard-list";

  import { select as selectLayout } from "./select.styles";

  import { styleAttributes } from "../styles/style-attributes";

  export type SelectOption<TValue extends string = string> = {
    value: TValue;
    label: string;
    description?: string;
    disabled?: boolean;
  };
</script>

<script lang="ts" generics="TValue extends string = string">
  import CheckIcon from "@solar-icons/svelte-v2/linear/check";
  import { Icon as SolarIcon } from "../icon/base";

  import * as stylex from "@stylexjs/stylex";
  import { tick } from "svelte";
  import { watchTriggerVisibility } from "../utils/trigger-visibility";
  import { quartOut } from "svelte/easing";
  import { getPopoverPortalParent, place } from "../date-input/date-popover";

  import { keyboardListAction } from "../utils/keyboard-list";
  import {
    appendTypeahead,
    matchingTypeaheadIndex,
    nextOptionScrollTop,
    shouldCloseForPointerTarget,
  } from "./helpers";

  import type { Snippet } from "svelte";
  import type { AriaAttributes } from "svelte/elements";

  type Props = {
    "aria-label"?: AriaAttributes["aria-label"];
    "aria-labelledby"?: AriaAttributes["aria-labelledby"];
    "aria-required"?: AriaAttributes["aria-required"];
    "aria-describedby"?: AriaAttributes["aria-describedby"];
    "aria-invalid"?: AriaAttributes["aria-invalid"];
    options: SelectOption<TValue>[];
    value: TValue | "";
    onValueChange: (v: TValue | "") => void;
    placeholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    invalid?: boolean;
    clearable?: boolean;
    id?: string;
    name?: string;
    class?: string;
  };

  let {
    "aria-label": ariaLabel,
    "aria-labelledby": labelledBy,
    "aria-required": ariaRequired,
    "aria-describedby": describedBy,
    "aria-invalid": ariaInvalid,
    options,
    value,
    onValueChange,
    placeholder = "Select…",
    emptyMessage = "No options",
    disabled = false,
    invalid = false,
    clearable = false,
    id,
    name,
    sx,
    labelSx,
    triggerSx,
    popupSx,
    optionContent,
    class: klass = "",
  }: Props & {
    sx?: stylex.StyleXStyles;
    labelSx?: stylex.StyleXStyles;
    triggerSx?: stylex.StyleXStyles;
    popupSx?: stylex.StyleXStyles;
    optionContent?: Snippet<[SelectOption<TValue>, boolean]>;
  } = $props();

  const instanceId = $props.id();
  const listboxId = $derived(id ? `${id}-listbox` : `${instanceId}-listbox`);

  let open = $state(false);
  let triggerEl = $state<HTMLButtonElement | null>(null);
  let popoverEl = $state<HTMLDivElement | null>(null);
  let listEl = $state<HTMLDivElement | null>(null);
  let placement = $state<"bottom" | "top">("bottom");
  let highlight = $state(-1);
  let typeahead = $state("");
  let typeaheadTimer: ReturnType<typeof setTimeout> | null = null;
  let scrollTop = $state(0);
  let scrollHeight = $state(0);
  let clientHeight = $state(0);

  const canScrollUp = $derived(scrollTop > 0);
  const canScrollDown = $derived(scrollHeight - scrollTop - clientHeight > 1);

  function syncScrollMetrics() {
    if (!listEl) return;
    scrollTop = listEl.scrollTop;
    scrollHeight = listEl.scrollHeight;
    clientHeight = listEl.clientHeight;
  }

  const enabledIndices = $derived(
    options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i !== -1),
  );

  const selectedIndex = $derived(options.findIndex((o) => o.value === value));
  const selectedLabel = $derived(
    selectedIndex >= 0 ? options[selectedIndex].label : "",
  );
  const closedOpenActions: KeyboardListAction[] = [
    "next",
    "previous",
    "select",
  ];

  function popIn(_node: Element) {
    const yStart = placement === "top" ? 3 : -3;
    return {
      duration: 150,
      easing: quartOut,
      css: (t: number) =>
        `opacity: ${t}; transform: scale(${0.97 + t * 0.03}) translateY(${(1 - t) * yStart}px);`,
    };
  }

  function popOut(_node: Element) {
    return {
      duration: 110,
      easing: quartOut,
      css: (t: number) =>
        `opacity: ${t}; transform: scale(${0.97 + t * 0.03}); pointer-events: none;`,
    };
  }

  async function openList() {
    if (disabled) return;
    open = true;
    highlight = selectedIndex >= 0 ? selectedIndex : (enabledIndices[0] ?? -1);
    await tick();
    ensureVisible(highlight);
    syncScrollMetrics();
  }

  function closeList(restoreFocus = true) {
    open = false;
    typeahead = "";
    if (restoreFocus) triggerEl?.focus();
  }

  function toggle() {
    if (open) closeList();
    else openList();
  }

  function commit(index: number) {
    const opt = options[index];
    if (!opt || opt.disabled) return;
    onValueChange(opt.value);
    closeList();
  }

  function ensureVisible(index: number) {
    if (!listEl || index < 0) return;
    const items = listEl.querySelectorAll<HTMLButtonElement>('[role="option"]');
    const el = items[index];
    if (!el) return;
    listEl.scrollTop = nextOptionScrollTop(
      { scrollTop: listEl.scrollTop, clientHeight: listEl.clientHeight },
      { top: el.offsetTop, bottom: el.offsetTop + el.offsetHeight },
    );
    syncScrollMetrics();
  }

  function nextEnabled(from: number, dir: 1 | -1): number {
    if (enabledIndices.length === 0) return -1;
    const len = options.length;
    let i = from;
    for (let step = 0; step < len; step++) {
      i = (i + dir + len) % len;
      if (!options[i].disabled) return i;
    }
    return from;
  }

  function applyTypeahead(ch: string) {
    if (typeaheadTimer) clearTimeout(typeaheadTimer);
    typeahead = appendTypeahead(typeahead, ch);
    typeaheadTimer = setTimeout(() => {
      typeahead = "";
    }, 600);
    const start = highlight >= 0 ? highlight : 0;
    const index = matchingTypeaheadIndex(options, typeahead, start);
    if (index < 0) return;
    highlight = index;
    ensureVisible(index);
  }

  function isPrintableKey(key: string) {
    return key.length === 1 && /\S/.test(key);
  }

  function handleClosedKeydown(
    event: KeyboardEvent,
    action: KeyboardListAction,
  ) {
    if (closedOpenActions.includes(action)) {
      event.preventDefault();
      openList();
      return;
    }
    if (isPrintableKey(event.key)) {
      event.preventDefault();
      openList();
      applyTypeahead(event.key);
    }
  }

  function moveHighlight(index: number) {
    highlight = index;
    ensureVisible(highlight);
  }

  function handleOpenTypeahead(event: KeyboardEvent) {
    if (!isPrintableKey(event.key)) return;
    event.preventDefault();
    applyTypeahead(event.key);
  }

  function handleCloseAction(
    event: KeyboardEvent,
    action: KeyboardListAction,
  ): boolean {
    switch (action) {
      case "close":
        event.preventDefault();
        closeList(true);
        return true;
      case "tab":
        closeList(false);
        return true;
      default:
        return false;
    }
  }

  function handleStepMove(
    event: KeyboardEvent,
    action: KeyboardListAction,
  ): boolean {
    switch (action) {
      case "next":
        event.preventDefault();
        moveHighlight(nextEnabled(highlight, 1));
        return true;
      case "previous":
        event.preventDefault();
        moveHighlight(nextEnabled(highlight, -1));
        return true;
      default:
        return false;
    }
  }

  function handleFirstMove(
    event: KeyboardEvent,
    action: KeyboardListAction,
  ): boolean {
    if (action !== "first") return false;
    event.preventDefault();
    moveHighlight(enabledIndices[0] ?? -1);
    return true;
  }

  function handleLastMove(
    event: KeyboardEvent,
    action: KeyboardListAction,
  ): boolean {
    if (action !== "last") return false;
    event.preventDefault();
    moveHighlight(enabledIndices[enabledIndices.length - 1] ?? -1);
    return true;
  }

  function handleSelectAction(
    event: KeyboardEvent,
    action: KeyboardListAction,
  ): boolean {
    if (action !== "select") return false;
    event.preventDefault();
    if (highlight >= 0) commit(highlight);
    return true;
  }

  function handleOpenMoveOrSelect(
    event: KeyboardEvent,
    action: KeyboardListAction,
  ): boolean {
    if (handleStepMove(event, action)) return true;
    if (handleFirstMove(event, action)) return true;
    if (handleLastMove(event, action)) return true;
    return handleSelectAction(event, action);
  }

  function handleOpenAction(
    event: KeyboardEvent,
    action: KeyboardListAction,
  ): boolean {
    if (handleCloseAction(event, action)) return true;
    return handleOpenMoveOrSelect(event, action);
  }

  function onKeydown(event: KeyboardEvent) {
    if (disabled) return;
    const action = keyboardListAction(event.key);
    if (!open) {
      handleClosedKeydown(event, action);
      return;
    }
    if (!handleOpenAction(event, action)) handleOpenTypeahead(event);
  }

  function onWindowPointerDown(event: PointerEvent) {
    if (!open) return;
    if (
      shouldCloseForPointerTarget(event.target as Node | null, [
        triggerEl,
        popoverEl,
      ])
    )
      closeList(false);
  }

  function reposition() {
    if (!triggerEl || !popoverEl) return;

    const anchor = triggerEl.getBoundingClientRect();
    popoverEl.style.width = `${Math.round(anchor.width)}px`;

    const next = place(anchor, popoverEl.getBoundingClientRect(), {
      width: window.innerWidth,
      height: window.innerHeight,
    });

    placement = next.side;
    popoverEl.style.top = `${next.top}px`;
    popoverEl.style.left = `${next.left}px`;
  }

  function portal(node: HTMLElement) {
    getPopoverPortalParent(triggerEl ?? undefined, document.body).appendChild(
      node,
    );

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
    if (!open || !triggerEl || !popoverEl) return;

    const stopWatching = watchTriggerVisibility(triggerEl, popoverEl, () => closeList(false));
    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);

    const observer = new ResizeObserver(reposition);
    observer.observe(triggerEl);
    observer.observe(popoverEl);

    return () => {
      stopWatching();
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
      observer.disconnect();
    };
  });

  const canClear = $derived(clearable && !disabled && selectedIndex >= 0);

  function clearSelection(event: MouseEvent | KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    onValueChange("");
    closeList(false);
    triggerEl?.focus();
  }
</script>

<svelte:window onpointerdown={onWindowPointerDown} />

<div
  {...styleAttributes(
    [selectLayout.root, sx],
    [klass].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  <button
    bind:this={triggerEl}
    {id}
    type="button"
    role="combobox"
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls={listboxId}
    aria-activedescendant={open && highlight >= 0
      ? `${instanceId}-opt-${highlight}`
      : undefined}
    aria-label={ariaLabel}
    aria-labelledby={labelledBy}
    aria-required={ariaRequired}
    aria-describedby={describedBy}
    aria-invalid={invalid || ariaInvalid || undefined}
    aria-disabled={disabled || undefined}
    {disabled}
    onclick={toggle}
    onkeydown={onKeydown}
    class={[
      stylex.attrs(
        selectLayout.trigger,
        triggerSx,
        open && selectLayout.open,
        invalid && [selectLayout.invalidBorder],
        invalid && [selectLayout.invalidHalo],
      ).class,
    ]}
  >
    <span
      {...stylex.attrs(
        selectLayout.label,
        labelSx,
        selectedLabel ? null : selectLayout.placeholder,
      )}
    >
      {#if optionContent && selectedIndex >= 0}
        {@render optionContent(options[selectedIndex], true)}
      {:else}
        {selectedLabel || placeholder}
      {/if}
    </span>
    <span
      data-icon
      class={[
        stylex.attrs(
          [selectLayout.chevron],
          open && selectLayout.openChevron,
          canClear && selectLayout.clearButtonSpace,
        ).class,
      ]}
      aria-hidden="true"><SolarIcon icon={glyphs.chevronDown} /></span
    >
  </button>

  {#if canClear}
    <button
      type="button"
      tabindex="-1"
      aria-label="Clear selection"
      onclick={clearSelection}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") clearSelection(e);
      }}
      class={[stylex.attrs(selectLayout.clearButton).class]}
    >
      <span
        data-icon
        class={[stylex.attrs([selectLayout.clearIcon]).class]}
        aria-hidden="true"><SolarIcon icon={glyphs.closeCircle} /></span
      >
    </button>
  {/if}

  {#if name}
    <input type="hidden" {name} {value} />
  {/if}

  {#if open}
    <div
      {@attach portal}
      bind:this={popoverEl}
      popover="manual"
      {...stylex.attrs(
        selectLayout.popup,
        popupSx,
        placement === "top" ? selectLayout.above : selectLayout.below,
      )}
      in:popIn
      out:popOut
    >
      <div
        bind:this={listEl}
        id={listboxId}
        role="listbox"
        tabindex="-1"
        onscroll={syncScrollMetrics}
        class={[stylex.attrs(selectLayout.options).class]}
      >
        {#if options.length === 0}
          <div class={[stylex.attrs(selectLayout.emptyMessage).class]}>
            {emptyMessage}
          </div>
        {:else}
          {#each options as opt, i (opt.value)}
            {@const isSelected = i === selectedIndex}
            {@const isHighlighted = i === highlight}
            <button
              id="{instanceId}-opt-{i}"
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-disabled={opt.disabled || undefined}
              disabled={opt.disabled}
              onmouseenter={() => {
                if (!opt.disabled) highlight = i;
              }}
              onclick={() => commit(i)}
              class={[
                stylex.attrs(
                  selectLayout.option,
                  isHighlighted && !opt.disabled
                    ? selectLayout.highlighted
                    : null,
                  optionContent && isSelected && selectLayout.selected,
                ).class,
              ]}
            >
              <span class={[stylex.attrs(selectLayout.optionDetails).class]}>
                {#if optionContent}
                  {@render optionContent(opt, false)}
                {:else}
                  <span {...stylex.attrs(selectLayout.optionLabel, labelSx)}
                    >{opt.label}</span
                  >
                {/if}
                {#if !optionContent && opt.description}
                  <span
                    class={[stylex.attrs(selectLayout.optionDescription).class]}
                  >
                    {opt.description}
                  </span>
                {/if}
              </span>
              {#if isSelected}
                <CheckIcon
                  class={stylex.attrs(selectLayout.checkIcon).class}
                  strokeWidth="3"
                  aria-hidden="true"
                  focusable="false"
                />
              {/if}
            </button>
          {/each}
        {/if}
      </div>
      <div
        class={[stylex.attrs(selectLayout.scrollUpFade).class]}
        data-show={canScrollUp || undefined}
        aria-hidden="true"
      >
        <span
          data-icon
          class={[stylex.attrs([selectLayout.scrollIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.chevronUp} /></span
        >
      </div>
      <div
        class={[stylex.attrs(selectLayout.scrollDownFade).class]}
        data-show={canScrollDown || undefined}
        aria-hidden="true"
      >
        <span
          data-icon
          class={[stylex.attrs([selectLayout.scrollIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.chevronDown} /></span
        >
      </div>
    </div>
  {/if}
</div>
