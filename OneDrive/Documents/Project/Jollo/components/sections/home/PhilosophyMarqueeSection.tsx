"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/atoms/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const phrase = [
  { text: "Experiences", accent: false },
  { text: "Brands", accent: true },
  { text: "Growth", accent: false },
  { text: "Moments", accent: true },
];

function MarqueeRow({
  direction,
  baseDuration,
  italic = false,
  fontSize,
}: {
  direction: 1 | -1;
  baseDuration: number;
  italic?: boolean;
  fontSize: string;
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
            const boost = 1 + Math.min(Math.abs(v) / 1200, 4);
            const skew = gsap.utils.clamp(-8, 8, (v / 1400) * direction);
            tween?.timeScale(boost);
            gsap.to(el, { skewX: skew, duration: 0.5, ease: "power2.out", overwrite: "auto" });
          },
        });

        decayFn = () => {
          if (tween) {
            const ts = tween.timeScale();
            if (ts > 1.01) tween.timeScale(gsap.utils.interpolate(ts, 1, 0.04));
          }
        };
        gsap.ticker.add(decayFn);
        gsap.to(el, { skewX: 0, duration: 0.6, delay: 0.1 });
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
    <div className="overflow-hidden">
      <div
        ref={rowRef}
        className="flex w-max items-center gap-8 will-change-transform"
        aria-hidden="true"
      >
        {[...phrase, ...phrase, ...phrase, ...phrase].map((word, i) => (
          <span key={i} className="flex items-center gap-8">
            <span
              className="font-editorial leading-none"
              style={{
                fontSize,
                letterSpacing: "-0.03em",
                fontStyle: italic ? "italic" : "normal",
                color: word.accent ? "#e9e612" : "transparent",
                WebkitTextStroke: word.accent ? "0" : "1px rgba(255,255,255,0.28)",
              }}
            >
              {word.text}
            </span>
            <span
              className="inline-block rounded-full bg-white/15"
              style={{ width: 8, height: 8 }}
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PhilosophyMarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-philosophy-statement]", {
          opacity: 0,
          y: 30,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent py-20 md:py-28 overflow-hidden border-t border-white/[0.06]"
      aria-label="Our philosophy"
    >
      {/* Statement */}
      <div
        data-philosophy-statement
        className="container-jollo text-center mb-14 md:mb-18"
      >
        <SectionLabel index="04" align="center" className="mb-6">Our Philosophy</SectionLabel>
        <p
          className="font-editorial text-white mx-auto max-w-3xl"
          style={{
            fontSize: "clamp(1.5rem, 3.2vw, 2.75rem)",
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
          }}
        >
          We don&apos;t deliver campaigns. We build the feeling a brand leaves behind.
        </p>
      </div>

      {/* Row 1 — large, outlined → accent pattern */}
      <MarqueeRow direction={-1} baseDuration={28} fontSize="clamp(3rem, 11vw, 11rem)" />

      {/* Row 2 — smaller, italic, outlined opposite direction */}
      <MarqueeRow direction={1} baseDuration={44} italic fontSize="clamp(1.5rem, 5vw, 5rem)" />
    </section>
  );
}
