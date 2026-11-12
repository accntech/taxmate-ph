import * as stylex from "@stylexjs/stylex";

export const dialog = stylex.create({
  root: {
    position: "fixed",
    insetInline: "0px",
    top: "auto",
    bottom: "env(safe-area-inset-bottom)",
    margin: {
      default: "0px",
      "@media (width >= 40rem)": "auto",
    },
    height: {
      default: "auto",
      "@media (width >= 40rem)": "fit-content",
    },
    maxHeight: {
      default: "90dvh",
      "@media (width >= 40rem)": "calc(100dvh - 2rem)",
    },
    width: {
      default: "100dvw",
      "@media (width >= 40rem)": "calc(100vw - 2rem)",
    },
    maxWidth: "none",
    borderStyle: "solid",
    borderWidth: "0px",
    backgroundColor: "transparent",
    padding: "0px",
    color: "var(--fg)",
    inset: {
      default: null,
      "@media (width >= 40rem)": "0px",
    },
  },
});
