<script lang="ts" module>
  import { glyphs } from "../glyphs";

  import { type Snippet } from "svelte";
  import { type KeyboardListAction } from "../utils/keyboard-list";

  import { combobox as comboboxLayout } from "./combobox.styles";
  import { get as getStore } from "svelte/store";

  import { styleAttributes } from "../styles/style-attributes";

  export type ComboboxOption<
    TValue extends string = string,
    TData = undefined,
  > = {
    value: TValue;
    label: string;
    secondary?: string;
    badge?: string;
    group?: string;
    disabled?: boolean;
    data?: TData;
  };
</script>

<script lang="ts" generics="TValue extends string = string, TData = undefined">
  import CheckIcon from "@solar-icons/svelte-v2/linear/check";
  import AddIcon from "@solar-icons/svelte-v2/linear/add";
  import { Icon as SolarIcon } from "../icon/base";

  import * as stylex from "@stylexjs/stylex";
  import {
    createVirtualizer,
    observeElementRect,
  } from "@tanstack/svelte-virtual";
  import fuzzysort from "fuzzysort";

  import { onMount, tick } from "svelte";
  import { getPopoverPortalParent, place } from "../date-input/date-popover";
  import { watchTriggerVisibility } from "../utils/trigger-visibility";

  import { keyboardListAction } from "../utils/keyboard-list";
  import {
    popoverIn,
    popoverOut,
    randomIdSuffix,
  } from "../utils/popover-motion";

  const popIn = popoverIn;
  const popOut = popoverOut;
  let instanceId = randomIdSuffix();

  import type { AriaAttributes } from "svelte/elements";

  type Props = {
    "aria-required"?: AriaAttributes["aria-required"];
    "aria-describedby"?: AriaAttributes["aria-describedby"];
    "aria-invalid"?: AriaAttributes["aria-invalid"];
    options: ComboboxOption<TValue, TData>[];
    value: TValue | TValue[] | null;
    onValueChange: (v: TValue | TValue[] | null) => void;
    onCreate?: (query: string) => void;
    createLabel?: string;
    multiple?: boolean;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    invalid?: boolean;
    clearable?: boolean;
    id?: string;
    name?: string;
    popupWidth?: number;
    itemHeight?: number;
    maxVisibleItems?: number;
    class?: string;
    option?: Snippet<[ComboboxOption<TValue, TData>, Snippet<["label" | "secondary" | "badge"]>]>;
    trigger?: Snippet<[ComboboxOption<TValue, TData>]>;
  };

  let {
    "aria-required": ariaRequired,
    "aria-describedby": describedBy,
    "aria-invalid": ariaInvalid,
    options,
    value,
    onValueChange,
    onCreate,
    createLabel,
    multiple = false,
    placeholder = "Select…",
    searchPlaceholder = "Search…",
    emptyMessage = "No results",
    disabled = false,
    invalid = false,
    clearable = false,
    id,
    name,
    popupWidth,
    itemHeight = 32,
    maxVisibleItems = 8,
    sx,
    class: klass = "",
    option: optionSnippet,
    trigger: triggerSnippet,
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  let open = $state(false);
  let query = $state("");
  let triggerEl = $state<HTMLButtonElement | null>(null);
  let popoverEl = $state<HTMLDivElement | null>(null);
  let inputEl = $state<HTMLInputElement | null>(null);
  let listEl = $state<HTMLDivElement | null>(null);
  let highlight = $state(0);
  let scrollTop = $state(0);

  const listboxId = $derived(
    id ? `${id}-listbox` : `combobox-listbox-${instanceId}`,
  );

  type MatchedOption = ComboboxOption<TValue, TData> & {
    labelIndexes: ReadonlyArray<number>;
    secondaryIndexes: ReadonlyArray<number>;
    badgeIndexes: ReadonlyArray<number>;
  };
  type Row =
    | { kind: "header"; key: string; label: string }
    | { kind: "option"; key: string; option: MatchedOption; position: number };
  type HighlightedSegment = {
    start: number;
    text: string;
    highlighted: boolean;
  };

  const selectedSet = $derived.by<Set<TValue>>(() => {
    if (multiple) return new Set(Array.isArray(value) ? value : []);
    return new Set(value != null && !Array.isArray(value) ? [value] : []);
  });

  const normalizedQuery = $derived(query.trim().toLocaleLowerCase());
  const filteredOptions = $derived.by<MatchedOption[]>(() => {
    if (!normalizedQuery) {
      return options.map((option) => ({
        ...option,
        labelIndexes: [],
        secondaryIndexes: [],
        badgeIndexes: [],
      }));
    }

    return fuzzysort
      .go(normalizedQuery, options, {
        keys: [
          (option) => option.label,
          (option) => option.secondary ?? "",
          (option) => option.badge ?? "",
        ],
        limit: 0,
        threshold: 0,
      })
      .map((result) => ({
        ...result.obj,
        labelIndexes: result[0].indexes,
        secondaryIndexes: result[1].indexes,
        badgeIndexes: result[2].indexes,
      }));
  });

  const filteredFlat = $derived.by<Row[]>(() => {
    const grouped = filteredOptions.reduce<Record<string, MatchedOption[]>>(
      (groups, option) => {
        const group = option.group ?? "";
        if (!groups[group]) groups[group] = [];
        groups[group].push(option);
        return groups;
      },
      {},
    );
    const rows: Row[] = [];
    let position = 0;

    for (const [group, groupOptions] of Object.entries(grouped)) {
      if (group)
        rows.push({ kind: "header", key: `group:${group}`, label: group });
      for (const option of groupOptions) {
        rows.push({
          kind: "option",
          key: `option:${option.value}`,
          option,
          position,
        });
        position += 1;
      }
    }

    return rows;
  });

  const optionIndices = $derived(
    filteredFlat
      .map((r, i) => (r.kind === "option" ? i : -1))
      .filter((i) => i !== -1),
  );

  const selectedLabels = $derived.by(() => {
    if (selectedSet.size === 0) return [];
    const map = new Map(options.map((o) => [o.value, o.label]));
    return [...selectedSet].map((v) => map.get(v) ?? String(v));
  });

  const selectedOption = $derived.by(() => {
    if (multiple || selectedSet.size === 0) return null;
    const v = [...selectedSet][0];
    return options.find((o) => o.value === v) ?? null;
  });

  const trimmedQuery = $derived(query.trim());

  const exactMatch = $derived.by(() => {
    const q = trimmedQuery.toLowerCase();
    if (!q) return false;
    return options.some((o) => o.label.toLowerCase() === q);
  });

  const showCreate = $derived(typeof onCreate === "function" && trimmedQuery.length > 0 && !exactMatch);
  const createIndex = $derived(showCreate ? filteredFlat.length : -1);
  const closedOpenActions: KeyboardListAction[] = ["next", "select"];

  const viewportHeight = $derived(itemHeight * maxVisibleItems);
  const rowVirtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: 0,
    getScrollElement: () => listEl,
    estimateSize: (index) =>
      filteredFlat[index]?.kind === "header" ? 32 : itemHeight,
    getItemKey: (index) => filteredFlat[index]?.key ?? index,
    initialRect: { width: 0, height: 300 },
    observeElementRect: (instance, callback) =>
      observeElementRect(instance, (rect) =>
        callback({ width: rect.width, height: rect.height || viewportHeight }),
      ),
    measureElement: (element) => {
      const index = Number(element.dataset.index);
      return (
        element.getBoundingClientRect().height ||
        (filteredFlat[index]?.kind === "header" ? 32 : itemHeight)
      );
    },
    overscan: 4,
  });

  $effect(() => {
    const rows = filteredFlat;
    const scrollElement = listEl;
    getStore(rowVirtualizer).setOptions({
      count: rows.length,
      getScrollElement: () => scrollElement,
      estimateSize: (index) =>
        rows[index]?.kind === "header" ? 32 : itemHeight,
      getItemKey: (index) => rows[index]?.key ?? index,
    });
  });

  const totalHeight = $derived($rowVirtualizer.getTotalSize());
  const canScrollUp = $derived(scrollTop > 0);
  const canScrollDown = $derived(totalHeight - scrollTop - viewportHeight > 1);

  function toggleOpen() {
    if (disabled) return;
    if (open) {
      open = false;
      return;
    }

    query = "";
    const selectedIndex = filteredFlat.findIndex(
      (row) => row.kind === "option" && selectedSet.has(row.option.value),
    );
    const fallback = optionIndices[0] ?? (showCreate ? createIndex : 0);
    highlight = selectedIndex >= 0 ? selectedIndex : fallback;
    scrollTop = 0;
    open = true;
    focusInput();
    tick().then(() => {
      getStore(rowVirtualizer).scrollToIndex(highlight, { align: "center" });
      scrollTop = listEl?.scrollTop ?? 0;
    });
  }

  async function focusInput() {
    await tick();
    inputEl?.focus();
    inputEl?.select();
  }

  function close() {
    open = false;
    triggerEl?.focus();
  }

  function isOptionRow(i: number) {
    return filteredFlat[i]?.kind === "option";
  }

  function nextHighlight(dir: 1 | -1, jump = 1): number {
    const total = filteredFlat.length + (showCreate ? 1 : 0);
    if (total === 0) return 0;
    let i = highlight;
    for (let step = 0; step < jump; step++) {
      let attempts = 0;
      do {
        i = (i + dir + total) % total;
        attempts++;
      } while (attempts < total && i !== createIndex && !isOptionRow(i));
    }
    return i;
  }

  function ensureVisible(index: number) {
    if (index === createIndex) return;
    getStore(rowVirtualizer).scrollToIndex(index, { align: "auto" });
  }

  function handleSearchInput() {
    highlight = optionIndices[0] ?? (showCreate ? createIndex : 0);
    getStore(rowVirtualizer).scrollToOffset(0);
    scrollTop = 0;
  }

  function measureRow(node: HTMLDivElement) {
    getStore(rowVirtualizer).measureElement(node);
  }

  function getHighlightedSegments(
    text: string,
    indexes: ReadonlyArray<number>,
  ): HighlightedSegment[] {
    const highlightedIndexes = new Set(indexes);
    const segments: HighlightedSegment[] = [];

    for (let index = 0; index < text.length; index += 1) {
      const character = text.charAt(index);
      const highlighted = highlightedIndexes.has(index);
      const previous = segments.at(-1);

      if (previous?.highlighted === highlighted) previous.text += character;
      else segments.push({ start: index, text: character, highlighted });
    }

    return segments;
  }

  function triggerCreate() {
    if (!onCreate || !trimmedQuery) return;
    onCreate(trimmedQuery);
    close();
  }

  function handleClosedKeydown(e: KeyboardEvent, action: KeyboardListAction) {
    if (closedOpenActions.includes(action)) {
      e.preventDefault();
      toggleOpen();
    }
  }

  function handleSelectKey(e: KeyboardEvent) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (
      showCreate &&
      (highlight === createIndex || filteredFlat.length === 0)
    ) {
      triggerCreate();
    } else {
      commit(highlight);
    }
  }

  function moveHighlight(index: number) {
    highlight = index;
    ensureVisible(highlight);
  }

  function handleStepMove(
    e: KeyboardEvent,
    action: KeyboardListAction,
  ): boolean {
    switch (action) {
      case "next":
        e.preventDefault();
        moveHighlight(nextHighlight(1));
        return true;
      case "previous":
        e.preventDefault();
        moveHighlight(nextHighlight(-1));
        return true;
      default:
        return false;
    }
  }

  function handleEdgeMove(
    e: KeyboardEvent,
    action: KeyboardListAction,
  ): boolean {
    switch (action) {
      case "first":
        e.preventDefault();
        moveHighlight(optionIndices[0] ?? 0);
        return true;
      case "last":
        e.preventDefault();
        moveHighlight(optionIndices[optionIndices.length - 1] ?? 0);
        return true;
      default:
        return false;
    }
  }

  function handlePageMove(
    e: KeyboardEvent,
    action: KeyboardListAction,
  ): boolean {
    switch (action) {
      case "page-next":
        e.preventDefault();
        moveHighlight(nextHighlight(1, maxVisibleItems));
        return true;
      case "page-previous":
        e.preventDefault();
        moveHighlight(nextHighlight(-1, maxVisibleItems));
        return true;
      default:
        return false;
    }
  }

  function handleOpenAction(e: KeyboardEvent, action: KeyboardListAction) {
    if (action === "close") {
      e.preventDefault();
      close();
      return;
    }
    if (action === "select") {
      handleSelectKey(e);
      return;
    }
    handleStepMove(e, action) ||
      handleEdgeMove(e, action) ||
      handlePageMove(e, action);
  }

  function onKeydown(e: KeyboardEvent) {
    if (open && e.key === "Tab") {
      close();
      return;
    }
    if (e.target === inputEl && e.key === " ") return;
    const action = keyboardListAction(e.key);
    if (!open) {
      handleClosedKeydown(e, action);
      return;
    }
    handleOpenAction(e, action);
  }

  function commit(index: number) {
    const row = filteredFlat[index];
    if (!row || row.kind !== "option" || row.option.disabled) return;
    const v = row.option.value;
    if (multiple) {
      const set = new Set(selectedSet);
      if (set.has(v)) set.delete(v);
      else set.add(v);
      onValueChange([...set]);
    } else {
      onValueChange(v);
      close();
    }
  }

  function onScroll(e: Event) {
    scrollTop = (e.currentTarget as HTMLDivElement).scrollTop;
  }

  function reposition() {
    if (!triggerEl || !popoverEl) return;
    const anchor = triggerEl.getBoundingClientRect();
    popoverEl.style.width = `${Math.min(popupWidth ?? anchor.width, window.innerWidth - 16)}px`;
    const next = place(anchor, popoverEl.getBoundingClientRect(), {
      width: window.innerWidth, height: window.innerHeight,
    });
    popoverEl.style.top = `${next.top}px`;
    popoverEl.style.left = `${next.left}px`;
  }

  function portal(node: HTMLElement) {
    getPopoverPortalParent(triggerEl ?? undefined, document.body).appendChild(node);
    queueMicrotask(() => {
      if (!node.isConnected) return;
      node.showPopover?.();
      reposition();
    });
    return () => { node.remove(); };
  }

  $effect(() => {
    if (!open || !triggerEl || !popoverEl) return;
    reposition();
    const stopWatching = watchTriggerVisibility(triggerEl, popoverEl, () => { open = false; });
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

  function onDocClick(e: MouseEvent) {
    if (!open) return;
    const t = e.target as Node;
    if (popoverEl?.contains(t) || triggerEl?.contains(t)) return;
    open = false;
  }

  onMount(() => {
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  });

  const triggerLabel = $derived.by(() => {
    if (multiple) {
      if (selectedLabels.length === 0) return placeholder;
      if (selectedLabels.length <= 2) return selectedLabels.join(", ");
      return `${selectedLabels.length} selected`;
    }
    return selectedLabels[0] ?? placeholder;
  });

  const hiddenValue = $derived(
    multiple ? (Array.isArray(value) ? value.join(",") : "") : (value ?? ""),
  );

  const canClear = $derived(clearable && !disabled && selectedSet.size > 0);

  function clearSelection(e: MouseEvent | KeyboardEvent) {
    e.stopPropagation();
    e.preventDefault();
    onValueChange(multiple ? [] : null);
    triggerEl?.focus();
  }
</script>

{#snippet highlightedText(text: string, indexes: ReadonlyArray<number> = [])}
  {#if indexes.length === 0}
    {text}
  {:else}
    {#each getHighlightedSegments(text, indexes) as segment (segment.start)}
      {#if segment.highlighted}
        <mark class={[stylex.attrs(comboboxLayout.match).class]}
          >{segment.text}</mark
        >
      {:else}
        {segment.text}
      {/if}
    {/each}
  {/if}
{/snippet}

{#snippet itemBadge(label: string, indexes: ReadonlyArray<number> = [])}
  <span class={[stylex.attrs(comboboxLayout.displayLabel).class]}>
    {@render highlightedText(label, indexes)}
  </span>
{/snippet}

<div
  {...styleAttributes(
    [comboboxLayout.positioningFrame, sx],
    [klass].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  {#if name}
    <input type="hidden" {name} value={hiddenValue} />
  {/if}
  <button
    bind:this={triggerEl}
    type="button"
    {id}
    role="combobox"
    aria-expanded={open}
    aria-haspopup="listbox"
    aria-controls={listboxId}
    aria-disabled={disabled}
    aria-required={ariaRequired}
    aria-describedby={describedBy}
    aria-invalid={invalid || ariaInvalid || false}
    data-invalid={invalid ? "true" : undefined}
    {disabled}
    onclick={toggleOpen}
    onkeydown={onKeydown}
    class={[stylex.attrs(comboboxLayout.trigger).class]}
  >
    {#if triggerSnippet && selectedOption}
      {@render triggerSnippet(selectedOption)}
    {:else if selectedOption}
      <span class={[stylex.attrs(comboboxLayout.selection).class]}>
        {#if selectedOption.secondary}
          <span class={[stylex.attrs(comboboxLayout.secondary).class]}>
            {selectedOption.secondary}
          </span>
        {/if}
        <span class={[stylex.attrs(comboboxLayout.label).class]}
          >{selectedOption.label}</span
        >
        {#if selectedOption.badge}
          {@render itemBadge(selectedOption.badge)}
        {/if}
      </span>
    {:else}
      <span
        class={[
          stylex.attrs(
            comboboxLayout.label,
            selectedLabels.length === 0 && comboboxLayout.placeholder,
          ).class,
        ]}
      >
        {triggerLabel}
      </span>
    {/if}
    <span
      data-icon
      class={[
        stylex.attrs(
          [comboboxLayout.chevron],
          canClear && comboboxLayout.clearButtonSpace,
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
      class={[stylex.attrs(comboboxLayout.clearButton).class]}
    >
      <span
        data-icon
        class={[stylex.attrs([comboboxLayout.clearIcon]).class]}
        aria-hidden="true"><SolarIcon icon={glyphs.closeCircle} /></span
      >
    </button>
  {/if}

  {#if open}
    <div
      {@attach portal}
      bind:this={popoverEl}
      popover="manual"
      style="position: fixed; margin: 0; max-width: calc(100vw - 16px);"
      class={[stylex.attrs(comboboxLayout.popup).class]}
      in:popIn
      out:popOut
    >
      <div class={[stylex.attrs(comboboxLayout.searchRow).class]}>
        <label class={[stylex.attrs(comboboxLayout.searchField).class]}>
          <span
            data-icon
            class={[stylex.attrs([comboboxLayout.searchIcon]).class]}
            aria-hidden="true"><SolarIcon icon={glyphs.search} /></span
          >
          <input
            bind:this={inputEl}
            bind:value={query}
            placeholder={searchPlaceholder}
            class={[stylex.attrs(comboboxLayout.searchInput).class]}
            oninput={handleSearchInput}
            onkeydown={onKeydown}
          />
        </label>
      </div>
      {#if filteredOptions.length === 0}
        <div
          class={[
            stylex.attrs(
              comboboxLayout.emptyMessage,
              showCreate
                ? comboboxLayout.emptyWithCreate
                : comboboxLayout.emptyWithoutCreate,
            ).class,
          ]}
        >
          {emptyMessage}
        </div>
      {:else}
        <div class={[stylex.attrs(comboboxLayout.positioningFrame).class]}>
          <div
            bind:this={listEl}
            id={listboxId}
            role="listbox"
            aria-multiselectable={multiple}
            class={[stylex.attrs(comboboxLayout.options).class]}
            style:max-height="min({viewportHeight}px, calc(100dvh - 88px - {showCreate ? Math.min(itemHeight, 36) + 2 : 0}px))"
            onscroll={onScroll}
          >
            <div
              class={[stylex.attrs(comboboxLayout.spacer).class]}
              style:height="{totalHeight}px"
            >
              {#each $rowVirtualizer.getVirtualItems() as virtualItem (virtualItem.key)}
                {@const row = filteredFlat[virtualItem.index]}
                {#if row}
                  <div
                    {@attach measureRow}
                    data-index={virtualItem.index}
                    class={[stylex.attrs(comboboxLayout.virtualRow).class]}
                    style:transform="translateY({virtualItem.start}px)"
                  >
                    {#if row.kind === "header"}
                      <div
                        class={[stylex.attrs(comboboxLayout.groupHeader).class]}
                      >
                        {row.label}
                      </div>
                    {:else}
                      {@const sel = selectedSet.has(row.option.value)}
                      {@const hl = virtualItem.index === highlight}
                      <div
                        class={[stylex.attrs(comboboxLayout.groupBody).class]}
                      >
                        <button
                          type="button"
                          id={`${listboxId}-option-${row.position}`}
                          role="option"
                          aria-selected={sel}
                          aria-disabled={row.option.disabled}
                          aria-posinset={row.position + 1}
                          aria-setsize={filteredOptions.length}
                          disabled={row.option.disabled}
                          onclick={() => commit(virtualItem.index)}
                          onmouseenter={() => (highlight = virtualItem.index)}
                          class={[
                            stylex.attrs(
                              comboboxLayout.option,
                              hl ? comboboxLayout.highlighted : null,
                            ).class,
                          ]}
                          style:height="{itemHeight}px"
                        >
                          {#if multiple}
                            <span
                              class={[
                                stylex.attrs(
                                  comboboxLayout.checkbox,
                                  sel
                                    ? comboboxLayout.checked
                                    : comboboxLayout.unchecked,
                                ).class,
                              ]}
                              aria-hidden="true"
                            >
                              {#if sel}
                                <CheckIcon
                                  class={stylex.attrs(
                                    comboboxLayout.checkboxIcon,
                                  ).class}
                                  strokeWidth="3"
                                  aria-hidden="true"
                                  focusable="false"
                                />
                              {/if}
                            </span>
                          {/if}
                          {#if optionSnippet}
                            {#snippet matchedText(field: "label" | "secondary" | "badge")}
                              {@render highlightedText(row.option[field] ?? "", row.option[`${field}Indexes`])}
                            {/snippet}
                            {@render optionSnippet(row.option, matchedText)}
                          {:else}
                            <span
                              class={[
                                stylex.attrs(comboboxLayout.optionDetails)
                                  .class,
                              ]}
                            >
                              <span
                                class={[
                                  stylex.attrs(comboboxLayout.optionHeading)
                                    .class,
                                ]}
                              >
                                {#if row.option.secondary}
                                  <span
                                    class={[
                                      stylex.attrs(comboboxLayout.secondary)
                                        .class,
                                    ]}
                                  >
                                    {@render highlightedText(
                                      row.option.secondary,
                                      row.option.secondaryIndexes,
                                    )}
                                  </span>
                                {/if}
                                <span
                                  class={[
                                    stylex.attrs(comboboxLayout.optionLabel)
                                      .class,
                                  ]}
                                >
                                  {@render highlightedText(
                                    row.option.label,
                                    row.option.labelIndexes,
                                  )}
                                </span>
                              </span>
                              {#if row.option.badge}
                                {@render itemBadge(
                                  row.option.badge,
                                  row.option.badgeIndexes,
                                )}
                              {/if}
                            </span>
                          {/if}
                          {#if !multiple && sel}
                            <CheckIcon
                              class={stylex.attrs(comboboxLayout.checkIcon)
                                .class}
                              strokeWidth="3"
                              aria-hidden="true"
                              focusable="false"
                            />
                          {/if}
                        </button>
                      </div>
                    {/if}
                  </div>
                {/if}
              {/each}
            </div>
          </div>
          <div
            class={[stylex.attrs(comboboxLayout.scrollUpFade).class]}
            data-show={canScrollUp || undefined}
            aria-hidden="true"
          >
            <span
              data-icon
              class={[stylex.attrs([comboboxLayout.scrollIcon]).class]}
              aria-hidden="true"><SolarIcon icon={glyphs.chevronUp} /></span
            >
          </div>
          <div
            class={[stylex.attrs(comboboxLayout.scrollDownFade).class]}
            data-show={canScrollDown || undefined}
            aria-hidden="true"
          >
            <span
              data-icon
              class={[stylex.attrs([comboboxLayout.scrollIcon]).class]}
              aria-hidden="true"><SolarIcon icon={glyphs.chevronDown} /></span
            >
          </div>
        </div>
      {/if}
      {#if showCreate}
        <div class={[stylex.attrs(comboboxLayout.createFooter).class]}>
          <button
            type="button"
            onclick={triggerCreate}
            onmouseenter={() => (highlight = createIndex)}
            class={[
              stylex.attrs(
                comboboxLayout.createButton,
                highlight === createIndex && comboboxLayout.highlighted,
              ).class,
            ]}
            style:height="{Math.min(itemHeight, 36)}px"
          >
            <span
              class={[stylex.attrs(comboboxLayout.createBadge).class]}
              aria-hidden="true"
            >
              <AddIcon
                class={stylex.attrs(comboboxLayout.createIcon).class}
                strokeWidth="3"
                aria-hidden="true"
                focusable="false"
              />
            </span>
            <span class={[stylex.attrs(comboboxLayout.createLabel).class]}>
              {#if trimmedQuery}
                {createLabel ?? "Create"}
                <span class={[stylex.attrs(comboboxLayout.createQuery).class]}
                  >"{trimmedQuery}"</span
                >
              {:else}
                {createLabel ?? "Create new"}
              {/if}
            </span>
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>
