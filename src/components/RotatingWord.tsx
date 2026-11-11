"use client";

import { useEffect, useRef, useState } from "react";

type Word = { text: string; color: string };

type Props = {
  words: Word[];
  interval?: number;
};

// Cycles through words in place: the current word slides up and out while the
// next slides in from below, and the box eases to the new word's width.
export default function RotatingWord({ words, interval = 1800 }: Props) {
  const [index, setIndex] = useState(0);
  const [widths, setWidths] = useState<number[]>([]);
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const measure = () => setWidths(refs.current.map((el) => el?.offsetWidth ?? 0));
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  const prev = (index - 1 + words.length) % words.length;
  const width = widths[index];

  return (
    <span
      aria-hidden
      className="relative inline-block overflow-hidden align-bottom"
      style={{
        width: width ? `${width}px` : undefined,
        transition: "width 450ms cubic-bezier(0.2, 0.7, 0.2, 1)",
      }}
    >
      {/* Invisible copy keeps the line height (and the width before measuring) */}
      <span className="invisible whitespace-nowrap">{words[index].text}</span>

      {words.map((word, i) => (
        <span
          key={word.text}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute left-0 top-0 whitespace-nowrap"
          style={{
            color: word.color,
            opacity: i === index ? 1 : 0,
            transform: `translateY(${i === index ? 0 : i === prev ? -100 : 100}%)`,
            transition: "transform 500ms cubic-bezier(0.2, 0.75, 0.15, 1), opacity 300ms ease",
          }}
        >
          {word.text}
        </span>
      ))}
    </span>
  );
}
