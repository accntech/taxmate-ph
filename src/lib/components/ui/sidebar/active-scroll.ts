export function activeScrollOffset(navEl: HTMLElement) {
	const target = lastVisibleActiveNode(navEl.querySelectorAll<HTMLElement>('[data-active="true"]'));
	if (!target) return null;
	return centerOffset(navEl.getBoundingClientRect(), target.getBoundingClientRect());
}

export function revealScrollOffset(container: DOMRect, item: DOMRect, margin = 8) {
	const topOffset = item.top - container.top - margin;
	if (topOffset < 0) return topOffset;

	const bottomOffset = item.bottom - container.bottom + margin;
	if (bottomOffset > 0) return bottomOffset;

	return null;
}

function lastVisibleActiveNode(nodes: Iterable<HTMLElement>) {
	let target: HTMLElement | null = null;
	for (const node of nodes) {
		if (node.checkVisibility({ checkOpacity: true })) target = node;
	}
	return target;
}

function centerOffset(container: DOMRect, item: DOMRect) {
	return item.top - container.top - (container.height - item.height) / 2;
}
