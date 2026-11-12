export { default as Combobox } from "./combobox.svelte";

export type ComboboxOption<
  TValue extends string = string,
  TData = undefined,
> = {
  value: TValue;
  label: string;
  secondary?: string;
  badge?: string;
  group?: string;
  disabled?: boolean;
  data?: TData;
};
