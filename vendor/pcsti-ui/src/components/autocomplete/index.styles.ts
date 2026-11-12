import * as stylex from "@stylexjs/stylex";

export const autocomplete = stylex.create({
  root: {
    position: "relative",
  },
  input: {
    boxShadow: "none",
    minWidth: "0px",
    flex: "1",
    backgroundColor: "transparent",
    color: "var(--fg)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    "::placeholder": {
      color: "var(--fg-subtle)",
    },
    cursor: {
      default: null,
      ":disabled": "not-allowed",
    },
  },
  toggleButton: {
    display: "grid",
    width: "calc(var(--spacing) * 6)",
    height: "calc(var(--spacing) * 6)",
    flex: "none",
    placeItems: "center",
    borderRadius: "var(--radius-sm)",
    color: {
      default: "var(--fg-subtle)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    transitionProperty:
      "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --sx-gradient-from, --sx-gradient-via, --sx-gradient-to",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    cursor: {
      default: null,
      ":disabled": "not-allowed",
    },
    opacity: {
      default: null,
      ":disabled": "50%",
    },
  },
  chevron: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
  },
  popup: {
    position: "absolute",
    insetInline: "0px",
    top: "100%",
    zIndex: 30,
    marginTop: "var(--spacing)",
    transformOrigin: "top",
    overflow: "hidden",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border)",
    backgroundColor: "var(--bg-elev)",
    "--sx-shadow": "var(--shadow-lg)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
  scrollFrame: {
    position: "relative",
  },
  options: {
    maxHeight: "calc(var(--row,32px) * var(--max,8))",
    overflow: "auto",
    paddingBlock: "var(--spacing)",
  },
  emptyMessage: {
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
    fontSize: "12px",
    color: "var(--fg-muted)",
  },
  option: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    textAlign: "left",
    fontSize: "13px",
    color: "var(--fg)",
    transitionProperty: "background-color,border-color,color,box-shadow",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
    "--sx-outline-style": "none",
    outlineStyle: "none",
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
  highlighted: {
    backgroundColor: "var(--bg-hover)",
  },
  scrollUpFade: {
    pointerEvents: "none",
    position: "absolute",
    insetInline: "0px",
    top: "0px",
    zIndex: 10,
    display: "flex",
    height: "calc(var(--spacing) * 6)",
    alignItems: "flex-start",
    justifyContent: "center",
    "--sx-gradient-position": {
      default: "to bottom",
      "@supports (background-image: linear-gradient(in lab, red, red))":
        "to bottom in oklab",
    },
    backgroundImage: "linear-gradient(var(--sx-gradient-stops))",
    "--sx-gradient-from": "var(--bg-elev)",
    "--sx-gradient-stops":
      "var(--sx-gradient-via-stops, var(--sx-gradient-position), var(--sx-gradient-from) var(--sx-gradient-from-position), var(--sx-gradient-to) var(--sx-gradient-to-position))",
    "--sx-gradient-to": "transparent",
    paddingTop: "calc(var(--spacing) * 0.5)",
    opacity: {
      default: "0%",
      ":is([data-show])": "100%",
    },
    transitionProperty: "opacity",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "180ms",
    "--sx-duration": "180ms",
    "--sx-ease": "var(--ease-out)",
  },
  scrollIcon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    color: "var(--fg-subtle)",
  },
  scrollDownFade: {
    pointerEvents: "none",
    position: "absolute",
    insetInline: "0px",
    bottom: "0px",
    zIndex: 10,
    display: "flex",
    height: "calc(var(--spacing) * 6)",
    alignItems: "flex-end",
    justifyContent: "center",
    "--sx-gradient-position": {
      default: "to top",
      "@supports (background-image: linear-gradient(in lab, red, red))":
        "to top in oklab",
    },
    backgroundImage: "linear-gradient(var(--sx-gradient-stops))",
    "--sx-gradient-from": "var(--bg-elev)",
    "--sx-gradient-stops":
      "var(--sx-gradient-via-stops, var(--sx-gradient-position), var(--sx-gradient-from) var(--sx-gradient-from-position), var(--sx-gradient-to) var(--sx-gradient-to-position))",
    "--sx-gradient-to": "transparent",
    paddingBottom: "calc(var(--spacing) * 0.5)",
    opacity: {
      default: "0%",
      ":is([data-show])": "100%",
    },
    transitionProperty: "opacity",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "180ms",
    "--sx-duration": "180ms",
    "--sx-ease": "var(--ease-out)",
  },
  inputFrame: {
    display: "flex",
    minHeight: "calc(var(--spacing) * 9.5)",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border)",
      ":focus-within": "color-mix(in oklch,var(--accent) 60%,var(--border))",
      ":hover:not(:focus-within)":
        "color-mix(in oklch,var(--fg-subtle) 30%,var(--border))",
      ':is([data-invalid="true"])':
        "color-mix(in oklch,var(--danger) 60%,var(--border)) !important",
    },
    backgroundColor: {
      default: "var(--bg-input)",
      ":focus-within": "var(--bg-elev)",
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    fontSize: "13px",
    transitionProperty: "all",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
    "--sx-shadow": {
      default: null,
      ":focus-within":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 18%,transparent))",
      ':is([data-invalid="true"])':
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--danger) 12%,transparent)) !important",
    },
    boxShadow: {
      default: null,
      ":focus-within":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
      ':is([data-invalid="true"])':
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow) !important",
    },
  },
});
