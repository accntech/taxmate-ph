import stylex from "@stylexjs/unplugin";

/** Svelte must compile its markup before StyleX processes the resulting JavaScript. */
export function stylexPlugin({ testing = false, htmlInjection = true } = {}) {
  const options = {
    devMode: "css-only" as const,
    useCSSLayers: {
      before: ["theme", "base", "components"],
      after: ["overrides"],
      prefix: "stylex",
    },
    cssInjectionTarget: (fileName: string) =>
      /(?:^|\/)0\.[^/]+\.css$/.test(fileName),
  };
  return {
    // Vitest needs the compiler without Vite's browser-HMR polling timer.
    ...(testing ? stylex.rollup(options) : stylex.vite(options)),
    // SvelteKit renders its own HTML and refreshes the stylesheet in its layout.
    ...(!htmlInjection && { transformIndexHtml: undefined }),
    enforce: undefined,
  };
}
