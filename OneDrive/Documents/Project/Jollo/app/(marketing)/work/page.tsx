import type { Metadata } from "next";
import ExperienceTypoScroll from "@/components/sections/work/ExperienceTypoScroll";

export const metadata: Metadata = {
  title: "Experience | Jollo",
  description:
    "Our experiences and services — from branding and marketing solutions to celebrations and M.I.C.E.",
};

export default function WorkPage() {
  return (
    <div className="relative bg-[#050505]">
      {/* grain overlay */}
      <div
        className="fixed inset-0 z-[60] pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <ExperienceTypoScroll />
    </div>
  );
}
