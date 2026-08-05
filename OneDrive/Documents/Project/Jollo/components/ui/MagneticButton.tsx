"use client";
import { useRef, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}

/**
 * Pill button from the global .jbtn system that also drifts toward the cursor
 * and springs back on leave. Label counter-moves slightly for depth.
 */
export default function MagneticButton({ href, children, variant = "primary", className = "" }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.3;
    const dy = (e.clientY - cy) * 0.3;
    gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
    if (innerRef.current) {
      gsap.to(innerRef.current, { x: dx * 0.15, y: dy * 0.15, duration: 0.4, ease: "power2.out" });
    }
  }, []);

  const onLeave = useCallback(() => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });
    if (innerRef.current) {
      gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });
    }
  }, []);

  return (
    <Link
      ref={ref}
      href={href}
      className={`jbtn ${variant === "primary" ? "jbtn--primary" : "jbtn--ghost"} group will-change-transform ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <span ref={innerRef} className="relative z-10 flex items-center gap-3 will-change-transform">
        {children}
      </span>
    </Link>
  );
}
