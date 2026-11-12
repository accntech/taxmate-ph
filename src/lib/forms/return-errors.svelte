<script lang="ts">
	import type { FormDefinition } from '$lib/forms';
	let { definition, errors, taxpayerHref = '' }: { definition: FormDefinition; errors: Record<string, string>; taxpayerHref?: string } = $props();
	function isTaxpayerField(id: string) {
		return id === 'txtEmail' || /^frm1601EQ:(txtTIN[123]|txtBranchCode|txtRDOCode|txtTaxpayerName|optCategory|txtAddress2?|txtZipCode|txtTelNum)$/.test(id);
	}
	function label(id: string) {
		const row = id.match(/:txt(ATC|TaxBase|TaxRate|TaxWithheld)(1[3-8])$/);
		if (row) return `ATC row ${Number(row[2]) - 12} · ${{ ATC: 'ATC', TaxBase: 'Tax base', TaxRate: 'Rate', TaxWithheld: 'Tax withheld' }[row[1]]}`;
		if (id.endsWith(':overpaymentOption')) return 'Over-remittance treatment';
		return definition.fields.find(field => field.id === id)?.label.replace(/^\d+[A-Z]?\s+/, '') || 'Return details';
	}
	function focusField(event: MouseEvent, id: string) {
		event.preventDefault();
		const control = document.getElementById(id);
		if (!control) return;
		let ancestor = control.parentElement;
		while (ancestor) {
			if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
			ancestor = ancestor.parentElement;
		}
		control.focus({ preventScroll: true });
		control.scrollIntoView({ block: 'center', behavior: 'instant' });
	}
</script>

{#if Object.keys(errors).length}
	<div role="alert" class="rounded-md border border-danger/30 bg-danger-soft p-3 text-sm text-fg">
		<p class="font-medium">Correct these fields</p>
		<ul class="mt-2 list-disc space-y-1 pl-5">
			{#each Object.entries(errors) as [id, message] (id)}
				<li><a class="rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href={taxpayerHref && isTaxpayerField(id) ? taxpayerHref : `#${encodeURIComponent(id)}`} onclick={(event) => { if (!taxpayerHref || !isTaxpayerField(id)) focusField(event, id); }}>{label(id)}: {message}</a></li>
			{/each}
		</ul>
	</div>
{/if}
