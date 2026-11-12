<script
  lang="ts"
  generics="T extends Record<string, unknown>, U extends FormPath<T>"
>
  import { styleAttributes } from "../../styles/style-attributes";

  import * as stylex from "@stylexjs/stylex";

  import * as FormPrimitive from "formsnap";
  import type { HTMLAttributes } from "svelte/elements";
  import type { FormPath } from "sveltekit-superforms";

  let {
    sx,
    class: className = "",
    form,
    name,
    children: childrenProp,
    ...rest
  }: FormPrimitive.FieldProps<T, U> & { class?: string } & Omit<
      HTMLAttributes<HTMLDivElement>,
      "class"
    > & { sx?: stylex.StyleXStyles } = $props();
</script>

<FormPrimitive.Field {form} {name}>
  {#snippet children({ constraints, errors, tainted, value })}
    <div
      data-slot="form-item"
      {...rest}
      {...styleAttributes(
        [sx],
        ["field", className].flat(Infinity).filter(Boolean).join(" "),
        rest.style,
      )}
    >
      {@render childrenProp?.({
        constraints,
        errors,
        tainted,
        value: value as T[U],
      })}
    </div>
  {/snippet}
</FormPrimitive.Field>

<style>
  @layer overrides {
    :where(.field > :global(:not(:last-child))) {
      --sx-space-y-reverse: 0;
      margin-block-start: calc(
        calc(var(--spacing) * 2) * var(--sx-space-y-reverse)
      );
      margin-block-end: calc(
        calc(var(--spacing) * 2) * calc(1 - var(--sx-space-y-reverse))
      );
    }
  }
</style>
