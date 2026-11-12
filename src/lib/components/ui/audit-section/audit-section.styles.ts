import { host } from "../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const auditSection = stylex.create({
  root: {
    position: "relative",
    animationName: {
      default: host.animateRowInName,
      "@media (prefers-reduced-motion: no-preference)": host.animateRowInName,
    },
    animationDuration: {
      default: "var(--animate-row-in-duration)",
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-row-in-duration)",
    },
    animationTimingFunction: {
      default: "var(--animate-row-in-timing-function)",
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-row-in-timing-function)",
    },
    animationDelay: {
      default: "var(--animate-row-in-delay)",
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-row-in-delay)",
    },
    animationIterationCount: {
      default: 1,
      "@media (prefers-reduced-motion: no-preference)": 1,
    },
    animationDirection: {
      default: "normal",
      "@media (prefers-reduced-motion: no-preference)": "normal",
    },
    animationFillMode: {
      default: "both",
      "@media (prefers-reduced-motion: no-preference)": "both",
    },
    animationPlayState: {
      default: "running",
      "@media (prefers-reduced-motion: no-preference)": "running",
    },
    overflow: "hidden",
    borderRadius: "var(--radius-xl)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--bg-elev)",
  },
  accentEdge: {
    pointerEvents: "none",
    position: "absolute",
    insetInline: "0px",
    top: "0px",
    height: "1px",
    "--sx-gradient-position": {
      default: "to right",
      "@supports (background-image: linear-gradient(in lab, red, red))":
        "to right in oklab",
    },
    backgroundImage: "linear-gradient(var(--sx-gradient-stops))",
    "--sx-gradient-from": "var(--accent-soft)",
    "--sx-gradient-stops":
      "var(--sx-gradient-via-stops, var(--sx-gradient-position), var(--sx-gradient-from) var(--sx-gradient-from-position), var(--sx-gradient-to) var(--sx-gradient-to-position))",
    "--sx-gradient-via": "transparent",
    "--sx-gradient-via-stops":
      "var(--sx-gradient-position), var(--sx-gradient-from) var(--sx-gradient-from-position), var(--sx-gradient-via) var(--sx-gradient-via-position), var(--sx-gradient-to) var(--sx-gradient-to-position)",
    "--sx-gradient-to": "transparent",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingInline: "calc(var(--spacing) * 4)",
    paddingTop: "calc(var(--spacing) * 3.5)",
    paddingBottom: "calc(var(--spacing) * 2)",
  },
  title: {
    display: "inline-flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
    fontSize: "10.5px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    "--sx-tracking": "var(--tracking-widest)",
    letterSpacing: "var(--tracking-widest)",
    color: "var(--fg-subtle)",
    textTransform: "uppercase",
  },
  titleMarker: {
    display: "inline-block",
    height: "calc(var(--spacing) * 3)",
    width: "calc(var(--spacing) * 0.5)",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "var(--accent)",
  },
  entries: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 7.25rem) minmax(0, 1fr)",
    columnGap: "calc(var(--spacing) * 3)",
    rowGap: "calc(var(--spacing) * 2.5)",
    paddingInline: "calc(var(--spacing) * 4)",
    paddingBottom: "calc(var(--spacing) * 4)",
    fontSize: "12.5px",
  },
  label: {
    minWidth: 0,
    paddingTop: "calc(var(--spacing) * 0.5)",
    fontSize: "11px",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    "--sx-tracking": "0.04em",
    letterSpacing: "0.04em",
    color: "var(--fg-muted)",
    textTransform: "uppercase",
  },
  timestamp: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "calc(var(--spacing) * 0.5)",
    overflowWrap: "anywhere",
    fontSize: "12px",
    color: "var(--fg)",
  },
  actor: {
    fontFamily: "var(--font-sans)",
    fontSize: "12px",
    color: "var(--fg-subtle)",
  },
  reason: {
    minWidth: 0,
    overflowWrap: "anywhere",
    whiteSpace: "pre-wrap",
    color: "var(--fg)",
  },
});
