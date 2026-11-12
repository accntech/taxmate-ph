<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import type { StyleXStyles } from "@stylexjs/stylex";
  import { menuRadioItem } from "./index.styles";
  import { styleAttributes } from "../../styles/style-attributes";

  type Props = Omit<
    HTMLButtonAttributes,
    "type" | "role" | "aria-checked" | "onclick" | "children" | "class"
  > & {
    checked: boolean;
    onSelect: () => void;
    children?: Snippet;
    sx?: StyleXStyles;
    class?: string;
  };

  let {
    checked,
    onSelect,
    disabled = false,
    children,
    sx,
    class: className = "",
    style,
    ...rest
  }: Props = $props();

  function select() {
    if (!disabled) onSelect();
  }
</script>

<button
  {...rest}
  type="button"
  role="menuitemradio"
  aria-checked={checked}
  {disabled}
  {...styleAttributes([menuRadioItem.root, sx], className, style)}
  onclick={select}
>
  {@render children?.()}
</button>
