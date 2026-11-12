import * as stylex from "@stylexjs/stylex";

export const formMessage = stylex.create({
  status: {
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--accent-soft)",
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2.5)",
    fontSize: "13px",
    color: "var(--accent)",
  },
  error: {
    fontSize: "var(--text-xs)",
    lineHeight: "var(--sx-leading, var(--text-xs--line-height))",
    color: "var(--danger)",
  },
});
