"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { serviceList } from "@/content/homepage";

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const root = sectionRef.current!;
      const pinHeight = root.querySelector<HTMLElement>(".services-pin-height");
      const container = root.querySelector<HTMLElement>(".services-container");
      if (!pinHeight || !container) return;

      ScrollTrigger.create({
        trigger: pinHeight,
        start: "top top",
        end: "bottom bottom",
        pin: container,
      });

      const cards = root.querySelectorAll<HTMLElement>(".services-item");
      const numCards = cards.length;
      if (numCards === 0) return;

      const gap = 14; // pixels vertical offset in the stack
      const scaleOffset = 0.015; // scale factor depth offset

      // 1. Initial 3D deck arrangement
      cards.forEach((card, index) => {
        gsap.set(card, {
          y: gap * index,
          scale: 1 - scaleOffset * index,
          transformOrigin: "center bottom",
        });
      });

      // 2. Multi-phase synchronized scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinHeight,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      // We animate cards 0 to numCards - 2 (the first 5 cards)
      // Card index `i` flies off, while all remaining cards `j > i` shift up
      for (let i = 0; i < numCards - 1; i++) {
        // Define direction alternating
        const isLeft = i % 2 === 0;
        const xOffset = isLeft ? "-15vw" : "15vw";
        const rotVal = isLeft ? -12 : 12;

        const label = `card-${i}-fly`;
        tl.add(label);

        // Fly off card `i`
        tl.to(cards[i], {
          yPercent: -130,
          x: xOffset,
          rotation: rotVal,
          scale: 1.1,
          ease: "power2.inOut",
          duration: 1,
        }, label);

        // Shift all remaining cards up by one step
        for (let j = i + 1; j < numCards; j++) {
          const relativeIndex = j - (i + 1); // where it should land in the stack (0 for card i+1)
          tl.to(cards[j], {
            y: gap * relativeIndex,
            scale: 1 - scaleOffset * relativeIndex,
            ease: "power2.inOut",
            duration: 1,
          }, label);
        }

        // Add a small pause at each card display step
        tl.to({}, { duration: 0.3 });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Curated animal background images for the 6 cards (minimalist style)
  const serviceImages = [
    "/images/experience/1.jpeg",
    "/images/experience/2.jpeg",
    "/images/experience/3.jpeg",
    "/images/experience/4.jpeg",
    "/images/experience/5.jpeg",
    "/images/experience/6.jpeg",
  ];

  return (
    <section ref={sectionRef} id="services-section" className="relative w-full bg-[#1a1a1a] overflow-hidden">
      {/* Pinned height wrapper for scrolling (600vh height provides 5 card transitions) */}
      <div className="services-pin-height relative w-full h-[400vh]">
        {/* Sticky container that stays fixed on screen while pinning */}
        <div className="services-container top-0 left-0 w-full h-screen flex flex-col justify-between py-12 md:py-16 items-center overflow-hidden">

          {/* Header */}
          <div className="services-heading flex flex-col items-center justify-start text-center z-20 px-4">
            <p className="type-eyebrow text-[#e9e612] mb-5">
              What We Do
            </p>
            <h2
              className="font-luxe text-white uppercase"
              style={{
                fontSize: "clamp(1.8rem, 4.5vw, 3.6rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Six ways we build your brand.
            </h2>
          </div>

          {/* Cards Deck */}
          <div className="services-list relative w-full max-w-[50rem] h-[48vh] md:h-[32rem] px-4 sm:px-6 md:px-8 mt-6 mb-6 z-10 flex items-center justify-center">
            {serviceList.map((svc, i) => {
              const zIndex = 20 + (serviceList.length - i);
              return (
                <div
                  key={svc.title}
                  className="services-item absolute w-[92%] md:w-full h-full rounded-[1.5rem] md:rounded-[2rem] border border-black/10 text-black shadow-2xl overflow-hidden bg-[#fafaf9]"
                  style={{ zIndex }}
                >
                  {/* Background Image with Ken-Burns Zoom */}
                  <div className="absolute inset-0 z-0 overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
                    <img
                      src={serviceImages[i % serviceImages.length]}
                      alt={svc.title}
                      className={`w-full h-full object-cover opacity-100 ${i === 0 ? "animate-ken-burns" : ""}`}
                      loading="lazy"
                    />
                  </div>



                </div>
              );
            })}
          </div>

          {/* Bottom spacing helper */}
          <div className="w-full h-4" />

        </div>
      </div>
    </section>
  );
}
