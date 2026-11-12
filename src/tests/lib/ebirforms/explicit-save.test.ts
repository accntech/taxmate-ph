import { beforeEach, expect, it, vi } from 'vitest';
import { ebirformsWorkspace as workspace, initialProfile } from '$lib/ebirforms/ebirforms-workspace.svelte';

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
