"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gsap } from "gsap";

const intents = [
  { id: "consultation", label: "Book a Consultation" },
  { id: "project", label: "Start a Project" },
  { id: "enquiry", label: "General Enquiry" },
  { id: "media", label: "Media / Press" },
] as const;

type IntentId = (typeof intents)[number]["id"];

const schema = z.object({
  intent: z.enum(["consultation", "project", "enquiry", "media"]),
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(10, "Please tell us a bit more"),
});

const budgetOptions = [
  "Under ₹5 Lakh",
  "₹5 – 15 Lakh",
  "₹15 – 50 Lakh",
  "₹50 Lakh+",
  "Not sure yet",
];

const timelineOptions = [
  "Within 1 month",
  "1 – 3 months",
  "3 – 6 months",
  "6+ months",
  "Flexible / exploring",
];

type FormData = z.infer<typeof schema>;

function GlassInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <div className="group relative">
      {/* Hover glow ring */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-white/[0.1] to-[#e9e612]/[0.05] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative">
        <div className="absolute inset-0 rounded-xl bg-white/[0.035] backdrop-blur-md pointer-events-none" />
        <div className="absolute inset-0 rounded-xl border border-white/[0.07] group-focus-within:border-[#e9e612]/30 transition-colors duration-500 pointer-events-none" />
        <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2), inset 0 -1px 0 rgba(255,255,255,0.03)" }} />
        <input
          {...props}
          className={`relative z-10 w-full min-h-[52px] bg-transparent rounded-xl py-3.5 px-5 text-white font-body text-base placeholder:text-white/40 focus:outline-none transition-all duration-500 ${className}`}
        />
      </div>
    </div>
  );
}

function GlassTextarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return (
    <div className="group relative">
      <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-white/[0.1] to-[#e9e612]/[0.05] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative">
        <div className="absolute inset-0 rounded-xl bg-white/[0.035] backdrop-blur-md pointer-events-none" />
        <div className="absolute inset-0 rounded-xl border border-white/[0.07] group-focus-within:border-[#e9e612]/30 transition-colors duration-500 pointer-events-none" />
        <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2), inset 0 -1px 0 rgba(255,255,255,0.03)" }} />
        <textarea
          {...props}
          className={`relative z-10 w-full min-h-[120px] bg-transparent rounded-xl py-4 px-5 text-white font-body text-base placeholder:text-white/40 focus:outline-none transition-all duration-500 resize-none ${className}`}
        />
      </div>
    </div>
  );
}

function GlassSelect({
  placeholder,
  options,
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { placeholder: string; options: string[]; className?: string }) {
  return (
    <div className="group relative">
      <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-white/[0.1] to-[#e9e612]/[0.05] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative">
        <div className="absolute inset-0 rounded-xl bg-white/[0.035] backdrop-blur-md pointer-events-none" />
        <div className="absolute inset-0 rounded-xl border border-white/[0.07] group-focus-within:border-[#e9e612]/30 transition-colors duration-500 pointer-events-none" />
        <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2), inset 0 -1px 0 rgba(255,255,255,0.03)" }} />
        <select
          {...props}
          defaultValue=""
          className={`relative z-10 w-full min-h-[52px] appearance-none bg-transparent rounded-xl py-3.5 px-5 text-white font-body text-base focus:outline-none transition-all duration-500 cursor-pointer ${className}`}
        >
          <option value="" disabled className="bg-black text-white/50">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-black text-white">
              {opt}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="absolute right-5 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-white/40"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [activeIntent, setActiveIntent] = useState<IntentId>("consultation");

  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { intent: "consultation" },
  });

  function selectIntent(id: IntentId) {
    setActiveIntent(id);
    setValue("intent", id);
  }

  async function onSubmit(_data: FormData) {
    await new Promise((r) => setTimeout(r, 800));
    if (formRef.current) {
      gsap.to(formRef.current, {
        opacity: 0, y: -20, duration: 0.4, ease: "power2.in",
        onComplete: () => setSubmitted(true),
      });
    } else {
      setSubmitted(true);
    }
  }

  useEffect(() => {
    if (submitted && successRef.current) {
      gsap.fromTo(successRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.5)" }
      );
    }
  }, [submitted]);

  if (submitted) {
    return (
      <div ref={successRef} className="py-16 text-center will-change-transform">
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 rounded-2xl bg-[#e9e612]/[0.06] backdrop-blur-sm border border-[#e9e612]/15" />
          <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: "0 0 50px rgba(233,230,18,0.12), inset 0 1px 0 rgba(233,230,18,0.1)" }} />
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#e9e612" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <h3 className="font-display font-semibold text-white text-2xl mb-3">Message received.</h3>
        <p className="font-body text-white text-sm">We&apos;ll be in touch within one business day.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8 will-change-transform">

      {/* Intent selector */}
      <div className="flex flex-col gap-4">
        <p className="font-display text-[10px] font-semibold tracking-[0.3em] uppercase text-[#e9e612]/50">
          I want to
        </p>
        <div className="flex flex-wrap gap-2">
          {intents.map((intent) => {
            const isActive = activeIntent === intent.id;
            return (
              <button
                key={intent.id}
                type="button"
                onClick={() => selectIntent(intent.id)}
                className="relative cursor-pointer group/btn"
              >
                {/* Active glow */}
                {isActive && (
                  <div className="absolute -inset-px rounded-lg bg-gradient-to-br from-[#e9e612]/20 to-[#e9e612]/5 pointer-events-none" />
                )}
                <div className={`relative rounded-lg overflow-hidden transition-all duration-400 ${isActive ? "" : "hover:scale-[1.02]"}`}>
                  <div className={`absolute inset-0 ${isActive ? "bg-[#e9e612]/[0.1]" : "bg-white/[0.03]"}`} />
                  <div className="absolute inset-0 backdrop-blur-md" />
                  <div className={`absolute inset-0 rounded-lg border transition-colors duration-400 pointer-events-none ${
                    isActive ? "border-[#e9e612]/25" : "border-white/[0.06] group-hover/btn:border-white/[0.12]"
                  }`} />
                  {isActive && (
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 30% 0%, rgba(233,230,18,0.08) 0%, transparent 70%)" }} />
                  )}
                  <span className={`relative z-10 block px-5 py-2.5 font-display text-[13px] font-medium transition-colors duration-400 ${
                    isActive ? "text-[#e9e612]" : "text-white group-hover/btn:text-white"
                  }`}>
                    {intent.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <input type="hidden" {...register("intent")} />
      </div>

      {/* Subtle separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Fields */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <GlassInput {...register("name")} placeholder="Your Name *" autoComplete="name" />
            {errors.name && <p className="text-xs text-red-400/80 mt-2 pl-1 font-body">{errors.name.message}</p>}
          </div>
          <div>
            <GlassInput {...register("email")} type="email" placeholder="Email Address *" autoComplete="email" />
            {errors.email && <p className="text-xs text-red-400/80 mt-2 pl-1 font-body">{errors.email.message}</p>}
          </div>
        </div>
        <GlassInput {...register("company")} placeholder="Company / Organisation" autoComplete="organization" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassSelect {...register("budget")} placeholder="Budget Range" options={budgetOptions} />
          <GlassSelect {...register("timeline")} placeholder="Timeline / Event Date" options={timelineOptions} />
        </div>
        <GlassTextarea {...register("message")} placeholder="Tell us about your project or enquiry *" rows={5} />
        {errors.message && <p className="text-xs text-red-400/80 mt-0 pl-1 font-body">{errors.message.message}</p>}
      </div>

      {/* Subtle separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Submit */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Glow behind button */}
          <div className="absolute -inset-1 rounded-xl bg-[#e9e612]/20 blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-[#e9e612]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/10 pointer-events-none" />
            <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -1px 2px rgba(0,0,0,0.15)" }} />

            <span className="relative z-10 flex items-center gap-3 px-10 py-4 font-display font-semibold text-sm tracking-wide text-black">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </span>
          </div>
        </button>
        <p className="font-body text-[11px] text-white leading-relaxed">
          We respond to every message<br className="hidden sm:block" /> within one business day.
        </p>
      </div>
    </form>
  );
}
