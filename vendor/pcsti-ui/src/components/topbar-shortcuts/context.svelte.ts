import type { Snippet } from 'svelte';

type Store = {
	content: Snippet | null;
	hidden: Record<string, boolean>;
};

export const topbarShortcuts = $state<Store>({ content: null, hidden: {} });

export function setTopbarShortcutsContent(content: Snippet | null): void {
	topbarShortcuts.content = content;
}

export function clearTopbarShortcutsContent(current: Snippet | null): void {
	if (topbarShortcuts.content === current) {
		topbarShortcuts.content = null;
		topbarShortcuts.hidden = {};
	}
}

export function isShortcutHidden(id: string): boolean {
	return topbarShortcuts.hidden[id] ?? true;
}

let resizeSuppressUntil = 0;

if (typeof window !== 'undefined') {
	window.addEventListener('resize', () => {
		resizeSuppressUntil = performance.now() + 250;
	});
}

export function shortcutTarget(node: HTMLElement, id: string) {
	const io = new IntersectionObserver(
		([entry]) => {
			if (performance.now() < resizeSuppressUntil) return;
			if (getComputedStyle(node).display === 'none') return;
			topbarShortcuts.hidden[id] = entry.isIntersecting;
		},
		{ rootMargin: '-56px 0px 0px 0px', threshold: 0 }
	);
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
		}
	};
}
