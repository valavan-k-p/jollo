import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Jollo Experience collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-transparent min-h-screen relative">
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="container-jollo">
          <p className="text-label text-[#e9e612]/60 mb-6">Legal</p>
          <h1 className="text-h1 text-white max-w-xl mb-6">Privacy Policy</h1>
          <p className="font-body text-white/60 text-sm mb-16">Last updated: July 2026</p>

          <div className="max-w-3xl flex flex-col gap-10 font-body text-white/80 leading-relaxed">
            <div>
              <h2 className="text-h4 text-white mb-3">Information we collect</h2>
              <p>
                When you submit a contact or consultation form, we collect the details you
                provide — such as your name, email address, phone number, company, and project
                information. We also collect standard analytics data (pages visited, device
                type, approximate location) to understand how visitors use our site.
              </p>
            </div>

            <div>
              <h2 className="text-h4 text-white mb-3">How we use your information</h2>
              <p>
                We use the information you share to respond to enquiries, prepare proposals,
                and deliver the services you request. We do not sell your personal data to third
                parties. We may use aggregated, anonymized analytics to improve our website.
              </p>
            </div>

            <div>
              <h2 className="text-h4 text-white mb-3">Data retention</h2>
              <p>
                We retain enquiry and client data for as long as necessary to fulfil the purpose
                it was collected for, or as required by law. You may request deletion of your
                data at any time by contacting us.
              </p>
            </div>

            <div>
              <h2 className="text-h4 text-white mb-3">Your rights</h2>
              <p>
                You may request access to, correction of, or deletion of the personal data we
                hold about you. To exercise these rights, contact us at{" "}
                <a href={`mailto:${site.email}`} className="text-[#e9e612] hover:underline">
                  {site.email}
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-h4 text-white mb-3">Contact</h2>
              <p>
                Questions about this policy can be sent to{" "}
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
