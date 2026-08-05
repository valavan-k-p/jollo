"use client";
import MagneticButton from "@/components/ui/MagneticButton";
import { motion } from "framer-motion";

const EMAIL = "mljhr.2025@gmail.com";

export default function CTASection() {
  return (
    <section className="relative w-full bg-transparent section-padding" aria-label="Contact">
      <div className="container-jollo">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent backdrop-blur-md shadow-2xl shadow-black/50 border border-white/10 overflow-hidden flex flex-col items-center text-center"
          style={{ padding: 'clamp(2.5rem, 5vw, 5rem)' }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(233,230,18,0.1) 0%, transparent 80%)" }} />

          <p className="text-label text-white mb-8">Ready to Begin?</p>

          <h2 className="text-display text-white mb-12">
            Let's <span className="text-[#e9e612] italic">Talk.</span>
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <a href={`mailto:${EMAIL}`} className="text-body-lg text-white hover:text-white transition-colors duration-300">
              {EMAIL}
            </a>
            <div className="w-px h-8 bg-white/10 hidden md:block" />
            <MagneticButton href="/contact" variant="ghost">
              Book a Consultation
              <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                <path d="M0 4h13M9 0.5l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </MagneticButton>
          </div>
        </motion.div>

        <div className="mt-24 pt-8 border-t border-white/5 flex items-center justify-between flex-wrap gap-4">
          <span className="text-label text-white">© {new Date().getFullYear()} Jollo Experience</span>
          <span className="text-label text-white">India · Delivering globally</span>
        </div>
      </div>
    </section>
  );
}
