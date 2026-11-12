<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Button from "../button/index.svelte";
  type Props = Omit<
    ComponentProps<typeof Button>,
    "type" | "role" | "onclick"
  > & {
    onSelect: () => void;
  };
  let { onSelect, href, disabled = false, children, ...rest }: Props = $props();
  function select() {
    if (!disabled) onSelect();
  }
</script>

<Button {...rest} href={disabled ? undefined : href} type="button" role="menuitem" {disabled} onclick={select}>
  {@render children?.()}
</Button>
