"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ProblemSectionProps {
  problemStatement: string;
}

/* Clone "approach text" section: a single oversized centred statement with a
   parallax-drifting emoji beside it. */
export default function ProblemSection({ problemStatement }: ProblemSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("[data-problem-text]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        opacity: 0,
        y: 40,
        duration: 1.1,
        ease: "expo.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative section-padding border-t border-white/[0.06] bg-[#111111] overflow-hidden"
    >
      <div className="container-jollo flex justify-center">
        <p
          data-problem-text
          className="font-editorial text-white text-center max-w-4xl will-change-transform"
          style={{ fontSize: "clamp(1.6rem, 3.2vw, 3rem)", lineHeight: 1.25, letterSpacing: "-0.02em" }}
        >
          {problemStatement}
        </p>
      </div>
    </section>
  );
}
