import { quartOut } from 'svelte/easing';

export function popoverIn(_node: Element) {
	return {
		duration: 180,
		easing: quartOut,
		css: (t: number) => `opacity: ${t}; transform: scale(${0.97 + t * 0.03});`
	};
}

export function popoverOut(_node: Element) {
	return {
		duration: 120,
		easing: quartOut,
		css: (t: number) =>
			`opacity: ${t}; transform: scale(${0.97 + t * 0.03}); pointer-events: none;`
	};
}

export function randomIdSuffix(): string {
	return Math.random().toString(36).slice(2);
}
