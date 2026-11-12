import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	ebirformsWorkspace as workspace,
	initialProfile
} from '$lib/ebirforms/ebirforms-workspace.svelte';

const { save, load } = vi.hoisted(() => ({ save: vi.fn(), load: vi.fn() }));
vi.mock('$lib/tauri/profile-store', () => ({
	createProfileStoreClient: () => ({ save, load }),
	formatProfileStoreError: (error: Error) => error.message
}));

beforeEach(() => {
	save.mockReset().mockResolvedValue({ path: '/profiles/test.xml' });
	load.mockReset().mockResolvedValue([{ ...initialProfile }]);
	workspace.profiles = [{ ...initialProfile }];
	workspace.profile = { ...initialProfile };
	workspace.selectedProfileId = initialProfile.id;
});

describe('taxpayer profile save validation', () => {
	it('rejects a blank new profile without inserting or saving it', async () => {
		workspace.startNewTaxpayerProfile();
		const before = workspace.profiles.map((profile) => ({ ...profile }));
		await workspace.saveTaxpayerProfile();
		expect(save).not.toHaveBeenCalled();
		expect(workspace.profiles).toEqual(before);
		expect(workspace.selectedProfileId).toBe('');
	});

	it('rejects an invalid update without overwriting the saved profile', async () => {
		workspace.profile.taxpayerName = '   ';
		await workspace.saveTaxpayerProfile();
		expect(save).not.toHaveBeenCalled();
		expect(workspace.profiles[0].taxpayerName).toBe(initialProfile.taxpayerName);
	});

	it.each([
		['incomplete TIN', { tin3: '78' }],
		['letters in TIN', { tin1: '12x' }],
		['all-zero TIN', { tin1: '000', tin2: '000', tin3: '000' }],
		['incomplete branch', { branchCode: '000' }],
		['missing RDO', { rdoCode: '' }],
		['malformed RDO', { rdoCode: '4x0' }],
		['placeholder RDO', { rdoCode: '000' }],
		['unknown RDO', { rdoCode: '999' }],
		['unsupported category', { category: 'X' }],
		['malformed optional email', { email: 'name@' }],
		['malformed optional ZIP', { zipCode: '12345' }]
	])('rejects %s before saving', async (_name, fields) => {
		Object.assign(workspace.profile, fields);
		await workspace.saveTaxpayerProfile();
		expect(save).not.toHaveBeenCalled();
		expect(workspace.profiles).toEqual([initialProfile]);
	});

	it('allows correction and retry after an invalid save', async () => {
		workspace.profile.taxpayerName = '';
		await workspace.saveTaxpayerProfile();
		workspace.profile.taxpayerName = 'Updated taxpayer';
		await workspace.saveTaxpayerProfile();
		expect(save).toHaveBeenCalledTimes(1);
		expect(workspace.profiles[0].taxpayerName).toBe('Updated taxpayer');
	});

	it.each(['17A', '21C', '93B'])('saves packaged alphanumeric RDO %s unchanged', async (rdoCode) => {
		workspace.profile.rdoCode = rdoCode;
		await workspace.saveTaxpayerProfile();
		expect(save).toHaveBeenCalledOnce();
		expect(workspace.profiles[0].rdoCode).toBe(rdoCode);
	});

	it.each(['12345678900001', '123456789000', '123abc4567890000'])(
		'rejects raw TIN %s instead of silently truncating it',
		async (rawTin) => {
			await workspace.saveTaxpayerProfile(rawTin);
			expect(save).not.toHaveBeenCalled();
			expect(workspace.profiles).toEqual([initialProfile]);
		}
	);
	it('allows a formatted TIN and a government profile with branch 0000', async () => {
		workspace.profile.category = 'G';
		workspace.profile.email = '';
		await workspace.saveTaxpayerProfile('123-456-789-0000');
		expect(save).toHaveBeenCalledTimes(1);
	});

	it('waits for an in-flight profile load before resolving another caller', async () => {
		let release!: (profiles: typeof workspace.profiles) => void;
		load.mockReturnValueOnce(
			new Promise<typeof workspace.profiles>((resolve) => {
				release = resolve;
			})
		);
		const first = workspace.loadTaxpayerProfiles();
		let secondFinished = false;
		const second = workspace.loadTaxpayerProfiles().then(() => {
			secondFinished = true;
		});
		await Promise.resolve();
		const finishedBeforeDisk = secondFinished;
		release([{ ...initialProfile, taxpayerName: 'Loaded taxpayer' }]);
		await Promise.all([first, second]);
		expect(finishedBeforeDisk).toBe(false);
		expect(load).toHaveBeenCalledTimes(1);
		expect(workspace.profiles[0].taxpayerName).toBe('Loaded taxpayer');
	});

	it('keeps a new profile as a draft when disk saving fails', async () => {
		workspace.startNewTaxpayerProfile();
		workspace.profile = { ...initialProfile, id: '', tin1: '987' };
		save.mockRejectedValueOnce(new Error('Disk unavailable'));
		const result = await workspace.saveTaxpayerProfile();
		expect(result).toBe(false);
		expect(workspace.selectedProfileId).toBe('');
		expect(workspace.profiles).toEqual([initialProfile]);
		expect(workspace.profile.tin1).toBe('987');
	});

	it('saves a valid profile with optional fields left blank', async () => {
		await workspace.saveTaxpayerProfile();
		expect(save).toHaveBeenCalledWith(expect.objectContaining({ id: initialProfile.id }));
	});
});
