<script lang="ts">
  import { dialogHeader } from "./header.styles";

  import * as stylex from "@stylexjs/stylex";

  type Props = {
    title?: string;
    description?: string;
    titleId: string;
    descId: string;
    showCloseButton: boolean;
  };

  let { title, description, titleId, descId, showCloseButton }: Props =
    $props();

  const titleClass = $derived([
    dialogHeader.title,
    showCloseButton ? dialogHeader.closeButtonSpace : null,
  ]);
  const descriptionClass = $derived([
    dialogHeader.description,
    title ? dialogHeader.belowTitle : null,
    showCloseButton && !title ? dialogHeader.closeButtonSpace : null,
  ]);
</script>

{#if title}
  <h2 id={titleId} class={[stylex.attrs(titleClass).class]}>
    {title}
  </h2>
{/if}
{#if description}
  <p id={descId} class={[stylex.attrs(descriptionClass).class]}>
    {description}
  </p>
{/if}
