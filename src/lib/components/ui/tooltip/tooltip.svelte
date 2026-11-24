<script lang="ts">
  import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from '@ui-sdk/svelte/tooltip';
  import * as stylex from '@stylexjs/stylex';
  import type { Snippet } from 'svelte';
  import { styleAttributes } from '../styles/style-attributes';
  import { tooltip as tooltipLayout } from './tooltip.styles';

  type Placement = 'top' | 'right' | 'bottom' | 'left';
  type Align = 'start' | 'center' | 'end';

  let {
    label,
    placement = 'bottom',
    align = 'center',
    clamp = true,
    floating = false,
    offset = '8px',
    sx,
    class: className = '',
    children,
  }: {
    label: string;
    placement?: Placement;
    align?: Align;
    clamp?: boolean;
    floating?: boolean;
    offset?: string;
    sx?: stylex.StyleXStyles;
    class?: string;
    children: Snippet;
  } = $props();

  let root = $state<HTMLSpanElement | null>(null);
  const gap = $derived(Number.isFinite(Number.parseFloat(offset)) ? Number.parseFloat(offset) : 8);

  // Existing callers supply their own controls inside a parameterless snippet.
  // Forward the SDK's description from the wrapper to that focusable control.
  function describeChild(wrapper: HTMLSpanElement) {
    let control: HTMLElement | null = null;
    let description = '';
    function removeDescription() {
      if (!control || !description) return;
      const remaining = (control.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(id => id && id !== description);
      if (remaining.length) control.setAttribute('aria-describedby', remaining.join(' '));
      else control.removeAttribute('aria-describedby');
    }
    function syncDescription() {
      const next = wrapper.querySelector<HTMLElement>('button, a[href], input, select, textarea, [tabindex]');
      const nextDescription = wrapper.getAttribute('aria-describedby') ?? '';
      if (next !== control || nextDescription !== description) {
        removeDescription();
        control = next;
        description = nextDescription;
      }
      if (!control || !description) return;
      const ids = new Set((control.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean));
      ids.add(description);
      const value = [...ids].join(' ');
      if (control.getAttribute('aria-describedby') !== value) control.setAttribute('aria-describedby', value);
    }
    syncDescription();
    const observer = new MutationObserver(syncDescription);
    observer.observe(wrapper, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-describedby'] });
    return () => {
      observer.disconnect();
      removeDescription();
    };
  }

  // Keep the explicit clamp opt-out available while the SDK handles normal positioning.
  function preserveUnclampedPosition(node: HTMLElement) {
    $effect(() => {
      if (clamp || !root) return;
      const anchor = root;
      function position() {
        if (!node.matches(':popover-open')) return;
        const trigger = anchor.getBoundingClientRect();
        const tip = { width: node.offsetWidth, height: node.offsetHeight };
        let left = trigger.left + (trigger.width - tip.width) / 2;
        let top = placement === 'top' ? trigger.top - tip.height - gap : trigger.bottom + gap;
        if (align === 'start') left = trigger.left;
        if (align === 'end') left = trigger.right - tip.width;
        if (placement === 'left' || placement === 'right') {
          left = placement === 'left' ? trigger.left - tip.width - gap : trigger.right + gap;
          top = trigger.top + (trigger.height - tip.height) / 2;
        }
        if (node.style.left !== `${left}px`) node.style.left = `${left}px`;
        if (node.style.top !== `${top}px`) node.style.top = `${top}px`;
        if (node.dataset.side !== placement) node.dataset.side = placement;
      }
      const observer = new MutationObserver(position);
      observer.observe(node, { attributes: true, attributeFilter: ['style', 'data-side'] });
      const resize = new ResizeObserver(position);
      resize.observe(anchor);
      resize.observe(node);
      window.addEventListener('scroll', position, true);
      window.addEventListener('resize', position);
      position();
      return () => {
        observer.disconnect();
        resize.disconnect();
        window.removeEventListener('scroll', position, true);
        window.removeEventListener('resize', position);
      };
    });
  }
</script>

<Tooltip delay={0} closeDelay={0} closeOnPress={false} type="description">
  <TooltipTrigger aria-label={label}>
    {#snippet render({ props })}
      <span
        {...props}
        bind:this={root}
        {@attach describeChild}
        {...styleAttributes(
          [floating ? tooltipLayout.floatingTrigger : tooltipLayout.trigger, sx],
          [className].flat(Infinity).filter(Boolean).join(' '),
        )}
      >
        {@render children()}
      </span>
    {/snippet}
  </TooltipTrigger>
  <TooltipContent
    side={placement}
    {align}
    sideOffset={gap}
    collisionPadding={clamp ? 8 : 0}
    container={floating ? root?.ownerDocument.body : undefined}
    class={[stylex.attrs(tooltipLayout.popup, floating && tooltipLayout.floatingPopup).class, 'tooltip-bubble']}
    style={`--tooltip-enter-duration: ${floating ? 130 : 150}ms; --tooltip-exit-duration: ${floating ? 90 : 150}ms;`}
  >
    {#snippet render({ props, children: content, state })}
      <div {...props} {@attach preserveUnclampedPosition}>
        {@render content?.(state)}
      </div>
    {/snippet}
    {label}
    <TooltipArrow class="tooltip-arrow" />
  </TooltipContent>
</Tooltip>

<style>
  :global(.tooltip-bubble) {
    opacity: 1;
    scale: 1;
    transform-origin: var(--transform-origin);
    transition: opacity var(--tooltip-enter-duration) var(--ease-out), scale var(--tooltip-enter-duration) var(--ease-out);
  }
  :global(.tooltip-bubble[data-starting-style]),
  :global(.tooltip-bubble[data-ending-style]) {
    opacity: 0;
    scale: 0.97;
  }
  :global(.tooltip-bubble[data-ending-style]) {
    transition-duration: var(--tooltip-exit-duration);
  }
  :global(.tooltip-arrow) {
    position: absolute;
    box-sizing: border-box;
    width: 0.5rem;
    height: 0.5rem;
    background: var(--bg-elev);
    border-style: solid;
    border-color: var(--border);
    transform: rotate(45deg);
  }
  :global(.tooltip-bubble[data-side='top'] .tooltip-arrow) {
    bottom: calc(-0.25rem - 1px);
    border-width: 0 1px 1px 0;
  }
  :global(.tooltip-bubble[data-side='right'] .tooltip-arrow) {
    left: calc(-0.25rem - 1px) !important;
    border-width: 0 0 1px 1px;
  }
  :global(.tooltip-bubble[data-side='bottom'] .tooltip-arrow) {
    top: calc(-0.25rem - 1px);
    border-width: 1px 0 0 1px;
  }
  :global(.tooltip-bubble[data-side='left'] .tooltip-arrow) {
    right: calc(-0.25rem - 1px);
    border-width: 1px 1px 0 0;
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.tooltip-bubble) { transition: none; scale: 1; }
  }
</style>
