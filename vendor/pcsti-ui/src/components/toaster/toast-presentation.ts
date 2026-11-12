import { toastPresentation } from "./toast-presentation-variants.styles";
import { cubicIn, quintOut } from "svelte/easing";
import type { ToastItem, ToastType } from "./toast-types.js";

export function toastRole(type: ToastType) {
  return type === "error" || type === "warning" ? "alert" : "status";
}

export function toastClass(type: ToastType) {
  return [
    toastPresentation.root,
    type === "success" && toastPresentation.success,
    type === "info" && toastPresentation.info,
    type === "warning" && toastPresentation.warning,
    type === "error" && toastPresentation.error,
  ];
}

export function toastDuration(item: ToastItem) {
  return item.duration === null ? undefined : `${item.duration}ms`;
}

export function toastEntrance(mobile: boolean, reducedMotion: boolean) {
  return {
    x: mobile ? 0 : 16,
    y: mobile ? -12 : 0,
    opacity: 0,
    duration: reducedMotion ? 0 : 240,
    easing: quintOut,
  };
}

export function toastExit(mobile: boolean, reducedMotion: boolean) {
  return {
    x: mobile ? 0 : 12,
    y: mobile ? -8 : 0,
    opacity: 0,
    duration: reducedMotion ? 0 : 130,
    easing: cubicIn,
  };
}

export function toastReorder(reducedMotion: boolean) {
  return { duration: reducedMotion ? 0 : 240, easing: quintOut };
}
