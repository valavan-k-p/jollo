"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/atoms/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const WORDS = ["Experiences", "Brands", "Growth", "Moments", "Events", "Stories"];

function TypeRow({
  direction,
  baseDuration,
  outlined,
}: {
  direction: 1 | -1;
  baseDuration: number;
  outlined: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const el = rowRef.current;
      if (!el) return;

      let tween: gsap.core.Tween | null = null;
      let st: ScrollTrigger | null = null;
      let decayFn: (() => void) | null = null;

      const init = () => {
        const loopWidth = el.scrollWidth / 2;
        const fromX = direction === -1 ? 0 : -loopWidth;
        const toX = direction === -1 ? -loopWidth : 0;
        gsap.set(el, { x: fromX });
        tween = gsap.to(el, { x: toX, duration: baseDuration, ease: "none", repeat: -1 });

        st = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity();
            const boost = 1 + Math.min(Math.abs(v) / 800, 3.5);
            const skew = gsap.utils.clamp(-6, 6, (v / 1000) * direction);
            tween?.timeScale(boost);
            gsap.to(el, { skewX: skew, duration: 0.5, ease: "power2.out", overwrite: "auto" });
          },
        });

        decayFn = () => {
          if (tween) {
            const ts = tween.timeScale();
            if (ts > 1.02) tween.timeScale(gsap.utils.interpolate(ts, 1, 0.04));
          }
        };
        gsap.ticker.add(decayFn);
        gsap.to(el, { skewX: 0, duration: 0.6 });
      };

      const id = requestAnimationFrame(init);

      return () => {
        cancelAnimationFrame(id);
        st?.kill();
        tween?.kill();
        if (decayFn) gsap.ticker.remove(decayFn);
      };
    });
    return () => mm.revert();
  }, [direction, baseDuration]);

  return (
    <div className="overflow-hidden py-1.5">
      <div
        ref={rowRef}
        className="flex w-max items-center gap-6 will-change-transform"
        aria-hidden="true"
      >
        {[...WORDS, ...WORDS, ...WORDS, ...WORDS].map((word, i) => (
          <span key={i} className="flex items-center gap-6 flex-none">
            <span
              className="font-editorial leading-none select-none"
              style={{
                fontSize: "clamp(2.75rem, 8.5vw, 8.5rem)",
                letterSpacing: "-0.03em",
                fontStyle: i % 3 === 2 ? "italic" : "normal",
                color: outlined ? "transparent" : "#e9e612",
                WebkitTextStroke: outlined ? "1px rgba(255,255,255,0.18)" : "0",
              }}
            >
              {word}
            </span>
            <span
              className="inline-block rounded-full flex-none"
              style={{
                width: 7,
                height: 7,
                background: outlined ? "rgba(255,255,255,0.12)" : "#e9e612",
              }}
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function KineticMediaStripSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-kinetic-header]", {
          opacity: 0,
          y: 16,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-transparent overflow-hidden border-t border-white/[0.06]"
      aria-label="What we create"
    >
      {/* Header */}
      <div
        data-kinetic-header
        className="container-jollo py-8 flex items-center justify-between"
      >
        <SectionLabel index="01">What We Create</SectionLabel>
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 font-display text-xs font-medium text-white hover:text-white transition-colors duration-200"
        >
          Full Gallery
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* Row 1 — filled yellow, moving left */}
      <TypeRow direction={-1} baseDuration={30} outlined={false} />

      {/* Row 2 — outlined white, moving right */}
      <TypeRow direction={1} baseDuration={38} outlined={true} />

      <div className="h-8 md:h-12" />
    </section>
  );
}
