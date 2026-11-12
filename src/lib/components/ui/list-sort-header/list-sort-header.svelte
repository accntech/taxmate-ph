<script lang="ts">
  // Ported from PCSTI packages/ui/src/components/list-sort-header; exact glyph and direction convention.
  import Icon from "../icon/icon.svelte";
  import { glyphs } from "../icons";
  type Props = {
    label: string;
    column: string;
    currentSort: string;
    dir: "asc" | "desc";
    align?: "start" | "end";
    class?: string;
  } & (
    { href: string; onclick?: never } | { href?: never; onclick: () => void }
  );
  let {
    label,
    column,
    currentSort,
    dir,
    align = "start",
    href,
    onclick,
    class: className = "",
  }: Props = $props();
  const active = $derived(currentSort === column);
  const ariaSort = $derived(
    active ? (dir === "asc" ? "ascending" : "descending") : "none",
  );
</script>

<th
  scope="col"
  aria-sort={ariaSort}
  class={["pcsti-sort-header", align === "end" && "align-end", className]}
>
  {#snippet content()}
    {label}<span
      data-icon
      class={[
        "sort-icon",
        !active && "inactive",
        active && dir === "desc" && "descending",
      ]}
      aria-hidden="true"><Icon icon={glyphs.chevronDown} /></span
    >
  {/snippet}
  {#if href !== undefined}<a
      {href}
      class="sort-trigger"
      data-sveltekit-reset="false">{@render content()}</a
    >
  {:else}<button type="button" {onclick} class="sort-trigger"
      >{@render content()}</button
    >{/if}
</th>

<style>
  .pcsti-sort-header {
    padding: 0.5rem 0.75rem;
  }
  .sort-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    border: 1px solid transparent;
    border-radius: 3px;
    background: transparent;
    padding: 0;
    font: inherit;
    color: inherit;
    text-transform: inherit;
    letter-spacing: inherit;
    cursor: pointer;
    transition:
      color 150ms,
      border-color 150ms,
      box-shadow 150ms;
  }
  .sort-trigger:hover {
    color: var(--fg);
  }
  .sort-trigger:focus-visible {
    outline: none;
    border-color: color-mix(in oklch, var(--accent) 60%, var(--border));
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
  }
  .align-end {
    text-align: right;
  }
  .align-end .sort-trigger {
    justify-content: flex-end;
  }
  .sort-icon {
    display: block;
    flex: none;
    width: 0.75rem;
    height: 0.75rem;
    transition:
      transform 200ms,
      opacity 200ms;
  }
  .descending {
    rotate: 180deg;
  }
  .inactive {
    opacity: 0.4;
  }
  @media (prefers-reduced-motion: reduce) {
    .sort-icon,
    .sort-trigger {
      transition: none;
    }
  }
  @media (forced-colors: active) {
    .sort-trigger:focus-visible {
      outline: 2px solid Highlight;
    }
  }
</style>
