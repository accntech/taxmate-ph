<script lang="ts">
  import type { ComponentProps } from "svelte";
  import Button from "../button/index.svelte";

  type Props = Omit<
    ComponentProps<typeof Button>,
    "href" | "type" | "role" | "aria-checked" | "onclick" | "onkeydown"
  > & {
    checked: boolean;
    onSelect: () => void;
  };

  let {
    checked,
    disabled = false,
    onSelect,
    children,
    ...rest
  }: Props = $props();

  function select() {
    if (!disabled) onSelect();
  }

  function navigate(event: KeyboardEvent) {
    if (
      disabled ||
      ![
        "ArrowRight",
        "ArrowDown",
        "ArrowLeft",
        "ArrowUp",
        "Home",
        "End",
      ].includes(event.key)
    )
      return;
    const current = event.currentTarget as HTMLButtonElement;
    const group = current.closest('[role="radiogroup"]');
    if (!group) return;
    const options = Array.from(
      group.querySelectorAll<HTMLButtonElement>('[role="radio"]'),
    ).filter(
      (option) =>
        !option.disabled && option.closest('[role="radiogroup"]') === group,
    );
    const index = options.indexOf(current);
    if (index < 0 || !options.length) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? options.length - 1
          : (index +
              (event.key === "ArrowRight" || event.key === "ArrowDown"
                ? 1
                : -1) +
              options.length) %
            options.length;
    options[next].focus();
    options[next].click();
  }
</script>

<Button
  {...rest}
  type="button"
  role="radio"
  tabindex={rest.tabindex ?? (checked ? 0 : -1)}
  aria-checked={checked}
  {disabled}
  onclick={select}
  onkeydown={navigate}
>
  {@render children?.()}
</Button>
