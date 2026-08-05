"use client";
import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

interface CursorFollowImageProps {
  active: boolean;
  gradient?: string;
  width?: number;
  height?: number;
}

export default function CursorFollowImage({
  active,
  gradient = "linear-gradient(135deg, #111 0%, #080808 100%)",
  width = 300,
  height = 200,
}: CursorFollowImageProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    gsap.set(el, { x: -9999, y: -9999 });
    xTo.current = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3" });
    yTo.current = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3" });
  }, []);

  const onMove = useCallback((e: MouseEvent) => {
    xTo.current?.(e.clientX);
    yTo.current?.(e.clientY);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [onMove]);

  return (
    <div
      ref={outerRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[35] pointer-events-none will-change-transform"
      style={{ width, height, marginLeft: -(width / 2), marginTop: -(height / 2) }}
    >
      {/* Inner div handles opacity + scale via CSS transition — no GSAP conflict */}
      <div
        className="w-full h-full overflow-hidden"
        style={{
          opacity: active ? 1 : 0,
          transform: active ? "scale(1)" : "scale(0.88)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <div className="absolute inset-0" style={{ background: gradient }} />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }}
        />
      </div>
    </div>
  );
}
