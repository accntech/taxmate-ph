import { invoke } from '@tauri-apps/api/core';
import type { CreatedReturnsData, DraftDeletion } from '$lib/ebirforms/created-returns';

export function createWorkingReturnsClient(call: typeof invoke = invoke) {
	return {
		load: () => call<CreatedReturnsData | null>('load_working_returns'),
		save: (data: CreatedReturnsData) => call<void>('save_working_returns', { data }),
		deleteDrafts: (taxpayerId: string, confirmedIds: string[]) =>
			call<DraftDeletion>('delete_draft_working_returns', { taxpayerId, confirmedIds })
	};
}
