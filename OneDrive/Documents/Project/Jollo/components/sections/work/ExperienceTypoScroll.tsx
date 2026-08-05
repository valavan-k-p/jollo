"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { servicePages } from "@/content/services";

gsap.registerPlugin();

export default function ExperienceTypoScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    // Clone the list to allow infinite scrolling
    const listContainer = list.parentElement;
    if (!listContainer) return;

    // We clone the list twice to ensure we have enough items to scroll infinitely
    const clone1 = list.cloneNode(true) as HTMLElement;
    const clone2 = list.cloneNode(true) as HTMLElement;

    // Add clones
    listContainer.appendChild(clone1);
    listContainer.insertBefore(clone2, list);

    const isDesktop = window.innerWidth >= 992;
    const allItems = Array.from(section.querySelectorAll("[data-typo-scroll-item]")) as HTMLElement[];
    const count = servicePages.length; // original item count

    const wrapper = listContainer;

    if (isDesktop) {
      allItems.forEach((item) => {
        const hover = item.querySelector(".typo-scroll__hover");
        if (hover) gsap.set(hover, { y: "100%" });
      });
    }

    let currentY = 0, targetY = 0;
    const ease = isDesktop ? 0.08 : 0.14;

    const getItemCenter = (item: HTMLElement) => item.offsetTop + item.offsetHeight / 2;
    const getYForItem = (item: HTMLElement) => window.innerHeight / 2 - getItemCenter(item);

    // Start at the first item of the original list (which is now in the middle because of the prepend)
    const startItem = allItems[count];
    if (startItem) {
      currentY = getYForItem(startItem);
      targetY = currentY;
      gsap.set(wrapper, { y: currentY });
    }

    let previousItem: HTMLElement | null = null;
    let hoverDelay: NodeJS.Timeout | undefined = undefined;
    let imgDelay: NodeJS.Timeout | undefined = undefined;

    const parts = (item: HTMLElement) => ({
      hover: item.querySelector(".typo-scroll__hover"),
    });

    const animateOut = (item: HTMLElement | null) => {
      if (!item) return;
      clearTimeout(hoverDelay);
      clearTimeout(imgDelay);
      const p = parts(item);
      if (p.hover) { gsap.killTweensOf(p.hover); gsap.to(p.hover, { y: "100%", duration: 0.5, ease: "power3.in" }); }
      item.setAttribute("data-typo-scroll-item", "");
      item.style.zIndex = "1";
    };

    const animateIn = (item: HTMLElement) => {
      const p = parts(item);
      item.style.zIndex = "10";
      if (p.hover) { gsap.killTweensOf(p.hover); gsap.to(p.hover, { y: "0%", duration: 0.7, ease: "power3.out" }); }
      item.setAttribute("data-typo-scroll-item", "active");
    };

    if (isDesktop) {
      section.addEventListener("mouseover", (e) => {
        const item = (e.target as HTMLElement).closest<HTMLElement>("[data-typo-scroll-item]");
        if (!item || item === previousItem) return;
        animateOut(previousItem);
        animateIn(item);
        previousItem = item;
      });

      section.addEventListener("mouseleave", () => {
        clearTimeout(hoverDelay);
        clearTimeout(imgDelay);
        animateOut(previousItem);
        previousItem = null;
      });
    }

    const listHeight = list.offsetHeight;

    function checkInfinite() {
      if (currentY < -listHeight * 1.5) {
        currentY += listHeight;
        targetY += listHeight;
        gsap.set(wrapper, { y: currentY });
      } else if (currentY > -listHeight * 0.5) {
        currentY -= listHeight;
        targetY -= listHeight;
        gsap.set(wrapper, { y: currentY });
      }
    }

    let isUserInteracting = false;
    let interactionTimeout: NodeJS.Timeout | null = null;
    const autoScrollSpeed = 0.8;

    const handleInteraction = () => {
      isUserInteracting = true;
      if (interactionTimeout) clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        isUserInteracting = false;
      }, 1500);
    };

    const tickerUpdate = () => {
      if (!isUserInteracting) {
        targetY -= autoScrollSpeed;
      }
      currentY += (targetY - currentY) * ease;
      gsap.set(wrapper, { y: currentY });
      checkInfinite();
    };
    gsap.ticker.add(tickerUpdate);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleInteraction();
      targetY -= e.deltaY;
    };
    section.addEventListener("wheel", handleWheel, { passive: false });

    let touchLastY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchLastY = e.touches[0].clientY;
      handleInteraction();
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const delta = touchLastY - e.touches[0].clientY;
      targetY -= delta * (isDesktop ? 1.5 : 2.5);
      touchLastY = e.touches[0].clientY;
      handleInteraction();
    };
    section.addEventListener("touchstart", handleTouchStart, { passive: true });
    section.addEventListener("touchmove", handleTouchMove, { passive: false });

    // Cleanup
    return () => {
      gsap.ticker.remove(tickerUpdate);
      section.removeEventListener("wheel", handleWheel);
      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchmove", handleTouchMove);
      // Remove clones to prevent duplications on fast refresh
      if (clone1.parentNode) clone1.parentNode.removeChild(clone1);
      if (clone2.parentNode) clone2.parentNode.removeChild(clone2);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="fixed inset-0 w-full h-[100dvh] bg-[#050505] overflow-hidden z-[40]"
    >
      {/* Top and Bottom Fades */}
      <div className="absolute top-0 inset-x-0 h-[20vh] bg-gradient-to-b from-[#050505] to-transparent z-[50] pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-[20vh] bg-gradient-to-t from-[#050505] to-transparent z-[50] pointer-events-none" />

      {/* Scroller Collection */}
      <div className="absolute top-0 w-full h-full">
        <div ref={listRef} className="w-full flex flex-col items-center">
          {servicePages.map((service, index) => (
            <div
              key={index}
              data-typo-scroll-item
              className="relative w-full text-center py-2 md:py-4 cursor-pointer group"
            >
              <Link
                href={`/services/${service.slug}`}
                className="relative inline-block w-full z-10"
              >
                <h3 className="font-black font-sans text-[#222] uppercase text-[clamp(4rem,12vw,14rem)] leading-[0.8] tracking-[-0.02em] group-hover:text-[#fafafa] transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Hover Content Wrapper */}
                <div className="typo-scroll__hover-wrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] md:w-[240px] md:h-[240px] pointer-events-none overflow-hidden rounded-md z-[-1]">
                  <div className="typo-scroll__hover relative w-full h-full bg-[#111] overflow-hidden rounded-md flex items-center justify-center">
                    <Image src="/images/logo-icon.png" alt="Jollo" width={60} height={60} className="object-contain opacity-70" />
                  </div>
                </div>

                {/* Explore Button */}
                <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm md:text-base font-body font-medium hidden md:block">Explore</span>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#e9e612] flex items-center justify-center text-black">
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path d="M0 6.75758L0 5.24242L9.09091 5.24242L4.92424 1.07576L6 0L12 6L6 12L4.92424 10.9242L9.09091 6.75758L0 6.75758Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
