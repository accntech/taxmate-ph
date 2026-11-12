export type KeyboardListAction =
	| 'next'
	| 'previous'
	| 'first'
	| 'last'
	| 'select'
	| 'close'
	| 'page-next'
	| 'page-previous'
	| 'tab'
	| 'none';

export function keyboardListAction(key: string): KeyboardListAction {
	switch (key) {
		case 'ArrowDown':
			return 'next';
		case 'ArrowUp':
			return 'previous';
		case 'Home':
			return 'first';
		case 'End':
			return 'last';
		case 'Enter':
		case ' ':
			return 'select';
		case 'Escape':
			return 'close';
		case 'PageDown':
			return 'page-next';
		case 'PageUp':
			return 'page-previous';
		case 'Tab':
			return 'tab';
		default:
			return 'none';
	}
}
