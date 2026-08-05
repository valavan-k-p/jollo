import { cn } from "@/lib/utils";

interface SectionLabelProps {
  /** Two-digit index, e.g. "01". Anchors the section in a numbered system. */
  index: string;
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}

/**
 * Consistent section eyebrow: a yellow index numeral + a short tick rule +
 * the label. Replaces the repetitive bare uppercase label so every section
 * shares one rhythmic, editorial grammar and the brand colour appears at a
 * predictable cadence.
 */
export default function SectionLabel({
  index,
  children,
  className,
  align = "left",
}: SectionLabelProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        align === "center" && "justify-center",
        className
      )}
    >
      <span className="font-display text-xs font-semibold tabular-nums text-[#e9e612]">
        {index}
      </span>
      <span className="h-px w-8 bg-white/20" aria-hidden="true" />
      <span className="font-display text-xs font-medium tracking-[0.2em] uppercase text-white">
        {children}
      </span>
    </div>
  );
}
