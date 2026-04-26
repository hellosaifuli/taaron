"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function StitchCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Keep canvas pixel dimensions in sync with its CSS size
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);
    canvas.width = canvas.offsetWidth || 400;
    canvas.height = canvas.offsetHeight || 500;

    let offset = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Warm leather background
      ctx.fillStyle = "#EDE9E3";
      ctx.fillRect(0, 0, w, h);

      const unit = Math.min(w, h);

      // ── Outer stitch ──────────────────────────────────────────
      const mOuter = unit * 0.055;
      ctx.setLineDash([unit * 0.045, unit * 0.028]);
      ctx.lineDashOffset = -offset;
      ctx.strokeStyle = "#9B6F47";
      ctx.lineWidth = unit * 0.006;
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.rect(mOuter, mOuter, w - mOuter * 2, h - mOuter * 2);
      ctx.stroke();

      // ── Inner stitch (counter-running) ────────────────────────
      const mInner = mOuter + unit * 0.03;
      ctx.setLineDash([unit * 0.028, unit * 0.018]);
      ctx.lineDashOffset = offset; // opposite direction
      ctx.strokeStyle = "#C4A882";
      ctx.lineWidth = unit * 0.003;
      ctx.beginPath();
      ctx.rect(mInner, mInner, w - mInner * 2, h - mInner * 2);
      ctx.stroke();

      // ── Centered "T" mark ─────────────────────────────────────
      const cx = w / 2;
      const cy = h / 2;
      const pulse = 0.82 + 0.18 * Math.sin(offset * 0.18);
      ctx.globalAlpha = 0.12 * pulse;
      ctx.fillStyle = "#9B6F47";
      ctx.font = `${unit * 0.18}px 'Playfair Display', Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("T", cx, cy);
      ctx.globalAlpha = 1;

      offset += 0.5;
      if (offset > 25) offset = 0;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}

interface StitchImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
}

export default function StitchImage({
  src,
  alt,
  className = "",
  sizes,
  priority,
  fill = true,
}: StitchImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <StitchCanvas />}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={`${className} transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}
