import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { Gowun_Dodum } from "next/font/google";
import localFont from "next/font/local";
import { GA_ID, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
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

// 검색엔진 소유 확인 — 값이 있을 때만 meta 태그 출력
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION || undefined;
const naverVerification = process.env.NAVER_SITE_VERIFICATION || undefined;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  verification: {
    google: googleVerification,
    other: naverVerification
      ? { "naver-site-verification": naverVerification }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#290044",
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
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
