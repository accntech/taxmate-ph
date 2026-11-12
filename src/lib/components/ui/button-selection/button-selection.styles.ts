import * as stylex from "@stylexjs/stylex";

export const selection = stylex.create({
  neutralIndicatorTheme: {
    backgroundColor: {
      default: "var(--bg-elev)",
      ":where(.dark, .dark *)": "color-mix(in oklch,var(--fg) 12%,var(--bg))",
    },
  },
  root: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 0.5)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border)",
    backgroundColor: {
      default: "var(--bg-elev-2)",
      ":where(.dark, .dark *)": "var(--bg-input)",
    },
    padding: "calc(var(--spacing) * 0.75)",
  },
  inputHeight: {
    height: "calc(var(--spacing) * 10)",
  },
  compactHeight: {
    height: "calc(var(--spacing) * 9.5)",
  },
  indicator: {
    pointerEvents: "none",
    position: "absolute",
    insetBlock: "calc(var(--spacing) * 0.75)",
    borderRadius: "var(--radius-sm)",
  },
  primaryIndicator: {
    backgroundColor: "var(--primary)",
    "--sx-shadow":
      "inset 0 0 0 1px var(--sx-shadow-color, color-mix(in oklch,var(--primary) 82%,black))",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
  neutralIndicator: {
    backgroundColor: "color-mix(in oklch,var(--fg) 5%,var(--bg))",
    "--sx-shadow":
      "inset 0 0 0 1px var(--sx-shadow-color, color-mix(in oklch,var(--border) 80%,transparent))",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
  option: {
    position: "relative",
    zIndex: 1,
    flex: "1",
    borderRadius: "var(--radius-sm)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    paddingInline: "calc(var(--spacing) * 3.5)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    fontSize: "12.5px",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    transitionProperty: "color,border-color,box-shadow",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration: "150ms",
    "--sx-duration": "150ms",
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
  },
  truncatedLabel: {
    minWidth: "0px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  fullLabel: {
    minWidth: "max-content",
    textWrap: "nowrap",
  },
  selectedPrimary: {
    color: "var(--primary-fg)",
  },
  selectedNeutral: {
    color: "var(--fg)",
  },
  unselected: {
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
  },
});
