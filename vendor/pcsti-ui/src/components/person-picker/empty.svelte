<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { icons as emptyPersonIcons } from "./empty.icons";
  import { Icon as SolarIcon } from "../icon";

  import { emptyPerson } from "./empty.styles";

  import * as stylex from "@stylexjs/stylex";
  import { Button } from "../button";

  type Props = {
    id?: string;
    "aria-describedby"?: HTMLButtonAttributes["aria-describedby"];
    disabled: boolean;
    invalid: boolean;
    compact: boolean;
    chooseLabel: string;
    chooseDescription: string;
    onopen: () => void;
  };

  let {
    id,
    "aria-describedby": describedBy,
    disabled,
    invalid,
    compact,
    chooseLabel,
    chooseDescription,
    onopen,
  }: Props = $props();
</script>

<Button
  {id}
  aria-describedby={describedBy}
  type="button"
  onclick={onopen}
  {disabled}
  sx={[emptyPerson.trigger, compact ? emptyPerson.compactTrigger : null]}
  data-invalid={invalid ? "true" : undefined}
>
  <span
    data-icon
    class={[
      stylex.attrs(emptyPerson.icon, compact ? emptyPerson.compactIcon : null)
        .class,
    ]}
    aria-hidden="true"><SolarIcon icon={emptyPersonIcons.icon} /></span
  >
  <span
    class={[
      stylex.attrs(emptyPerson.copy, compact ? emptyPerson.compactCopy : null)
        .class,
    ]}
  >
    <span class={[stylex.attrs(emptyPerson.label).class]}>{chooseLabel}</span>
    <span class={[stylex.attrs(emptyPerson.description).class]}
      >{chooseDescription}</span
    >
  </span>
</Button>
