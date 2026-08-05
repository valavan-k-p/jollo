"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stats } from "@/content/homepage";

gsap.registerPlugin(ScrollTrigger);

export default function ScaleStatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      stats.forEach((stat, i) => {
        const el = document.querySelector(`[data-stat-num="${i}"]`);
        if (el) el.textContent = parseInt(stat.value).toString();
      });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        stats.forEach((stat, i) => {
          const target = parseInt(stat.value);
          const numEl = document.querySelector(`[data-stat-num="${i}"]`) as HTMLElement;
          const panelEl = document.querySelector(`[data-stat-panel="${i}"]`);
          const labelEl = document.querySelector(`[data-stat-label="${i}"]`);
          if (!numEl || !panelEl) return;

          numEl.textContent = "0";
          const counter = { val: 0 };

          gsap.from(panelEl, {
            opacity: 0,
            y: 44,
            duration: 1.0,
            ease: "expo.out",
            scrollTrigger: { trigger: panelEl, start: "top 82%" },
          });

          if (labelEl) {
            gsap.from(labelEl, {
              opacity: 0,
              x: -24,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: panelEl, start: "top 78%" },
            });
          }

          ScrollTrigger.create({
            trigger: panelEl,
            start: "top 78%",
            once: true,
            onEnter: () => {
              gsap.to(counter, {
                val: target,
                duration: 2.2,
                ease: "power2.out",
                onUpdate: () => {
                  numEl.textContent = Math.round(counter.val).toString();
                },
              });
              gsap.from(`[data-stat-suffix="${i}"]`, {
                opacity: 0,
                y: 12,
                duration: 0.5,
                delay: 0.35,
                ease: "power3.out",
              });
            },
          });
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-transparent border-t border-white/[0.06]"
      aria-label="Company scale"
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          data-stat-panel={i}
          className="relative flex flex-col md:flex-row md:items-end md:justify-between border-b border-white/[0.06] px-6 md:px-14 pt-14 md:pt-20 pb-10 md:pb-14 gap-6"
          aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
        >
          {/* Large editorial number */}
          <div
            className="font-editorial leading-none text-white will-change-auto"
            style={{
              fontSize: "clamp(6rem, 18vw, 20rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.88,
            }}
          >
            <span data-stat-num={i} className="tabular-nums">
              {parseInt(stat.value)}
            </span>
            <span
              data-stat-suffix={i}
              className="will-change-opacity"
              style={{ color: "#e9e612" }}
            >
              {stat.suffix}
            </span>
          </div>

          {/* Label — bottom right on desktop */}
          <div
            data-stat-label={i}
            className="md:text-right flex-none md:pb-4"
          >
            <p className="font-body text-sm md:text-base text-white leading-snug max-w-[220px] md:max-w-[260px] md:ml-auto">
              {stat.label}
            </p>
            <div className="mt-3 w-8 h-px bg-[#e9e612]/40 md:ml-auto" aria-hidden="true" />
          </div>
        </div>
      ))}
    </section>
  );
}
