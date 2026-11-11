import Image from "next/image";

export default function Footer() {
  return (
    <footer id="contact" className="bg-surface border-t border-foreground/10">
      <div className="mx-auto max-w-7xl px-4 md:px-10 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Image src="/images/logo.png" alt="PUMP ARCADE" width={2040} height={305} className="h-6 w-auto opacity-70" />
        <p className="type-caption text-foreground/40">&copy; 2026 PUMP ARCADE. All rights reserved.</p>
      </div>
    </footer>
  );
}
