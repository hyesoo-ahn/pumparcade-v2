import type { ReactNode } from "react";

// Brand palette (same as the PUMP ARCADE wordmark)
const OUTLINE = "#14101f";
const BODY = "#faf1ef";
const SHADOW = "#e01d43";

// Rectangle with 2-step "pixel" corners, u = size of one step
function stepped(u: number) {
  const a = `${u}px`;
  const b = `${u * 2}px`;
  const R = (v: string) => `calc(100% - ${v})`;
  return `polygon(${[
    [b, "0"], [R(b), "0"], [R(b), a], [R(a), a], [R(a), b], ["100%", b],
    ["100%", R(b)], [R(a), R(b)], [R(a), R(a)], [R(b), R(a)], [R(b), "100%"],
    [b, "100%"], [b, R(a)], [a, R(a)], [a, R(b)], ["0", R(b)],
    ["0", b], [a, b], [a, a], [b, a],
  ]
    .map(([x, y]) => `${x} ${y}`)
    .join(", ")})`;
}

type Props = {
  children: ReactNode;
  muted: boolean;
  onToggleMute: () => void;
};

export default function PixelTV({ children, muted, onToggleMute }: Props) {
  return (
    <div
      className="relative"
      // Fit the TV in the viewport: 16:9 screen + bezel + control panel
      style={{ width: "min(100%, 1040px, calc((100svh - 72px - 230px) * 16 / 9 + 48px))" }}
    >
      {/* Antennas */}
      <svg
        aria-hidden
        viewBox="0 0 80 40"
        shapeRendering="crispEdges"
        className="absolute left-1/2 bottom-full -translate-x-1/2 w-20 md:w-28 h-auto"
      >
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <g key={i} fill={BODY}>
            <rect x={34 - i * 4} y={32 - i * 4} width="4" height="4" />
            <rect x={42 + i * 4} y={32 - i * 4} width="4" height="4" />
          </g>
        ))}
        <rect x="2" y="2" width="8" height="8" fill={SHADOW} />
        <rect x="70" y="2" width="8" height="8" fill={SHADOW} />
        <rect x="32" y="34" width="16" height="6" fill={BODY} />
      </svg>

      {/* Red drop shadow, like the wordmark */}
      <div aria-hidden className="absolute inset-0 translate-y-2" style={{ background: SHADOW, clipPath: stepped(8) }} />

      {/* Outline */}
      <div className="relative p-1" style={{ background: OUTLINE, clipPath: stepped(8) }}>
        {/* Body */}
        <div className="px-3 pt-3 md:px-5 md:pt-5" style={{ background: BODY, clipPath: stepped(6) }}>
          {/* Screen bezel */}
          <div className="p-1" style={{ background: OUTLINE, clipPath: stepped(6) }}>
            <div className="relative aspect-video overflow-hidden bg-black" style={{ clipPath: stepped(4) }}>
              {children}

              {/* CRT scanlines + vignette */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 3px)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)" }}
              />

              <span className="absolute right-3 top-3 md:right-4 md:top-4 type-pixel-sm md:type-pixel text-foreground flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 md:w-2.5 md:h-2.5 animate-pulse" style={{ background: SHADOW }} />
                REC
              </span>
            </div>
          </div>

          {/* Control panel */}
          <div className="flex items-center justify-between gap-3 h-12 md:h-16">
            <div className="flex items-baseline gap-2 md:gap-3" style={{ color: OUTLINE }}>
              <span className="type-pixel">PUMP TV</span>
              <span className="hidden sm:inline type-pixel-sm opacity-60">실제 매장 플레이 영상</span>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              {/* Speaker grill */}
              <span aria-hidden className="hidden sm:grid grid-cols-6 gap-1">
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i} className="w-1.5 h-1.5" style={{ background: OUTLINE, opacity: 0.7 }} />
                ))}
              </span>
              <button
                type="button"
                onClick={onToggleMute}
                aria-pressed={!muted}
                className="type-pixel-sm md:type-pixel px-3 py-1.5 md:px-4 md:py-2 hover:brightness-125 active:translate-y-0.5 transition"
                style={{ background: OUTLINE, color: BODY, clipPath: stepped(3) }}
              >
                {muted ? "소리 켜기 ♪" : "소리 끄기 ✕"}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
