<script lang="ts">
	import './form-1601-eq-layout.css';
	import type { FormDefinition } from '$lib/forms';
	import Form1601EQEditor from './form-1601-eq-editor.svelte';

	type Props = {
		definition: FormDefinition;
		values: Record<string, string>;
		errors?: Record<string, string>;
		onvaluechange?: (patch: Record<string, string>) => void;
	};

	let { definition, values = $bindable(), errors = {}, onvaluechange }: Props = $props();
</script>

<Form1601EQEditor {definition} bind:values {errors} {onvaluechange} />
