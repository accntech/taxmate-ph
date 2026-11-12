import { beforeEach, describe, expect, it, vi } from 'vitest';
const { submit, profileLoad } = vi.hoisted(() => ({ submit: vi.fn(), profileLoad: vi.fn() }));
vi.mock('$lib/tauri/profile-store', () => ({ createProfileStoreClient: () => ({ load: profileLoad }), formatProfileStoreError: (error: unknown) => String(error) }));
vi.mock('$lib/tauri/submission', () => ({ createSubmissionClient: () => submit, formatSubmissionError: (error: unknown) => String(error) }));
import { ebirformsWorkspace as workspace, createInitialFormValues, initialProfile } from '$lib/ebirforms/ebirforms-workspace.svelte';

const other = { ...initialProfile, id: '9876543210000', tin1: '987', tin2: '654', tin3: '321', taxpayerName: 'Other Taxpayer' };
let saved: Map<string, string>;
beforeEach(async () => {
 saved = new Map();
 vi.stubGlobal('localStorage', { getItem: (key: string) => saved.get(key) ?? null, setItem: (key: string, value: string) => saved.set(key, value) });
 submit.mockReset();
 profileLoad.mockResolvedValue([{ ...initialProfile }, other]);
 workspace.profiles = [{ ...initialProfile }, other];
 workspace.profile = { ...initialProfile };
 workspace.selectedProfileId = initialProfile.id;
 workspace.formValues = createInitialFormValues(initialProfile);
 workspace.finalFlag = '0';
 workspace.submissionReceipt = null;
 workspace.isSavingDraft = false;
 workspace.isSubmitting = false;
});

describe('taxpayer scoped return workspace', () => {
 it('clears prior amounts, final status, and receipt when selecting another taxpayer', async () => {
  workspace.formValues['frm1601EQ:txtTotalAmountDue'] = '999.00';
  workspace.finalFlag = '1';
  workspace.submissionReceipt = { status:'submitted', finalFlag:'1', savePath:'', sendPath:'', message:'Uploaded' };
  workspace.selectTaxpayerProfile(other.id);
  expect(workspace.formValues['frm1601EQ:txtTotalAmountDue']).toBe('0.00');
  expect(workspace.finalFlag).toBe('0');
  expect(workspace.submissionReceipt).toBeNull();
 });
 it('creates a distinct persisted draft and reopens its own values', async () => {
  expect(typeof workspace.createReturn).toBe('function');
  await workspace.loadCreatedReturns();
  const first = workspace.createReturn(initialProfile.id, '1601EQ');
  expect(first).toBeTruthy();
  workspace.formValues['frm1601EQ:txtRemittanceFirstMonth'] = '12.';
  expect(await workspace.saveActiveReturn()).toBe(true);
  const second = workspace.createReturn(other.id, '1601EQ');
  expect(await workspace.saveActiveReturn()).toBe(true);
  expect(second).not.toBe(first);
  expect(workspace.formValues['frm1601EQ:txtRemittanceFirstMonth']).toBe('0.00');
  expect(workspace.openReturn(first!)).toBe(true);
  expect(workspace.profile.id).toBe(initialProfile.id);
  expect(workspace.formValues['frm1601EQ:txtRemittanceFirstMonth']).toBe('12.');
  workspace.createdReturns = [];
  await workspace.loadCreatedReturns();
  expect(workspace.createdReturns).toHaveLength(2);
 });
 it('rejects unknown taxpayers and form types without creating records', async () => {
  expect(typeof workspace.createReturn).toBe('function');
  await workspace.loadCreatedReturns();
  expect(workspace.createReturn('unknown', '1601EQ')).toBeNull();
  expect(workspace.createReturn(initialProfile.id, 'unknown')).toBeNull();
  expect(workspace.createdReturns).toHaveLength(0);
  expect(workspace.openReturn('unknown')).toBe(false);
 });
 it('persists archive and restore metadata across reloads', async () => {
  expect(typeof workspace.archiveTaxpayerProfile).toBe('function');
  await workspace.loadCreatedReturns();
  expect(await workspace.archiveTaxpayerProfile(initialProfile.id)).toBe(true);
  workspace.archivedTaxpayerIds = [];
  await workspace.loadCreatedReturns();
  expect(workspace.archivedTaxpayerIds).toContain(initialProfile.id);
  expect(await workspace.restoreTaxpayerProfile(initialProfile.id)).toBe(true);
  await workspace.loadCreatedReturns();
  expect(workspace.archivedTaxpayerIds).not.toContain(initialProfile.id);
 });
 it('does not claim a draft is stored when local storage rejects the write', async () => {
  expect(typeof workspace.createReturn).toBe('function');
  await workspace.loadCreatedReturns();
  vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => { throw new Error('Disk full'); } });
  expect(workspace.createReturn(initialProfile.id, '1601EQ')).toBeTruthy();
  expect(await workspace.saveActiveReturn()).toBe(false);
  expect(workspace.createdReturns).toHaveLength(0);
  expect(workspace.statusMessage).toContain('Disk full');
 });
 it('does not overwrite corrupt storage after a failed load', async () => {
  expect(typeof workspace.loadCreatedReturns).toBe('function');
  saved.set('ebirforms-created-returns-v1', '{broken');
  await workspace.loadCreatedReturns();
  expect(workspace.createReturn(initialProfile.id, '1601EQ')).toBeNull();
  expect(saved.get('ebirforms-created-returns-v1')).toBe('{broken');
 });
});

async function validReturn() {
 const id = workspace.createReturn(initialProfile.id, '1601EQ')!;
 Object.assign(workspace.formValues, {
  'frm1601EQ:txtAddress': 'Test address',
  'frm1601EQ:txtZipCode': '1000',
  'frm1601EQ:txtTelNum': '09171234567',
  'frm1601EQ:txtYear': '2025',
  'frm1601EQ:optTaxesWithheld': 'N'
 });
 await workspace.saveActiveReturn();
 return id;
}

describe('working copy lifecycle', () => {
 it('persists final and resend statuses in the same record', async () => {
  await workspace.loadCreatedReturns();
  const id = await validReturn();
  await workspace.markFinalCopy();
  expect(workspace.createdReturns.find(item => item.id === id)?.status).toBe('Final');
  await workspace.markNeedsResend();
  expect(workspace.createdReturns.find(item => item.id === id)?.status).toBe('For resubmission');
  await workspace.loadCreatedReturns();
  expect(workspace.createdReturns.find(item => item.id === id)?.finalFlag).toBe('2');
 });
 it('records a successful upload but never labels a dry run submitted', async () => {
  await workspace.loadCreatedReturns();
  const id = await validReturn();
  submit.mockResolvedValue({ status:'drafted', finalFlag:'0', message:'Local package', savePath:'', sendPath:'' });
  await workspace.submitCurrentReturn();
  expect(workspace.createdReturns.find(item => item.id === id)?.status).toBe('Draft');
  submit.mockResolvedValue({ status:'submitted', finalFlag:'1', message:'Uploaded', savePath:'', sendPath:'' });
  await workspace.submitCurrentReturn();
  expect(workspace.createdReturns.find(item => item.id === id)?.status).toBe('Submitted');
 });
 it('saves incomplete draft edits before attempting legacy file output', async () => {
  await workspace.loadCreatedReturns();
  const id = workspace.createReturn(initialProfile.id, '1601EQ')!;
  workspace.formValues['frm1601EQ:txtYear'] = '';
  workspace.formValues['frm1601EQ:txtRemittanceFirstMonth'] = '12.';
  submit.mockRejectedValue(new Error('Legacy files unavailable'));
  await workspace.saveDraft();
  workspace.openReturn(id);
  expect(workspace.formValues['frm1601EQ:txtYear']).toBe('');
  expect(workspace.formValues['frm1601EQ:txtRemittanceFirstMonth']).toBe('12.');
 });
});


describe('navigation and in-flight return isolation', () => {
 it('clears sample and active taxpayer state after a successful empty profile load', async () => {
  await workspace.loadCreatedReturns();
  workspace.createReturn(initialProfile.id, '1601EQ');
  profileLoad.mockResolvedValue([]);
  await workspace.loadTaxpayerProfiles();
  expect(workspace.profiles).toEqual([]);
  expect(workspace.selectedProfileId).toBe('');
  expect(workspace.activeReturnId).toBeNull();
  expect(workspace.profile.taxpayerName).toBe('');
 });
 it('keeps return-specific identity fields when selecting and reloading the same taxpayer', async () => {
  await workspace.loadCreatedReturns();
  const id = workspace.createReturn(initialProfile.id, '1601EQ')!;
  workspace.formValues['frm1601EQ:txtAddress'] = 'Return-specific address';
  workspace.formValues['txtEmail'] = 'return@example.com';
  await workspace.saveActiveReturn();
  workspace.selectTaxpayerProfile(initialProfile.id);
  expect(workspace.formValues['frm1601EQ:txtAddress']).toBe('Return-specific address');
  await workspace.loadTaxpayerProfiles();
  expect(workspace.activeReturnId).toBe(id);
  expect(workspace.formValues['txtEmail']).toBe('return@example.com');
 });
 it('persists the uploaded snapshot, not values edited while awaiting the receipt', async () => {
  await workspace.loadCreatedReturns();
  const id = await validReturn();
  let finish!: (value: unknown) => void;
  submit.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  const pending = workspace.submitCurrentReturn();
  workspace.formValues['frm1601EQ:txtAddress'] = 'Changed during upload';
  finish({ status:'submitted', finalFlag:'1', message:'Uploaded', savePath:'', sendPath:'' });
  await pending;
  const uploaded = workspace.createdReturns.find(item => item.id === id)!;
  expect(uploaded.status).toBe('Submitted');
  expect(uploaded.values['frm1601EQ:txtAddress']).toBe('Test address');
  expect(workspace.formValues['frm1601EQ:txtAddress']).toBe('Changed during upload');
  expect(workspace.finalFlag).toBe('0');
 });
 it('updates the submitted return by captured id after navigation to another taxpayer', async () => {
  await workspace.loadCreatedReturns();
  const id = await validReturn();
  let finish!: (value: unknown) => void;
  submit.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  const pending = workspace.submitCurrentReturn();
  workspace.selectTaxpayerProfile(other.id);
  finish({ status:'submitted', finalFlag:'1', message:'Uploaded', savePath:'', sendPath:'' });
  await pending;
  expect(workspace.createdReturns.find(item => item.id === id)?.status).toBe('Submitted');
  expect(workspace.profile.id).toBe(other.id);
  expect(workspace.finalFlag).toBe('0');
  expect(workspace.submissionReceipt).toBeNull();
 });
 it('does not attach a draft output receipt to another taxpayer after navigation', async () => {
  await workspace.loadCreatedReturns();
  workspace.createReturn(initialProfile.id, '1601EQ');
  let finish!: (value: unknown) => void;
  submit.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  const pending = workspace.saveDraft();
  await vi.waitFor(() => expect(submit).toHaveBeenCalled());
  workspace.startNewTaxpayerProfile();
  finish({ status:'drafted', finalFlag:'2', message:'Draft saved', savePath:'', sendPath:'' });
  await pending;
  expect(workspace.finalFlag).toBe('0');
  expect(workspace.submissionReceipt).toBeNull();
 });
});

describe('editing saved return state', () => {
 it('invalidates final status and receipt immediately without changing the saved record', async () => {
  await workspace.loadCreatedReturns();
  const id = await validReturn();
  await workspace.markFinalCopy();
  workspace.submissionReceipt = { status: 'submitted', finalFlag: '1', message: 'Uploaded', savePath: '', sendPath: '' };
  expect(typeof workspace.editFormField).toBe('function');
  workspace.editFormField('frm1601EQ:txtAddress', 'Corrected address');
  expect(workspace.finalFlag).toBe('0');
  expect(workspace.submissionReceipt).toBeNull();
  expect(workspace.hasUnsavedChanges).toBe(true);
  expect(workspace.currentReturnStatus).toBe('Draft');
  expect(workspace.createdReturns.find(item => item.id === id)?.status).toBe('Final');
 });
 it('leaves a final return unchanged when the same value is entered', async () => {
  await workspace.loadCreatedReturns();
  await validReturn();
  await workspace.markFinalCopy();
  expect(typeof workspace.editFormField).toBe('function');
  workspace.editFormField('frm1601EQ:txtAddress', 'Test address');
  expect(workspace.finalFlag).toBe('1');
  expect(workspace.hasUnsavedChanges).toBe(false);
  expect(workspace.currentReturnStatus).toBe('Final');
 });
 it('removes corrected validation errors without requiring another submission', async () => {
  await workspace.loadCreatedReturns();
  await validReturn();
  workspace.formValues['frm1601EQ:txtYear'] = '';
  workspace.validateReturn();
  expect(workspace.validationErrors['frm1601EQ:txtYear']).toBeTruthy();
  expect(typeof workspace.editFormField).toBe('function');
  workspace.editFormField('frm1601EQ:txtYear', '2025');
  expect(workspace.validationErrors['frm1601EQ:txtYear']).toBeUndefined();
 });
 it('refreshes stored totals when saving while retaining unfinished input', async () => {
  await workspace.loadCreatedReturns();
  const id = await validReturn();
  Object.assign(workspace.formValues, {
   'frm1601EQ:optTaxesWithheld': 'Y',
   'frm1601EQ:txtATC13': 'WI120',
   'frm1601EQ:txtTaxBase13': '100000',
   'frm1601EQ:txtRemittanceFirstMonth': '12.'
  });
  expect(await workspace.saveActiveReturn()).toBe(true);
  const stored = workspace.createdReturns.find(item => item.id === id)!;
  expect(stored.values['frm1601EQ:txtTotalTaxesWithheld']).toBe('2000.00');
  expect(stored.values['frm1601EQ:txtRemittanceFirstMonth']).toBe('12.');
  expect(workspace.hasUnsavedChanges).toBe(false);
 });
 it('retains dirty edits when saving the return fails', async () => {
  await workspace.loadCreatedReturns();
  await validReturn();
  expect(typeof workspace.editFormField).toBe('function');
  workspace.editFormField('frm1601EQ:txtAddress', 'Unsaved correction');
  vi.stubGlobal('localStorage', { getItem: (key: string) => saved.get(key) ?? null, setItem: () => { throw new Error('Disk full'); } });
  expect(await workspace.saveActiveReturn()).toBe(false);
  expect(workspace.hasUnsavedChanges).toBe(true);
  expect(workspace.statusMessage).toContain('Disk full');
 });
});
