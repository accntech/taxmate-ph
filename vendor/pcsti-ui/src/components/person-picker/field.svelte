<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import PersonPickerEmpty from "./empty.svelte";
  import PersonPickerSelected from "./selected.svelte";
  import type { PersonPickerItem } from "./types";

  type Props = {
    id?: string;
    "aria-describedby"?: HTMLButtonAttributes["aria-describedby"];
    selected: PersonPickerItem | null;
    selectedDescription?: string;
    selectedFallback: string;
    disabled: boolean;
    hideActions: boolean;
    compact: boolean;
    invalid: boolean;
    chooseLabel: string;
    chooseDescription: string;
    onopen: () => void;
    onclear: () => void;
    children?: Snippet;
  };

  let {
    id,
    "aria-describedby": describedBy,
    selected,
    selectedDescription,
    selectedFallback,
    disabled,
    hideActions,
    compact,
    invalid,
    chooseLabel,
    chooseDescription,
    onopen,
    onclear,
    children,
  }: Props = $props();
</script>

{#if selected}
  <PersonPickerSelected
    {invalid}
    {id}
    aria-describedby={describedBy}
    {selected}
    {selectedDescription}
    {selectedFallback}
    {disabled}
    {hideActions}
    {compact}
    {onopen}
    {onclear}
  >
    {@render children?.()}
  </PersonPickerSelected>
{:else}
  <PersonPickerEmpty
    {id}
    aria-describedby={describedBy}
    {disabled}
    {invalid}
    {compact}
    {chooseLabel}
    {chooseDescription}
    {onopen}
  />
{/if}
