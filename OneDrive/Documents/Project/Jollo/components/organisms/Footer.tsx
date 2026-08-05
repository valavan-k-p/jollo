"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/content/navigation";
import { site } from "@/content/site";

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(footerRef.current!);

    /* Desktop: full stagger reveal */
    mm.add("(min-width: 768px)", () => {
      gsap.from("[data-footer-reveal]", {
        scrollTrigger: { trigger: footerRef.current, start: "top 85%" },
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.8,
        ease: "expo.out",
      });
    });

    /* Mobile: lighter, faster */
    mm.add("(max-width: 767px)", () => {
      gsap.from("[data-footer-reveal]", {
        scrollTrigger: { trigger: footerRef.current, start: "top 90%" },
        opacity: 0,
        y: 16,
        stagger: 0.05,
        duration: 0.6,
        ease: "expo.out",
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative bg-[#111111] overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#e9e612]/[0.03] blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#e9e612]/[0.02] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[300px] h-[300px] bg-[#e9e612]/[0.015] blur-[100px] rounded-full pointer-events-none" />

      {/* Big CTA section - Only on Home Page */}
      {isHomePage && (
        <div className="relative z-10 min-h-[60vh] md:min-h-[85vh] flex items-center border-b border-white/[0.06]">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(233,230,18,0.06) 0%, transparent 70%)",
            }}
          />
          <div className="container-jollo relative z-10 w-full">
            <div data-footer-reveal className="flex flex-col gap-10 max-w-4xl">
              <p className="type-eyebrow text-[#e9e612]/60">
                Start a project
              </p>
              <Link href={site.primaryCta.href} className="group inline-block">
                {/* Three rows, three treatments: serif statement, outlined
                    condensed shout, italic close. Indents step the block off the
                    left margin so it reads as a composition, not a paragraph. */}
                <h2
                  className="tx-head tx-stagger text-white w-full"
                  style={{ fontSize: "clamp(2.4rem, 7.4vw, 7rem)" }}
                >
                  <span className="tx-row tx-row--start block">
                    <span className="tx-serif tx-snug">Let&apos;s create</span>
                  </span>
                  <span className="tx-row tx-row--start block tx-indent tx-overlap">
                    <span className="tx-condensed tx-xl tx-outline">something</span>
                  </span>
                  <span className="tx-row tx-row--start block tx-indent-lg tx-overlap">
                    <span className="tx-serif tx-italic tx-gold tx-snug transition-colors duration-500 group-hover:text-white">
                      extraordinary.
                    </span>
                  </span>
                </h2>
              </Link>
              <p className="type-ui text-[1.0625rem] text-white/45 max-w-lg">
                Whether it&apos;s a brand launch, a corporate summit, or a growth
                strategy — we&apos;d love to hear what you&apos;re building.
              </p>
              <div className="flex flex-col sm:flex-row gap-3.5 pt-2 w-full sm:w-auto">
                <Link href={site.primaryCta.href} className="jbtn jbtn--outline jbtn--lg w-full sm:w-auto text-center min-h-[48px]">
                  {site.primaryCta.label}
                  <span className="jbtn__icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
                <a href={`mailto:${site.email}`} className="jbtn jbtn--ghost jbtn--lg w-full sm:w-auto text-center min-h-[48px]">
                  {site.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main footer grid */}
      <div className="container-jollo relative z-10" style={{ padding: "clamp(3rem, 6vw, 6rem) clamp(1rem, 4vw, 4rem)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-10">
          {/* Brand column */}
          <div data-footer-reveal className="lg:col-span-4 flex flex-col gap-5">
            <Link href="/" className="inline-block group">
              <Image
                src="/images/logo.png"
                alt="Jollo Experience"
                width={480}
                height={120}
                className="h-28 sm:h-32 w-auto object-contain brightness-100 group-hover:brightness-125 transition-all duration-300"
              />
            </Link>
            <p className="type-ui text-[0.9375rem] text-white/45 max-w-sm">
              Creating Experiences. Building Brands.
              <br />
              Driving Growth.
            </p>
            <p className="font-body text-sm text-white/25">{site.location}</p>
          </div>

          {/* Services column */}
          <div data-footer-reveal className="lg:col-span-3">
            <h3 className="type-ui--label text-white/35 mb-5 sm:mb-7">
              Services
            </h3>
            <ul className="flex flex-col gap-3">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="group/link font-body text-sm text-white/60 hover:text-white py-1 transition-colors duration-300 flex items-center gap-3 min-h-[40px]"
                  >
                    <span className="w-0 group-hover/link:w-4 h-px bg-[#e9e612] transition-all duration-400 overflow-hidden" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation column */}
          <div data-footer-reveal className="lg:col-span-2">
            <h3 className="type-ui--label text-white/35 mb-5 sm:mb-7">
              Company
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Home", href: "/" },
                { label: "Experience", href: "/work" },
                { label: "Our Story", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group/link font-body text-sm text-white/60 hover:text-white py-1 transition-colors duration-300 flex items-center gap-3 min-h-[40px]"
                  >
                    <span className="w-0 group-hover/link:w-4 h-px bg-[#e9e612] transition-all duration-400 overflow-hidden" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect column */}
          <div data-footer-reveal className="lg:col-span-3">
            <h3 className="type-ui--label text-white/35 mb-5 sm:mb-7">
              Connect
            </h3>
            <a
              href={`mailto:${site.email}`}
              className="font-body text-sm text-white/60 hover:text-[#e9e612] transition-colors duration-300 inline-block py-1 min-h-[40px]"
            >
              {site.email}
            </a>
            <div className="flex flex-col gap-2 mt-2">
              <a
                href={`tel:${site.phoneHref}`}
                className="font-body text-sm text-white/60 hover:text-[#e9e612] transition-colors duration-300 py-1 min-h-[40px]"
              >
                {site.phone}
              </a>
              <a
                href={`tel:${site.phoneAltHref}`}
                className="font-body text-sm text-white/60 hover:text-[#e9e612] transition-colors duration-300 py-1 min-h-[40px]"
              >
                {site.phoneAlt}
              </a>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <a
                href={`tel:${site.phoneHref}`}
                aria-label="Phone"
                className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-white hover:text-[#e9e612] active:scale-95 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-white hover:text-[#e9e612] active:scale-95 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-white hover:text-[#e9e612] active:scale-95 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-jollo relative z-10 pb-8">
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/20">
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="font-body text-xs text-white/20 hover:text-white/50 transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-body text-xs text-white/20 hover:text-white/50 transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
          <p className="font-editorial text-sm text-white/15 italic">
            Crafted with intent.
          </p>
        </div>
      </div>
    </footer>
  );
}
