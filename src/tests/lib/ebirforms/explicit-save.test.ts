import { beforeEach, expect, it, vi } from 'vitest';
import { ebirformsWorkspace as workspace, initialProfile } from '$lib/ebirforms/ebirforms-workspace.svelte';
import { parseLegacyXml } from '$lib/legacy/xml';

const key = 'ebirforms-created-returns-v1';
let saved: Map<string, string>;
let write: ReturnType<typeof vi.fn>;
beforeEach(async () => {
 saved = new Map();
 write = vi.fn((key: string, value: string) => { saved.set(key, value); });
 vi.stubGlobal('localStorage', { getItem: (key: string) => saved.get(key) ?? null, setItem: write });
 workspace.isSavingDraft = false;
 workspace.isSubmitting = false;
 workspace.activeReturnId = null;
 workspace.profiles = [{ ...initialProfile }];
 workspace.selectedProfileId = initialProfile.id;
 workspace.profile = { ...initialProfile };
 await workspace.loadCreatedReturns();
});

it('keeps a new form in memory until Save creates it, then updates the same record', async () => {
 const id = workspace.createReturn(initialProfile.id, '1601EQ');
 expect(id).toBeTruthy();
 expect(write).not.toHaveBeenCalled();
 expect(workspace.createdReturns).toHaveLength(0);
 expect(workspace.hasUnsavedChanges).toBe(true);
 workspace.editFormField('frm1601EQ:txtYear', '2025');
 expect(await workspace.saveActiveReturn()).toBe(true);
 expect(workspace.createdReturns).toHaveLength(1);
 workspace.editFormField('frm1601EQ:txtYear', '2024');
 expect(await workspace.saveActiveReturn()).toBe(true);
 const records = JSON.parse(saved.get(key)!).returns;
 expect(records).toHaveLength(1);
 expect(records[0]).toMatchObject({ id, values: { 'frm1601EQ:txtYear': '2024' } });
});

it('preserves 1701 eligibility amounts through draft save and reopen', async () => {
 const id = workspace.createReturn(initialProfile.id, '1701v2018')!;
 const sales = 'frm1701:txtPg3IShed3_26A';
 const otherIncome = 'frm1701:txtPg3IShed3_27A';
 workspace.updateFormValues({
  'frm1701:txtPg1I1Year': '2025',
  'frm1701:rdoPg1I7ATC': 'II015',
  [sales]: '2900000.29',
  [otherIncome]: '99999.72'
 });
 expect(await workspace.saveActiveReturn('Draft')).toBe(true);
 expect(workspace.openReturn(id)).toBe(true);
 expect(workspace.formValues[sales]).toBe('2900000.29');
 expect(workspace.formValues[otherIncome]).toBe('99999.72');
 await workspace.markFinalCopy();
 expect(workspace.validationErrors[sales]).toEqual(expect.stringMatching(/3,000,000/));
 expect(workspace.currentReturnStatus).toBe('Draft');
});

it('keeps exact-boundary 1701 eligibility stable when validating twice and rounds the filing XML', () => {
 workspace.profiles = [{
  ...initialProfile, address: '123 Example Street', zipCode: '1000',
  civilStatus: 'Single', taxpayerType: 'single-proprietor'
 }];
 workspace.createReturn(initialProfile.id, '1701v2018');
 const sales = 'frm1701:txtPg3IShed3_26A';
 const otherIncome = 'frm1701:txtPg3IShed3_27A';
 workspace.updateFormValues({
  'frm1701:txtPg1I1Year': '2025',
  'frm1701:txtPg1I10BirthDate': '01/01/1987',
  'frm1701:txtPg1I12Citizenship': 'Filipino',
  'frm1701:rdoPg1I6TaxpayerTypeS': 'Y',
  'frm1701:rdoPg1I7ATC': 'II015',
  'frm1701:rdoPg1I19IncomeExempt': 'No',
  'frm1701:rdoPg1I20IncomeSpecial': 'No',
  [sales]: '2900000.50',
  [otherIncome]: '99999.50'
 });
 workspace.validateReturn();
 expect(workspace.validationErrors).toEqual({});
 expect(workspace.validateReturn()).toBe(true);
 expect(workspace.formValues[sales]).toBe('2900000.50');
 expect(parseLegacyXml(workspace.generatedXml)[sales]).toBe('2900001');
});

it('retains an unsaved new form for retry when Save fails', async () => {
 const id = workspace.createReturn(initialProfile.id, '1601EQ');
 workspace.editFormField('frm1601EQ:txtYear', '2025');
 write.mockImplementationOnce(() => { throw new Error('Disk full'); });
 expect(await workspace.saveActiveReturn()).toBe(false);
 expect(saved.has(key)).toBe(false);
 expect(workspace.createdReturns).toHaveLength(0);
 expect(workspace.activeReturnId).toBe(id);
 expect(workspace.formValues['frm1601EQ:txtYear']).toBe('2025');
 expect(workspace.statusMessage).toContain('Disk full');
 expect(await workspace.saveActiveReturn()).toBe(true);
 expect(workspace.createdReturns).toHaveLength(1);
});


it('discards a new form without saving and prevents reopening it', async () => {
 const id = workspace.createReturn(initialProfile.id, '1601EQ')!;
 workspace.discardReturnChanges();
 expect(write).not.toHaveBeenCalled();
 expect(workspace.createdReturns).toHaveLength(0);
 expect(workspace.activeReturnId).toBeNull();
 expect(workspace.statusMessage).toBe('Unsaved form discarded.');
 expect(workspace.openReturn(id)).toBe(false);
});

it('discards edits to an existing form without writing storage', async () => {
 const id = workspace.createReturn(initialProfile.id, '1601EQ')!;
 await workspace.saveActiveReturn();
 const before = saved.get(key);
 write.mockClear();
 workspace.editFormField('frm1601EQ:txtYear', '2025');
 workspace.discardReturnChanges();
 expect(write).not.toHaveBeenCalled();
 expect(saved.get(key)).toBe(before);
 expect(workspace.activeReturnId).toBe(id);
 expect(workspace.formValues['frm1601EQ:txtYear']).toBe('2026');
});
