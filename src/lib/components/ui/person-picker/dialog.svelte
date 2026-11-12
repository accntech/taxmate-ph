<script lang="ts">
  import { personDialog } from "./dialog.styles";

  import * as stylex from "@stylexjs/stylex";
  import fuzzysort from "fuzzysort";
  import { Avatar } from "../avatar";
  import { Dialog } from "../dialog/base";
  import { SearchBox } from "../search-box";
  import { VirtualList } from "../virtual-list";
  import type { PersonPickerItem } from "./types";

  type Props = {
    open?: boolean;
    query?: string;
    items: PersonPickerItem[];
    dialogTitle: string;
    dialogDescription: string;
    searchPlaceholder: string;
    searchLabel: string;
    emptyMessage: string;
    noMatchMessage: string;
    ariaLabel: string;
    rowHeight: number;
    onpick: (id: string) => void;
  };
  type MatchedPersonPickerItem = PersonPickerItem & {
    labelIndexes: ReadonlyArray<number>;
    descriptionIndexes: ReadonlyArray<number>;
  };
  type HighlightedSegment = {
    start: number;
    text: string;
    highlighted: boolean;
  };

  let {
    open = $bindable(false),
    query = $bindable(""),
    items,
    dialogTitle,
    dialogDescription,
    searchPlaceholder,
    searchLabel,
    emptyMessage,
    noMatchMessage,
    ariaLabel,
    rowHeight,
    onpick,
  }: Props = $props();

  const activeItems = $derived(
    items.filter((item) => !item.inactive && !item.deleted),
  );
  const normalizedQuery = $derived(query.trim().toLocaleLowerCase());
  const filteredItems = $derived.by<MatchedPersonPickerItem[]>(() => {
    if (!normalizedQuery) {
      return activeItems.map((item) => ({
        ...item,
        labelIndexes: [],
        descriptionIndexes: [],
      }));
    }

    return fuzzysort
      .go(normalizedQuery, activeItems, {
        keys: [
          (item) => item.label,
          (item) => item.description ?? "",
          (item) => item.searchText ?? "",
        ],
        limit: 0,
        threshold: 0,
      })
      .map((result) => ({
        ...result.obj,
        labelIndexes: result[0].indexes,
        descriptionIndexes: result[1].indexes,
      }));
  });

  function getHighlightedSegments(
    text: string,
    indexes: ReadonlyArray<number>,
  ): HighlightedSegment[] {
    const highlightedIndexes = new Set(indexes);
    const segments: HighlightedSegment[] = [];

    for (let index = 0; index < text.length; index += 1) {
      const character = text.charAt(index);
      const highlighted = highlightedIndexes.has(index);
      const previous = segments.at(-1);

      if (previous?.highlighted === highlighted) previous.text += character;
      else segments.push({ start: index, text: character, highlighted });
    }

    return segments;
  }

  function setQuery(value: string | null) {
    query = value ?? "";
  }

  function pick(id: string) {
    onpick(id);
    open = false;
  }
</script>

{#snippet highlightedText(text: string, indexes: ReadonlyArray<number> = [])}
  {#if indexes.length === 0}
    {text}
  {:else}
    {#each getHighlightedSegments(text, indexes) as segment (segment.start)}
      {#if segment.highlighted}
        <mark class={[stylex.attrs(personDialog.match).class]}
          >{segment.text}</mark
        >
      {:else}
        {segment.text}
      {/if}
    {/each}
  {/if}
{/snippet}

<Dialog bind:open size="lg" title={dialogTitle} description={dialogDescription}>
  <div class={[stylex.attrs(personDialog.searchRow).class]}>
    <SearchBox
      value={query}
      onsearch={setQuery}
      placeholder={searchPlaceholder}
      label={searchLabel}
      debounceMs={0}
      autofocus
      inputClass={personDialog.searchInput}
      sx={personDialog.search}
    />

    <div class={[stylex.attrs(personDialog.listFrame).class]}>
      {#if filteredItems.length === 0}
        <div class={[stylex.attrs(personDialog.emptyMessage).class]}>
          {activeItems.length === 0 ? emptyMessage : noMatchMessage}
        </div>
      {:else}
        <VirtualList
          items={filteredItems}
          itemHeight={rowHeight}
          sx={personDialog.results}
          {ariaLabel}
          key={(item) => item.id}
        >
          {#snippet row(item)}
            <button
              type="button"
              onclick={() => pick(item.id)}
              class={[stylex.attrs(personDialog.option).class]}
            >
              <Avatar
                src={item.imageUrl}
                fallback={item.fallback}
                sx={personDialog.avatar}
                class={[item.avatarClass ?? ""].filter(Boolean).join(" ")}
                style={item.avatarStyle}
                ariaHidden
              />
              <div class={[stylex.attrs(personDialog.details).class]}>
                <div class={[stylex.attrs(personDialog.name).class]}>
                  {@render highlightedText(item.label, item.labelIndexes)}
                </div>
                {#if item.description}
                  <div class={[stylex.attrs(personDialog.description).class]}>
                    {@render highlightedText(
                      item.description,
                      item.descriptionIndexes,
                    )}
                  </div>
                {/if}
              </div>
            </button>
          {/snippet}
        </VirtualList>
      {/if}
    </div>
  </div>
</Dialog>
