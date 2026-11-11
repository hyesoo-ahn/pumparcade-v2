"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#3aa0ff", "#e01d43", "#3aa0ff", "#3aa0ff", "#e01d43"];
const COUNT = 10;

// A row of LED floor tiles under a word; a light chases across them.
export default function LedUnderline() {
  const rowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tiles = Array.from(rowRef.current?.children ?? []) as HTMLElement[];
    const anims = tiles.map((tile, i) =>
      tile.animate(
        [{ opacity: 0.35 }, { opacity: 1, offset: 0.15 }, { opacity: 0.35, offset: 0.4 }, { opacity: 0.35 }],
        { duration: 1600, delay: i * 110, iterations: Infinity, easing: "steps(4)" },
      ),
    );
    return () => anims.forEach((a) => a.cancel());
  }, []);

  return (
    <span
      ref={rowRef}
      aria-hidden
      className="absolute left-0 right-0 flex gap-[0.05em]"
      style={{ top: "100%", height: "0.1em" }}
    >
      {Array.from({ length: COUNT }, (_, i) => {
        const color = COLORS[i % COLORS.length];
        return (
          <span
            key={i}
            className="flex-1"
            style={{ background: color, boxShadow: `0 0 0.15em ${color}`, opacity: 0.35 }}
          />
        );
      })}
    </span>
  );
}
