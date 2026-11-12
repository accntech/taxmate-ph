<script lang="ts">
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { closeButton } from "./close-button.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  type Props = {
    onclick: () => void;
    class?: string;
  };

  let {
    onclick,
    sx,
    class: className = "",
  }: Props & { sx?: stylex.StyleXStyles } = $props();
</script>

<button
  type="button"
  aria-label="Close"
  {onclick}
  {...styleAttributes(
    [closeButton.root, sx],
    ["", className].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  <span
    data-icon
    class={[stylex.attrs([closeButton.icon]).class]}
    aria-hidden="true"><SolarIcon icon={glyphs.closeSquare} /></span
  >
</button>
