<script lang="ts">
	let { text, indexes }: { text: string; indexes: ReadonlyArray<number> } = $props();

	const segments = $derived.by(() => {
		const highlightedIndexes = new Set(indexes);
		const result: { start: number; text: string; highlighted: boolean }[] = [];

		for (let index = 0; index < text.length; index += 1) {
			const highlighted = highlightedIndexes.has(index);
			const previous = result.at(-1);
			if (previous?.highlighted === highlighted) previous.text += text.charAt(index);
			else result.push({ start: index, text: text.charAt(index), highlighted });
		}

		return result;
	});
</script>

{#if indexes.length === 0}
	{text}
{:else}
	{#each segments as segment (segment.start)}
		{#if segment.highlighted}
			<mark>{segment.text}</mark>
		{:else}
			{segment.text}
		{/if}
	{/each}
{/if}

<style>
	mark {
		background-color: var(--accent-soft);
		color: inherit;
	}
</style>
