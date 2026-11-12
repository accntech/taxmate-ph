import * as stylex from "@stylexjs/stylex";

export const statusPill = stylex.create({
  active: {
    borderColor: "transparent",
    backgroundColor: "var(--success-soft)",
    color: "var(--success)",
  },
  inactive: {
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--bg-elev-2)",
    color: "var(--fg-muted)",
  },
  warning: {
    borderColor: "transparent",
    backgroundColor: "var(--warn-soft)",
    color: "var(--warn)",
  },
  info: {
    borderColor: "transparent",
    backgroundColor: "var(--info-soft)",
    color: "var(--info)",
  },
  cancelled: {
    borderColor: "transparent",
    backgroundColor: "var(--danger-soft)",
    color: "var(--danger)",
  },
  activeDot: {
    backgroundColor: "var(--success)",
    "--sx-shadow":
      "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--success) 25%,transparent))",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
  inactiveDot: {
    backgroundColor: "var(--fg-subtle)",
  },
  warningDot: {
    "--sx-shadow":
      "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--warn) 22%,transparent))",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    backgroundColor: "var(--warn)",
  },
  infoDot: {
    backgroundColor: "var(--info)",
    "--sx-shadow":
      "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--info) 25%,transparent))",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
  cancelledDot: {
    backgroundColor: "var(--danger)",
    "--sx-shadow":
      "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--danger) 22%,transparent))",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
  root: {
    display: "inline-flex",
    flex: "none",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
    borderRadius: "var(--radius-xl)",
    borderStyle: "solid",
    borderWidth: "1px",
    paddingInline: "calc(var(--spacing) * 2.25)",
    paddingBlock: "calc(var(--spacing) * 0.5)",
    fontSize: "11.5px",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
  },
  dot: {
    width: "calc(var(--spacing) * 1.5)",
    height: "calc(var(--spacing) * 1.5)",
    borderRadius: "calc(infinity * 1px)",
  },
});
