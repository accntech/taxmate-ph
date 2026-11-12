<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { StyleXStyles } from "@stylexjs/stylex";
  import { styleAttributes } from "../styles/style-attributes";
  type Props = Omit<HTMLInputAttributes, "type" | "role" | "checked"> & {
    checked?: boolean;
    sx?: StyleXStyles;
  };
  let {
    checked = $bindable(false),
    sx,
    class: className,
    style,
    onchange,
    ...rest
  }: Props = $props();

  function change(
    event: Event & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    checked = event.currentTarget.checked;
    onchange?.(event);
  }
</script>

<input
  {...rest}
  type="radio"
  {checked}
  onchange={change}
  {...styleAttributes(sx, "", style)}
  class={[styleAttributes(sx).class, className]}
/>
