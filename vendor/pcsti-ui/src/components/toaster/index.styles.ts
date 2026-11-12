import * as stylex from "@stylexjs/stylex";

export const toaster = stylex.create({
  root: {
    pointerEvents: "none",
    position: "fixed",
    insetInline: {
      default: "calc(var(--spacing) * 3)",
      "@media (width >= 40rem)": "auto",
    },
    top: {
      default: "max(1rem, env(safe-area-inset-top))",
      "@media (width >= 40rem)": "auto",
    },
    bottom: {
      default: "auto",
      "@media (width >= 40rem)": "calc(var(--spacing) * 4)",
    },
    zIndex: 100,
    margin: "0px",
    display: "flex",
    width: {
      default: "auto",
      "@media (width >= 40rem)": "min(24rem, calc(100vw - 2rem))",
    },
    flexDirection: {
      default: "column",
      "@media (width >= 40rem)": "column-reverse",
    },
    alignItems: {
      default: "center",
      "@media (width >= 40rem)": "stretch",
    },
    gap: "calc(var(--spacing) * 2)",
    overflow: "visible",
    borderStyle: "solid",
    borderWidth: "0px",
    backgroundColor: "transparent",
    padding: "0px",
    right: {
      default: null,
      "@media (width >= 40rem)": "calc(var(--spacing) * 4)",
    },
  },
});
