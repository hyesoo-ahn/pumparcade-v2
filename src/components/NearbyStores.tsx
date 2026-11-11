const stores = [
  { name: "홍대본점", address: "서울 마포구 와우산로21길 20 지하1층" },
  { name: "안산역점", address: "경기 안산시 단원구 고잔1길 37 4층" },
  { name: "부평역점", address: "인천 부평구 시장로 17 2층" },
  { name: "일산라페스타점", address: "경기 고양시 일산동구 고봉로 32-6 5층" },
  { name: "구파발역점", address: "서울 은평구 진관2로 15-46 7층" },
];

function mapUrl(address: string) {
  return `https://map.naver.com/p/search/${encodeURIComponent(address)}`;
}

export default function NearbyStores() {
  return (
    <section id="stores" className="bg-surface border-t border-foreground/10 scroll-mt-[72px]">
      <div className="mx-auto max-w-7xl px-4 md:px-10 pt-16 md:pt-24 pb-10">
        <h2 data-reveal="mask" className="type-heading-pixel text-foreground mb-10">
          <span>가까운 매장에서 플레이</span>
        </h2>

        <ul className="border-t border-foreground/15">
          {stores.map((store, i) => (
            <li
              key={store.name}
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              className="border-b border-foreground/15"
            >
              <a
                href={mapUrl(store.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 py-6"
              >
                <div>
                  <p className="type-pixel text-foreground mb-1">{store.name}</p>
                  <p className="type-pixel text-foreground/50">{store.address}</p>
                </div>
                <span className="shrink-0 type-pixel text-green group-hover:translate-x-1 transition-transform">
                  길찾기 ↗
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div data-reveal className="flex justify-center mt-12">
          <a
            href="#modes"
            aria-label="다음 섹션으로"
            className="w-12 h-12 rounded-full bg-background border border-foreground/20 flex items-center justify-center text-foreground text-xl hover:border-green hover:text-green transition-colors"
          >
            ↓
          </a>
        </div>
      </div>
    </section>
  );
}
