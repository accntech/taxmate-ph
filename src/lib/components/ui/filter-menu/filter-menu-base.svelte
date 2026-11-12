<script lang="ts">
  import { icons as filterMenuIcons } from "./index.icons";
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { filterMenu } from "./filter-menu.styles";

  import fuzzysort from "fuzzysort";
  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import { Button } from "../button/base";
  import { Checkbox } from "../checkbox/base";
  import { Menu } from "../menu/base";
  import { ScrollFade } from "../scroll-fade";
  import { SearchBox } from "../search-box";
  import type { FilterDescriptor, FilterValue } from "./base";

  type DetailClasses = {
    header: stylex.StyleXStyles;
    backButton: stylex.StyleXStyles;
    applyRow: stylex.StyleXStyles;
    cancelButton: stylex.StyleXStyles;
    applyButton: stylex.StyleXStyles;
  };

  type Props = {
    descriptors: FilterDescriptor[];
    values: Record<string, FilterValue>;
    onapply: (patch: Record<string, FilterValue>) => void;
    label?: string;
    iconOnly?: boolean;
    rootLabel?: string;
    align?: "left" | "right";
    panelClass?: stylex.StyleXStyles;
    triggerClass?: stylex.StyleXStyles;
    mobileSheet?: boolean;
    backLabel?: string;
    emptyRootLabel?: string;
    onopenchange?: (open: boolean) => void;
    trigger?: Snippet<[{ open: boolean }]>;
    rootItems?: Snippet<
      [{ open: (id: string) => void; itemClass: stylex.StyleXStyles }]
    >;
    detail?: Snippet<
      [
        {
          id: string;
          close: () => void;
          back: () => void;
          classes: DetailClasses;
        },
      ]
    >;
  };

  let {
    descriptors,
    values,
    onapply,
    label = "Add filter",
    iconOnly = false,
    rootLabel = "Add filter",
    align = "left",
    panelClass = filterMenu.panel,
    triggerClass = filterMenu.trigger,
    mobileSheet = true,
    backLabel = "Back",
    emptyRootLabel,
    onopenchange,
    trigger: triggerSnippet,
    rootItems,
    detail,
  }: Props = $props();

  const ROOT_HEADER_CLASS = filterMenu.rootHeader;
  const SECTION_HEADER_CLASS = filterMenu.sectionHeader;
  const ROOT_ITEM_CLASS = filterMenu.rootItem;
  const OPTION_ITEM_CLASS = filterMenu.option;
  const OPTION_LIST_CLASS = filterMenu.options;
  const FADE_ARROW_CLASS = [filterMenu.scrollArrow];
  const BACK_BTN_CLASS = filterMenu.backButton;
  const APPLY_ROW_CLASS = filterMenu.footer;
  const CANCEL_BTN_CLASS = filterMenu.footerButton;
  const APPLY_BTN_CLASS = filterMenu.footerButton;
  const detailClasses: DetailClasses = {
    header: SECTION_HEADER_CLASS,
    backButton: BACK_BTN_CLASS,
    applyRow: APPLY_ROW_CLASS,
    cancelButton: CANCEL_BTN_CLASS,
    applyButton: APPLY_BTN_CLASS,
  };

  let activeFilterId = $state<string | null>(null);
  let picked = $state<Record<string, FilterValue>>({});
  let optionSearch = $state("");
  const activeDescriptor = $derived(
    descriptors.find((descriptor) => descriptor.id === activeFilterId),
  );
  const visibleOptions = $derived.by(() => {
    if (!activeDescriptor) return [];
    const term = optionSearch.trim().toLowerCase();
    if (!activeDescriptor.searchable || term.length === 0)
      return activeDescriptor.options;
    if (activeDescriptor.searchMode === "fuzzy") {
      return fuzzysort
        .go(term, activeDescriptor.options, {
          keys: [(option) => option.label, (option) => option.description ?? ""],
          threshold: 0,
          limit: 0,
        })
        .map((result) => result.obj);
    }
    return activeDescriptor.options.filter((option) => {
      const label = option.label.toLowerCase();
      const description = option.description?.toLowerCase() ?? "";
      return label.includes(term) || description.includes(term);
    });
  });

  function cloneValues(): Record<string, FilterValue> {
    const next: Record<string, FilterValue> = {};
    for (const descriptor of descriptors) {
      const value = values[descriptor.id];
      next[descriptor.id] = Array.isArray(value) ? [...value] : (value ?? null);
    }
    return next;
  }

  function setOpen(open: boolean) {
    if (open) {
      activeFilterId = null;
      picked = cloneValues();
    }
    onopenchange?.(open);
  }

  function open(id: string) {
    activeFilterId = id;
    optionSearch = "";
  }

  function back() {
    activeFilterId = null;
    optionSearch = "";
  }

  function isPicked(descriptor: FilterDescriptor, value: string): boolean {
    const current = picked[descriptor.id];
    if (descriptor.mode === "single") return current === value;
    if (descriptor.mode === "multi")
      return Array.isArray(current) && current.includes(value);
    return false;
  }

  function pick(descriptor: FilterDescriptor, value: string) {
    if (descriptor.mode === "single") {
      picked = {
        ...picked,
        [descriptor.id]: picked[descriptor.id] === value ? null : value,
      };
      return;
    }
    if (descriptor.mode === "multi") {
      const current = picked[descriptor.id];
      const selected = Array.isArray(current) ? current : [];
      picked = {
        ...picked,
        [descriptor.id]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      };
    }
  }

  function apply(descriptor: FilterDescriptor, close: () => void) {
    const value = picked[descriptor.id];
    onapply({
      [descriptor.id]:
        descriptor.mode === "multi" && Array.isArray(value)
          ? [...value]
          : value,
    });
    close();
  }
</script>

<Menu
  {label}
  {align}
  {panelClass}
  {mobileSheet}
  {triggerClass}
  onopenchange={setOpen}
>
  {#snippet trigger({ open })}
    {#if triggerSnippet}
      {@render triggerSnippet({ open })}
    {:else}
      <span
        data-icon
        class={[
          stylex.attrs(filterMenu.menuIcon).class,
          "filter-menu-trigger-icon",
        ]}
        aria-hidden="true"><SolarIcon icon={filterMenuIcons.menuIcon} /></span
      >
      {#if !iconOnly}<span
          class={[
            stylex.attrs(filterMenu.triggerLabel).class,
            "filter-menu-trigger-label",
          ]}>{label}</span
        >{/if}
    {/if}
  {/snippet}
  {#snippet content({ close })}
    <span class={[stylex.attrs(filterMenu.accentEdge).class]} aria-hidden="true"
    ></span>
    {#if activeFilterId === null}
      <div class={[stylex.attrs(ROOT_HEADER_CLASS).class]}>
        {rootLabel}
      </div>
      {#each descriptors as descriptor (descriptor.id)}
        <button
          type="button"
          role="menuitem"
          class={[stylex.attrs(ROOT_ITEM_CLASS).class]}
          onclick={() => open(descriptor.id)}
        >
          {#if descriptor.icon}
            <span
              data-icon
              class={[stylex.attrs(filterMenu.filterIcon).class]}
              aria-hidden="true"><SolarIcon icon={descriptor.icon} /></span
            >
          {/if}
          <span>{descriptor.label}</span>
          <span
            data-icon
            class={[stylex.attrs([filterMenu.nextIcon]).class]}
            aria-hidden="true"><SolarIcon icon={glyphs.chevronRight} /></span
          >
        </button>
      {/each}
      {#if descriptors.length === 0 && emptyRootLabel}
        <div class={[stylex.attrs(filterMenu.emptyFilters).class]}>
          {emptyRootLabel}
        </div>
      {/if}
      {@render rootItems?.({ open, itemClass: ROOT_ITEM_CLASS })}
    {:else if activeDescriptor && !activeDescriptor.custom}
      <div class={[stylex.attrs(SECTION_HEADER_CLASS).class]}>
        <button
          type="button"
          onclick={back}
          aria-label={backLabel}
          class={[stylex.attrs(BACK_BTN_CLASS).class]}
        >
          <span
            data-icon
            class={[stylex.attrs([filterMenu.backIcon]).class]}
            aria-hidden="true"><SolarIcon icon={glyphs.chevronLeft} /></span
          >
        </button>
        <span>{activeDescriptor.label}</span>
      </div>
      {#if activeDescriptor.searchable}
        <div class={[stylex.attrs(filterMenu.searchRow).class]}>
          <SearchBox
            value={optionSearch}
            onsearch={(value) => {
              optionSearch = value ?? "";
            }}
            placeholder={activeDescriptor.searchPlaceholder ??
              `Search ${activeDescriptor.label}`}
            label={`Search ${activeDescriptor.label}`}
            size="compact"
            debounceMs={0}
            inputClass={filterMenu.searchInput}
          />
        </div>
      {/if}
      {#if activeDescriptor.options.length === 0}
        <div class={[stylex.attrs(filterMenu.emptyOptions).class]}>
          {activeDescriptor.emptyLabel ?? "No options"}
        </div>
      {:else if visibleOptions.length === 0}
        <div class={[stylex.attrs(filterMenu.emptyOptions).class]}>
          No matches
        </div>
      {:else}
        <ScrollFade
          trackClass={OPTION_LIST_CLASS}
          arrowClass={FADE_ARROW_CLASS}
        >
          {#each visibleOptions as option (option.value)}
            <button
              type="button"
              role="menuitemcheckbox"
              aria-checked={isPicked(activeDescriptor, option.value)}
              onclick={() => pick(activeDescriptor, option.value)}
              class={[
                stylex.attrs(
                  isPicked(activeDescriptor, option.value)
                    ? filterMenu.selected
                    : null,
                  OPTION_ITEM_CLASS,
                ).class,
              ]}
            >
              <Checkbox checked={isPicked(activeDescriptor, option.value)} />
              <span class={[stylex.attrs(filterMenu.optionDetails).class]}>
                <span class={[stylex.attrs(filterMenu.optionLabel).class]}
                  >{option.label}</span
                >
                {#if option.description}
                  <span
                    class={[stylex.attrs(filterMenu.optionDescription).class]}
                    >{option.description}</span
                  >
                {/if}
              </span>
            </button>
          {/each}
        </ScrollFade>
      {/if}
      <div class={[stylex.attrs(APPLY_ROW_CLASS).class]}>
        <Button
          type="button"
          size="compact"
          variant="ghost"
          sx={CANCEL_BTN_CLASS}
          onclick={close}
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="compact"
          variant="accent"
          sx={APPLY_BTN_CLASS}
          onclick={() => apply(activeDescriptor, close)}
        >
          Apply
        </Button>
      </div>
    {:else}
      {@render detail?.({
        id: activeFilterId,
        close,
        back,
        classes: detailClasses,
      })}
    {/if}
  {/snippet}
</Menu>

<style>
  .filter-menu-trigger-icon {
    display: block;
    flex: none;
    width: 0.875rem;
    height: 0.875rem;
  }

  .filter-menu-trigger-label {
    display: none;
  }

  @media (min-width: 768px) {
    .filter-menu-trigger-label {
      display: inline;
    }
  }
</style>
