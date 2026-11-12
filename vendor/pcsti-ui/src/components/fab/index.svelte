<script lang="ts">
  import { Icon as SolarIcon } from "../icon";
  import type { IconComponent } from "../icon";

  import { fab } from "./index.styles";

  import * as stylex from "@stylexjs/stylex";
  type Props = {
    href?: string;
    onclick?: () => void;
    label: string;
    icon: IconComponent;
    hidden?: boolean;
  };

  let { href, onclick, label, icon, hidden = false }: Props = $props();

  const base = fab.root;

  const visibility = $derived(hidden ? fab.hidden : fab.visible);
</script>

{#if href}
  <a
    {href}
    aria-label={label}
    aria-hidden={hidden}
    tabindex={hidden ? -1 : 0}
    class={[stylex.attrs(base, visibility).class]}
  >
    <span data-icon class={[stylex.attrs(fab.icon).class]} aria-hidden="true"
      ><SolarIcon {icon} /></span
    >
  </a>
{:else}
  <button
    type="button"
    {onclick}
    aria-label={label}
    aria-hidden={hidden}
    tabindex={hidden ? -1 : 0}
    disabled={hidden}
    class={[stylex.attrs(base, visibility).class]}
  >
    <span data-icon class={[stylex.attrs(fab.icon).class]} aria-hidden="true"
      ><SolarIcon {icon} /></span
    >
  </button>
{/if}
