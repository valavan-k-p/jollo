/**
 * Single source of truth for brand-level contact details, social links,
 * and the canonical primary call-to-action. Import from here everywhere so
 * the email / phone / CTA voice never drift between components again.
 */

export const site = {
  name: "Jollo Experience",
  email: "info@jolloexp.com",
  phone: "+91 97898 13013",
  phoneHref: "+919789813013",
  phoneAlt: "+91 81819 51616",
  phoneAltHref: "+918181951616",
  location: "No. 24/I, North Crescent Road, T. Nagar, Chennai - 632 017",

  /** Canonical CTA — use this label everywhere a primary action appears. */
  primaryCta: {
    label: "Book a Consultation",
    href: "/contact",
  },
  /** Secondary CTA — exploratory, lower commitment. */
  secondaryCta: {
    label: "View Our Work",
    href: "/work",
  },

  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
} as const;
