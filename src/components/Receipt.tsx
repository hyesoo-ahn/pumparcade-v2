import Image from "next/image";

// Thermal paper + ink
const PAPER = "#f7f3ea";
const INK = "#2a2730";

// Zig-zag torn edge on top and bottom
const TORN_EDGE =
  "conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / 14px 51% repeat-x, " +
  "conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top / 14px 51% repeat-x";

// Sample play record (not a real customer)
const record: [string, string][] = [
  ["DATE", "26.11.11 18:42"],
  ["플레이어", "PUMPY"],
  ["게임모드", "협동모드"],
  ["맵", "펌프아케이드 운동회"],
  ["방", "RED"],
];

const result: [string, string][] = [
  ["점수", "10,742"],
  ["최종 스테이지", "30"],
  ["11월 펌프아케이드 랭킹", "2위"],
  ["펌프아케이드 상위", "2.0%"],
];

function Divider({ char = "-" }: { char?: string }) {
  return (
    <p aria-hidden className="overflow-hidden whitespace-nowrap opacity-60 my-2 select-none">
      {char.repeat(60)}
    </p>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="shrink-0">{label}</span>
      <span aria-hidden className="flex-1 border-b border-dotted translate-y-[-3px]" style={{ borderColor: `${INK}55` }} />
      <span className="shrink-0">{value}</span>
    </div>
  );
}

// Decorative QR: three finder squares + a fixed pseudo-random module pattern
function FakeQR() {
  const N = 25;
  const finder = (x: number, y: number) => {
    const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
    for (const [ox, oy] of [[0, 0], [N - 7, 0], [0, N - 7]]) {
      if (inBox(ox, oy)) {
        const dx = x - ox;
        const dy = y - oy;
        const ring = dx === 0 || dx === 6 || dy === 0 || dy === 6;
        const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        return ring || core ? 1 : 0;
      }
      // quiet strip around finders
      if (x >= ox - 1 && x <= ox + 7 && y >= oy - 1 && y <= oy + 7) return 0;
    }
    return null;
  };
  const cells: [number, number][] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const f = finder(x, y);
      const on = f ?? ((x * 73 + y * 151 + x * y * 7) % 11) % 2;
      if (on) cells.push([x, y]);
    }
  }
  return (
    <svg aria-hidden viewBox={`-1 -1 ${N + 2} ${N + 2}`} shapeRendering="crispEdges" className="w-full h-auto">
      <rect x="-1" y="-1" width={N + 2} height={N + 2} fill={PAPER} />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={INK} />
      ))}
    </svg>
  );
}

function Barcode() {
  const bars = Array.from({ length: 46 }, (_, i) => 1 + ((i * 37 + 11) % 4));
  let x = 0;
  return (
    <svg aria-hidden viewBox="0 0 200 40" preserveAspectRatio="none" shapeRendering="crispEdges" className="w-full h-10">
      {bars.map((w, i) => {
        const rect = i % 2 === 0 ? <rect key={i} x={x} y="0" width={w * 1.1} height="40" fill={INK} /> : null;
        x += w * 1.1 + 0.4;
        return rect;
      })}
    </svg>
  );
}

export default function Receipt() {
  return (
    // drop-shadow lives on a wrapper because the mask would clip a box-shadow
    <div className="relative -rotate-2 hover:rotate-0 transition-transform duration-500 drop-shadow-[0_24px_40px_rgba(0,0,0,0.55)]">
      <figure
        className="relative w-[300px] md:w-[340px] px-6 pt-8 pb-9"
        style={{
          background: `${PAPER} linear-gradient(180deg, #0000 0%, #00000008 100%)`,
          color: INK,
          fontFamily: '"GalmuriMono11", "Galmuri11", monospace',
          fontSize: 12,
          lineHeight: 1.7,
          mask: TORN_EDGE,
          WebkitMask: TORN_EDGE,
        }}
        aria-label="펌프아케이드 플레이 기록 영수증 예시"
      >
        {/* Header */}
        <div className="text-center">
          <Image
            src="/images/logo.png"
            alt="PUMP ARCADE"
            width={2040}
            height={305}
            className="mx-auto h-7 w-auto"
            style={{ filter: "grayscale(1) contrast(1.6) brightness(0.55)" }}
          />
          <p className="mt-2">- 홍대본점 -</p>
          <p className="opacity-60">PLAY RECORD #0042</p>
        </div>

        <Divider char="=" />

        {/* Printed snapshot */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src="/images/main_hero.png"
            alt=""
            fill
            sizes="340px"
            className="object-cover object-[70%_center]"
            style={{ filter: "grayscale(1) contrast(1.5) brightness(1.15)", mixBlendMode: "multiply" }}
          />
          {/* Thermal dot texture */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(${PAPER} 0.6px, transparent 0.7px)`,
              backgroundSize: "3px 3px",
              opacity: 0.55,
            }}
          />
        </div>

        <Divider />

        <div>
          {record.map(([k, v]) => (
            <Row key={k} label={k} value={v} />
          ))}
        </div>

        <Divider />

        <div>
          {result.map(([k, v]) => (
            <Row key={k} label={k} value={v} />
          ))}
        </div>

        <Divider char="=" />

        {/* QR */}
        <div className="flex items-center gap-4">
          <div className="w-24 shrink-0">
            <FakeQR />
          </div>
          <div>
            <p>▶ 동영상 다운로드</p>
            <p className="opacity-70">4K · FHD · 세로본</p>
            <p className="opacity-70">기록 · 랭킹 확인</p>
          </div>
        </div>

        <p className="text-center mt-4">- 24시간 내에 다운로드 해주세요. -</p>

        <div className="mt-4">
          <Barcode />
          <p className="text-center tracking-[0.3em] mt-1">THANK YOU FOR PLAYING</p>
        </div>

        {/* Sample stamp */}
        <span
          aria-hidden
          className="absolute right-4 top-[170px] md:top-[185px] rotate-[14deg] border-2 px-2 py-0.5 type-pixel opacity-80"
          style={{ color: "#e01d43", borderColor: "#e01d43" }}
        >
          SAMPLE
        </span>
      </figure>
    </div>
  );
}
