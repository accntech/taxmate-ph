<script lang="ts">
 import { isTauri } from '@tauri-apps/api/core';
 import { createReturnHistoryClient, type SubmittedReturn } from '$lib/tauri/return-history';
 import { Button, Input } from '$lib/components/ui';
 let { revision = 0, taxpayerId }: { revision?: number; taxpayerId?: string } = $props();
 let rows = $state<SubmittedReturn[]>([]);
 let loading = $state(true);
 let error = $state('');
 let query = $state('');
 let requestId = 0;
 const filtered = $derived(rows.filter(row => (!taxpayerId || row.tin.replace(/\D/g, '') === taxpayerId) && `${row.taxpayerName} ${row.tin} ${row.formCode} ${row.returnPeriod}`.toLowerCase().includes(query.toLowerCase())));
 async function load() {
  const id = ++requestId;
  loading = true;
  error = '';
  try {
   const result = await createReturnHistoryClient().load();
   if (id === requestId) rows = result;
  } catch (cause) {
   if (id === requestId) error = !isTauri() ? 'Open the desktop app to view submissions saved on this device.' : cause instanceof Error ? cause.message : String(cause);
  } finally {
   if (id === requestId) loading = false;
  }
 }
 $effect(() => { void revision; void load(); });
 function date(timestamp: number) {
  return new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Manila' }).format(timestamp);
 }
 function amount(value: string) {
  if (!value.trim()) return '—';
  const numeric = Number(value.replaceAll(',', ''));
  return Number.isFinite(numeric) ? new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(numeric) : value;
 }
</script>

<section aria-label="Submitted returns" class="grid min-w-0 gap-4">
 <div class="flex flex-wrap items-end justify-between gap-3">
  <div>
   <h2 class="text-base font-semibold text-fg">Submitted returns</h2>
   <p class="mt-1 text-xs text-fg-muted">{taxpayerId ? 'Selected taxpayer' : 'All taxpayers'} · successful uploads saved on this device. Drafts and dry runs are excluded.</p>
  </div>
  <div class="flex items-end gap-2">
   <Input label="Search returns" placeholder="Taxpayer, TIN, form or period" bind:value={query} />
   <Button variant="secondary" disabled={loading} onclick={() => void load()}>Refresh</Button>
  </div>
 </div>
 {#if error}
  <div role="alert" class="rounded-md border border-danger/30 bg-danger-soft p-4 text-sm text-fg">
   <p>Could not load submitted returns: {error}</p>
   <Button class="mt-2" variant="secondary" onclick={() => void load()}>Try again</Button>
  </div>
 {:else if loading}
  <p role="status" class="p-6 text-center text-sm text-fg-muted">Loading submitted returns…</p>
 {:else if !filtered.length}
  <div class="rounded-md border border-dashed border-border px-4 py-10 text-center">
   <p class="text-sm font-medium text-fg">{query ? 'No matching returns' : 'No submitted returns yet'}</p>
   <p class="mt-1 text-xs text-fg-muted">{query ? 'Try another taxpayer, TIN or period.' : 'A return appears here after a successful upload to BIR.'}</p>
  </div>
 {:else}
  <div class="min-w-0 overflow-hidden rounded-md border border-border">
   <table class="history-table w-full text-left text-sm">
    <caption class="sr-only">All successfully uploaded returns saved on this device</caption>
    <thead class="border-b border-border bg-bg-elev-2 text-xs text-fg-muted">
     <tr><th scope="col">Submitted (PHT)</th><th scope="col">Taxpayer</th><th scope="col">Form / period</th><th scope="col">Return type</th><th scope="col" class="text-right">Amount due</th></tr>
    </thead>
    <tbody>
     {#each filtered as row (row.id)}
      <tr class="border-b border-border-soft last:border-0 hover:bg-bg-hover">
       <td data-label="Submitted (PHT)" class="text-xs text-fg-muted">{date(row.submittedAt)}</td>
       <td data-label="Taxpayer"><div><span class="block font-medium text-fg">{row.taxpayerName || 'Unnamed taxpayer'}</span><span class="font-mono text-xs text-fg-muted">{row.tin}</span></div></td>
       <td data-label="Form / period"><div><span class="font-medium text-fg">{row.formCode}</span><span class="ml-2 text-fg-muted">{row.returnPeriod}</span></div></td>
       <td data-label="Return type" class="text-fg-muted">{row.amended ? 'Amended' : 'Original'}</td>
       <td data-label="Amount due" class="text-right font-medium tabular-nums text-fg">{amount(row.amountDue)}</td>
      </tr>
     {/each}
    </tbody>
   </table>
  </div>
  <p class="text-xs text-fg-subtle">{filtered.length} of {rows.length} submitted returns. Upload success does not replace a BIR acknowledgment. Imported legacy dates reflect the saved file’s modification time.</p>
 {/if}
</section>

<style>
 .history-table th, .history-table td { padding: .65rem .85rem; vertical-align: middle; overflow-wrap: anywhere; }
 @media (max-width: 767px) {
  .history-table, .history-table tbody, .history-table tr, .history-table td { display: block; }
  .history-table thead { display: none; }
  .history-table tr { padding: .65rem; }
  .history-table td { display: grid; grid-template-columns: 7.5rem minmax(0, 1fr); gap: .5rem; padding: .35rem; text-align: left; }
  .history-table td::before { content: attr(data-label); font-size: .75rem; font-weight: 400; color: var(--fg-muted); }
 }
</style>
