<script lang="ts">
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { autocomplete as autocompleteLayout } from "./autocomplete.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import { onMount, untrack } from "svelte";
  import {
    keyboardListAction,
    type KeyboardListAction,
  } from "../utils/keyboard-list";
  import {
    popoverIn,
    popoverOut,
    randomIdSuffix,
  } from "../utils/popover-motion";
  import {
    shouldCloseForAutocompletePointerTarget,
    shouldShowAutocompleteDropdown,
  } from "./helpers";

  const popIn = popoverIn;
  const popOut = popoverOut;
  let instanceId = randomIdSuffix();

  import type { AriaAttributes } from "svelte/elements";

  type Props = {
    "aria-invalid"?: AriaAttributes["aria-invalid"];
    value: string;
    onValueChange: (v: string) => void;
    suggestions: string[];
    placeholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    invalid?: boolean;
    id?: string;
    name?: string;
    maxlength?: number;
    "aria-describedby"?: string;
    maxVisibleItems?: number;
    class?: string;
  };

  let {
    "aria-invalid": ariaInvalid,
    value,
    onValueChange,
    suggestions,
    placeholder = "",
    emptyMessage = "No suggestions",
    disabled = false,
    invalid = false,
    id,
    name,
    maxlength,
    "aria-describedby": describedBy,
    maxVisibleItems = 8,
    sx,
    class: klass = "",
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  let draft = $state(untrack(() => value));
  let lastSyncedValue = $state(untrack(() => value));
  let open = $state(false);
  let browsing = $state(false);
  let highlight = $state(0);
  let inputEl = $state<HTMLInputElement | null>(null);
  let containerEl = $state<HTMLDivElement | null>(null);
  let popoverEl = $state<HTMLDivElement | null>(null);
  let listEl = $state<HTMLDivElement | null>(null);
  let scrollTop = $state(0);
  let scrollMax = $state(0);

  const listboxId = $derived(
    id ? `${id}-listbox` : `autocomplete-listbox-${instanceId}`,
  );

  const filtered = $derived.by(() => {
    const q = draft.trim().toLowerCase();
    if (browsing || !q) return suggestions;
    return suggestions.filter((s) => s.toLowerCase().includes(q));
  });
  const canScrollUp = $derived(scrollTop > 0);
  const canScrollDown = $derived(scrollTop < scrollMax - 1);

  function onScroll(e: Event) {
    const el = e.currentTarget as HTMLDivElement;
    scrollTop = el.scrollTop;
    scrollMax = el.scrollHeight - el.clientHeight;
  }

  function refreshScrollMetrics() {
    if (!listEl) return;
    scrollTop = listEl.scrollTop;
    scrollMax = listEl.scrollHeight - listEl.clientHeight;
  }

  $effect(() => {
    if (value !== lastSyncedValue) {
      lastSyncedValue = value;
      if (!open) draft = value;
    }
  });

  function commit(next: string) {
    const trimmed = next.trim();
    draft = trimmed;
    if (trimmed !== value) {
      lastSyncedValue = trimmed;
      onValueChange(trimmed);
    }
  }

  function openPopup(force = false) {
    if (disabled || (!force && !shouldShowAutocompleteDropdown(draft))) return;
    browsing = force;
    open = true;
    highlight = 0;
    queueMicrotask(refreshScrollMetrics);
  }

  $effect(() => {
    void filtered;
    if (open) queueMicrotask(refreshScrollMetrics);
  });

  function closePopup(commitDraft = true) {
    if (commitDraft) commit(draft);
    open = false;
  }

  function onInput(e: Event) {
    const v = (e.currentTarget as HTMLInputElement).value;
    draft = v;
    highlight = 0;
    if (shouldShowAutocompleteDropdown(v)) openPopup();
    else open = false;
  }

  function handleClosedKeydown(
    e: KeyboardEvent,
    action: KeyboardListAction,
  ): boolean {
    if (
      !["next", "previous"].includes(action) ||
      !shouldShowAutocompleteDropdown(draft)
    )
      return false;
    e.preventDefault();
    openPopup();
    return true;
  }

  function handleSelectKey(e: KeyboardEvent) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (filtered.length > 0) commit(filtered[highlight]);
    else commit(draft);
    open = false;
  }

  function moveNext() {
    if (filtered.length > 0) highlight = (highlight + 1) % filtered.length;
  }

  function movePrevious() {
    if (filtered.length > 0)
      highlight = (highlight - 1 + filtered.length) % filtered.length;
  }

  function resetDraft() {
    draft = value;
    open = false;
  }

  function commitTab() {
    commit(draft);
    open = false;
  }

  function moveFirst() {
    highlight = 0;
  }

  function moveLast() {
    if (filtered.length > 0) highlight = filtered.length - 1;
  }

  function handleDraftAction(
    e: KeyboardEvent,
    action: KeyboardListAction,
  ): boolean {
    switch (action) {
      case "close":
        e.preventDefault();
        resetDraft();
        return true;
      case "tab":
        commitTab();
        return true;
      default:
        return false;
    }
  }

  function handleStepMove(
    e: KeyboardEvent,
    action: KeyboardListAction,
  ): boolean {
    switch (action) {
      case "next":
        e.preventDefault();
        moveNext();
        return true;
      case "previous":
        e.preventDefault();
        movePrevious();
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
        moveFirst();
        return true;
      case "last":
        e.preventDefault();
        moveLast();
        return true;
      default:
        return false;
    }
  }

  function handleOpenAction(e: KeyboardEvent, action: KeyboardListAction) {
    if (action === "select") {
      handleSelectKey(e);
      return;
    }
    handleDraftAction(e, action) ||
      handleStepMove(e, action) ||
      handleEdgeMove(e, action);
  }

  function onKeydown(e: KeyboardEvent) {
    const action = keyboardListAction(e.key);
    if (!open && handleClosedKeydown(e, action)) return;
    if (open) handleOpenAction(e, action);
  }

  function onBlur(e: FocusEvent) {
    const next = e.relatedTarget as Node | null;
    if (next && popoverEl?.contains(next)) return;
    closePopup(true);
  }

  function onClickOption(s: string) {
    commit(s);
    open = false;
    inputEl?.focus();
  }

  function openSuggestions() {
    openPopup(true);
    inputEl?.focus();
  }

  onMount(() => {
    const onDocPointer = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (
        open &&
        shouldCloseForAutocompletePointerTarget(t, {
          container: containerEl,
          popover: popoverEl,
        })
      ) {
        closePopup(true);
      }
    };
    document.addEventListener("mousedown", onDocPointer);
    return () => document.removeEventListener("mousedown", onDocPointer);
  });
</script>

<div
  bind:this={containerEl}
  {...styleAttributes(
    [autocompleteLayout.root, sx],
    [klass].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  <div
    class={[stylex.attrs(autocompleteLayout.inputFrame).class, "group"]}
    data-invalid={invalid ? "true" : undefined}
  >
    <input
      bind:this={inputEl}
      {id}
      {name}
      {maxlength}
      aria-describedby={describedBy}
      type="text"
      autocomplete="off"
      role="combobox"
      aria-expanded={open}
      aria-controls={listboxId}
      aria-autocomplete="list"
      aria-activedescendant={open && filtered.length > 0
        ? `${listboxId}-${highlight}`
        : undefined}
      aria-invalid={invalid || ariaInvalid || undefined}
      {placeholder}
      {disabled}
      value={draft}
      oninput={onInput}
      onkeydown={onKeydown}
      onblur={onBlur}
      class={[stylex.attrs(autocompleteLayout.input).class]}
    />
    <button
      type="button"
      aria-label="Show suggestions"
      aria-controls={listboxId}
      aria-expanded={open}
      {disabled}
      onclick={openSuggestions}
      class={[stylex.attrs(autocompleteLayout.toggleButton).class]}
    >
      <span
        data-icon
        class={[stylex.attrs([autocompleteLayout.chevron]).class]}
        aria-hidden="true"><SolarIcon icon={glyphs.search} /></span
      >
    </button>
  </div>
  {#if open}
    <div
      bind:this={popoverEl}
      role="presentation"
      in:popIn
      out:popOut
      class={[stylex.attrs(autocompleteLayout.popup).class]}
    >
      <div class={[stylex.attrs(autocompleteLayout.scrollFrame).class]}>
        <div
          bind:this={listEl}
          id={listboxId}
          role="listbox"
          class={[stylex.attrs(autocompleteLayout.options).class]}
          style:--max={maxVisibleItems}
          onscroll={onScroll}
        >
          {#if filtered.length === 0}
            <div class={[stylex.attrs(autocompleteLayout.emptyMessage).class]}>
              {emptyMessage}
            </div>
          {:else}
            {#each filtered as item, i (item)}
              <button
                type="button"
                role="option"
                id="{listboxId}-{i}"
                aria-selected={i === highlight}
                onmousedown={(e) => e.preventDefault()}
                onclick={() => onClickOption(item)}
                onmouseenter={() => (highlight = i)}
                class={[
                  stylex.attrs(
                    autocompleteLayout.option,
                    i === highlight ? autocompleteLayout.highlighted : null,
                  ).class,
                ]}
              >
                {item}
              </button>
            {/each}
          {/if}
        </div>
        <div
          class={[stylex.attrs(autocompleteLayout.scrollUpFade).class]}
          data-show={canScrollUp || undefined}
          aria-hidden="true"
        >
          <span
            data-icon
            class={[stylex.attrs([autocompleteLayout.scrollIcon]).class]}
            aria-hidden="true"><SolarIcon icon={glyphs.chevronUp} /></span
          >
        </div>
        <div
          class={[stylex.attrs(autocompleteLayout.scrollDownFade).class]}
          data-show={canScrollDown || undefined}
          aria-hidden="true"
        >
          <span
            data-icon
            class={[stylex.attrs([autocompleteLayout.scrollIcon]).class]}
            aria-hidden="true"><SolarIcon icon={glyphs.chevronDown} /></span
          >
        </div>
      </div>
    </div>
  {/if}
</div>
