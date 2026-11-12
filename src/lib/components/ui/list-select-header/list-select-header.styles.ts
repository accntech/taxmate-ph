import * as stylex from "@stylexjs/stylex";

export const selectHeader = stylex.create({
  root: {
    width: "calc(var(--spacing) * 8)",
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
  },
  label: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
  },
  checkbox: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    borderWidth: "0",
  },
});
