<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Button from "../button/index.svelte";
  type Props = Omit<
    ComponentProps<typeof Button>,
    "href" | "type" | "role" | "aria-checked" | "onclick"
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
  role="menuitemcheckbox"
  aria-checked={checked}
  {disabled}
  onclick={toggle}
>
  {@render children?.()}
</Button>
