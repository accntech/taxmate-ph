<script lang="ts">
  import { icons as passwordInputIcons } from "./index.icons";
  import { Icon as SolarIcon } from "../icon/base";

  import { glyphs } from "../glyphs";

  import { passwordInput } from "./password-input.styles";

  import * as stylex from "@stylexjs/stylex";
  import type { HTMLInputAttributes } from "svelte/elements";
  import InputControl from "../input/input-control-base.svelte";

  let {
    value = $bindable(),
    invalid = false,
    sx,
    class: className = "",
    ...rest
  }: {
    value?: string;
    invalid?: boolean;
    class?: string;
  } & Omit<HTMLInputAttributes, "value" | "class" | "type"> & {
      sx?: stylex.StyleXStyles;
    } = $props();

  let show = $state(false);
</script>

<InputControl
  type={show ? "text" : "password"}
  bind:value
  {invalid}
  {sx}
  class={[className].filter(Boolean).join(" ")}
  autocomplete="current-password"
  {...rest}
>
  {#snippet leading()}
    <span
      data-icon
      class={[stylex.attrs([passwordInput.lockIcon]).class]}
      aria-hidden="true"><SolarIcon icon={glyphs.password} /></span
    >
  {/snippet}
  {#snippet trailing()}
    <button
      type="button"
      tabindex="-1"
      class={[stylex.attrs(passwordInput.toggleButton).class]}
      aria-label={show ? "Hide password" : "Show password"}
      onclick={() => (show = !show)}
    >
      {#if show}
        <span
          data-icon
          class={[stylex.attrs(passwordInput.toggleIcon).class]}
          aria-hidden="true"
          ><SolarIcon icon={passwordInputIcons.hideIcon} /></span
        >
      {:else}
        <span
          data-icon
          class={[stylex.attrs(passwordInput.toggleIcon).class]}
          aria-hidden="true"
          ><SolarIcon icon={passwordInputIcons.showIcon} /></span
        >
      {/if}
    </button>
  {/snippet}
</InputControl>
