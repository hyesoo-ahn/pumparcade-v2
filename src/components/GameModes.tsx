"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

const PALETTE = {
  blue: "#3aa0ff",
  red: "#e01d43",
  green: "#65ff1e",
  yellow: "#fee500",
};

type ModeColor = keyof typeof PALETTE;

type GameMode = {
  title: string;
  tag: string;
  badge: string;
  summary: string;
  color: ModeColor;
  comingSoon?: boolean;
  detail: {
    lead: string;
    points: string[];
    quote?: { text: string; source: string };
    link?: { label: string; href: string };
  };
};

// Content from pumparcade.com
const gameModes: GameMode[] = [
  {
    title: "협동 모드",
    tag: "CO-OP",
    badge: "국내 최초 벽면발판",
    summary: "여럿이 힘을 합쳐 미션 클리어! 함께라 더 짜릿한 플레이.",
    color: "green",
    detail: {
      lead: "바닥 발판은 물론 국내 최초 벽면발판까지. 파란색은 밟고 빨간색은 피하면서, 친구·가족·연인과 함께 미션을 클리어하세요.",
      points: ["파란 발판은 밟기", "빨간 발판은 피하기", "벽면 발판 터치로 미션 클리어", "가족·친구·연인·아이 누구나"],
      quote: {
        text: "협동모드 덕분에 시간이 정말 빠르게 지나가요. 뛰어다니며 에너지를 쏟다 보니 땀이 쏟아지는데 그만큼 재밌어요.",
        source: "방문 고객 · 트립닷컴",
      },
    },
  },
  {
    title: "라이벌매치",
    tag: "RIVAL MATCH",
    badge: "세계 최초 VAR",
    summary: "먼저 클리어한 사람이 승리! VAR 판독까지 되는 실시간 대결.",
    color: "red",
    detail: {
      lead: "승부가 애매할 땐 VAR로 다시 본다. 발판게임 최초로 판독 시스템을 도입해, 진짜 스포츠처럼 즐기는 대결의 재미를 완성했어요.",
      points: ["실시간 라이벌매치", "VAR 리플레이 판독", "랭킹·기록 저장"],
      link: { label: "실시간 랭킹 보기", href: "https://rank.pumparcade.com/" },
    },
  },
  {
    title: "스피드매치",
    tag: "SPEED MATCH",
    badge: "COMING SOON",
    summary: "반응속도로 겨루는 초고속 매치. 곧 만나요!",
    color: "blue",
    comingSoon: true,
    detail: {
      lead: "반응속도로 겨루는 초고속 매치를 준비하고 있어요. 신작 게임은 전 지점에 무료로 업데이트됩니다.",
      points: ["반응속도 대결", "전 지점 무료 업데이트 예정"],
    },
  },
  {
    title: "아케이드 모드",
    tag: "ARCADE",
    badge: "COMING SOON",
    summary: "어디에도 없는 새로운 펌프아케이드. 곧 만나요!",
    color: "yellow",
    comingSoon: true,
    detail: {
      lead: "어디에도 없는 새로운 펌프아케이드를 준비하고 있어요. 신작 게임은 전 지점에 무료로 업데이트됩니다.",
      points: ["완전히 새로운 게임 방식", "전 지점 무료 업데이트 예정"],
    },
  },
];

// Every mode shares these perks
const perks = ["모든 플레이 4K 자동 촬영 · 무료 제공", "플레이 직후 QR로 영상·기록·랭킹 받기"];

// Simple LED floor grid laid over a card when it's pressed
const COLS = 8;
const ROWS = 4;

type Burst = { id: number; mode: number; col: number; row: number };

export default function GameModes() {
  const [active, setActive] = useState<number | null>(null);
  const [burst, setBurst] = useState<Burst | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Bring the panel into view once the burst has played (matters on mobile, where it sits below all cards)
  useEffect(() => {
    if (!burst) return;
    const t = setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 450);
    return () => clearTimeout(t);
  }, [burst]);

  function handleClick(index: number, e: MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    // Keyboard clicks report (0,0); start those from the center
    const x = e.clientX ? (e.clientX - rect.left) / rect.width : 0.5;
    const y = e.clientY ? (e.clientY - rect.top) / rect.height : 0.5;
    setActive(index);
    setBurst({
      id: (burst?.id ?? 0) + 1,
      mode: index,
      col: Math.min(COLS - 1, Math.floor(x * COLS)),
      row: Math.min(ROWS - 1, Math.floor(y * ROWS)),
    });
  }

  const current = active !== null ? gameModes[active] : null;
  const currentColor = current ? PALETTE[current.color] : PALETTE.green;

  return (
    <section id="modes" className="bg-background border-t border-foreground/10 scroll-mt-[72px]">
      <div className="mx-auto max-w-7xl px-4 md:px-10 py-16 md:py-24">
        <h2 className="type-heading-pixel text-foreground mb-3">게임 모드</h2>
        <p className="type-body text-foreground/60 mb-10">모드를 눌러 자세히 알아보세요.</p>

        <div className="grid md:grid-cols-2 gap-px bg-foreground/15 border border-foreground/15">
          {gameModes.map((mode, i) => {
            const color = PALETTE[mode.color];
            const isActive = active === i;
            const isBursting = burst?.mode === i;
            return (
              <button
                // New key per burst restarts the animations on repeat clicks
                key={burst && isBursting ? `${mode.tag}-${burst.id}` : mode.tag}
                type="button"
                aria-pressed={isActive}
                aria-controls="mode-detail"
                onClick={(e) => handleClick(i, e)}
                className="relative overflow-hidden bg-background text-left p-6 md:p-8 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-green"
                style={{
                  boxShadow: isActive ? `inset 0 0 0 2px ${color}, inset 0 0 60px ${color}33` : undefined,
                }}
              >
                {/* LED tiles light up in a wave from the click point */}
                {isBursting && burst && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 grid gap-1 p-1"
                    style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
                  >
                    {Array.from({ length: COLS * ROWS }, (_, t) => {
                      const c = t % COLS;
                      const r = Math.floor(t / COLS);
                      const dist = Math.hypot(c - burst.col, (r - burst.row) * 1.6);
                      return (
                        <span
                          key={t}
                          className="led-tile"
                          style={{
                            background: `${color}40`,
                            animationDelay: `${Math.round(dist * 45)}ms`,
                          }}
                        />
                      );
                    })}
                  </div>
                )}

                {isBursting && (
                  <span
                    aria-hidden
                    className="go-pop pointer-events-none absolute left-1/2 top-1/2 z-20 type-heading-pixel text-foreground whitespace-nowrap"
                    style={{ textShadow: `4px 4px 0 ${color}, -2px -2px 0 #14101f` }}
                  >
                    {mode.comingSoon ? "SOON!" : "GO!"}
                  </span>
                )}

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="type-pixel-sm" style={{ color }}>
                      {isActive ? "▶ " : ""}
                      {mode.tag}
                    </span>
                    <span
                      className="type-pixel-sm px-2 py-0.5 border"
                      style={{ color, borderColor: `${color}66` }}
                    >
                      {mode.badge}
                    </span>
                  </div>
                  <h3 className="type-pixel text-foreground mb-2">{mode.title}</h3>
                  <p className="type-body text-foreground/60">{mode.summary}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div
          id="mode-detail"
          ref={panelRef}
          aria-live="polite"
          className="scroll-mb-6"
        >
          {current && (
            <div
              key={burst?.id}
              className="panel-in mt-6 border-2 bg-surface p-6 md:p-10 grid gap-8 md:grid-cols-[1.2fr_1fr]"
              style={{ borderColor: currentColor, boxShadow: `0 0 0 4px ${currentColor}22, 0 0 40px ${currentColor}22` }}
            >
              <div>
                <p className="type-pixel-sm mb-3" style={{ color: currentColor }}>
                  {current.tag} · {current.badge}
                </p>
                <h3 className="type-heading-pixel text-foreground mb-5">{current.title}</h3>
                <p className="type-body-lg text-foreground/80 mb-6">{current.detail.lead}</p>

                {current.detail.quote && (
                  <blockquote className="border-l-2 pl-4" style={{ borderColor: currentColor }}>
                    <p className="type-body text-foreground/70 mb-1">“{current.detail.quote.text}”</p>
                    <cite className="type-caption not-italic text-foreground/40">{current.detail.quote.source}</cite>
                  </blockquote>
                )}
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <p className="type-pixel text-foreground/60 mb-4">
                    {current.comingSoon ? "준비 중" : "이렇게 즐겨요"}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {current.detail.points.map((point, n) => (
                      <li key={point} className="flex items-center gap-4 type-pixel text-foreground">
                        <span
                          className="type-pixel w-9 h-9 shrink-0 flex items-center justify-center text-background"
                          style={{ background: currentColor }}
                        >
                          {n + 1}
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <ul className="flex flex-col gap-1.5 border-t border-foreground/10 pt-5">
                  {perks.map((perk) => (
                    <li key={perk} className="type-body text-foreground/60">
                      ✓ {perk}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-3 type-pixel mt-auto">
                  {!current.comingSoon && (
                    <a
                      href="#stores"
                      className="inline-flex items-center px-5 py-3 text-background hover:brightness-110 transition"
                      style={{ background: currentColor }}
                    >
                      플레이하러 가기 →
                    </a>
                  )}
                  {current.detail.link && (
                    <a
                      href={current.detail.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-3 border border-foreground/30 text-foreground hover:border-foreground transition-colors"
                    >
                      {current.detail.link.label} ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
