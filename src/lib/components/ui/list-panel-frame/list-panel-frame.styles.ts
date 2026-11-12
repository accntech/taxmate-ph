import * as stylex from "@stylexjs/stylex";

export const listPanel = stylex.create({
  root: {
    containerType: "inline-size",
    containerName: "page",
    position: "relative",
    isolation: "isolate",
    borderRadius: "var(--radius-2xl)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--bg-elev)",
  },
  loadingAnnouncement: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    borderWidth: "0",
  },
});
