/**
 * The Genesis sequence — chapter timing and progress curves.
 *
 * Everything in the section is driven by one number: `p`, the 0→1 scroll
 * progress through the pinned stage. Chapter spans and the orb's build,
 * maturity and dock curves are all expressed against `p`, so the visuals and
 * the words can never drift apart.
 *
 * This is only the first act. It ends by *handing over* — the orb docks rather
 * than dissolving, and the founder's real story continues underneath it.
 */

export type GenesisChapter = {
  id: string;
  numeral: string;
  /** Short name shown in the progress rail. */
  marker: string;
  /** Small letterspaced label above the headline. */
  label?: string;
  /** Headline lines. Chapter 04 is deliberately wordless. */
  lines?: string[];
  /** Quiet line beneath the headline — used for the handoff. */
  sub?: string;
  start: number;
  end: number;
};

/**
 * Six beats. The spans are uneven on purpose: the empty chapters breathe, and
 * formation and completion get the most room.
 */
export const GENESIS_CHAPTERS: GenesisChapter[] = [
  {
    id: "nothing",
    numeral: "01",
    marker: "Nothing",
    label: "Our Story",
    lines: ["Every unforgettable experience", "begins with nothing."],
    start: 0.0,
    end: 0.1,
  },
  {
    id: "idea",
    numeral: "02",
    marker: "The Idea",
    lines: ["One idea.", "One vision.", "Nothing more."],
    start: 0.1,
    end: 0.215,
  },
  {
    id: "energy",
    numeral: "03",
    marker: "Energy",
    lines: ["Ideas attract energy.", "Energy creates direction."],
    start: 0.215,
    end: 0.345,
  },
  {
    id: "formation",
    numeral: "04",
    marker: "Formation",
    start: 0.345,
    end: 0.545,
  },
  {
    id: "orb",
    numeral: "05",
    marker: "The Orb",
    lines: ["Experiences aren't built overnight.", "They are crafted,", "layer by layer."],
    start: 0.545,
    end: 0.79,
  },
  {
    id: "beginning",
    numeral: "06",
    marker: "The Beginning",
    lines: ["This is where", "Jollo Experience begins."],
    sub: "And this is how it actually happened.",
    start: 0.79,
    end: 1.0,
  },
];

/* ─── Curve helpers ───────────────────────────────────────────────────────── */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Piecewise-linear remap through a list of [input, output] stops. */
export function curve(p: number, stops: [number, number][]): number {
  if (p <= stops[0][0]) return stops[0][1];
  const last = stops[stops.length - 1];
  if (p >= last[0]) return last[1];
  for (let i = 0; i < stops.length - 1; i++) {
    const [x0, y0] = stops[i];
    const [x1, y1] = stops[i + 1];
    if (p >= x0 && p <= x1) {
      const t = x1 === x0 ? 0 : (p - x0) / (x1 - x0);
      return y0 + (y1 - y0) * t;
    }
  }
  return last[1];
}

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/** Where the orb reaches its final form — build and maturity both land here. */
export const COMPLETION = 0.775;

/** Orb completeness, 0 → 1. Nothing exists until chapter 03 is nearly over. */
export function buildAmount(p: number): number {
  return curve(p, [
    [0.0, 0.0],
    [0.32, 0.0],
    [0.42, 0.15],
    [0.5, 0.3],
    [0.6, 0.6],
    [0.7, 0.88],
    [COMPLETION, 1.0],
    [1.0, 1.0],
  ]);
}

/**
 * How far the orb has converged on the hero orb's identity.
 *
 * 0 is an inert geometric shell; 1 runs the homepage orb's exact material,
 * surface warp, light rig and colour grade. It reaches 1 at the same instant
 * the build completes, so the moment of "finished" and the moment of
 * "recognisable" are the same beat.
 */
export function maturityAmount(p: number): number {
  return curve(p, [
    [0.0, 0.0],
    [0.4, 0.0],
    [0.5, 0.18],
    [0.6, 0.45],
    [0.7, 0.78],
    [COMPLETION, 1.0],
    [1.0, 1.0],
  ]);
}

/** Fraction of the mote field that has appeared. Chapter 02 shows exactly one. */
export function moteReveal(p: number): number {
  return curve(p, [
    [0.0, 0.0],
    [0.103, 0.0],
    [0.125, 0.0006],
    [0.215, 0.0006],
    [0.25, 0.25],
    [0.4, 1.0],
    [1.0, 1.0],
  ]);
}

/** How far the motes have travelled from deep space toward the centre. */
export function moteConverge(p: number): number {
  return curve(p, [
    [0.0, 0.0],
    [0.22, 0.0],
    [0.48, 1.0],
    [1.0, 1.0],
  ]);
}

/**
 * The orb does not dissolve. Once complete it *docks* — settling smaller and
 * lower so the founder's story can continue beneath it. This is the hinge
 * between the symbolic act and the real one.
 */
export function dockAmount(p: number): number {
  return smoothstep(0.815, 1.0, p);
}

/** The motes have served their purpose by the time the orb docks. */
export function moteFade(p: number): number {
  return 1 - smoothstep(0.8, 0.93, p);
}

/** The orb stays lit to the end — it only settles back a little. */
export function orbFade(p: number): number {
  return 1 - smoothstep(0.86, 1.0, p) * 0.12;
}

/**
 * The single golden pulse the orb emits on reaching its final form.
 * A narrow bell so it reads as one breath, not a throb.
 */
export function birthPulse(p: number): number {
  const d = (p - COMPLETION) / 0.045;
  return Math.exp(-d * d * 4);
}

/**
 * Per-chapter text opacity: fade in, hold, fade out.
 *
 * The opening chapter has no fade-in — it must be legible the instant the page
 * loads, before any scrolling. Its slow cinematic entrance is a CSS mount
 * animation on the overlay instead, so the two never fight over the property.
 */
export function chapterOpacity(p: number, chapter: GenesisChapter): number {
  const span = chapter.end - chapter.start;
  const fade = span * 0.26;
  const fadeIn =
    chapter.start <= 0 ? 1 : smoothstep(chapter.start, chapter.start + fade, p);
  // The closing chapter holds instead of fading — it hands over to the page.
  const fadeOut =
    chapter.end >= 1 ? 1 : 1 - smoothstep(chapter.end - fade, chapter.end, p);
  return fadeIn * fadeOut;
}

/** The gold thread that carries the orb's light down into the real story. */
export function bridgeAmount(p: number): number {
  return smoothstep(0.9, 1.0, p);
}

export function activeChapterIndex(p: number): number {
  for (let i = 0; i < GENESIS_CHAPTERS.length; i++) {
    if (p < GENESIS_CHAPTERS[i].end) return i;
  }
  return GENESIS_CHAPTERS.length - 1;
}
