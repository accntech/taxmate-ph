<script lang="ts">
  import { dialogContent } from "./content.styles";

  import { styleAttributes } from "../../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import DialogBody from "./body.svelte";
  import DialogCloseButton from "./close-button.svelte";
  import DialogFooter from "./footer.svelte";
  import DialogHeader from "./header.svelte";

  type Props = {
    title?: string;
    description?: string;
    titleId: string;
    descId: string;
    showCloseButton: boolean;
    showHeading?: boolean;
    overflowVisible: boolean;
    scrollBody: boolean;
    scrollFade: boolean;
    children?: Snippet;
    footer?: Snippet;
    class?: string;
    onclose: () => void;
  };

  let {
    title,
    description,
    titleId,
    descId,
    showCloseButton,
    showHeading = true,
    overflowVisible,
    scrollBody,
    scrollFade,
    children,
    footer,
    sx,
    class: className = "",
    onclose,
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  const hasHeader = $derived(Boolean(title || description));
</script>

<div
  data-overflow-visible={overflowVisible}
  {...styleAttributes(
    [
      dialogContent.root,
      scrollBody
        ? dialogContent.scrollable
        : overflowVisible
          ? dialogContent.overflowVisible
          : dialogContent.overflowClipped,
      sx,
    ],
    ["dialog-panel", className].flat(Infinity).filter(Boolean).join(" "),
  )}
>
  {#if showCloseButton}
    <DialogCloseButton onclick={onclose} sx={dialogContent.closeButton} />
  {/if}
  {#if showHeading}
    <div class={[stylex.attrs(dialogContent.heading).class]}>
      <div
        class={[stylex.attrs(dialogContent.accentEdge).class]}
        aria-hidden="true"
      ></div>
      <DialogHeader
        {title}
        {description}
        {titleId}
        {descId}
        {showCloseButton}
      />
    </div>
  {/if}
  <DialogBody {children} {hasHeader} {scrollBody} {scrollFade} />
  <DialogFooter {footer} />
</div>
