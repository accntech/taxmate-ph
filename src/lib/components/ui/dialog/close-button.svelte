<script lang="ts">
  import { DialogClose } from "@ui-sdk/svelte/dialog";
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { closeButton } from "./close-button.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  type Props = {
    class?: string;
  };

  let {
    sx,
    class: className = "",
  }: Props & { sx?: stylex.StyleXStyles } = $props();
</script>

<DialogClose
  type="button"
  aria-label="Close"
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
</DialogClose>
