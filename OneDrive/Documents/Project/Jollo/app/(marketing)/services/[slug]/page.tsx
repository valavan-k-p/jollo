import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicePages, getServiceBySlug } from "@/content/services";
import ServiceHeroSection from "@/components/sections/service/ServiceHeroSection";
import ProblemSection from "@/components/sections/service/ProblemSection";
import CapabilitySection from "@/components/sections/service/CapabilitySection";
import ProcessSection from "@/components/sections/service/ProcessSection";
import ResultsSection from "@/components/sections/service/ResultsSection";
import FAQSection from "@/components/sections/service/FAQSection";
import ServiceCTASection from "@/components/sections/service/ServiceCTASection";

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
        tagline={service.tagline}
        heroSubtext={service.heroSubtext}
        category={service.relatedCategory}
      />
      <ProblemSection problemStatement={service.problemStatement} />
      <CapabilitySection capabilities={service.capabilities} />
      <ProcessSection process={service.process} />
      <ResultsSection results={service.results} />
      <FAQSection faqs={service.faqs} />
      <ServiceCTASection ctaHeading={service.ctaHeading} ctaLabel={service.ctaLabel} />
    </>
  );
}
