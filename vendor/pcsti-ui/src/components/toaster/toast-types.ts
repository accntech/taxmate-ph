export type ToastType = "success" | "info" | "warning" | "error";
export type ToastPauseReason = "pointer" | "focus" | "document";

export type ToastOptions = {
  description?: string;
  duration?: number;
};

export type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration: number | null;
  remaining: number | null;
  paused: boolean;
};

export const MAX_VISIBLE_TOASTS = 3;

export const TOAST_DURATIONS = {
  success: 5_000,
  info: 5_000,
  warning: 8_000,
  error: null,
} as const satisfies Record<ToastType, number | null>;
