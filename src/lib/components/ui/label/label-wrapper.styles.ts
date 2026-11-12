import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "root": {
    "fontSize": "var(--form-label-size)",
    "lineHeight": "var(--form-label-line-height)",
    "display": "flex",
    "alignItems": "center",
    "gap": "calc(var(--spacing) * 1.5)",
    "--sx-font-weight": "var(--font-weight-medium)",
    "fontWeight": "var(--font-weight-medium)",
    "color": "var(--fg-muted)"
  },
  "disabledGroup": {
    "pointerEvents": {
      "default": null,
      ":is(:where(.group)[data-disabled=\"true\"] *)": "none"
    },
    "opacity": {
      "default": null,
      ":is(:where(.group)[data-disabled=\"true\"] *)": "50%"
    }
  },
  "disabledPeer": {
    "WebkitUserSelect": "none",
    "userSelect": "none",
    "cursor": {
      "default": null,
      ":is(:where(.peer):disabled ~ *)": "not-allowed"
    },
    "opacity": {
      "default": null,
      ":is(:where(.peer):disabled ~ *)": "50%"
    }
  }
});
