import { host } from "../../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const detailSection = stylex.create({
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
    flexWrap: "wrap",
    gap: "calc(var(--spacing) * 2)",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingInline: "calc(var(--spacing) * 4)",
    paddingTop: "calc(var(--spacing) * 3.5)",
    paddingBottom: "calc(var(--spacing) * 2)",
  },
  title: {
    flexShrink: 0,
    maxWidth: "100%",
    whiteSpace: "normal",
    overflowWrap: "anywhere",
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
  icon: {
    width: "calc(var(--spacing) * 3)",
    height: "calc(var(--spacing) * 3)",
  },
  titleMarker: {
    display: "inline-block",
    height: "calc(var(--spacing) * 3)",
    width: "calc(var(--spacing) * 0.5)",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "var(--accent)",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    paddingInline: "calc(var(--spacing) * 4)",
    paddingTop: "var(--spacing)",
    paddingBottom: "calc(var(--spacing) * 4)",
  },
});
