import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_NAME } from "@/lib/site";

export const primaryButton =
  "flex h-14 w-full items-center justify-center rounded-2xl bg-cream text-[17px] font-semibold text-night transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-night focus-visible:outline-none active:opacity-80";

export const secondaryButton =
  "flex h-14 w-full items-center justify-center rounded-2xl border-[1.5px] border-plum text-[17px] font-medium text-cream transition-colors hover:bg-plum/20 focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:outline-none";

/**
 * 404·에러처럼 갈 곳을 잃은 화면의 공통 틀. 에러 경계(클라이언트)에서도 쓰므로 서버 전용 API를 쓰지 않는다.
 * actions에는 버튼을 넣는다 — 기본으로 홈 이동 버튼이 맨 위에 붙는다.
 */
export function StatusPage({
  label,
  title,
  description,
  actions,
}: {
  label: string;
  title: ReactNode;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden px-6 pt-6 pb-8 tablet:px-12">
      {/* 글래스가 보이도록 카드 뒤에 plum 행성 — 글씨 뒤에는 cream을 두지 않는다 */}
      <div
        aria-hidden
        className="absolute top-1/3 -right-24 -z-10 size-64 rounded-full bg-plum tablet:size-96 desktop:right-[18%]"
      />
      <div
        aria-hidden
        className="absolute bottom-16 -left-20 -z-10 size-48 rounded-full bg-plum/60 tablet:size-64"
      />

      <header className="mx-auto flex h-11 w-full max-w-300 items-center tablet:h-12">
        <Link href="/" className="font-display text-xl tablet:text-2xl">
          {SITE_NAME}
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center py-10">
        <section className="flex w-full max-w-110 flex-col gap-3 rounded-[28px] px-6 py-9 text-center glass tablet:px-10 tablet:py-12">
          <p className="text-[13px] font-semibold text-cream/80 tablet:text-sm">
            {label}
          </p>
          <h1 className="font-display text-[26px] leading-[1.4] break-keep tablet:text-[32px]">
            {title}
          </h1>
          <p className="text-[15px] leading-relaxed break-keep text-cream/80">
            {description}
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <Link href="/" className={primaryButton}>
              내 운세 보기
            </Link>
            {actions}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
