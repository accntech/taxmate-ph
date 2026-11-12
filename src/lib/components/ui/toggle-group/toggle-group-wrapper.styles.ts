import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "root": {
    "position": "relative",
    "display": "inline-flex",
    "alignItems": "stretch",
    "gap": "calc(var(--spacing) * 0)"
  },
  "outlined": {
    "minHeight": "calc(var(--spacing) * 8)",
    "borderRadius": "var(--radius-md)",
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "1px",
    "borderColor": "var(--border)",
    "backgroundColor": "var(--bg-elev-2)",
    "padding": "calc(var(--spacing) * 0.5)"
  },
  "option": {
    "position": "relative",
    "zIndex": 1,
    "display": "grid",
    "placeItems": "center",
    "borderRadius": "var(--radius-sm)",
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "1px",
    "borderColor": "transparent",
    "paddingInline": "calc(var(--spacing) * 2)"
  },
  "motion": {
    "transitionProperty": "color,background-color,border-color,box-shadow",
    "transitionTimingFunction": "var(--sx-ease, var(--default-transition-timing-function))",
    "transitionDuration": "150ms",
    "--sx-duration": "150ms",
    "--sx-outline-style": "none",
    "outlineStyle": "none"
  },
  "focusBorder": {
    "borderColor": {
      "default": null,
      ":focus-visible": {
        "default": "var(--accent)",
        "@supports (color: color-mix(in lab, red, red))": "color-mix(in oklch,var(--accent) 60%,var(--border))"
      }
    }
  },
  "focusHalo": {
    "--sx-shadow": {
      "default": null,
      ":focus-visible": {
        "default": "0 0 0 3px var(--sx-shadow-color, var(--accent))",
        "@supports (color: color-mix(in lab, red, red))": "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 18%,transparent))"
      }
    },
    "boxShadow": {
      "default": null,
      ":focus-visible": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)"
    }
  },
  "pressedOutline": {
    "backgroundColor": "var(--bg-elev)",
    "color": "var(--fg)",
    "--sx-shadow": "0 1px 3px 0 var(--sx-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--sx-shadow-color, rgb(0 0 0 / 0.1))",
    "boxShadow": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)"
  },
  "idleOutline": {
    "color": {
      "default": "var(--fg-muted)",
      ":hover": {
        "default": null,
        "@media (hover: hover)": "var(--fg)"
      }
    }
  },
  "pressedGhost": {
    "backgroundColor": "var(--bg-hover)",
    "color": "var(--fg)"
  },
  "idleGhost": {
    "color": {
      "default": "var(--fg-subtle)",
      ":hover": {
        "default": null,
        "@media (hover: hover)": "var(--fg)"
      }
    },
    "backgroundColor": {
      "default": null,
      ":hover": {
        "default": null,
        "@media (hover: hover)": "var(--bg-hover)"
      }
    }
  }
});
