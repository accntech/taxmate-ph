import * as stylex from "@stylexjs/stylex";

export const select = stylex.create({
  invalidBorder: {
    borderColor:
      "var(--field-error-border, color-mix(in oklch,var(--danger) 60%,var(--border))) !important",
  },
  invalidHalo: {
    "--sx-shadow": {
      default: "0 0 0 3px var(--sx-shadow-color, var(--field-error-halo, color-mix(in oklch,var(--danger) 12%,transparent))) !important",
      ":focus-visible": "0 0 0 3px var(--sx-shadow-color, var(--field-error-focus-halo, color-mix(in oklch,var(--danger) 24%,transparent))) !important",
    },
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow) !important",
  },
  root: {
    position: "relative",
  },
  trigger: {
    display: "flex",
    height: "calc(var(--spacing) * 9.5)",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "color-mix(in oklch,var(--fg-subtle) 30%,var(--border))",
      },
      ":focus-visible": "var(--field-focus-border, color-mix(in oklch,var(--accent) 60%,var(--border)))",
    },
    backgroundColor: {
      default: "var(--bg-input)",
      ":focus-visible": "var(--bg-elev)",
    },
    paddingInline: "calc(var(--spacing) * 3)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--sx-leading, var(--text-sm--line-height))",
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
        "0 0 0 3px var(--sx-shadow-color, var(--field-focus-halo, color-mix(in oklch,var(--accent) 18%,transparent)))",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    cursor: {
      default: null,
      ":disabled": "not-allowed",
    },
    opacity: {
      default: null,
      ":disabled": "50%",
    },
  },
  open: {
    backgroundColor: "var(--bg-elev)",
  },
  label: {
    minWidth: "0px",
    flex: "1",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    textAlign: "left",
  },
  placeholder: {
    color: "var(--fg-subtle)",
  },
  chevron: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    flex: "none",
    color: "var(--fg-subtle)",
    transitionProperty: "transform, translate, scale, rotate",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
  },
  openChevron: {
    rotate: "180deg",
  },
  clearButtonSpace: {
    visibility: "hidden",
  },
  clearButton: {
    position: "absolute",
    top: "calc(1 / 2 * 100%)",
    right: "calc(var(--spacing) * 2)",
    display: "grid",
    width: "calc(var(--spacing) * 6)",
    height: "calc(var(--spacing) * 6)",
    "--sx-translate-y": "calc(calc(1 / 2 * 100%) * -1)",
    translate: "var(--sx-translate-x) var(--sx-translate-y)",
    placeItems: "center",
    borderRadius: "var(--radius-sm)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "var(--field-focus-border, color-mix(in oklch,var(--accent) 60%,var(--border)))",
    },
    color: {
      default: "var(--fg-subtle)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    transitionProperty: "background-color,color,border-color,box-shadow",
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
        ":hover": "var(--bg-hover)",
      },
    },
    "--sx-shadow": {
      default: null,
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, var(--field-focus-halo, color-mix(in oklch,var(--accent) 18%,transparent)))",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
  },
  clearIcon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
  },
  popup: {
    position: "fixed",
    zIndex: 100,
    margin: "0px",
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
  above: {
    transformOrigin: "0 100%",
  },
  below: {
    transformOrigin: "0 0",
  },
  options: {
    position: "relative",
    maxHeight: "calc(var(--spacing) * 64)",
    overflowY: "auto",
    padding: "var(--spacing)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
  },
  emptyMessage: {
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
    fontSize: "12.5px",
    color: "var(--fg-subtle)",
  },
  highlighted: {
    backgroundColor: "var(--bg-hover)",
  },
  selected: {
    backgroundColor: "var(--accent-soft)",
  },
  optionDetails: {
    minWidth: "0px",
    flex: "1",
  },
  optionLabel: {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  optionDescription: {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "12px",
    "--sx-leading": "calc(var(--spacing) * 4)",
    lineHeight: "calc(var(--spacing) * 4)",
    color: "var(--fg-subtle)",
  },
  checkIcon: {
    marginLeft: "auto",
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
    flex: "none",
    color: "var(--accent)",
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
  option: {
    display: "flex",
    minHeight: "calc(var(--spacing) * 8)",
    width: "100%",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "var(--field-focus-border, color-mix(in oklch,var(--accent) 60%,var(--border)))",
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    textAlign: "left",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--sx-leading, var(--text-sm--line-height))",
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
        "0 0 0 3px var(--sx-shadow-color, var(--field-focus-halo, color-mix(in oklch,var(--accent) 18%,transparent)))",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    cursor: {
      default: null,
      ":disabled": "not-allowed",
    },
    opacity: {
      default: null,
      ":disabled": "50%",
    },
  },
});
