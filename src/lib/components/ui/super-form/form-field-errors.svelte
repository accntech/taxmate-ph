<script lang="ts">
  import { fieldErrors } from "./form-field-errors.styles";

  import * as stylex from "@stylexjs/stylex";

  import * as FormPrimitive from "formsnap";

  let {
    sx,
    class: className = "",
    errorClasses = "",
    children,
    ...rest
  }: FormPrimitive.FieldErrorsProps & {
    class?: string;
    errorClasses?: string | null;
  } & { sx?: stylex.StyleXStyles } = $props();
</script>

<FormPrimitive.FieldErrors
  class={[stylex.attrs(fieldErrors.root, sx).class, className]
    .flat(Infinity)
    .filter(Boolean)
    .join(" ")}
  {...rest}
>
  {#snippet children({ errors, errorProps })}
    {#if children}
      {@render children({ errors, errorProps })}
    {:else}
      {#each errors as error (error)}
        <div {...errorProps} class={errorClasses ?? ""}>{error}</div>
      {/each}
    {/if}
  {/snippet}
</FormPrimitive.FieldErrors>
