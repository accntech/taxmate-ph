import { getContext, setContext, untrack } from "svelte";
import type { Attachment } from "svelte/attachments";
import { SvelteMap, SvelteSet } from "svelte/reactivity";

export type DeletionStatusValue = "deleting" | "deleted" | "unconfirmed";

const deletionContext = Symbol("record-deletion");

function refreshFailed(result: unknown): boolean {
  return (
    typeof result === "object" &&
    result !== null &&
    "refreshFailed" in result &&
    result.refreshFailed === true
  );
}

function outcomeUncertain(error: unknown): boolean {
  if (typeof error === "object" && error !== null) {
    const body = "body" in error ? error.body : undefined;
    const status =
      "status" in error
        ? error.status
        : typeof body === "object" && body !== null && "status" in body
          ? body.status
          : undefined;
    // An HTTP error is an object in SvelteKit, not necessarily an Error. A 5xx
    // response cannot establish whether the mutation committed before failing.
    if (typeof status === "number") return status >= 500 && status <= 599;
  }
  if (!(error instanceof Error)) return false;
  return (
    error instanceof TypeError ||
    error instanceof SyntaxError ||
    error.name === "AbortError" ||
    /^(?:Invalid (?:input|data|circular reference|ArrayBuffer encoding)|Unknown type .+|Cannot parse an object with .+)$/.test(
      error.message,
    ) ||
    /failed to fetch|fetch failed|network(?:error| error| request failed)|load failed/i.test(
      error.message,
    )
  );
}

export function createDeletionState(
  options: {
    isExternallyLocked?: (id: string) => boolean;
    /** Include the complete mutation and its query publication in an application barrier. */
    publish?: <Result>(
      action: () => Result | Promise<Result>,
    ) => Promise<Result>;
  } = {},
) {
  const records = new SvelteMap<string, DeletionStatusValue>();
  // Keep IDs only for this context's lifetime. An older list response may
  // reintroduce a deleted record after its operation has already completed.
  const confirmed = new SvelteSet<string>();
  const visible = new SvelteMap<string, number>();

  function begin(ids: readonly string[]) {
    if (
      ids.length === 0 ||
      ids.some(
        (id) =>
          records.has(id) ||
          confirmed.has(id) ||
          options.isExternallyLocked?.(id),
      )
    )
      return false;
    for (const id of ids) records.set(id, "deleting");
    return true;
  }

  function complete(ids: readonly string[], failedRefresh = false) {
    for (const id of ids) {
      confirmed.add(id);
      if (failedRefresh) records.set(id, "deleted");
      else records.delete(id);
    }
  }

  function fail(ids: readonly string[]) {
    for (const id of ids) records.delete(id);
  }

  function trackVisible(id: string) {
    untrack(() => visible.set(id, (visible.get(id) ?? 0) + 1));
    return () =>
      untrack(() => {
        const count = visible.get(id) ?? 0;
        if (count <= 1) visible.delete(id);
        else visible.set(id, count - 1);
      });
  }

  function acquire(ids: readonly string[]) {
    const targets = [...new Set(ids)];
    if (!begin(targets)) return null;
    let used = false;
    return {
      async run<Result>(action: () => Result | Promise<Result>) {
        if (used) throw new Error("Deletion lease already used.");
        used = true;
        try {
          const result = await (options.publish
            ? options.publish(action)
            : action());
          complete(targets, refreshFailed(result));
          return result;
        } catch (error) {
          if (outcomeUncertain(error)) {
            for (const id of targets) records.set(id, "unconfirmed");
          } else fail(targets);
          throw error;
        }
      },
    };
  }

  async function run<Result>(
    ids: readonly string[],
    action: () => Result | Promise<Result>,
  ) {
    const lease = acquire(ids);
    return lease?.run(action);
  }

  return {
    isLocked: (id: string) =>
      records.has(id) ||
      confirmed.has(id) ||
      (options.isExternallyLocked?.(id) ?? false),
    status: (id: string): DeletionStatusValue | undefined =>
      records.get(id) ?? (confirmed.has(id) ? "deleted" : undefined),
    get pendingCount() {
      return [...records.values()].filter((status) => status === "deleting")
        .length;
    },
    get refreshCount() {
      const failedRefreshes = [...records.values()].filter(
        (status) => status === "deleted",
      ).length;
      const staleRows = [...confirmed].filter(
        (id) => visible.has(id) && records.get(id) !== "deleted",
      ).length;
      return failedRefreshes + staleRows;
    },
    get unknownCount() {
      return [...records.values()].filter((status) => status === "unconfirmed")
        .length;
    },
    begin,
    complete,
    fail,
    acquire,
    run,
    trackVisible,
  };
}

export type DeletionState = ReturnType<typeof createDeletionState>;

export function provideDeletionState(
  state: DeletionState = createDeletionState(),
) {
  setContext(deletionContext, state);
  return state;
}

export function useDeletionState(): DeletionState | undefined {
  return getContext<DeletionState | undefined>(deletionContext);
}

/** Capture the request-scoped context during component initialization. */
export function recordDeletion(
  id?: string | (() => string),
): Attachment<HTMLElement> {
  const deletion = useDeletionState();
  return (node) => {
    const originalInert = node.hasAttribute("inert");
    const originalDisabled = node.getAttribute("aria-disabled");
    let locked = false;

    function preventInteraction(event: Event) {
      if (!locked) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    const events = [
      "click",
      "dblclick",
      "auxclick",
      "keydown",
      "keyup",
      "pointerdown",
      "contextmenu",
      "input",
      "change",
      "submit",
    ];
    for (const event of events)
      node.addEventListener(event, preventInteraction, true);

    $effect(() => {
      const recordId =
        typeof id === "function" ? id() : (id ?? node.dataset.recordId ?? "");
      return deletion?.trackVisible(recordId);
    });

    $effect(() => {
      const recordId =
        typeof id === "function" ? id() : (id ?? node.dataset.recordId ?? "");
      const status = deletion?.status(recordId);
      locked = deletion?.isLocked(recordId) ?? false;
      if (locked && node.contains(document.activeElement)) {
        node
          .closest<HTMLElement>(
            "[data-deletion-focus-target], section[tabindex='-1']",
          )
          ?.focus({ preventScroll: true });
      }
      node.toggleAttribute("inert", originalInert || locked);
      node.inert = originalInert || locked;
      if (locked) {
        node.setAttribute("aria-disabled", "true");
        if (status) node.dataset.deletionState = status;
        else delete node.dataset.deletionState;
      } else {
        if (originalDisabled === null) node.removeAttribute("aria-disabled");
        else node.setAttribute("aria-disabled", originalDisabled);
        delete node.dataset.deletionState;
      }
    });

    return () => {
      for (const event of events)
        node.removeEventListener(event, preventInteraction, true);
      node.toggleAttribute("inert", originalInert);
      node.inert = originalInert;
      if (originalDisabled === null) node.removeAttribute("aria-disabled");
      else node.setAttribute("aria-disabled", originalDisabled);
      delete node.dataset.deletionState;
    };
  };
}
