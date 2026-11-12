import * as stylex from "@stylexjs/stylex";

export const virtualList = stylex.create({
  viewport: {
    overflowY: "auto",
  },
  spacer: {
    position: "relative",
  },
  rows: {
    position: "absolute",
    insetInline: "0px",
    top: "0px",
  },
});
