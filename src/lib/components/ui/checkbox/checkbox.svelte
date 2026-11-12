<script lang="ts">
  // Ported from PCSTI packages/ui/src/components/checkbox; StyleX declarations translated to CSS.
  let {
    checked,
    indeterminate = false,
    size = "sm",
    class: className = "",
  }: {
    checked: boolean;
    indeterminate?: boolean;
    size?: "sm" | "md";
    class?: string;
  } = $props();
</script>

<span
  class={[
    "pcsti-checkbox",
    size,
    (checked || indeterminate) && "checked",
    className,
  ]}
  aria-hidden="true"
>
  {#if checked || indeterminate}
    <!-- Exact Solar check/minus vectors used by PCSTI's checkbox; these glyphs are absent in Solar v1. -->
    <svg
      class="check-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      aria-hidden="true"
      focusable="false"
    >
      {#if indeterminate}<path
          d="M20 12L4 12"
          stroke-linecap="round"
        />{:else}<path
          d="M5 13L9 17L19 7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />{/if}
    </svg>
  {/if}
</span>

<style>
  .pcsti-checkbox {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border);
    border-radius: 3px;
    background: var(--bg);
    transition:
      background-color 150ms,
      border-color 150ms,
      box-shadow 150ms;
  }
  .sm {
    width: 14px;
    height: 14px;
  }
  .md {
    width: 16px;
    height: 16px;
  }
  .checked {
    border-color: var(--accent);
    background: var(--accent);
  }
  .check-icon {
    width: 10px;
    height: 10px;
    color: var(--accent-fg);
  }
  .md .check-icon {
    width: 12px;
    height: 12px;
  }
  .check-icon :global(path) {
    stroke-width: 3;
  }
</style>
