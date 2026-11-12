import { beforeEach, describe, expect, it, vi } from 'vitest';

const { load } = vi.hoisted(() => ({ load: vi.fn() }));
vi.mock('$lib/tauri/profile-store', () => ({
	createProfileStoreClient: () => ({ load }),
	formatProfileStoreError: (error: unknown) => error instanceof Error ? error.message : String(error)
}));

let workspace: typeof import('$lib/ebirforms/ebirforms-workspace.svelte').ebirformsWorkspace;
let initialProfile: typeof import('$lib/ebirforms/ebirforms-workspace.svelte').initialProfile;

beforeEach(async () => {
	vi.resetModules();
	load.mockReset();
	({ ebirformsWorkspace: workspace, initialProfile } = await import('$lib/ebirforms/ebirforms-workspace.svelte'));
});

describe('profile loading recovery', () => {
	it('distinguishes initial placeholder data from a successful load', () => {
		expect(workspace.profileLoadState).toBe('idle');
		expect(workspace.hasLoadedProfiles).toBe(false);
		expect(workspace.profileLoadError).toBe('');
	});

	it('reports a plain-language failure separately from diagnostic details', async () => {
		load.mockRejectedValue(new Error("Cannot read properties of undefined (reading 'invoke')"));
		await workspace.loadTaxpayerProfiles();
		expect(workspace.profileLoadState).toBe('error');
		expect(workspace.hasLoadedProfiles).toBe(false);
		expect(workspace.profileLoadError).toBe('Taxpayer profiles could not be loaded. Try again.');
		expect(workspace.profileLoadError).not.toContain('invoke');
		expect(workspace.profileLoadErrorDetails).toContain('invoke');
		expect(workspace.statusMessage).toBe(workspace.profileLoadError);
		expect(workspace.isLoadingProfiles).toBe(false);
	});

	it('allows retry, clears failure during loading, and records successful recovery', async () => {
		load.mockRejectedValueOnce(new Error('Disk unavailable'));
		await workspace.loadTaxpayerProfiles();
		load.mockResolvedValueOnce([{ ...initialProfile, taxpayerName: 'Loaded Taxpayer' }]);
		const retry = workspace.loadTaxpayerProfiles();
		expect(workspace.profileLoadState).toBe('loading');
		expect(workspace.profileLoadError).toBe('');
		await retry;
		expect(workspace.profileLoadState).toBe('loaded');
		expect(workspace.hasLoadedProfiles).toBe(true);
		expect(workspace.profileLoadErrorDetails).toBe('');
		expect(workspace.profiles[0].taxpayerName).toBe('Loaded Taxpayer');
	});

	it('retains previously loaded records and active form edits when a reload fails', async () => {
		const savedProfile = { ...initialProfile, taxpayerName: 'Real Taxpayer' };
		load.mockResolvedValueOnce([savedProfile]);
		await workspace.loadTaxpayerProfiles();
		workspace.formValues['frm1601EQ:txtRemittanceFirstMonth'] = '12.';
		workspace.activeReturnId = 'active-working-copy';
		load.mockRejectedValueOnce(new Error('Read denied'));
		await workspace.loadTaxpayerProfiles();
		expect(workspace.profileLoadState).toBe('error');
		expect(workspace.hasLoadedProfiles).toBe(true);
		expect(workspace.profiles).toEqual([savedProfile]);
		expect(workspace.activeReturnId).toBe('active-working-copy');
		expect(workspace.formValues['frm1601EQ:txtRemittanceFirstMonth']).toBe('12.');
	});

	it('treats an empty successful load as loaded and deduplicates concurrent requests', async () => {
		let resolveLoad!: (value: []) => void;
		load.mockReturnValue(new Promise<[]>((resolve) => { resolveLoad = resolve; }));
		const first = workspace.loadTaxpayerProfiles();
		const second = workspace.loadTaxpayerProfiles();
		expect(second).toBe(first);
		await Promise.resolve();
		expect(load).toHaveBeenCalledOnce();
		resolveLoad([]);
		await first;
		expect(workspace.profileLoadState).toBe('loaded');
		expect(workspace.hasLoadedProfiles).toBe(true);
		expect(workspace.profiles).toEqual([]);
		expect(workspace.selectedProfileId).toBe('');
	});
});
