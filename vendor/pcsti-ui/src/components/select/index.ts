export { default as Select } from "./index.svelte";
export {
  appendTypeahead,
  matchingTypeaheadIndex,
  nextOptionScrollTop,
  shouldCloseForPointerTarget,
} from "./helpers";
export type {
  OptionBounds,
  OptionScrollState,
  PointerContainer,
  SelectOptionLike,
} from "./helpers";

export type SelectOption<TValue extends string = string> = {
  value: TValue;
  label: string;
  description?: string;
  disabled?: boolean;
};
