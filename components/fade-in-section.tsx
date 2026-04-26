"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "left" | "right" | "scale";

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: Direction;
}

const hiddenTransform: Record<Direction, string> = {
  up: "translateY(30px)",
  left: "translateX(-30px)",
  right: "translateX(30px)",
  scale: "translateY(16px) scale(0.97)",
};

export default function FadeInSection({
  children,
  className = "",
  delay = 0,
  from = "up",
}: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setVisible(true);
      setReduced(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={
        reduced
          ? undefined
          : {
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : hiddenTransform[from],
              transition: `opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${visible ? delay : 0}ms, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${visible ? delay : 0}ms`,
              willChange: visible ? "auto" : "opacity, transform",
            }
      }
    >
      {children}
    </div>
  );
}
