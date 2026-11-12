export { default as DefinitionList } from "./index.svelte";
export type DefinitionListItem = {
  label: string;
  value: string | number | null | undefined;
  mono?: boolean;
};
