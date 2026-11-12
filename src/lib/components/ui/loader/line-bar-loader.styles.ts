import * as stylex from "@stylexjs/stylex";

export const lineBar = stylex.create({
  progress: {
    height: "var(--spacing)",
    borderTopRightRadius: "calc(infinity * 1px)",
    borderBottomRightRadius: "calc(infinity * 1px)",
    backgroundColor: "var(--primary)",
  },
});
