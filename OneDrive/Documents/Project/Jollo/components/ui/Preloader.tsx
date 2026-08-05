"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const counter = counterRef.current;
    const bar = barRef.current;
    const logo = logoRef.current;
    const curtain = curtainRef.current;
    if (!root || !counter || !bar || !logo || !curtain) return;

    const count = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
        gsap.set(root, { display: "none" });
      },
    });

    tl
      // Fade logo in
      .from(logo, { opacity: 0, y: 24, duration: 0.4, ease: "expo.out" }, 0.05)
      // Count bar fill + number
      .to(bar, { scaleX: 1, duration: 1.0, ease: "power2.inOut" }, 0.15)
      .to(count, {
        val: 100,
        duration: 1.0,
        ease: "power2.inOut",
        onUpdate: () => {
          counter.textContent = String(Math.round(count.val)).padStart(2, "0");
        },
      }, 0.15)
      // Curtain swipe up — reveals the page behind
      .to(curtain, { yPercent: -100, duration: 0.6, ease: "expo.inOut" }, 1.1)
      .to(root, { opacity: 0, duration: 0.1 }, 1.6);

    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      {/* Curtain panel that swipes up */}
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-black z-10"
      />

      {/* Logo */}
      <div ref={logoRef} className="relative z-20 mb-12">
        <img
          src="/images/logo.webp"
          alt="Jollo Experience"
          className="w-auto"
          style={{ height: "clamp(100px, 22vh, 220px)" }}
        />
      </div>

      {/* Loading bar */}
      <div className="relative z-20 w-48 h-px bg-white/10 overflow-hidden">
        <div
          ref={barRef}
          className="absolute inset-0 bg-[#e9e612] origin-left will-change-transform"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Counter */}
      <div className="relative z-20 mt-6 flex items-center gap-2">
        <span
          ref={counterRef}
          className="font-display text-[#e9e612] tabular-nums"
          style={{ fontSize: "clamp(0.75rem, 1.2vw, 1rem)", letterSpacing: "0.1em" }}
        >
          00
        </span>
        <span className="font-display text-white" style={{ fontSize: "0.7rem" }}>%</span>
      </div>
    </div>
  );
}
