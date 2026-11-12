import * as stylex from "@stylexjs/stylex";

/** Preserve native inline styles and CSS hooks alongside compiled StyleX attributes. */
export function styleAttributes(
  styles: stylex.StyleXStyles,
  className = "",
  inlineStyle?: string | null,
) {
  const attributes = stylex.attrs(styles);
  return {
    ...attributes,
    class: [attributes.class, className].filter(Boolean).join(" "),
    style:
      [attributes.style, inlineStyle].filter(Boolean).join(";") || undefined,
  };
}
