import * as stylex from "@stylexjs/stylex";

export const combobox = stylex.create({
  match: {
    backgroundColor: "var(--accent-soft)",
    color: "inherit",
  },
  displayLabel: {
    maxWidth: "100%",
    flex: "none",
    borderRadius: "0.25rem",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--bg-hover)",
    paddingInline: "calc(var(--spacing) * 1.5)",
    paddingBlock: "calc(var(--spacing) * 0.5)",
    fontSize: "10.5px",
    lineHeight: "calc(var(--spacing) * 4)",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--fg-muted)",
  },
  positioningFrame: {
    position: "relative",
  },
  selection: {
    display: "flex",
    minWidth: "0px",
    flex: "1",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
  },
  secondary: {
    flex: "none",
    fontFamily: "var(--font-mono)",
    color: "var(--fg-muted)",
    "--sx-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)",
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
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
    flex: "none",
    color: "var(--fg-subtle)",
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
    position: "absolute",
    zIndex: 20,
    marginTop: "var(--spacing)",
    width: "100%",
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
  searchRow: {
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    borderColor: "var(--border)",
    padding: "calc(var(--spacing) * 2)",
  },
  searchField: {
    display: "flex",
    height: "calc(var(--spacing) * 8)",
    width: "100%",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "0.25rem",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border)",
      ":focus-within": "var(--field-focus-border, color-mix(in oklch,var(--accent) 60%,var(--border)))",
    },
    backgroundColor: "var(--bg-elev)",
    paddingInline: "calc(var(--spacing) * 2.5)",
    transitionProperty: "border-color,background-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-shadow": {
      default: null,
      ":focus-within":
        "0 0 0 3px var(--sx-shadow-color, var(--field-focus-halo, color-mix(in oklch,var(--accent) 18%,transparent)))",
    },
    boxShadow: {
      default: null,
      ":focus-within":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
  },
  searchIcon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    flex: "none",
    color: "var(--fg-subtle)",
  },
  searchInput: {
    boxShadow: "none",
    minWidth: "0px",
    flex: "1",
    borderStyle: "solid",
    borderWidth: "0px",
    backgroundColor: "transparent",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--sx-leading, var(--text-sm--line-height))",
    color: "var(--fg)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    "::placeholder": {
      color: "var(--fg-subtle)",
    },
  },
  emptyMessage: {
    paddingInline: "calc(var(--spacing) * 3)",
    textAlign: "center",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--sx-leading, var(--text-sm--line-height))",
    color: "var(--fg-subtle)",
  },
  emptyWithCreate: {
    paddingBlock: "calc(var(--spacing) * 3)",
  },
  emptyWithoutCreate: {
    paddingBlock: "calc(var(--spacing) * 4)",
  },
  options: {
    overflowY: "auto",
    paddingBlock: "var(--spacing)",
  },
  spacer: {
    position: "relative",
    width: "100%",
  },
  virtualRow: {
    position: "absolute",
    insetInlineStart: "0px",
    top: "0px",
    width: "100%",
  },
  groupHeader: {
    display: "flex",
    height: "calc(var(--spacing) * 8)",
    alignItems: "center",
    paddingInline: "calc(var(--spacing) * 3)",
    fontSize: "10.5px",
    lineHeight: "calc(var(--spacing) * 4)",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    "--sx-tracking": "var(--tracking-wide)",
    letterSpacing: "var(--tracking-wide)",
    color: "var(--fg-subtle)",
    textTransform: "uppercase",
  },
  groupBody: {
    paddingInline: "var(--spacing)",
  },
  highlighted: {
    backgroundColor: "var(--bg-hover)",
  },
  checkbox: {
    display: "flex",
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
    flex: "none",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.25rem",
    borderStyle: "solid",
    borderWidth: "1px",
  },
  checked: {
    borderColor: "var(--accent)",
    backgroundColor: "var(--accent)",
  },
  unchecked: {
    borderColor: "var(--border)",
    backgroundColor: "var(--bg)",
  },
  checkboxIcon: {
    width: "calc(var(--spacing) * 2.5)",
    height: "calc(var(--spacing) * 2.5)",
    color: "var(--accent-fg)",
  },
  optionDetails: {
    display: "flex",
    minWidth: "0px",
    flex: "1",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
  },
  optionHeading: {
    display: "flex",
    minWidth: "0px",
    flex: "1",
    alignItems: "baseline",
    gap: "calc(var(--spacing) * 2)",
  },
  optionLabel: {
    minWidth: "0px",
    textAlign: "left",
    overflowWrap: "break-word",
  },
  checkIcon: {
    marginLeft: "auto",
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
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
  createFooter: {
    borderTopStyle: "solid",
    borderTopWidth: "1px",
    borderColor: "var(--border-soft)",
  },
  createBadge: {
    display: "grid",
    width: "calc(var(--spacing) * 5)",
    height: "calc(var(--spacing) * 5)",
    flex: "none",
    placeItems: "center",
    borderRadius: "var(--radius-sm)",
    backgroundColor: "var(--accent-soft)",
    color: "var(--accent)",
  },
  createIcon: {
    width: "calc(var(--spacing) * 3)",
    height: "calc(var(--spacing) * 3)",
  },
  createLabel: {
    minWidth: "0px",
    flex: "1",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  createQuery: {
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--accent)",
  },
  trigger: {
    display: "flex",
    height: "calc(var(--spacing) * 10)",
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
      ':is([data-invalid="true"])':
        "var(--field-error-border, color-mix(in oklch,var(--danger) 60%,var(--border))) !important",
    },
    backgroundColor: {
      default: "var(--bg-input)",
      ":focus-visible": "var(--bg-elev)",
    },
    paddingInline: "calc(var(--spacing) * 3)",
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
      ':is([data-invalid="true"])':
        "0 0 0 3px var(--sx-shadow-color, var(--field-error-halo, color-mix(in oklch,var(--danger) 12%,transparent))) !important",
      ':is([data-invalid="true"]):focus-visible':
        "0 0 0 3px var(--sx-shadow-color, var(--field-error-focus-halo, color-mix(in oklch,var(--danger) 24%,transparent))) !important",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
      ':is([data-invalid="true"])':
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow) !important",
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
  option: {
    display: "flex",
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
    paddingInline: "calc(var(--spacing) * 2.5)",
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
  createButton: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "var(--field-focus-border, color-mix(in oklch,var(--accent) 60%,var(--border)))",
    },
    paddingInline: "calc(var(--spacing) * 2.5)",
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
  },
});
