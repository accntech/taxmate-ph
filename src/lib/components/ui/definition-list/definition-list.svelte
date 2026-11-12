<script lang="ts">
  import { definitionList } from "./definition-list.styles";

  import * as stylex from "@stylexjs/stylex";
  import { styleAttributes } from "../styles/style-attributes";
  import type { HTMLAttributes } from "svelte/elements";
  export type DefinitionListItem = {
    label: string;
    value: string | number | null | undefined;
    mono?: boolean;
  };

  type Props = {
    items: DefinitionListItem[];
    labelWidth?: string;
    emptyLabel?: string;
    sx?: stylex.StyleXStyles;
  };

  let {
    items,
    labelWidth = "88px",
    emptyLabel = "—",
    sx,
    class: className = "",
    style,
    ...rest
  }: Props & Omit<HTMLAttributes<HTMLDListElement>, "children"> = $props();
  const attributes = $derived(
    styleAttributes(
      [definitionList.root, sx],
      "",
      `grid-template-columns: ${labelWidth} minmax(0, 1fr);${style ?? ""}`,
    ),
  );
</script>

<dl {...rest} {...attributes} class={[attributes.class, className]}>
  {#each items as item (item.label)}
    <dt class={[stylex.attrs(definitionList.label).class]}>
      {item.label}
    </dt>
    <dd
      class={[
        stylex.attrs(
          definitionList.value,
          item.mono ? definitionList.monospacedValue : null,
        ).class,
      ]}
    >
      {item.value ?? emptyLabel}
    </dd>
  {/each}
</dl>
