import * as stylex from "@stylexjs/stylex";

export const avatar = stylex.create({
  fallback: {
    fontFamily: "var(--font-sans)",
  },
  image: {
    position: "absolute",
    inset: "0px",
    width: "100%",
    height: "100%",
    borderRadius: "calc(infinity * 1px)",
    objectFit: "cover",
  },
  root: {
    position: "relative",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
    borderRadius: "calc(infinity * 1px)",
    textAlign: "center",
    userSelect: "none",
  },
});
