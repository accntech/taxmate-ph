import * as stylex from "@stylexjs/stylex";

export const fieldErrors = stylex.create({
  root: {
    fontSize: "var(--text-sm)",
    lineHeight: "var(--sx-leading, var(--text-sm--line-height))",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--danger)",
  },
});
