import * as stylex from "@stylexjs/stylex";

export const localImage = stylex.create({
  idleBadgeTheme: {
    scale: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group):hover *)": "1.02",
      },
    },
  },
  fileInput: {
    display: "none",
  },
  dropzone: {
    position: "relative",
    display: "flex",
    minHeight: "calc(var(--spacing) * 52)",
    width: "100%",
    cursor: "pointer",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "calc(var(--spacing) * 3)",
    overflow: "hidden",
    borderRadius: "var(--radius-lg)",
    borderStyle: "dashed",
    borderWidth: "2px",
    "--sx-border-style": "dashed",
    padding: "calc(var(--spacing) * 6)",
    transitionProperty: "transform,border-color,background-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "200ms",
    "--sx-duration": "200ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    borderColor: {
      default: null,
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
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
    scale: {
      default: null,
      ":active": "0.995",
    },
  },
  dragging: {
    scale: "1.01",
    borderColor: "var(--accent)",
    backgroundColor: "color-mix(in oklab, var(--accent) 8%, transparent)",
    "--sx-shadow":
      "0 0 0 4px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 15%,transparent))",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
  idle: {
    borderColor: {
      default: "var(--border-soft)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "color-mix(in oklab, var(--accent) 40%, transparent)",
      },
    },
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "color-mix(in oklab, var(--bg-elev) 30%, transparent)",
      },
    },
  },
  iconBadge: {
    display: "flex",
    width: "calc(var(--spacing) * 16)",
    height: "calc(var(--spacing) * 16)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--radius-2xl)",
    "--sx-shadow": "var(--shadow-sm)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    transitionProperty: "transform,background,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "320ms",
    "--sx-duration": "320ms",
    "--sx-ease": "var(--ease-out)",
  },
  draggingBadge: {
    "--sx-scale-x": "110%",
    "--sx-scale-y": "110%",
    "--sx-scale-z": "110%",
    scale: "var(--sx-scale-x) var(--sx-scale-y)",
    backgroundColor: "color-mix(in oklab, var(--accent) 15%, transparent)",
    "--sx-shadow-color":
      "color-mix(in oklab, color-mix(in oklab, var(--accent) 10%, transparent) var(--sx-shadow-alpha), transparent)",
  },
  idleBadge: {
    "--sx-gradient-position": {
      default: "to bottom",
      "@supports (background-image: linear-gradient(in lab, red, red))":
        "to bottom in oklab",
    },
    backgroundImage: "linear-gradient(var(--sx-gradient-stops))",
    "--sx-gradient-from": "var(--bg-elev)",
    "--sx-gradient-stops":
      "var(--sx-gradient-via-stops, var(--sx-gradient-position), var(--sx-gradient-from) var(--sx-gradient-from-position), var(--sx-gradient-to) var(--sx-gradient-to-position))",
    "--sx-gradient-to": "color-mix(in oklab, var(--bg-elev) 50%, transparent)",
  },
  uploadIcon: {
    width: "calc(var(--spacing) * 7)",
    height: "calc(var(--spacing) * 7)",
    transitionProperty: "color,transform",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "200ms",
    "--sx-duration": "200ms",
    "--sx-ease": "var(--ease-out)",
  },
  draggingIcon: {
    "--sx-translate-y": "calc(var(--spacing) * -0.5)",
    translate: "var(--sx-translate-x) var(--sx-translate-y)",
    color: "var(--accent)",
  },
  idleIcon: {
    color: "var(--fg-muted)",
  },
  instructions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--spacing)",
  },
  prompt: {
    fontSize: "var(--text-sm)",
    lineHeight: "var(--sx-leading, var(--text-sm--line-height))",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    transitionProperty:
      "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --sx-gradient-from, --sx-gradient-via, --sx-gradient-to",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "200ms",
    "--sx-duration": "200ms",
    "--sx-ease": "var(--ease-out)",
  },
  draggingPrompt: {
    color: "var(--accent)",
  },
  idlePrompt: {
    color: "color-mix(in oklab, var(--fg) 70%, transparent)",
  },
  hint: {
    fontSize: "11px",
    color: "var(--fg-muted)",
  },
  separatorRow: {
    display: "flex",
    width: "100%",
    maxWidth: "calc(var(--spacing) * 48)",
    alignItems: "center",
    gap: "calc(var(--spacing) * 3)",
  },
  separator: {
    flex: "1",
    borderColor: "color-mix(in oklab, var(--border-soft) 50%, transparent)",
  },
  error: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 1.5)",
    color: "var(--danger)",
  },
  errorIcon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    flex: "none",
  },
  errorMessage: {
    fontSize: "var(--text-xs)",
    lineHeight: "var(--sx-leading, var(--text-xs--line-height))",
  },
  browseLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "var(--radius-md)",
    backgroundColor: {
      default: "var(--accent)",
      "@media (hover: hover)": {
        default: null,
        ":is(:where(.group):hover *)": "var(--accent-hover)",
      },
    },
    paddingInline: "calc(var(--spacing) * 6)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--accent-fg)",
    "--sx-shadow": "var(--shadow-sm)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    transitionProperty: "transform,background-color",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
    scale: {
      default: null,
      ":is(:where(.group):active *)": "0.97",
    },
  },
});
