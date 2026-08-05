export interface Service {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  category: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: number;
  outcome: string;
  image: string;
  featured: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
}

export interface MediaItem {
  id: string;
  title: string;
  caption?: string;
  src: string;
  category: "mice" | "celebrations" | "corporate" | "activations" | "marketing";
  year: number;
  featured?: boolean;
  width: number;
  height: number;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface ServicePageData {
  slug: string;
  title: string;
  tagline: string;
  heroSubtext: string;
  heroImage?: string;
  problemStatement: string;
  capabilities: { title: string; description: string }[];
  process: { step: number; title: string; description: string }[];
  results: { value: string; label: string }[];
  faqs: { question: string; answer: string }[];
  ctaHeading: string;
  ctaLabel: string;
  relatedCategory: string;
}
