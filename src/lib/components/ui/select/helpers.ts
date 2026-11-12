export type SelectOptionLike = {
	label: string;
	disabled?: boolean;
};

export type OptionBounds = {
	top: number;
	bottom: number;
};

export type OptionScrollState = {
	scrollTop: number;
	clientHeight: number;
};

export type PointerContainer = {
	contains: (target: Node) => boolean;
};

export function nextOptionScrollTop(state: OptionScrollState, bounds: OptionBounds): number {
	if (bounds.top < state.scrollTop) return bounds.top;

	const visibleBottom = state.scrollTop + state.clientHeight;
	return bounds.bottom > visibleBottom ? bounds.bottom - state.clientHeight : state.scrollTop;
}

export function appendTypeahead(current: string, char: string): string {
	return `${current}${char}`.toLowerCase();
}

export function matchingTypeaheadIndex<TOption extends SelectOptionLike>(
	options: TOption[],
	query: string,
	start: number
): number {
	const lowerQuery = query.toLowerCase();
	const match = Array.from(
		{ length: options.length },
		(_, step) => (start + step + 1) % options.length
	).find((index) => {
		const option = options[index];
		return !option.disabled && option.label.toLowerCase().startsWith(lowerQuery);
	});

	return match ?? -1;
}

export function shouldCloseForPointerTarget(
	target: Node | null,
	containers: Array<PointerContainer | null | undefined>
): boolean {
	return target !== null && containers.every((container) => !container?.contains(target));
}
