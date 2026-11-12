import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "root": {
    "display": "flex",
    "width": "100%",
    "minWidth": "calc(var(--spacing) * 0)",
    "paddingBlock": "calc(var(--spacing) * 1)",
    "color": "var(--fg)",
    "--sx-outline-style": "none",
    "outlineStyle": "none"
  },
  "textStates": {
    "::selection": {
      "backgroundColor": "var(--accent)",
      "color": "var(--accent-fg)"
    },
    "::placeholder": {
      "color": "var(--fg-subtle)"
    }
  },
  "disabledStates": {
    "transitionProperty": "color,box-shadow,border-color",
    "transitionTimingFunction": "var(--sx-ease, var(--default-transition-timing-function))",
    "transitionDuration": "var(--sx-duration, var(--default-transition-duration))",
    "cursor": {
      "default": null,
      ":disabled": "not-allowed"
    },
    "opacity": {
      "default": null,
      ":disabled": "50%"
    }
  },
  "grouped": {
    "flex": 1,
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "0px",
    "backgroundColor": "transparent",
    "paddingInline": "calc(var(--spacing) * 0)",
    "--sx-shadow": {
      "default": null,
      ":focus-visible": "0 0 #0000"
    },
    "boxShadow": {
      "default": null,
      ":focus-visible": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)"
    }
  },
  "standalone": {
    "borderRadius": "var(--radius-md)",
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "1px",
    "borderColor": "var(--border)",
    "backgroundColor": "var(--bg-input)",
    "paddingInline": "calc(var(--spacing) * 3)",
    "--sx-shadow": "var(--shadow-ui-sm)",
    "boxShadow": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)"
  },
  "touch": {
    "minHeight": "calc(var(--spacing) * 12)",
    "fontSize": "var(--text-base)",
    "lineHeight": "var(--sx-leading, var(--text-base--line-height))"
  }
});
