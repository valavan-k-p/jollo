"use client";

import Image from "next/image";
import { clientLogos } from "@/content/gallery";

/**
 * Trusted Clients — big visible logo grid, fills the first screen.
 * Uses inline styles for card sizing to avoid Tailwind JIT issues.
 */
export default function TrustedClients() {
  return (
    <section className="relative overflow-hidden bg-[#050505]">
      {/* Compact heading */}
      <div className="container-gallery text-center" style={{ paddingTop: "120px" }}>
        <div className="flex flex-col items-center">
          <p
            className="font-body uppercase tracking-[0.3em] text-[#e9e612]/50"
            style={{ fontSize: "clamp(0.65rem, 0.85vw, 0.8rem)" }}
          >
            Our Partners
          </p>
          <h2
            className="font-luxe uppercase text-[#fafafa]"
            style={{
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginTop: "16px",
            }}
          >
            Trusted by ambitious brands.
          </h2>
        </div>
      </div>

      {/* Logo grid — desktop: clean rows, big cards, high visibility */}
      <div
        className="container-gallery hidden md:block"
        style={{ paddingTop: "32px", paddingBottom: "24px" }}
      >
        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "18px",
            margin: "0 auto",
          }}
        >
          {clientLogos.map((client) => (
            <div
              key={client.name}
              className="group relative flex items-center justify-center rounded-xl cursor-pointer
                bg-white/[0.04] backdrop-blur-sm border border-white/[0.08]
                hover:bg-white/[0.08] hover:border-[rgba(233,230,18,0.4)] hover:scale-[1.05]
                hover:shadow-[0_0_40px_rgba(233,230,18,0.15)]
                transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                aspectRatio: "1",
                minHeight: "140px",
              }}
              data-cursor-text={client.name}
            >
              <Image
                src={client.src}
                alt={client.name}
                width={120}
                height={120}
                className="object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                style={{ width: "100%", height: "100%" }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile carousel */}
      <div
        className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ paddingTop: "24px", paddingBottom: "24px" }}
      >
        <div className="flex gap-3 px-5" style={{ width: "max-content" }}>
          {clientLogos.map((client) => (
            <div
              key={client.name}
              className="snap-center shrink-0 flex items-center justify-center rounded-xl
                bg-white/[0.04] backdrop-blur-sm border border-white/[0.08]"
              style={{ width: "100px", height: "100px" }}
            >
              <Image
                src={client.src}
                alt={client.name}
                width={60}
                height={60}
                className="object-contain opacity-80"
                style={{ width: "60%", height: "60%" }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section bottom spacing */}
      <div style={{ height: "180px" }} />
    </section>
  );
}
