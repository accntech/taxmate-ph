import { beforeEach, describe, expect, it, vi } from 'vitest';
const { submit } = vi.hoisted(() => ({ submit: vi.fn() }));
vi.mock('$lib/tauri/submission', () => ({ createSubmissionClient: () => submit, formatSubmissionError: String }));
import { ebirformsWorkspace as workspace, initialProfile } from '$lib/ebirforms/ebirforms-workspace.svelte';
import { getFormDefinition } from '$lib/forms';
import { getManagedTaxpayerValues, getReturnEmail } from '$lib/forms/form-runtime';

beforeEach(async () => {
 const data = new Map<string, string>();
 vi.stubGlobal('localStorage', { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => data.set(key, value) });
 workspace.profiles = [{ ...initialProfile, address: 'Test street', zipCode: '1000', contactNumber: '1234567' }];
 workspace.profile = workspace.profiles[0];
 workspace.selectedProfileId = initialProfile.id;
 workspace.activeReturnId = null;
 workspace.isSavingDraft = false;
 workspace.isSubmitting = false;
 await workspace.loadCreatedReturns();
 submit.mockReset();
});

describe('withholding return lifecycle', () => {
 it('creates and saves a monthly remittance with its own identity', async () => {
  expect(getFormDefinition('0619E')).toBeDefined();
  const id = workspace.createReturn(initialProfile.id, '0619E');
  expect(id).toBeTruthy();
  workspace.updateFormValues({ 'frm0619E:txtYear': '2026', 'frm0619E:txtMonth': '01', 'frm0619E:txtTax14': '10000', 'frm0619E:txtTax15': '2000', 'frm0619E:txtTax17A': '300' });
  expect(await workspace.saveActiveReturn()).toBe(true);
  const saved = workspace.createdReturns.find(record => record.id === id)!;
  expect(saved.formCode).toBe('0619E');
  expect(saved.returnPeriod).toBe('202601');
  expect(saved.values['frm0619E:txtTax18']).toBe('8300.00');
  expect(saved.values['frm1601EQ:txtYear']).toBeUndefined();
  expect(workspace.returnFilename).toContain('0619E');
  workspace.createReturn(initialProfile.id, '1601EQ');
  expect(workspace.openReturn(id!)).toBe(true);
  expect(workspace.selectedForm?.code).toBe('0619E');
  expect(workspace.formValues['frm0619E:txtTax18']).toBe('8300.00');
 });
 it('allows an unfinished draft without finalizing invalid values', async () => {
  expect(workspace.createReturn(initialProfile.id, '0619F')).toBeTruthy();
  workspace.updateFormValues({ 'frm0619F:txtYear': '', 'frm0619F:txtTax14': '12.' });
  expect(await workspace.saveActiveReturn()).toBe(true);
  expect(workspace.formValues['frm0619F:txtTax14']).toBe('12.');
  expect(workspace.validateReturn()).toBe(false);
  await workspace.submitCurrentReturn();
  expect(submit).not.toHaveBeenCalled();
 });
 it('forces an explicitly simulated submission and persists its status', async () => {
  const id = workspace.createReturn(initialProfile.id, '1601EQ');
  expect(id).toBeTruthy();
  workspace.updateFormValues({ 'frm1601EQ:txtYear': '2026', 'frm1601EQ:optTaxesWithheld': 'N' });
  await workspace.saveActiveReturn();
  submit.mockResolvedValue({status:'simulated',finalFlag:'2',savePath:'mock.xml',sendPath:'',message:'Mock submission saved. Nothing sent to BIR.'});
  workspace.submissionMode = 'legacy_sftp';
  await workspace.submitCurrentReturn();
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({ mode: 'mock', fetchDispatcher: false, formCode:'1601EQ' }));
  expect(workspace.createdReturns.find(record => record.id === id)?.status).toBe('Simulated');
  expect(workspace.historyRevision).toBe(0);
 });
});
it('refreshes profile-owned business and classification when reopening a saved return', async () => {
 const id = workspace.createReturn(initialProfile.id, '0605')!;
 await workspace.saveActiveReturn();
 workspace.profiles = workspace.profiles.map(profile => ({ ...profile, lineOfBusiness:'Professional services', taxpayerClassification:'I' as const }));
 expect(workspace.openReturn(id)).toBe(true);
 expect(workspace.formValues['frm0605:txtLineBus']).toBe('Professional services');
 expect(workspace.formValues['frm0605:txtClassification']).toBe('I');
});
it('refreshes corrected profile address and contact details when reopening a draft', async () => {
 const profile = { ...workspace.profiles[0], address: '', contactNumber: '' };
 workspace.profiles = [profile];
 workspace.profile = profile;
 const id = workspace.createReturn(profile.id, '0619E')!;
 await workspace.saveActiveReturn();
 workspace.profiles = [{ ...profile, address: 'Corrected registered address', contactNumber: '09171234567' }];
 expect(workspace.openReturn(id)).toBe(true);
 expect(workspace.formValues['frm0619E:txtAddress']).toBe('Corrected registered address');
 expect(workspace.formValues['frm0619E:txtTelNum']).toBe('09171234567');
});
it('keeps final and simulated taxpayer snapshots unchanged when deriving profile refresh values', () => {
 const changedProfile = { ...workspace.profiles[0], lineOfBusiness: 'New business', taxpayerClassification: 'I' as const };
 expect(getManagedTaxpayerValues('0605', changedProfile, 'Final')).toEqual({});
 expect(getManagedTaxpayerValues('0605', changedProfile, 'Simulated')).toEqual({});
 expect(getManagedTaxpayerValues('1601EQ', changedProfile, 'Draft')).toEqual({});
});
it('uses the saved form email consistently instead of a subsequently changed profile email', () => {
 const changedProfile = { ...workspace.profiles[0], email: 'new@example.com' };
 expect(getReturnEmail('0619E', { 'frm0619E:txtEmail': 'saved@example.com' }, changedProfile)).toBe('saved@example.com');
 expect(getReturnEmail('0619E', { 'frm0619E:txtEmail': '' }, changedProfile)).toBe('');
 expect(getReturnEmail('1601EQ', { txtEmail: 'eq@example.com' }, changedProfile)).toBe('eq@example.com');
 expect(getReturnEmail('1601EQ', { txtEmail: '' }, changedProfile)).toBe('');
 expect(getReturnEmail('unsupported-legacy', {}, changedProfile)).toBe('new@example.com');
});
