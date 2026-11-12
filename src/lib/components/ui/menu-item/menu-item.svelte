<!-- Ported from pcsti/packages/ui/src/components/menu-item/index.svelte.
     Uses the copied PCSTI Button with the source menuitem contract. -->
<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Button from "../button/compat-button.svelte";
  type Props = Omit<
    ComponentProps<typeof Button>,
    "type" | "role" | "onclick"
  > & {
    onSelect: () => void;
  };
  let { onSelect, disabled = false, children, ...rest }: Props = $props();
  function select() {
    if (!disabled) onSelect();
  }
</script>

<Button {...rest} type="button" role="menuitem" {disabled} onclick={select}>
  {@render children?.()}
</Button>
