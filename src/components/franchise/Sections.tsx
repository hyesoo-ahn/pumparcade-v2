import Image from "next/image";
import { stepped } from "../PixelTV";
import { Mark, SectionHeading, PHONE } from "./ui";

const IMG = "/images/franchise";

/* ───────── Intro: software pioneer ───────── */
// Copy built only from facts on pumparcade.com (in-house dev, world-first VAR, free updates, 4K capture, ranking, patent)
const pillars: { label: string; title: string; body: string; image?: string; points: { text: string; soon?: boolean }[] }[] = [
  {
    label: "본사 직접 개발",
    title: "게임부터 시스템까지\n본사가 직접 만듭니다",
    body: "펌프아케이드 게임과 매장 운영 소프트웨어는 모두 본사 개발팀 작품이에요. 발판게임 최초의 VAR 판독 시스템도 본사가 직접 개발했어요.",
    points: [
      { text: "세계 최초 VAR 판독" },
      { text: "자체 기술 특허 보유" },
      { text: "4K 영상 자동 촬영·전송" },
      { text: "글로벌 랭킹 플랫폼" },
    ],
  },
  {
    label: "신규 게임 무료 업데이트",
    title: "새 게임은 계속,\n추가 비용 없이",
    body: "직접 개발하니까 신작이 끊기지 않아요. 새 게임이 나오면 전 지점에 무료로 업데이트돼, 점주는 비용 부담 없이 늘 새로운 콘텐츠로 운영합니다.",
    image: `${IMG}/arcade.png`,
    points: [
      { text: "협동 모드" },
      { text: "라이벌매치" },
      { text: "스피드매치 개발 중", soon: true },
      { text: "아케이드 모드 개발 중", soon: true },
    ],
  },
];

export function Intro() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-10 pt-16 md:pt-24 pb-16 md:pb-24">
        <SectionHeading eyebrow="신나는 펌프! 수익은 점프!">
          <Mark>압도적 소프트웨어</Mark> 선구자
        </SectionHeading>

        <div id="intro-cta" className="flex flex-wrap justify-center gap-3 mt-8">
          <a href="#inquiry" className="type-pixel bg-green text-background px-6 py-3.5 hover:brightness-110 transition">
            <span className="sm:hidden">상담 신청 ↓</span>
            <span className="hidden sm:inline">창업 상담 신청하기 ↓</span>
          </a>
          <a href={`tel:${PHONE}`} className="type-pixel border border-foreground/30 text-foreground px-6 py-3.5 hover:border-green hover:text-green transition-colors">
            <span className="font-toss">☎️</span> {PHONE}
          </a>
        </div>

        <p data-reveal className="text-center text-lg md:text-xl font-medium text-foreground/70 mt-5">
          고객에겐 즐거움을, 점주에겐 수익을 주는 <span className="text-foreground font-bold">본사 직접 개발</span>
        </p>

        <div className="grid gap-4 lg:grid-cols-2 mt-12">
          {pillars.map((p, i) => (
            <article
              key={p.label}
              data-reveal
              style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
              className={`relative overflow-hidden rounded-3xl p-7 md:p-10 flex flex-col ${p.image ? "" : "bg-red"}`}
            >
              {p.image && (
                <>
                  <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/60" />
                </>
              )}
              <div className="relative flex flex-col h-full">
                <p className="type-pixel text-foreground/80 mb-6">
                  <span className="inline-flex items-center justify-center w-8 h-8 mr-3 bg-foreground text-background">{i + 1}</span>
                  {p.label}
                </p>
                <h3 className="font-sans text-[32px] md:text-[44px] font-extrabold leading-[1.25] tracking-[-0.03em] text-foreground mb-5 whitespace-pre-line">
                  {p.title}
                </h3>
                <p className="text-base md:text-lg font-medium leading-relaxed text-foreground/85 mb-8 max-w-lg">{p.body}</p>
                <ul className="mt-auto grid sm:grid-cols-2 gap-2">
                  {p.points.map((pt) => (
                    <li
                      key={pt.text}
                      className={`flex items-center gap-2 rounded-xl px-3.5 py-3 text-sm md:text-base font-bold ${p.image ? "bg-foreground/10" : "bg-background/20"} ${pt.soon ? "text-foreground/60" : "text-foreground"}`}
                    >
                      <span aria-hidden className={pt.soon ? "text-yellow" : p.image ? "text-green" : "text-foreground"}>
                        {pt.soon ? "◐" : "✓"}
                      </span>
                      {pt.text}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Benefits (pixel style) ───────── */
const benefits = [
  { icon: "🛠️", title: "무상 A/S 2년 지원", desc: "2년 장기 무상 A/S로\n운영 부담 DOWN", color: "#e01d43" },
  { icon: "🕹️", title: "자체 소프트웨어", desc: "세계최초 VAR·신규 게임\n무료 업데이트", color: "#2b6fff" },
  { icon: "📣", title: "마케팅 지원", desc: "고객 맞춤 이벤트·SNS\n홍보까지 본사 지원", color: "#fa8541" },
  { icon: "🎬", title: "고화질 영상·랭킹", desc: "플레이 영상 무상 제공\n글로벌 랭킹 플랫폼", color: "#3ed300" },
  { icon: "🤝", title: "위탁운영 시스템", desc: "인력관리 OK\n매장관리 OK\n수익정산 OK", color: null },
  { icon: "✨", title: "직영 인테리어팀 시공", desc: "프리미엄 인테리어\n맞춤 시공 지원", color: null },
];

export function Benefits() {
  return (
    <section id="benefits" className="bg-surface border-t border-foreground/10 scroll-mt-[72px]">
      <div className="mx-auto max-w-7xl px-4 md:px-10 py-16 md:py-24">
        <SectionHeading eyebrow="ONLY PUMP ARCADE">
          펌프아케이드에서만 제공하는 특별한 혜택!
        </SectionHeading>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 70}ms`, background: b.color ?? "#1e1930" } as React.CSSProperties}
              className="flex flex-col items-center justify-center text-center px-6 py-12 min-h-[240px]"
            >
              <span aria-hidden className="font-toss text-5xl mb-4">{b.icon}</span>
              <h3 className="type-pixel text-foreground mb-3">{b.title}</h3>
              <p className={`type-body whitespace-pre-line ${b.color ? "text-foreground/90" : "text-foreground/70"}`}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Certifications ───────── */
const certs = [
  { src: "venture-certification.jpeg", alt: "펌프아케이드 벤처기업 확인서", title: "벤처기업 확인", desc: "기술·성장성 공인", color: "#3aa0ff" },
  { src: "patent-certification.png", alt: "펌프아케이드 특허증", title: "특허 등록", desc: "자체 기술 특허 보유", color: "#65ff1e" },
  { src: "iso-certification.png", alt: "펌프아케이드 ISO 9001 품질경영 인증서", title: "ISO 9001", desc: "국제 표준 품질경영 인증", color: "#fee500" },
];

export function Certifications() {
  return (
    <section className="bg-background border-t border-foreground/10">
      <div className="mx-auto max-w-7xl px-4 md:px-10 py-16 md:py-24">
        <SectionHeading eyebrow="CERTIFICATION" eyebrowColor="text-blue">
          믿을 수 있는 공식 인증 보유
        </SectionHeading>
        <div className="grid gap-10 md:gap-8 md:grid-cols-3 mt-12">
          {certs.map((c, i) => (
            <figure
              key={c.src}
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              {/* Pixel frame: stepped corners, colored rim, hard drop shadow */}
              <div className="relative">
                <div aria-hidden className="absolute inset-0 translate-x-2 translate-y-2" style={{ background: c.color, opacity: 0.35, clipPath: stepped(8) }} />
                <div className="relative p-1.5" style={{ background: c.color, clipPath: stepped(8) }}>
                  <div className="p-2 bg-surface" style={{ clipPath: stepped(6) }}>
                    <div className="relative aspect-[1/1.41] bg-white overflow-hidden" style={{ clipPath: stepped(4) }}>
                      <Image src={`${IMG}/${c.src}`} alt={c.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-contain" />
                      <span className="absolute left-2 bottom-2 type-pixel-sm bg-background text-foreground px-2 py-1">개인정보 보호처리</span>
                    </div>
                  </div>
                </div>
              </div>
              <figcaption className="pt-6 px-1">
                <p className="type-pixel-sm mb-2" style={{ color: c.color }}>
                  CERT {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-sans text-xl md:text-2xl font-bold tracking-[-0.02em] text-foreground mb-1">{c.title}</p>
                <p className="text-base font-medium text-foreground/60">{c.desc} (개인정보 보호처리)</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Areas under contract ───────── */
const areas: { name: string; status: string; hot?: boolean }[] = [
  { name: "강남역", status: "초메인 상권", hot: true },
  { name: "시흥시 배곧동", status: "초메인 상권", hot: true },
  { name: "통영시 무전동", status: "건물주 진행중" },
  { name: "혜화역 2번 출구", status: "점주 진행중" },
  { name: "울산 삼산동", status: "점주 진행중" },
  { name: "대구 동성로", status: "점주 진행중" },
  { name: "부천 중동", status: "점주 진행중" },
  { name: "덕양구 화정동", status: "점주 진행중" },
  { name: "광명 철산", status: "점주 진행중" },
  { name: "의정부역", status: "점주 진행중" },
  { name: "광주 경안동", status: "점주 진행중" },
  { name: "부산 해운대", status: "점주 진행중" },
];

export function Areas() {
  return (
    <section className="bg-surface border-t border-foreground/10">
      <div className="mx-auto max-w-7xl px-4 md:px-10 py-16 md:py-24">
        <SectionHeading eyebrow="NOW IN PROGRESS" eyebrowColor="text-red">
          계약 진행중인 상권
        </SectionHeading>
        <ul className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-12">
          {areas.map((a, i) => (
            <li
              key={a.name}
              data-reveal
              style={{ "--reveal-delay": `${i * 40}ms` } as React.CSSProperties}
              className={`flex flex-col gap-1.5 px-5 py-4 border ${a.hot ? "border-red bg-red/10" : "border-foreground/15 bg-background"}`}
            >
              <span className="type-pixel text-foreground">{a.name}</span>
              <span className={`type-pixel-sm ${a.hot ? "text-red" : "text-foreground/50"}`}>
                {a.hot ? <span className="font-toss">🔥 </span> : "● "}
                {a.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────── FAQ ───────── */
const faqs = [
  { q: "발판게임이 뭔가요?", a: "펌프아케이드는 바닥 발판을 밟고 벽면을 터치하며 즐기는 발판게임 액티비티입니다. 지속 개발되는 다양한 게임을 즐길 수 있습니다." },
  { q: "빨간색을 피하는 게임인가요?", a: "네, 지정된 색의 발판만 밟고 빨간색은 피하는 방식 등 순발력을 겨루는 다양한 게임 모드가 있습니다." },
  { q: "어느 지점에서 이용할 수 있나요?", a: "현재 홍대본점, 안산역점, 부평역점, 일산라페스타점, 구파발역점에서 이용하실 수 있으며 지점은 계속 확장 중입니다." },
  { q: "소자본·무인·고수익 창업이 가능한가요?", a: "위탁운영 또는 1인 운영 시스템으로 부담을 줄인 소자본 고수익 창업을 지원합니다. 벤처기업 인증, 특허, ISO 인증을 보유하고 있으며, 자세한 내용은 창업문의로 상담해 주세요." },
];

export function Faq() {
  return (
    <section id="faq" className="bg-background border-t border-foreground/10 scroll-mt-[72px]">
      <div className="mx-auto max-w-3xl px-4 md:px-10 py-16 md:py-24">
        <SectionHeading eyebrow="FAQ">자주 묻는 질문</SectionHeading>
        <div className="mt-12 flex flex-col gap-3">
          {faqs.map((f, i) => (
            <details key={f.q} open={i === 0} className="group rounded-2xl bg-surface border border-foreground/10 px-6">
              <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="type-pixel text-foreground">
                  <span className="text-green mr-2">Q.</span>
                  {f.q}
                </span>
                <span aria-hidden className="text-2xl font-bold text-green group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-base md:text-lg text-foreground/70 leading-relaxed pb-6 pr-8">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
