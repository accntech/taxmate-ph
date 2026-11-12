import type { Attachment } from "svelte/attachments";
import { untrack } from "svelte";
import { toastState } from "./toast-instance.svelte.js";

export function createToastLayer(): Attachment<HTMLElement> {
  let modals: HTMLDialogElement[] = [];
  return (element) => {
    untrack(handleToastVisibilityChange);
    if (
      typeof element.showPopover !== "function" ||
      typeof element.hidePopover !== "function"
    ) {
      return;
    }
    const origin = document.createComment("toaster");
    element.before(origin);

    function syncLayer(records: MutationRecord[] = []) {
      // Outgoing toasts stay mounted until their transition finishes. Keep the
      // layer open throughout that transition, independent of the store count.
      const visible = element.childElementCount > 0;
      const openModals = Array.from(
        document.querySelectorAll<HTMLDialogElement>("dialog:modal"),
      );
      modals = modals.filter((dialog) => openModals.includes(dialog));
      for (const dialog of openModals) {
        if (!modals.includes(dialog)) modals.push(dialog);
      }
      // Keep opening order even when sibling dialogs appear in another DOM order.
      for (const record of records) {
        if (
          record.type === "attributes" &&
          record.oldValue === null &&
          record.target instanceof HTMLDialogElement &&
          openModals.includes(record.target)
        ) {
          modals = modals.filter((dialog) => dialog !== record.target);
          modals.push(record.target);
        }
      }

      const parent = modals.at(-1) ?? origin.parentNode;
      if (parent && element.parentNode !== parent) {
        const focused = element.contains(document.activeElement)
          ? (document.activeElement as HTMLElement)
          : null;
        if (element.matches(":popover-open")) element.hidePopover();
        // Top-layer popovers outside a modal are still inert. Keep the toast
        // inside the active modal so pointer and keyboard dismissal both work.
        if (parent === origin.parentNode) origin.after(element);
        else parent.appendChild(element);
        if (visible) element.showPopover();
        focused?.focus({ preventScroll: true });
      }
      if (visible && !element.matches(":popover-open")) element.showPopover();
      if (!visible && element.matches(":popover-open")) element.hidePopover();
    }

    const observer = new MutationObserver(syncLayer);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["open"],
      attributeOldValue: true,
    });
    syncLayer();

    return () => {
      observer.disconnect();
      if (element.matches(":popover-open")) element.hidePopover();
      origin.replaceWith(element);
    };
  };
}

export function handleToastVisibilityChange() {
  if (document.visibilityState === "hidden")
    toastState.pauseVisible("document");
  else toastState.resumeVisible("document");
}

export function handleToastFocusOut(event: FocusEvent, id: string) {
  if (event.currentTarget instanceof HTMLElement) {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget))
      return;
  }
  toastState.resume(id, "focus");
}

export function handleToastKeydown(event: KeyboardEvent, id: string) {
  if (event.key !== "Escape") return;
  event.preventDefault();
  event.stopPropagation();
  toastState.dismiss(id);
}
