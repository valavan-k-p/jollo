"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Signature interaction: a small yellow ball that follows the native browser cursor
 * with a smooth trailing ease.
 *
 * Disabled entirely for touch / coarse pointers and for reduced-motion users.
 */
export default function CustomCursor() {
  const ballRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const ball = ballRef.current;
    if (!ball) return;

    document.documentElement.classList.add("has-custom-cursor");

    const mouse = { x: 0, y: 0 };
    const ballPos = { x: 0, y: 0 };
    let isVisible = false;

    // Quick setters for performant translation
    const setBallX = gsap.quickTo(ball, "x", { duration: 0.12, ease: "power2.out" });
    const setBallY = gsap.quickTo(ball, "y", { duration: 0.12, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      if (!isVisible) {
        isVisible = true;
        gsap.to(ball, { opacity: 1, duration: 0.3, overwrite: "auto" });
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onLeave = () => {
      isVisible = false;
      gsap.to(ball, { opacity: 0, duration: 0.2, overwrite: "auto" });
    };

    const textFieldsSelector = "input, textarea, select";
    const interactiveSelector = 'a, button, [data-cursor="hover"], [role="button"]';

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Hide custom cursor over inputs/textareas where native I-beam is shown
      if (target.closest(textFieldsSelector)) {
        gsap.to(ball, { opacity: 0, duration: 0.2, overwrite: "auto" });
        return;
      }

      const interactive = target.closest(interactiveSelector);
      if (interactive) {
        gsap.to(ball, { scale: 1.6, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.closest(textFieldsSelector)) {
        gsap.to(ball, { opacity: 1, duration: 0.2, overwrite: "auto" });
      }

      const interactive = target.closest(interactiveSelector);
      if (interactive) {
        gsap.to(ball, { scale: 1.0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    let lastTime = gsap.ticker.time;

    const tick = () => {
      const currentTime = gsap.ticker.time;
      const dt = Math.min((currentTime - lastTime) * 60, 4);
      lastTime = currentTime;

      // Update ball position (trailing lag behind native pointer)
      ballPos.x += (mouse.x - ballPos.x) * 0.15 * dt;
      ballPos.y += (mouse.y - ballPos.y) * 0.15 * dt;

      setBallX(ballPos.x);
      setBallY(ballPos.y);
    };

    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      gsap.ticker.remove(tick);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] hidden [@media(pointer:fine)]:block">
      <div
        ref={ballRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e9e612] opacity-0 will-change-transform"
        style={{ width: 8, height: 8, boxShadow: "0 0 10px rgba(233, 230, 18, 0.4)" }}
      />
    </div>
  );
}
