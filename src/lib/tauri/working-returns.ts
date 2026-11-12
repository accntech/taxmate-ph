import { invoke } from '@tauri-apps/api/core';
import type { CreatedReturnsData } from '$lib/ebirforms/created-returns';

export function createWorkingReturnsClient(call: typeof invoke = invoke) {
	return {
		load: () => call<CreatedReturnsData | null>('load_working_returns'),
		save: (data: CreatedReturnsData) => call<void>('save_working_returns', { data })
	};
}
