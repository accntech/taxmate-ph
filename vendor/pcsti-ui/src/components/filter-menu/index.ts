import type { IconComponent } from "../icon";
export { default as FilterMenu } from "./index.svelte";

export type FilterOption = {
  value: string;
  label: string;
  description?: string;
};

export type FilterValue = string | string[] | null;

export type FilterDescriptor = {
  id: string;
  label: string;
  icon?: IconComponent;
  mode: "single" | "multi";
  options: FilterOption[];
  emptyLabel?: string;
  searchable?: boolean;
  searchMode?: "substring" | "fuzzy";
  searchPlaceholder?: string;
  custom?: boolean;
};
