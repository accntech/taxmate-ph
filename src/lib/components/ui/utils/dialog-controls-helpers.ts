export type DialogOpenSyncAction = 'show' | 'close' | 'none';
type DialogOpenSyncElement = Pick<HTMLDialogElement, 'open' | 'showModal' | 'close'>;

export function dialogOpenSyncAction(open: boolean, elementOpen: boolean): DialogOpenSyncAction {
	if (open && !elementOpen) return 'show';
	if (!open && elementOpen) return 'close';
	return 'none';
}

export function syncNativeDialogOpen(el: DialogOpenSyncElement, open: boolean) {
	const action = dialogOpenSyncAction(open, el.open);

	if (action === 'show') el.showModal();
	if (action === 'close') el.close();
}
