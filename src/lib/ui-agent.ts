import { goto } from '$app/navigation';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { createAgent } from '@ui-sdk/svelte/agent';
import { tick } from 'svelte';
import { getAgentBridgeStatus } from '$lib/tauri/agent-bridge';
import { normalizeCurrencyInput } from '$lib/components/ui/currency-input/currency';

type Request =
	| { method: 'query'; text: string; offset?: number }
	| { method: 'act'; target: string; action: string; args?: Record<string, unknown> };

type Reply = { ok: true; result: unknown } | { ok: false; error: string };

type DraftControl = {
	target: string;
	formCode: string;
	returnPeriod: string;
	updatedAt: number;
	amountDue?: string;
	href: string;
};

type AgentAction =
	| { target: string; press: () => Reply }
	| { target: string; confirm: (confirmationId: string, approved: boolean) => Promise<Reply> };
const controlSources = new Set<() => (DraftControl | AgentAction)[]>();

export function registerAgentControls(source: () => (DraftControl | AgentAction)[]) {
	controlSources.add(source);
	return () => { controlSources.delete(source); };
}

function visible(element: HTMLElement) {
	return element.getClientRects().length > 0 &&
		getComputedStyle(element).visibility === 'visible' &&
		!element.closest('[hidden], [inert], [aria-hidden="true"], [data-agent-hidden]');
}

const controlSelector = [
	'[data-taxmate-agent]', 'button', 'a[href]', 'input:not([type="hidden"])', 'textarea', 'select',
	'[role="button"]', '[role="checkbox"]', '[role="combobox"]', '[role="menuitem"]',
	'[role="menuitemcheckbox"]', '[role="menuitemradio"]', '[role="option"]', '[role="radio"]',
	'[role="switch"]', '[role="tab"]', 'output', 'summary'
].join(', ');

const controlIds = new WeakMap<HTMLElement, number>();
let nextControlId = 1;

function controlLabel(element: HTMLElement) {
	const labelledBy = element.getAttribute('aria-labelledby')?.trim().split(/\s+/)
		.map(id => document.getElementById(id)?.textContent ?? '').join(' ').trim();
	const associatedLabels = 'labels' in element
		? Array.from((element as HTMLInputElement).labels ?? []).map(label => label.textContent).join(' ').trim()
		: '';
	const caption = element.dataset.taxmateAgent || labelledBy || element.getAttribute('aria-label') ||
		associatedLabels || element.getAttribute('title') || element.getAttribute('placeholder') ||
		(element.matches('input[type="button"], input[type="submit"], input[type="reset"]')
			? (element as HTMLInputElement).value : element.matches('input, textarea, select, output') ? '' : element.innerText);
	return (caption ?? '').replace(/\s+/g, ' ').trim().slice(0, 220);
}

function activeDialog() {
	return Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]'))
		.filter(visible).at(-1);
}

function controls(dialog = activeDialog()) {
	const visibleControls = Array.from((dialog ?? document).querySelectorAll<HTMLElement>(controlSelector))
		.filter(element => visible(element) && !element.closest('[aria-disabled="true"]') && !element.matches(':disabled'))
		.map(element => ({ target: controlLabel(element), element }))
		.filter(({ target }) => target);
	const labelCounts = new Map<string, number>();
	for (const { target } of visibleControls) {
		const key = normalize(target);
		labelCounts.set(key, (labelCounts.get(key) ?? 0) + 1);
	}
	for (const control of visibleControls) {
		if (labelCounts.get(normalize(control.target)) === 1) continue;
		const id = controlIds.get(control.element) ?? nextControlId++;
		controlIds.set(control.element, id);
		control.target += ` [${id}]`;
	}
	if (dialog) return visibleControls;
	return [...visibleControls, ...Array.from(controlSources).flatMap(source => source())];
}

function describe(control: ReturnType<typeof controls>[number]) {
	const { target } = control;
	if ('press' in control) return { target, actions: ['press'] };
	if ('confirm' in control) {
		return {
			target, actions: ['confirm'], requiresUserConsent: true, confirmationLocation: 'agent',
			args: { confirmationId: 'string', approved: 'boolean' }
		};
	}
	if ('href' in control) {
		const { formCode, returnPeriod, updatedAt, amountDue } = control;
		return { target, actions: ['press'], formCode, returnPeriod, status: 'Draft', updatedAt, amountDue };
	}
	const { element } = control;
	if (element.closest('[data-agent-confirm]')) {
		return { target, actions: [], requiresUserConsent: true };
	}
	const keys = element.dataset.taxmateAgentKeys?.split(' ');
	if (keys?.length) return { target, actions: ['key'], args: { key: keys } };
	if (element instanceof HTMLOutputElement) {
		return { target, actions: [], value: element.value };
	}
	if (element instanceof HTMLSelectElement) {
		const options = Array.from(element.options)
			.filter(option => !option.disabled && !option.closest('optgroup[disabled]'))
			.map(option => ({ label: option.label, value: option.value }));
		return { target, actions: ['select'], args: { value: 'string' }, value: element.value, options };
	}
	if (element instanceof HTMLInputElement && element.matches('[type="checkbox"], [type="radio"]')) {
		return { target, actions: ['press'], checked: element.checked };
	}
	if (element instanceof HTMLInputElement && element.type === 'file') {
		return { target, actions: [], requiresNativeDialog: true };
	}
	if (element instanceof HTMLTextAreaElement ||
		(element instanceof HTMLInputElement && !element.matches('[type="button"], [type="submit"], [type="reset"], [type="image"]'))) {
		const value = element instanceof HTMLInputElement && element.type === 'password' ? undefined : element.value;
		if (element.readOnly) return { target, actions: [], value };
		const actions = element.getAttribute('role') === 'combobox' ? ['set_value', 'press'] : ['set_value'];
		return { target, actions, args: { value: 'string' }, value };
	}
	return {
		target,
		actions: ['press'],
		checked: element.getAttribute('aria-checked') ?? undefined,
		expanded: element.getAttribute('aria-expanded') ?? undefined,
		pressed: element.getAttribute('aria-pressed') ?? undefined,
		selected: element.getAttribute('aria-selected') ?? undefined
	};
}

function normalize(value: string) {
	return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

export async function listenForUiAgentRequests() {
	const status = await getAgentBridgeStatus().catch(() => null);
	if (!status) return;

	const agent = createAgent();
	async function handle(request: Request): Promise<Reply> {
		const dialog = activeDialog();
		const available = controls(dialog);
		if (request.method === 'query') {
			const words = normalize(request.text).split(/[\s,]+/);
			const matches = available.filter(({ target }) => words.every(word => normalize(target).includes(word)));
			const offset = request.offset ?? 0;
			const end = offset + 20;
			const more = Math.max(0, matches.length - end);
			const messages = Array.from((dialog ?? document).querySelectorAll<HTMLElement>('[role="alert"], [role="status"]'))
				.filter(visible).map(element => element.innerText.trim().slice(0, 400)).filter(Boolean).slice(0, 10);
			return { ok: true, result: {
				screen: (dialog?.querySelector('h1, h2') ?? document.querySelector('main h1'))?.textContent?.trim() || undefined,
				controls: matches.slice(offset, end).map(describe),
				more,
				...(more > 0 && { nextOffset: end }),
				...(messages.length && { messages })
			} };
		}
		const matching = available.filter(({ target }) => normalize(target) === normalize(request.target));
		if (matching.length !== 1) {
			return { ok: false, error: 'Query the current screen for a unique, enabled control.' };
		}
		const [control] = matching;
		const { target, actions, requiresUserConsent } = describe(control);
		if ('confirm' in control) {
			const { confirmationId, approved } = request.args ?? {};
			if (request.action !== 'confirm' || Object.keys(request.args ?? {}).length !== 2 ||
				typeof confirmationId !== 'string' || typeof approved !== 'boolean') {
				return { ok: false, error: 'Provide the preview’s confirmation ID and the user’s approval decision.' };
			}
			return control.confirm(confirmationId, approved);
		}
		if (requiresUserConsent) {
			return { ok: false, error: 'This action requires the user to confirm it directly in TaxMate.' };
		}
		if (!actions.some(action => action === request.action)) {
			return { ok: false, error: 'This control does not support the requested action.' };
		}
		if (request.action === 'set_value' || request.action === 'select') {
			const value = request.args?.value;
			if (Object.keys(request.args ?? {}).length !== 1 || typeof value !== 'string' || !('element' in control)) {
				return { ok: false, error: 'Provide a string in args.value.' };
			}
			const { element } = control;
			if (element instanceof HTMLSelectElement) {
				const option = Array.from(element.options).find(option =>
					option.value === value && !option.disabled && !option.closest('optgroup[disabled]'));
				if (!option) return { ok: false, error: 'Choose an available option by its value.' };
				element.value = value;
			} else if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
				if (element.hasAttribute('data-taxmate-agent-currency') && normalizeCurrencyInput(value) === null) {
					return { ok: false, error: 'Provide a valid nonnegative currency amount in args.value.' };
				}
				const previous = element.value;
				element.value = value;
				if (value && !element.value) {
					element.value = previous;
					return { ok: false, error: 'The entered value is invalid for this field.' };
				}
			} else {
				return { ok: false, error: 'This control does not accept a value.' };
			}
			element.dispatchEvent(new Event('input', { bubbles: true }));
			element.dispatchEvent(new Event('change', { bubbles: true }));
			if (element.hasAttribute('data-taxmate-agent-currency')) element.dispatchEvent(new Event('blur'));
			await tick();
			const display = describe(control);
			return { ok: true, result: { target, value: display.value } };
		}
		if (request.action === 'key' && 'element' in control) {
			const key = request.args?.key;
			const keys = control.element.dataset.taxmateAgentKeys?.split(' ') ?? [];
			if (Object.keys(request.args ?? {}).length !== 1 || typeof key !== 'string' || !keys.includes(key)) {
				return { ok: false, error: 'Choose one of the keys advertised for this control.' };
			}
			control.element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
			await tick();
			return { ok: true, result: { target, key } };
		}
		if (request.action !== 'press' || Object.keys(request.args ?? {}).length) {
			return { ok: false, error: 'Press does not accept arguments.' };
		}
		if ('href' in control) {
			await goto(control.href);
			return { ok: true, result: { pressed: target } };
		}
		if ('press' in control) {
			return control.press();
		}
		const { element } = control;
		if (element instanceof HTMLAnchorElement) {
			const destination = new URL(element.href);
			if (destination.protocol !== location.protocol || destination.host !== location.host) return { ok: false, error: 'The link leaves TaxMate.' };
			if (element.hasAttribute('data-taxmate-agent')) await goto(destination);
			else element.click();
		} else if (element.hasAttribute('data-taxmate-agent-sdk')) {
			const buttons = await agent.query({ text: target, kind: 'button' });
			const matches = Array.isArray(buttons) ? buttons.filter(button => button.label === target &&
				!button.offPage && button.actions.includes('press')) : [];
			if (matches.length !== 1) return { ok: false, error: 'The UI SDK button is unavailable or ambiguous.' };
			const result = await agent.act({ steps: [{ ref: matches[0].ref, action: 'press' }] });
			if (!result.ok) return { ok: false, error: 'The UI SDK could not press the button.' };
		} else {
			element.click();
		}
		return { ok: true, result: { pressed: target } };
	}

	return getCurrentWebviewWindow().listen<{ id: string; request: Request }>('taxmate-ui-agent-request', async ({ payload }) => {
		let response: Reply;
		try {
			response = await handle(payload.request);
		} catch {
			response = { ok: false, error: 'TaxMate could not complete the UI request.' };
		}
		await invoke('taxmate_ui_agent_reply', { id: payload.id, response }).catch(() => {});
	});
}
