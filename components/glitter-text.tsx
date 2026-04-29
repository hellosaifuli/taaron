"use client";

import { useEffect, useState } from "react";

const SPARKLES = [
  { x:  4, y: -14, delay: 0.2, dur: 1.8, size: 9,  color: "#FFD700" },
  { x: 18, y:  12, delay: 1.4, dur: 2.2, size: 6,  color: "#F0C98A" },
  { x: 33, y: -10, delay: 0.6, dur: 1.6, size: 11, color: "#FFE55C" },
  { x: 50, y:  16, delay: 2.3, dur: 2.0, size: 7,  color: "#FFD700" },
  { x: 65, y: -12, delay: 0.9, dur: 1.9, size: 8,  color: "#F0C98A" },
  { x: 80, y:  10, delay: 1.7, dur: 1.7, size: 10, color: "#FFE55C" },
  { x: 94, y: -8,  delay: 3.1, dur: 2.1, size: 6,  color: "#FFD700" },
  { x: 43, y: -18, delay: 1.1, dur: 1.5, size: 5,  color: "#F0C98A" },
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
