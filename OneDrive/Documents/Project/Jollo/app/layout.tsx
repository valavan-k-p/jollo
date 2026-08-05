import type { Metadata } from "next";
import {
  Bodoni_Moda,
  Cormorant_Garamond,
  Archivo,
  Bebas_Neue,
  Inter,
  Poppins,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import ClientShell from "@/components/ui/ClientShell";
import CinematicOrb from "@/components/3d/CinematicOrb";
import CookieConsent from "@/components/ui/CookieConsent";
import { site } from "@/content/site";

/*
 * Five families, each owning a section of the site. Loading is tiered: the two
 * used above the fold preload, the section-specific faces do not — they have
 * scrolled into view long before they are needed.
 *
 * On the requested palette: Canela Display, Saol Display, Neue Montreal, Druk
 * Condensed, PP Neue Machina and Bebas Neue *Pro* are all commercially
 * licensed and cannot be self-hosted here. Cormorant Garamond, Inter and Bebas
 * Neue were on that list and are used directly; Bodoni Moda and Archivo stand
 * in for the Didone-display and neo-grotesk roles. Every one is a drop-in
 * swap: change the loader and the CSS variable, nothing else.
 */

/** HERO — Didone display. Extreme thick/thin contrast, built for huge sizes. */
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  preload: true,
});

/** OUR STORY — old-style serif. Delicate, calligraphic, museum-wall editorial. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

/** SERVICES — neo-grotesk. Holds up bold, uppercase and widely tracked. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  preload: false,
});

/** TIMELINE — condensed caps. Movie-credit proportions for the reel years. */
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
  preload: false,
});

/** FOOTER, UI and body — the quiet one that never competes. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

/** HERO ROTATING WORD — geometric sans, bold and punchy. */
const poppins = Poppins({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Jollo Experience — Brand Experience & Growth Company",
    template: "%s | Jollo Experience",
  },
  description:
    "Jollo Experience is a premium Brand Experience & Growth Company delivering branding, marketing, M.I.C.E., celebrations, digital engineering, and growth strategy.",
  keywords: [
    "brand experience",
    "MICE",
    "event management",
    "branding agency",
    "growth consulting",
    "digital engineering",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Jollo Experience",
    title: "Jollo Experience — Brand Experience & Growth Company",
    description:
      "Creating Experiences. Building Brands. Driving Growth.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  email: site.email,
  description:
    "Premium Brand Experience & Growth Company delivering branding, marketing, M.I.C.E., celebrations, digital engineering, and growth strategy.",
  areaServed: "Worldwide",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  sameAs: site.social.map((s) => s.href),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${cormorant.variable} ${archivo.variable} ${bebas.variable} ${inter.variable} ${poppins.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <ClientShell>
          <CinematicOrb className="!fixed inset-0 w-full h-full z-[-1] pointer-events-none" />
          <CustomCursor />
          <SmoothScroll>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </ClientShell>
        <CookieConsent />
      </body>
    </html>
  );
}
