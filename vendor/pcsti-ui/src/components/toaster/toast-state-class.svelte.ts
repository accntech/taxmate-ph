import {
  MAX_VISIBLE_TOASTS,
  TOAST_DURATIONS,
  type ToastItem,
  type ToastOptions,
  type ToastPauseReason,
  type ToastType,
} from "./toast-types.js";

type LegacyToastVariant = "normal" | "info" | "success" | "warning" | "danger";

export class ToastState {
  items = $state.raw<ToastItem[]>([]);

  #sequence = 0;
  #timers = new Map<string, ReturnType<typeof setTimeout>>();
  #startedAt = new Map<string, number>();
  #pauseReasons = new Map<string, Set<ToastPauseReason>>();
  #visiblePauseReasons = new Set<ToastPauseReason>();

  get visibleItems() {
    return this.items.slice(0, MAX_VISIBLE_TOASTS);
  }

  get visible() {
    return this.visibleItems[0];
  }

  // Compatibility alias for existing consumers of the previous shared store.
  get toasts() {
    return this.items;
  }

  show(type: ToastType, message: string, options?: ToastOptions) {
    const defaultDuration = TOAST_DURATIONS[type];
    const duration =
      options?.duration === undefined ? defaultDuration : options.duration;
    const item: ToastItem = {
      id: `toast-${++this.#sequence}`,
      type,
      message,
      description: options?.description,
      duration,
      remaining: duration,
      paused: false,
    };

    this.items = [...this.items, item];
    if (this.items.length <= MAX_VISIBLE_TOASTS) this.#activate(item);
    return item.id;
  }

  push(variant: LegacyToastVariant, message: string, options?: ToastOptions) {
    const type =
      variant === "danger" ? "error" : variant === "normal" ? "info" : variant;
    return this.show(type, message, options);
  }

  dismiss(id: string) {
    const previousVisibleIds = new Set(
      this.visibleItems.map((item) => item.id),
    );
    this.#clearTimer(id);
    this.#pauseReasons.delete(id);
    this.items = this.items.filter((item) => item.id !== id);

    for (const item of this.visibleItems) {
      if (!previousVisibleIds.has(item.id)) this.#activate(item);
    }
  }

  pause(id: string, reason: ToastPauseReason) {
    const item = this.visibleItems.find((candidate) => candidate.id === id);
    if (!item || item.duration === null || item.remaining === null) return;

    const reasons = this.#pauseReasons.get(id) ?? new Set<ToastPauseReason>();
    if (reasons.has(reason)) return;
    const wasRunning = reasons.size === 0;
    reasons.add(reason);
    this.#pauseReasons.set(id, reasons);
    if (!wasRunning) return;

    const startedAt = this.#startedAt.get(id) ?? Date.now();
    const remaining = Math.max(0, item.remaining - (Date.now() - startedAt));
    this.#clearTimer(id);
    this.#update(id, { remaining, paused: true });
  }

  resume(id: string, reason: ToastPauseReason) {
    const reasons = this.#pauseReasons.get(id);
    if (!reasons?.delete(reason)) return;
    if (reasons.size > 0) return;

    this.#pauseReasons.delete(id);
    const item = this.visibleItems.find((candidate) => candidate.id === id);
    if (!item || item.remaining === null) return;

    this.#update(id, { paused: false });
    const resumedItem = this.visibleItems.find(
      (candidate) => candidate.id === id,
    );
    if (resumedItem) this.#schedule(resumedItem);
  }

  pauseVisible(reason: ToastPauseReason) {
    this.#visiblePauseReasons.add(reason);
    for (const item of this.visibleItems) this.pause(item.id, reason);
  }

  resumeVisible(reason: ToastPauseReason) {
    this.#visiblePauseReasons.delete(reason);
    for (const item of this.visibleItems) this.resume(item.id, reason);
  }

  #activate(item: ToastItem) {
    if (item.duration === null || item.remaining === null) return;
    if (this.#visiblePauseReasons.size > 0) {
      this.#pauseReasons.set(item.id, new Set(this.#visiblePauseReasons));
      this.#update(item.id, { paused: true });
      return;
    }
    this.#schedule(item);
  }

  #schedule(item: ToastItem) {
    if (item.remaining === null || item.paused) return;
    this.#clearTimer(item.id);
    this.#startedAt.set(item.id, Date.now());
    this.#timers.set(
      item.id,
      setTimeout(() => this.dismiss(item.id), item.remaining),
    );
  }

  #clearTimer(id: string) {
    const timer = this.#timers.get(id);
    if (timer) clearTimeout(timer);
    this.#timers.delete(id);
    this.#startedAt.delete(id);
  }

  #update(id: string, patch: Partial<Pick<ToastItem, "remaining" | "paused">>) {
    this.items = this.items.map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    );
  }
}
