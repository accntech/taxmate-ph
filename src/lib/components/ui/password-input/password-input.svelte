<script lang="ts">
  import {
    PasswordInput as SdkPasswordInput,
    PasswordInputControl,
    PasswordInputToggle,
  } from "@ui-sdk/svelte/password-input";
  import * as stylex from "@stylexjs/stylex";
  import type { HTMLInputAttributes } from "svelte/elements";
  import { Icon as SolarIcon } from "../icon/base";
  import { glyphs } from "../glyphs";
  import { input } from "../input/input.styles";
  import { styleAttributes } from "../styles/style-attributes";
  import { icons as passwordInputIcons } from "./index.icons";
  import { passwordInput } from "./password-input.styles";

  let {
    value = $bindable(),
    invalid = false,
    sx,
    size,
    class: className = "",
    defaultValue,
    defaultvalue,
    autocomplete = "current-password",
    disabled,
    readonly,
    required,
    name,
    form,
    ...rest
  }: {
    value?: string;
    invalid?: boolean;
    class?: string;
  } & Omit<HTMLInputAttributes, "value" | "class" | "type"> & {
      sx?: stylex.StyleXStyles;
    } = $props();

</script>

<SdkPasswordInput
  bind:value
  defaultValue={(defaultValue ?? defaultvalue)?.toString()}
  autoComplete={autocomplete ?? undefined}
  disabled={disabled ?? undefined}
  readOnly={readonly ?? undefined}
  required={required ?? undefined}
  name={name ?? undefined}
  form={form ?? undefined}
  {...styleAttributes([input.wrapper, input.normal, sx, invalid && input.invalid], className)}
>
  {#snippet render({ props, state })}
    <div {...props} data-invalid={invalid ? "true" : undefined}>
      <span data-icon class={stylex.attrs(passwordInput.lockIcon).class} aria-hidden="true">
        <SolarIcon icon={glyphs.password} />
      </span>
      <PasswordInputControl
        {...rest}
        {size}
        {...styleAttributes(input.control, "password-control", rest.style)}
        aria-invalid={invalid || rest["aria-invalid"] || undefined}
      />
      <PasswordInputToggle
        tabindex={-1}
        class={stylex.attrs(passwordInput.toggleButton).class}
        aria-label={state.visible ? "Hide password" : "Show password"}
      >
        <span data-icon class={stylex.attrs(passwordInput.toggleIcon).class} aria-hidden="true">
          <SolarIcon icon={state.visible ? passwordInputIcons.hideIcon : passwordInputIcons.showIcon} />
        </span>
      </PasswordInputToggle>
    </div>
  {/snippet}
</SdkPasswordInput>

<style>
  :global(.password-control:-webkit-autofill) {
    -webkit-text-fill-color: var(--fg);
    -webkit-box-shadow: 0 0 0 1000px var(--bg-input) inset;
    caret-color: var(--fg);
    transition: background-color 9999s ease-out 0s;
  }
</style>
