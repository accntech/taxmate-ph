<script lang="ts">
  import { Input } from "../input";
  import { formatTinValue, getTinDigits } from "./helpers";
  import { tinInput } from "./index.styles";
  import type { TinInputProps } from "./types";

  let {
    value = $bindable(""),
    placeholder = "000-000-000-000",
    inputSx,
    onbeforeinput,
    oninput,
    onfocus,
    onblur,
    onkeydown,
    ...rest
  }: TinInputProps = $props();

  let focused = $state(false);
  const displayValue = $derived(
    focused ? getTinDigits(value) : formatTinValue(value),
  );

  function handleBeforeInput(
    event: InputEvent & { currentTarget: HTMLInputElement },
  ) {
    if (
      (event.inputType === "insertText" ||
        event.inputType === "insertCompositionText") &&
      event.data &&
      /\D/.test(event.data)
    ) {
      event.preventDefault();
    }
    onbeforeinput?.(event);
  }

  function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
    const digits = getTinDigits(event.currentTarget.value);
    focused = true;
    event.currentTarget.value = digits;
    value = digits;
    oninput?.(event);
  }

  function handleFocus(
    event: FocusEvent & { currentTarget: HTMLInputElement },
  ) {
    focused = true;
    onfocus?.(event);
  }

  function commitValue(input: HTMLInputElement) {
    const formattedValue = formatTinValue(value);
    input.value = formattedValue;
    value = formattedValue;
  }

  function handleBlur(event: FocusEvent & { currentTarget: HTMLInputElement }) {
    focused = false;
    commitValue(event.currentTarget);
    onblur?.(event);
  }

  function handleKeydown(
    event: KeyboardEvent & { currentTarget: HTMLInputElement },
  ) {
    if (event.key === "Enter") {
      focused = false;
      commitValue(event.currentTarget);
    }
    onkeydown?.(event);
  }
</script>

<Input
  {...rest}
  type="text"
  inputmode="numeric"
  maxlength={17}
  {placeholder}
  inputSx={[tinInput.value, inputSx]}
  value={displayValue}
  onbeforeinput={handleBeforeInput}
  oninput={handleInput}
  onfocus={handleFocus}
  onblur={handleBlur}
  onkeydown={handleKeydown} />
