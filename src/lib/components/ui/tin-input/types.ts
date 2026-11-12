import type { InputProps } from "../input/base";

export type TinInputProps = Omit<
  InputProps,
  "type" | "value" | "inputmode" | "pattern" | "maxlength"
> & {
  value?: string | null;
};
