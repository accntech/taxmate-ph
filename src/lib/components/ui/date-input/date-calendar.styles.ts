import * as stylex from "@stylexjs/stylex";

export const calendar = stylex.create({
  root: {
    width: "calc(var(--spacing) * 64)",
    padding: "calc(var(--spacing) * 2)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navigationButton: {
    display: "grid",
    width: "calc(var(--spacing) * 7)",
    height: "calc(var(--spacing) * 7)",
    placeItems: "center",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    transitionProperty: "background-color,border-color,color,box-shadow",
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
        ":hover:not(:disabled)":
          "color-mix(in oklch,var(--accent) 15%,var(--bg-hover))",
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
  navigationIcon: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
  },
  viewButton: {
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "var(--spacing)",
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--fg)",
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
        ":hover:not(:disabled)":
          "color-mix(in oklch,var(--accent) 15%,var(--bg-hover))",
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
  decadeLabel: {
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "var(--spacing)",
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--fg)",
  },
  days: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: "calc(var(--spacing) * 0.5)",
    textAlign: "center",
    fontSize: "12px",
  },
  weekday: {
    paddingBlock: "var(--spacing)",
    fontSize: "11px",
    color: "var(--fg-subtle)",
  },
  day: {
    width: "calc(var(--spacing) * 8)",
    height: "calc(var(--spacing) * 8)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
      ':is([data-selected="true"])': "var(--accent)",
    },
    fontSize: "12.5px",
    transitionProperty: "background-color,border-color,color,box-shadow",
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
        ':hover:not([data-selected="true"]):not(:disabled)':
          "color-mix(in oklch,var(--accent) 15%,var(--bg-hover))",
      },
      ':is([data-selected="true"])': "var(--accent)",
    },
    "--sx-shadow": {
      default: null,
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 18%,transparent))",
      ':is([data-selected="true"]:focus-visible)':
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 35%,transparent))",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
      ':is([data-selected="true"]:focus-visible)':
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
      ':is([data-today="true"])':
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    pointerEvents: {
      default: null,
      ':is([data-disabled="true"])': "none",
    },
    opacity: {
      default: null,
      ':is([data-disabled="true"])': "50%",
    },
    color: {
      default: null,
      ':is([data-outside-month="true"])': "var(--fg-subtle)",
      ':is([data-selected="true"])': "var(--accent-fg)",
    },
    "--sx-ring-shadow": {
      default: null,
      ':is([data-today="true"])':
        "var(--sx-ring-inset,) 0 0 0 calc(1px + var(--sx-ring-offset-width)) var(--sx-ring-color, currentcolor)",
    },
    "--sx-ring-color": {
      default: null,
      ':is([data-today="true"])':
        "color-mix(in oklab, var(--accent) 50%, transparent)",
    },
  },
  periods: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "var(--spacing)",
  },
  period: {
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
      ':is([data-selected="true"])': "var(--accent)",
    },
    padding: "calc(var(--spacing) * 2)",
    fontSize: "12.5px",
    transitionProperty: "background-color,border-color,color,box-shadow",
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
        ':hover:not([data-selected="true"]):not(:disabled)':
          "color-mix(in oklch,var(--accent) 15%,var(--bg-hover))",
      },
      ':is([data-selected="true"])': "var(--accent)",
    },
    "--sx-shadow": {
      default: null,
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 18%,transparent))",
      ':is([data-selected="true"]:focus-visible)':
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 35%,transparent))",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
      ':is([data-selected="true"]:focus-visible)':
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    pointerEvents: {
      default: null,
      ':is([data-disabled="true"])': "none",
    },
    opacity: {
      default: null,
      ':is([data-disabled="true"])': "50%",
    },
    color: {
      default: null,
      ':is([data-selected="true"])': "var(--accent-fg)",
    },
  },
});
