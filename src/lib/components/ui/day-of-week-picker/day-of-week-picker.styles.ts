import * as stylex from "@stylexjs/stylex";

export const weekPicker = stylex.create({
  root: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
  },
  day: {
    display: "grid",
    height: "calc(var(--spacing) * 8)",
    minWidth: "calc(var(--spacing) * 9)",
    placeItems: "center",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    paddingInline: "calc(var(--spacing) * 2)",
    fontSize: "12px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    transitionProperty:
      "background-color,border-color,color,box-shadow,transform",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    borderColor: {
      default: null,
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
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
    pointerEvents: {
      default: null,
      ":disabled": "none",
    },
    opacity: {
      default: null,
      ":disabled": "60%",
    },
  },
  selected: {
    borderColor: {
      default: "color-mix(in oklch,var(--accent) 35%,var(--border))",
      "@media (hover: hover)": {
        default: null,
        ":hover": "color-mix(in oklch,var(--accent) 55%,var(--border))",
      },
    },
    backgroundColor: "var(--accent-soft)",
    color: "var(--accent)",
  },
  invalid: {
    borderColor: {
      default: "color-mix(in oklch,var(--danger) 60%,var(--border))",
      "@media (hover: hover)": {
        default: null,
        ":hover": "color-mix(in oklch,var(--danger) 70%,var(--border))",
      },
    },
    backgroundColor: {
      default: "color-mix(in oklch,var(--danger) 4%,var(--bg-elev))",
      "@media (hover: hover)": {
        default: null,
        ":hover": "color-mix(in oklch,var(--danger) 8%,var(--bg-elev))",
      },
    },
    color: "color-mix(in oklch,var(--danger) 55%,var(--fg-muted))",
    "--sx-shadow":
      "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--danger) 12%,transparent))",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
  unselected: {
    borderColor: "var(--border)",
    backgroundColor: {
      default: "var(--bg-elev)",
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
  },
});
