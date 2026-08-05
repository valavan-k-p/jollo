"use client";
import { useEffect, useRef } from "react";

export default function NoiseCanvas({
  opacity = 0.035,
  speed = 3,
  className = "",
}: {
  opacity?: number;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let frame = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      if (w > 0 && h > 0) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const paint = () => {
      rafId = requestAnimationFrame(paint);
      if (++frame % speed !== 0 || w === 0 || h === 0) return;
      const img = ctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    paint();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [speed]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
      style={{ opacity, mixBlendMode: "overlay" }}
    />
  );
}
