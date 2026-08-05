"use client";

import { useState, useEffect, useSyncExternalStore } from "react";

/* ─── Breakpoint thresholds (matches Tailwind defaults) ─────────────────── */
export const BP = {
  mobile: 0,    // 0–767
  tablet: 768,  // 768–1024
  desktop: 1025,
} as const;

export type Breakpoint = "mobile" | "tablet" | "desktop";

/* ─── Width store ────────────────────────────────────────────────────────── */
let listeners: Array<() => void> = [];
let width = typeof window !== "undefined" ? window.innerWidth : 1280;

function subscribe(cb: () => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

if (typeof window !== "undefined") {
  const update = () => {
    width = window.innerWidth;
    listeners.forEach((l) => l());
  };
  window.addEventListener("resize", update, { passive: true });
}

function getSnapshot() {
  return width;
}
function getServerSnapshot() {
  return 1280; // SSR assumes desktop
}

/* ─── Hook: returns the current breakpoint name ─────────────────────────── */
export function useBreakpoint(): Breakpoint {
  const w = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (w < BP.tablet) return "mobile";
  if (w < BP.desktop) return "tablet";
  return "desktop";
}

/* ─── Hook: true if viewport is mobile (<768) ────────────────────────────── */
export function useIsMobile(): boolean {
  const bp = useBreakpoint();
  return bp === "mobile";
}

/* ─── Hook: true if viewport is tablet (768–1024) ────────────────────────── */
export function useIsTablet(): boolean {
  const bp = useBreakpoint();
  return bp === "tablet";
}

/* ─── Hook: true on first client render (avoids hydration mismatch) ─────── */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/* ─── GSAP matchMedia breakpoints (use in useEffect) ────────────────────── */
export const GSAP_BP = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1024px)",
  desktop: "(min-width: 1025px)",
  notMobile: "(min-width: 768px)",
} as const;
