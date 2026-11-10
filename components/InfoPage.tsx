import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_NAME } from "@/lib/site";

/** 소개·방침·가이드 같은 텍스트 페이지 공통 틀. after는 글래스 카드 아래에 붙는다. */
export function InfoPage({
  title,
  lead,
  children,
  after,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
  after?: ReactNode;
}) {
  return (
    <div className="relative isolate flex flex-1 flex-col overflow-hidden">
      {/* 글래스가 보이도록 카드 뒤에 plum 행성 — 글씨 뒤에는 cream을 두지 않는다 */}
      <div
        aria-hidden
        className="absolute -top-24 -right-28 -z-10 size-72 rounded-full bg-plum/70 md:size-96"
      />
      <div
        aria-hidden
        className="absolute bottom-24 -left-20 -z-10 size-44 rounded-full bg-plum/50"
      />

      <header className="mx-auto flex w-full max-w-3xl items-center px-4 pt-4 md:px-8">
        <Link
          href="/"
          className="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 font-display text-lg"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {SITE_NAME}
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6 pb-10 md:px-8 md:pt-10">
        <h1 className="font-display text-3xl md:text-4xl">{title}</h1>
        {lead && (
          <p className="mt-3 text-base leading-relaxed text-cream/80">{lead}</p>
        )}
        <div className="mt-8 rounded-3xl p-6 glass md:p-10">
          <div className="space-y-8 text-[15px] leading-7 text-cream/88">
            {children}
          </div>
        </div>
        {after}
      </main>

      <SiteFooter className="px-4 pb-6" />
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 font-display text-xl text-cream">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
