<!-- Ported from PCSTI packages/ui/src/components/pagination/index.svelte.
     Its StyleX declarations are translated to scoped CSS; pagination semantics are retained. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import Icon from "../icon/icon.svelte";
  import { glyphs } from "../icons";
  import { buildPaginationItems } from "./pagination-helpers";

  let {
    page,
    pageSize,
    total,
    href,
    onchange,
    summary = true,
    compact = false,
    class: className = "",
    children,
    label = "Pagination",
  }: {
    page: number;
    pageSize: number;
    total: number;
    href?: (page: number) => string;
    onchange?: (page: number) => void;
    summary?: boolean;
    compact?: boolean;
    class?: string;
    children?: Snippet;
    label?: string;
  } = $props();

  const pageCount = $derived(Math.max(1, Math.ceil(total / pageSize)));
  const start = $derived(total === 0 ? 0 : (page - 1) * pageSize + 1);
  const end = $derived(Math.min(total, page * pageSize));
  const pages = $derived(buildPaginationItems(page, pageCount));
  function go(next: number) {
    if (next !== page) onchange?.(next);
  }
</script>

{#snippet previousContent()}
  <span data-icon class="navigation-icon" aria-hidden="true"
    ><Icon icon={glyphs.chevronLeft} /></span
  >
  <span class="step-label">Prev</span>
{/snippet}
{#snippet nextContent()}
  <span class="step-label">Next</span>
  <span data-icon class="navigation-icon" aria-hidden="true"
    ><Icon icon={glyphs.chevronRight} /></span
  >
{/snippet}

<div class={["pcsti-pagination", compact && "is-compact", className]}>
  <div class="summary">
    {#if summary}
      <span aria-live="polite"
        >Showing <strong class="count">{start}–{end}</strong> of
        <strong class="count">{total.toLocaleString()}</strong></span
      >
    {/if}
    {#if children}
      {#if summary}<span aria-hidden="true" class="separator">·</span>{/if}
      {@render children()}
    {/if}
  </div>
  <nav aria-label={label} class="navigation">
    {#if page > 1}
      {#if href}
        <a
          href={href(page - 1)}
          class="step-button"
          aria-label="Previous page"
          data-sveltekit-reset="false">{@render previousContent()}</a
        >
      {:else}
        <button
          type="button"
          onclick={() => go(page - 1)}
          class="step-button"
          aria-label="Previous page">{@render previousContent()}</button
        >
      {/if}
    {:else}
      <span class="disabled-step" aria-hidden="true"
        >{@render previousContent()}</span
      >
    {/if}
    <div class="page-summary">
      <span class="page-label">Page&nbsp;</span><span class="page-count"
        >{page}</span
      ><span class="page-label">&nbsp;of&nbsp;</span><span class="page-count"
        >{pageCount}</span
      >
      {#each pages as item, index (`${index}-${item}`)}
        {#if item === "…"}
          <span class="ellipsis">…</span>
        {:else if href}
          <a
            href={href(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            class={["page-button", item === page && "current-page"]}
            data-sveltekit-reset="false">{item}</a
          >
        {:else}
          <button
            type="button"
            onclick={() => go(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            class={["page-button", item === page && "current-page"]}
            >{item}</button
          >
        {/if}
      {/each}
    </div>
    {#if page < pageCount}
      {#if href}
        <a
          href={href(page + 1)}
          class="step-button"
          aria-label="Next page"
          data-sveltekit-reset="false">{@render nextContent()}</a
        >
      {:else}
        <button
          type="button"
          onclick={() => go(page + 1)}
          class="step-button"
          aria-label="Next page">{@render nextContent()}</button
        >
      {/if}
    {:else}
      <span class="disabled-step" aria-hidden="true"
        >{@render nextContent()}</span
      >
    {/if}
  </nav>
</div>

<style>
  .pcsti-pagination {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border-top: 1px solid var(--border-soft);
    padding: 0.625rem 0.75rem;
    font-size: 12.5px;
    color: var(--fg-muted);
  }
  .summary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .count {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    color: var(--fg);
  }
  .navigation,
  .page-summary {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  .step-button,
  .disabled-step {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    border-radius: var(--radius-field);
    padding: 0.25rem 0.5rem;
    font-size: 12px;
  }
  .step-button,
  .page-button {
    border: 1px solid transparent;
    color: var(--fg-muted);
    cursor: pointer;
    outline: none;
    text-decoration: none;
    transition:
      transform 160ms var(--ease-ui),
      background-color 160ms var(--ease-ui),
      color 160ms var(--ease-ui),
      border-color 160ms var(--ease-ui),
      box-shadow 160ms var(--ease-ui);
  }
  .step-button:hover,
  .page-button:hover {
    background: var(--bg-hover);
    color: var(--fg);
  }
  .step-button:active,
  .page-button:active {
    scale: 0.97;
  }
  .step-button:focus-visible,
  .page-button:focus-visible {
    border-color: color-mix(in oklch, var(--accent) 60%, var(--border));
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
  }
  .disabled-step {
    color: var(--fg-subtle);
    opacity: 0.5;
  }
  .navigation-icon {
    display: block;
    width: 0.75rem;
    height: 0.75rem;
    flex: none;
  }
  .page-label,
  .page-count {
    display: none;
  }
  .page-count {
    font-weight: 600;
    color: var(--fg);
  }
  .ellipsis {
    padding-inline: 0.25rem;
    color: var(--fg-subtle);
  }
  .page-button {
    border-radius: var(--radius-field);
    padding: 0.25rem 0.625rem;
    font-size: 12px;
  }
  .current-page {
    background: var(--bg-elev-2);
    font-weight: 600;
    color: var(--fg);
  }
  .is-compact {
    flex-direction: column;
    align-items: stretch;
  }
  .is-compact .summary {
    order: 2;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .is-compact .navigation {
    order: 1;
    justify-content: space-between;
  }
  .is-compact .step-button,
  .is-compact .disabled-step {
    min-height: 1.875rem;
    min-width: 2.125rem;
    justify-content: center;
    border: 1px solid var(--border-soft);
    background: var(--bg);
    flex: none;
  }
  .is-compact .step-button:focus-visible {
    border-color: color-mix(in oklch, var(--accent) 60%, var(--border));
  }
  .is-compact .navigation-icon {
    width: 1rem;
    height: 1rem;
  }
  .is-compact .page-summary {
    flex: 1;
    justify-content: center;
    gap: 0;
    white-space: nowrap;
  }
  .is-compact .separator,
  .is-compact .step-label,
  .is-compact .ellipsis,
  .is-compact .page-button {
    display: none;
  }
  .is-compact .page-label,
  .is-compact .page-count {
    display: inline;
  }
  @media (max-width: 767px) {
    .pcsti-pagination {
      flex-direction: column;
      align-items: stretch;
      padding: 0.75rem;
      padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
    }
    .summary {
      order: 2;
      justify-content: space-between;
      gap: 0.75rem;
      font-size: 13px;
    }
    .separator {
      display: none;
    }
    .navigation {
      order: 1;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .step-button,
    .disabled-step {
      min-height: 1.875rem;
      min-width: 2.125rem;
      justify-content: center;
      flex: none;
      gap: 0.375rem;
      border: 1px solid var(--border-soft);
      background: var(--bg);
      font-size: 0.875rem;
      line-height: 1.25rem;
      font-weight: 500;
    }
    .step-button:focus-visible {
      border-color: color-mix(in oklch, var(--accent) 60%, var(--border));
    }
    .navigation-icon {
      width: 1rem;
      height: 1rem;
    }
    .step-label {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
      border-width: 0;
    }
    .page-summary {
      flex: 1;
      justify-content: center;
      gap: 0;
      font-size: 0.875rem;
      line-height: 1.25rem;
      font-variant-numeric: tabular-nums;
    }
    .page-label,
    .page-count {
      display: inline;
    }
    .ellipsis,
    .page-button {
      display: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .step-button,
    .page-button {
      transition: none;
    }
  }
  @media (forced-colors: active) {
    .step-button:focus-visible,
    .page-button:focus-visible {
      outline: 2px solid Highlight;
    }
  }
</style>
