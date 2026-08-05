import type Lenis from "lenis";

/**
 * A tiny registry for the single app-wide Lenis instance.
 *
 * Lenis is created once in `SmoothScroll` and lives for the whole session —
 * it is never torn down between client-side navigations. That means its
 * internal scroll state survives a route change, so anything that resets the
 * page position has to tell Lenis about it too, or Lenis will re-apply the
 * previous offset on its next frame and drag the new page back down.
 */
let instance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

/**
 * Jump to the very top, instantly and without animation.
 *
 * Resets both the real scroll position and Lenis's internal target, so there
 * is nothing left to spring back to. Falls back to the native API if Lenis
 * has not mounted yet (first paint, or reduced-motion setups).
 */
/**
 * Anything holding its own scroll-derived state can subscribe here to be told
 * when the page position was changed out from under it.
 *
 * The hero canvas is the reason this exists: it lives in the root layout and is
 * built once, so its scroll timeline outlives every navigation and has no other
 * way to learn that the page jumped.
 */
const realignListeners = new Set<() => void>();

export function onScrollRealigned(listener: () => void) {
  realignListeners.add(listener);
  return () => {
    realignListeners.delete(listener);
  };
}

function notifyRealigned() {
  realignListeners.forEach((listener) => listener());
}

export function scrollToTop() {
  if (instance) {
    // `immediate` skips the easing; `force` works even while Lenis is stopped.
    instance.scrollTo(0, { immediate: true, force: true });
  }
  window.scrollTo(0, 0);
  notifyRealigned();
}

/**
 * Adopt whatever position the browser has already put us at.
 *
 * Used after a back/forward navigation, where the browser restores the old
 * offset and we want to keep it — Lenis just needs to be told, or it will
 * animate away from the restored spot toward its own stale target.
 */
export function syncScrollToWindow() {
  instance?.scrollTo(window.scrollY, { immediate: true, force: true });
  notifyRealigned();
}
