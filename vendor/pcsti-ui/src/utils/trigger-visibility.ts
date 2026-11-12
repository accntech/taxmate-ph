/** Whether some part of an anchor is visible, including clipping and sticky overlays. */
function triggerIsVisible(trigger: HTMLElement, panel: HTMLElement, backdrop?: HTMLElement): boolean {
  if (!trigger.isConnected || !trigger.getClientRects().length) return false;
  const visibility = getComputedStyle(trigger).visibility;
  if (visibility === 'hidden' || visibility === 'collapse') return false;

  const rect = trigger.getBoundingClientRect();
  let left = Math.max(0, rect.left);
  let top = Math.max(0, rect.top);
  let right = Math.min(document.documentElement.clientWidth, rect.right);
  let bottom = Math.min(window.innerHeight, rect.bottom);
  const clips = /^(auto|scroll|hidden|clip|overlay)$/;
  for (let element: HTMLElement | null = trigger; element; element = element.parentElement) {
    const style = getComputedStyle(element);
    if (style.opacity === '0' || style.contentVisibility === 'hidden') return false;
    if (element === trigger) continue;
    const bounds = element.getBoundingClientRect();
    if (clips.test(style.overflowX)) {
      left = Math.max(left, bounds.left + element.clientLeft);
      right = Math.min(right, bounds.left + element.clientLeft + element.clientWidth);
    }
    if (clips.test(style.overflowY)) {
      top = Math.max(top, bounds.top + element.clientTop);
      bottom = Math.min(bottom, bounds.top + element.clientTop + element.clientHeight);
    }
  }
  if (right <= left || bottom <= top) return false;

  // IntersectionObserver v1 does not detect occlusion by a sticky header.
  // Ignore the dropdown itself: collision placement can overlap its own anchor.
  const insetX = Math.min(1, (right - left) / 2);
  const insetY = Math.min(1, (bottom - top) / 2);
  return [
    [(left + right) / 2, (top + bottom) / 2],
    [left + insetX, top + insetY],
    [right - insetX, top + insetY],
    [left + insetX, bottom - insetY],
    [right - insetX, bottom - insetY],
  ].some(([x, y]) => {
    const hit = document.elementsFromPoint(x, y).find(element => !panel.contains(element) && !backdrop?.contains(element));
    return !!hit && trigger.contains(hit);
  });
}

/** Watch only while a dropdown is open; dismissal must not refocus its hidden trigger. */
export function watchTriggerVisibility(
  trigger: HTMLElement,
  panel: HTMLElement,
  dismiss: () => void,
  backdrop?: HTMLElement,
): () => void {
  let active = true;
  let frame = 0;
  const check = () => {
    frame = 0;
    if (active && !triggerIsVisible(trigger, panel, backdrop)) dismiss();
  };
  const schedule = () => {
    if (active && !frame) frame = requestAnimationFrame(check);
  };
  const intersection = typeof IntersectionObserver === 'undefined'
    ? undefined : new IntersectionObserver(schedule);
  intersection?.observe(trigger);
  const resize = new ResizeObserver(schedule);
  resize.observe(trigger);
  const mutations = new MutationObserver(schedule);
  for (let element: HTMLElement | null = trigger; element; element = element.parentElement) {
    mutations.observe(element, { attributes: true, attributeFilter: ['class', 'style', 'hidden'] });
  }
  window.addEventListener('scroll', schedule, { capture: true, passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  schedule();
  return () => {
    active = false;
    cancelAnimationFrame(frame);
    intersection?.disconnect();
    resize.disconnect();
    mutations.disconnect();
    window.removeEventListener('scroll', schedule, true);
    window.removeEventListener('resize', schedule);
  };
}
