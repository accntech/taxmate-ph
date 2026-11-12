import { expect, it, vi } from 'vitest';
import { createWorkingReturnsClient } from '$lib/tauri/working-returns';
it('preserves an absent database snapshot for migration and saves exact values', async () => {
    const call = vi.fn().mockResolvedValue(null);
    const client = createWorkingReturnsClient(call);
    await expect(client.load()).resolves.toBeNull();
    const data = { version: 1 as const, returns: [], archivedTaxpayerIds: ['archived'] };
    await client.save(data);
    expect(call.mock.calls).toEqual([['load_working_returns'], ['save_working_returns', { data }]]);
});
it('propagates native save failure so the caller retains dirty edits', async () => {
    const client = createWorkingReturnsClient(vi.fn().mockRejectedValue(new Error('disk full')));
    await expect(client.save({ version: 1, returns: [], archivedTaxpayerIds: [] })).rejects.toThrow('disk full');
});
