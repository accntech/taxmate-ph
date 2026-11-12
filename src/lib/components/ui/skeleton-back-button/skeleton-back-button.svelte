<script lang="ts">
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { backButton } from "./skeleton-back-button.styles";

  import * as stylex from "@stylexjs/stylex";
  import { Button } from "../button/base";

  function goBack() {
    history.back();
  }
</script>

<Button
  type="button"
  size="icon-sm"
  variant="outlined"
  onclick={goBack}
  aria-label="Go back"
>
  <span
    data-icon
    class={[stylex.attrs([backButton.icon]).class]}
    aria-hidden="true"><SolarIcon icon={glyphs.chevronLeft} /></span
  >
</Button>
