"use client";

import Image from "next/image";
import { featuredProjects } from "@/content/gallery";

const CLIP_FROM = [
  "inset(0 100% 0 0)",
  "inset(0 0 0 100%)",
  "inset(100% 0 0 0)",
  "inset(0 0 100% 0)",
];

export default function FeaturedWorks() {
  return (
    <section className="relative bg-[#050505]">
      <div className="pt-24 md:pt-[160px]">
        {/* Section heading */}
        <div className="container-gallery">
          <div className="flex flex-col items-center gap-0 text-center">
            <h2
              className="font-luxe uppercase text-[#fafafa]"
              style={{
                fontSize: "clamp(2rem, 8vw, 7.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginTop: "clamp(16px, 3vw, 32px)",
              }}
            >
              Moments we made.
            </h2>
          </div>
        </div>

        <div style={{ height: "clamp(24px, 5vw, 64px)" }} />

        {/* Responsive grid: single column on mobile, 2-column on desktop */}
        <div className="container-gallery">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[120px] lg:gap-[180px]">
            {featuredProjects.map((project) => (
              <div
                key={project.title}
                className="group block"
              >
                <div
                  className="relative w-full overflow-hidden rounded-2xl aspect-[4/3] bg-white/5 border border-white/10"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    sizes="(min-width: 768px) 46vw, 92vw"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: "clamp(60px, 10vw, 140px)" }} />
    </section>
  );
}
