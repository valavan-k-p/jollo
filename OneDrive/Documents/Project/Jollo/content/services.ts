import type { ServicePageData } from "@/types/global";

export const servicePages: ServicePageData[] = [
  {
    slug: "branding",
    title: "Branding",
    tagline: "Identity that commands attention.",
    heroSubtext:
      "We build brand systems that are strategically grounded and visually unmistakable — from naming and positioning to full identity design and brand activation.",
    problemStatement:
      "Most brands look and sound like their competitors. When everything looks the same, nothing gets chosen. We diagnose the gap between who you are and how you appear — then close it.",
    capabilities: [
      {
        title: "Brand Strategy",
        description:
          "Positioning, audience definition, competitive mapping, brand architecture, and messaging frameworks.",
      },
      {
        title: "Visual Identity",
        description:
          "Logo systems, colour palettes, typography, iconography, motion identity, and brand guidelines.",
      },
      {
        title: "Brand Naming",
        description:
          "Name generation, domain strategy, trademark guidance, and linguistic review across target markets.",
      },
      {
        title: "Brand Activation",
        description:
          "Environmental branding, event identity, digital rollout, and internal brand adoption programmes.",
      },
      {
        title: "Brand Audit",
        description:
          "Comprehensive review of current brand equity, consistency, perception gaps, and growth opportunities.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Diagnose",
        description:
          "Brand audit, stakeholder interviews, competitive landscape analysis, and audience perception research.",
      },
      {
        step: 2,
        title: "Position",
        description:
          "Define the strategic territory — what you stand for, who you serve, and why you matter.",
      },
      {
        step: 3,
        title: "Design",
        description:
          "Build the visual and verbal system that brings the strategy to life across every touchpoint.",
      },
      {
        step: 4,
        title: "Activate",
        description:
          "Roll out the brand across digital, physical, and experiential channels with full guidelines.",
      },
    ],
    results: [
      { value: "40%", label: "Average increase in brand recall" },
      { value: "80+", label: "Brand identities delivered" },
      { value: "12", label: "Industry sectors served" },
    ],
    faqs: [
      {
        question: "How long does a full brand identity project take?",
        answer:
          "A comprehensive brand project — from strategy to guidelines — typically runs 8–14 weeks depending on scope, approval cycles, and the number of deliverables required.",
      },
      {
        question: "Do you work with early-stage startups?",
        answer:
          "Yes. We have dedicated packages for startups at various funding stages. We also work with established brands undergoing repositioning or market expansion.",
      },
      {
        question: "What's the difference between a logo redesign and a full rebrand?",
        answer:
          "A logo redesign is cosmetic. A full rebrand starts with strategy — who you are, what you stand for, and how you communicate — then builds the visual system from that foundation.",
      },
      {
        question: "Do you handle trademark filing?",
        answer:
          "We provide trademark guidance and work with your legal team. We do not file trademarks directly but include trademark-aware naming as standard in our process.",
      },
    ],
    ctaHeading: "Start with a Brand Audit.",
    ctaLabel: "Book a Consultation",
    relatedCategory: "Branding",
  },
  {
    slug: "marketing-solutions",
    title: "Marketing Solutions",
    tagline: "Campaigns that convert. Strategies that compound.",
    heroSubtext:
      "From integrated campaigns to performance marketing, we build marketing programmes that generate measurable business outcomes — not just impressions.",
    problemStatement:
      "Marketing spend without strategy is noise. Most companies have campaigns without a marketing system. We build the system first, then execute within it — so every rupee compounds.",
    capabilities: [
      {
        title: "Integrated Campaigns",
        description:
          "Multi-channel marketing campaigns that align brand, performance, and content across digital and physical touchpoints.",
      },
      {
        title: "Digital Marketing",
        description:
          "Paid media, SEO, social strategy, email marketing, and content marketing executed with performance accountability.",
      },
      {
        title: "Content Strategy",
        description:
          "Content frameworks, editorial calendars, copywriting, and creative production for owned and earned channels.",
      },
      {
        title: "Brand Activations",
        description:
          "Live and experiential marketing that creates memorable brand moments and drives advocacy.",
      },
      {
        title: "Media Planning & Buying",
        description:
          "Strategic media mix planning, OOH, digital, and broadcast buying with ROI-focused optimisation.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Audit",
        description:
          "Review of current marketing channels, spend, attribution, and competitive share of voice.",
      },
      {
        step: 2,
        title: "Strategise",
        description:
          "Build the marketing system — goals, channels, messaging, budget allocation, and KPIs.",
      },
      {
        step: 3,
        title: "Execute",
        description:
          "Campaign production, content creation, media buying, and cross-channel activation.",
      },
      {
        step: 4,
        title: "Optimise",
        description:
          "Continuous performance reporting, A/B testing, budget reallocation, and strategy iteration.",
      },
    ],
    results: [
      { value: "3.2x", label: "Average ROAS improvement" },
      { value: "150+", label: "Campaigns delivered" },
      { value: "50M+", label: "Impressions generated" },
    ],
    faqs: [
      {
        question: "Do you offer performance-based retainers?",
        answer:
          "Yes. For qualified clients, we structure hybrid engagements that include a base retainer plus performance incentives tied to agreed KPIs.",
      },
      {
        question: "Which industries do you specialise in?",
        answer:
          "We have deep experience in FMCG, real estate, hospitality, financial services, and professional services. We evaluate each brief on its merits.",
      },
      {
        question: "Do you handle creative production in-house?",
        answer:
          "Yes. Our creative team handles copywriting, design, video production, and photography. For large-scale productions we bring in specialist partners.",
      },
    ],
    ctaHeading: "Let's build your marketing system.",
    ctaLabel: "Book a Consultation",
    relatedCategory: "Marketing",
  },
  {
    slug: "mice",
    title: "M.I.C.E.",
    tagline: "Meetings. Incentives. Conferences. Exhibitions.",
    heroSubtext:
      "We design and manage corporate events at scale — from boardroom meetings to international conferences with thousands of attendees across multiple countries.",
    problemStatement:
      "Corporate events are too often reduced to logistics checklists. The opportunity is far greater — every M.I.C.E. event is a brand experience, a culture moment, and a business investment. We design both the logistics and the experience.",
    capabilities: [
      {
        title: "Meetings & Conferences",
        description:
          "End-to-end management of corporate meetings, annual conferences, town halls, and leadership summits.",
      },
      {
        title: "Incentive Programmes",
        description:
          "Incentive travel, reward experiences, and performance recognition programmes for high-achieving teams.",
      },
      {
        title: "Exhibitions & Trade Shows",
        description:
          "Exhibition design, booth production, traffic generation strategy, and post-show lead nurturing.",
      },
      {
        title: "Product Launches",
        description:
          "Strategic product launch events that create media moments, drive coverage, and build buyer conviction.",
      },
      {
        title: "Hybrid & Virtual Events",
        description:
          "Technology-enabled hybrid experiences that extend reach while maintaining production quality and engagement.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Brief",
        description:
          "Understand objectives, audience, scale, timeline, and budget. Define the success metrics upfront.",
      },
      {
        step: 2,
        title: "Design",
        description:
          "Concept development, venue selection, AV design, content strategy, and attendee journey mapping.",
      },
      {
        step: 3,
        title: "Produce",
        description:
          "Full logistics management, supplier coordination, run-of-show, and pre-event rehearsals.",
      },
      {
        step: 4,
        title: "Deliver",
        description:
          "On-site execution with dedicated operations team. Post-event reporting and attendee feedback.",
      },
    ],
    results: [
      { value: "200+", label: "Events delivered" },
      { value: "50,000+", label: "Attendees managed" },
      { value: "12+", label: "Countries" },
    ],
    faqs: [
      {
        question: "What is the minimum event size you work with?",
        answer:
          "We work with events from 50 to 5,000+ attendees. Our minimum engagement is typically a full-day corporate event or incentive programme for 50 participants.",
      },
      {
        question: "Do you manage international events?",
        answer:
          "Yes. We have delivered events across South Asia, Southeast Asia, the Middle East, and Europe. We have established vendor networks in major event destinations.",
      },
      {
        question: "Can you handle government and enterprise procurement processes?",
        answer:
          "Yes. We are registered with multiple corporate and government procurement systems and can accommodate standard enterprise procurement requirements.",
      },
      {
        question: "Do you provide post-event reporting?",
        answer:
          "Yes. Every event includes a post-event report covering attendance, engagement metrics, feedback scores, and budget reconciliation.",
      },
    ],
    ctaHeading: "Tell us about your next event.",
    ctaLabel: "Book a Consultation",
    relatedCategory: "M.I.C.E.",
  },
  {
    slug: "celebrations",
    title: "Celebrations",
    tagline: "Every milestone deserves a moment worth remembering.",
    heroSubtext:
      "Weddings, anniversaries, milestone birthdays, and private celebrations — crafted with taste, precision, and the kind of detail that turns a day into a memory.",
    problemStatement:
      "Generic celebration planning produces generic celebrations. We design experiences that reflect the people being celebrated — their story, their style, their guests — with a level of craft that makes every element feel considered.",
    capabilities: [
      {
        title: "Weddings",
        description:
          "Full-service wedding planning and design — from venue selection and décor concept to day-of coordination and guest experience.",
      },
      {
        title: "Private Events",
        description:
          "Milestone birthdays, anniversaries, engagements, and private gatherings designed to reflect the personality of the host.",
      },
      {
        title: "Corporate Celebrations",
        description:
          "Company anniversaries, team celebrations, and award ceremonies that reward culture and reinforce belonging.",
      },
      {
        title: "Décor & Styling",
        description:
          "Complete décor concept, floral design, lighting design, and styling for every visual element of the event.",
      },
      {
        title: "Entertainment Curation",
        description:
          "Artist booking, entertainment programming, and performance production tailored to the event's mood and audience.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Vision",
        description:
          "A deep conversation about who is being celebrated, what matters to them, and what the event should feel like.",
      },
      {
        step: 2,
        title: "Design",
        description:
          "Concept development, mood boards, venue shortlisting, and vendor curation aligned to the vision.",
      },
      {
        step: 3,
        title: "Plan",
        description:
          "Full timeline, vendor contracts, logistics coordination, and guest experience mapping.",
      },
      {
        step: 4,
        title: "Execute",
        description:
          "On-site management so you are a guest at your own event. Everything runs on time, behind the scenes.",
      },
    ],
    results: [
      { value: "300+", label: "Celebrations delivered" },
      { value: "98%", label: "Client satisfaction rate" },
      { value: "5★", label: "Average review rating" },
    ],
    faqs: [
      {
        question: "How far in advance should we book for a wedding?",
        answer:
          "For full-service wedding planning, we recommend booking 12–18 months in advance. For destination weddings, 18–24 months is ideal to secure preferred venues.",
      },
      {
        question: "Do you work outside of your home city?",
        answer:
          "Yes. We have delivered celebrations across India and internationally. Destination events are a significant part of our portfolio.",
      },
      {
        question: "What does a full-service wedding planning package include?",
        answer:
          "Venue selection, vendor management, décor concept, timeline planning, guest coordination, rehearsal direction, and full day-of management. We handle everything.",
      },
    ],
    ctaHeading: "Let's bring your vision to life.",
    ctaLabel: "Book a Consultation",
    relatedCategory: "Celebrations",
  },
  {
    slug: "jollo-x",
    title: "Jollo X",
    tagline: "Digital engineering for brands that mean business.",
    heroSubtext:
      "We build websites, web applications, and digital products that perform — technically and commercially. Jollo X is the engineering arm of Jollo Experience.",
    problemStatement:
      "Most agency websites look good in screenshots and perform poorly in production. We build digital experiences that are fast, accessible, and architecturally sound — not just visually impressive.",
    capabilities: [
      {
        title: "Web Development",
        description:
          "Marketing websites, brand websites, and campaign microsites built with Next.js, TypeScript, and modern performance standards.",
      },
      {
        title: "Web Applications",
        description:
          "Custom web apps, dashboards, portals, and SaaS products engineered for scale and reliability.",
      },
      {
        title: "E-Commerce",
        description:
          "Custom e-commerce solutions and Shopify development with conversion-optimised UX and performance builds.",
      },
      {
        title: "CMS Integration",
        description:
          "Headless CMS architecture with Sanity, Contentful, or custom solutions that give teams editorial control.",
      },
      {
        title: "Digital Audits",
        description:
          "Performance, accessibility, SEO, and conversion audits with prioritised recommendations and execution roadmaps.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Discovery",
        description:
          "Technical requirements, user research, competitive analysis, and architecture planning.",
      },
      {
        step: 2,
        title: "Design",
        description:
          "UI/UX design, design system creation, prototyping, and stakeholder review.",
      },
      {
        step: 3,
        title: "Build",
        description:
          "Development sprints, QA testing, performance optimisation, and accessibility compliance.",
      },
      {
        step: 4,
        title: "Launch",
        description:
          "Deployment, SEO setup, analytics integration, and post-launch support.",
      },
    ],
    results: [
      { value: "95+", label: "Lighthouse score target" },
      { value: "40+", label: "Digital products shipped" },
      { value: "0.1s", label: "Average LCP target" },
    ],
    faqs: [
      {
        question: "What is your primary tech stack?",
        answer:
          "Next.js 15, TypeScript, Tailwind CSS, and Sanity CMS for most web projects. We adapt to project requirements and can work with existing tech stacks.",
      },
      {
        question: "Do you offer ongoing maintenance?",
        answer:
          "Yes. We offer maintenance retainers that include security updates, performance monitoring, content support, and feature development.",
      },
      {
        question: "Can you work with our existing design team?",
        answer:
          "Yes. We regularly operate as a development partner for design agencies and in-house design teams.",
      },
    ],
    ctaHeading: "Ready to build something that works?",
    ctaLabel: "Book a Consultation",
    relatedCategory: "Jollo X",
  },
  {
    slug: "growth-optimisation",
    title: "Growth & Optimisation",
    tagline: "Strategy that moves the needle.",
    heroSubtext:
      "We partner with founders and growth teams to diagnose constraints, design growth systems, and optimise the metrics that matter — with a bias for execution, not just analysis.",
    problemStatement:
      "Growth stalls when strategy and execution are disconnected. Most consultants deliver decks. We deliver outcomes — by staying close to the work, the data, and the team doing both.",
    capabilities: [
      {
        title: "Growth Strategy",
        description:
          "Market analysis, growth model design, channel strategy, and prioritisation frameworks for sustainable growth.",
      },
      {
        title: "Conversion Rate Optimisation",
        description:
          "CRO audits, A/B testing programmes, funnel analysis, and user behaviour research to improve conversion at every stage.",
      },
      {
        title: "Analytics & Data",
        description:
          "Analytics setup, attribution modelling, dashboard design, and data-driven decision frameworks.",
      },
      {
        title: "Go-to-Market",
        description:
          "Launch strategy, positioning, pricing, channel selection, and execution planning for new products or market entries.",
      },
      {
        title: "Growth Sprints",
        description:
          "Intensive 4–8 week engagements focused on a specific growth constraint — diagnosis, experimentation, and measurable outcomes.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Diagnose",
        description:
          "Data audit, funnel mapping, customer interviews, and constraint identification.",
      },
      {
        step: 2,
        title: "Prioritise",
        description:
          "ICE scoring, opportunity sizing, and resource-aware prioritisation of growth levers.",
      },
      {
        step: 3,
        title: "Experiment",
        description:
          "Rapid experimentation cycles with clear hypotheses, measurement, and learning documentation.",
      },
      {
        step: 4,
        title: "Scale",
        description:
          "Scale what works, systematise learnings, and build the growth infrastructure for sustained momentum.",
      },
    ],
    results: [
      { value: "2.8x", label: "Average revenue growth" },
      { value: "45%", label: "Average CRO improvement" },
      { value: "60+", label: "Growth engagements" },
    ],
    faqs: [
      {
        question: "What type of companies do you work with?",
        answer:
          "We work with growth-stage startups (Series A–C), mid-market companies, and enterprise divisions launching new products or entering new markets.",
      },
      {
        question: "What does a Growth Session involve?",
        answer:
          "A 90-minute working session where we map your current growth model, identify the primary constraint, and outline the highest-leverage actions for the next 90 days.",
      },
      {
        question: "Do you take equity?",
        answer:
          "In select cases, yes. We are open to performance-aligned structures including equity or revenue share for the right partnerships.",
      },
    ],
    ctaHeading: "Let's find your growth lever.",
    ctaLabel: "Book a Consultation",
    relatedCategory: "Growth",
  },
];

export function getServiceBySlug(slug: string): ServicePageData | undefined {
  return servicePages.find((s) => s.slug === slug);
}
