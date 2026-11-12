<script lang="ts" generics="Size extends number = 12 | 24 | 36">
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { pageSizePicker } from "./list-page-size-picker.styles";

  import * as stylex from "@stylexjs/stylex";
  import { Menu } from "../menu/base";

  const OPTIONS = [12, 24, 36] as const;

  type Props = {
    size: number;
    onpick: (size: Size) => void;
    options?: readonly Size[];
  };

  let { size, onpick, options }: Props = $props();

  function pick(next: Size | (typeof OPTIONS)[number], close: () => void) {
    close();
    if (next === size) return;
    onpick(next as Size);
  }
</script>

<Menu
  label="Rows per page"
  align="left"
  panelClass={pageSizePicker.panel}
  triggerClass={pageSizePicker.trigger}
>
  {#snippet trigger()}
    {size} per page
    <span
      data-icon
      class={[stylex.attrs([pageSizePicker.menuIcon]).class]}
      aria-hidden="true"><SolarIcon icon={glyphs.chevronDown} /></span
    >
  {/snippet}
  {#snippet content({ close })}
    {#each options ?? OPTIONS as option (option)}
      <button
        type="button"
        role="menuitemradio"
        aria-checked={size === option}
        onclick={() => pick(option, close)}
        class={[
          stylex.attrs(
            pageSizePicker.option,
            size === option
              ? pageSizePicker.selected
              : pageSizePicker.unselected,
          ).class,
        ]}
      >
        <span>{option} per page</span>
        <span class={[stylex.attrs(pageSizePicker.optionLabel).class]}>
          {#if size === option}
            <span
              data-icon
              class={[stylex.attrs([pageSizePicker.checkIcon]).class]}
              aria-hidden="true"><SolarIcon icon={glyphs.checkCircle} /></span
            >
          {/if}
        </span>
      </button>
    {/each}
  {/snippet}
</Menu>
