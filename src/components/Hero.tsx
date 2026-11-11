"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PixelTV from "./PixelTV";
import RotatingWord from "./RotatingWord";

// Real in-store play video, served from the live site
const PLAY_VIDEO = "https://www.pumparcade.com/assets/images/real-play.mp4";

const clamp = (v: number) => Math.min(1, Math.max(0, v));


// Colors follow the LED floor: blue = step, green = run, red = dodge
const PLAY_WORDS = [
  { text: "밟고", color: "#3aa0ff" },
  { text: "뛰고", color: "#65ff1e" },
  { text: "피하고", color: "#e01d43" },
];

/*
 * One pinned scroll scene, driven by progress p (0 → 1):
 *   0.00–0.40  hero background zooms in and darkens, copy drifts up and fades
 *   0.20–0.45  the pixel TV rises in over it and starts playing
 *   0.45–0.70  TV holds
 *   > 0.70     keep scrolling down and the page glides to the next section
 */
const SNAP_AT = 0.7;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const tvRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let playing = false;
    let lastP = 0;
    let snapping = false;

    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? clamp(-rect.top / travel) : 0;

      // Hero: zoom + darken
      const a = clamp(p / 0.4);
      const copy = clamp(a / 0.5);
      if (copyRef.current) {
        copyRef.current.style.opacity = String(1 - copy);
        copyRef.current.style.transform = reduced ? "" : `translate3d(0, ${-60 * copy}px, 0)`;
        copyRef.current.style.visibility = copy >= 1 ? "hidden" : "visible";
      }
      if (shadeRef.current) shadeRef.current.style.opacity = String(0.85 * a);
      if (imageRef.current && !reduced) imageRef.current.style.transform = `scale(${1 + 0.3 * a})`;

      // TV rises in
      const t = clamp((p - 0.2) / 0.25);
      if (tvRef.current) {
        const tv = tvRef.current;
        tv.style.opacity = String(t);
        tv.style.transform = reduced ? "" : `translate3d(0, ${60 * (1 - t)}px, 0) scale(${0.85 + 0.15 * t})`;
        tv.style.pointerEvents = t > 0.5 ? "auto" : "none";
      }

      // Play only while the TV is on screen
      const video = videoRef.current;
      const visible = t > 0 && rect.bottom > 0;
      if (video && visible !== playing) {
        playing = visible;
        if (visible) video.play().catch(() => {});
        else video.pause();
      }

      // Scrolling down past the hold → glide to the next section
      if (!reduced && !snapping && p > SNAP_AT && p < 1 && p > lastP) {
        snapping = true;
        document.getElementById("stores")?.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => (snapping = false), 1200);
      }
      lastP = p;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="relative h-[250svh] bg-background">
      <div className="sticky top-16 md:top-[72px] h-[calc(100svh-4rem)] md:h-[calc(100svh-72px)] min-h-[560px] overflow-hidden flex items-center">
        {/* Background image */}
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          <Image
            src="/images/main_hero.png"
            alt="LED 발판 위를 뛰어다니는 펌프 아케이드 캐릭터들"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[70%_center] md:object-center"
          />
        </div>
        {/* Left fade so the copy stays readable on small screens */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent md:from-background/40 md:via-transparent" />
        {/* Darkens as you scroll */}
        <div ref={shadeRef} className="absolute inset-0 bg-background opacity-0" />

        <div ref={copyRef} className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-10 py-24 will-change-transform">
          <p className="type-pixel text-green mb-6">
            친구랑 뛰어노는 LED 발판게임
          </p>

          <h1 className="type-display text-foreground mb-6" aria-label="요즘 애들 뭐하고 놀아? 펌프아케이드에서 밟고, 뛰고, 피하고 놀아!">
            <span aria-hidden className="text-[30px] md:text-[48px]">요즘 애들 뭐하고 놀아?</span>
            <br />
            <span aria-hidden>
              {/* Brand name: Galmuri9 pixel font, white with a see-through drop shadow */}
              <span
                className="font-pixel font-normal text-[40px] md:text-[60px] tracking-normal"
                style={{ color: "#faf1ef", textShadow: "0 0.07em 0 rgba(250, 241, 239, 0.35)" }}
              >
                펌프아케이드
              </span>
              에서
            </span>
            {/* Too long for one line on phones */}
            <br className="md:hidden" />{" "}
            <RotatingWord words={PLAY_WORDS} /> <span aria-hidden>놀아!</span>
          </h1>

          <p className="type-body-lg text-foreground/85 mb-10">
            바닥을 밟고 벽을 터치하며 미션을 클리어하세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 type-pixel">
            <a
              href="#stores"
              className="inline-flex items-center justify-center bg-green text-background px-6 py-4 hover:brightness-110 transition"
            >
              가까운 매장 찾기 →
            </a>
            <a
              href="#modes"
              className="inline-flex items-center justify-center border border-foreground/30 text-foreground px-6 py-4 hover:border-green hover:text-green transition-colors"
            >
              게임 모드 보기 ↓
            </a>
          </div>
        </div>

        {/* Pixel TV playing the real in-store video */}
        <div
          ref={tvRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 opacity-0 pointer-events-none will-change-transform"
        >
          <PixelTV
            muted={muted}
            onToggleMute={() => setMuted((m) => !m)}
          >
            <video
              ref={videoRef}
              src={PLAY_VIDEO}
              muted={muted}
              loop
              playsInline
              preload="metadata"
              aria-label="펌프아케이드 실제 매장 플레이 영상"
              // The file has blurred bands and black bars baked in (content is the
              // middle ~82%), so zoom past them to fill the screen.
              className="absolute inset-0 h-full w-full object-cover scale-[1.24]"
            />
          </PixelTV>
          <p className="type-caption text-foreground/50 mt-5 text-center">
            실제 매장 촬영 영상 · 영상 협조: 틴 프렌즈, MBC 〈첫번째남자〉
          </p>
        </div>
      </div>
    </section>
  );
}
