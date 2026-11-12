<script lang="ts">
  import type { InputProps } from "./types";
  import InputControl from "./input-control.svelte";

  let { value = $bindable(), type = "text", ...rest }: InputProps = $props();
</script>

<InputControl bind:value {type} {...rest} />
