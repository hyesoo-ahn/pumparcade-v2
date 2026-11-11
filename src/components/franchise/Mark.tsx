"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Highlighter stroke: when the phrase scrolls into view a marker band sweeps left → right
// behind it, led by a red text-cursor bar (same motion as pumparcade.com).
export default function Mark({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const bandRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const band = bandRef.current;
    const cursor = cursorRef.current;
    if (!root || !band || !cursor) return;

    const show = () => {
      band.style.transform = "scaleX(1)";
      cursor.style.left = "calc(100% - 4px)";
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const timing = { duration: 900, delay: 350, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" as const };
        band.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], timing);
        cursor.animate([{ left: "0px" }, { left: "calc(100% - 4px)" }], timing);
      },
      { threshold: 0.6 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={rootRef} className="relative inline-block px-2">
      <span
        ref={bandRef}
        aria-hidden
        className="absolute inset-0 rounded-md origin-left"
        style={{ background: "rgba(224, 29, 67, 0.3)", transform: "scaleX(0)" }}
      />
      <span ref={cursorRef} aria-hidden className="absolute top-0 bottom-0 w-1 bg-red" style={{ left: 0 }} />
      <span className="relative">{children}</span>
    </span>
  );
}
