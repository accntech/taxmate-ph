<script module lang="ts">
  import { glyphs } from "../../icons";

  export type BulkActionsRow = {
    id: string;
    inactive: boolean;
  };

  export type BulkActionsChange<Row extends BulkActionsRow> = {
    ids: string[];
    selectedRows: Row[];
    nextInactive: boolean;
  };
</script>

<script lang="ts" generics="Row extends BulkActionsRow">
  import { SvelteSet } from "svelte/reactivity";
  import { BulkBar, BulkBarAction, BulkBarConfirmDelete } from "../bulk-bar";
  import { useDeletionState } from "../deletion";
  import { toast } from "../toaster";

  type Props = {
    selected: SvelteSet<string>;
    rows: Row[];
    onclear: () => void;
    canUpdateStatus: boolean;
    canDelete: boolean;
    singularNoun: string;
    pluralNoun: string;
    getRowLabel: (row: Row) => string;
    onstatuschange: (change: BulkActionsChange<Row>) => void | Promise<void>;
    ondelete: (
      change: Omit<BulkActionsChange<Row>, "nextInactive">,
    ) => unknown | Promise<unknown>;
    activateLabel?: string;
    deactivateLabel?: string;
    activatingLabel?: string;
    deactivatingLabel?: string;
    deleteDescription?: string;
    destructiveVariant?: "danger" | "destructive-soft";
  };

  let {
    selected,
    rows,
    onclear,
    canUpdateStatus,
    canDelete,
    singularNoun,
    pluralNoun,
    getRowLabel,
    onstatuschange,
    ondelete,
    activateLabel = "Activate",
    deactivateLabel = "Deactivate",
    activatingLabel = "Activating...",
    deactivatingLabel = "Deactivating...",
    deleteDescription,
    destructiveVariant = "danger",
  }: Props = $props();

  let count = $derived(selected.size);
  const deletion = useDeletionState();
  const ownPending = new SvelteSet<string>();
  let ids = $derived([...selected]);
  const lockedSelection = $derived(
    ids.some((id) => ownPending.has(id) || deletion?.isLocked(id)),
  );
  let selectedRows = $derived(rows.filter((row) => selected.has(row.id)));
  let allInactive = $derived(
    selectedRows.length > 0 && selectedRows.every((row) => row.inactive),
  );
  let nextInactive = $derived(!allInactive);
  let statusLabel = $derived(nextInactive ? deactivateLabel : activateLabel);
  let statusPendingLabel = $derived(
    nextInactive ? deactivatingLabel : activatingLabel,
  );
  let statusIcon = $derived(nextInactive ? glyphs.power : glyphs.playCircle);
  let confirmPhrase = $state("");
  let deleteTitle = $state("");
  let deleteTargets = $state.raw<{ ids: string[]; selectedRows: Row[] } | null>(
    null,
  );
  let deleteOpen = $state(false);
  let deleteFocusTarget: HTMLElement | null = null;
  let updatingStatus = $state(false);
  const deleting = $derived(ids.some((id) => ownPending.has(id)));

  async function handleStatusChange() {
    if (
      updatingStatus ||
      deleting ||
      lockedSelection ||
      !canUpdateStatus ||
      count === 0
    )
      return;
    updatingStatus = true;
    try {
      await onstatuschange({ ids, selectedRows, nextInactive });
    } finally {
      updatingStatus = false;
    }
  }

  function openDelete() {
    if (
      deleting ||
      updatingStatus ||
      lockedSelection ||
      !canDelete ||
      count === 0
    )
      return;
    deleteFocusTarget =
      document.activeElement?.closest<HTMLElement>(
        "[data-deletion-focus-target], section[tabindex='-1']",
      ) ?? null;
    deleteTargets = { ids: [...ids], selectedRows: [...selectedRows] };
    confirmPhrase =
      selectedRows.length === 1
        ? getRowLabel(selectedRows[0])
        : `delete ${count} ${pluralNoun}`;
    deleteTitle =
      count === 1
        ? `Delete this ${singularNoun}?`
        : `Delete ${count} ${pluralNoun}?`;
    deleteOpen = true;
  }

  async function handleDelete() {
    const targets = deleteTargets;
    if (!canDelete || !targets || targets.ids.some((id) => ownPending.has(id)))
      return;
    const lease = deletion?.acquire(targets.ids);
    if (deletion && !lease) {
      toast.warning(
        "Another action is already using a selected record. Wait for it to finish.",
      );
      return;
    }
    const focusTarget = deleteFocusTarget;
    for (const id of targets.ids) ownPending.add(id);
    for (const id of targets.ids) selected.delete(id);
    deleteOpen = false;
    queueMicrotask(() => focusTarget?.focus({ preventScroll: true }));
    try {
      if (lease) await lease.run(() => ondelete(targets));
      else await ondelete(targets);
    } catch {
      if (targets.ids.some((id) => deletion?.status(id) === "unconfirmed")) {
        toast.warning(
          "Deletion could not be confirmed. Refresh the page before trying again.",
        );
      } else {
        if (selected.size === 0) {
          for (const id of targets.ids) {
            if (rows.some((row) => row.id === id)) selected.add(id);
          }
        }
        toast.danger(
          `Could not delete ${targets.ids.length === 1 ? singularNoun : pluralNoun}. Try again.`,
        );
      }
    } finally {
      for (const id of targets.ids) ownPending.delete(id);
    }
  }
</script>

<BulkBar {count} {onclear}>
  {#if canUpdateStatus && count > 0}
    <BulkBarAction
      icon={statusIcon}
      label={statusLabel}
      variant={nextInactive && destructiveVariant === "destructive-soft"
        ? destructiveVariant
        : "default"}
      onclick={handleStatusChange}
      disabled={deleting || lockedSelection}
      pending={updatingStatus}
      pendingLabel={statusPendingLabel}
    />
  {/if}
  {#if canDelete && count > 0}
    <BulkBarAction
      icon={glyphs.trash}
      label="Delete"
      variant={destructiveVariant}
      onclick={openDelete}
      disabled={updatingStatus || deleting || lockedSelection}
    />
  {/if}
</BulkBar>

{#if canDelete}
  <BulkBarConfirmDelete
    bind:open={deleteOpen}
    phrase={confirmPhrase}
    title={deleteTitle}
    description={deleteDescription}
    pending={deleting}
    onconfirm={handleDelete}
  />
{/if}
