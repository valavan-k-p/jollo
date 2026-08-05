"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowButton from "@/components/clone/ArrowButton";
import GenesisSequence from "@/components/sections/about/GenesisSequence";
import FilmStrip from "@/components/sections/about/FilmStrip";

const chapters = [
  {
    number: "01",
    year: "2008",
    title: "Where It Started",
    text: "It started in 2008, at the IPL Opening Ceremony at YMCA. I was a promoter, earning ₹500 — more like volunteering than a job. But it planted something. Years of learning followed — sales, client servicing, creative roles, one after another.",
  },
  {
    number: "02",
    year: "2018",
    title: "The Leap",
    text: "In 2018, we took the leap and started our own thing. We picked one niche: birthdays. A year later, we opened a dedicated store for it. Balloons, décor, celebrations — it took off fast.",
  },
  {
    number: "03",
    year: "2020",
    title: "Then 2020 Happened",
    text: "The lockdown didn't just slow us down, it wiped us out. Two years with almost no work, but the costs never stopped. When it was over, we owed ₹49 lakhs. With ₹7,000 on a credit card, I went back to tying balloons myself, job by job. It wasn't about the money — it was where I relearned the business, from the ground up.",
  },
  {
    number: "04",
    year: "Today",
    title: "Becoming JOLLO",
    text: "Slowly, it grew back. Birthdays led to weddings. Weddings led to corporate events. Corporate events led to production. Piece by piece, it became JOLLO Experiences. The name comes from an old word close to 'jolly' — celebration, joy. That's all JOLLO has ever really been about.",
  },
];

const stats = [
  { value: "2008", label: "Where It All Began" },
  { value: "₹7K", label: "The Restart Budget" },
  { value: "17+", label: "Years in the Making" },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = containerRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-mission-text]", {
        scrollTrigger: { trigger: "[data-mission-text]", start: "top 80%" },
        opacity: 0, y: 30, duration: 1, ease: "expo.out",
      });

      gsap.from("[data-intro-card]", {
        scrollTrigger: { trigger: "[data-intro-cards]", start: "top 80%" },
        opacity: 0, y: 40, rotation: 0, stagger: 0.12, duration: 0.9, ease: "expo.out",
      });

      const items = gsap.utils.toArray<HTMLElement>(".chapter-item");
      items.forEach((item) => {
        const path = item.querySelector<HTMLElement>(".chapter-path");
        const fillMask = item.querySelector<HTMLElement>(".chapter-path_fill-mask");
        const triggerPoint = item.querySelector<HTMLElement>(".chapter-path_trigger");
        const title = item.querySelector<HTMLElement>(".chapter-title");
        const text = item.querySelector<HTMLElement>(".chapter-text");
        if (!path || !fillMask) return;
        let hasPlayed = false;
        gsap.set(fillMask, { height: "0%" });
        ScrollTrigger.create({
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          onUpdate: () => {
            const rect = path.getBoundingClientRect();
            const progress = gsap.utils.clamp(0, 1, (window.innerHeight * 0.5 - rect.top) / rect.height);
            gsap.set(fillMask, { height: `${progress * 100}%` });
          },
        });
        if (triggerPoint) {
          ScrollTrigger.create({
            trigger: triggerPoint,
            start: "top center",
            onEnter: () => {
              if (hasPlayed) return;
              hasPlayed = true;
              if (title) gsap.to(title, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", delay: 0.1 });
              if (text) gsap.to(text, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", delay: 0.2 });
            },
          });
        }
      });

      const yearItems = gsap.utils.toArray<HTMLElement>(".chapter-year_item");
      const masks = gsap.utils.toArray<HTMLElement>(".chapter-year_mask");
      let activeIndex = 0;

      const fitText = (el: HTMLElement) => {
        const parent = el.parentElement;
        if (!parent) return;
        const update = () => {
          const parentWidth = parent.offsetWidth;
          let min = 1, max = 1000, best = min;
          while (min <= max) {
            const mid = (min + max) / 2;
            el.style.fontSize = mid + "px";
            if (el.scrollWidth <= parentWidth) { best = mid; min = mid + 0.5; }
            else max = mid - 0.5;
          }
          el.style.fontSize = best + "px";
        };
        update();
        new ResizeObserver(update).observe(parent);
        document.fonts?.ready.then(update);
      };

      const updateYear = (newIndex: number, direction = "forward") => {
        if (newIndex === activeIndex || !yearItems[newIndex]) return;
        const current = yearItems[activeIndex];
        const next = yearItems[newIndex];
        yearItems.forEach((el, i) => {
          el.classList.remove("is-active", "is-out-up", "is-out-down");
          if (i < newIndex) el.classList.add("is-out-up");
          else if (i > newIndex) el.classList.add("is-out-down");
        });
        if (direction === "forward") {
          current.classList.remove("is-active", "is-out-down");
          current.classList.add("is-out-up");
        } else {
          current.classList.remove("is-active", "is-out-up");
          current.classList.add("is-out-down");
        }
        next.classList.remove("is-out-up", "is-out-down");
        next.classList.add("is-active");
        activeIndex = newIndex;
      };

      yearItems.forEach((item, index) => {
        item.classList.remove("is-active", "is-out-up", "is-out-down");
        item.classList.add(index === 0 ? "is-active" : "is-out-down");
      });
      masks.forEach(fitText);
      items.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => updateYear(index, "forward"),
          onEnterBack: () => updateYear(index, "backward"),
        });
      });
      document.fonts?.ready.then(() => { masks.forEach(fitText); ScrollTrigger.refresh(); });

      gsap.from("[data-orb-story]", {
        scrollTrigger: { trigger: "[data-orb-story]", start: "top 80%" },
        opacity: 0, y: 40, duration: 1.2, ease: "expo.out",
      });

      gsap.from("[data-cta-card]", {
        scrollTrigger: { trigger: "[data-cta-card]", start: "top 85%" },
        opacity: 0, y: 40, duration: 1, ease: "expo.out",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#111111] min-h-screen">
      {/* ── 1. Film Strip — the journey in frames ──────────────────────── */}
      <div className="pt-32">
        <FilmStrip />
      </div>

      {/* ── 2. The founder story ───────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(to bottom, #111111 0%, #0d0d0d 100%)" }}
        aria-label="The founder story"
      >
        <div className="container-jollo relative z-10 flex flex-col items-center text-center gap-8 pt-[clamp(6rem,12vw,11rem)] pb-[clamp(4rem,8vw,7rem)]">
          <p className="type-placard text-[#e9e612]/60">The Journey</p>
          <h2
            className="font-luxe uppercase text-white max-w-[16ch]"
            style={{ fontSize: "clamp(2.25rem, 5.5vw, 5rem)", letterSpacing: "-0.02em", lineHeight: 1.05 }}
          >
            From ₹500 to JOLLO Experiences.
          </h2>
          <p className="type-editorial--quiet text-white/50 max-w-xl text-[clamp(1rem,1.5vw,1.35rem)]">
            The company took seventeen years. Here&apos;s how it happened.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-jollo flex flex-col items-center text-center gap-16">
          <p
            data-mission-text
            className="type-editorial text-white max-w-3xl will-change-transform"
            style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.4rem)", lineHeight: 1.3 }}
          >
            There was no big comeback plan. So we didn&apos;t try one. We just went back
            to what we knew — creating moments worth remembering, one at a time.
          </p>
        </div>
      </section>

      <section className="relative border-t border-white/[0.06]">
        <div className="chapter-group">
          <div className="chapter-year_wrapper" aria-hidden="true">
            <div className="chapter-year_sticky">
              <div className="chapter-year_mask">
                {chapters.map((c) => (
                  <div key={c.number} className="chapter-year_item">
                    <span className="chapter-year_value">{c.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {chapters.map((chapter) => (
            <div key={chapter.number} className="container-jollo">
              <div className="chapter-item">
                <div className="chapter-path_wrap">
                  <div className="chapter-path">
                    <div className="chapter-path_track" />
                    <div className="chapter-path_fill-mask">
                      <div className="chapter-path_fill" />
                    </div>
                    <div className="chapter-path_trigger" />
                  </div>
                </div>
                <div className="chapter-content">
                  <h2
                    className="chapter-title type-editorial text-white"
                    style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)", letterSpacing: "-0.02em" }}
                  >
                    {chapter.title}
                  </h2>
                  <p className="chapter-text type-ui text-white/60 max-w-xl text-[clamp(0.9375rem,1.15vw,1.0625rem)]">
                    {chapter.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Genesis canvas — the orb animation ──────────────────────── */}
      <GenesisSequence />

      {/* ── 4. The Orb — what it means ─────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(to bottom, #070707 0%, #111111 100%)" }}
        aria-label="The Orb"
      >
        <div className="container-jollo relative z-10 flex flex-col items-center text-center gap-10 py-[clamp(6rem,14vw,12rem)]">
          <p className="type-placard text-[#e9e612]/60">The Orb</p>
          <h2
            data-orb-story
            className="font-luxe uppercase text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", letterSpacing: "-0.02em", lineHeight: 1.05 }}
          >
            Structure with a pulse.
          </h2>
          <div
            data-orb-story
            className="max-w-2xl flex flex-col gap-6 will-change-transform"
          >
            <p
              className="font-editorial text-white/55 leading-relaxed"
              style={{ fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)" }}
            >
              Watch it long enough and the orb starts to feel less like an object
              and more like a habit of mind. Its pattern shifts the way a good idea
              does — restless, connecting things that weren&apos;t connected before.
              Then it slows, and you notice it breathe, steady as something that
              means what it says.
            </p>
            <p
              className="font-editorial text-white/55 leading-relaxed"
              style={{ fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)" }}
            >
              Beneath the motion, nothing is loose. Every line answers to a
              structure. And running through all of it, a gold that isn&apos;t
              decoration — it&apos;s the sense that something good is still possible.
            </p>
            <p
              className="font-editorial text-white/70 leading-relaxed italic"
              style={{ fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)" }}
            >
              We didn&apos;t build a symbol and then write an explanation for it. We
              built the way we already work: precise and warm, at the same time,
              without apology.
            </p>
          </div>
        </div>
      </section>

      {/* ── What's Next ─────────────────────────────────────────────────── */}
      <section className="section-padding border-t border-white/[0.06]">
        <div className="container-jollo flex flex-col items-center text-center gap-8">
          <p className="text-label text-[#e9e612]/50">What&apos;s Next</p>
          <p className="text-h4 text-white font-display font-normal leading-relaxed max-w-3xl">
            Next, we&apos;re taking that idea further with JOLLO Life, our non-profit — because celebration should give something back too.
          </p>
          <p
            className="font-editorial text-white/50 leading-relaxed max-w-2xl"
            style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)" }}
          >
            This is where we are. The best part is still ahead.
          </p>
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 font-display text-sm font-medium text-[#e9e612]/60 hover:text-[#e9e612] transition-colors duration-200"
          >
            See our work
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      <section className="section-padding border-t border-white/[0.06]">
        <div className="container-jollo">
          <div
            data-cta-card
            className="relative rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden will-change-transform"
            style={{ padding: 'clamp(2.5rem, 5vw, 5rem)' }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(233,230,18,0.08) 0%, transparent 80%)" }}
            />
            <p
              className="font-display font-bold text-white relative z-10 text-center md:text-left"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1.15 }}
            >
              Let&apos;s build something together.
            </p>
            <div className="relative z-10 flex-none">
              <ArrowButton href="/contact">Book a Consultation</ArrowButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
