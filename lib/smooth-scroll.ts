/** Eases mouse-wheel scrolling: a notch glides instead of jumping 100 px, so everything tied to the scroll moves smoothly too. */
export function startSmoothScroll(): () => void {
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  let target = window.scrollY;
  let current = window.scrollY;
  let lastSet = current;
  let raf = 0;
  let last = 0;

  const limit = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  function frame(now: number) {
    raf = 0;
    const dt = Math.min(Math.max((now - last) / 1000, 0.001), 0.05);
    last = now;
    // reduced motion keeps a short glide: it softens the jump without a long slide
    current += (target - current) * (1 - Math.exp(-dt / (calm.matches ? 0.045 : 0.1)));
    if (Math.abs(target - current) < 0.4) current = target;
    lastSet = current;
    window.scrollTo({ top: current, behavior: "instant" as ScrollBehavior });
    if (current !== target) raf = window.requestAnimationFrame(frame);
  }

  function insideScroller(node: EventTarget | null, dy: number): boolean {
    let el = node instanceof Element ? node : null;
    while (el && el !== document.body && el !== document.documentElement) {
      if (/(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1) {
        const atTop = el.scrollTop <= 0;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
        if ((dy < 0 && !atTop) || (dy > 0 && !atBottom)) return true;
      }
      el = el.parentElement;
    }
    return false;
  }

  function onWheel(event: WheelEvent) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    // small pixel deltas come from trackpads, which already scroll smoothly
    if (event.deltaMode === 0 && Math.abs(event.deltaY) < 40) return;

    const dy = event.deltaY * (event.deltaMode === 1 ? 40 : event.deltaMode === 2 ? window.innerHeight : 1);
    if (insideScroller(event.target, dy)) return;
    const max = limit();
    if (max <= 0) return;

    if (!raf) current = target = lastSet = window.scrollY;
    const next = Math.min(max, Math.max(0, target + dy));
    if (next === target && !raf) return;

    event.preventDefault();
    target = next;
    if (!raf) {
      last = performance.now();
      raf = window.requestAnimationFrame(frame);
    }
  }

  function onScroll() {
    if (Math.abs(window.scrollY - lastSet) <= 2) return;
    // the scrollbar, the keyboard or a link moved the page: follow instead of fighting it
    window.cancelAnimationFrame(raf);
    raf = 0;
    current = target = lastSet = window.scrollY;
  }

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    window.cancelAnimationFrame(raf);
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("scroll", onScroll);
  };
}
