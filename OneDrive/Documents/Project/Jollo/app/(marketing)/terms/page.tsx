import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing the use of Jollo Experience's website and services.",
};

export default function TermsPage() {
  return (
    <div className="bg-transparent min-h-screen relative">
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="container-jollo">
          <p className="text-label text-[#e9e612]/60 mb-6">Legal</p>
          <h1 className="text-h1 text-white max-w-xl mb-6">Terms of Service</h1>
          <p className="font-body text-white/60 text-sm mb-16">Last updated: July 2026</p>

          <div className="max-w-3xl flex flex-col gap-10 font-body text-white/80 leading-relaxed">
            <div>
              <h2 className="text-h4 text-white mb-3">Acceptance of terms</h2>
              <p>
                By accessing this website, you agree to these terms. If you do not agree, please
                do not use the site.
              </p>
            </div>

            <div>
              <h2 className="text-h4 text-white mb-3">Use of content</h2>
              <p>
                All content on this site — including text, visuals, and brand assets — belongs to
                {" "}{site.name} unless otherwise credited, and may not be reproduced without
                written permission.
              </p>
            </div>

            <div>
              <h2 className="text-h4 text-white mb-3">Engagements &amp; proposals</h2>
              <p>
                Enquiries submitted through this site do not constitute a binding agreement.
                Project scope, timelines, and pricing are confirmed separately in a signed
                proposal or contract.
              </p>
            </div>

            <div>
              <h2 className="text-h4 text-white mb-3">Limitation of liability</h2>
              <p>
                {site.name} is not liable for any indirect or consequential loss arising from
                use of this website. Service-specific liability terms are set out in individual
                client agreements.
              </p>
            </div>

            <div>
              <h2 className="text-h4 text-white mb-3">Changes to these terms</h2>
              <p>
                We may update these terms from time to time. Continued use of the site after
                changes are posted constitutes acceptance of the revised terms.
              </p>
            </div>

            <div>
              <h2 className="text-h4 text-white mb-3">Contact</h2>
              <p>
                Questions about these terms can be sent to{" "}
                <a href={`mailto:${site.email}`} className="text-[#e9e612] hover:underline">
                  {site.email}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
