<script lang="ts">
  import { formLabel } from "./form-label.styles";

  import { styleAttributes } from "../../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";

  import * as FormPrimitive from "formsnap";

  let {
    sx,
    class: className = "",
    children,
    ...rest
  }: FormPrimitive.LabelProps & { class?: string } & {
    sx?: stylex.StyleXStyles;
  } = $props();
</script>

<FormPrimitive.Label {...rest}>
  {#snippet child({ props })}
    <label
      {...props}
      data-slot="form-label"
      {...styleAttributes(
        [formLabel.root, sx],
        [className].flat(Infinity).filter(Boolean).join(" "),
      )}
    >
      {@render children?.()}
    </label>
  {/snippet}
</FormPrimitive.Label>
