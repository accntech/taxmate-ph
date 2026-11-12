export { default as DefinitionList } from "./definition-list.svelte";
export type DefinitionListItem = {
  label: string;
  value: string | number | null | undefined;
  mono?: boolean;
};
