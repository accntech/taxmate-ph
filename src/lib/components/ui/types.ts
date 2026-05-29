export type Crumb = {
	label: string;
	href?: string;
};

export type NavLeaf = {
	label: string;
	href: string;
	icon?: string;
};

export type NavParent = {
	label: string;
	icon?: string;
	children: NavLeaf[];
};

export type NavItem = NavLeaf | NavParent;

export type NavGroup = {
	label: string;
	items: NavItem[];
};

export function isParent(item: NavItem): item is NavParent {
	return 'children' in item;
}

export function isActivePath(href: string, activePath: string): boolean {
	if (href === '/') {
		return activePath === '/';
	}

	return activePath === href || activePath.startsWith(`${href}/`);
}
