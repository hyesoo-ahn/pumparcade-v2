import type { ReactNode } from "react";

// Headings use Paperlogy like pumparcade.com; body copy stays Pretendard.
export const H2 = "font-display text-[28px] md:text-[44px] font-black leading-[1.3] tracking-[-0.02em]";

// Highlighter-sweep phrase used in headings (client component)
export { default as Mark } from "./Mark";

type HeadingProps = {
  eyebrow?: string;
  eyebrowColor?: string;
  children: ReactNode;
  align?: "left" | "center";
  className?: string;
  pixel?: boolean;
};

export function SectionHeading({ eyebrow, eyebrowColor = "text-green", children, align = "center", className = "", pixel = true }: HeadingProps) {
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      {eyebrow && (
        <p data-reveal className={`type-pixel ${eyebrowColor} mb-4`}>
          {eyebrow}
        </p>
      )}
      <h2 data-reveal="mask" className={`${pixel ? "type-heading-pixel" : H2} text-foreground`}>
        <span>{children}</span>
      </h2>
    </div>
  );
}

export const PHONE = "1577-0126";
export const KAKAO_URL = "http://pf.kakao.com/_xiIAgG/chat";
