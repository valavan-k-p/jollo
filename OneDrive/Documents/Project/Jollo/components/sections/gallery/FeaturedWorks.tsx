"use client";

import Image from "next/image";
import Link from "next/link";
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
      <div style={{ paddingTop: "160px" }}>
        {/* Section heading */}
        <div className="container-gallery">
          <div className="flex flex-col items-center gap-0 text-center">
            <h2
              className="font-luxe uppercase text-[#fafafa]"
              style={{
                fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginTop: "32px",
              }}
            >
              Moments we made.
            </h2>
          </div>
        </div>

        <div style={{ height: "clamp(48px, 5vw, 64px)" }} />

        {/* 2-column grid with smaller images */}
        <div className="container-gallery">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "180px",
            }}
          >
            {featuredProjects.map((project, i) => (
              <Link
                key={project.title}
                href="/contact"
                data-cursor-text="VIEW"
                className="group block cursor-pointer"
              >
                <div
                  className="relative w-full overflow-hidden rounded-xl"
                  style={{ aspectRatio: "4/3" }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    sizes="(min-width: 1024px) 46vw, 92vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />
                </div>

              </Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: "clamp(96px, 14vw, 180px)" }} />
    </section>
  );
}
