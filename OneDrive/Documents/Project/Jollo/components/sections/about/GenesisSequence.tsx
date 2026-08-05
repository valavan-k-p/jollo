"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  GENESIS_CHAPTERS,
  chapterOpacity,
  activeChapterIndex,
  bridgeAmount,
  smoothstep,
  type GenesisChapter,
} from "./genesis/chapters";
import type { Quality } from "./genesis/GenesisScene";

// Heavy: ~three.js + shaders. Never on the server, never in the initial bundle.
const GenesisScene = dynamic(() => import("./genesis/GenesisScene"), { ssr: false });

/**
 * Vertical placement per chapter.
 *
 * Every chapter sits low. The opening three used to be centred — back when
 * there was no orb yet to occupy the middle — but that made the copy jump from
 * the centre of the frame to its base halfway through the sequence. Anchoring
 * all six to the bottom keeps the orb in the centre throughout and gives the
 * words a single, steady baseline to arrive on.
 */
const ANCHOR: Record<string, "centre" | "low"> = {
  nothing: "low",
  idea: "low",
  energy: "low",
  formation: "low",
  orb: "low",
  beginning: "low",
};

export default function GenesisSequence() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tickRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const railFillRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLSpanElement>(null);

  /** Shared, mutated every frame — never React state, so nothing re-renders. */
  const progress = useRef(0);
  const target = useRef(0);

  const [reduced, setReduced] = useState(false);
  const [quality, setQuality] = useState<Quality>("high");
  // Defaults to on: if the observer never reports (hidden tab, unsupported
  // rootMargin), the scene must still render rather than stay blank.
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);

  /* Environment probes ---------------------------------------------------- */
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia("(max-width: 900px), (pointer: coarse)");

    const sync = () => {
      setReduced(motionQuery.matches);
      setQuality(coarseQuery.matches ? "low" : "high");
    };
    sync();
    setReady(true);

    motionQuery.addEventListener("change", sync);
    coarseQuery.addEventListener("change", sync);
    return () => {
      motionQuery.removeEventListener("change", sync);
      coarseQuery.removeEventListener("change", sync);
    };
  }, []);

  /* Only run the WebGL loop while the stage is on screen. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "10% 0px" }
    );
    io.observe(stage);
    return () => io.disconnect();
  }, [reduced]);

  /* Scroll → progress → DOM ----------------------------------------------- */
  useEffect(() => {
    if (reduced || !ready) return;
    const track = trackRef.current;
    if (!track) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        target.current = self.progress;
      },
    });

    let lastActive = -1;

    const paint = () => {
      // A little inertia on top of Lenis so nothing ever snaps.
      progress.current += (target.current - progress.current) * 0.18;
      const p = progress.current;

      // Chapter copy
      GENESIS_CHAPTERS.forEach((chapter, i) => {
        const el = chapterRefs.current[i];
        if (!el) return;
        const op = chapterOpacity(p, chapter);
        el.style.opacity = String(op);
        el.style.transform = `translate3d(0, ${(1 - op) * 22}px, 0)`;
        // Deliberately no `visibility: hidden` — the blocks carry no focusable
        // content and the overlay is pointer-events-none, so leaving them in
        // the accessibility tree lets a screen reader hear the whole narrative
        // in order without scrolling seven viewports.
      });

      // Progress rail
      if (railFillRef.current) {
        railFillRef.current.style.transform = `scaleY(${p})`;
      }
      const idx = activeChapterIndex(p);
      if (idx !== lastActive) {
        lastActive = idx;
        tickRefs.current.forEach((tick, i) => {
          if (tick) tick.style.opacity = i === idx ? "1" : "0.25";
        });
        markerRefs.current.forEach((marker, i) => {
          if (marker) marker.style.opacity = i === idx ? "1" : "0";
        });
      }

      // Scroll hint retires once the first chapter is behind us
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - smoothstep(0.02, 0.1, p));
      }

      // The gold thread: the docked orb's light reaching down into the real story.
      if (bridgeRef.current) {
        const b = bridgeAmount(p);
        bridgeRef.current.style.opacity = String(b);
        bridgeRef.current.style.transform = `scaleY(${b})`;
      }
    };

    // Ride the GSAP ticker rather than opening a second rAF loop: Lenis is
    // already driven from it, so this runs after the scroll position settles
    // each frame instead of racing it.
    paint();
    gsap.ticker.add(paint);

    return () => {
      gsap.ticker.remove(paint);
      trigger.kill();
    };
  }, [reduced, ready]);

  /* ─── Reduced motion: the same story, told without movement ───────────── */
  if (ready && reduced) {
    return <GenesisStatic />;
  }

  return (
    <section
      ref={trackRef}
      className="genesis-track relative bg-[#070707]"
      aria-label="Our Story — the origin of Jollo Experience"
    >
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Canvas */}
        <div className="absolute inset-0" aria-hidden="true">
          {ready && <GenesisScene progress={progress} quality={quality} active={active} />}
        </div>

        {/* Scrim — the orb is centred and large, so the lower copy sits over
            its bottom edge. This keeps the headline fully legible there
            without dimming the orb's luminous middle. */}
        <div
          className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to top, #070707 0%, rgba(7,7,7,0.96) 28%, rgba(7,7,7,0.86) 50%, rgba(7,7,7,0.62) 74%, rgba(7,7,7,0) 100%)",
          }}
        />

        {/* Chapters */}
        <div className="genesis-enter absolute inset-0 z-10 pointer-events-none">
          {GENESIS_CHAPTERS.map((chapter, i) => (
            <ChapterBlock
              key={chapter.id}
              chapter={chapter}
              index={i}
              ref={(el) => {
                chapterRefs.current[i] = el;
              }}
            />
          ))}
        </div>

        {/* Progress rail */}
        <div
          className="genesis-rail absolute right-[clamp(1rem,3vw,3rem)] top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-end gap-0 pointer-events-none"
          aria-hidden="true"
        >
          <span className="genesis-rail__track">
            <span ref={railFillRef} className="genesis-rail__fill" />
          </span>
          <div className="absolute inset-y-0 right-0 flex flex-col justify-between items-end">
            {GENESIS_CHAPTERS.map((chapter, i) => (
              <div key={chapter.id} className="flex items-center gap-3">
                <span
                  ref={(el) => {
                    markerRefs.current[i] = el;
                  }}
                  className="font-body text-[0.6875rem] tracking-[0.2em] uppercase text-[#e9e612] whitespace-nowrap transition-opacity duration-500"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  {chapter.marker}
                </span>
                <span
                  ref={(el) => {
                    tickRefs.current[i] = el;
                  }}
                  className="genesis-rail__tick"
                  style={{ opacity: i === 0 ? 1 : 0.25 }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* The gold thread — the docked orb's light running down into the
            founder's story, which picks it up as its own timeline rail. */}
        <span
          ref={bridgeRef}
          className="genesis-bridge"
          aria-hidden="true"
          style={{ opacity: 0, transform: "scaleY(0)" }}
        />

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none"
          aria-hidden="true"
        >
          <span className="font-body text-[0.625rem] tracking-[0.35em] uppercase text-white/30">
            Scroll
          </span>
          <span className="genesis-hint__line" />
        </div>
      </div>
    </section>
  );
}

/* ─── Chapter block ───────────────────────────────────────────────────────── */

type ChapterBlockProps = {
  chapter: GenesisChapter;
  index: number;
  ref: (el: HTMLDivElement | null) => void;
};

function ChapterBlock({ chapter, index, ref }: ChapterBlockProps) {
  const low = ANCHOR[chapter.id] === "low";
  const Heading = index === 0 ? "h1" : "h2";

  return (
    <div
      ref={ref}
      className={`absolute inset-x-0 flex flex-col items-center text-center px-[clamp(1.5rem,6vw,6rem)] will-change-transform ${
        low ? "bottom-[7vh]" : "top-1/2 -translate-y-1/2"
      }`}
      style={{ opacity: 0 }}
    >
      {chapter.label && (
        <p className="type-placard text-[#e9e612]/70 mb-[clamp(1.75rem,3.5vw,3rem)]">
          {chapter.label}
        </p>
      )}

      {chapter.lines ? (
        <>
          <Heading
            className="type-editorial text-white max-w-[20ch]"
            style={{
              fontSize: "clamp(2.5rem, 7.2vw, 7.25rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
            }}
          >
            {chapter.lines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </Heading>
          {chapter.sub && (
            <p className="type-editorial--quiet text-white/50 mt-[clamp(1.5rem,3vw,2.5rem)] text-[clamp(1rem,1.5vw,1.35rem)]">
              {chapter.sub}
            </p>
          )}
        </>
      ) : (
        /* Chapters 04 and 05 are wordless — only a quiet marker for orientation. */
        <p className="type-eyebrow text-white/30">
          <span className="text-[#e9e612]/50">{chapter.numeral}</span>
          <span className="mx-3">—</span>
          {chapter.marker}
        </p>
      )}
    </div>
  );
}

/* ─── Static fallback ─────────────────────────────────────────────────────── */

/**
 * With `prefers-reduced-motion` the pinned sequence is replaced entirely —
 * no scroll-jacking, no WebGL, no animation. The narrative survives as a
 * quiet editorial column.
 */
function GenesisStatic() {
  return (
    <section
      className="relative bg-[#070707] overflow-hidden"
      aria-label="Our Story — the origin of Jollo Experience"
    >
      <div
        className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[min(46rem,90vw)] aspect-square pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(233,230,18,0.14) 0%, rgba(233,230,18,0.05) 34%, transparent 68%)",
        }}
      />
      <div className="container-jollo relative z-10 section-padding flex flex-col items-center text-center gap-[clamp(4rem,9vw,8rem)]">
        {GENESIS_CHAPTERS.map((chapter, i) => {
          const Heading = i === 0 ? "h1" : "h2";
          return (
            <div key={chapter.id} className="flex flex-col items-center gap-6">
              {chapter.label && (
                <p className="type-placard text-[#e9e612]/70">
                  {chapter.label}
                </p>
              )}
              {chapter.lines ? (
                <>
                  <Heading
                    className="type-editorial text-white max-w-[20ch]"
                    style={{
                      fontSize: "clamp(2.4rem, 6.2vw, 6rem)",
                      lineHeight: 1.02,
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {chapter.lines.map((line, j) => (
                      <span key={j} className="block">
                        {line}
                      </span>
                    ))}
                  </Heading>
                  {chapter.sub && (
                    <p className="type-editorial--quiet text-white/50 text-[clamp(1rem,1.5vw,1.35rem)]">
                      {chapter.sub}
                    </p>
                  )}
                </>
              ) : (
                <p className="type-eyebrow text-white/30">
                  <span className="text-[#e9e612]/50">{chapter.numeral}</span>
                  <span className="mx-3">—</span>
                  {chapter.marker}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
