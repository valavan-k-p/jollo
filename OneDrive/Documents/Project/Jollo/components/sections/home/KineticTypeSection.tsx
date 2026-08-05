"use client";

const ROWS: { text: string; dir: 1 | -1; speed: number; style: "fill" | "stroke" }[] = [
  {
    text: "BRANDING · M.I.C.E. · CELEBRATIONS · GROWTH · JOLLO X · MARKETING ·",
    dir: -1,
    speed: 0.7,
    style: "stroke",
  },
  {
    text: "BRAND EXPERIENCE · STRATEGY · EVENTS · DESIGN · DIGITAL · CULTURE ·",
    dir: 1,
    speed: 0.6,
    style: "fill",
  },
  {
    text: "M.I.C.E. · ACTIVATIONS · CAMPAIGNS · INNOVATION · PERFORMANCE · VISION ·",
    dir: -1,
    speed: 0.8,
    style: "stroke",
  },
];

function KineticRow({
  text,
  dir,
  speed,
  style,
}: {
  text: string;
  dir: -1 | 1;
  speed: number;
  style: "fill" | "stroke";
}) {
  const repeated = `${text} ${text} ${text} ${text} `;

  return (
    <div className="overflow-hidden flex w-full">
      <div
        className="flex whitespace-nowrap will-change-transform py-2 animate-marquee"
        style={{
          animationDirection: dir === 1 ? "reverse" : "normal",
          animationDuration: `${40 / speed}s`
        }}
        aria-hidden="true"
      >
        <span
          className="font-editorial inline-block text-[4rem] md:text-[6rem] lg:text-[8rem] leading-none tracking-tight pr-8"
          style={{
            color: style === "fill" ? "#ffffff" : "#e9e612",
            WebkitTextStroke: undefined,
          }}
        >
          {repeated}
        </span>
      </div>
    </div>
  );
}

export default function KineticTypeSection() {
  return (
    <section className="relative w-full bg-transparent section-padding overflow-hidden" aria-label="Capabilities">
      <div className="container-jollo mb-12">
        <p className="text-label text-white">
          Everything we do
        </p>
      </div>

      <div className="flex flex-col gap-2 md:gap-4">
        {ROWS.map((row, i) => (
          <KineticRow key={i} {...row} />
        ))}
      </div>
    </section>
  );
}
