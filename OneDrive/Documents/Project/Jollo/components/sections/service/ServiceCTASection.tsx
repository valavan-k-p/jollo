"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowButton from "@/components/clone/ArrowButton";

interface ServiceCTASectionProps {
  ctaHeading: string;
  ctaLabel: string;
}

/* Clone CTA: oversized centred heading with the arrow icon button beneath. */
export default function ServiceCTASection({ ctaHeading, ctaLabel }: ServiceCTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("[data-cta-heading]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        opacity: 0, y: 40, duration: 1, ease: "expo.out",
      });
      gsap.from("[data-cta-button]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        opacity: 0, y: 20, scale: 0.9, duration: 0.8, ease: "back.out(1.6)", delay: 0.15,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative section-padding border-t border-white/[0.06] bg-[#111111] overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(233,230,18,0.08) 0%, transparent 80%)" }}
      />
      <div className="container-jollo relative z-10 flex flex-col items-center text-center gap-10">
        <h2
          data-cta-heading
          className="font-editorial text-white max-w-3xl will-change-transform"
          style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)", letterSpacing: "-0.02em", lineHeight: 1.05 }}
        >
          {ctaHeading}
        </h2>
        <div data-cta-button className="will-change-transform">
          <ArrowButton href="/contact">{ctaLabel}</ArrowButton>
        </div>
      </div>
    </section>
  );
}
