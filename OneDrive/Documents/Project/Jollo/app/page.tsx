import type { Metadata } from "next";
import HeroSection from "@/components/sections/home/HeroSection";
import ManifestoSection from "@/components/sections/home/ManifestoSection";
import ServicesSection from "@/components/sections/home/ServicesSection";
import StatsSection from "@/components/sections/home/StatsSection";
import KineticTypeSection from "@/components/sections/home/KineticTypeSection";

import CtaCardsSection from "@/components/clone/CtaCardsSection";

export const metadata: Metadata = {
  title: "Jollo Experience — Brand Experience & Growth Company",
  description:
    "Creating Experiences. Building Brands. Driving Growth. Jollo Experience is a premium brand experience and growth company delivering branding, M.I.C.E., celebrations, digital engineering, and growth strategy.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="relative w-full h-[200vh]" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a1a1a]" />
      </div>
      <div className="relative bg-[#1a1a1a]">
        <ManifestoSection />
        <ServicesSection />
        <StatsSection />
        <KineticTypeSection />

        <CtaCardsSection />
      </div>
    </>
  );
}
