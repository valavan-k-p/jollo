"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Result {
  value: string;
  label: string;
}

interface ResultsSectionProps {
  results: Result[];
}

/* Clone story-intro card row: tilted stat cards that straighten and pop in. */
export default function ResultsSection({ results }: ResultsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("[data-results-heading]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        opacity: 0, y: 30, duration: 0.9, ease: "expo.out",
      });
      gsap.from("[data-result-card]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        opacity: 0, y: 50, scale: 0.92, stagger: 0.12, duration: 0.9, ease: "back.out(1.4)",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative section-padding border-t border-white/[0.06] bg-[#111111] overflow-hidden">
      <div className="container-jollo flex flex-col items-center gap-16">
        <h2
          data-results-heading
          className="font-editorial text-white text-center will-change-transform"
          style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)", letterSpacing: "-0.02em" }}
        >
          The numbers behind the work.
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {results.map((result, i) => (
            <div
              key={result.label}
              data-result-card
              className="w-72 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#e9e612]/25 transition-colors duration-500 will-change-transform"
              style={{ padding: 'clamp(1.25rem, 2.5vw, 2.5rem)', transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}
            >
              <p
                className="font-display font-bold text-[#e9e612] leading-none mb-4"
                style={{ fontSize: "clamp(2.8rem, 4.5vw, 4rem)", letterSpacing: "-0.03em" }}
              >
                {result.value}
              </p>
              <p className="text-body text-white/70">{result.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
