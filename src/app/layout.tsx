import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PUMP ARCADE | 펌프 아케이드",
  description: "빨간색을 피하고 파란색을 밟아라! LED 발판 아케이드 게임",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
