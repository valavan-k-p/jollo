import type { Testimonial, CaseStudy } from "@/types/global";

export const stats = [
  { value: "200", suffix: "+", label: "Experiences Delivered" },
  { value: "10", suffix: "+", label: "Enterprise Clients" },
  { value: "17", suffix: "+", label: "Years in Marketing" },
];

/**
 * Hero showcase — the auto-rotating media reel on the right of the split hero.
 * Each entry is one business category. The `gradient` + `glow` form a cinematic
 * placeholder; swap the `.hero-media-inner` div for a <video> or next/image
 * (cover) when real footage / photography is supplied — the layout is ready.
 */
export interface HeroShowcaseItem {
  id: string;
  label: string;
  descriptor: string;
  meta: string;
  href: string;
  gradient: string;
  glow: string;
}

export const heroShowcase: HeroShowcaseItem[] = [
  {
    id: "mice",
    label: "M.I.C.E.",
    descriptor: "Meetings, incentives, conferences & exhibitions — engineered at scale.",
    meta: "200+ events · 12 countries",
    href: "/services/mice",
    gradient: "linear-gradient(135deg, #0c1a2e 0%, #0a1424 45%, #02060d 100%)",
    glow: "radial-gradient(ellipse 70% 60% at 35% 25%, rgba(46,98,168,0.40) 0%, transparent 65%)",
  },
  {
    id: "activations",
    label: "Brand Activations",
    descriptor: "Immersive brand moments that turn audiences into advocates.",
    meta: "Live & experiential",
    href: "/services/marketing-solutions",
    gradient: "linear-gradient(135deg, #0c1e0c 0%, #0a160a 45%, #020802 100%)",
    glow: "radial-gradient(ellipse 65% 65% at 65% 30%, rgba(70,160,80,0.34) 0%, transparent 65%)",
  },
  {
    id: "corporate",
    label: "Corporate Events",
    descriptor: "Conferences, summits & town halls that move organisations.",
    meta: "50+ enterprise clients",
    href: "/work",
    gradient: "linear-gradient(135deg, #14171c 0%, #0e1013 45%, #040506 100%)",
    glow: "radial-gradient(ellipse 70% 60% at 40% 30%, rgba(140,150,170,0.26) 0%, transparent 65%)",
  },
  {
    id: "celebrations",
    label: "Celebrations",
    descriptor: "Weddings & milestones, crafted with taste and precision.",
    meta: "300+ celebrations",
    href: "/services/celebrations",
    gradient: "linear-gradient(135deg, #1e0a14 0%, #140610 45%, #06020a 100%)",
    glow: "radial-gradient(ellipse 70% 65% at 60% 28%, rgba(210,70,130,0.32) 0%, transparent 65%)",
  },
  {
    id: "marketing",
    label: "Marketing Campaigns",
    descriptor: "Integrated campaigns that convert attention into measurable growth.",
    meta: "3.2× average ROAS",
    href: "/services/marketing-solutions",
    gradient: "linear-gradient(135deg, #1f1405 0%, #160e03 45%, #080400 100%)",
    glow: "radial-gradient(ellipse 68% 62% at 38% 28%, rgba(224,158,46,0.32) 0%, transparent 65%)",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Jollo didn't just run our annual conference — they reimagined what our company culture looks like in a room. The response from our team was unlike anything we'd experienced before.",
    author: "Priya Menon",
    title: "Chief People Officer",
    company: "Vertex Technologies",
  },
  {
    id: "2",
    quote:
      "The rebrand they delivered for us transformed how our clients perceive us overnight. We went from being seen as a regional firm to a premium national consultancy.",
    author: "Arjun Sharma",
    title: "Managing Director",
    company: "Greenfield Advisors",
  },
  {
    id: "3",
    quote:
      "Our wedding was everything we dreamed of and more. Every detail was considered. We didn't have to think about a single thing on the day — we just celebrated.",
    author: "Kavya & Rohan",
    title: "Wedding Clients",
    company: "",
  },
];

export const clients = [
  { name: "Vertex Technologies", logo: "/images/clients/vertex.svg" },
  { name: "Greenfield Advisors", logo: "/images/clients/greenfield.svg" },
  { name: "Apex Capital", logo: "/images/clients/apex.svg" },
  { name: "NovaCorp", logo: "/images/clients/nova.svg" },
  { name: "Meridian Group", logo: "/images/clients/meridian.svg" },
  { name: "Stellar Brands", logo: "/images/clients/stellar.svg" },
  { name: "Summit Finance", logo: "/images/clients/summit.svg" },
  { name: "Horizon Media", logo: "/images/clients/horizon.svg" },
];

export const featuredWork: CaseStudy[] = [
  {
    slug: "vertex-annual-conference",
    title: "Annual Leadership Summit",
    client: "Vertex Technologies",
    category: "M.I.C.E.",
    year: 2024,
    outcome: "1,200 attendees across 3 days. 98% satisfaction score.",
    image: "/images/work/vertex-conference.jpg",
    featured: true,
  },
  {
    slug: "greenfield-rebrand",
    title: "Full Brand Transformation",
    client: "Greenfield Advisors",
    category: "Branding",
    year: 2024,
    outcome: "40% increase in qualified inbound leads within 90 days.",
    image: "/images/work/greenfield-brand.jpg",
    featured: true,
  },
  {
    slug: "novacorp-product-launch",
    title: "Regional Product Launch",
    client: "NovaCorp",
    category: "Marketing Solutions",
    year: 2023,
    outcome: "Launch event across 5 cities. 50M+ media impressions.",
    image: "/images/work/novacorp-launch.jpg",
    featured: true,
  },
];

export const visualChapters = [
  {
    id: "mice",
    heading: "Experiences at Scale",
    subLabel: "M.I.C.E. · Corporate Events",
    gradient: "from-black/70 via-black/30 to-transparent",
    position: "bottom-left",
  },
  {
    id: "celebrations",
    heading: "Moments Worth Remembering",
    subLabel: "Celebrations · Weddings · Milestones",
    gradient: "from-black/70 via-black/30 to-transparent",
    position: "bottom-right",
  },
  {
    id: "activations",
    heading: "Where Brands Come Alive",
    subLabel: "Branding · Marketing · Activations",
    gradient: "from-black/60 via-black/20 to-transparent",
    position: "bottom-center",
  },
];

export const serviceList = [
  { title: "Branding", href: "/services/branding", tagline: "Identity that commands attention." },
  { title: "Marketing Solutions", href: "/services/marketing-solutions", tagline: "Campaigns that convert. Strategies that compound." },
  { title: "M.I.C.E.", href: "/services/mice", tagline: "Experiences engineered at scale." },
  { title: "Celebrations", href: "/services/celebrations", tagline: "Every milestone, made extraordinary." },
  { title: "Jollo X", href: "/services/jollo-x", tagline: "Digital engineering for brands that mean business." },
  { title: "Growth & Optimisation", href: "/services/growth-optimisation", tagline: "Strategy that moves the needle." },
];
