type Option<T extends string> = { value: T };

type SelectionDecision<T extends string> =
	| { kind: 'ignore' }
	| {
			kind: 'snap' | 'stretch';
			value: T;
			nextIdx: number;
			fromIdx: number;
		};

type SelectionDecisionInput<T extends string> = {
	value: T | null | undefined;
	nextValue: T;
	currentIdx: number;
	options: readonly Option<T>[];
	reduceMotion: boolean;
};

export function getSelectionDecision<T extends string>({
	value,
	nextValue,
	currentIdx,
	options,
	reduceMotion
}: SelectionDecisionInput<T>): SelectionDecision<T> {
	if (nextValue === value) return { kind: 'ignore' };

	const nextIdx = options.findIndex((option) => option.value === nextValue);
	if (nextIdx < 0) return { kind: 'ignore' };

	if (reduceMotion || currentIdx < 0) {
		return {
			kind: 'snap',
			value: nextValue,
			nextIdx,
			fromIdx: nextIdx
		};
	}

	return {
		kind: 'stretch',
		value: nextValue,
		nextIdx,
		fromIdx: currentIdx
	};
}
