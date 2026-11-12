import * as stylex from "@stylexjs/stylex";

export const toggleGroup = stylex.create({
  root: {
    position: "relative",
    alignItems: "stretch",
    gap: "0px",
  },
  fullWidth: {
    display: "flex",
    width: "100%",
  },
  inlineWidth: {
    display: "inline-flex",
  },
  outline: {
    minHeight: "calc(var(--spacing) * 7.5)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border)",
    backgroundColor: {
      default: "var(--bg-elev-2)",
      ":where(.dark, .dark *)": "var(--bg)",
    },
    padding: "calc(var(--spacing) * 0.5)",
  },
  option: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    placeItems: "center",
    borderRadius: "var(--radius-sm)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    paddingInline: "calc(var(--spacing) * 2)",
    transitionProperty: "color,background-color,border-color,box-shadow",
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
    pointerEvents: {
      default: null,
      ":disabled": "none",
    },
    opacity: {
      default: null,
      ":disabled": "60%",
    },
  },
  stretchedOption: {
    width: "100%",
    flex: "1",
  },
  pressedOutline: {
    color: "var(--fg)",
  },
  idleOutline: {
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
  },
  pressedDefault: {
    backgroundColor: "var(--bg-hover)",
    color: "var(--fg)",
  },
  idleDefault: {
    color: {
      default: "var(--fg-subtle)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
    },
  },
  icon: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
  },
  stretchedTooltip: {
    display: "flex",
    flex: "1",
  },
  indicator: {
    pointerEvents: "none",
    position: "absolute",
    insetBlock: "calc(var(--spacing) * 0.5)",
    borderRadius: "var(--radius-sm)",
    backgroundColor: {
      default: "var(--bg-elev)",
      ":where(.dark, .dark *)": "var(--bg-elev-2)",
    },
    "--sx-shadow": "var(--shadow-sm)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
});
