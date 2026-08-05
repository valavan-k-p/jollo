"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Film reel frames — real photos from the Jollo archive, numbered sequentially.
 * 53 images covering events, experiences, and behind-the-scenes moments.
 */
const MILESTONES = Array.from({ length: 53 }, (_, i) => {
  const num = String(i + 1).padStart(2, "0");
  return { year: "", title: "", image: `/images/filmstrip/film-${num}.jpeg` };
});

/**
 * Reel pace, expressed as the seconds one frame takes to pass a fixed point.
 *
 * Deliberately not px/sec: frame width changes with the breakpoint (360px on
 * desktop, 210px on mobile), so a fixed pixel speed would make the reel feel
 * markedly faster on small screens. Timing it per frame keeps the rhythm the
 * same everywhere. Lower is faster.
 */
const SECONDS_PER_FRAME = 1.8;

export default function FilmStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section || reduced) return;

    const ctx = gsap.context(() => {
      let tween: gsap.core.Tween | null = null;

      const build = () => {
        tween?.kill();
        // The frames are rendered twice; one copy's width is the loop distance.
        const loopWidth = track.scrollWidth / 2;
        if (loopWidth <= 0) return;

        const frameWidth = loopWidth / MILESTONES.length;

        // Start mid-reel rather than aligned: the first frame is already half
        // out past the left edge, so the strip reads as film that was running
        // before you arrived and continues past both edges.
        gsap.set(track, { x: -frameWidth * 0.5 });

        tween = gsap.to(track, {
          x: `-=${loopWidth}`,
          duration: SECONDS_PER_FRAME * MILESTONES.length,
          ease: "none",
          repeat: -1,
          // Wrapping x by exactly one copy's width means the reset lands on an
          // identical frame — there is no visible jump, ever.
          modifiers: {
            x: gsap.utils.unitize((x: string) => parseFloat(x) % loopWidth),
          },
        });
        tweenRef.current = tween;
      };

      build();

      // Rebuild on resize: frame width is fluid, so the loop distance changes.
      let resizeTimer: ReturnType<typeof setTimeout>;
      const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 200);
      };
      window.addEventListener("resize", onResize);

      // Off-screen reels cost frames for nothing. Pausing preserves position,
      // so it is still mid-motion the moment it scrolls back into view.
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!tweenRef.current) return;
          if (entry.isIntersecting) tweenRef.current.play();
          else tweenRef.current.pause();
        },
        { rootMargin: "150px 0px" }
      );
      io.observe(section);

      return () => {
        window.removeEventListener("resize", onResize);
        clearTimeout(resizeTimer);
        io.disconnect();
        tween?.kill();
        tweenRef.current = null;
      };
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  /* Hovering a frame eases the reel to a stop rather than snapping it. */
  const holdReel = () => {
    if (!tweenRef.current) return;
    gsap.to(tweenRef.current, { timeScale: 0, duration: 0.55, ease: "power2.out" });
  };
  const releaseReel = () => {
    if (!tweenRef.current) return;
    gsap.to(tweenRef.current, { timeScale: 1, duration: 0.9, ease: "power2.inOut" });
  };

  // Rendered twice for the seamless loop; the second pass is decorative only.
  const reel = [...MILESTONES, ...MILESTONES];

  return (
    <section
      ref={sectionRef}
      className="filmstrip-section relative overflow-hidden"
      aria-labelledby="filmstrip-heading"
    >
      <div className="container-jollo relative z-10">
        <h2
          id="filmstrip-heading"
          className="font-luxe uppercase text-white text-center"
          style={{ fontSize: "clamp(2.4rem, 6vw, 5.5rem)", letterSpacing: "-0.02em", lineHeight: 1.05 }}
        >
          Our Journey
        </h2>
      </div>

      {/* Generous air between the words and the reel */}
      <div className="filmstrip" data-reduced={reduced ? "true" : undefined}>
        <div className="filmstrip__viewport">
          <div ref={trackRef} className="filmstrip__track">
            {reel.map((frame, i) => {
              const isDuplicate = i >= MILESTONES.length;
              return (
                <article
                  key={`${frame.year}-${i}`}
                  className="filmstrip__frame"
                  aria-hidden={isDuplicate || undefined}
                  onMouseEnter={holdReel}
                  onMouseLeave={releaseReel}
                  onFocus={holdReel}
                  onBlur={releaseReel}
                  tabIndex={isDuplicate ? -1 : 0}
                >
                  <div className="filmstrip__window">
                    <img
                      src={frame.image}
                      alt={isDuplicate ? "" : `${frame.year} — ${frame.title}`}
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={400}
                      draggable={false}
                    />
                    <span className="filmstrip__scrim" aria-hidden="true" />
                    {/* The milestone lives inside the frame — the film base
                        itself stays clean, with no printing on the tape. */}
                    {(frame.year || frame.title) && (
                      <div className="filmstrip__reveal">
                        {frame.year && <span className="filmstrip__reveal-year">{frame.year}</span>}
                        {frame.title && <span className="filmstrip__reveal-title">{frame.title}</span>}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Fixed light source across the moving film */}
          <span className="filmstrip__sheen" aria-hidden="true" />
          {/* Ends dissolve, so the reel reads as continuing past the screen */}
          <span className="filmstrip__ends" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
