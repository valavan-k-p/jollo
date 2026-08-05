"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

interface ProcessSectionProps {
  process: ProcessStep[];
}

/* Compact version of the clone's story-chapter timeline: each step sits under
   a dashed vertical path that fills yellow as the viewport centre passes it,
   with the step badge popping in at the trigger point. */
export default function ProcessSection({ process }: ProcessSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-process-heading]", {
        scrollTrigger: { trigger: "[data-process-heading]", start: "top 85%" },
        opacity: 0, y: 30, duration: 0.9, ease: "expo.out",
      });

      gsap.utils.toArray<HTMLElement>("[data-process-item]").forEach((item) => {
        const path = item.querySelector<HTMLElement>(".chapter-path");
        const fillMask = item.querySelector<HTMLElement>(".chapter-path_fill-mask");
        const trigger = item.querySelector<HTMLElement>(".chapter-path_trigger");
        const badge = item.querySelector<HTMLElement>("[data-process-badge]");
        const content = item.querySelector<HTMLElement>("[data-process-content]");
        if (!path || !fillMask) return;
        let hasPlayed = false;
        gsap.set(fillMask, { height: "0%" });
        if (badge) gsap.set(badge, { scale: 0.6, rotation: -10, opacity: 0 });
        if (content) gsap.set(content, { opacity: 0, y: 24 });

        ScrollTrigger.create({
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          onUpdate: () => {
            const rect = path.getBoundingClientRect();
            const progress = gsap.utils.clamp(0, 1, (window.innerHeight * 0.5 - rect.top) / rect.height);
            gsap.set(fillMask, { height: `${progress * 100}%` });
          },
        });
        if (trigger) {
          ScrollTrigger.create({
            trigger,
            start: "top center",
            onEnter: () => {
              if (hasPlayed) return;
              hasPlayed = true;
              if (badge) gsap.to(badge, { scale: 1, rotation: 0, opacity: 1, duration: 0.45, ease: "back.out(2.5)" });
              if (content) gsap.to(content, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", delay: 0.1 });
            },
          });
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative section-padding border-t border-white/[0.06] bg-[#111111]">
      <div className="container-jollo">
        <h2
          data-process-heading
          className="font-editorial text-white text-center mb-20 will-change-transform"
          style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)", letterSpacing: "-0.02em" }}
        >
          How we work.
        </h2>

        <div className="flex flex-col items-center">
          {process.map((step) => (
            <div key={step.step} data-process-item className="w-full flex flex-col items-center">
              {/* Dashed connector */}
              <div className="relative h-40 md:h-56 w-px flex flex-col items-center self-stretch">
                <div className="chapter-path">
                  <div className="chapter-path_track" />
                  <div className="chapter-path_fill-mask">
                    <div className="chapter-path_fill" />
                  </div>
                  <div className="chapter-path_trigger" />
                </div>
              </div>

              {/* Step badge + content */}
              <div
                data-process-badge
                className="w-14 h-14 rounded-full bg-[#e9e612] text-black font-display font-bold text-lg flex items-center justify-center mb-6 will-change-transform"
              >
                {String(step.step).padStart(2, "0")}
              </div>
              <div data-process-content className="text-center max-w-xl will-change-transform pb-4">
                <h3
                  className="font-display font-semibold text-white mb-3"
                  style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-0.02em" }}
                >
                  {step.title}
                </h3>
                <p className="text-body-lg text-white/60 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
