"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import ContactForm from "@/components/sections/contact/ContactForm";
import { site } from "@/content/site";

export default function CallbackPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";

    return () => {
      if (header) header.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-cb-reveal]", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.9,
        ease: "expo.out",
        delay: 0.15,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="bg-[#0a0a0a] min-h-screen" style={{ paddingTop: "clamp(3rem, 6vw, 5rem)", paddingBottom: "clamp(4rem, 8vw, 6rem)" }}>
      <div className="container-jollo">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left — branding & context */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-8">
            {/* Logo */}
            <div data-cb-reveal>
              <Link
                href="/"
                className="inline-block mb-8 hover:opacity-80 transition-opacity"
                aria-label="Jollo Experience — Home"
              >
                <Image
                  src="/images/logo.png"
                  alt="Jollo Experience"
                  width={1080}
                  height={1080}
                  className="h-16 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            <div data-cb-reveal>
              <h1
                className="font-luxe uppercase text-white"
                style={{
                  fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.1,
                }}
              >
                Share your details.
                <br />
                <span className="text-white/40">We&apos;ll take it from here.</span>
              </h1>
            </div>

            <p
              data-cb-reveal
              className="font-body text-white/50 max-w-md leading-relaxed"
              style={{ fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)" }}
            >
              Tell us what you&apos;re building and we&apos;ll reach out with
              clarifying questions for a tailored proposal — within one business
              day.
            </p>

            <div data-cb-reveal className="flex flex-col gap-3 pt-2">
              <div className="h-px w-12 bg-[#e9e612]/20" />
              <div className="flex flex-col gap-1.5">
                <a
                  href={`mailto:${site.email}`}
                  className="font-body text-sm text-white/35 hover:text-[#e9e612] transition-colors"
                >
                  {site.email}
                </a>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="font-body text-sm text-white/35 hover:text-[#e9e612] transition-colors"
                >
                  {site.phone}
                </a>
              </div>
              <p className="font-body text-[12px] text-white/20">
                {site.location}
              </p>
            </div>

            <Link
              data-cb-reveal
              href="/contact"
              className="font-body text-sm text-[#e9e612]/50 hover:text-[#e9e612] transition-colors inline-flex items-center gap-2 mt-auto pt-4"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13 8H3M7 4L3 8l4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to contact
            </Link>
          </div>

          {/* Right — the form */}
          <div className="lg:col-span-7">
            <div
              data-cb-reveal
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02]"
              style={{ padding: "clamp(1.5rem, 3vw, 2.5rem)" }}
            >
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
