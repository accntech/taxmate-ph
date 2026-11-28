import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/state';

export function getReturnPage() {
	if (!browser) return '1';
	return page.url.searchParams.get('page') ?? '1';
}

export async function selectReturnPage(id: string) {
	const url = new URL(page.url.href);
	if (id === '1') url.searchParams.delete('page');
	else url.searchParams.set('page', id);

	if (url.href !== page.url.href) {
		await goto(url, { noScroll: true, keepFocus: true });
	}
}

export function returnHrefWithoutPage(href: string) {
	const url = new URL(href);
	url.searchParams.delete('page');
	return url.href;
}
