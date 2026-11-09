import type { Metadata } from "next";
import { Gowun_Dodum } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// 본문: SUITE 가변 폰트 (400–600 사용)
const suite = localFont({
  src: "../public/fonts/SUITE-Variable.woff2",
  weight: "400 600",
  variable: "--font-suite",
  display: "swap",
});

// 제목·로고·점수: Gowun Dodum (400만 존재 — font-bold 금지)
const gowun = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gowun",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "One Minute Fortune",
  description: "생년월일만 넣으면 1분 만에 보는 오늘의 운세",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${suite.variable} ${gowun.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-night font-sans text-cream">
        {children}
      </body>
    </html>
  );
}
