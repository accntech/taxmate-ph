# PCSTI UI local library

This package contains all reusable UI source copied from
`/Volumes/SSK Drive/pcsti/packages/ui` on 2026-11-12: 343 source files covering
78 component families, shared utilities, types, icons, and styles. The external
path records provenance only. Runtime code, styles, imports, and build tooling
resolve entirely inside this repository and its installed dependencies.

`@pcsti/ui` is a local Bun workspace dependency. Run `bun install` from the
project root after cloning; the original drive is not needed.

## Imports and application adapters

Use public component entry points for direct library use:

```ts
import { DateInput } from '@pcsti/ui/date-input';
import { FormSection } from '@pcsti/ui/form-section';
import { lockBodyScroll } from '@pcsti/ui/body-scroll-lock';
```

The root entry point also exports the components and public utilities. Only
imported components enter the application's production bundle.

For current application forms, use the adapters exported by
`src/lib/components/ui`. These retain existing labels, help, errors, required
states, events, and stored form values while composing the PCSTI controls.
Specialized input adaptations are intentional:

- TIN fields retain the application's 13-digit contract: nine TIN digits and a
  four-digit branch. The upstream input accepts up to 14 digits and defaults a
  nine-digit TIN to a three-digit branch; the application adapter preserves the
  project's own validation and field mapping instead.
- Currency fields retain strict decimal strings and the application's precision,
  invalid-input feedback, and persistence/calculation behavior. The upstream
  component's numeric callback and clamping behavior do not replace those rules.
- Number inputs suit quantities, years, and counts. TIN, RDO and ZIP identifiers
  stay text-based so leading zeros remain intact.

## Styling and dependencies

Vite compiles Svelte before StyleX using `stylex.vite.ts`. The root layout loads
shared scale/composition defaults and StyleX's development runtime; production
CSS is emitted by the compiler. The application retains its existing theme.
The library's browser reset is available but is not loaded over Tailwind's reset.

PCSTI's Solar Icons v2 dependency stays isolated in this workspace; existing
application imports continue using v1. `sveltekit-superforms` is an explicit
runtime/type dependency for the reusable `super-form` component.

## Local compatibility changes

The source snapshot is kept local so compatibility changes can be reviewed with
the application. Compared with the copied source:

- The Svelte peer minimum matches the checked application version, 5.55.9.
- `ImportDialogFileInput` uses non-generic `Uint8Array` for TypeScript 5.6.
- `Select` forwards `aria-label`, `aria-labelledby`, and `aria-required` to its
  native trigger to preserve application accessibility contracts. The focused
  trigger exposes the highlighted option through `aria-activedescendant`, and
  Tab closes the popup without consuming normal focus movement.
- The StyleX helper resolves the development runtime to an empty module in SSR
  tests, avoiding browser HMR polling during the test process.
- Wrapped input controls suppress the host's inner focus shadow. Their rounded
  wrappers retain the focus/error halo, and forced-colors outlines remain visible.

## Verification

Run these commands from the project root:

```sh
bun run check:pcsti  # checks every vendored component and TypeScript module
bun run check        # checks the application and the complete local library
bun run test:run     # application behavior tests
bun run build        # production compilation, including StyleX CSS emission
```
