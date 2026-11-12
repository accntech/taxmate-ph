import * as stylex from "@stylexjs/stylex";

export const sheet = stylex.create({
  right: {
    insetBlock: "0px",
    right: "0px",
    left: "auto",
  },
  left: {
    insetBlock: "0px",
    right: "auto",
    left: "0px",
  },
  panel: {
    position: "relative",
    display: "flex",
    height: "100dvh",
    minHeight: "0px",
    flexDirection: "column",
    overflow: "hidden",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border)",
    backgroundColor: "var(--bg-elev)",
    "--sx-shadow":
      "0 20px 25px -5px var(--sx-shadow-color, rgb(0 0 0 / 0.1)), 0 8px 10px -6px var(--sx-shadow-color, rgb(0 0 0 / 0.1))",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
  header: {
    flex: "none",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    borderColor: "var(--border-soft)",
    padding: "calc(var(--spacing) * 5)",
  },
  closeButtonSpace: {
    paddingRight: "calc(var(--spacing) * 12)",
  },
  title: {
    margin: "0px",
    fontSize: "15px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    "--sx-tracking": "var(--tracking-tight)",
    letterSpacing: "var(--tracking-tight)",
    color: "var(--fg)",
  },
  description: {
    fontSize: "13px",
    "--sx-leading": "var(--leading-snug)",
    lineHeight: "var(--leading-snug)",
    color: "var(--fg-subtle)",
  },
  belowTitle: {
    marginTop: "calc(var(--spacing) * 1.5)",
  },
  closeButton: {
    position: "absolute",
    top: "calc(var(--spacing) * 3)",
    right: "calc(var(--spacing) * 3)",
    zIndex: 20,
    display: "inline-flex",
    width: "calc(var(--spacing) * 7)",
    height: "calc(var(--spacing) * 7)",
    flex: "none",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    color: {
      default: "var(--fg-subtle)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    transitionProperty: "background-color,color,border-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
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
  },
  closeIcon: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
  },
  body: {
    minHeight: "0px",
    flex: "1",
    overflowY: "auto",
  },
  footer: {
    display: "flex",
    flex: "none",
    justifyContent: "flex-end",
    gap: "calc(var(--spacing) * 2)",
    borderTopStyle: "solid",
    borderTopWidth: "1px",
    borderColor: "var(--border-soft)",
    padding: "calc(var(--spacing) * 4)",
  },
  root: {
    position: "fixed",
    isolation: "isolate",
    margin: "0px",
    height: "100dvh",
    maxHeight: "none",
    width: "100dvw",
    maxWidth: "none",
    borderStyle: "solid",
    borderWidth: "0px",
    backgroundColor: "transparent",
    padding: "0px",
    color: "var(--fg)",
    opacity: {
      default: "0%",
      ":is([open], :popover-open, :open)": "100%",
    },
    transitionProperty: "opacity,transform,overlay,display",
    transitionTimingFunction: "var(--ease-drawer)",
    transitionDuration: {
      default: "220ms",
      ":is([open], :popover-open, :open)": "320ms",
    },
    "--sx-duration": {
      default: "220ms",
      ":is([open], :popover-open, :open)": "320ms",
    },
    "--sx-ease": "var(--ease-drawer)",
    "::backdrop": {
      backgroundColor:
        "color-mix(in oklab, var(--color-black) 45%, transparent)",
      opacity: {
        default: "0%",
        ":is([open], :popover-open, :open)": "100%",
      },
      transitionProperty: "opacity,overlay,display",
      transitionTimingFunction: "var(--ease-out)",
      transitionDuration: {
        default: "180ms",
        ":is([open], :popover-open, :open)": "240ms",
      },
      "--sx-duration": {
        default: "180ms",
        ":is([open], :popover-open, :open)": "240ms",
      },
      "--sx-ease": "var(--ease-out)",
    },
  },
});
