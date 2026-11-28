import { ACTIVE_MODAL_SELECTOR } from '../dialog/active-modal';
import { quartOut } from 'svelte/easing';

export type Side = 'bottom' | 'top';

type Rect = Pick<DOMRect, 'top' | 'bottom' | 'left' | 'width' | 'height'>;

type Viewport = {
	width: number;
	height: number;
};

type Position = {
	top: number;
	left: number;
	side: Side;
};

const GAP = 6;
const PAD = 8;
const EST_HEIGHT = 300;

export function pickSide(anchor: Rect, height: number): Side {
	const fitsBelow = anchor.bottom + GAP + EST_HEIGHT <= height - PAD;
	const fitsAbove = anchor.top - GAP - EST_HEIGHT >= PAD;
	return !fitsBelow && fitsAbove ? 'top' : 'bottom';
}

export function place(anchor: Rect, popover: Pick<Rect, 'width' | 'height'>, viewport: Viewport): Position {
	let top = anchor.bottom + GAP;
	const below = top + popover.height <= viewport.height - PAD;
	const aboveTop = anchor.top - popover.height - GAP;
	const above = aboveTop >= PAD;
	let side: Side = 'bottom';

	if (!below && above) {
		top = aboveTop;
		side = 'top';
	} else if (!below) {
		top = Math.max(PAD, viewport.height - popover.height - PAD);
	}

	let left = anchor.left;
	if (left + popover.width > viewport.width - PAD) left = viewport.width - popover.width - PAD;
	if (left < PAD) left = PAD;

	return {
		top: Math.round(top),
		left: Math.round(left),
		side
	};
}

export function getPopoverPortalParent(anchor: HTMLElement | undefined, fallback: HTMLElement) {
	return anchor?.closest(ACTIVE_MODAL_SELECTOR) ?? fallback;
}

export function datePopoverIntro(side: Side, reducedMotion = false) {
	const yStart = side === 'top' ? 4 : -4;
	return {
		duration: reducedMotion ? 0 : 180,
		easing: quartOut,
		css: (t: number) => `opacity: ${t}; transform: translateY(${(1 - t) * yStart}px) scale(${0.96 + t * 0.04});`
	};
}

export function datePopoverOutro(reducedMotion = false) {
	return {
		duration: reducedMotion ? 0 : 120,
		easing: quartOut,
		css: (t: number) => `opacity: ${t}; transform: scale(${0.97 + t * 0.03}); pointer-events: none;`
	};
}

function tabbables(root: HTMLElement) {
	return Array.from(root.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]'))
		.filter(element => element.tabIndex >= 0 && !element.matches(':disabled') && element.offsetParent !== null);
}

export function focusDatePopover(root: HTMLElement) {
	const controls = tabbables(root);
	(controls.find(element => element.getAttribute('tabindex') === '0') ?? controls[0])?.focus();
}

export function containDatePopoverTab(event: KeyboardEvent, root: HTMLElement) {
	if (event.key !== 'Tab') return;
	const controls = tabbables(root);
	const first = controls[0];
	const last = controls.at(-1);
	const active = root.ownerDocument.activeElement;
	if (!root.contains(active) || (event.shiftKey ? active === first : active === last) || !first) {
		event.preventDefault();
		(event.shiftKey ? last : first)?.focus();
	}
}
