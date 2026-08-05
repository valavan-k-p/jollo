"use client";
import { motion } from "framer-motion";
import { clients } from "@/content/homepage";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ClientsSection() {
  return (
    <section className="relative w-full bg-transparent section-padding" aria-label="Clients">
      <div className="container-jollo space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <p className="text-label text-white">Trusted By</p>
          <p className="text-body text-white md:text-right max-w-sm">
            50+ enterprise clients across 12 countries
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] backdrop-blur-md shadow-2xl shadow-black/50 border border-white/5 rounded-2xl overflow-hidden"
        >
          {clients.map((client) => (
            <motion.div
              key={client.name}
              variants={itemVariants}
              className="bg-transparent p-8 md:p-12 flex items-center justify-center group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#e9e612]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <span className="font-display text-white group-hover:text-[#e9e612] transition-colors duration-300 text-center text-sm md:text-base tracking-widest uppercase relative z-10">
                {client.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
