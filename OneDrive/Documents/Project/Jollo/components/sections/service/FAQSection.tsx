"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

/* Clone CSS accordion: grid-template-rows 0fr→1fr expansion, rotating chevron
   tile, close-siblings behaviour — driven by data-accordion-status attributes. */
export default function FAQSection({ faqs }: FAQSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = sectionRef.current;
    if (!root) return;

    const accordion = root.querySelector<HTMLElement>("[data-accordion-css-init]");
    const onClick = (e: Event) => {
      const toggle = (e.target as HTMLElement).closest("[data-accordion-toggle]");
      if (!toggle || !accordion) return;
      const item = toggle.closest("[data-accordion-status]");
      if (!item) return;
      const isActive = item.getAttribute("data-accordion-status") === "active";
      item.setAttribute("data-accordion-status", isActive ? "not-active" : "active");
      if (!isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((el) => {
          if (el !== item) el.setAttribute("data-accordion-status", "not-active");
        });
      }
    };
    accordion?.addEventListener("click", onClick);

    const ctx = gsap.context(() => {
      gsap.from("[data-faq-heading]", {
        scrollTrigger: { trigger: root, start: "top 80%" },
        opacity: 0, y: 30, duration: 0.9, ease: "expo.out",
      });
      gsap.from(".accordion-css__item", {
        scrollTrigger: { trigger: root, start: "top 72%" },
        opacity: 0, y: 24, stagger: 0.08, duration: 0.7, ease: "expo.out",
      });
    }, root);

    return () => {
      accordion?.removeEventListener("click", onClick);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative section-padding border-t border-white/[0.06] bg-[#111111]">
      <div className="container-jollo grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-24 items-start">
        <h2
          data-faq-heading
          className="font-editorial text-white will-change-transform lg:sticky lg:top-28"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.02em" }}
        >
          Questions &amp; answers
        </h2>

        <div data-accordion-css-init="" className="accordion-css">
          <div className="accordion-css__list">
            {faqs.map((faq) => (
              <div key={faq.question} data-accordion-status="not-active" className="accordion-css__item">
                <div data-accordion-toggle="" className="accordion-css__item-top">
                  <h3 className="accordion-css__item-h3">{faq.question}</h3>
                  <div className="accordion-css__item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none">
                      <path d="M28.5 22.5L18 12L7.5 22.5" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" />
                    </svg>
                  </div>
                </div>
                <div className="accordion-css__item-bottom">
                  <div className="accordion-css__item-bottom-wrap">
                    <div className="accordion-css__item-bottom-content font-body text-[15px]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
