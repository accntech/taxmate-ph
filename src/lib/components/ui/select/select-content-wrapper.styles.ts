import * as stylex from "@stylexjs/stylex";

export const wrapperStyles = stylex.create({
  "root": {
    "zIndex": 50,
    "maxHeight": "min(18rem, var(--bits-select-content-available-height))",
    "minWidth": "var(--bits-select-anchor-width)",
    "overflowX": "hidden",
    "overflowY": "auto",
    "borderRadius": "var(--radius-md)",
    "borderStyle": "var(--sx-border-style)",
    "borderWidth": "1px",
    "borderColor": "var(--border)",
    "backgroundColor": "var(--bg-elev)",
    "color": "var(--fg)",
    "--sx-shadow": "var(--shadow-ui-md)",
    "boxShadow": "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    "--sx-outline-style": "none",
    "outlineStyle": "none"
  },
  "scrollButton": {
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "paddingBlock": "calc(var(--spacing) * 1)"
  },
  "viewport": {
    "width": "100%",
    "minWidth": "var(--bits-select-anchor-width)",
    "scrollMarginBlock": "calc(var(--spacing) * 1)",
    "padding": "calc(var(--spacing) * 1)"
  }
});
