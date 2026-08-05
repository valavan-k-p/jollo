"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhoneIcon, MailIcon } from "@/components/clone/Symbols";

interface CtaCardsSectionProps {
  contactHref?: string;
}

export default function CtaCardsSection({ contactHref = "/contact" }: CtaCardsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let lastX = 0, lastY = 0, dX = 0, dY = 0;
    let frame: number | null = null;
    const clampXY = gsap.utils.clamp(-36, 36);
    const clampRot = gsap.utils.clamp(-10, 10);

    const onMove = (e: MouseEvent) => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          dX = e.clientX - lastX;
          dY = e.clientY - lastY;
          lastX = e.clientX;
          lastY = e.clientY;
          frame = null;
        });
      }
    };
    root.addEventListener("mousemove", onMove);

    const cleanups: Array<() => void> = [];
    root.querySelectorAll<HTMLElement>("[data-momentum-hover-element]").forEach((el) => {
      const onEnter = (e: MouseEvent) => {
        const target = el.querySelector<HTMLElement>("[data-momentum-hover-target]");
        if (!target) return;
        const { left, top, width, height } = target.getBoundingClientRect();
        const cx = left + width / 2;
        const cy = top + height / 2;
        const ox = e.clientX - cx;
        const oy = e.clientY - cy;
        const torque = (ox * dY - oy * dX) / (Math.hypot(ox, oy) || 1);
        gsap.to(target, {
          x: clampXY(dX * 1.2),
          y: clampXY(dY * 1.2),
          rotation: clampRot(torque * 0.6),
          duration: 0.25,
          ease: "power2.out",
          overwrite: true,
          onComplete: () => {
            gsap.to(target, { x: 0, y: 0, rotation: 0, duration: 1.4, ease: "elastic.out(1, 0.35)" });
          },
        });
      };
      el.addEventListener("mouseenter", onEnter);
      cleanups.push(() => el.removeEventListener("mouseenter", onEnter));
    });

    return () => {
      root.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(sectionRef.current!);

    /* Desktop: full stagger */
    mm.add("(min-width: 768px)", () => {
      gsap.from("[data-cta-cards-title]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        opacity: 0, y: 30, duration: 0.9, ease: "expo.out",
      });
      gsap.from("[data-momentum-hover-element]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        opacity: 0, y: 60, stagger: 0.15, duration: 1, ease: "expo.out",
      });
    });

    /* Mobile: lighter, closer triggers */
    mm.add("(max-width: 767px)", () => {
      gsap.from("[data-cta-cards-title]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 88%" },
        opacity: 0, y: 16, duration: 0.6, ease: "expo.out",
      });
      gsap.from("[data-momentum-hover-element]", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
        opacity: 0, y: 30, stagger: 0.1, duration: 0.7, ease: "expo.out",
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative section-padding border-t border-white/[0.06] bg-black overflow-hidden">
      <div className="container-jollo">
        <div className="flex flex-col items-center gap-12 w-full text-center">
          <div data-cta-cards-title className="flex flex-col items-center gap-4 max-w-3xl will-change-transform">
            <h2
              className="font-editorial text-white"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em", lineHeight: 1.05 }}
            >
              Ready to work with us?
            </h2>
            <p className="text-body-lg text-white/70">Choose how you would like to get in touch.</p>
          </div>

          <div className="cta-cards">
            {/* Card 1: We'll call you → dedicated form page */}
            <div data-momentum-hover-element="" className="cta-card_wrap will-change-transform">
              <Link
                href="/contact/callback"
                data-momentum-hover-target=""
                className="cta-card is-lime text-left"
              >
                <h3 className="cta-card_h">We&apos;ll call you</h3>
                <span className="cta-card_emoji" aria-hidden="true">
                  <PhoneIcon className="w-full" />
                </span>
                <div className="cta-card_body">
                  <p className="font-body text-[15px] leading-relaxed max-w-[26ch]">
                    Share your details and we&apos;ll reach out with clarifying questions for a
                    tailored proposal.
                  </p>
                  <span className="cta-card_btn">Share your contact info</span>
                </div>
              </Link>
            </div>

            {/* Card 2: Contact us */}
            <div data-momentum-hover-element="" className="cta-card_wrap will-change-transform">
              {contactHref.startsWith("#") ? (
                <a
                  href={contactHref}
                  data-momentum-hover-target=""
                  className="cta-card is-grey"
                  aria-label="Contact information"
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.querySelector(contactHref);
                    if (target) target.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <h3 className="cta-card_h">Contact us</h3>
                  <span className="cta-card_emoji" aria-hidden="true">
                    <MailIcon className="w-full" />
                  </span>
                  <div className="cta-card_body">
                    <p className="font-body text-[15px] leading-relaxed max-w-[26ch] text-white/70">
                      Email or call us to start the discussion right away.
                    </p>
                    <span className="cta-card_btn">Contact information</span>
                  </div>
                </a>
              ) : (
                <Link
                  href={contactHref}
                  data-momentum-hover-target=""
                  className="cta-card is-grey"
                  aria-label="Contact information"
                >
                  <h3 className="cta-card_h">Contact us</h3>
                  <span className="cta-card_emoji" aria-hidden="true">
                    <MailIcon className="w-full" />
                  </span>
                  <div className="cta-card_body">
                    <p className="font-body text-[15px] leading-relaxed max-w-[26ch] text-white/70">
                      Email or call us to start the discussion right away.
                    </p>
                    <span className="cta-card_btn">Contact information</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
