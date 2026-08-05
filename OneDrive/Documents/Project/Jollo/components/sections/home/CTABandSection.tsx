"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NoiseCanvas from "@/components/ui/NoiseCanvas";

gsap.registerPlugin(ScrollTrigger);

const CTA_LINES = ["Let's build", "something"];

export default function CTABandSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // Headline lines masked reveal
        gsap.from("[data-cta-line]", {
          yPercent: 108,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        });

        // Yellow underline wipe
        if (underlineRef.current) {
          gsap.fromTo(
            underlineRef.current,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              duration: 0.9,
              ease: "expo.out",
              delay: 0.65,
              scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
            }
          );
        }

        // Buttons appear
        gsap.from("[data-cta-btn]", {
          y: 24,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "expo.out",
          delay: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent overflow-hidden"
      style={{
        paddingTop: "clamp(7rem, 14vw, 16rem)",
        paddingBottom: "clamp(7rem, 14vw, 16rem)",
      }}
      aria-label="Call to action"
    >
      {/* Canvas grain */}
      <NoiseCanvas opacity={0.03} speed={3} />

      {/* Radial glow from bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 110%, rgba(233,230,18,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container-jollo relative z-10">
        {/* Heading */}
        <h2
          className="font-editorial text-white mb-16 md:mb-20"
          style={{
            fontSize: "clamp(3rem, 8vw, 9rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.035em",
            maxWidth: "16ch",
          }}
        >
          {CTA_LINES.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.05em]">
              <span data-cta-line className="block will-change-transform">
                {line}
              </span>
            </span>
          ))}
          <span className="block overflow-hidden pb-[0.05em]">
            <span data-cta-line className="block will-change-transform relative">
              <span className="relative inline-block">
                unforgettable.
                <span
                  ref={underlineRef}
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#e9e612] will-change-transform"
                  style={{ transform: "scaleX(0)" }}
                  aria-hidden="true"
                />
              </span>
            </span>
          </span>
        </h2>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Link
            href="/contact"
            data-cta-btn
            className="group inline-flex items-center gap-3 px-10 py-5 border border-white/20 font-display font-semibold text-sm tracking-wide text-white hover:bg-[#e9e612] hover:text-black hover:border-[#e9e612] transition-all duration-300 will-change-transform"
          >
            Book a Consultation
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
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

          <Link
            href="/work"
            data-cta-btn
            className="group inline-flex items-center gap-2 px-4 py-5 font-display text-sm font-medium text-white hover:text-white transition-colors duration-200 will-change-transform"
          >
            <span className="relative">
              View Our Work
              <span className="absolute -bottom-px left-0 w-0 h-px bg-[#e9e612] group-hover:w-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
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
      </div>
    </section>
  );
}
