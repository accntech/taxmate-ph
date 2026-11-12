<script
  lang="ts"
  generics="HiddenKey extends string, ItemKey extends string = HiddenKey"
>
  import { icons as columnsMenuIcons } from "./index.icons";
  import { Icon as SolarIcon } from "../icon/base";

  import { columnsMenu } from "./list-columns-menu.styles";

  import * as stylex from "@stylexjs/stylex";
  import { SvelteSet } from "svelte/reactivity";
  import { Checkbox } from "../checkbox/base";
  import { Menu } from "../menu/base";

  type ListColumnMenuItem<Key extends string = string> = {
    key: Key;
    label: string;
    fixed?: boolean;
  };

  type Props = {
    items: readonly ListColumnMenuItem<ItemKey>[];
    hiddenColumns: HiddenKey[];
    onchange: (next: HiddenKey[]) => void;
  };

  let { items, hiddenColumns, onchange }: Props = $props();

  const hidden = $derived(new SvelteSet<string>(hiddenColumns));

  function isShown(item: ListColumnMenuItem<ItemKey>) {
    return item.fixed || !hidden.has(item.key);
  }

  function toggle(item: ListColumnMenuItem<ItemKey>) {
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
  panelClass={columnsMenu.panel}
  triggerClass={columnsMenu.trigger}
>
  {#snippet trigger()}
    <span
      data-icon
      class={[stylex.attrs(columnsMenu.menuIcon).class]}
      aria-hidden="true"><SolarIcon icon={columnsMenuIcons.menuIcon} /></span
    >
  {/snippet}
  {#snippet content()}
    <div class={[stylex.attrs(columnsMenu.heading).class]}>Columns</div>
    {#each items as item (item.key)}
      <button
        type="button"
        role="menuitemcheckbox"
        aria-checked={isShown(item)}
        disabled={item.fixed}
        onclick={() => toggle(item)}
        class={[stylex.attrs(columnsMenu.option).class]}
      >
        <Checkbox checked={isShown(item)} />
        {item.label}
        {#if item.fixed}
          <span class={[stylex.attrs(columnsMenu.lockedLabel).class]}
            >locked</span
          >
        {/if}
      </button>
    {/each}
  {/snippet}
</Menu>
