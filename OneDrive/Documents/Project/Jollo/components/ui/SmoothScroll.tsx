"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerLenis, scrollToTop, syncScrollToWindow } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  /**
   * Set when the next pathname change came from the back/forward buttons.
   * Those should keep the position the browser restored, unlike a link click.
   */
  const cameFromHistory = useRef(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
    });
    registerLenis(lenis);

    // Drive Lenis from GSAP ticker so ScrollTrigger stays in sync
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Notify ScrollTrigger of every Lenis scroll update
    lenis.on("scroll", ScrollTrigger.update);

    /**
     * Clicking a link to the page you are already on does not change the
     * pathname, so React never re-renders and nothing resets the scroll. This
     * catches those clicks for every internal link on the site at once —
     * navbar, mobile menu, footer, buttons — instead of needing an onClick
     * wired into each one.
     */
    const onDocumentClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      // Modifier clicks open a new tab; leave them alone.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      // Deliberately no `defaultPrevented` check here: Next's <Link> calls
      // preventDefault() on the anchor to take over navigation, and the anchor
      // sits deeper in the DOM than document, so by the time this listener runs
      // every internal link already looks "handled". Bailing on that flag would
      // skip the exact clicks we care about.

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      // A deliberate click supersedes any pending history flag, so a popstate
      // that never changed the pathname can't leave it stuck on.
      cameFromHistory.current = false;

      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.origin);
      } catch {
        return;
      }
      // Skips mailto:, tel: and anything off-site.
      if (url.origin !== window.location.origin) return;
      // An in-page anchor is asking for a specific position, not the top.
      if (url.hash) return;

      if (url.pathname === window.location.pathname) scrollToTop();
    };
    document.addEventListener("click", onDocumentClick);

    const onPopState = () => {
      cameFromHistory.current = true;
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onDocumentClick);
      window.removeEventListener("popstate", onPopState);
      lenis.destroy();
      registerLenis(null);
      gsap.ticker.remove(onTick);
    };
  }, []);

  /**
   * Every route change starts at the beginning of the new page.
   *
   * This effect runs after the incoming page's own effects, so any
   * ScrollTriggers it registered already exist by the time we refresh them —
   * and we refresh from the top, so their start/end positions are measured
   * against a settled layout rather than a stale scroll offset.
   */
  useEffect(() => {
    // Back/forward is the exception: the browser has already restored the
    // position the visitor left off at, and taking that away would be worse
    // than the problem this fixes. Lenis just needs to agree with it.
    const restoring = cameFromHistory.current;
    cameFromHistory.current = false;

    if (!restoring) scrollToTop();

    const frame = requestAnimationFrame(() => {
      if (restoring) syncScrollToWindow();
      else scrollToTop();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return <>{children}</>;
}
