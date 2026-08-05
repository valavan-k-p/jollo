import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicePages, getServiceBySlug } from "@/content/services";
import ServiceHeroSection from "@/components/sections/service/ServiceHeroSection";


interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.title} — Jollo Experience`,
    description: service.heroSubtext,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  return (
    <>
      <ServiceHeroSection
        title={service.title}
        heroImage={service.heroImage}
      />
    </>
  );
}
