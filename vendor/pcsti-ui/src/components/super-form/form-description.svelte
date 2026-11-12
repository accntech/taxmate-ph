<script lang="ts">
  import { formDescription } from "./form-description.styles";

  import * as stylex from "@stylexjs/stylex";

  import * as FormPrimitive from "formsnap";

  let {
    sx,
    class: className = "",
    ...rest
  }: FormPrimitive.DescriptionProps & { class?: string } & {
    sx?: stylex.StyleXStyles;
  } = $props();
</script>

<FormPrimitive.Description
  data-slot="form-description"
  class={[stylex.attrs(formDescription.root, sx).class, className]
    .flat(Infinity)
    .filter(Boolean)
    .join(" ")}
  {...rest}
/>
