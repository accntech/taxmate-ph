export type ScrollFadeMetrics = {
	scrollTop: number;
	scrollHeight: number;
	clientHeight: number;
};

export type ScrollFadeState = {
	top: 'off' | 'on';
	bottom: 'off' | 'on';
};

const fadeStates = ['off', 'on'] as const;

function fadeState(active: boolean): ScrollFadeState['top'] {
	return fadeStates[Number(active) as 0 | 1];
}

export function getScrollFadeState({
	scrollTop,
	scrollHeight,
	clientHeight
}: ScrollFadeMetrics): ScrollFadeState {
	const max = scrollHeight - clientHeight;
	const canScroll = Number(max > 1);

	return {
		top: fadeState(Boolean(canScroll * Number(scrollTop > 1))),
		bottom: fadeState(Boolean(canScroll * Number(scrollTop < max - 1)))
	};
}
