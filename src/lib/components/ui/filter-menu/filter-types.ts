/** Ported from PCSTI packages/ui/src/components/filter-menu/index.ts and index.svelte. */
import type { Component } from "svelte";

export type FilterOption = {
  value: string;
  label: string;
  description?: string;
};
export type FilterValue = string | string[] | null;
export type FilterDescriptor = {
  id: string;
  label: string;
  icon?: Component<any>;
  mode: "single" | "multi";
  options: FilterOption[];
  emptyLabel?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
};

/** Each opening starts a separate draft; changing it never mutates applied values. */
export function cloneFilterValues(
  descriptors: FilterDescriptor[],
  values: Record<string, FilterValue>,
): Record<string, FilterValue> {
  const next: Record<string, FilterValue> = {};
  for (const descriptor of descriptors) {
    const value = values[descriptor.id];
    next[descriptor.id] = Array.isArray(value) ? [...value] : (value ?? null);
  }
  return next;
}

export function toggleFilterValue(
  descriptor: FilterDescriptor,
  current: FilterValue | undefined,
  value: string,
): FilterValue {
  if (descriptor.mode === "single") return current === value ? null : value;
  const selected = Array.isArray(current) ? current : [];
  return selected.includes(value)
    ? selected.filter((item) => item !== value)
    : [...selected, value];
}

/** Applying one detail section changes that filter only, as in the PCSTI component. */
export function filterPatch(
  descriptor: FilterDescriptor,
  picked: Record<string, FilterValue>,
): Record<string, FilterValue> {
  const value = picked[descriptor.id] ?? null;
  return { [descriptor.id]: Array.isArray(value) ? [...value] : value };
}
