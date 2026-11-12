<!-- Ported from pcsti/packages/ui/src/components/list-toolbar/index.svelte.
     Source StyleX declarations are expressed as scoped CSS; composition is unchanged. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  let {
    search,
    chips,
    filters,
    density,
    columns,
    actions,
  }: {
    search?: Snippet;
    chips?: Snippet;
    filters?: Snippet;
    density?: Snippet;
    columns?: Snippet;
    actions?: Snippet;
  } = $props();
</script>

<div class="list-toolbar">
  <div class="query-controls">
    <div class="search">{@render search?.()}</div>
    <div class="chips">{@render chips?.()}</div>
    <div class="filters">{@render filters?.()}</div>
  </div>
  <div class="actions">
    <div class="view-controls">{@render density?.()}{@render columns?.()}</div>
    {@render actions?.()}
  </div>
</div>

<style>
  .list-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.625rem;
  }
  .query-controls {
    min-width: 0;
    display: contents;
  }
  .search {
    order: 1;
    min-width: 0;
    flex: 1;
  }
  .chips {
    order: 5;
    display: flex;
    flex-basis: 100%;
    scrollbar-width: none;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.5rem;
    overflow-x: auto;
  }
  .chips:empty {
    display: none;
  }
  .chips::-webkit-scrollbar {
    display: none;
  }
  .filters {
    order: 2;
  }
  .actions {
    display: contents;
  }
  .view-controls {
    display: none;
  }
  @media (min-width: 768px) {
    .list-toolbar {
      gap: 0.625rem;
      padding: 0.75rem;
    }
    .query-controls {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      gap: 0.625rem;
    }
    .search {
      order: initial;
      flex: initial;
    }
    .chips,
    .filters {
      display: contents;
    }
    .actions {
      display: flex;
      margin-left: auto;
      align-items: center;
      gap: 0.5rem;
    }
    .view-controls {
      display: contents;
    }
  }
</style>
