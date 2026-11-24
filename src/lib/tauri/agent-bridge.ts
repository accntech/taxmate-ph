import { invoke } from '@tauri-apps/api/core';

export type AgentBridgeStatus = {
	enabled: boolean;
	running: boolean;
	mcp_url: string | null;
	error?: string | null;
};

export function getAgentBridgeStatus() {
	return invoke<AgentBridgeStatus>('taxmate_ui_agent_status');
}

export function setAgentBridgeEnabled(enabled: boolean) {
	return invoke<AgentBridgeStatus>('taxmate_ui_agent_set_enabled', { enabled });
}

export function copyAgentAccessToken() {
	return invoke<void>('taxmate_ui_agent_copy_access_token');
}
