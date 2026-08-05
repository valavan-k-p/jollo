"use client";
import { motion } from "framer-motion";

const BEATS = [
  { prefix: "We don't", accent: "create", suffix: "events." },
  { prefix: "We engineer", accent: "extraordinary", suffix: "experiences." },
  { prefix: "Every moment.", accent: "Every detail.", suffix: "Every time." },
];

export default function ManifestoSection() {
  return (
    <section className="relative w-full bg-[#1a1a1a] section-padding overflow-hidden z-10">
      {/* Background Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#e9e612]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-jollo relative z-10 flex flex-col items-center justify-center text-center space-y-8 md:space-y-12">
        {BEATS.map((beat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-display text-white">
              {beat.prefix} <span className="text-[#e9e612] italic">{beat.accent}</span> {beat.suffix}
            </h2>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
