type ScrollLock = {
  count: number;
  overflow: string;
  paddingRight: string;
};

const locks = new WeakMap<HTMLElement, ScrollLock>();

export function lockBodyScroll() {
  const { body, documentElement: html } = document;
  let lock = locks.get(body);
  if (!lock) {
    lock = {
      count: 0,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    locks.set(body, lock);
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
  }
  lock.count++;
  const currentLock = lock;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    // Overlays can close in any order; only the final owner restores scrolling.
    if (--currentLock.count > 0) return;
    body.style.overflow = currentLock.overflow;
    body.style.paddingRight = currentLock.paddingRight;
    locks.delete(body);
  };
}
