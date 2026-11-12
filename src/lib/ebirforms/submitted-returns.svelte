<script lang="ts">
	import * as stylex from '@stylexjs/stylex';
	import { submittedReturns } from './submitted-returns.styles';
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

<section aria-label="Submitted returns" class={stylex.attrs(submittedReturns.root).class}>
 <div class={stylex.attrs(submittedReturns.header).class}>
  <div>
   <h2 class={stylex.attrs(submittedReturns.heading).class}>Submitted returns</h2>
   <p class={stylex.attrs(submittedReturns.description).class}>{taxpayerId ? 'Selected taxpayer' : 'All taxpayers'} · successful uploads saved on this device. Drafts and dry runs are excluded.</p>
  </div>
  <div class={stylex.attrs(submittedReturns.search).class}>
   <Input label="Search returns" placeholder="Taxpayer, TIN, form or period" bind:value={query} />
   <Button variant="secondary" disabled={loading} onclick={() => void load()}>Refresh</Button>
  </div>
 </div>
 {#if error}
  <div role="alert" class={stylex.attrs(submittedReturns.error).class}>
   <p>Could not load submitted returns: {error}</p>
   <Button class={stylex.attrs(submittedReturns.retry).class} variant="secondary" onclick={() => void load()}>Try again</Button>
  </div>
 {:else if loading}
  <p role="status" class={stylex.attrs(submittedReturns.loading).class}>Loading submitted returns…</p>
 {:else if !filtered.length}
  <div class={stylex.attrs(submittedReturns.empty).class}>
   <p class={stylex.attrs(submittedReturns.emptyHeading).class}>{query ? 'No matching returns' : 'No submitted returns yet'}</p>
   <p class={stylex.attrs(submittedReturns.description).class}>{query ? 'Try another taxpayer, TIN or period.' : 'A return appears here after a successful upload to BIR.'}</p>
  </div>
 {:else}
  <div class={stylex.attrs(submittedReturns.tableFrame).class}>
   <table class={['history-table', stylex.attrs(submittedReturns.table).class]}>
    <caption class={stylex.attrs(submittedReturns.caption).class}>All successfully uploaded returns saved on this device</caption>
    <thead class={stylex.attrs(submittedReturns.tableHeading).class}>
     <tr><th scope="col">Submitted (PHT)</th><th scope="col">Taxpayer</th><th scope="col">Form / period</th><th scope="col">Return type</th><th scope="col" class={stylex.attrs(submittedReturns.amountHeading).class}>Amount due</th></tr>
    </thead>
    <tbody>
     {#each filtered as row (row.id)}
      <tr class={stylex.attrs(submittedReturns.row).class}>
       <td data-label="Submitted (PHT)" class={stylex.attrs(submittedReturns.date).class}>{date(row.submittedAt)}</td>
       <td data-label="Taxpayer"><div><span class={stylex.attrs(submittedReturns.taxpayer).class}>{row.taxpayerName || 'Unnamed taxpayer'}</span><span class={stylex.attrs(submittedReturns.tin).class}>{row.tin}</span></div></td>
       <td data-label="Form / period"><div><span class={stylex.attrs(submittedReturns.formCode).class}>{row.formCode}</span><span class={stylex.attrs(submittedReturns.period).class}>{row.returnPeriod}</span></div></td>
       <td data-label="Return type" class={stylex.attrs(submittedReturns.returnType).class}>{row.amended ? 'Amended' : 'Original'}</td>
       <td data-label="Amount due" class={stylex.attrs(submittedReturns.amount).class}>{amount(row.amountDue)}</td>
      </tr>
     {/each}
    </tbody>
   </table>
  </div>
  <p class={stylex.attrs(submittedReturns.disclaimer).class}>{filtered.length} of {rows.length} submitted returns. Upload success does not replace a BIR acknowledgment. Imported legacy dates reflect the saved file’s modification time.</p>
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
