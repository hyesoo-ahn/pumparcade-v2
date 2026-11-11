import Receipt from "./Receipt";

// Copy from pumparcade.com
const perks = [
  { lead: "전 플레이 자동 촬영", rest: "4K/FHD 고화질 타임랩스", color: "#3aa0ff" },
  { lead: "100% 무상 제공", rest: "추가 비용 없이 전 지점 기본 혜택", color: "#65ff1e" },
  { lead: "플레이 직후 즉시 전송", rest: "QR·링크로 바로 다운로드", color: "#fee500" },
  { lead: "SNS 최적화 세로본", rest: "인스타 릴스·틱톡·쇼츠용 함께 제공", color: "#e01d43" },
  { lead: "공유가 곧 홍보", rest: "고객 영상이 매장 광고로", color: "#3aa0ff" },
];

export default function FreeCapture() {
  return (
    <section id="capture" className="bg-surface border-t border-foreground/10 scroll-mt-[72px] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-10 py-16 md:py-24 grid gap-14 lg:grid-cols-[1.15fr_1fr] items-center">
        <div>
          <p data-reveal className="type-pixel text-green mb-5">
            FREE 4K CAPTURE · 고화질 영상 무상 제공
          </p>

          <h2 data-reveal="mask" className="type-heading-pixel text-foreground mb-6">
            <span>
              당신의 플레이를
              <br />
              <span className="whitespace-nowrap">
                <span className="text-green">4K 고화질 영상</span>으로,
              </span>{" "}
              <br className="hidden md:block" />
              무료로 드립니다
            </span>
          </h2>

          <p data-reveal className="type-body-lg text-foreground/70 mb-10 max-w-xl">
            모든 플레이가 자동 촬영됩니다. 끝나면 바로 받아, 친구에게 자랑하고 SNS에 공유하세요.
          </p>

          <ul className="flex flex-col gap-4">
            {perks.map((perk, i) => (
              <li
                key={perk.lead}
                data-reveal
                style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
                className="flex items-start gap-4"
              >
                <span aria-hidden className="mt-1.5 w-4 h-4 shrink-0" style={{ background: perk.color }} />
                <p>
                  <span className="type-pixel text-foreground">{perk.lead}</span>
                  <span className="type-body text-foreground/60"> — {perk.rest}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal className="flex flex-col items-center">
          <Receipt />
          <p className="type-pixel text-foreground/60 mt-8 text-center">
            플레이 후 QR로 영상·기록·랭킹을 바로 받아보세요
          </p>
        </div>
      </div>
    </section>
  );
}
