<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Button from "../button/button-base.svelte";
  import Checkbox from "../checkbox/checkbox-base.svelte";

  type Props = Omit<
    ComponentProps<typeof Button>,
    "href" | "type" | "role" | "aria-checked" | "onclick" | "leading"
  > & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  };

  let {
    checked = $bindable(false),
    disabled = false,
    onCheckedChange,
    children,
    ...rest
  }: Props = $props();

  function toggle() {
    if (disabled) return;
    checked = !checked;
    onCheckedChange?.(checked);
  }
</script>

<Button
  {...rest}
  type="button"
  role="checkbox"
  aria-checked={checked}
  {disabled}
  onclick={toggle}
>
  {#snippet leading()}<Checkbox {checked} />{/snippet}
  {@render children?.()}
</Button>
