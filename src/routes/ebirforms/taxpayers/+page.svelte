<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import Menu from "$lib/components/ui/pcsti/menu.svelte";
  import ActionButton from "$lib/components/ui/pcsti/button.svelte";
  import MenuItem from "$lib/components/ui/pcsti/menu-item.svelte";
  import Icon from "$lib/components/ui/pcsti/icon.svelte";
  import { glyphs } from "$lib/components/ui/pcsti/icons";
  import { buildTaxpayerRoute } from "$lib/apps/app-shell";
  import { ebirformsWorkspace as workspace } from "$lib/ebirforms/ebirforms-workspace.svelte";
  import { Badge, Button, ButtonLink, Dialog, Page } from "$lib/components/ui";
  import RecordTable from "$lib/ebirforms/record-table.svelte";
  import { formatTinInput } from "$lib/profiles/profile";
  import {
    createProfileStoreClient,
    formatProfileStoreError,
  } from "$lib/tauri/profile-store";
  import AddCircle from "@solar-icons/svelte/category/ui/Linear/AddCircle.svelte";

  let deleteId = $state("");
  let deleting = $state(false);
  let error = $state("");
  let archivedNotice = $state<{ id: string; name: string } | null>(null);
  const columns = [
    { key: "name", label: "Taxpayer", locked: true },
    { key: "tin", label: "TIN / branch" },
    { key: "rdo", label: "RDO" },
    { key: "category", label: "Category" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
  ];
  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "Active", label: "Active" },
        { value: "Archived", label: "Archived" },
      ],
    },
    {
      key: "category",
      label: "Category",
      options: [
        { value: "Private", label: "Private" },
        { value: "Government", label: "Government" },
      ],
    },
  ];
  const rows = $derived(
    workspace.profiles.map((profile) => ({
      id: profile.id,
      name: profile.taxpayerName || "Unnamed taxpayer",
      tin: formatTinInput(profile),
      rdo: profile.rdoCode || "—",
      category: profile.category === "G" ? "Government" : "Private",
      email: profile.email || "—",
      status: workspace.archivedTaxpayerIds.includes(profile.id)
        ? "Archived"
        : "Active",
    })),
  );
  const deletingProfile = $derived(
    workspace.profiles.find((profile) => profile.id === deleteId),
  );

  onMount(() => {
    workspace.loadCreatedReturns();
    void workspace.loadTaxpayerProfiles();
  });

  function archiveProfile(id: string, name: string) {
    if (workspace.archiveTaxpayerProfile(id)) archivedNotice = { id, name };
  }

  function undoArchive() {
    if (archivedNotice && workspace.restoreTaxpayerProfile(archivedNotice.id))
      archivedNotice = null;
  }

  async function deleteProfile() {
    if (deleting || !deleteId) return;
    deleting = true;
    error = "";
    try {
      await createProfileStoreClient().delete(deleteId);
      workspace.profiles = workspace.profiles.filter(
        (profile) => profile.id !== deleteId,
      );
      if (archivedNotice?.id === deleteId) archivedNotice = null;
      workspace.statusMessage =
        "Taxpayer profile deleted. Saved returns have been kept.";
      deleteId = "";
    } catch (cause) {
      error = formatProfileStoreError(cause);
    } finally {
      deleting = false;
    }
  }
</script>

<svelte:head><title>eBIRForms</title></svelte:head>
<Page size="full">
  <header class="flex flex-wrap items-center justify-between gap-4 py-2">
    <div>
      <h1 class="font-sans text-2xl font-semibold tracking-tight">eBIRForms</h1>
      <p class="mt-1 text-sm text-fg-muted">
        Manage taxpayer profiles and tax returns. Select a taxpayer to open their tax returns.
      </p>
      {#if workspace.profileLoadState === "loaded"}
        <p class="mt-1 text-xs text-fg-subtle">
          {workspace.profiles.length} saved {workspace.profiles.length === 1
            ? "taxpayer"
            : "taxpayers"}
        </p>
      {/if}
    </div>
    <ButtonLink href="/ebirforms/taxpayers/new"
      ><AddCircle size={18} color="currentColor" />New taxpayer</ButtonLink
    >
  </header>

  {#if workspace.profileLoadState === "error"}
    <section
      aria-labelledby="load-error-title"
      class="rounded-panel border border-danger/30 bg-bg-elev p-5"
    >
      <div role="alert">
        <h2 id="load-error-title" class="text-base font-semibold">
          Could not load taxpayers
        </h2>
        <p class="mt-2 text-sm text-fg-muted">{workspace.profileLoadError}</p>
        <p class="mt-1 text-sm text-fg-muted">
          {workspace.hasLoadedProfiles
            ? "Previously loaded taxpayers are hidden until their saved records can be checked."
            : "No saved taxpayer records have been loaded."}
        </p>
      </div>
      <Button class="mt-4" onclick={() => void workspace.loadTaxpayerProfiles()}
        >Retry</Button
      >
      {#if workspace.profileLoadErrorDetails}
        <details class="mt-4 text-xs text-fg-muted">
          <summary class="cursor-pointer">Technical details</summary>
          <p class="mt-2 break-words font-mono">
            {workspace.profileLoadErrorDetails}
          </p>
        </details>
      {/if}
    </section>
  {:else if workspace.profileLoadState !== "loaded"}
    <p
      role="status"
      class="rounded-panel border border-border bg-bg-elev p-8 text-sm text-fg-muted"
    >
      Loading taxpayers…
    </p>
  {:else}
    {#if archivedNotice}
      <div
        class="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-bg-elev px-4 py-3"
      >
        <p role="status" class="text-sm">
          {archivedNotice.name} archived. Hidden from Active taxpayers; saved forms
          retained.
        </p>
        <Button variant="secondary" size="sm" onclick={undoArchive}
          >Undo archive</Button
        >
      </div>
    {/if}
    <RecordTable
      {rows}
      {columns}
      {filters}
      label="Taxpayers"
      stateKey="taxpayers"
      identifierKeys={["tin"]}
      searchPlaceholder="Search name or TIN"
      initialFilters={{ status: ["Active"] }}
      emptyMessage="No saved taxpayers yet. Choose New taxpayer to begin."
    >
      {#snippet cell(row, key)}
        {#if key === "name"}
          <a
            class="font-medium text-fg underline-offset-4 hover:text-accent hover:underline focus-visible:underline"
            href={resolve("/ebirforms/taxpayers/[id]/forms", { id: row.id })}
            >{row.name}</a
          >
        {:else if key === "status"}
          <Badge
            size="sm"
            tone={row.status === "Active" ? "success" : "neutral"}
            >{row.status}</Badge
          >
        {:else if key === "tin"}
          <span class="whitespace-nowrap font-mono text-xs">{row.tin}</span>
        {:else}
          <span class="text-fg-muted">{row[key]}</span>
        {/if}
      {/snippet}
      {#snippet actions(row)}
        <ActionButton
          href={`${buildTaxpayerRoute(row.id)}/edit`}
          size="compact"
          variant="outlined"
          aria-label={`Edit profile for ${row.name}`}
        >
          <span class="action-icon"><Icon icon={glyphs.pencil} /></span>Edit
        </ActionButton>
        <Menu
          label={`More actions for ${row.name}`}
          tooltip="More actions"
          align="right"
          triggerClass="taxpayer-actions-trigger"
          panelClass="taxpayer-actions-panel"
        >
          {#snippet trigger()}<span class="action-icon"
              ><Icon icon={glyphs.more} /></span
            >{/snippet}
          {#snippet content({ close })}
            <p class="action-heading">{row.name}</p>
            {#if row.status === "Archived"}
              <MenuItem
                variant="ghost"
                size="compact"
                class="taxpayer-action"
                onSelect={() => {
                  close();
                  workspace.restoreTaxpayerProfile(row.id);
                }}
                ><span class="action-icon"><Icon icon={glyphs.refresh} /></span
                >Restore taxpayer</MenuItem
              >
            {:else}
              <MenuItem
                variant="ghost"
                size="compact"
                class="taxpayer-action"
                onSelect={() => {
                  close();
                  archiveProfile(row.id, String(row.name));
                }}
                ><span class="action-icon"><Icon icon={glyphs.folder} /></span
                >Archive taxpayer</MenuItem
              >
            {/if}
            <div class="action-separator" role="separator"></div>
            <MenuItem
              variant="destructive-ghost"
              size="compact"
              class="taxpayer-action"
              onSelect={() => {
                close();
                deleteId = row.id;
                error = "";
              }}
              ><span class="action-icon"><Icon icon={glyphs.trash} /></span
              >Delete taxpayer…</MenuItem
            >
          {/snippet}
        </Menu>
      {/snippet}
    </RecordTable>
    <p class="text-xs text-fg-muted" role="status" aria-live="polite">
      {workspace.statusMessage}
    </p>
  {/if}
</Page>
<Dialog
  open={!!deleteId}
  onOpenChange={(open) => {
    if (!open && !deleting) deleteId = "";
  }}
  title="Delete taxpayer?"
  description={`Delete the saved profile for ${deletingProfile?.taxpayerName || "this taxpayer"}? This cannot be undone. Saved returns will be kept.`}
  closedByBackdrop={!deleting}
  closedByEscape={!deleting}
>
  {#if error}<p role="alert" class="text-sm text-danger">{error}</p>{/if}
  {#snippet footer()}
    <Button
      variant="secondary"
      disabled={deleting}
      onclick={() => (deleteId = "")}>Cancel</Button
    >
    <Button
      variant="danger"
      disabled={deleting}
      onclick={() => void deleteProfile()}
      >{deleting ? "Deleting…" : "Delete taxpayer"}</Button
    >
  {/snippet}
</Dialog>

<style>
  /* Menu item dimensions follow PCSTI list-columns-menu/index.styles.ts. */
  :global(.taxpayer-actions-trigger) {
    min-width: 1.875rem;
    min-height: 1.875rem;
    padding: 0.375rem;
    background: var(--bg);
    color: var(--fg-muted);
  }
  :global(.taxpayer-actions-panel) {
    min-width: 12.5rem;
    max-width: calc(100vw - 1rem);
  }
  .action-icon {
    display: block;
    flex: none;
    width: 1rem;
    height: 1rem;
  }
  .action-heading {
    max-width: 15rem;
    padding: 0.375rem 0.625rem;
    color: var(--fg-subtle);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    overflow-wrap: anywhere;
  }
  :global(.taxpayer-action) {
    width: 100%;
    min-height: 2rem;
    justify-content: flex-start;
    gap: 0.5rem;
    border-radius: 0.25rem;
    padding: 0.375rem 0.625rem;
    font-size: 12.5px;
    font-weight: 400;
  }
  :global(.taxpayer-action.destructive) {
    color: var(--danger);
  }
  .action-separator {
    height: 1px;
    margin: 0.25rem 0;
    background: var(--border-soft);
  }
</style>
