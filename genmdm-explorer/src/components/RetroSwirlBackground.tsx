import React, { useEffect, useRef } from "react";

type Props = {
  /** overall speed multiplier (0.6–1.6 is nice) */
  speed?: number;
  /** visual density (how many swirls) */
  density?: number; // 4..10
  /** brightness multiplier */
  glow?: number; // 0.6..1.5
};

export default function RetroSwirlBackground({ speed = 1, density = 7, glow = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0;
    let start = performance.now();
    let running = !prefersReduced;

    const setSize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const parent = canvas.parentElement!;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(canvas.parentElement!);

    const hueAt = (i: number, t: number) => ((i * 360 / density) + (t * 12)) % 360;

    const loop = (now: number) => {
      if (!running) return;
      const t = (now - start) / 1000 * speed;

      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const cx = w / 2;
      const cy = h / 2;
      const base = Math.min(w, h) * 0.36;

      for (let i = 0; i < density; i++) {
        const k = 2.2 + i * 0.23;
        const phase = i * 0.7 + t * 0.9;
        const rot = t * 0.18 + i * 0.05;
        const rPulse = 1 + 0.12 * Math.sin(t * 1.3 + i);

        const hue = hueAt(i, t);
        const color = `hsla(${hue}, 95%, 60%, ${0.18 * glow})`;

        ctx.lineWidth = 1.2 + 0.6 * Math.sin(t + i);
        // @ts-ignore - shadow* are valid on CanvasRenderingContext2D
        ctx.shadowColor = `hsla(${hue}, 95%, 60%, ${0.7 * glow})`;
        // @ts-ignore
        ctx.shadowBlur = 24 * glow;
        ctx.strokeStyle = color;

        ctx.beginPath();
        const turns = 2.5;
        const steps = 520;
        for (let s = 0; s <= steps; s++) {
          const th = (s / steps) * (Math.PI * 2 * turns) + rot;
          const rr = base * rPulse * (0.55 + 0.35 * Math.cos(k * th + phase));
          const x = cx + rr * Math.cos(th);
          const y = cy + rr * Math.sin(th);
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    };

    if (running) rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [speed, density, glow]);

  return (
    <div className="absolute inset-0 pointer-events-none -z-10">
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 120px rgba(0,0,0,0.6)" }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
