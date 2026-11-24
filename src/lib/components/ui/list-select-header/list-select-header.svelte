<script lang="ts">
  import type { StyleXStyles } from "@stylexjs/stylex";
  import { selectHeader } from "./list-select-header.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import { CheckboxInput } from "../checkbox-input";

  type Props = {
    checked: boolean;
    indeterminate: boolean;
    onSelectAll: (checked: boolean) => void;
    class?: string;
  };

  let {
    checked,
    indeterminate,
    onSelectAll,
    sx,
    class: className = "",
  }: Props & { sx?: StyleXStyles } = $props();
</script>

<th
  scope="col"
  {...styleAttributes(
    [selectHeader.root, sx],
    [className].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  <CheckboxInput
    aria-label="Select all on page"
    {checked}
    {indeterminate}
    onchange={(event) => onSelectAll(event.currentTarget.checked)}
  />
</th>
