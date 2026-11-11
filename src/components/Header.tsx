import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "게임 소개", href: "/#modes" },
  { label: "매장 찾기", href: "/#stores" },
  { label: "실시간 랭킹", href: "/#ranking" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-foreground/15">
      <div className="mx-auto max-w-7xl px-4 md:px-10 h-16 md:h-[72px] flex items-center justify-between gap-6 type-pixel">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="PUMP ARCADE"
            width={2040}
            height={305}
            priority
            className="h-6 md:h-8 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-foreground">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-green transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        <Link
          href="/franchise"
          className="shrink-0 border border-foreground/25 px-4 md:px-5 py-2 md:py-2.5 text-foreground hover:border-green hover:text-green transition-colors"
        >
          창업 문의 →
        </Link>
      </div>
    </header>
  );
}
