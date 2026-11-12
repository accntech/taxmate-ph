<script module lang="ts">
  import { glyphs } from "../glyphs";

  import { searchBox } from "./search-box.styles";

  import { styleAttributes } from "../styles/style-attributes";

  type SyncInput = {
    externalValue: string | null | undefined;
    inputValue: string;
    syncedExternalValue: string;
  };

  type SyncOutput = {
    inputValue: string;
    syncedExternalValue: string;
  };

  function normalizeSearchValue(value: string | null | undefined) {
    return value ?? "";
  }

  function getSyncedListSearchValue({
    externalValue,
    inputValue,
    syncedExternalValue,
  }: SyncInput): SyncOutput {
    const nextExternalValue = normalizeSearchValue(externalValue);
    if (nextExternalValue === syncedExternalValue) {
      return { inputValue, syncedExternalValue };
    }
    return {
      inputValue: nextExternalValue,
      syncedExternalValue: nextExternalValue,
    };
  }

  function toListSearchQueryValue(value: string) {
    const next = value.trim();
    return next.length > 0 ? next : null;
  }
</script>

<script lang="ts">
  import { Icon as SolarIcon } from "../icon/base";

  import * as stylex from "@stylexjs/stylex";
  import { Button } from "../button/base";
  import type { Action } from "svelte/action";
  import { onDestroy } from "svelte";
  import { Input } from "../input/base";
  import type { InputSize } from "../input/input.styles";

  type Props = {
    value?: string | null;
    onsearch: (value: string | null) => void;
    placeholder?: string;
    label?: string;
    autofocus?: boolean;
    size?: InputSize;
    debounceMs?: number;
    class?: string;
    inputClass?: stylex.StyleXStyles;
    shortcut?: Action<HTMLElement, string>;
    shortcutId?: string;
  };

  let {
    value = "",
    onsearch,
    placeholder = "Search",
    label = "Search",
    autofocus = false,
    size = "normal",
    debounceMs = 250,
    sx,
    class: className = "",
    inputClass = searchBox.input,
    shortcut,
    shortcutId = "",
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  const noopAction: Action<HTMLElement, string> = () => ({});
  const shortcutAction = $derived(shortcut ?? noopAction);
  let inputValue = $state(initialValue());
  let syncedValue = $state(initialValue());
  let debounceId: ReturnType<typeof setTimeout> | undefined;

  function initialValue() {
    return value ?? "";
  }

  function syncExternalValue(
    _: HTMLElement,
    externalValue: string | null | undefined,
  ) {
    applyExternalValue(externalValue);
    return {
      update(nextExternalValue: string | null | undefined) {
        applyExternalValue(nextExternalValue);
      },
    };
  }

  function applyExternalValue(externalValue: string | null | undefined) {
    const next = getSyncedListSearchValue({
      externalValue,
      inputValue,
      syncedExternalValue: syncedValue,
    });
    inputValue = next.inputValue;
    syncedValue = next.syncedExternalValue;
  }

  function queueSearch() {
    if (debounceId) clearTimeout(debounceId);
    debounceId = setTimeout(() => {
      onsearch(toListSearchQueryValue(inputValue));
    }, debounceMs);
  }

  function clearSearch() {
    inputValue = "";
    if (debounceId) clearTimeout(debounceId);
    onsearch(null);
  }

  onDestroy(() => {
    if (debounceId) clearTimeout(debounceId);
  });
</script>

<div
  use:shortcutAction={shortcutId}
  use:syncExternalValue={value}
  {...styleAttributes(
    [searchBox.root, sx],
    [className].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  <Input
    bind:value={inputValue}
    type="search"
    {size}
    {placeholder}
    {autofocus}
    aria-label={label}
    oninput={queueSearch}
    sx={inputClass}
    class="search-box-input"
  >
    {#snippet leading()}
      <span
        data-icon
        class={[stylex.attrs([searchBox.searchIcon]).class]}
        aria-hidden="true"><SolarIcon icon={glyphs.search} /></span
      >
    {/snippet}
    {#snippet trailing()}
      {#if inputValue.length > 0}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onclick={clearSearch}
          sx={searchBox.clearButton}
          aria-label="Clear search"
        >
          <span
            data-icon
            class={[stylex.attrs([searchBox.clearIcon]).class]}
            aria-hidden="true"><SolarIcon icon={glyphs.closeCircle} /></span
          >
        </Button>
      {/if}
    {/snippet}
  </Input>
</div>

<style>
  @layer overrides {
    :global(.search-box-input input::-webkit-search-cancel-button) {
      display: none;
    }
  }
</style>
