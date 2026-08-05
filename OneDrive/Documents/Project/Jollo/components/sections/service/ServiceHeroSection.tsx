"use client";

import Image from "next/image";

interface ServiceHeroProps {
  title: string;
  heroImage?: string;
}

export default function ServiceHeroSection({
  title,
  heroImage,
}: ServiceHeroProps) {
  return (
    <header className="relative w-full bg-[#111111]">
      {heroImage && (
        <Image
          src={heroImage}
          alt={title}
          width={1920}
          height={1080}
          className="w-full h-auto"
          priority
        />
      )}
    </header>
  );
}
