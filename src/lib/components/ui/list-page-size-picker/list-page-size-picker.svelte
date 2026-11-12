<!-- Ported from PCSTI packages/ui/src/components/list-page-size-picker/index.svelte.
     Source StyleX declarations are translated below. -->
<script lang="ts" generics="Size extends number = 12 | 24 | 36">
  import Menu from "../menu/menu.svelte";
  import Icon from "../icon/icon.svelte";
  import { glyphs } from "../icons";
  const OPTIONS = [12, 24, 36] as const;
  let {
    size,
    onpick,
    options,
  }: { size: number; onpick: (size: Size) => void; options?: readonly Size[] } =
    $props();
  function pick(next: Size | (typeof OPTIONS)[number], close: () => void) {
    close();
    if (next !== size) onpick(next as Size);
  }
</script>

<Menu
  label="Rows per page"
  align="left"
  panelClass="pcsti-page-size-panel"
  triggerClass="pcsti-page-size-trigger"
>
  {#snippet trigger()}
    {size} per page
    <span data-icon class="menu-icon" aria-hidden="true"
      ><Icon icon={glyphs.chevronDown} /></span
    >
  {/snippet}
  {#snippet content({ close })}
    {#each options ?? OPTIONS as option (option)}
      <button
        type="button"
        role="menuitemradio"
        aria-checked={size === option}
        onclick={() => pick(option, close)}
        class={["option", size === option ? "selected" : "unselected"]}
      >
        <span>{option} per page</span>
        <span class="option-label"
          >{#if size === option}<span
              data-icon
              class="check-icon"
              aria-hidden="true"><Icon icon={glyphs.checkCircle} /></span
            >{/if}</span
        >
      </button>
    {/each}
  {/snippet}
</Menu>

<style>
  :global(.pcsti-page-size-panel) {
    min-width: 8.75rem;
  }
  :global(.pcsti-page-size-trigger) {
    gap: 0.25rem;
    border-color: transparent;
    padding: 0.25rem 0.5rem;
    font-size: 12px;
    color: var(--fg-muted);
    background: transparent;
    transition:
      background-color 160ms var(--ease-ui),
      border-color 160ms var(--ease-ui),
      box-shadow 160ms var(--ease-ui),
      color 160ms var(--ease-ui);
  }
  :global(.pcsti-page-size-trigger:hover) {
    background: var(--bg-hover);
    color: var(--fg);
  }
  .menu-icon {
    display: block;
    width: 0.75rem;
    height: 0.75rem;
    flex: none;
  }
  .option {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    padding: 0.375rem 0.625rem;
    text-align: left;
    font-size: 12.5px;
    cursor: pointer;
    outline: none;
    transition:
      border-color 160ms var(--ease-ui),
      box-shadow 160ms var(--ease-ui);
  }
  .option:hover {
    background: var(--bg-hover);
  }
  .option:focus-visible {
    border-color: color-mix(in oklch, var(--accent) 60%, var(--border));
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
  }
  .selected {
    color: var(--fg);
  }
  .unselected {
    color: var(--fg-muted);
  }
  .option-label {
    display: grid;
    width: 0.875rem;
    height: 0.875rem;
    flex: none;
    place-items: center;
  }
  .check-icon {
    display: block;
    width: 0.75rem;
    height: 0.75rem;
    color: var(--fg-muted);
  }
  @media (prefers-reduced-motion: reduce) {
    .option,
    :global(.pcsti-page-size-trigger) {
      transition: none;
    }
  }
  @media (forced-colors: active) {
    .option:focus-visible {
      outline: 2px solid Highlight;
    }
  }
</style>
