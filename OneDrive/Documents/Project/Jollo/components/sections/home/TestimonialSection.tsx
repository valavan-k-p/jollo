"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "@/content/homepage";
import SectionLabel from "@/components/atoms/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const AUTO_ADVANCE = 7000;

export default function TestimonialSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const transitionTo = useCallback((nextIndex: number) => {
    const quote = quoteRef.current;
    const author = authorRef.current;
    if (!quote || !author) return;
    gsap
      .timeline()
      .to([quote, author], { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" })
      .call(() => setActive(nextIndex))
      .to([quote, author], { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" });
  }, []);

  const scheduleNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActive((prev) => {
        const next = (prev + 1) % testimonials.length;
        transitionTo(next);
        return prev;
      });
    }, AUTO_ADVANCE);
  }, [transitionTo]);

  useEffect(() => {
    scheduleNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, scheduleNext]);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-testimonial-content]", {
          opacity: 0,
          y: 50,
          duration: 1.0,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  const goTo = (i: number) => {
    if (i === active) return;
    transitionTo(i);
    scheduleNext();
  };

  const current = testimonials[active];

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent section-padding overflow-hidden border-t border-white/[0.06]"
      aria-label="Client testimonials"
    >
      {/* Subtle glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, rgba(233,230,18,0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div data-testimonial-content className="container-jollo relative z-10">
        <SectionLabel index="06" align="center" className="mb-16">
          Client Voices
        </SectionLabel>

        <blockquote className="max-w-4xl mx-auto">
          {/* Oversized quote mark */}
          <span
            className="block font-editorial text-[#e9e612]/18 leading-none mb-4 -ml-1"
            style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}
            aria-hidden="true"
          >
            &ldquo;
          </span>

          <p
            ref={quoteRef}
            className="font-editorial text-white will-change-transform"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 3.25rem)",
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
            }}
          >
            {current.quote}
          </p>

          <div
            ref={authorRef}
            className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 will-change-transform"
          >
            {/* Author info */}
            <div>
              <p className="font-display font-semibold text-white text-sm tracking-wide">
                {current.author}
              </p>
              {(current.title || current.company) && (
                <p className="font-body text-sm text-white mt-1">
                  {[current.title, current.company].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>

            {/* Navigation controls */}
            <div className="flex items-center gap-4 flex-none">
              <button
                onClick={() => goTo((active - 1 + testimonials.length) % testimonials.length)}
                className="p-2 text-white hover:text-white transition-colors duration-150 cursor-pointer"
                aria-label="Previous testimonial"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 12H5M11 6l-6 6 6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Testimonial ${i + 1}`}
                    className="cursor-pointer py-1.5 px-1"
                  >
                    <div
                      className="h-px transition-all duration-400"
                      style={{
                        width: i === active ? 28 : 14,
                        background:
                          i === active ? "#e9e612" : "rgba(255,255,255,0.18)",
                      }}
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={() => goTo((active + 1) % testimonials.length)}
                className="p-2 text-white hover:text-white transition-colors duration-150 cursor-pointer"
                aria-label="Next testimonial"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </blockquote>
      </div>
    </section>
  );
}
