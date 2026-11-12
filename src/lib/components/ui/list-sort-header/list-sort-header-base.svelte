<script lang="ts">
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { sortHeader } from "./list-sort-header.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  type SortDir = "asc" | "desc";
  type SortState = "ascending" | "descending" | "none";

  type Props = {
    label: string;
    column: string;
    currentSort: string;
    dir: SortDir;
    align?: "start" | "end";
    class?: string;
  } & (
    { href: string; onclick?: never } | { href?: never; onclick: () => void }
  );

  let {
    label,
    column,
    href,
    onclick,
    currentSort,
    dir,
    align = "start",
    sx,
    class: className = "",
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  let active = $derived(currentSort === column);
  let ariaSort: SortState = $derived(
    active ? (dir === "asc" ? "ascending" : "descending") : "none",
  );
  let linkClass = $derived([
    sortHeader.trigger,
    align === "end" ? sortHeader.alignEnd : null,
  ]);
</script>

<th
  scope="col"
  aria-sort={ariaSort}
  {...styleAttributes(
    [sortHeader.root, sx],
    [className].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  {#snippet content()}
    {label}
    <span
      data-icon
      class={[
        stylex.attrs(
          [sortHeader.sortIcon],
          active && dir === "desc" ? sortHeader.descendingIcon : null,
          !active ? sortHeader.inactiveIcon : null,
        ).class,
      ]}
      aria-hidden="true"><SolarIcon icon={glyphs.chevronDown} /></span
    >
  {/snippet}
  {#if href !== undefined}
    <a {href} class={[stylex.attrs(linkClass).class]} data-sveltekit-reset="false">
      {@render content()}
    </a>
  {:else}
    <button
      type="button"
      {onclick}
      {...stylex.attrs(linkClass, sortHeader.button)}
    >
      {@render content()}
    </button>
  {/if}
</th>
