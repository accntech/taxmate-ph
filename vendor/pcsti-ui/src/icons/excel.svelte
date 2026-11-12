<script lang="ts">
  import type { IconProps } from "@solar-icons/svelte";
  let { size = 24 }: IconProps = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width={size}
  height={size}
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  focusable="false"
>
  <path
    d="M8 6V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2M17 3v18M14 8h7M14 12h7M14 16h7"
  />
  <rect x="2" y="6" width="12" height="12" rx="1.5" />
  <path d="m5.5 9.5 5 5m0-5-5 5" />
</svg>
