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
  <path d="M14.7 6A6 6 0 1 0 6 14.7" />
  <path d="M10 5.65a3.5 3.5 0 1 0-4.35 4.35" />
  <circle cx="15" cy="15" r="6" />
  <circle cx="15" cy="15" r="3.5" />
  <path d="M15 9v1M21 15h-1M15 21v-1M9 15h1" />
</svg>
