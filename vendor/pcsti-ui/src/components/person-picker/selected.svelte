<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { selectedPerson } from "./selected.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import { Avatar } from "../avatar";
  import { Button } from "../button";
  import type { PersonPickerItem } from "./types";

  type Props = {
    id?: string;
    "aria-describedby"?: HTMLButtonAttributes["aria-describedby"];
    selected: PersonPickerItem;
    selectedDescription?: string;
    selectedFallback: string;
    disabled: boolean;
    hideActions: boolean;
    compact: boolean;
    invalid: boolean;
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
    onopen,
    onclear,
    children,
  }: Props = $props();
</script>

{#if hideActions}
  <button
    {id}
    aria-describedby={describedBy}
    data-invalid={invalid ? "true" : undefined}
    type="button"
    onclick={onopen}
    {disabled}
    class={[
      stylex.attrs(
        selectedPerson.trigger,
        compact ? selectedPerson.compactTrigger : null,
      ).class,
    ]}
  >
    <Avatar
      src={selected.imageUrl}
      fallback={selectedFallback}
      sx={[
        selectedPerson.avatar,
        compact ? selectedPerson.compactAvatar : null,
      ]}
      class={[selected.avatarClass ?? ""].filter(Boolean).join(" ")}
      style={selected.avatarStyle}
      ariaHidden
    />
    <div class={[stylex.attrs(selectedPerson.details).class]}>
      <div
        class={[
          stylex.attrs(
            selectedPerson.name,
            compact ? selectedPerson.compactName : null,
          ).class,
        ]}
      >
        {selected.label}
      </div>
      <div
        class={[
          stylex.attrs(
            selectedPerson.description,
            compact ? selectedPerson.compactDescription : null,
          ).class,
        ]}
      >
        {selectedDescription ?? selected.description ?? ""}
      </div>
    </div>
  </button>
{:else}
  <div
    class={[
      stylex.attrs(
        selectedPerson.root,
        compact ? selectedPerson.compactRoot : null,
      ).class,
    ]}
  >
    <Avatar
      src={selected.imageUrl}
      fallback={selectedFallback}
      sx={[
        selectedPerson.avatar,
        compact ? selectedPerson.compactAvatar : null,
      ]}
      class={[selected.avatarClass ?? ""].filter(Boolean).join(" ")}
      style={selected.avatarStyle}
      ariaHidden
    />
    <div class={[stylex.attrs(selectedPerson.details).class]}>
      <div
        class={[
          stylex.attrs(
            selectedPerson.name,
            compact ? selectedPerson.compactName : null,
          ).class,
        ]}
      >
        {selected.label}
      </div>
      <div
        class={[
          stylex.attrs(
            selectedPerson.description,
            compact ? selectedPerson.compactDescription : null,
          ).class,
        ]}
      >
        {selectedDescription ?? selected.description ?? ""}
      </div>
    </div>
    <div class={[stylex.attrs(selectedPerson.actions).class]}>
      <Button
        {id}
        aria-describedby={describedBy}
        data-invalid={invalid ? "true" : undefined}
        size="compact"
        variant="outlined"
        onclick={onopen}
        {disabled}>Change</Button
      >
      <Button size="compact" variant="ghost" onclick={onclear} {disabled}
        >Clear</Button
      >
    </div>
  </div>
{/if}
{#if children}
  {@render children()}
{/if}
