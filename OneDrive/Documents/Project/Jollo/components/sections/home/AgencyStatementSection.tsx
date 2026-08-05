"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  { text: "We don't produce", yellow: false },
  { text: "events. We produce", yellow: false },
  { text: "the feeling people", yellow: false },
  { text: "carry home.", yellow: true },
];

export default function AgencyStatementSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-stmt-rule]", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.0,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        });

        gsap.from("[data-stmt-line]", {
          yPercent: 110,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        });

        gsap.from("[data-stmt-aside]", {
          opacity: 0,
          x: 24,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent overflow-hidden border-t border-white/[0.06]"
      style={{
        paddingTop: "clamp(6rem, 12vw, 14rem)",
        paddingBottom: "clamp(6rem, 12vw, 14rem)",
      }}
      aria-label="Agency statement"
    >
      <div className="container-jollo">
        {/* Rule */}
        <div
          data-stmt-rule
          className="w-full h-px bg-white/[0.06] mb-16 md:mb-24 will-change-transform"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-16 lg:gap-24 items-end">
          {/* Statement */}
          <h2
            className="font-editorial"
            style={{
              fontSize: "clamp(3rem, 7.5vw, 8.5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
            }}
          >
            {LINES.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.06em]">
                <span
                  data-stmt-line
                  className={`block will-change-transform ${line.yellow ? "text-[#e9e612]" : "text-white"}`}
                >
                  {line.text}
                </span>
              </span>
            ))}
          </h2>

          {/* Aside — right column on desktop, below on mobile */}
          <div data-stmt-aside className="lg:pb-2 space-y-6">
            <div className="w-px h-12 bg-[#e9e612]/35 hidden lg:block" aria-hidden="true" />
            <div>
              <p className="font-display text-[10px] font-medium tracking-[0.22em] uppercase text-white mb-2">
                Founded in
              </p>
              <p className="font-body text-sm text-white leading-relaxed">
                India
                <br />
                Delivering globally
              </p>
            </div>
            <div>
              <p className="font-display text-[10px] font-medium tracking-[0.22em] uppercase text-white mb-2">
                Since
              </p>
              <p className="font-body text-sm text-white">2018</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
