type PointerContainers = {
	container: { contains: (target: Node) => boolean } | null;
	popover: { contains: (target: Node) => boolean } | null;
};

export function shouldCloseForAutocompletePointerTarget(
	target: Node | null,
	containers: PointerContainers
) {
	if (!target) return false;
	return !containers.container?.contains(target) && !containers.popover?.contains(target);
}

export function shouldShowAutocompleteDropdown(value: string) {
	return value.trim().length > 0;
}
