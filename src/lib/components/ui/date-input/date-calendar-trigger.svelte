<script lang="ts">
	import { Button as SdkButton } from '@ui-sdk/svelte/button';
	import * as stylex from '@stylexjs/stylex';
	import { Icon as SolarIcon } from '../icon/base';
	import { icons } from './date-field.icons';
	import { dateField } from './date-field.styles';

	let {
		label = 'Open calendar', open = false, controls, disabled = false, size = 'md',
		class: className, ontrigger
	}: {
		label?: string;
		open?: boolean;
		controls?: string;
		disabled?: boolean;
		size?: 'sm' | 'md';
		class?: string;
		ontrigger?: (opener?: HTMLElement) => void;
	} = $props();
</script>

<SdkButton
	data-icon
	type="button"
	class={[stylex.attrs(dateField.calendarButton, size === 'sm' ? dateField.smallCalendarButton : dateField.mediumCalendarButton).class, className]}
	aria-label={label}
	aria-haspopup="dialog"
	aria-expanded={open}
	aria-controls={controls}
	onclick={(event) => ontrigger?.(event.currentTarget instanceof HTMLElement ? event.currentTarget : undefined)}
	{disabled}
>
	<SolarIcon icon={icons.calendarButton} />
</SdkButton>
