<script
  lang="ts"
  generics="HiddenKey extends string, ItemKey extends string = HiddenKey"
>
  // Ported from PCSTI packages/ui/src/components/list-columns-menu; StyleX translated to CSS.
  import { SvelteSet } from "svelte/reactivity";
  import Icon from "./icon.svelte";
  import { glyphs } from "./icons";
  import Checkbox from "./checkbox.svelte";
  import Menu from "./menu.svelte";
  type Item<Key extends string = string> = {
    key: Key;
    label: string;
    fixed?: boolean;
  };
  let {
    items,
    hiddenColumns,
    onchange,
  }: {
    items: readonly Item<ItemKey>[];
    hiddenColumns: HiddenKey[];
    onchange: (next: HiddenKey[]) => void;
  } = $props();
  const hidden = $derived(new SvelteSet<string>(hiddenColumns));
  function isShown(item: Item<ItemKey>) {
    return item.fixed || !hidden.has(item.key);
  }
  function toggle(item: Item<ItemKey>) {
    if (item.fixed) return;
    const key = item.key as unknown as HiddenKey;
    const next = new SvelteSet<HiddenKey>(hiddenColumns);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onchange([...next]);
  }
</script>

<Menu
  label="Columns"
  tooltip="Columns"
  align="right"
  panelClass="pcsti-columns-panel"
  triggerClass="pcsti-columns-trigger"
>
  {#snippet trigger()}<span data-icon class="columns-icon" aria-hidden="true"
      ><Icon icon={glyphs.columns} /></span
    >{/snippet}
  {#snippet content()}
    <div class="heading">Columns</div>
    {#each items as item (item.key)}
      <button
        type="button"
        role="menuitemcheckbox"
        aria-checked={isShown(item)}
        disabled={item.fixed}
        onclick={() => toggle(item)}
        class="option"
      >
        <Checkbox checked={!!isShown(item)} />{item.label}{#if item.fixed}<span
            class="locked-label">locked</span
          >{/if}
      </button>
    {/each}
  {/snippet}
</Menu>

<style>
  :global(.pcsti-columns-panel) {
    min-width: 12.5rem;
  }
  :global(.pcsti-columns-trigger) {
    min-height: 1.875rem;
    min-width: 1.875rem;
    padding-inline: 0.5rem;
    background: var(--bg);
    color: var(--fg-muted);
  }
  .columns-icon {
    width: 1rem;
    height: 1rem;
  }
  .heading {
    padding: 0.375rem 0.625rem;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--fg-subtle);
    text-transform: uppercase;
  }
  .option {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid transparent;
    border-radius: 3px;
    padding: 0.375rem 0.625rem;
    text-align: left;
    font-size: 12.5px;
    color: var(--fg);
    cursor: pointer;
    transition:
      border-color 150ms,
      box-shadow 150ms;
  }
  .option:hover {
    background: var(--bg-hover);
  }
  .option:focus-visible {
    outline: none;
    border-color: color-mix(in oklch, var(--accent) 60%, var(--border));
    box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 18%, transparent);
  }
  .option:disabled {
    opacity: 0.6;
    cursor: default;
  }
  .locked-label {
    margin-left: auto;
    font-size: 11.5px;
    color: var(--fg-subtle);
  }
  @media (forced-colors: active) {
    .option:focus-visible {
      outline: 2px solid Highlight;
    }
  }
</style>
