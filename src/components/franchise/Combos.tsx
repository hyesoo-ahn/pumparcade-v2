"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Mark from "./Mark";

const IMG = "/images/franchise";

type Combo = {
  title: string;
  desc: string;
  img: string;
  color: string;
  // Big stat: numbers count up from 0, joined by `sep`
  stat: { values: number[]; sep?: string; unit: string; caption: string };
  tags: string[];
};

// Facts from pumparcade.com
const combos: Combo[] = [
  {
    title: "부담없는 창업비용",
    desc: "부담 없는 비용으로 펌프아케이드 매장을 시작하세요.",
    img: "main.png",
    color: "#e01d43",
    stat: { values: [7500, 9500], sep: "~", unit: "만원", caption: "30평 기준 창업비용" },
    tags: ["직영 인테리어팀 시공", "무상 A/S 2년"],
  },
  {
    title: "신규 게임 지속 무료 업데이트",
    desc: "본사가 직접 개발하는 소프트웨어라, 신작이 나오면 전 지점에 바로 무료로 들어갑니다.",
    img: "rival-match-screenshot2.png",
    color: "#3aa0ff",
    stat: { values: [0], unit: "원", caption: "신규 게임 업데이트 추가 비용" },
    tags: ["세계 최초 VAR", "스피드매치·아케이드 개발 중"],
  },
  {
    title: "국가 공인 인증 기업",
    desc: "기술력과 품질을 공식 인증으로 확인받은 기업입니다.",
    img: "rival-match-screenshot3.png",
    color: "#65ff1e",
    stat: { values: [3], unit: "개", caption: "보유 공식 인증" },
    tags: ["벤처기업 확인", "특허 등록", "ISO 9001"],
  },
];

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function CountUp({ values, sep, run }: { values: number[]; sep?: string; run: boolean }) {
  const [shown, setShown] = useState(values.map(() => 0));
  const done = useRef(false);

  useEffect(() => {
    if (!run || done.current) return;
    done.current = true;
    // Reduced motion: jump straight to the final numbers on the first frame
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1400;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = duration ? easeOut(Math.min(1, (now - start) / duration)) : 1;
      setShown(values.map((v) => Math.round(v * t)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, values]);

  return <>{shown.map((n) => n.toLocaleString("ko-KR")).join(sep ?? "")}</>;
}

function ComboMeter({ level, filled, animate = false }: { level: number; filled: number; animate?: boolean }) {
  return (
    <>
      <div className="mt-10 flex items-end gap-5">
        <p className="type-pixel text-foreground/50 pb-2">COMBO</p>
        <p
          key={animate ? level : undefined}
          className={`${animate ? "combo-pop" : ""} font-pixel text-[64px] md:text-[80px] leading-none`}
          style={{ color: combos[level - 1].color, textShadow: "0 6px 0 rgba(0,0,0,0.35)" }}
        >
          ×{level}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-1.5 max-w-sm" aria-hidden>
        {combos.map((c, i) => (
          <span
            key={c.title}
            className="h-2.5 transition-all duration-500"
            style={{ background: i < filled ? c.color : "rgba(250,241,239,0.1)" }}
          />
        ))}
      </div>
    </>
  );
}

export default function Combos() {
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<boolean[]>(combos.map(() => false));
  const rowRefs = useRef<(HTMLElement | null)[]>([]);

  // The row crossing the middle band of the screen is the active combo
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = Number((entry.target as HTMLElement).dataset.index);
          setActive(i);
          setSeen((s) => (s[i] ? s : s.map((v, j) => v || j === i)));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    rowRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const level = seen.filter(Boolean).length;

  return (
    <section id="combo" className="bg-surface border-t border-foreground/10 scroll-mt-[72px]">
      <div className="mx-auto max-w-7xl px-4 md:px-10 py-16 md:py-24 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        {/* Left: pinned heading, combo meter and photo */}
        <div className="lg:sticky lg:top-[110px] self-start">
          <p className="type-pixel text-yellow mb-4">성공 창업 3콤보</p>
          <h2 className="type-heading-pixel text-foreground">
            수익을 극대화하는
            <br />
            <Mark>최적의 운영 시스템!</Mark>
          </h2>

          {/* Desktop: the meter is pinned, so it counts up as you scroll */}
          <div className="hidden lg:block">
            <ComboMeter level={Math.max(1, level)} filled={level} animate />
          </div>
          {/* Mobile: nothing is pinned, so show the full combo up front */}
          <div className="lg:hidden">
            <ComboMeter level={combos.length} filled={combos.length} />
          </div>

          {/* Photo for the active combo (desktop) */}
          <div className="hidden lg:block relative mt-10 aspect-[16/10] overflow-hidden rounded-2xl border border-foreground/10">
            {combos.map((c, i) => (
              <Image
                key={c.img}
                src={`${IMG}/${c.img}`}
                alt=""
                fill
                sizes="40vw"
                className="object-cover transition-all duration-700"
                style={{ opacity: i === active ? 1 : 0, transform: i === active ? "scale(1)" : "scale(1.06)" }}
              />
            ))}
          </div>
        </div>

        {/* Right: the three combos */}
        <ol className="border-t border-foreground/15">
          {combos.map((c, i) => {
            const on = i === active;
            return (
              <li
                key={c.title}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                data-index={i}
                className="relative border-b border-foreground/15 py-12 lg:py-0 lg:min-h-[62vh] lg:flex lg:flex-col lg:justify-center transition-opacity duration-500"
                style={{ opacity: on ? 1 : 0.3 }}
              >
                {/* Active marker on the divider */}
                <span
                  aria-hidden
                  className="absolute left-0 -top-px h-[3px] transition-all duration-700"
                  style={{ width: on ? "100%" : "0%", background: c.color }}
                />

                <p className="type-pixel mb-4" style={{ color: c.color }}>
                  COMBO {i + 1}
                </p>
                <h3 className="text-2xl md:text-[32px] font-extrabold tracking-[-0.03em] text-foreground mb-3">{c.title}</h3>
                <p className="text-base md:text-lg font-medium text-foreground/65 mb-8 max-w-md">{c.desc}</p>

                <p className="flex items-baseline gap-2 whitespace-nowrap">
                  <span className="font-sans text-[44px] sm:text-[56px] md:text-[80px] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-foreground">
                    <CountUp values={c.stat.values} sep={c.stat.sep} run={seen[i]} />
                  </span>
                  <span className="text-2xl md:text-4xl font-extrabold" style={{ color: c.color }}>
                    {c.stat.unit}
                  </span>
                </p>
                <p className="text-sm md:text-base font-semibold text-foreground/50 mt-3 mb-6">{c.stat.caption}</p>

                <ul className="flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <li key={t} className="rounded-full border border-foreground/20 px-3.5 py-1.5 text-sm font-semibold text-foreground/80">
                      {t}
                    </li>
                  ))}
                </ul>

                {/* Photo inline on mobile */}
                <div className="lg:hidden relative mt-8 aspect-[16/10] overflow-hidden rounded-2xl">
                  <Image src={`${IMG}/${c.img}`} alt="" fill sizes="100vw" className="object-cover" />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
