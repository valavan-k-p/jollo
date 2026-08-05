"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/ui/MagneticButton";

/**
 * Gallery CTA — premium close.
 * Bigger heading, button closer to heading, wider golden glow.
 */
export default function GalleryCta() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-cta-el]", {
        scrollTrigger: { trigger: root, start: "top 80%" },
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 1.2,
        ease: "expo.out",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050505]"
      style={{
        paddingTop: "clamp(96px, 12vw, 160px)",
        paddingBottom: "clamp(96px, 14vw, 180px)",
      }}
    >
      {/* golden sphere glow — nearly full width */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: "clamp(400px, 70vw, 1000px)",
          height: "clamp(400px, 70vw, 1000px)",
          background: "radial-gradient(circle, rgba(233,230,18,0.08) 0%, rgba(233,230,18,0.02) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="container-gallery relative z-10 text-center">
        <p
          data-cta-el
          className="font-body uppercase tracking-[0.3em] text-[#e9e612]/40 will-change-transform"
          style={{ fontSize: "clamp(0.625rem, 0.8vw, 0.75rem)" }}
        >
          Let&apos;s Talk
        </p>
        {/* 32px → heading */}
        <h2
          data-cta-el
          className="font-luxe uppercase text-[#fafafa] mx-auto will-change-transform"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            maxWidth: "16ch",
            marginTop: "32px",
          }}
        >
          Ready to create something unforgettable?
        </h2>
        {/* 40px → button (close to heading) */}
        <div data-cta-el className="will-change-transform" style={{ marginTop: "40px" }}>
          <MagneticButton href="/contact" variant="primary">
            Book a Consultation
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
