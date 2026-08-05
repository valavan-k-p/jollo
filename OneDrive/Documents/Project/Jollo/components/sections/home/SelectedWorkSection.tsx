"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredWork } from "@/content/homepage";
import SectionLabel from "@/components/atoms/SectionLabel";
import CursorFollowImage from "@/components/ui/CursorFollowImage";

gsap.registerPlugin(ScrollTrigger);

const workGradients: Record<string, string> = {
  "M.I.C.E.": "linear-gradient(135deg, #0c1a2e 0%, #060c18 50%, #020508 100%)",
  "Branding": "linear-gradient(135deg, #1a0a1a 0%, #0d0508 50%, #020002 100%)",
  "Marketing Solutions": "linear-gradient(135deg, #001a0a 0%, #000d05 50%, #000200 100%)",
  "Jollo X": "linear-gradient(135deg, #001428 0%, #00080f 50%, #000204 100%)",
  "Celebrations": "linear-gradient(135deg, #1a1000 0%, #0a0800 50%, #020200 100%)",
};

function WorkRow({
  work,
  index,
  onEnter,
  onLeave,
}: {
  work: (typeof featuredWork)[0];
  index: number;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (borderRef.current) {
      gsap.set(borderRef.current, { scaleY: 0, transformOrigin: "top center" });
    }

    const tl = gsap.timeline({ paused: true });
    if (borderRef.current) tl.to(borderRef.current, { scaleY: 1, duration: 0.4, ease: "expo.out" }, 0);
    if (numRef.current) tl.to(numRef.current, { color: "rgba(233,230,18,0.5)", duration: 0.2 }, 0);
    if (arrowRef.current) tl.to(arrowRef.current, { x: 8, duration: 0.3, ease: "power2.out" }, 0);
    tlRef.current = tl;

    const row = rowRef.current;
    if (!row) return;
    const enter = () => { tl.play(); onEnter(); };
    const leave = () => { tl.reverse(); onLeave(); };
    row.addEventListener("mouseenter", enter);
    row.addEventListener("mouseleave", leave);
    row.addEventListener("focusin", enter);
    row.addEventListener("focusout", leave);

    return () => {
      row.removeEventListener("mouseenter", enter);
      row.removeEventListener("mouseleave", leave);
      row.removeEventListener("focusin", enter);
      row.removeEventListener("focusout", leave);
      tl.kill();
    };
  }, [onEnter, onLeave]);

  return (
    <div ref={rowRef} className="relative border-b border-white/[0.06] last:border-b-0">
      {/* Left yellow accent bar */}
      <div
        ref={borderRef}
        className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#e9e612] will-change-transform"
        aria-hidden="true"
      />

      <Link
        href="/work"
        className="group relative flex items-center justify-between gap-4 py-8 md:py-11 pl-8 pr-6 md:pr-12"
      >
        {/* Number + content */}
        <div className="flex items-baseline gap-6 min-w-0 flex-1">
          <span
            ref={numRef}
            className="font-display text-xs text-white flex-none tabular-nums font-semibold will-change-auto"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <h3
              className="font-editorial text-white group-hover:text-white transition-colors duration-300"
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 3.2rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
              }}
            >
              {work.title}
            </h3>
            <p className="font-body text-sm text-white mt-2">{work.client}</p>
          </div>
        </div>

        {/* Meta + arrow */}
        <div className="flex items-center gap-8 flex-none">
          <div className="hidden md:flex flex-col items-end gap-1">
            <span className="font-display text-[10px] font-medium tracking-[0.18em] uppercase text-white">
              {work.category}
            </span>
            <span className="font-display text-[10px] text-white">{work.year}</span>
          </div>
          <svg
            ref={arrowRef}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white group-hover:text-[#e9e612] transition-colors duration-200 will-change-transform"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Link>
    </div>
  );
}

export default function SelectedWorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-work-header]", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
        });
        gsap.from(".work-row-anim", {
          y: 32,
          opacity: 0,
          stagger: 0.07,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const activeGradient = hovered
    ? (workGradients[hovered] ?? "linear-gradient(135deg, #111 0%, #080808 100%)")
    : "linear-gradient(135deg, #0a0a0a 0%, #080808 100%)";

  return (
    <section
      ref={sectionRef}
      className="bg-transparent section-padding border-t border-white/[0.06]"
      aria-label="Selected work"
    >
      <CursorFollowImage active={!!hovered} gradient={activeGradient} width={340} height={230} />

      <div className="container-jollo">
        {/* Header */}
        <div data-work-header className="flex items-end justify-between gap-6 mb-14">
          <div>
            <SectionLabel index="03" className="mb-5">Selected Work</SectionLabel>
            <h2
              className="font-editorial text-white"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 5rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.03em",
              }}
            >
              Work that speaks.
            </h2>
          </div>
          <Link
            href="/work"
            className="group flex-none inline-flex items-center gap-2 font-display text-xs font-medium text-white hover:text-white transition-colors duration-200 tracking-widest uppercase mb-2"
          >
            View all
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
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

        {/* Work list with cursor-follow */}
        <div className="border-t border-white/[0.06]">
          {featuredWork.map((work, i) => (
            <div key={work.slug} className="work-row-anim">
              <WorkRow
                work={work}
                index={i}
                onEnter={() => setHovered(work.category)}
                onLeave={() => setHovered(null)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
