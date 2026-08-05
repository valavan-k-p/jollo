"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { servicePages } from "@/content/services";
import ArrowButton from "@/components/clone/ArrowButton";

const GRADIENTS = [
  "linear-gradient(135deg, #1a1a00 0%, #2e2c04 100%)",
  "linear-gradient(135deg, #0f0f0f 0%, #23230a 100%)",
  "linear-gradient(135deg, #141406 0%, #1d1d1d 100%)",
  "linear-gradient(135deg, #101010 0%, #2a2806 100%)",
  "linear-gradient(135deg, #16160a 0%, #2b2a08 100%)",
  "linear-gradient(135deg, #0d0d0d 0%, #262410 100%)",
];

/* Services shown in the scroller. */
const projects = servicePages.map((service, i) => ({
  slug: `/services/${service.slug}`,
  title: service.title,
  gradient: GRADIENTS[i % GRADIENTS.length],
}));

function ProjectItem({ p, index }: { p: (typeof projects)[number]; index: number }) {
  return (
    <div data-typo-scroll-item="" role="listitem" className="typo-scroll__item">
      <a href={p.slug} className="typo-scroll__link">
        <h3 className="typo-scroll__h">{p.title}</h3>
        <div className="typo-scroll__hover-wrap">
          <div className="typo-scroll__hover">
            <div className="typo-scroll__hover-button">
              <ArrowButton>Explore</ArrowButton>
            </div>
            <div className="typo-scroll__hover-img" style={{ background: p.gradient }}>
              <div className="w-full h-full flex items-center justify-center">
                <span
                  className="font-editorial text-[#e9e612]/80 select-none"
                  style={{ fontSize: "4rem", lineHeight: 1 }}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="typo-scroll__img" style={{ background: p.gradient }}>
          <span className="font-editorial text-[#e9e612] select-none text-4xl" aria-hidden="true">
            !
          </span>
        </div>
      </a>
    </div>
  );
}

export default function WorkPage() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let cancelled = false;
    let cleanupFns: (() => void)[] = [];

    // Wait for the custom display fonts to finish swapping in before measuring
    // layout — otherwise item/list heights are captured against the fallback
    // font and the infinite-scroll wrap math drifts, causing periodic jumps.
    const ready = "fonts" in document ? document.fonts.ready : Promise.resolve();
    ready.then(() => {
      if (cancelled) return;
      cleanupFns.push(setupScroller(section));
    });

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="bg-[#111111] min-h-screen">
      <section ref={sectionRef} data-lenis-prevent="" className="typo-scroll">
        <div className="typo-scroll_fade" />
        <div className="typo-scroll_fade is-bottom" />
        <div className="typo-scroll__collection">
          {[0, 1, 2].map((listIndex) => (
            <div key={listIndex} data-typo-scroll-list="" role="list" className="typo-scroll__list">
              {projects.map((p, i) => (
                <ProjectItem key={`${listIndex}-${p.title}`} p={p} index={i} />
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function setupScroller(section: HTMLElement) {
  const isDesktop = window.innerWidth >= 992;
  const lists = Array.from(section.querySelectorAll<HTMLElement>("[data-typo-scroll-list]"));
  const list = lists[1];
  const wrapper = list?.parentElement;
  if (!list || !wrapper) return () => {};

  const allItems = Array.from(section.querySelectorAll<HTMLElement>("[data-typo-scroll-item]"));
  const count = projects.length;

  if (isDesktop) {
    allItems.forEach((item) => {
      const hover = item.querySelector(".typo-scroll__hover");
      const button = item.querySelector(".typo-scroll__hover-button");
      const img = item.querySelector(".typo-scroll__hover-img");
      const scale = item.querySelector(".typo-scroll__img");
      if (hover) gsap.set(hover, { y: "100%" });
      if (button) gsap.set(button, { y: "100%" });
      if (img) gsap.set(img, { rotation: 16, x: "-150%", y: "100%" });
      if (scale) gsap.set(scale, { scale: 0 });
    });
  }

  let currentY = 0;
  let targetY = 0;
  const ease = isDesktop ? 0.08 : 0.14;
  let isSnapping = false;
  let snapTimeout: ReturnType<typeof setTimeout> | null = null;
  const snapDuration = 700;

  const autoSpeedFull = 0.6;
  const autoSpeedSlow = 0.15;
  let autoSpeed = autoSpeedFull;
  let autoScrollPaused = false;
  let autoResumeTimeout: ReturnType<typeof setTimeout> | null = null;
  const autoResumeDelay = 2500;

  const slowAutoScroll = () => {
    autoSpeed = autoSpeedSlow;
    autoScrollPaused = false;
  };
  const resumeAutoScroll = () => {
    autoSpeed = autoSpeedFull;
    autoScrollPaused = false;
  };
  const pauseAutoScroll = () => {
    autoScrollPaused = true;
    if (autoResumeTimeout) clearTimeout(autoResumeTimeout);
    autoResumeTimeout = setTimeout(resumeAutoScroll, autoResumeDelay);
  };

  const getItemCenter = (item: HTMLElement) => item.offsetTop + item.offsetHeight / 2;
  const getYForItem = (item: HTMLElement) => window.innerHeight / 2 - getItemCenter(item);

  const startItem = allItems[count];
  currentY = getYForItem(startItem);
  targetY = currentY;
  gsap.set(wrapper, { y: currentY });

  let previousItem: HTMLElement | null = null;

  const parts = (item: HTMLElement) => ({
    hover: item.querySelector(".typo-scroll__hover"),
    button: item.querySelector(".typo-scroll__hover-button"),
    img: item.querySelector(".typo-scroll__hover-img"),
    scale: item.querySelector(".typo-scroll__img"),
  });

  // One paused timeline per item, built once up front. Hovering only plays or
  // reverses it, so there is no per-hover tween allocation and no setTimeout
  // cascade. That matters because the browser re-runs hit-testing while the
  // list scrolls under a stationary cursor, firing hover changes rapidly —
  // the old approach spawned a fresh burst of tweens and timers each time.
  // Reversing also resumes from the current position instead of racing a
  // competing tween, so interrupted hovers stay smooth.
  const timelines = new Map<HTMLElement, gsap.core.Timeline>();

  if (isDesktop) {
    allItems.forEach((item) => {
      const p = parts(item);
      const tl = gsap.timeline({ paused: true });
      if (p.hover) tl.to(p.hover, { y: "0%", duration: 0.7, ease: "power3.out" }, 0);
      if (p.img) tl.to(p.img, { rotation: 6, x: "-150%", y: "50%", duration: 0.8, ease: "power3.out" }, 0.1);
      if (p.scale) tl.to(p.scale, { scale: 1, duration: 0.45, ease: "back.out(1.7)" }, 0.1);
      if (p.button) tl.to(p.button, { y: "0%", duration: 0.7, ease: "power3.out" }, 0.17);
      timelines.set(item, tl);
    });
  }

  const animateOut = (item: HTMLElement | null) => {
    if (!item) return;
    timelines.get(item)?.timeScale(1.4).reverse();
    item.setAttribute("data-typo-scroll-item", "");
  };

  const animateIn = (item: HTMLElement) => {
    timelines.get(item)?.timeScale(1).play();
    item.setAttribute("data-typo-scroll-item", "active");
  };

  const onMouseOver = (e: Event) => {
    if (!isDesktop) return;
    const item = (e.target as HTMLElement).closest<HTMLElement>("[data-typo-scroll-item]");
    if (!item || item === previousItem) return;
    slowAutoScroll();
    animateOut(previousItem);
    animateIn(item);
    previousItem = item;
  };
  const onMouseLeave = () => {
    if (!isDesktop) return;
    resumeAutoScroll();
    animateOut(previousItem);
    previousItem = null;
  };
  section.addEventListener("mouseover", onMouseOver);
  section.addEventListener("mouseleave", onMouseLeave);

  const listHeight = list.offsetHeight;
  const checkInfinite = () => {
    if (currentY < -listHeight * 1.5) { currentY += listHeight; targetY += listHeight; gsap.set(wrapper, { y: currentY }); }
    else if (currentY > -listHeight * 0.5) { currentY -= listHeight; targetY -= listHeight; gsap.set(wrapper, { y: currentY }); }
  };

  const tick = () => {
    if (isSnapping) return;
    if (!autoScrollPaused) {
      targetY -= autoSpeed;
    }
    const delta = targetY - currentY;
    if (Math.abs(delta) < 0.05 && autoScrollPaused) return;
    currentY += delta * ease;
    gsap.set(wrapper, { y: currentY });
    checkInfinite();
  };
  gsap.ticker.add(tick);

  const getNearestItem = () => {
    const centerY = window.innerHeight / 2;
    let nearest: HTMLElement | null = null;
    let nearestDist = Infinity;
    allItems.forEach((item) => {
      const d = Math.abs(centerY - (getItemCenter(item) + currentY));
      if (d < nearestDist) { nearestDist = d; nearest = item; }
    });
    return nearest;
  };

  const snapToNearest = () => {
    isSnapping = true;
    const nearest = getNearestItem();
    if (!nearest) { isSnapping = false; return; }
    const snapY = getYForItem(nearest);
    targetY = snapY;
    const proxy = { y: currentY };
    gsap.to(proxy, {
      y: snapY,
      duration: 1,
      ease: "power4.out",
      onUpdate() { currentY = proxy.y; gsap.set(wrapper, { y: currentY }); checkInfinite(); },
      onComplete() { currentY = snapY; targetY = snapY; isSnapping = false; },
    });
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    isSnapping = false;
    pauseAutoScroll();
    targetY -= e.deltaY;
    if (snapTimeout) clearTimeout(snapTimeout);
    snapTimeout = setTimeout(snapToNearest, snapDuration);
  };
  section.addEventListener("wheel", onWheel, { passive: false });

  let touchLastY = 0;
  const onTouchStart = (e: TouchEvent) => { touchLastY = e.touches[0].clientY; isSnapping = false; pauseAutoScroll(); };
  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const delta = touchLastY - e.touches[0].clientY;
    targetY -= delta * (isDesktop ? 1.5 : 2.5);
    touchLastY = e.touches[0].clientY;
    if (snapTimeout) clearTimeout(snapTimeout);
    snapTimeout = setTimeout(snapToNearest, snapDuration);
  };
  section.addEventListener("touchstart", onTouchStart, { passive: true });
  section.addEventListener("touchmove", onTouchMove, { passive: false });

  return () => {
    gsap.ticker.remove(tick);
    timelines.forEach((tl) => tl.kill());
    timelines.clear();
    if (snapTimeout) clearTimeout(snapTimeout);
    if (autoResumeTimeout) clearTimeout(autoResumeTimeout);
    section.removeEventListener("mouseover", onMouseOver);
    section.removeEventListener("mouseleave", onMouseLeave);
    section.removeEventListener("wheel", onWheel);
    section.removeEventListener("touchstart", onTouchStart);
    section.removeEventListener("touchmove", onTouchMove);
  };
}
