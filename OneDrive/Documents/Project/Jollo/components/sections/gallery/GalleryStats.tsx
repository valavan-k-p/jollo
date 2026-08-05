"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { galleryStats } from "@/content/gallery";

/**
 * Monumental statistics — numbers are the hero.
 * clamp(80px, 10vw, 140px) font size.
 * Centered perfectly, labels below with proper spacing.
 */
export default function GalleryStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      galleryStats.forEach((stat, i) => {
        const el = numberRefs.current[i];
        if (!el) return;

        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 2.5,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + stat.suffix;
          },
          scrollTrigger: { trigger: root, start: "top 75%" },
        });
      });

      gsap.from("[data-gs-label]", {
        scrollTrigger: { trigger: root, start: "top 75%" },
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
        delay: 0.6,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#050505]"
    >
      {/* Section top: 160px */}
      <div
        className="container-gallery"
        style={{ paddingTop: "clamp(96px, 12vw, 160px)", paddingBottom: "clamp(96px, 14vw, 180px)" }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-20 lg:gap-y-0 gap-x-8">
          {galleryStats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              {/* Monumental number */}
              <span
                ref={(el) => { numberRefs.current[i] = el; }}
                className="font-luxe text-[#fafafa] block"
                style={{
                  fontSize: "clamp(80px, 10vw, 140px)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.03em",
                }}
              >
                0{stat.suffix}
              </span>
              {/* 40px below number → label */}
              <span
                data-gs-label
                className="font-body text-[#a0a0a0] block uppercase tracking-[0.2em] will-change-transform"
                style={{
                  fontSize: "clamp(0.625rem, 0.8vw, 0.75rem)",
                  marginTop: "40px",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
