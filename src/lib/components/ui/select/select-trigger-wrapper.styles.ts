import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "root": {
    "display": "flex",
    "width": "100%",
    "minWidth": "calc(var(--spacing) * 0)",
    "alignItems": "center",
    "justifyContent": "space-between",
    "gap": "calc(var(--spacing) * 2)",
    "borderRadius": "var(--radius-md)",
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "1px",
    "borderColor": "var(--border)",
    "backgroundColor": "var(--bg-input)",
    "paddingInline": "calc(var(--spacing) * 3)",
    "paddingBlock": "calc(var(--spacing) * 1.5)",
    "textAlign": "left",
    "color": "var(--fg)",
    "--sx-shadow": "var(--shadow-ui-sm)",
    "boxShadow": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    "transitionProperty": "color,box-shadow,border-color",
    "transitionTimingFunction": "var(--sx-ease, var(--default-transition-timing-function))",
    "transitionDuration": "var(--sx-duration, var(--default-transition-duration))",
    "--sx-outline-style": "none",
    "outlineStyle": "none",
    "cursor": {
      "default": null,
      ":disabled": "not-allowed"
    },
    "opacity": {
      "default": null,
      ":disabled": "50%"
    }
  },
  "icon": {
    "flexShrink": 0,
    "color": "var(--fg-subtle)"
  }
});
