import { mount } from 'svelte';
import DesignSystemFixture from './design-system-fixture.svelte';

export function mountDesignSystem() {
	const main = document.querySelector<HTMLElement>('#main-content')!;
	for (const child of main.querySelectorAll<HTMLElement>(':scope > *')) {
		child.style.display = 'none';
	}

	const target = document.createElement('div');
	main.append(target);
	mount(DesignSystemFixture, { target });
}
