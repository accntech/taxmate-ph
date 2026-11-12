export function createSegmentFocus<TSegment extends string>(
	order: readonly TSegment[],
	elFor: (segment: TSegment) => HTMLElement | undefined
) {
	function focus(segment: TSegment) {
		elFor(segment)?.focus();
	}

	function advanceFrom(segment: TSegment) {
		const index = order.indexOf(segment);
		if (index < order.length - 1) focus(order[index + 1]);
	}

	function retreatFrom(segment: TSegment) {
		const index = order.indexOf(segment);
		if (index > 0) focus(order[index - 1]);
	}

	return { focus, advanceFrom, retreatFrom };
}
