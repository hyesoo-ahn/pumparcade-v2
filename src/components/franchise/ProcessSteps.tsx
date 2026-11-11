import { SectionHeading } from "./ui";

const steps = [
  { title: "창업 상담", desc: "전화 상담 및\n미팅 일정 조율" },
  { title: "상권 분석", desc: "희망 상권\n타당성 검토" },
  { title: "임대차 계약", desc: "적합성 확인" },
  { title: "계약체결", desc: "체결 후 공사일정조율" },
  { title: "실측 및 도면", desc: "현장 실측 및 인테리어\n도면 작업" },
  { title: "인테리어 및\n장비설치", desc: "도면, 현장 기반 공사" },
  { title: "교육 진행 및 오픈", desc: "조작법, 운영 방법 등" },
  { title: "사후 관리", desc: "마케팅, 프로그램 업데이트" },
];

const PAGE_BG = "#0b0a12";
const CARD_BG = "#1e1930";
// Step 1 and step 7 are accented, like the original layout
const ACCENT: Record<number, string> = { 0: "#e01d43", 6: "#7b4dff" };

/*
 * Puzzle layout. Desktop is a snake: row 1 runs 1→4, drops down at 4,
 * row 2 runs 5→8 right to left. Mobile is a single column 1→8.
 * Each card has a chevron "tab" that pokes into the next card, outlined in the page color.
 */
const DESKTOP_ORDER = ["lg:order-1", "lg:order-2", "lg:order-3", "lg:order-4", "lg:order-8", "lg:order-7", "lg:order-6", "lg:order-5"];

type Dir = "right" | "left" | "down";
function desktopTab(i: number): Dir | null {
  if (i < 3) return "right";
  if (i === 3) return "down";
  if (i < 7) return "left";
  return null;
}

// Puzzle tab: a chevron of the card's color that pokes into the next card.
// Only its two outer edges get a page-colored outline, so it reads as a piece slotting in.
const TAB = {
  right: { box: "w-[56px] h-[80px]", pos: "left-full top-1/2 -translate-y-1/2 -translate-x-[16px]", vb: "0 0 56 80",
    fill: "2,2 52,40 2,78", edge: "20,15.7 52,40 20,64.3" },
  left: { box: "w-[56px] h-[80px]", pos: "right-full top-1/2 -translate-y-1/2 translate-x-[16px]", vb: "0 0 56 80",
    fill: "54,2 4,40 54,78", edge: "36,15.7 4,40 36,64.3" },
  down: { box: "w-[80px] h-[56px]", pos: "top-full left-1/2 -translate-x-1/2 -translate-y-[16px]", vb: "0 0 80 56",
    fill: "2,2 40,52 78,2", edge: "15.7,20 40,52 64.3,20" },
};

function Tab({ dir, color, className }: { dir: Dir; color: string; className: string }) {
  const t = TAB[dir];
  return (
    <svg aria-hidden viewBox={t.vb} className={`absolute z-20 overflow-visible ${t.pos} ${t.box} ${className}`}>
      {/* outline first; the fill on top hides its inner half */}
      <polyline points={t.edge} fill="none" stroke={PAGE_BG} strokeWidth="14" strokeLinejoin="round" strokeLinecap="butt" />
      <polygon points={t.fill} fill={color} strokeLinejoin="round" />
    </svg>
  );
}

export default function ProcessSteps() {
  return (
    <section id="process" className="bg-background border-t border-foreground/10 scroll-mt-[72px]">
      <div className="mx-auto max-w-7xl px-4 md:px-10 py-16 md:py-24">
        <SectionHeading eyebrow="PROCESS">
          운영 부담 없이 매장 수익 확보 가능
        </SectionHeading>

        <div className="flex justify-center mt-8 mb-12">
          <span className="font-display rounded-2xl bg-surface border border-foreground/15 px-7 py-3.5 text-xl md:text-2xl font-extrabold text-red">창업 절차</span>
        </div>

        <ol className="grid gap-3 lg:grid-cols-4">
          {steps.map((step, i) => {
            const color = ACCENT[i] ?? CARD_BG;
            const dir = desktopTab(i);
            return (
              <li
                key={step.title}
                data-reveal
                style={{ background: color, "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
                className={`relative flex flex-col items-center justify-center text-center rounded-[28px] px-5 py-10 lg:min-h-[280px] ${DESKTOP_ORDER[i]}`}
              >
                <p className="font-display text-lg md:text-xl font-semibold text-foreground/45 mb-4">Step {i + 1}</p>
                <h3 className="font-display text-2xl md:text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-foreground mb-4 whitespace-pre-line">{step.title}</h3>
                <p className="text-lg md:text-xl font-semibold tracking-[-0.02em] text-foreground/85 whitespace-pre-line leading-snug">{step.desc}</p>

                {/* Mobile: every step points down to the next */}
                {i < steps.length - 1 && <Tab dir="down" color={color} className="lg:hidden" />}
                {/* Desktop: snake path */}
                {dir && <Tab dir={dir} color={color} className="hidden lg:block" />}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
