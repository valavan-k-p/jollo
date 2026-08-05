"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { nav } from "@/content/navigation";
import { site } from "@/content/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileMenuMounted, setIsMobileMenuMounted] = useState(false);
  const pathname = usePathname();

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerLinesRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Hamburger animation
  useEffect(() => {
    const [line1, line2, line3] = hamburgerLinesRef.current;
    if (!line1 || !line2 || !line3) return;

    if (menuOpen) {
      gsap.to(line1, { rotate: 45, y: 7, duration: 0.3, ease: "expo.out" });
      gsap.to(line2, { opacity: 0, scaleX: 0, duration: 0.2 });
      gsap.to(line3, { rotate: -45, y: -7, duration: 0.3, ease: "expo.out" });
    } else {
      gsap.to(line1, { rotate: 0, y: 0, duration: 0.3, ease: "expo.out" });
      gsap.to(line2, { opacity: 1, scaleX: 1, duration: 0.3 });
      gsap.to(line3, { rotate: 0, y: 0, duration: 0.3, ease: "expo.out" });
    }
  }, [menuOpen]);

  // Mobile menu mount/unmount animation
  useEffect(() => {
    if (menuOpen) {
      setIsMobileMenuMounted(true);
      document.body.style.overflow = "hidden";
    } else if (isMobileMenuMounted) {
      if (mobileMenuRef.current) {
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            setIsMobileMenuMounted(false);
            document.body.style.overflow = "";
          }
        });
      } else {
        setIsMobileMenuMounted(false);
        document.body.style.overflow = "";
      }
    }
  }, [menuOpen]);

  useEffect(() => {
    if (isMobileMenuMounted && menuOpen && mobileMenuRef.current) {
      gsap.fromTo(mobileMenuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "expo.out" }
      );
      
      const items = mobileMenuRef.current.querySelectorAll("[data-mobile-item]");
      gsap.fromTo(items, 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.4, ease: "expo.out", delay: 0.1 }
      );
    }
  }, [isMobileMenuMounted, menuOpen]);


  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-transparent">
        <div className="container-jollo flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="inline-block group"
            aria-label="Jollo Experience — Home"
          >
            <Image
              src="/images/logo.png"
              alt="Jollo Experience"
              width={1080}
              height={1080}
              className="h-16 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-display text-sm font-medium transition-colors duration-200 relative group h-10 flex items-center",
                  pathname === item.href
                    ? "text-white"
                    : "text-white hover:text-white"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <span
                    className="absolute bottom-1.5 left-0 right-0 h-px bg-[#e9e612]"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <Link href={site.primaryCta.href} className="jbtn jbtn--outline jbtn--sm">
                {site.primaryCta.label}
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span
                ref={(el) => { hamburgerLinesRef.current[0] = el; }}
                className="block w-6 h-px bg-white origin-center"
              />
              <span
                ref={(el) => { hamburgerLinesRef.current[1] = el; }}
                className="block w-6 h-px bg-white origin-center"
              />
              <span
                ref={(el) => { hamburgerLinesRef.current[2] = el; }}
                className="block w-6 h-px bg-white origin-center"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuMounted && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col pt-20 pb-10 px-6 overflow-y-auto will-change-transform"
        >
          {/* Radial glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#e9e612]/5 blur-[100px] rounded-full pointer-events-none" />

          <nav className="flex flex-col gap-1 mt-8 relative z-10">
            {nav.map((item, i) => (
              <div key={item.href} data-mobile-item>
                <Link
                  href={item.href}
                  className="block py-3 px-2 font-display text-3xl font-semibold text-white border-b border-white/5 hover:text-[#e9e612] transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>

          <div className="mt-auto pt-8 relative z-10" data-mobile-item>
            <Link
              href={site.primaryCta.href}
              className="block w-full text-center py-4 rounded-2xl bg-[#e9e612] text-black font-display font-semibold text-sm tracking-wide hover:bg-[#f5f200] transition-colors duration-200 shadow-[0_0_40px_rgba(233,230,18,0.3)]"
              onClick={() => setMenuOpen(false)}
            >
              {site.primaryCta.label}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
