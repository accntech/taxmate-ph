import { invoke } from '@tauri-apps/api/core';

export type AgentBridgeStatus = {
	enabled: boolean;
	running: boolean;
	error?: string | null;
};

export function getAgentBridgeStatus() {
	return invoke<AgentBridgeStatus>('taxmate_ui_agent_status');
}

export function setAgentBridgeEnabled(enabled: boolean) {
	return invoke<AgentBridgeStatus>('taxmate_ui_agent_set_enabled', { enabled });
}
