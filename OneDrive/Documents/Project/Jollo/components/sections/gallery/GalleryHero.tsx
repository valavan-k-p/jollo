"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function GalleryHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-gal-line]", {
        yPercent: 120,
        stagger: 0.12,
        duration: 1.6,
        ease: "expo.out",
        delay: 0.2,
      });

      gsap.from("[data-gal-sub]", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "expo.out",
        delay: 0.9,
      });

      gsap.from("[data-gal-scroll]", {
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        delay: 1.4,
      });

      gsap.to(content, {
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        scale: 0.88,
        yPercent: -12,
        opacity: 0,
      });
    }, section);

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      gsap.to(content, { x, y, duration: 1.2, ease: "power2.out", overwrite: "auto" });
    };
    section.addEventListener("mousemove", onMove);

    return () => {
      ctx.revert();
      section.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(233,230,18,0.03) 0%, #050505 70%)" }}
    >
      <div ref={contentRef} className="relative z-10 text-center will-change-transform">
        <h1
          className="font-luxe uppercase"
          style={{ fontSize: "clamp(3.5rem, 9vw, 9.5rem)", lineHeight: 0.95, letterSpacing: "-0.03em" }}
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-gal-line className="block text-[#fafafa] will-change-transform">
              We Create
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-gal-line className="block text-[#e9e612] italic will-change-transform">
              Experiences
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-gal-line className="block text-[#fafafa] will-change-transform">
              That Last.
            </span>
          </span>
        </h1>

        <p
          data-gal-sub
          className="font-body text-[#a0a0a0] mx-auto mt-10 leading-relaxed will-change-transform"
          style={{ fontSize: "clamp(0.875rem, 1.1vw, 1rem)", maxWidth: "26ch" }}
        >
          Selected projects,
          <br />
          trusted partnerships,
          <br />
          and memorable experiences.
        </p>
      </div>

      {/* scroll indicator */}
      <div data-gal-scroll className="absolute bottom-10 right-8 md:right-12 flex flex-col items-center gap-3">
        <span
          className="font-body uppercase text-[#fafafa]/25 tracking-[0.25em]"
          style={{ fontSize: "9px", writingMode: "vertical-lr" }}
        >
          Scroll
        </span>
        <div className="w-px h-14 bg-[#fafafa]/[0.08] relative overflow-hidden">
          <div className="absolute inset-x-0 h-full bg-[#e9e612]/40 animate-gallery-scroll" />
        </div>
      </div>
    </section>
  );
}
