import type { Metadata } from "next";
import FeaturedWorks from "@/components/sections/gallery/FeaturedWorks";
import TrustedClients from "@/components/sections/gallery/TrustedClients";


export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Selected projects, trusted partnerships, and memorable experiences by Jollo Experience.",
};

export default function GalleryPage() {
  return (
    <div className="relative bg-[#050505]">
      {/* grain overlay */}
      <div
        className="fixed inset-0 z-[60] pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* vignette */}
      <div
        className="fixed inset-0 z-[59] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 50%, rgba(0,0,0,0.4) 100%)" }}
      />

      <TrustedClients />
      <FeaturedWorks />

    </div>
  );
}
