import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "panel": {
    "borderColor": "var(--border)",
    "backgroundColor": "var(--bg-elev)",
    "--sx-shadow": "var(--shadow-ui-sm)",
    "boxShadow": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)"
  },
  "muted": {
    "borderColor": "var(--border-soft)",
    "backgroundColor": "var(--bg-elev-2)"
  },
  "flat": {
    "borderColor": "var(--border-soft)",
    "backgroundColor": "transparent"
  },
  "sm": {
    "padding": "calc(var(--spacing) * 3)"
  },
  "md": {
    "padding": "calc(var(--spacing) * 4)"
  },
  "lg": {
    "padding": "calc(var(--spacing) * 5)"
  },
  "root": {
    "borderRadius": "var(--radius-panel)",
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "1px"
  },
  "interactive": {
    "transitionProperty": "border-color,box-shadow,transform",
    "transitionTimingFunction": "var(--sx-ease, var(--default-transition-timing-function))",
    "transitionDuration": "150ms",
    "--sx-duration": "150ms",
    "borderColor": {
      "default": null,
      ":hover": {
        "default": null,
        "@media (hover: hover)": {
          "default": "var(--accent)",
          "@supports (color: color-mix(in lab, red, red))": "color-mix(in oklab, var(--accent) 40%, transparent)"
        }
      }
    },
    "--sx-shadow": {
      "default": null,
      ":hover": {
        "default": null,
        "@media (hover: hover)": "var(--shadow-ui-md)"
      }
    },
    "boxShadow": {
      "default": null,
      ":hover": {
        "default": null,
        "@media (hover: hover)": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)"
      }
    },
    "scale": {
      "default": null,
      ":active": 0.99
    }
  }
});
