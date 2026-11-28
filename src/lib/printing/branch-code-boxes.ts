/** Fit a branch code to the four boxes on June 2013 forms. */
function fourBranchCodeBoxes(value: string): readonly string[] {
	if (!/^\d{3,5}$/.test(value)) return ['', '', '', ''];

	const digits = value.length === 5 && value.startsWith('0')
		? value.slice(1)
		: value.padStart(4, '0');
	// A significant fifth digit shares the first box so the printed TIN keeps its identity.
	return [digits.slice(0, -3), ...digits.slice(-3)];
}

export function fillFourBranchCodeBoxes(field: HTMLElement, value: string): void {
	const boxes = fourBranchCodeBoxes(value);
	if (field.hasAttribute('data-print-branch-boxes')) {
		field.replaceChildren(...boxes.map(digits => {
			const box = field.ownerDocument.createElement('span');
			box.textContent = digits;
			if (digits.length > 1) box.className = 'print-branch-box-pair';
			return box;
		}));
		return;
	}

	for (const [index, box] of Array.from(field.children).entries()) {
		box.textContent = boxes[index];
	}
}
