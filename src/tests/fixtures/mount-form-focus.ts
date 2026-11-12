import { mount } from 'svelte';
import FormFocusFixture from './form-focus-fixture.svelte';

export function mountFormFocus() {
	const target = document.createElement('div');
	document.getElementById('main-content')!.prepend(target);
	mount(FormFocusFixture, { target });
}
