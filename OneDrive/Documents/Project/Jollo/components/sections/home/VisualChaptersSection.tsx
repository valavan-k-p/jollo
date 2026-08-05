"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    id: "mice",
    no: "01",
    heading: "Experiences\nat Scale",
    subLabel: "M.I.C.E. · Corporate Events",
    detail: "From boardrooms to 5,000-person conferences — every brief is an opportunity to exceed expectation.",
    bg: "radial-gradient(ellipse 110% 90% at 70% 80%, #0c1a2e 0%, #060c18 45%, #000 100%)",
  },
  {
    id: "celebrations",
    no: "02",
    heading: "Moments Worth\nRemembering",
    subLabel: "Celebrations · Weddings · Milestones",
    detail: "Designed around the people being celebrated. Every detail chosen with intent.",
    bg: "radial-gradient(ellipse 100% 110% at 30% 60%, #1e0a14 0%, #0f0508 50%, #000 100%)",
  },
  {
    id: "activations",
    no: "03",
    heading: "Where Brands\nCome Alive",
    subLabel: "Branding · Marketing · Activations",
    detail: "Brand moments that change how people feel about a company. Live, digital, and everywhere between.",
    bg: "radial-gradient(ellipse 90% 100% at 55% 35%, #0c1e0c 0%, #060e06 50%, #000 100%)",
  },
];

export default function VisualChaptersSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // ── Animated path: sticky cinematic cross-fade ──
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // Stack all chapters absolutely; only the first is visible to start.
        gsap.set(".vc-chapter", { position: "absolute", inset: 0 });
        gsap.set(".vc-chapter:not(:first-child)", { opacity: 0 });
        gsap.set(".vc-chapter:not(:first-child) .vc-content", { opacity: 0, y: 30 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          },
        });

        tl.to({}, { duration: 2 }); // hold ch1

        tl.to(".vc-content-0", { opacity: 0, y: -25, duration: 0.6 })
          .to(".vc-chapter-0", { opacity: 0, duration: 0.8 }, "<")
          .to(".vc-chapter-1", { opacity: 1, duration: 0.8 }, "<")
          .to(".vc-content-1", { opacity: 1, y: 0, duration: 0.6 }, "<0.2");

        tl.to({}, { duration: 2 }); // hold ch2

        tl.to(".vc-content-1", { opacity: 0, y: -25, duration: 0.6 })
          .to(".vc-chapter-1", { opacity: 0, duration: 0.8 }, "<")
          .to(".vc-chapter-2", { opacity: 1, duration: 0.8 }, "<")
          .to(".vc-content-2", { opacity: 1, y: 0, duration: 0.6 }, "<0.2");

        tl.to({}, { duration: 2 }); // hold ch3

        gsap.to(".vc-progress-fill", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      }, wrapperRef);

      return () => ctx.revert();
    });

    // ── Reduced motion: collapse to natural stacked full-height sections ──
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const wrapper = wrapperRef.current;
      const sticky = stickyRef.current;
      if (!wrapper || !sticky) return;
      wrapper.style.height = "auto";
      sticky.style.position = "static";
      sticky.style.height = "auto";
      gsap.set(".vc-chapter", { position: "relative", opacity: 1 });
      gsap.set(".vc-content", { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${10 * 60}vh` }}
      aria-label="What we create"
    >
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
        {chapters.map((ch, i) => (
          <section
            key={ch.id}
            className={`vc-chapter vc-chapter-${i} h-screen w-full overflow-hidden`}
            style={{ background: ch.bg }}
          >
            {/* Grain */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.03 }} aria-hidden="true">
              <filter id={`grain-ch-${i}`}>
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter={`url(#grain-ch-${i})`} />
            </svg>

            {/* Bottom vignette */}
            <div
              className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)" }}
              aria-hidden="true"
            />

            {/* Chapter index — top right */}
            <div className="absolute top-8 right-6 md:right-16 flex items-center gap-3 z-20">
              <span className="font-display text-xs font-semibold tabular-nums text-[#e9e612]">{ch.no}</span>
              <span className="font-display text-[10px] tracking-[0.2em] uppercase text-white">/ 03</span>
            </div>

            {/* Content */}
            <div className={`vc-content vc-content-${i} absolute inset-0 flex flex-col justify-end will-change-transform`}>
              <div className="container-jollo pb-16 md:pb-24">
                {i === 0 && (
                  <p className="font-display text-xs font-medium tracking-[0.2em] uppercase text-white flex items-center gap-3 mb-6">
                    <span className="inline-block w-8 h-px bg-[#e9e612]" />
                    Brand Experience &amp; Growth Company
                  </p>
                )}
                <p className="font-display text-[11px] font-medium tracking-[0.22em] uppercase text-[#e9e612]/70 mb-5">
                  {ch.subLabel}
                </p>
                <h2
                  className="font-editorial text-white"
                  style={{
                    fontSize: "clamp(3rem, 7vw, 7.5rem)",
                    lineHeight: 0.92,
                    letterSpacing: "-0.03em",
                    whiteSpace: "pre-line",
                  }}
                >
                  {ch.heading}
                </h2>
                <p className="font-body text-white mt-5 max-w-md leading-relaxed" style={{ fontSize: "clamp(0.875rem, 1.2vw, 1rem)" }}>
                  {ch.detail}
                </p>
              </div>
            </div>
          </section>
        ))}

        {/* Progress bar (right edge) — only meaningful in animated mode */}
        <div className="absolute top-0 right-0 w-px h-full bg-white/10 z-20 pointer-events-none" aria-hidden="true">
          <div
            className="vc-progress-fill absolute top-0 left-0 w-full bg-[#e9e612] origin-top will-change-transform"
            style={{ height: "100%", transform: "scaleY(0)", transformOrigin: "top center" }}
          />
        </div>

        {/* Yellow left accent line */}
        <div className="absolute top-0 left-0 w-px h-full bg-[#e9e612]/20 z-20 pointer-events-none" aria-hidden="true" />
      </div>
    </div>
  );
}
