import { host } from "../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const importDialog = stylex.create({
  fileInput: {
    display: "none",
  },
  stage: {
    display: "grid",
    gap: "calc(var(--spacing) * 3)",
  },
  dropzone: {
    display: "grid",
    minHeight: "calc(var(--spacing) * 32)",
    width: "100%",
    placeItems: "center",
    gap: "calc(var(--spacing) * 2)",
    "--sx-border-style": "dashed",
    borderStyle: "dashed",
    paddingInline: "calc(var(--spacing) * 4)",
    paddingBlock: "calc(var(--spacing) * 10)",
    textAlign: "center",
    scale: {
      default: null,
      ":active": "0.99",
    },
  },
  dragging: {
    borderColor: "var(--accent)",
    backgroundColor: "color-mix(in oklch,var(--accent) 8%,var(--bg-elev))",
  },
  uploadIcon: {
    width: "calc(var(--spacing) * 8)",
    height: "calc(var(--spacing) * 8)",
    color: "var(--fg-muted)",
  },
  title: {
    fontSize: "14px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--fg)",
  },
  hint: {
    fontSize: "12px",
    color: "var(--fg-subtle)",
  },
  templateRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "calc(var(--spacing) * 2)",
  },
  templateButton: {
    paddingInline: "var(--spacing)",
    paddingBlock: "calc(var(--spacing) * 0.5)",
  },
  templateSpinner: {
    width: "calc(var(--spacing) * 3)",
    height: "calc(var(--spacing) * 3)",
    flex: "none",
    borderRadius: "calc(infinity * 1px)",
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: "color-mix(in oklab, var(--fg-muted) 40%, transparent)",
    borderTopColor: "var(--fg)",
    animationName: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        host.animateSpinRingName,
    },
    animationDuration: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-spin-ring-duration)",
    },
    animationTimingFunction: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-spin-ring-timing-function)",
    },
    animationDelay: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-spin-ring-delay)",
    },
    animationIterationCount: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "infinite",
    },
    animationDirection: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "normal",
    },
    animationFillMode: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "none",
    },
    animationPlayState: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "running",
    },
  },
  actionIcon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
  },
  duplicateNote: {
    fontSize: "11.5px",
    color: "var(--fg-subtle)",
  },
  pending: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    paddingBlock: "calc(var(--spacing) * 12)",
    fontSize: "13px",
    color: "var(--fg-muted)",
  },
  spinner: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    flex: "none",
    borderRadius: "calc(infinity * 1px)",
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: "color-mix(in oklab, var(--fg-muted) 40%, transparent)",
    borderTopColor: "var(--fg)",
    animationName: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        host.animateSpinRingName,
    },
    animationDuration: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-spin-ring-duration)",
    },
    animationTimingFunction: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-spin-ring-timing-function)",
    },
    animationDelay: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-spin-ring-delay)",
    },
    animationIterationCount: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "infinite",
    },
    animationDirection: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "normal",
    },
    animationFillMode: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "none",
    },
    animationPlayState: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "running",
    },
  },
  fileSummary: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--bg)",
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
  },
  fileIcon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    color: "var(--fg-subtle)",
  },
  filename: {
    flex: "1",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "12.5px",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--fg)",
  },
  rowCount: {
    fontFamily: "var(--font-mono)",
    fontSize: "11.5px",
    color: "var(--fg-subtle)",
    "--sx-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)",
  },
  errors: {
    display: "grid",
    gap: "calc(var(--spacing) * 2)",
  },
  errorCount: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--danger)",
    "--sx-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)",
  },
  errorList: {
    maxHeight: "calc(var(--spacing) * 56)",
    listStyleType: "none",
    overflowY: "auto",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "color-mix(in oklch,var(--danger) 24%,var(--border))",
    backgroundColor: "color-mix(in oklch,var(--danger) 5%,var(--bg))",
    color: "var(--fg)",
  },
  errorRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    columnGap: "calc(var(--spacing) * 3)",
    rowGap: "calc(var(--spacing) * 0.5)",
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
    fontSize: "12px",
  },
  errorRowNumber: {
    minWidth: "calc(var(--spacing) * 14)",
    flex: "none",
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    color: "var(--fg-subtle)",
    "--sx-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)",
  },
  errorField: {
    minWidth: "calc(var(--spacing) * 20)",
    flex: "none",
    fontSize: "11px",
    "--sx-tracking": "0.04em",
    letterSpacing: "0.04em",
    color: "var(--fg-muted)",
    textTransform: "uppercase",
  },
  errorMessage: {
    minWidth: "calc(var(--spacing) * 40)",
    flex: "1",
    color: "var(--fg)",
  },
  duplicateNotice: {
    borderRadius: "var(--radius-md)",
    borderStyle: "dashed",
    borderWidth: "1px",
    "--sx-border-style": "dashed",
    borderColor: "var(--border)",
    paddingInline: "calc(var(--spacing) * 4)",
    paddingBlock: "calc(var(--spacing) * 6)",
    textAlign: "center",
    fontSize: "13px",
    color: "var(--fg-muted)",
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "calc(var(--spacing) * 2)",
  },
  stat: {
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--bg)",
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2.5)",
  },
  statLabel: {
    fontSize: "11px",
    "--sx-tracking": "0.04em",
    letterSpacing: "0.04em",
    color: "var(--fg-subtle)",
    textTransform: "uppercase",
  },
  createdCount: {
    marginTop: "calc(var(--spacing) * 0.5)",
    fontFamily: "var(--font-mono)",
    fontSize: "20px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--fg)",
    "--sx-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)",
  },
  duplicateCount: {
    marginTop: "calc(var(--spacing) * 0.5)",
    fontFamily: "var(--font-mono)",
    fontSize: "20px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--fg-muted)",
    "--sx-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)",
  },
  previewActions: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: "calc(var(--spacing) * 2)",
    paddingTop: "var(--spacing)",
  },
  success: {
    display: "grid",
    gap: "calc(var(--spacing) * 4)",
  },
  successSummary: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2.5)",
  },
  successBadge: {
    display: "grid",
    width: "calc(var(--spacing) * 7)",
    height: "calc(var(--spacing) * 7)",
    flex: "none",
    placeItems: "center",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "var(--success-soft)",
    color: "var(--success)",
  },
  successIcon: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
  },
  successCopy: {
    minWidth: "0px",
  },
  successFilename: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "11.5px",
    color: "var(--fg-subtle)",
  },
  successActions: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: "calc(var(--spacing) * 2)",
  },
});
