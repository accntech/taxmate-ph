# Shared UI components

This folder contains the app adapters and reusable UI source copied from
`/Volumes/SSK Drive/pcsti/packages/ui` on 2026-11-12: 343 source files covering
78 component families, shared utilities, types, icons, and styles. The external
path records provenance only. Runtime code, styles, imports, and build tooling
resolve entirely inside this repository and its installed dependencies.

All component families live directly under `src/lib/components/ui/<component>`.
There is no separate UI workspace or external source dependency. Run `bun install`
from the project root after cloning; the original drive is not needed.

## Imports and application adapters

Use public component entry points for direct library use:

```ts
import { DateInput, BaseDateInput } from '$lib/components/ui/date-input';
import { FormSection } from '$lib/components/ui/form-section';
import { lockBodyScroll } from '$lib/components/ui/utils/body-scroll-lock';
```

The root entry point exports all component families; shared utilities are imported
from `ui/utils`. Prefer a family entry point for focused imports. Only
imported components enter the application's production bundle.

For current application forms, use the adapters exported by
`src/lib/components/ui`. Each family has an `index.ts` entry point. Where an app
adapter and a reusable implementation share a name, the adapter keeps the primary
export and the reusable implementation is exported with a `Base` prefix. Both
live in the same component folder. The adapters retain existing labels, help,
errors, required states, events, and stored form values while composing the
reusable controls.
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

The reusable controls import Solar Icons v2 through the `@solar-icons/svelte-v2`
npm alias; existing application imports continue using v1.
`sveltekit-superforms` is an explicit runtime/type dependency for the reusable `super-form` component.

## Local compatibility changes

The source snapshot is kept local so compatibility changes can be reviewed with
the application. Compared with the copied source:

- The root Svelte dependency minimum matches the checked version, 5.55.9.
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
bun run check        # checks the application and every shared UI component
bun run test:run     # application behavior tests
bun run build        # production compilation, including StyleX CSS emission
```
