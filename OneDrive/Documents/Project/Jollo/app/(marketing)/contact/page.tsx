"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CtaCardsSection from "@/components/clone/CtaCardsSection";
import { site } from "@/content/site";

/* Copy-to-clipboard interaction ported from the clone (3-state rolling text). */
function CopyEmailButton({ email }: { email: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = btnRef.current;
    if (!button) return;
    const copyEmail = () => {
      navigator.clipboard.writeText(email).then(() => {
        button.setAttribute("data-copy-button", "copied");
        button.setAttribute("aria-label", "Email copied to clipboard!");
      });
    };
    const handle = (e: Event) => {
      const ke = e as KeyboardEvent;
      if (e.type === "click" || (e.type === "keydown" && (ke.key === "Enter" || ke.key === " "))) {
        e.preventDefault();
        copyEmail();
      }
    };
    const reset = () => {
      button.removeAttribute("data-copy-button");
      button.setAttribute("aria-label", "Copy email to clipboard");
    };
    const onLeave = () => { reset(); button.blur(); };
    button.addEventListener("click", handle);
    button.addEventListener("keydown", handle);
    button.addEventListener("mouseleave", onLeave);
    button.addEventListener("blur", reset);
    return () => {
      button.removeEventListener("click", handle);
      button.removeEventListener("keydown", handle);
      button.removeEventListener("mouseleave", onLeave);
      button.removeEventListener("blur", reset);
    };
  }, [email]);

  return (
    <button ref={btnRef} aria-label="Copy email to clipboard" className="copy-email-button">
      <span className="copy-email-text__wrap">
        <span className="copy-email-text__el font-body text-white text-lg">{email}</span>
        <span className="copy-email-text__el font-body text-white text-lg">Click to copy email</span>
        <span className="copy-email-text__el font-body text-lg">Copied to clipboard!</span>
      </span>
    </button>
  );
}

const detailCards = [
  { label: "Address", value: "T. Nagar, Chennai", caption: "No. 24/I, North Crescent Road, Chennai - 632 017" },
  { label: "Response Time", value: "Within 24 hours", caption: "On business days" },
];

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(containerRef.current!);

    mm.add("(min-width: 768px)", () => {
      gsap.from("[data-contact-card]", {
        scrollTrigger: { trigger: "[data-contact-info]", start: "top 80%" },
        opacity: 0, y: 40, stagger: 0.12, duration: 0.9, ease: "expo.out",
      });
    });

    mm.add("(max-width: 767px)", () => {
      gsap.from("[data-contact-card]", {
        scrollTrigger: { trigger: "[data-contact-info]", start: "top 88%" },
        opacity: 0, y: 20, stagger: 0.08, duration: 0.6, ease: "expo.out",
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#111111] min-h-screen relative">
      {/* "Ready to work with us?" — hero with momentum cards + popup form */}
      <div className="pt-16">
        <CtaCardsSection contactHref="#contact-info" />
      </div>

      {/* Contact information */}
      <section id="contact-info" data-contact-info className="section-padding border-t border-white/[0.06]">
        <div className="container-jollo">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Primary contact card */}
            <div
              data-contact-card
              className="border border-white/[0.12] rounded-2xl flex flex-col gap-3 will-change-transform"
              style={{ padding: 'clamp(0.75rem, 1.5vw, 1rem)' }}
            >
              <div
                className="relative w-full aspect-[5/2] rounded-xl overflow-hidden flex items-end"
                style={{ padding: 'clamp(1.25rem, 2.5vw, 2.5rem)', background: "linear-gradient(135deg, #141406 0%, #23230a 60%, #0d0d0d 100%)" }}
              >
                <span
                  className="font-editorial text-[#e9e612] select-none leading-none"
                  style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
                  aria-hidden="true"
                >
                  Jollo<span className="text-white">.</span>
                </span>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <h2 className="font-display font-semibold text-white text-xl">{site.name}</h2>
                <CopyEmailButton email={site.email} />
                <a
                  href={`tel:${site.phoneHref}`}
                  className="font-body text-white/70 hover:text-[#e9e612] transition-colors duration-300 text-lg"
                >
                  {site.phone}
                </a>
                <a
                  href={`tel:${site.phoneAltHref}`}
                  className="font-body text-white/70 hover:text-[#e9e612] transition-colors duration-300 text-lg"
                >
                  {site.phoneAlt}
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Secondary detail cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {detailCards.map((card) => (
                  <div
                    key={card.label}
                    data-contact-card
                    className="border border-white/[0.12] rounded-2xl flex flex-col gap-2 will-change-transform"
                    style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}
                  >
                    <p className="text-label text-[#e9e612]/60 text-xs tracking-[0.2em] uppercase">
                      {card.label}
                    </p>
                    <p className="font-display font-medium text-white text-2xl">{card.value}</p>
                    <p className="font-body text-white/50 text-sm">{card.caption}</p>
                  </div>
                ))}
              </div>

              {/* Socials */}
              <div
                data-contact-card
                className="border border-white/[0.12] rounded-2xl flex flex-col gap-4 will-change-transform"
                style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}
              >
                <p className="text-label text-[#e9e612]/60 text-xs tracking-[0.2em] uppercase">Follow</p>
                <div className="flex flex-wrap gap-8">
                  {site.social.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="font-body text-lg text-white hover:text-[#e9e612] transition-colors duration-300 relative group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#e9e612] transition-all duration-300 group-hover:w-full" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
