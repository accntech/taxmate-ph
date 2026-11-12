<script lang="ts">
  import { Icon as SolarIcon } from "../icon";

  import { glyphs } from "../../icons";

  import { filterChip } from "./index.styles";

  import * as stylex from "@stylexjs/stylex";
  type Props = { label: string; value: string; onclear: () => void };
  let { label, value, onclear }: Props = $props();
</script>

<span class={[stylex.attrs(filterChip.root).class]}>
  <span class={[stylex.attrs(filterChip.label).class]}>{label}:</span>
  <span class={[stylex.attrs(filterChip.value).class]}>{value}</span>
  <button
    type="button"
    onclick={onclear}
    aria-label="Clear {label} filter"
    class={[stylex.attrs(filterChip.clearButton).class]}
  >
    <span
      data-icon
      class={[stylex.attrs([filterChip.clearIcon]).class]}
      aria-hidden="true"><SolarIcon icon={glyphs.closeCircle} /></span
    >
  </button>
</span>
