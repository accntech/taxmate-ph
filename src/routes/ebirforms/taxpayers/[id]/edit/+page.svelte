<script lang="ts">
	import { page } from '$app/state';
	import TaxpayerProfileEditor from '$lib/ebirforms/taxpayer-profile-editor.svelte';
</script>

{#key page.params.id}
	<TaxpayerProfileEditor profileId={page.params.id} />
{/key}
