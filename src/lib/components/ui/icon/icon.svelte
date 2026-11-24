<script lang="ts">
  import type { IconComponent } from "../icons";
  let { icon: Component }: { icon?: IconComponent | false | null } = $props();
</script>

{#if Component}
  <Component
    size="100%"
    color="currentColor"
    aria-hidden="true"
    focusable="false"
  />
{/if}
