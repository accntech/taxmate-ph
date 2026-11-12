import stylex from "@stylexjs/unplugin";

/** Svelte must compile its markup before StyleX processes the resulting JavaScript. */
export function stylexPlugin({ testing = false, htmlInjection = true } = {}) {
  const options = {
    useCSSLayers: {
      before: ["theme", "base", "components"],
      after: ["overrides"],
      prefix: "stylex",
    },
    externalPackages: ["@pcsti/ui"],
    cssInjectionTarget: (fileName: string) =>
      /(?:^|\/)0\.[^/]+\.css$/.test(fileName),
  };
  return {
    // Vitest needs the compiler without Vite's browser-HMR polling timer.
    ...(testing ? stylex.rollup(options) : stylex.vite(options)),
    ...(testing && {
      // Layout imports remain resolvable in SSR tests without starting HMR.
      resolveId(id: string) {
        if (id === "virtual:stylex:runtime") return id;
      },
      load(id: string) {
        if (id === "virtual:stylex:runtime") return "export {};";
      },
    }),
    // SvelteKit renders its own HTML and loads the dev runtime in its layout.
    ...(!htmlInjection && { transformIndexHtml: undefined }),
    enforce: undefined,
  };
}
