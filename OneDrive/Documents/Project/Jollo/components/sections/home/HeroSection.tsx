"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { GSAP_BP } from "@/hooks/useBreakpoint";

const ROTATING_WORDS = ["EXPERIENCES", "BRANDS", "MOMENTS", "LEGACIES"];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);

  /* ── Rotating word cycle ──────────────────────────────────────────── */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!wordRef.current) return;
      gsap.to(wordRef.current, {
        yPercent: -110,
        opacity: 0,
        duration: 0.4,
        ease: "expo.in",
        onComplete: () => {
          setWordIndex((p) => (p + 1) % ROTATING_WORDS.length);
          gsap.fromTo(
            wordRef.current,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.5, ease: "expo.out" }
          );
        },
      });
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  /* ── Entrance animation — separate mobile / desktop timelines ───── */
  useEffect(() => {
    const mm = gsap.matchMedia();

    /* Desktop: full cinematic entrance */
    mm.add(`${GSAP_BP.notMobile} and (prefers-reduced-motion: no-preference)`, () => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.from("[data-hero-line]", {
        scaleX: 0,
        duration: 1.1,
        ease: "expo.inOut",
        transformOrigin: "left center",
      }, 0.1);
      tl.from("[data-hw]", {
        yPercent: 115,
        duration: 1.4,
        stagger: 0.06,
        ease: "expo.out",
      }, 0.4);
      tl.from("[data-sub]", {
        opacity: 0,
        y: 16,
        stagger: 0.08,
        duration: 0.8,
        ease: "expo.out",
      }, 0.9);
      return () => tl.kill();
    });

    /* Mobile: lighter, faster entrance — no heavy staggering */
    mm.add(`${GSAP_BP.mobile} and (prefers-reduced-motion: no-preference)`, () => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.from("[data-hw]", {
        yPercent: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: "expo.out",
      }, 0.1);
      tl.from("[data-sub]", {
        opacity: 0,
        y: 12,
        stagger: 0.06,
        duration: 0.6,
        ease: "expo.out",
      }, 0.5);
      return () => tl.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100svh] bg-transparent flex flex-col overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-5 md:px-[5vw] pt-20 md:pt-32 pb-6">
        <h1
          className="text-center text-white font-luxe uppercase will-change-transform"
          style={{
            fontSize: "clamp(2.1rem, 7.5vw, 6.5rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
          }}
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hw className="block will-change-transform" style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 700 }}>
              WE CREATE
            </span>
          </span>

          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hw className="block will-change-transform">
              <span
                className="relative inline-flex overflow-hidden"
                style={{ verticalAlign: "bottom" }}
              >
                <span
                  ref={wordRef}
                  className="inline-block will-change-transform italic text-[#e9e612]"
                >
                  {ROTATING_WORDS[wordIndex]}
                </span>
              </span>
            </span>
          </span>

          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hw className="block will-change-transform" style={{ fontFamily: "var(--font-archivo), sans-serif", fontWeight: 900 }}>
              THAT MATTER.
            </span>
          </span>
        </h1>

        {/* Mobile-only tagline */}
        <p
          data-sub
          className="md:hidden mt-6 text-center font-body text-white/50 text-sm leading-relaxed max-w-[28ch]"
        >
          Premium brand experiences & growth strategy.
        </p>
      </div>

      {/* ── Scroll indicator — repositioned for mobile ──────────────── */}
      <div
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-[5vw] z-30 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span
          className="font-display text-white tracking-[0.3em] uppercase hidden md:block"
          style={{ fontSize: "0.5rem", writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
        <div className="w-px h-8 md:h-10 bg-white/8 overflow-hidden relative">
          <div
            className="absolute inset-x-0 top-0 h-4 bg-[#e9e612]"
            style={{
              animation: "scrollLine 2.2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollLine {
          0%   { transform: translateY(-100%); }
          55%  { transform: translateY(250%); }
          100% { transform: translateY(250%); }
        }
      `}</style>
    </section>
  );
}
