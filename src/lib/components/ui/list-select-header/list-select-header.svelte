<script lang="ts">
  import { selectHeader } from "./list-select-header.styles";

  import { styleAttributes } from "../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import { Checkbox } from "../checkbox/base";

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
  }: Props & { sx?: stylex.StyleXStyles } = $props();
</script>

<th
  scope="col"
  {...styleAttributes(
    [selectHeader.root, sx],
    [className].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  <label class={[stylex.attrs(selectHeader.label).class]}>
    <input
      type="checkbox"
      aria-label="Select all on page"
      {checked}
      {indeterminate}
      onchange={(e) =>
        onSelectAll((e.currentTarget as HTMLInputElement).checked)}
      class={[stylex.attrs(selectHeader.checkbox).class, "peer"]}
    />
    <Checkbox {checked} />
  </label>
</th>
