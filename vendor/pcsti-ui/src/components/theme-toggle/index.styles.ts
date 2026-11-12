import * as stylex from "@stylexjs/stylex";

export const themeToggle = stylex.create({
  cycleButton: {
    display: "grid",
    width: "calc(var(--spacing) * 8)",
    height: "calc(var(--spacing) * 8)",
    placeItems: "center",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--primary) 60%,var(--border))",
    },
    backgroundColor: {
      default: "transparent",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
    },
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
    transitionDuration: "120ms",
    "--sx-duration": "120ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    "--sx-shadow": {
      default: null,
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--primary) 18%,transparent))",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    "--sx-scale-x": {
      default: null,
      ":active": "95%",
    },
    "--sx-scale-y": {
      default: null,
      ":active": "95%",
    },
    "--sx-scale-z": {
      default: null,
      ":active": "95%",
    },
    scale: {
      default: null,
      ":active": "var(--sx-scale-x) var(--sx-scale-y)",
    },
  },
  placeholder: {
    width: "calc(var(--spacing) * 3.75)",
    height: "calc(var(--spacing) * 3.75)",
  },
  cycleLightIcon: {
    width: "calc(var(--spacing) * 3.75)",
    height: "calc(var(--spacing) * 3.75)",
  },
  cycleDarkIcon: {
    width: "calc(var(--spacing) * 3.75)",
    height: "calc(var(--spacing) * 3.75)",
  },
  cycleSystemIcon: {
    width: "calc(var(--spacing) * 3.75)",
    height: "calc(var(--spacing) * 3.75)",
  },
  options: {
    position: "relative",
    display: "inline-flex",
    gap: "calc(var(--spacing) * 0.5)",
    borderRadius: "calc(infinity * 1px)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--bg-input)",
    padding: "calc(var(--spacing) * 0.75)",
  },
  selectionIndicator: {
    pointerEvents: "none",
    position: "absolute",
    top: "calc(var(--spacing) * 0.75)",
    left: "calc(0.1875rem + var(--l) * 1.75rem)",
    height: "calc(var(--spacing) * 6.5)",
    width: "calc(1.625rem + (var(--r) - var(--l)) * 1.75rem)",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "var(--bg-elev-2)",
    "--sx-shadow": "var(--shadow-sm)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    transitionProperty: "left,width",
    transitionTimingFunction: {
      default: "var(--ease-out)",
      "@media (prefers-reduced-motion: reduce)": "linear",
    },
    transitionDuration: {
      default: "220ms",
      "@media (prefers-reduced-motion: reduce)": "160ms",
    },
    "--sx-duration": {
      default: "220ms",
      "@media (prefers-reduced-motion: reduce)": "160ms",
    },
    "--sx-ease": {
      default: "var(--ease-out)",
      "@media (prefers-reduced-motion: reduce)": "linear",
    },
  },
  option: {
    position: "relative",
    zIndex: 10,
    display: "grid",
    width: "calc(var(--spacing) * 6.5)",
    height: "calc(var(--spacing) * 6.5)",
    placeItems: "center",
    borderRadius: "calc(infinity * 1px)",
    transitionProperty: "color,transform,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "120ms",
    "--sx-duration": "120ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    "--sx-shadow": {
      default: null,
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--primary) 18%,transparent))",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    "--sx-scale-x": {
      default: null,
      ":active": "95%",
    },
    "--sx-scale-y": {
      default: null,
      ":active": "95%",
    },
    "--sx-scale-z": {
      default: null,
      ":active": "95%",
    },
    scale: {
      default: null,
      ":active": "var(--sx-scale-x) var(--sx-scale-y)",
    },
  },
  selected: {
    color: "var(--fg)",
  },
  unselected: {
    color: {
      default: "var(--fg-subtle)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg-muted)",
      },
    },
  },
  modeIcon: {
    width: "calc(var(--spacing) * 3.25)",
    height: "calc(var(--spacing) * 3.25)",
  },
});
