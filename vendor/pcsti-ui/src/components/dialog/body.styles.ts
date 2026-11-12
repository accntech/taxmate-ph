import * as stylex from "@stylexjs/stylex";

export const dialogBody = stylex.create({
  belowHeader: {
    marginTop: "calc(var(--spacing) * 4)",
  },
  scrollable: {
    marginInline: "calc(var(--spacing) * -5)",
    minHeight: "0px",
    flex: "1",
    overflowY: "auto",
    overscrollBehavior: "contain",
    paddingInline: "calc(var(--spacing) * 5)",
  },
  fadeFrame: {
    display: "flex",
    flexDirection: "column",
    marginInline: "calc(var(--spacing) * -5)",
    minHeight: "0px",
    flex: "1",
  },
  fadeTrack: {
    marginInline: "0px",
  },
});
