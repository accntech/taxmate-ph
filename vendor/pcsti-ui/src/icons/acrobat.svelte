<script lang="ts">
  import type { IconProps } from "@solar-icons/svelte";

  let { size = 24 }: IconProps = $props();
</script>

<!-- Outline rendition of the Acrobat mark, matching the shared line icons. -->
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="8 8 44 42"
  width={size}
  height={size}
  fill="none"
  stroke="currentColor"
  stroke-width="2.75"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  focusable="false"
>
  <path d="M28.5 12.5C35 12.5 27 34 19 43C13 50 9 44 18 40C26 35 43 31 47 34.5C51 40 38 40 30 27C24 18 25 12.5 28.5 12.5Z" />
</svg>
