import { toastState } from "./toast-instance.svelte.js";
import type { ToastOptions } from "./toast-types.js";

export const toast = Object.assign(
  (message: string, options?: ToastOptions) =>
    toastState.show("info", message, options),
  {
    success: (message: string, options?: ToastOptions) =>
      toastState.show("success", message, options),
    info: (message: string, options?: ToastOptions) =>
      toastState.show("info", message, options),
    warning: (message: string, options?: ToastOptions) =>
      toastState.show("warning", message, options),
    error: (message: string, options?: ToastOptions) =>
      toastState.show("error", message, options),
    danger: (message: string, options?: ToastOptions) =>
      toastState.show("error", message, options),
    dismiss: (id?: string) => {
      if (id) toastState.dismiss(id);
      else if (toastState.visible) toastState.dismiss(toastState.visible.id);
    },
  },
);
