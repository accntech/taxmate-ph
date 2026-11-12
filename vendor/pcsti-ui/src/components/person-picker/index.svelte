<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { personPicker } from "./index.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import PersonPickerDialog from "./dialog.svelte";
  import PersonPickerField from "./field.svelte";
  import type { PersonPickerItem } from "./types";

  type Props = {
    id?: string;
    "aria-describedby"?: HTMLButtonAttributes["aria-describedby"];
    "aria-invalid"?: HTMLButtonAttributes["aria-invalid"];
    items: PersonPickerItem[];
    selectedId: string;
    onpick: (id: string) => void;
    onclear: () => void;
    disabled?: boolean;
    embedded?: boolean;
    hideActions?: boolean;
    compact?: boolean;
    invalid?: boolean;
    open?: boolean;
    query?: string;
    sectionId?: string;
    sectionNumber?: number;
    sectionLabel: string;
    selectedDescription?: string;
    chooseLabel: string;
    chooseDescription: string;
    dialogTitle: string;
    dialogDescription: string;
    searchPlaceholder: string;
    searchLabel: string;
    emptyMessage: string;
    noMatchMessage?: string;
    ariaLabel: string;
    rowHeight?: number;
    children?: Snippet;
  };

  let {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": ariaInvalid,
    items,
    selectedId,
    onpick,
    onclear,
    disabled = false,
    embedded = false,
    hideActions = false,
    compact = false,
    invalid = false,
    open = $bindable(false),
    query = $bindable(""),
    sectionId,
    sectionNumber = 1,
    sectionLabel,
    selectedDescription,
    chooseLabel,
    chooseDescription,
    dialogTitle,
    dialogDescription,
    searchPlaceholder,
    searchLabel,
    emptyMessage,
    noMatchMessage = "No matches.",
    ariaLabel,
    rowHeight = 56,
    children,
  }: Props = $props();

  const invalidState = $derived(
    invalid || ariaInvalid === true || ariaInvalid === "true",
  );

  const selected = $derived(
    items.find((item) => item.id === selectedId) ?? null,
  );
  const selectedFallback = $derived(selected?.fallback ?? "");

  function openDialog() {
    if (disabled) return;
    query = "";
    open = true;
  }
</script>

{#snippet field()}
  <PersonPickerField
    {id}
    aria-describedby={describedBy}
    {selected}
    {selectedDescription}
    {selectedFallback}
    {disabled}
    {hideActions}
    {compact}
    invalid={invalidState}
    {chooseLabel}
    {chooseDescription}
    onopen={openDialog}
    {onclear}
  >
    {@render children?.()}
  </PersonPickerField>
{/snippet}

{#if embedded}
  {@render field()}
{:else}
  <section id={sectionId} class={[stylex.attrs(personPicker.root).class]}>
    <header class={[stylex.attrs(personPicker.header).class]}>
      <span class={[stylex.attrs(personPicker.sectionNumber).class]}
        >{sectionNumber}</span
      >
      <span class={[stylex.attrs(personPicker.sectionLabel).class]}>
        {sectionLabel}
      </span>
      {#if !disabled}
        <span class={[stylex.attrs(personPicker.shortcutHint).class]}>
          Press <kbd class={[stylex.attrs(personPicker.shortcutKey).class]}
            >⌘K</kbd
          >
          to search
        </span>
      {/if}
    </header>

    {@render field()}
  </section>
{/if}

<PersonPickerDialog
  bind:open
  bind:query
  {items}
  {dialogTitle}
  {dialogDescription}
  {searchPlaceholder}
  {searchLabel}
  {emptyMessage}
  {noMatchMessage}
  {ariaLabel}
  {rowHeight}
  {onpick}
/>
