export function refreshDevStylesheet(initial: HTMLLinkElement) {
	const hot = import.meta.hot;
	if (!hot) return;

	let active = initial;
	let pending: HTMLLinkElement | undefined;

	function refresh() {
		pending?.remove();
		const url = new URL(initial.href);
		url.searchParams.set('t', String(Date.now()));
		const next = document.createElement('link');
		next.rel = 'stylesheet';
		next.href = url.href;
		pending = next;

		next.onload = () => {
			if (pending !== next) return;
			// Keep the current rules applied until the replacement is ready.
			if (active === initial) initial.disabled = true;
			else active.remove();
			active = next;
			pending = undefined;
		};
		next.onerror = () => {
			if (pending === next) pending = undefined;
			next.remove();
		};
		active.after(next);
	}

	hot.on('stylex:css-update', refresh);
	refresh();
	return () => {
		hot.off('stylex:css-update', refresh);
		const queued = pending;
		pending = undefined;
		queued?.remove();
		if (active !== initial) active.remove();
	};
}
