"use client";
import { motion } from "framer-motion";
import { stats } from "@/content/homepage";

export default function StatsSection() {
  return (
    <section className="relative w-full bg-transparent section-padding">
      <div className="container-jollo">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative overflow-hidden rounded-2xl bg-white/[0.04] backdrop-blur-md shadow-2xl shadow-black/50 border border-white/5 flex flex-col items-center justify-center text-center group"
              style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#e9e612]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <h3 className="font-editorial text-5xl md:text-8xl lg:text-[8rem] text-white tracking-tighter leading-none mb-2 md:mb-4 group-hover:scale-105 transition-transform duration-500 will-change-transform">
                {stat.value}
                <span className="text-[#e9e612]">{stat.suffix}</span>
              </h3>

              <p className="text-label text-white transition-colors duration-300">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
