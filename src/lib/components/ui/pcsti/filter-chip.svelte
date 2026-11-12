<script lang="ts">
  // Ported from PCSTI packages/ui/src/components/filter-chip/index.svelte.
  import Icon from "./icon.svelte";
  import { glyphs } from "./icons";
  let {
    label,
    value,
    onclear,
  }: { label: string; value: string; onclear: () => void } = $props();
</script>

<span class="filter-chip">
  <span class="label">{label}:</span>
  <span class="value">{value}</span>
  <button
    type="button"
    onclick={onclear}
    aria-label={`Clear ${label} filter`}
    class="clear-button"
  >
    <span data-icon class="clear-icon" aria-hidden="true"
      ><Icon icon={glyphs.closeCircle} /></span
    >
  </button>
</span>

<style>
  /* PCSTI filter-chip/index.styles.ts and origin-chip-in from styles/reset.css. */
  .filter-chip {
    display: inline-flex;
    min-height: 1.875rem;
    max-width: 13.75rem;
    align-items: center;
    gap: 0.375rem;
    border: 1px solid var(--border-soft);
    border-radius: 999px;
    background: var(--bg-elev-2);
    padding: 0.25rem 0.25rem 0.25rem 0.625rem;
    font-size: 0.75rem;
    line-height: 1rem;
    animation: chip-in 0.22s cubic-bezier(0.23, 1, 0.32, 1) both;
  }
  .label {
    flex: none;
    color: var(--fg-subtle);
  }
  .value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
    color: var(--fg);
  }
  .clear-button {
    display: inline-flex;
    flex: none;
    width: 1.25rem;
    height: 1.25rem;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: 999px;
    color: var(--fg-muted);
    outline: none;
    cursor: pointer;
    transition:
      transform 160ms var(--ease-ui),
      background-color 160ms var(--ease-ui),
      color 160ms var(--ease-ui),
      border-color 160ms var(--ease-ui),
      box-shadow 160ms var(--ease-ui);
  }
  .clear-button:hover {
    background: var(--bg-hover);
    color: var(--fg);
  }
  .clear-button:focus-visible {
    border-color: color-mix(in oklch, var(--accent) 60%, var(--border));
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
  }
  .clear-button:active {
    scale: 0.9;
  }
  .clear-icon {
    display: block;
    width: 0.75rem;
    height: 0.75rem;
  }
  @keyframes chip-in {
    from {
      opacity: 0;
      transform: translateX(-6px) scale(0.94);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
  @media (max-width: 767px) {
    .filter-chip {
      min-height: 2rem;
    }
    .clear-button {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .filter-chip {
      animation: none;
    }
    .clear-button {
      transition: none;
    }
  }
</style>
