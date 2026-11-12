import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ebirformsWorkspace as workspace, initialProfile } from '$lib/ebirforms/ebirforms-workspace.svelte';
import { loadCreatedReturnsData } from '$lib/ebirforms/created-returns';

const key = 'ebirforms-created-returns-v1';
let saved: Map<string, string>;
beforeEach(async () => {
	saved = new Map();
	vi.stubGlobal('localStorage', {
		getItem: (key: string) => saved.get(key) ?? null,
		setItem: (key: string, value: string) => saved.set(key, value)
	});
	workspace.isSubmitting = false;
	workspace.isSavingDraft = false;
	workspace.profiles = [{ ...initialProfile }];
	workspace.selectedProfileId = initialProfile.id;
	workspace.profile = { ...initialProfile };
	workspace.activeReturnId = null;
	await workspace.loadCreatedReturns();
});

describe('saved form archive and deletion', () => {
	it('archives and restores a saved form across reloads without changing its filing status', async () => {
		const id = workspace.createReturn(initialProfile.id, '1601EQ')!;
		await workspace.saveActiveReturn();
		workspace.finalFlag = '1';
		await workspace.saveActiveReturn('Final');
		expect(typeof workspace.archiveReturn).toBe('function');
		expect(await workspace.archiveReturn(id)).toBe(true);
		await workspace.loadCreatedReturns();
		expect(workspace.createdReturns[0]).toMatchObject({ id, archived: true, status: 'Final', finalFlag: '1' });
		expect(await workspace.restoreReturn(id)).toBe(true);
		await workspace.loadCreatedReturns();
		expect(workspace.createdReturns[0]).toMatchObject({ id, archived: false, status: 'Final', finalFlag: '1' });
	});
	it('deletes only the selected working copy and clears its active editor state', async () => {
		const otherId = workspace.createReturn(initialProfile.id, '1601EQ')!;
		await workspace.saveActiveReturn();
		const id = workspace.createReturn(initialProfile.id, '1601EQ')!;
		await workspace.saveActiveReturn();
		workspace.finalFlag = '1';
		workspace.validationErrors = { year: 'Invalid' };
		workspace.importBuffer = 'old data';
		workspace.submissionReceipt = { status: 'submitted', finalFlag: '1', message: 'Uploaded', savePath: '', sendPath: '' };
		expect(typeof workspace.deleteReturn).toBe('function');
		expect(await workspace.deleteReturn(id)).toBe(true);
		expect(workspace.activeReturnId).toBeNull();
		expect(workspace.finalFlag).toBe('0');
		expect(workspace.validationErrors).toEqual({});
		expect(workspace.importBuffer).toBe('');
		expect(workspace.submissionReceipt).toBeNull();
		await workspace.loadCreatedReturns();
		expect(workspace.createdReturns.map(record => record.id)).toEqual([otherId]);
	});
	it('does not clear an editor for another record when deleting a row', async () => {
		const id = workspace.createReturn(initialProfile.id, '1601EQ')!;
		await workspace.saveActiveReturn();
		const otherId = workspace.createReturn(initialProfile.id, '1601EQ')!;
		await workspace.saveActiveReturn();
		expect(typeof workspace.deleteReturn).toBe('function');
		expect(await workspace.deleteReturn(id)).toBe(true);
		expect(workspace.activeReturnId).toBe(otherId);
	});
	it('leaves state and saved data untouched when lifecycle writes fail', async () => {
		const id = workspace.createReturn(initialProfile.id, '1601EQ')!;
		await workspace.saveActiveReturn();
		const before = saved.get(key);
		vi.stubGlobal('localStorage', { getItem: (key: string) => saved.get(key) ?? null, setItem: () => { throw new Error('Disk full'); } });
		expect(typeof workspace.archiveReturn).toBe('function');
		expect(await workspace.archiveReturn(id)).toBe(false);
		expect(await workspace.restoreReturn(id)).toBe(false);
		expect(await workspace.deleteReturn(id)).toBe(false);
		expect(saved.get(key)).toBe(before);
		expect(workspace.createdReturns).toHaveLength(1);
		expect(workspace.createdReturns[0].archived).toBeUndefined();
		expect(workspace.activeReturnId).toBe(id);
		expect(workspace.statusMessage).toContain('Disk full');
	});
	it('rejects missing records and changes while a submission or draft save is running', async () => {
		const id = workspace.createReturn(initialProfile.id, '1601EQ')!;
		await workspace.saveActiveReturn();
		const before = saved.get(key);
		expect(typeof workspace.archiveReturn).toBe('function');
		for (const method of ['archiveReturn', 'restoreReturn', 'deleteReturn'] as const) {
			expect(await workspace[method]('missing')).toBe(false);
			workspace.isSubmitting = true;
			expect(await workspace[method](id)).toBe(false);
			workspace.isSubmitting = false;
			workspace.isSavingDraft = true;
			expect(await workspace[method](id)).toBe(false);
			workspace.isSavingDraft = false;
		}
		expect(saved.get(key)).toBe(before);
	});
	it('does not overwrite corrupt storage after a failed load', async () => {
		const id = workspace.createReturn(initialProfile.id, '1601EQ')!;
		await workspace.saveActiveReturn();
		saved.set(key, '{broken');
		expect(await workspace.loadCreatedReturns()).toBe(false);
		expect(typeof workspace.archiveReturn).toBe('function');
		expect(await workspace.archiveReturn(id)).toBe(false);
		expect(await workspace.restoreReturn(id)).toBe(false);
		expect(await workspace.deleteReturn(id)).toBe(false);
		expect(saved.get(key)).toBe('{broken');
	});
	it('loads legacy v1 records and rejects nonboolean archive metadata', async () => {
		workspace.createReturn(initialProfile.id, '1601EQ');
		await workspace.saveActiveReturn();
		expect(loadCreatedReturnsData().returns[0].archived).toBeUndefined();
		const data = JSON.parse(saved.get(key)!);
		data.returns[0].archived = 'yes';
		saved.set(key, JSON.stringify(data));
		expect(() => loadCreatedReturnsData()).toThrow('Saved form data is invalid');
	});
});
