<script lang="ts" module>
  export type RecordRow = { id: string; [key: string]: string | number };
  export type RecordColumn = {
    key: string;
    label: string;
    locked?: boolean;
    numeric?: boolean;
  };
  export type RecordFilter = {
    key: string;
    label: string;
    options: { value: string; label: string }[];
  };
</script>

<script lang="ts">
  import { onMount, untrack, type Snippet } from "svelte";
  import Icon from "$lib/components/ui/pcsti/icon.svelte";
  import { glyphs } from "$lib/components/ui/pcsti/icons";
  import Pagination from "$lib/components/ui/pcsti/pagination.svelte";
  import ListPageSizePicker from "$lib/components/ui/pcsti/list-page-size-picker.svelte";
  import ListToolbar from "$lib/components/ui/pcsti/list-toolbar.svelte";
  import FilterMenu from "$lib/components/ui/pcsti/filter-menu.svelte";
  import FilterChip from "$lib/components/ui/pcsti/filter-chip.svelte";
  import DensityToggle from "$lib/components/ui/pcsti/density-toggle.svelte";
  import ListColumnsMenu from "$lib/components/ui/pcsti/list-columns-menu.svelte";
  import ListSortHeader from "$lib/components/ui/pcsti/list-sort-header.svelte";
  import {
    loadTableView,
    matchesRecord,
    saveTableView,
  } from "./record-table-state";
  let {
    rows,
    columns,
    filters = [],
    label,
    loading = false,
    emptyMessage = "No records yet.",
    cell,
    actions,
    initialFilters = {},
    identifierKeys = [],
    searchPlaceholder = "Search",
    stateKey,
  }: {
    rows: RecordRow[];
    columns: RecordColumn[];
    filters?: RecordFilter[];
    label: string;
    loading?: boolean;
    emptyMessage?: string;
    cell?: Snippet<[RecordRow, string]>;
    actions?: Snippet<[RecordRow]>;
    initialFilters?: Record<string, string[]>;
    identifierKeys?: string[];
    searchPlaceholder?: string;
    stateKey?: string;
  } = $props();
  let query = $state("");
  let applied = $state<Record<string, string[]>>(
    untrack(() => ({ ...initialFilters })),
  );
  let hidden = $state<string[]>([]);
  let compact = $state(false);
  let sortKey = $state("");
  let sortDirection = $state<"ascending" | "descending">("ascending");
  let page = $state(1);
  let pageSize = $state(12);
  let viewReady = $state(false);
  let viewStorage: Storage | undefined;
  const filterOptions = $derived(filters);
  const columnOptions = $derived(columns);
  const visibleColumns = $derived(
    columns.filter((column) => !hidden.includes(column.key)),
  );
  const filtered = $derived.by(() => {
    const result = rows.filter(
      (row) =>
        matchesRecord(
          row,
          columns.map((column) => column.key),
          query,
          identifierKeys,
        ) &&
        Object.entries(applied).every(
          ([key, values]) =>
            !values.length || values.includes(String(row[key])),
        ),
    );
    if (!sortKey) return result;
    const column = columns.find((column) => column.key === sortKey);
    return result.toSorted((a, b) => {
      const left = a[sortKey] ?? "",
        right = b[sortKey] ?? "";
      const comparison = column?.numeric
        ? Number(left) - Number(right)
        : String(left).localeCompare(String(right), "en", {
            numeric: true,
            sensitivity: "base",
          });
      return sortDirection === "ascending" ? comparison : -comparison;
    });
  });
  const pageCount = $derived(
    Math.max(1, Math.ceil(filtered.length / pageSize)),
  );
  const currentPage = $derived(Math.min(page, pageCount));
  const start = $derived((currentPage - 1) * pageSize);
  const shown = $derived(filtered.slice(start, start + pageSize));
  onMount(() => {
    if (stateKey) {
      try {
        viewStorage = window.sessionStorage;
      } catch {
        /* Storage can be disabled. */
      }
      const saved =
        viewStorage &&
        loadTableView(viewStorage, stateKey, { columns, filters });
      if (saved) {
        query = saved.query;
        applied = saved.applied;
        hidden = saved.hidden;
        compact = saved.compact;
        sortKey = saved.sortKey;
        sortDirection = saved.sortDirection;
        page = saved.page;
        pageSize = saved.pageSize;
      }
    }
    viewReady = true;
  });
  $effect(() => {
    if (!viewReady || !viewStorage || !stateKey) return;
    // Keep the requested page while rows are loading; currentPage clamps rendering.
    saveTableView(viewStorage, stateKey, {
      query,
      applied,
      hidden,
      compact,
      sortKey,
      sortDirection,
      page,
      pageSize,
    });
  });
  function sort(key: string) {
    sortDirection =
      sortKey === key && sortDirection === "ascending"
        ? "descending"
        : "ascending";
    sortKey = key;
    page = 1;
  }
  const descriptors = $derived(
    filters.map((filter) => ({
      id: filter.key,
      label: filter.label,
      mode: "multi" as const,
      icon: filter.key === "category" ? glyphs.layers : glyphs.tag,
      options: filter.options,
    })),
  );
  function applyFilter(patch: Record<string, string | string[] | null>) {
    for (const filter of filters) {
      if (filter.key in patch)
        applied = {
          ...applied,
          [filter.key]: Array.isArray(patch[filter.key])
            ? (patch[filter.key] as string[])
            : [],
        };
    }
    page = 1;
  }
  function clearFilter(key: string) {
    applied = { ...applied, [key]: [] };
    page = 1;
  }
  function clearAll() {
    query = "";
    applied = {};
    page = 1;
  }
</script>

<section class="record-panel" aria-label={label}>
  <ListToolbar>
    {#snippet search()}
      <label class="search"
        ><span class="search-icon"><Icon icon={glyphs.search} /></span><input
          type="search"
          aria-label={`Search ${label.toLowerCase()}`}
          placeholder={searchPlaceholder}
          bind:value={query}
          oninput={() => (page = 1)}
        /></label
      >
    {/snippet}
    {#snippet chips()}
      {#each filterOptions.filter((filter) => applied[filter.key]?.length) as filter (filter.key)}
        <FilterChip
          label={filter.label}
          value={filter.options
            .filter((option) => applied[filter.key].includes(option.value))
            .map((option) => option.label)
            .join(", ")}
          onclear={() => clearFilter(filter.key)}
        />
      {/each}
    {/snippet}
    {#snippet filters()}{#if filterOptions.length}<FilterMenu
          {descriptors}
          values={applied}
          onapply={applyFilter}
        />{/if}{/snippet}
    {#snippet density()}<DensityToggle
        value={compact ? "compact" : "comfortable"}
        onchange={(value) => (compact = value === "compact")}
      />{/snippet}
    {#snippet columns()}<ListColumnsMenu
        items={columnOptions.map((column) => ({
          key: column.key,
          label: column.label,
          fixed: column.locked,
        }))}
        hiddenColumns={hidden}
        onchange={(value) => (hidden = value)}
      />{/snippet}
  </ListToolbar>
  <!-- Keyboard focus lets users scroll a wide table horizontally. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    class="table-scroll"
    tabindex="0"
    role="region"
    aria-label={`${label} table`}
  >
    <table class:compact>
      <caption class="sr-only">{label}</caption>
      <thead
        ><tr>
          {#each visibleColumns as column (column.key)}
            <ListSortHeader
              column={column.key}
              label={column.label}
              currentSort={sortKey}
              dir={sortDirection === "ascending" ? "asc" : "desc"}
              align={column.numeric ? "end" : "start"}
              onclick={() => sort(column.key)}
            />
          {/each}
          {#if actions}<th scope="col" class="actions-heading">Actions</th>{/if}
        </tr></thead
      >
      <tbody>
        {#if loading}<tr
            ><td
              colspan={visibleColumns.length + (actions ? 1 : 0)}
              class="empty"
              ><p role="status">Loading {label.toLowerCase()}…</p></td
            ></tr
          >
        {:else if !shown.length}<tr
            ><td
              colspan={visibleColumns.length + (actions ? 1 : 0)}
              class="empty"
              ><p>{rows.length ? "No matching records" : emptyMessage}</p>
              {#if rows.length}<button class="text-action" onclick={clearAll}
                  >Clear search and filters</button
                >{/if}</td
            ></tr
          >
        {:else}{#each shown as row (row.id)}<tr
              >{#each visibleColumns as column (column.key)}<td
                  class:numeric={column.numeric}
                  >{#if cell}{@render cell(row, column.key)}{:else}{row[
                      column.key
                    ] ?? "—"}{/if}</td
                >{/each}{#if actions}<td class="actions-cell"
                  ><div class="row-actions">{@render actions(row)}</div></td
                >{/if}</tr
            >{/each}{/if}
      </tbody>
    </table>
  </div>
  <Pagination
    page={currentPage}
    {pageSize}
    total={filtered.length}
    label={`${label} pagination`}
    onchange={(next) => (page = next)}
  >
    <ListPageSizePicker
      size={pageSize}
      options={[12, 24, 48]}
      onpick={(size) => {
        pageSize = size;
        page = 1;
      }}
    />
  </Pagination>
</section>

<style>
  .record-panel {
    min-width: 0;
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    background: var(--bg-elev);
  }
  .search {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 16rem;
    max-width: 100%;
    height: 1.875rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-field);
    padding: 0 0.625rem;
    color: var(--fg-subtle);
    background: var(--bg-input);
  }
  .search-icon {
    display: block;
    flex: none;
    width: 0.875rem;
    height: 0.875rem;
  }
  input[type="search"] {
    width: 100%;
    min-width: 0;
    background: transparent;
    border: 0;
    font: inherit;
    font-size: 0.8125rem;
    color: var(--fg);
    outline: none;
  }
  .search:focus-within {
    border-color: color-mix(in oklch, var(--accent) 60%, var(--border));
    box-shadow: 0 0 0 3px var(--ring);
  }
  .table-scroll {
    overflow-x: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
    text-align: left;
  }
  thead {
    background: var(--bg-elev-2);
    color: var(--fg-muted);
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }
  td {
    padding: 1.1rem 0.75rem;
    border-top: 1px solid var(--border-soft);
    vertical-align: middle;
  }
  .compact td {
    padding: 0.6rem 0.75rem;
  }
  tbody tr:hover {
    background: var(--bg-hover);
  }
  td.numeric {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    text-align: right;
  }
  .actions-heading,
  .actions-cell {
    width: 1%;
    white-space: nowrap;
    text-align: right;
  }
  .actions-heading {
    padding: 0.5rem 0.75rem;
  }
  .row-actions {
    width: max-content;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    white-space: nowrap;
  }
  .empty {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--fg-muted);
  }
  .text-action {
    margin-top: 0.75rem;
    color: var(--accent);
    text-decoration: underline;
  }
  button {
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.4;
    cursor: default;
  }
  button:focus-visible,
  .table-scroll:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  @media (max-width: 767px) {
    .search {
      width: 100%;
      height: 2rem;
    }
    td {
      padding: 0.8rem;
    }
  }
</style>
