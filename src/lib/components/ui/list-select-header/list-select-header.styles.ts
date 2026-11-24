import * as stylex from "@stylexjs/stylex";

export const selectHeader = stylex.create({
  root: {
    width: "calc(var(--spacing) * 8)",
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
  },
});
