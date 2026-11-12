import { dialogSize } from "../styles/dialog-controls-variants.styles";
import { lockBodyScroll } from "./body-scroll-lock";
import { syncNativeDialogOpen } from "./dialog-controls-helpers";

export const DIALOG_SIZE_CLASS = {
  sm: dialogSize.small,
  md: dialogSize.medium,
  lg: dialogSize.large,
  xl: dialogSize.extraLarge,
} as const;

type DialogControlsOptions = {
  getOpen: () => boolean;
  setOpenValue: (open: boolean) => void;
  onOpenChange?: (open: boolean) => void;
  closedByBackdrop: () => boolean;
  closedByEscape: () => boolean;
};

function syncDialogOpen(el: HTMLDialogElement, isOpen: () => boolean) {
  $effect(() => {
    syncNativeDialogOpen(el, isOpen());
  });

  $effect(() => {
    if (!isOpen()) return;
    return lockBodyScroll();
  });
}

export function createDialogControls(options: DialogControlsOptions) {
  function setOpen(next: boolean) {
    if (options.getOpen() === next) return;
    options.setOpenValue(next);
    options.onOpenChange?.(next);
  }

  function syncOpen(el: HTMLDialogElement) {
    syncDialogOpen(el, options.getOpen);
  }

  function onClose() {
    setOpen(false);
  }

  function onCancel(event: Event) {
    if (!options.closedByEscape()) event.preventDefault();
  }

  function onDialogClick(event: MouseEvent) {
    if (!options.closedByBackdrop()) return;
    if (event.target === event.currentTarget) setOpen(false);
  }

  return { setOpen, syncOpen, onClose, onCancel, onDialogClick };
}
