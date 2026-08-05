"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { featuredWork } from "@/content/homepage";

export default function WorkSection() {
  return (
    <section className="relative w-full bg-transparent section-padding">
      <div className="container-jollo space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <p className="text-label text-white">Selected Work</p>
          </div>
          <Link
            href="/work"
            className="group flex items-center gap-2 text-body text-white hover:text-[#e9e612] transition-colors"
          >
            See all work
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-16">
          {featuredWork.map((work, i) => (
            <motion.div
              key={work.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`group relative flex flex-col gap-6 ${i === 2 ? 'lg:col-span-2 lg:flex-row' : ''}`}
            >
              <Link href={`/work/${work.slug}`} className={`relative overflow-hidden rounded-2xl bg-white/[0.04] backdrop-blur-md shadow-2xl shadow-black/50 border border-white/5 aspect-[4/3] block ${i === 2 ? 'lg:w-1/2 lg:aspect-auto lg:h-[400px]' : 'w-full'}`}>
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-transparent/20 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-transparent/40 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                    {work.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-transparent/40 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                    {work.year}
                  </span>
                </div>
              </Link>

              <div className={`space-y-3 ${i === 2 ? 'lg:w-1/2 lg:flex lg:flex-col lg:justify-center lg:px-8' : ''}`}>
                <p className="text-label text-[#e9e612]">{work.client}</p>
                <Link href={`/work/${work.slug}`}>
                  <h3 className="text-h3 text-white group-hover:text-[#e9e612] transition-colors">
                    {work.title}
                  </h3>
                </Link>
                <p className="text-body text-white max-w-md">
                  {work.outcome}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
