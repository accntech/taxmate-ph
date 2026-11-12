import { host } from "../../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const imageSources = stylex.create({
  inactiveIconTheme: {
    color: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group):hover *)": "var(--fg)",
      },
    },
  },
  root: {
    position: "relative",
  },
  tabs: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
  tab: {
    position: "relative",
    display: "inline-flex",
    animationName: host.animateTabInName,
    animationDuration: "var(--animate-tab-in-duration)",
    animationTimingFunction: "var(--animate-tab-in-timing-function)",
    animationDelay: "var(--animate-tab-in-delay)",
    animationIterationCount: 1,
    animationDirection: "normal",
    animationFillMode: "both",
    animationPlayState: "running",
    alignItems: "center",
    justifyContent: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2.5)",
    fontSize: "12.5px",
    transitionProperty:
      "color,background-color,border-color,box-shadow,transform",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "180ms",
    "--sx-duration": "180ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    "--sx-shadow": {
      default: null,
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 18%,transparent))",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    scale: {
      default: null,
      ":active": "0.97",
    },
  },
  active: {
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--fg)",
  },
  inactive: {
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "color-mix(in oklab, var(--bg-elev) 40%, transparent)",
      },
    },
  },
  icon: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
    transitionProperty: "color,transform",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "200ms",
    "--sx-duration": "200ms",
    "--sx-ease": "var(--ease-out)",
  },
  activeIcon: {
    "--sx-scale-x": "110%",
    "--sx-scale-y": "110%",
    "--sx-scale-z": "110%",
    scale: "var(--sx-scale-x) var(--sx-scale-y)",
    color: "var(--accent)",
  },
  inactiveIcon: {
    color: "var(--fg-subtle)",
  },
  divider: {
    position: "absolute",
    insetInline: "0px",
    bottom: "-1px",
    height: "1px",
    backgroundColor: "color-mix(in oklab, var(--border-soft) 50%, transparent)",
  },
  indicatorTrack: {
    pointerEvents: "none",
    position: "absolute",
    bottom: "-1px",
    left: "0px",
    display: "flex",
    height: "3px",
    width: "33.333%",
    alignItems: "center",
    justifyContent: "center",
    transitionProperty: {
      default: "transform, translate, scale, rotate",
      "@media (prefers-reduced-motion: reduce)": "none",
    },
    transitionTimingFunction: "var(--ease-drawer)",
    transitionDuration: "320ms",
    "--sx-duration": "320ms",
    "--sx-ease": "var(--ease-drawer)",
  },
  indicator: {
    display: "block",
    height: "100%",
    width: "calc(var(--spacing) * 14)",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "var(--accent)",
  },
});
