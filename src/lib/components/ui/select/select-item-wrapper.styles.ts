import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "root": {
    "position": "relative",
    "display": "flex",
    "width": "100%",
    "cursor": "default",
    "alignItems": "center",
    "gap": "calc(var(--spacing) * 2)",
    "borderRadius": "var(--radius-sm)",
    "paddingBlock": "calc(var(--spacing) * 2)",
    "paddingRight": "calc(var(--spacing) * 8)",
    "paddingLeft": "calc(var(--spacing) * 2.5)",
    "fontSize": "var(--text-sm)",
    "lineHeight": "var(--sx-leading, var(--text-sm--line-height))",
    "--sx-outline-style": "none",
    "outlineStyle": "none",
    "WebkitUserSelect": "none",
    "userSelect": "none",
    "pointerEvents": {
      "default": null,
      ":is([data-disabled])": "none"
    },
    "opacity": {
      "default": null,
      ":is([data-disabled])": "50%"
    },
    "backgroundColor": {
      "default": null,
      ":is([data-highlighted])": "var(--bg-hover)"
    }
  },
  "selectionIndicator": {
    "position": "absolute",
    "right": "calc(var(--spacing) * 2)",
    "display": "flex",
    "alignItems": "center",
    "color": "var(--accent)"
  }
});
