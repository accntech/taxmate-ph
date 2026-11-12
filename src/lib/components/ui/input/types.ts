import type { Snippet } from "svelte";
import type { HTMLInputAttributes } from "svelte/elements";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { InputSize } from "./input.styles";

/** Internal styled native control shared with specialized primitives. */
export type InputControlProps = Omit<
  HTMLInputAttributes,
  "value" | "class" | "size"
> & {
  value?: string;
  invalid?: boolean;
  size?: InputSize | HTMLInputAttributes["size"];
  class?: string;
  sx?: StyleXStyles;
  inputSx?: StyleXStyles;
  leading?: Snippet;
  trailing?: Snippet;
};

/** Text entry only; specialized controls own dates, quantities and suggestions. */
export type InputProps = Omit<InputControlProps, "type" | "list"> & {
  type?: "text" | "search" | "email" | "tel" | "url";
  list?: never;
};
