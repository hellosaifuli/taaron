"use client";

import { useEffect, useState } from "react";

const SPARKLES = [
  { x:  2, y: -16, delay: 0.2, dur: 1.8, size: 9,  color: "#FFD700" },
  { x: 12, y:  14, delay: 2.6, dur: 2.0, size: 6,  color: "#F0C98A" },
  { x: 22, y: -10, delay: 0.8, dur: 1.6, size: 7,  color: "#FFE55C" },
  { x: 33, y:  18, delay: 1.9, dur: 2.2, size: 10, color: "#FFD700" },
  { x: 44, y: -18, delay: 0.4, dur: 1.9, size: 6,  color: "#F0C98A" },
  { x: 54, y:  14, delay: 3.0, dur: 1.7, size: 8,  color: "#FFE55C" },
  { x: 64, y: -12, delay: 1.2, dur: 2.1, size: 11, color: "#FFD700" },
  { x: 74, y:  16, delay: 0.6, dur: 1.5, size: 5,  color: "#F0C98A" },
  { x: 84, y: -8,  delay: 2.2, dur: 2.0, size: 9,  color: "#FFE55C" },
  { x: 94, y:  12, delay: 1.5, dur: 1.8, size: 7,  color: "#FFD700" },
  { x: 50, y: -20, delay: 3.4, dur: 1.6, size: 5,  color: "#F0C98A" },
  { x: 28, y:  -6, delay: 1.8, dur: 2.3, size: 8,  color: "#FFE55C" },
];

interface GlitterTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
}

export default function GlitterText({
  children,
  className,
  style,
  wrapperStyle,
}: GlitterTextProps) {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <span
      style={{ position: "relative", display: "inline-block", ...wrapperStyle }}
    >
      <em className={className} style={style}>
        {children}
      </em>

      {!reduced &&
        SPARKLES.map((s, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              fontSize: `${s.size}px`,
              lineHeight: 1,
              color: s.color,
              animation: `sparkleIn ${s.dur}s ease-in-out ${s.delay}s infinite`,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            ✦
          </span>
        ))}
    </span>
  );
}
