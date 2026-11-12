import { host } from "../theme.stylex";
import * as stylex from "@stylexjs/stylex";

export const navItem = stylex.create({
  row: {
    display: "flex",
    width: "100%",
    cursor: "pointer",
    alignItems: "center",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
      ":is([data-active])": "var(--border)",
    },
    backgroundColor: {
      default: "transparent",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
      ":is([data-active])": "var(--bg-elev)",
    },
    paddingBlock: "calc(var(--spacing) * 1.75)",
    textAlign: "left",
    fontSize: "13px",
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
      ":is([data-active])": "var(--fg)",
    },
    "--sx-outline-style": "none",
    outlineStyle: "none",
    userSelect: "none",
    transition:
      "background-color 120ms var(--ease-out),\tcolor 120ms var(--ease-out),\tborder-color 120ms var(--ease-out),\tbox-shadow 120ms var(--ease-out),\ttransform 160ms var(--ease-out),\tpadding 260ms var(--ease-drawer),\tgap 260ms var(--ease-drawer)",
    "--sx-shadow": {
      default: null,
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 18%,transparent))",
      ":is([data-active])": "var(--shadow-sm)",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
      ":is([data-active])":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    "--sx-scale-x": {
      default: null,
      ":active": "97%",
    },
    "--sx-scale-y": {
      default: null,
      ":active": "97%",
    },
    "--sx-scale-z": {
      default: null,
      ":active": "97%",
    },
    scale: {
      default: null,
      ":active": "var(--sx-scale-x) var(--sx-scale-y)",
    },
  },
  collapsed: {
    justifyContent: "center",
    gap: "0px",
    paddingInline: "calc(var(--spacing) * 3.5)",
  },
  expanded: {
    gap: "calc(var(--spacing) * 2.5)",
    paddingInline: "calc(var(--spacing) * 2.5)",
  },
  icon: {
    height: "calc(var(--spacing) * 4)",
    width: "calc(var(--spacing) * 4)",
    flex: "none",
    color: {
      default: "var(--fg-subtle)",
      ":is(:where(.group\\/nr)[data-active] *)": "var(--accent)",
    },
    opacity: {
      default: "85%",
      ":is(:where(.group\\/nr)[data-active] *)": "100%",
    },
    transitionProperty: "color,opacity,transform",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "120ms",
    "--sx-duration": "120ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-scale-x": {
      default: null,
      ":is(:where(.group\\/nr)[data-active] *)": "105%",
    },
    "--sx-scale-y": {
      default: null,
      ":is(:where(.group\\/nr)[data-active] *)": "105%",
    },
    "--sx-scale-z": {
      default: null,
      ":is(:where(.group\\/nr)[data-active] *)": "105%",
    },
    scale: {
      default: null,
      ":is(:where(.group\\/nr)[data-active] *)":
        "var(--sx-scale-x) var(--sx-scale-y)",
    },
  },
  label: {
    minWidth: "0px",
    flex: "1",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    transition:
      "opacity 260ms var(--ease-drawer),\tmax-width 260ms var(--ease-drawer),\tmax-height 260ms var(--ease-drawer),\twidth 260ms var(--ease-drawer),\tpadding 260ms var(--ease-drawer),\ttransform 200ms var(--ease-out)",
  },
  caret: {
    height: "calc(var(--spacing) * 3.5)",
    flex: "none",
    overflow: "hidden",
    color: "var(--fg-subtle)",
    transition:
      "opacity 260ms var(--ease-drawer),\tmax-width 260ms var(--ease-drawer),\tmax-height 260ms var(--ease-drawer),\twidth 260ms var(--ease-drawer),\tpadding 260ms var(--ease-drawer),\ttransform 200ms var(--ease-out)",
    rotate: {
      default: null,
      ":is([data-rotate])": "90deg",
    },
  },
  hiddenLabel: {
    maxWidth: "0px",
    opacity: "0%",
  },
  visibleLabel: {
    maxWidth: "100%",
    opacity: "100%",
  },
  hiddenCaret: {
    width: "0px",
    opacity: "0%",
  },
  visibleCaret: {
    width: "calc(var(--spacing) * 3.5)",
    opacity: "100%",
  },
  flyoutTitle: {
    marginBottom: "calc(var(--spacing) * 1.5)",
    display: "block",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    borderColor: "var(--border-soft)",
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingTop: "var(--spacing)",
    paddingBottom: "calc(var(--spacing) * 2.25)",
    fontSize: "10.5px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    "--sx-tracking": "var(--tracking-widest)",
    letterSpacing: "var(--tracking-widest)",
    color: "var(--fg-subtle)",
    textTransform: "uppercase",
  },
  flyoutLink: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: "calc(var(--spacing) * 1.75)",
    fontSize: "13px",
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
      ":is([data-active])": "var(--fg)",
    },
    transitionProperty: "background,color,border-color,transform,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "120ms",
    "--sx-duration": "120ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    userSelect: "none",
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
      ":is([data-active])": "var(--bg-elev)",
    },
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
    "--sx-scale-x": {
      default: null,
      ":active": "97%",
    },
    "--sx-scale-y": {
      default: null,
      ":active": "97%",
    },
    "--sx-scale-z": {
      default: null,
      ":active": "97%",
    },
    scale: {
      default: null,
      ":active": "var(--sx-scale-x) var(--sx-scale-y)",
    },
    "--sx-font-weight": {
      default: null,
      ":is([data-active])": "var(--font-weight-medium)",
    },
    fontWeight: {
      default: null,
      ":is([data-active])": "var(--font-weight-medium)",
    },
  },
  childLabel: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  children: {
    marginTop: "calc(var(--spacing) * 0.5)",
    marginRight: "0px",
    marginBottom: "calc(var(--spacing) * 1.5)",
    marginLeft: "calc(var(--spacing) * 5.5)",
    display: "flex",
    listStyleType: "none",
    flexDirection: "column",
    gap: "1px",
    borderLeftStyle: "solid",
    borderLeftWidth: "1px",
    borderColor: "var(--border-soft)",
    paddingLeft: "calc(var(--spacing) * 2.5)",
  },
  childRow: {
    animationName: host.navigationSubmenu,
    animationDuration: "200ms",
    animationTimingFunction: "var(--ease-out)",
    animationDelay: "var(--d)",
    animationIterationCount: 1,
    animationDirection: "normal",
    animationFillMode: "both",
    animationPlayState: "running",
  },
  childLink: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: "calc(var(--spacing) * 1.25)",
    fontSize: "12.5px",
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
      ":is([data-active])": "var(--fg)",
    },
    transitionProperty: "background,color,border-color,transform,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "120ms",
    "--sx-duration": "120ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    userSelect: "none",
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
      ":is([data-active])": "var(--bg-elev)",
    },
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
    "--sx-scale-x": {
      default: null,
      ":active": "97%",
    },
    "--sx-scale-y": {
      default: null,
      ":active": "97%",
    },
    "--sx-scale-z": {
      default: null,
      ":active": "97%",
    },
    scale: {
      default: null,
      ":active": "var(--sx-scale-x) var(--sx-scale-y)",
    },
    "--sx-font-weight": {
      default: null,
      ":is([data-active])": "var(--font-weight-medium)",
    },
    fontWeight: {
      default: null,
      ":is([data-active])": "var(--font-weight-medium)",
    },
  },
  flyout: {
    pointerEvents: {
      default: "none",
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group\\/ng):hover *)": "auto",
      },
      ":is(:where(.group\\/ng):has(:focus-visible) *)": "auto",
    },
    position: "fixed",
    zIndex: 60,
    margin: "0px",
    display: "flex",
    minWidth: "calc(var(--spacing) * 50)",
    transformOrigin: "0",
    "--sx-translate-x": {
      default: "calc(var(--spacing) * -1)",
      "@media (prefers-reduced-motion: reduce)": "0px",
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group\\/ng):hover *)": "0px",
      },
      ":is(:where(.group\\/ng):has(:focus-visible) *)": "0px",
    },
    translate: {
      default: "var(--sx-translate-x) var(--sx-translate-y)",
      "@media (prefers-reduced-motion: reduce)":
        "var(--sx-translate-x) var(--sx-translate-y)",
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group\\/ng):hover *)":
          "var(--sx-translate-x) var(--sx-translate-y)",
      },
      ":is(:where(.group\\/ng):has(:focus-visible) *)":
        "var(--sx-translate-x) var(--sx-translate-y)",
    },
    listStyleType: "none",
    flexDirection: "column",
    gap: "1px",
    borderRadius: "var(--radius-lg)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border)",
    backgroundColor: "var(--bg-elev)",
    padding: "calc(var(--spacing) * 2)",
    opacity: {
      default: "0%",
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group\\/ng):hover *)": "100%",
      },
      ":is(:where(.group\\/ng):has(:focus-visible) *)": "100%",
    },
    "--sx-shadow": "var(--shadow-lg)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    transitionProperty: {
      default: "opacity,translate",
      "@media (prefers-reduced-motion: reduce)": "opacity",
    },
    transitionTimingFunction: {
      default: "var(--ease-out)",
      "@media (prefers-reduced-motion: reduce)":
        "var(--sx-ease, var(--default-transition-timing-function))",
    },
    transitionDuration: {
      default: "100ms",
      "@media (prefers-reduced-motion: reduce)": "75ms",
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group\\/ng):hover *)": "140ms",
      },
      ":is(:where(.group\\/ng):has(:focus-visible) *)": "140ms",
    },
    "--sx-duration": {
      default: "100ms",
      "@media (prefers-reduced-motion: reduce)": "75ms",
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group\\/ng):hover *)": "140ms",
      },
      ":is(:where(.group\\/ng):has(:focus-visible) *)": "140ms",
    },
    "--sx-ease": "var(--ease-out)",
    "::before": {
      content: "var(--sx-content)",
      position: "absolute",
      insetBlock: "0px",
      left: "calc(var(--spacing) * -3)",
      width: "calc(var(--spacing) * 3)",
      "--sx-content": "''",
    },
  },
  childMarker: {
    width: "var(--spacing)",
    height: "var(--spacing)",
    flex: "none",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: {
      default: "var(--fg-subtle)",
      ":is(:where(.group\\/nc)[data-active] *)": "var(--accent)",
    },
    "--sx-shadow": {
      default: null,
      ":is(:where(.group\\/nc)[data-active] *)":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 25%,transparent))",
    },
    boxShadow: {
      default: null,
      ":is(:where(.group\\/nc)[data-active] *)":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
  },
  tooltip: {
    pointerEvents: "none",
    position: "fixed",
    zIndex: 60,
    "--sx-translate-y": "calc(calc(1 / 2 * 100%) * -1)",
    translate: "var(--sx-translate-x) var(--sx-translate-y)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border)",
    backgroundColor: "var(--bg-elev)",
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    fontSize: "12.5px",
    whiteSpace: "nowrap",
    color: "var(--fg)",
    opacity: {
      default: "0%",
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group\\/nl):hover *)": "100%",
      },
      ":is(:where(.group\\/nl):has(:focus-visible) *)": "100%",
    },
    "--sx-shadow": "var(--shadow-lg)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    transitionProperty: "opacity",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "150ms",
    "--sx-duration": "150ms",
    "--sx-ease": "var(--ease-out)",
    "::before": {
      content: "var(--sx-content)",
      position: "absolute",
      insetBlock: "0px",
      left: "calc(var(--spacing) * -3)",
      width: "calc(var(--spacing) * 3)",
      "--sx-content": "''",
    },
  },
});
