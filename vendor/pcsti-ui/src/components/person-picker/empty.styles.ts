import * as stylex from "@stylexjs/stylex";

export const emptyPerson = stylex.create({
  icon: {
    width: "calc(var(--spacing) * 6)",
    height: "calc(var(--spacing) * 6)",
  },
  label: {
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
  },
  description: {
    fontSize: "11px",
    color: "var(--fg-subtle)",
  },
  copy: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "calc(var(--spacing) * 0.5)",
  },
  compactCopy: {
    alignItems: "flex-start",
  },
  trigger: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "var(--radius-md)",
    "--sx-border-style": "dashed",
    borderStyle: "dashed",
    borderColor: {
      default: "var(--border-soft)",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
      "@media (hover: hover)": {
        default: null,
        ":hover": "color-mix(in oklch,var(--accent) 45%,var(--border-soft))",
      },
      ':is([data-invalid="true"])':
        "color-mix(in oklch,var(--danger) 60%,var(--border)) !important",
    },
    paddingInline: "calc(var(--spacing) * 4)",
    paddingBlock: "calc(var(--spacing) * 7)",
    fontSize: "13px",
    color: {
      default: null,
      ':is([data-invalid="true"])':
        "color-mix(in oklch,var(--danger) 55%,var(--fg-muted))",
    },
    "--sx-shadow": {
      default: null,
      ':is([data-invalid="true"])':
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--danger) 12%,transparent)) !important",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "0 0 0 3px color-mix(in oklch,var(--accent) 18%,transparent)",
      ':is([data-invalid="true"])':
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow) !important",
    },
  },
  compactTrigger: {
    minHeight: "calc(var(--spacing) * 13)",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: "calc(var(--spacing) * 3)",
    paddingInline: "calc(var(--spacing) * 3.5)",
    paddingBlock: "calc(var(--spacing) * 2.5)",
    textAlign: "left",
  },
  compactIcon: {
    width: "calc(var(--spacing) * 5)",
    height: "calc(var(--spacing) * 5)",
    flexShrink: "0",
  },
});
