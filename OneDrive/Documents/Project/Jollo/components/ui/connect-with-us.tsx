"use client";
import React from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import { motion } from "framer-motion";
import { site } from "@/content/site";

const SocialConnect = () => {
  return (
    <section className="relative w-full bg-transparent section-padding" aria-label="Social Connect">
      <div className="container-jollo">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent backdrop-blur-md shadow-2xl shadow-black/50 border border-white/10 overflow-hidden flex flex-col items-center text-center"
          style={{ padding: 'clamp(2.5rem, 5vw, 5rem)' }}
        >
          {/* Subtle bottom glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(233,230,18,0.1) 0%, transparent 80%)" }} />

          <h2 className="text-display text-white mb-6">
            Connect <span className="text-[#e9e612] italic">With Us.</span>
          </h2>
          
          <p className="text-body-lg text-white mb-16 max-w-2xl mx-auto leading-relaxed">
            Join our community and stay updated with the latest news, releases, and exclusive content.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 relative z-10">
            {site.social.map((s) => (
              <SocialIcon
                key={s.label}
                href={s.href}
                icon={s.label === "Instagram" ? <Instagram /> : <Linkedin />}
                label={s.label}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SocialIcon = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex flex-col items-center gap-5 text-white transition-all duration-500"
  >
    <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-white/5 transition-all duration-500 group-hover:scale-110 group-hover:border-[#e9e612] group-hover:bg-[#e9e612]/5 group-hover:shadow-[0_0_30px_rgba(233,230,18,0.2)] backdrop-blur-md relative overflow-hidden">
      {/* Icon with glow effect */}
      {React.cloneElement(icon as React.ReactElement<any>, { className: "w-8 h-8 text-white group-hover:text-[#e9e612] transition-colors duration-500 relative z-10" })}
      
      {/* Inner gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#e9e612]/0 to-[#e9e612]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
    <span className="font-display text-xs tracking-widest uppercase text-white group-hover:text-[#e9e612] transition-colors duration-500">
      {label}
    </span>
  </a>
);

export { SocialConnect };
