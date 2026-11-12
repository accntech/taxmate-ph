import * as stylex from "@stylexjs/stylex";

export const field = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "calc(var(--spacing) * 1.5)",
  },
  header: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: "calc(var(--spacing) * 2)",
  },
  label: {
    fontSize: "var(--text-xs)",
    lineHeight: "var(--sx-leading, var(--text-xs--line-height))",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--fg)",
  },
  requiredMarker: {
    color: "var(--danger)",
  },
  hiddenLabel: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0px",
    margin: "-1px",
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    borderWidth: "0px",
  },
  help: {
    fontSize: "var(--text-xs)",
    lineHeight: "var(--sx-leading, var(--text-xs--line-height))",
    color: "var(--fg-subtle)",
  },
});
