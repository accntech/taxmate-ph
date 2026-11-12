import { host } from "../../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const filterMenu = stylex.create({
  searchInput: {
    width: "100%",
  },
  panel: {
    padding: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 2)",
    },
    width: {
      default: null,
      "@media (width >= 48rem)": "max-content",
    },
    maxWidth: {
      default: null,
      "@media (width >= 48rem)": "calc(var(--spacing) * 72)",
    },
    minWidth: {
      default: null,
      "@media (width >= 48rem)": "calc(var(--spacing) * 55)",
    },
  },
  trigger: {
    display: "inline-flex",
    minHeight: "calc(var(--spacing) * 7.5)",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border)",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    backgroundColor: {
      default: "var(--bg)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
    },
    paddingInline: {
      default: "calc(var(--spacing) * 2.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 2)",
    },
    fontSize: "var(--text-xs)",
    lineHeight: "var(--sx-leading, var(--text-xs--line-height))",
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    transitionProperty:
      "transform,background-color,color,border-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
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
    "--sx-scale-x": {
      default: null,
      ":active": "97%",
    },
    "--sx-scale-y": {
      default: null,
      ":active": "97%",
    },
    "--sx-scale-z": {
      default: null,
      ":active": "97%",
    },
    scale: {
      default: null,
      ":active": "var(--sx-scale-x) var(--sx-scale-y)",
    },
    minWidth: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 8.5)",
    },
    justifyContent: {
      default: null,
      "@media (width < 48rem)": "center",
    },
  },
  rootHeader: {
    paddingInline: {
      default: "calc(var(--spacing) * 2.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 2)",
    },
    paddingTop: {
      default: "calc(var(--spacing) * 2)",
      "@media (width < 48rem)": "var(--spacing)",
    },
    paddingBottom: {
      default: "var(--spacing)",
      "@media (width < 48rem)": "calc(var(--spacing) * 2)",
    },
    fontSize: {
      default: "10.5px",
      "@media (width < 48rem)": "11.5px",
    },
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    "--sx-tracking": "0.06em",
    letterSpacing: "0.06em",
    color: "var(--fg-subtle)",
    textTransform: "uppercase",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: {
      default: "calc(var(--spacing) * 1.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 2)",
    },
    paddingInline: {
      default: "calc(var(--spacing) * 2.5)",
      "@media (width < 48rem)": "var(--spacing)",
    },
    paddingTop: "calc(var(--spacing) * 2)",
    paddingBottom: {
      default: "var(--spacing)",
      "@media (width < 48rem)": "calc(var(--spacing) * 2)",
    },
    fontSize: {
      default: "10.5px",
      "@media (width < 48rem)": "11.5px",
    },
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    "--sx-tracking": "0.06em",
    letterSpacing: "0.06em",
    color: "var(--fg-subtle)",
    textTransform: "uppercase",
  },
  rootItem: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: {
      default: "calc(var(--spacing) * 2)",
      "@media (width < 48rem)": "calc(var(--spacing) * 3)",
    },
    borderRadius: "var(--radius-sm)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    padding: "calc(var(--spacing) * 2.5)",
    textAlign: "left",
    fontSize: {
      default: "13.5px",
      "@media (width < 48rem)": "15px",
      "@media (width >= 48rem)": "12.5px",
    },
    color: "var(--fg)",
    transitionProperty: "background-color,color,border-color,box-shadow",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
    },
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
    minHeight: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 11)",
    },
    paddingInline: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 3)",
    },
    paddingBlock: {
      default: null,
      "@media (width >= 48rem)": "calc(var(--spacing) * 1.5)",
    },
  },
  option: {
    marginBlock: "calc(var(--spacing) * 0.5)",
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: {
      default: "calc(var(--spacing) * 2)",
      "@media (width < 48rem)": "calc(var(--spacing) * 3)",
    },
    borderRadius: "var(--radius-sm)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    padding: "calc(var(--spacing) * 2.5)",
    textAlign: "left",
    fontSize: {
      default: "13.5px",
      "@media (width < 48rem)": "15px",
      "@media (width >= 48rem)": "12.5px",
    },
    color: "var(--fg)",
    transitionProperty: "background-color,color,border-color,box-shadow",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
    },
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
    minHeight: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 12)",
    },
    paddingInline: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 3)",
    },
    paddingBlock: {
      default: null,
      "@media (width >= 48rem)": "calc(var(--spacing) * 1.5)",
    },
  },
  options: {
    maxHeight: {
      default: "calc(var(--spacing) * 72)",
      "@media (width < 48rem)": "42vh",
    },
    scrollbarWidth: "thin",
    overflowY: "auto",
    paddingBlock: "calc(var(--spacing) * 3)",
    paddingRight: {
      default: "var(--spacing)",
      "@media (width < 48rem)": "0px",
    },
  },
  scrollArrow: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    color: "var(--fg-subtle)",
    animationName: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        host.animatePulseSoftName,
      "@media (prefers-reduced-motion: reduce)": "none",
    },
    animationDuration: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-pulse-soft-duration)",
      "@media (prefers-reduced-motion: reduce)": "0s",
    },
    animationTimingFunction: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-pulse-soft-timing-function)",
      "@media (prefers-reduced-motion: reduce)": "ease",
    },
    animationDelay: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)":
        "var(--animate-pulse-soft-delay)",
      "@media (prefers-reduced-motion: reduce)": "0s",
    },
    animationIterationCount: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "infinite",
      "@media (prefers-reduced-motion: reduce)": 1,
    },
    animationDirection: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "normal",
      "@media (prefers-reduced-motion: reduce)": "normal",
    },
    animationFillMode: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "none",
      "@media (prefers-reduced-motion: reduce)": "none",
    },
    animationPlayState: {
      default: null,
      "@media (prefers-reduced-motion: no-preference)": "running",
      "@media (prefers-reduced-motion: reduce)": "running",
    },
  },
  backButton: {
    display: "grid",
    width: {
      default: "calc(var(--spacing) * 5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 9)",
    },
    height: {
      default: "calc(var(--spacing) * 5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 9)",
    },
    placeItems: "center",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border)",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    color: "var(--fg-subtle)",
    transitionProperty: "border-color,box-shadow",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
    },
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
  },
  footer: {
    marginTop: {
      default: "var(--spacing)",
      "@media (width < 48rem)": "calc(var(--spacing) * 2)",
    },
    display: "flex",
    justifyContent: "flex-end",
    gap: {
      default: "calc(var(--spacing) * 1.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 2)",
    },
    borderTopStyle: "solid",
    borderTopWidth: "1px",
    borderColor: "var(--border-soft)",
    paddingTop: {
      default: "calc(var(--spacing) * 1.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 3)",
    },
    paddingInline: {
      default: null,
      "@media (width < 48rem)": "var(--spacing)",
    },
    paddingBottom: {
      default: null,
      "@media (width < 48rem)": "var(--spacing)",
    },
  },
  footerButton: {
    flex: {
      default: null,
      "@media (width < 48rem)": "1",
    },
  },
  menuIcon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
  },
  triggerLabel: {
    display: {
      default: "none",
      "@media (width >= 48rem)": "inline",
    },
  },
  accentEdge: {
    marginInline: "auto",
    marginBottom: "var(--spacing)",
    display: {
      default: "block",
      "@media (width >= 48rem)": "none",
    },
    height: "var(--spacing)",
    width: "calc(var(--spacing) * 9)",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "var(--border)",
  },
  filterIcon: {
    width: {
      default: "calc(var(--spacing) * 3.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 4.5)",
    },
    height: {
      default: "calc(var(--spacing) * 3.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 4.5)",
    },
    color: "var(--fg-subtle)",
  },
  nextIcon: {
    marginLeft: "auto",
    width: {
      default: "calc(var(--spacing) * 3.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 4)",
    },
    height: {
      default: "calc(var(--spacing) * 3.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 4)",
    },
    color: "var(--fg-subtle)",
  },
  emptyFilters: {
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBottom: "calc(var(--spacing) * 1.5)",
    fontSize: {
      default: "var(--text-xs)",
      "@media (width < 48rem)": "var(--text-sm)",
    },
    lineHeight: {
      default: "var(--sx-leading, var(--text-xs--line-height))",
      "@media (width < 48rem)":
        "var(--sx-leading, var(--text-sm--line-height))",
    },
    color: "var(--fg-subtle)",
    padding: {
      default: null,
      "@media (width < 48rem)": "calc(var(--spacing) * 2)",
    },
  },
  backIcon: {
    width: {
      default: "calc(var(--spacing) * 3)",
      "@media (width < 48rem)": "calc(var(--spacing) * 4.5)",
    },
    height: {
      default: "calc(var(--spacing) * 3)",
      "@media (width < 48rem)": "calc(var(--spacing) * 4.5)",
    },
  },
  searchRow: {
    paddingInline: {
      default: "calc(var(--spacing) * 2.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 3)",
    },
    paddingBottom: "var(--spacing)",
  },
  emptyOptions: {
    paddingInline: {
      default: "calc(var(--spacing) * 2.5)",
      "@media (width < 48rem)": "calc(var(--spacing) * 3)",
    },
    paddingBlock: "calc(var(--spacing) * 2)",
    fontSize: {
      default: "12.5px",
      "@media (width < 48rem)": "var(--text-sm)",
    },
    color: "var(--fg-subtle)",
    lineHeight: {
      default: null,
      "@media (width < 48rem)":
        "var(--sx-leading, var(--text-sm--line-height))",
    },
  },
  selected: {
    backgroundColor: "var(--bg-hover)",
  },
  optionDetails: {
    display: "flex",
    minWidth: "0px",
    flexDirection: "column",
  },
  optionLabel: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  optionDescription: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: {
      default: "11.5px",
      "@media (width < 48rem)": "12.5px",
    },
    color: "var(--fg-subtle)",
  },
});
