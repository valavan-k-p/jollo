"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Capability {
  title: string;
  description: string;
}

interface CapabilitySectionProps {
  capabilities: Capability[];
}

/* Clone "services pinned stack": the container pins for 400vh while cards fly
   off the top one by one with scale + random rotation, revealing the next. */
export default function CapabilitySection({ capabilities }: CapabilitySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  /* First DOM child stays (never flies off); render reversed so capability
     #1 is the topmost painted card and departs first. */
  const stacked = [...capabilities].reverse();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const pinHeight = root.querySelector<HTMLElement>(".services-pin-height");
      const container = root.querySelector<HTMLElement>(".services-container");
      if (!pinHeight || !container) return;

      ScrollTrigger.create({ trigger: pinHeight, start: "top top", end: "bottom bottom", pin: container });

      const gap = 80;
      const medias = root.querySelectorAll<HTMLElement>(".services-stack_item");
      const distPerMedia = (pinHeight.clientHeight - window.innerHeight) / medias.length;
      const triggerFactor = 0.85;
      gsap.set(medias, { y: gap * (medias.length - 1), z: -gap * (medias.length - 1) });

      medias.forEach((media, index) => {
        const isLast = index === 0;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinHeight,
            start: "top top+=" + distPerMedia * index * triggerFactor,
            end: "bottom bottom+=" + distPerMedia * index * triggerFactor,
            scrub: 0.2,
          },
        });
        for (let i = 0; i < medias.length - 1; i++) {
          tl.to(media, { y: "-=" + gap, z: "+=" + gap, ease: "power2.inOut" });
        }
        if (!isLast) {
          tl.to(media, {
            yPercent: -100,
            y: "-100vh",
            scale: 1.2,
            rotation: (Math.random() - 0.5) * 50,
            ease: "power4.in",
          });
        }
      });

      gsap.from("[data-cap-heading]", {
        scrollTrigger: { trigger: "[data-cap-heading]", start: "top 85%" },
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "expo.out",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative border-t border-white/[0.06] bg-[#111111]">
      <div className="container-jollo pt-24 md:pt-32 text-center">
        <h2
          data-cap-heading
          className="font-editorial text-white will-change-transform"
          style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)", letterSpacing: "-0.02em" }}
        >
          What we deliver.
        </h2>
      </div>

      <div className="services-pin-height">
        <div className="services-container">
          <div className="services-stack_list">
            {stacked.map((cap, i) => {
              const number = capabilities.length - i;
              return (
                <div key={cap.title} className="services-stack_item">
                  <div className="services-stack_card">
                    <div className="flex justify-between items-start">
                      <h3
                        className="font-display font-semibold text-white max-w-[70%]"
                        style={{ fontSize: "clamp(1.6rem, 3.2vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1.05 }}
                      >
                        {cap.title}
                      </h3>
                      <span
                        className="font-editorial text-[#e9e612] leading-none"
                        style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
                        aria-hidden="true"
                      >
                        {String(number).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex justify-between items-end gap-8">
                      <p className="text-body-lg text-white/60 leading-relaxed max-w-lg">
                        {cap.description}
                      </p>
                      <div
                        className="hidden md:block flex-none w-28 h-28 rounded-xl"
                        style={{ background: "linear-gradient(135deg, #1a1a00 0%, #2e2c04 100%)" }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
