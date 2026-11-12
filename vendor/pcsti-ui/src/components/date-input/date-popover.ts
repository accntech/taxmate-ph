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

export function place(anchor: Rect, popover: Rect, viewport: Viewport): Position {
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
	return anchor?.closest('dialog[open]') ?? fallback;
}
