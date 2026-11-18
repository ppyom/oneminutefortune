"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

/** 공유 랜딩 → 홈 CTA. 공유 링크가 새 방문자를 얼마나 데려오는지 재려고 클릭을 기록한다. */
export function LandingCtaLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href="/"
      onClick={() => track("landing_cta_click")}
      className={className}
    >
      {children}
    </Link>
  );
}
