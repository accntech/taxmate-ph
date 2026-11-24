<script lang="ts">
  import "./dialog-base.css";
  import SdkModal from "./sdk-modal.svelte";
  import { dialog as dialogLayout } from "./dialog.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { Snippet } from "svelte";
  import { DIALOG_SIZE_CLASS } from "../utils/dialog-controls.svelte";
  import DialogContent from "./content.svelte";

  type Size = "sm" | "md" | "lg" | "xl" | "full";

  type Props = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    size?: Size;
    closedByBackdrop?: boolean;
    closedByEscape?: boolean;
    backdrop?: "dim" | "transparent" | "blur";
    hideCloseButton?: boolean;
    overflowVisible?: boolean;
    scrollBody?: boolean;
    scrollFade?: boolean;
    title?: string;
    ariaLabel?: string;
    description?: string;
    children?: Snippet;
    footer?: Snippet;
    class?: string;
  };

  let {
    open = $bindable(false),
    onOpenChange,
    size = "md",
    closedByBackdrop = true,
    closedByEscape = true,
    backdrop = "dim",
    hideCloseButton = false,
    overflowVisible = false,
    scrollBody = false,
    scrollFade = false,
    title,
    ariaLabel,
    description,
    children,
    footer,
    sx,
    class: className = "",
  }: Props & { sx?: stylex.StyleXStyles } = $props();

  const showCloseButton = $derived(
    !hideCloseButton && (closedByBackdrop || closedByEscape),
  );

  const uid = $props.id();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;

</script>

<SdkModal
  bind:open
  {onOpenChange}
  {closedByBackdrop}
  {closedByEscape}
  aria-labelledby={title ? titleId : undefined}
  aria-label={ariaLabel}
  aria-describedby={description ? descId : undefined}
  data-size={size}
  data-backdrop={backdrop}
  data-overflow-visible={overflowVisible}
  class={[
    "taxmate-base-dialog",
    stylex.attrs(
      dialogLayout.root,
      DIALOG_SIZE_CLASS[size === "full" ? "xl" : size],
    ).class,
  ]}
>
  <DialogContent
    {title}
    {description}
    {titleId}
    {descId}
    {showCloseButton}
    showHeading={!ariaLabel || Boolean(title || description)}
    {overflowVisible}
    {scrollBody}
    {scrollFade}
    {children}
    {footer}
    {sx}
    class={[className].filter(Boolean).join(" ")}
  />
</SdkModal>
