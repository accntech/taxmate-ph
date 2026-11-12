import * as stylex from "@stylexjs/stylex";

export const formDescription = stylex.create({
  root: {
    fontSize: "var(--text-sm)",
    lineHeight: "var(--sx-leading, var(--text-sm--line-height))",
    color: "var(--fg-subtle)",
  },
});
