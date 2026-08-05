"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ServiceHeroProps {
  title: string;
  tagline: string;
  heroSubtext: string;
  category: string;
}

export default function ServiceHeroSection({
  title,
  tagline,
  heroSubtext,
  category,
}: ServiceHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.from("[data-hero-label]", { opacity: 0, y: 15, duration: 0.6, ease: "expo.out" });
      tl.from("[data-hero-line]", { yPercent: 110, duration: 1.1, ease: "expo.out" }, "-=0.35");
      tl.from("[data-hero-sub]", { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, ease: "expo.out" }, "-=0.6");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={sectionRef}
      className="relative min-h-[85vh] flex flex-col justify-center pt-32 pb-20 overflow-hidden bg-[#111111]"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[500px] h-[500px] bg-[#e9e612]/[0.05] blur-[130px] rounded-full" />
      </div>

      <div className="container-jollo relative z-10">
        <p data-hero-label className="text-label text-[#e9e612]/60 mb-8 will-change-transform">
          {category}
        </p>
        <div className="overflow-hidden pb-[0.08em]">
          <h1
            data-hero-line
            className="font-editorial text-white leading-[1.02] will-change-transform"
            style={{ fontSize: "clamp(3rem, 8vw, 8rem)", letterSpacing: "-0.03em" }}
          >
            {title}
          </h1>
        </div>
        <p
          data-hero-sub
          className="font-display text-white/90 mt-6 max-w-2xl will-change-transform"
          style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)", lineHeight: 1.35 }}
        >
          {tagline}
        </p>
        <p data-hero-sub className="text-body-lg text-white/60 mt-6 max-w-xl leading-relaxed will-change-transform">
          {heroSubtext}
        </p>
      </div>
    </header>
  );
}
