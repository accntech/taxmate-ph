<script lang="ts">
  // Ported from PCSTI packages/ui/src/components/filter-menu/index.svelte.
  // Its StyleX declarations are translated below without a second styling runtime.
  import { tick } from "svelte";
  import { SvelteMap } from "svelte/reactivity";
  import Menu from "../menu/menu.svelte";
  import Icon from "../icon/icon.svelte";
  import Checkbox from "../checkbox/checkbox.svelte";
  import { glyphs } from "../icons";
  import {
    cloneFilterValues,
    filterPatch,
    toggleFilterValue,
    type FilterDescriptor,
    type FilterValue,
  } from "./filter-types";

  let {
    descriptors,
    values,
    onapply,
    label = "Add filter",
    iconOnly = false,
    rootLabel = "Add filter",
    align = "left",
    mobileSheet = true,
    backLabel = "Back",
    emptyRootLabel,
    onopenchange,
  }: {
    descriptors: FilterDescriptor[];
    values: Record<string, FilterValue>;
    onapply: (patch: Record<string, FilterValue>) => void;
    label?: string;
    iconOnly?: boolean;
    rootLabel?: string;
    align?: "left" | "right";
    mobileSheet?: boolean;
    backLabel?: string;
    emptyRootLabel?: string;
    onopenchange?: (open: boolean) => void;
  } = $props();

  let activeFilterId = $state<string | null>(null);
  let picked = $state<Record<string, FilterValue>>({});
  let optionSearch = $state("");
  let backButton: HTMLButtonElement | undefined;
  const rootButtons = new SvelteMap<string, HTMLButtonElement>();
  const activeDescriptor = $derived(
    descriptors.find((descriptor) => descriptor.id === activeFilterId),
  );
  const visibleOptions = $derived.by(() => {
    if (!activeDescriptor) return [];
    const term = optionSearch.trim().toLocaleLowerCase();
    if (!activeDescriptor.searchable || !term) return activeDescriptor.options;
    return activeDescriptor.options.filter((option) =>
      `${option.label} ${option.description ?? ""}`
        .toLocaleLowerCase()
        .includes(term),
    );
  });

  function setOpen(open: boolean) {
    activeFilterId = null;
    optionSearch = "";
    picked = open ? cloneFilterValues(descriptors, values) : {};
    onopenchange?.(open);
  }

  async function openFilter(id: string) {
    activeFilterId = id;
    optionSearch = "";
    await tick();
    backButton?.focus();
  }

  async function back() {
    const previous = activeFilterId;
    activeFilterId = null;
    optionSearch = "";
    await tick();
    if (previous) rootButtons.get(previous)?.focus();
  }

  function isPicked(descriptor: FilterDescriptor, value: string) {
    const current = picked[descriptor.id];
    return descriptor.mode === "single"
      ? current === value
      : Array.isArray(current) && current.includes(value);
  }

  function pick(descriptor: FilterDescriptor, value: string) {
    picked = {
      ...picked,
      [descriptor.id]: toggleFilterValue(
        descriptor,
        picked[descriptor.id],
        value,
      ),
    };
  }

  function apply(descriptor: FilterDescriptor, close: () => void) {
    onapply(filterPatch(descriptor, picked));
    close();
  }

  function rememberBackButton(node: HTMLButtonElement) {
    backButton = node;
    return () => {
      if (backButton === node) backButton = undefined;
    };
  }

  function rememberRootButton(id: string) {
    return (node: HTMLButtonElement) => {
      rootButtons.set(id, node);
      return () => rootButtons.delete(id);
    };
  }
</script>

<Menu
  {label}
  {align}
  {mobileSheet}
  panelClass="pcsti-filter-panel"
  triggerClass="pcsti-filter-trigger"
  onopenchange={setOpen}
>
  {#snippet trigger()}
    <span data-icon class="menu-icon" aria-hidden="true"
      ><Icon icon={glyphs.filter} /></span
    >
    {#if !iconOnly}<span class="trigger-label">{label}</span>{/if}
  {/snippet}
  {#snippet content({ close })}
    <span class="accent-edge" aria-hidden="true"></span>
    {#if activeFilterId === null}
      <div class="root-header">{rootLabel}</div>
      {#each descriptors as descriptor (descriptor.id)}
        <button
          {@attach rememberRootButton(descriptor.id)}
          type="button"
          role="menuitem"
          class="root-item"
          onclick={() => void openFilter(descriptor.id)}
        >
          {#if descriptor.icon}<span
              data-icon
              class="filter-icon"
              aria-hidden="true"><Icon icon={descriptor.icon} /></span
            >{/if}
          <span>{descriptor.label}</span>
          <span data-icon class="next-icon" aria-hidden="true"
            ><Icon icon={glyphs.chevronRight} /></span
          >
        </button>
      {/each}
      {#if descriptors.length === 0 && emptyRootLabel}<div
          class="empty-options"
        >
          {emptyRootLabel}
        </div>{/if}
    {:else if activeDescriptor}
      <div class="section-header">
        <button
          {@attach rememberBackButton}
          type="button"
          onclick={() => void back()}
          aria-label={backLabel}
          class="back-button"
        >
          <span data-icon class="back-icon" aria-hidden="true"
            ><Icon icon={glyphs.chevronLeft} /></span
          >
        </button>
        <span>{activeDescriptor.label}</span>
      </div>
      {#if activeDescriptor.searchable}
        <div class="search-row">
          <input
            type="search"
            bind:value={optionSearch}
            aria-label={`Search ${activeDescriptor.label}`}
            placeholder={activeDescriptor.searchPlaceholder ??
              `Search ${activeDescriptor.label}`}
          />
        </div>
      {/if}
      {#if !activeDescriptor.options.length}
        <div class="empty-options">
          {activeDescriptor.emptyLabel ?? "No options"}
        </div>
      {:else if !visibleOptions.length}
        <div class="empty-options">No matches</div>
      {:else}
        <div class="options" role="group" aria-label={activeDescriptor.label}>
          {#each visibleOptions as option (option.value)}
            <button
              type="button"
              role="menuitemcheckbox"
              aria-checked={isPicked(activeDescriptor, option.value)}
              onclick={() => pick(activeDescriptor, option.value)}
              class={[
                "option",
                isPicked(activeDescriptor, option.value) && "selected",
              ]}
            >
              <Checkbox checked={isPicked(activeDescriptor, option.value)} />
              <span class="option-details"
                ><span class="option-label">{option.label}</span
                >{#if option.description}<span class="option-description"
                    >{option.description}</span
                  >{/if}</span
              >
            </button>
          {/each}
        </div>
      {/if}
      <div class="footer">
        <button type="button" class="footer-button cancel" onclick={close}
          >Cancel</button
        >
        <button
          type="button"
          class="footer-button apply"
          onclick={() => apply(activeDescriptor, close)}>Apply</button
        >
      </div>
    {/if}
  {/snippet}
</Menu>

<style>
  /* PCSTI filter-menu/index.styles.ts: same spacing, type, radii and semantic surfaces. */
  :global(.pcsti-filter-panel) {
    width: max-content;
    min-width: 13.75rem;
    max-width: 18rem;
  }
  :global(.pcsti-filter-trigger) {
    height: 1.875rem;
    min-height: 1.875rem;
    gap: 0.375rem;
    padding-inline: 0.625rem;
    background: var(--bg);
    font-size: 0.75rem;
    line-height: 1rem;
    color: var(--fg-muted);
  }
  :global(.pcsti-filter-trigger:hover) {
    color: var(--fg);
    background: var(--bg-hover);
  }
  .menu-icon {
    display: block;
    flex: none;
    width: 0.875rem;
    height: 0.875rem;
  }
  .trigger-label {
    display: inline;
  }
  .accent-edge {
    display: none;
  }
  .root-header,
  .section-header {
    padding: 0.5rem 0.625rem 0.25rem;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--fg-subtle);
    text-transform: uppercase;
  }
  .section-header {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }
  .root-item,
  .option {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    padding: 0.375rem 0.625rem;
    text-align: left;
    font-size: 12.5px;
    color: var(--fg);
    cursor: pointer;
    outline: none;
    transition:
      background-color 160ms var(--ease-ui),
      color 160ms var(--ease-ui),
      border-color 160ms var(--ease-ui),
      box-shadow 160ms var(--ease-ui);
  }
  .option {
    margin-block: 0.125rem;
  }
  .root-item:hover,
  .option:hover,
  .selected {
    background: var(--bg-hover);
  }
  .root-item:focus-visible,
  .option:focus-visible,
  .back-button:focus-visible,
  .footer-button:focus-visible,
  input:focus-visible {
    border-color: color-mix(in oklch, var(--accent) 60%, var(--border));
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
  }
  .filter-icon,
  .next-icon {
    display: block;
    flex: none;
    width: 0.875rem;
    height: 0.875rem;
    color: var(--fg-subtle);
  }
  .next-icon {
    margin-left: auto;
  }
  .back-button {
    display: grid;
    width: 1.25rem;
    height: 1.25rem;
    place-items: center;
    border: 1px solid var(--border);
    border-radius: var(--radius-field);
    color: var(--fg-subtle);
    outline: none;
    cursor: pointer;
  }
  .back-button:hover {
    background: var(--bg-hover);
  }
  .back-icon {
    display: block;
    width: 0.75rem;
    height: 0.75rem;
  }
  .options {
    max-height: 18rem;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding-block: 0.75rem;
    padding-right: 0.25rem;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }
  .option-details {
    display: flex;
    min-width: 0;
    flex-direction: column;
  }
  .option-label,
  .option-description {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .option-description {
    font-size: 11.5px;
    color: var(--fg-subtle);
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.375rem;
    margin-top: 0.25rem;
    border-top: 1px solid var(--border-soft);
    padding-top: 0.375rem;
  }
  .footer-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    min-height: 1.875rem;
    border: 1px solid transparent;
    border-radius: var(--radius-field);
    padding: 0.25rem 0.625rem;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    transition:
      background-color 160ms var(--ease-ui),
      border-color 160ms var(--ease-ui),
      box-shadow 160ms var(--ease-ui),
      scale 160ms var(--ease-ui);
  }
  .footer-button:active {
    scale: 0.97;
  }
  .cancel {
    color: var(--fg);
  }
  .cancel:hover {
    background: var(--bg-hover);
  }
  .apply {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--accent-fg);
  }
  .apply:hover {
    border-color: var(--accent-hover);
    background: var(--accent-hover);
  }
  .search-row {
    padding: 0 0.625rem 0.25rem;
  }
  .search-row input {
    width: 100%;
    border: 1px solid var(--border);
    border-radius: var(--radius-field);
    padding: 0.375rem 0.625rem;
    background: var(--bg);
    font-size: 12.5px;
    color: var(--fg);
    outline: none;
  }
  .empty-options {
    padding: 0.5rem 0.625rem;
    font-size: 12.5px;
    color: var(--fg-subtle);
  }
  @media (max-width: 767px) {
    :global(.pcsti-filter-panel) {
      width: auto;
      min-width: 0;
      max-width: none;
      padding: 0.5rem;
    }
    :global(.pcsti-filter-trigger) {
      height: 2rem;
      min-width: 2.125rem;
      justify-content: center;
      padding-inline: 0.5rem;
    }
    .trigger-label {
      display: none;
    }
    .accent-edge {
      display: block;
      width: 2.25rem;
      height: 0.25rem;
      margin: 0 auto 0.25rem;
      border-radius: 999px;
      background: var(--border);
    }
    .root-header {
      padding: 0.25rem 0.5rem 0.5rem;
      font-size: 11.5px;
    }
    .section-header {
      gap: 0.5rem;
      padding: 0.5rem 0.25rem;
      font-size: 11.5px;
    }
    .root-item,
    .option {
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      font-size: 15px;
    }
    .root-item {
      min-height: 2.75rem;
    }
    .option {
      min-height: 3rem;
    }
    .filter-icon {
      width: 1.125rem;
      height: 1.125rem;
    }
    .next-icon {
      width: 1rem;
      height: 1rem;
    }
    .back-button {
      width: 2.25rem;
      height: 2.25rem;
    }
    .back-icon {
      width: 1.125rem;
      height: 1.125rem;
    }
    .options {
      max-height: 42vh;
      padding-right: 0;
    }
    .option-description {
      font-size: 12.5px;
    }
    .footer {
      gap: 0.5rem;
      margin-top: 0.5rem;
      padding: 0.75rem 0.25rem 0.25rem;
    }
    .footer-button {
      flex: 1;
    }
    .search-row {
      padding-inline: 0.75rem;
    }
    .empty-options {
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
    }
  }
</style>
