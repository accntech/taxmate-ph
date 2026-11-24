<script lang="ts">
  import {
    Autocomplete as SdkAutocomplete,
    AutocompleteContent,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteList,
    createAutocompleteController,
  } from "@ui-sdk/svelte/autocomplete";
  import { Button } from "@ui-sdk/svelte/button";
  import * as stylex from "@stylexjs/stylex";
  import { tick, untrack } from "svelte";
  import type { AriaAttributes } from "svelte/elements";
  import { Icon as SolarIcon } from "../icon/base";
  import { glyphs } from "../glyphs";
  import { styleAttributes } from "../styles/style-attributes";
  import { popoverIn, popoverOut } from "../utils/popover-motion";
  import { shouldShowAutocompleteDropdown } from "./helpers";
  import { autocomplete as autocompleteLayout } from "./autocomplete.styles";

  type Props = {
    "aria-invalid"?: AriaAttributes["aria-invalid"];
    value: string;
    onValueChange: (value: string) => void;
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
    sx?: stylex.StyleXStyles;
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
  }: Props = $props();

  const controller = createAutocompleteController();
  let draft = $state(untrack(() => value));
  let lastSyncedValue = $state(untrack(() => value));
  let open = $state(false);
  let browsing = $state(false);
  let highlight = $state<string | null>(null);
  let inputEl = $state<HTMLInputElement | null>(null);
  let listEl = $state<HTMLDivElement | null>(null);
  let canScrollUp = $state(false);
  let canScrollDown = $state(false);

  const filtered = $derived.by(() => {
    const query = draft.trim().toLowerCase();
    if (browsing || !query) return suggestions;
    return suggestions.filter((suggestion) => suggestion.toLowerCase().includes(query));
  });

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

  function refreshScrollMetrics() {
    if (!listEl) return;
    canScrollUp = listEl.scrollTop > 0;
    canScrollDown = listEl.scrollTop < listEl.scrollHeight - listEl.clientHeight - 1;
  }

  function onKeydown(event: KeyboardEvent) {
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      draft = value;
      controller.close();
    } else if (event.key === "Tab") {
      commit(draft);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      controller.highlight((event.key === "Home" ? filtered[0] : filtered.at(-1)) ?? null);
    }
  }

  async function openSuggestions() {
    if (disabled) return;
    browsing = true;
    await tick();
    controller.setOpen(true);
    controller.highlight(filtered[0] ?? null);
    inputEl?.focus();
  }

  $effect(() => {
    if (!open || !listEl) return;
    refreshScrollMetrics();
    const observer = new ResizeObserver(refreshScrollMetrics);
    observer.observe(listEl);
    return () => observer.disconnect();
  });
</script>

<SdkAutocomplete
  {controller}
  bind:open
  value={draft}
  items={filtered}
  filter={false}
  {disabled}
  autoHighlight
  loop
  modal={false}
  onValueChange={(next, details) => {
    draft = next;
    if (details.reason === "input-change") browsing = false;
    if (details.reason === "item-press") commit(next);
  }}
  onOpenChange={(next, details) => {
    if (next && !browsing && !shouldShowAutocompleteDropdown(draft)) {
      details.cancel();
      return;
    }
    if (!next && details.reason === "escape-key") draft = value;
    else if (!next && details.reason !== "item-press") commit(draft);
  }}
  onSubmit={(next, details) => {
    details.event?.preventDefault();
    commit(next);
  }}
  onHighlight={(next) => {
    highlight = next;
    void tick().then(refreshScrollMetrics);
  }}
>
  <div {...styleAttributes([autocompleteLayout.root, sx], [klass].flat(Infinity).filter(Boolean).join(" "))}>
    <div class={[stylex.attrs(autocompleteLayout.inputFrame).class, "group"]} data-invalid={invalid ? "true" : undefined}>
      <AutocompleteInput
        {id}
        {name}
        {maxlength}
        {placeholder}
        aria-describedby={describedBy}
        autocomplete="off"
        onkeydown={onKeydown}
        onblur={() => commit(draft)}
        class={stylex.attrs(autocompleteLayout.input).class}
      >
        {#snippet render({ props })}
          <input {...props} bind:this={inputEl} role="combobox" aria-invalid={invalid || ariaInvalid || undefined} />
        {/snippet}
      </AutocompleteInput>
      <Button
        type="button"
        aria-label="Show suggestions"
        aria-expanded={open}
        {disabled}
        onclick={openSuggestions}
        class={stylex.attrs(autocompleteLayout.toggleButton).class}
      >
        <span data-icon class={stylex.attrs(autocompleteLayout.chevron).class} aria-hidden="true"><SolarIcon icon={glyphs.search} /></span>
      </Button>
    </div>
    <AutocompleteContent
      side="bottom"
      align="start"
      sideOffset={4}
      class={stylex.attrs(autocompleteLayout.popup).class}
      style="width: var(--anchor-width);"
    >
      {#snippet render({ props })}
        <div {...props} in:popoverIn|global out:popoverOut|global>
          <div class={stylex.attrs(autocompleteLayout.scrollFrame).class}>
            <AutocompleteList class={stylex.attrs(autocompleteLayout.options).class} style={`--max: ${maxVisibleItems}`} onscroll={refreshScrollMetrics}>
              {#snippet render({ props: listProps })}
                <div {...listProps} bind:this={listEl}>
                  {#if filtered.length === 0}
                    <div class={stylex.attrs(autocompleteLayout.emptyMessage).class}>{emptyMessage}</div>
                  {:else}
                    {#each filtered as item (item)}
                      <AutocompleteItem value={item} class={stylex.attrs(autocompleteLayout.option, highlight === item && autocompleteLayout.highlighted).class}>
                        {item}
                      </AutocompleteItem>
                    {/each}
                  {/if}
                </div>
              {/snippet}
            </AutocompleteList>
            <div class={stylex.attrs(autocompleteLayout.scrollUpFade).class} data-show={canScrollUp || undefined} aria-hidden="true">
              <span data-icon class={stylex.attrs(autocompleteLayout.scrollIcon).class}><SolarIcon icon={glyphs.chevronUp} /></span>
            </div>
            <div class={stylex.attrs(autocompleteLayout.scrollDownFade).class} data-show={canScrollDown || undefined} aria-hidden="true">
              <span data-icon class={stylex.attrs(autocompleteLayout.scrollIcon).class}><SolarIcon icon={glyphs.chevronDown} /></span>
            </div>
          </div>
        </div>
      {/snippet}
    </AutocompleteContent>
  </div>
</SdkAutocomplete>
