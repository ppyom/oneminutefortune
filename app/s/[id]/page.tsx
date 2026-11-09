import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { ShareBackdrop } from "@/components/share/ShareBackdrop";
import { SiteFooter } from "@/components/SiteFooter";
import { formatKoreanDate } from "@/lib/birth";
import { todayKst } from "@/lib/fortune/date";
import { getFortune } from "@/lib/fortune/getFortune";
import { FIELDS, type Field, type Fortune } from "@/lib/fortune/types";
import {
  NAME_PARAM,
  ogResultPath,
  parseShareName,
  parseShareTarget,
  senderLabel,
  sharePath,
} from "@/lib/share";
import { SITE_NAME } from "@/lib/site";

/*
 * 공유 랜딩 /s/{생년월일}-{날짜}[?n=이름]
 * — design/Share(390) · TabletShare(834) · DesktopShare(1440)
 * 링크에 날짜가 있어 지난 링크도 그날의 결과를 보여 준다. 미래 날짜는 404.
 */

type Props = PageProps<"/s/[id]">;

async function resolve({ params, searchParams }: Props) {
  const { id } = await params;
  const name = parseShareName((await searchParams)[NAME_PARAM]);
  await connection(); // 오늘(KST) 기준 검증 → 요청 시점에 계산
  const target = parseShareTarget(id, todayKst());
  if (!target) return null;
  return { ...target, name, fortune: getFortune(target.birth, target.date) };
}

const shortDate = (ymd: string) =>
  formatKoreanDate(ymd).replace(/ \S+요일$/, "");

export async function generateMetadata(props: Props): Promise<Metadata> {
  const data = await resolve(props);
  // 메타데이터 단계에서 걸러야 본문 스트리밍 전에 404 상태 코드가 나간다
  if (!data) notFound();
  const { birth, date, name, fortune } = data;
  const title = name
    ? `${name}님의 ${shortDate(date)} 운세`
    : `${shortDate(date)}의 운세`;
  const description = `${fortune.total.score}점 · ${fortune.total.summary}`;
  const image = {
    url: ogResultPath(birth, date, name),
    width: 1200,
    height: 630,
    alt: `${title} — ${description}`,
  };
  return {
    title,
    description,
    // 개인 결과라 색인하지 않는다. 미리보기 봇은 이 페이지와 OG 이미지를 읽을 수 있어야 한다
    robots: { index: false, follow: true },
    alternates: { canonical: sharePath(birth, date, name) },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: sharePath(birth, date, name),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export default function SharePage(props: Props) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden px-6 pt-6 pb-8 tablet:items-center tablet:px-12 tablet:pt-8 tablet:pb-14 desktop:items-stretch desktop:px-30 desktop:pb-12">
      <ShareBackdrop />
      <header className="flex h-11 w-full items-center tablet:h-12 desktop:mx-auto desktop:h-14 desktop:max-w-300">
        <Link
          href="/"
          className="font-display text-xl tablet:text-2xl desktop:text-[26px]"
        >
          {SITE_NAME}
        </Link>
      </header>
      {/* params·searchParams는 요청마다 달라 Suspense 안에서 읽는다 (cacheComponents) */}
      <Suspense fallback={<div className="flex-1" />}>
        <ShareContent {...props} />
      </Suspense>
    </div>
  );
}

async function ShareContent(props: Props) {
  const data = await resolve(props);
  if (!data) notFound();
  const { date, name, fortune } = data;

  return (
    <>
      <main className="mt-7 flex flex-1 flex-col gap-7 tablet:mt-10 tablet:w-140 tablet:items-center tablet:gap-10 desktop:mx-auto desktop:mt-0 desktop:w-full desktop:max-w-300 desktop:flex-row desktop:gap-24">
        <div className="flex flex-col gap-2 tablet:mt-10 tablet:items-center tablet:gap-3 tablet:text-center desktop:mt-0 desktop:min-w-0 desktop:flex-1 desktop:items-start desktop:gap-5.5 desktop:text-left">
          <p className="text-sm text-cream/80 tablet:text-[17px] tablet:text-cream/82 desktop:text-[19px]">
            {senderLabel(name)}
            {name ? "이" : "가"} 오늘의 운세를 보냈어요
          </p>
          <h1 className="font-display text-[28px] leading-[1.35] tracking-[-0.02em] break-keep tablet:text-[42px] desktop:text-[clamp(44px,4vw,58px)] desktop:leading-[1.3] desktop:tracking-[-0.03em]">
            친구의 오늘은
            <br />
            이렇게 반짝이고 있어요
          </h1>
          <div className="mt-4 hidden w-95 desktop:block">
            <Cta />
          </div>
        </div>

        <ShareCard date={date} fortune={fortune} />

        <div className="mt-auto w-full desktop:hidden">
          <Cta />
        </div>
      </main>
      <SiteFooter className="mt-2 w-full tablet:mt-4 desktop:absolute desktop:inset-x-0 desktop:bottom-1 desktop:mt-0" />
    </>
  );
}

function Cta() {
  return (
    <div className="flex flex-col gap-3 tablet:gap-3.5 desktop:gap-3">
      <Link
        href="/"
        className="flex h-14 items-center justify-center rounded-2xl bg-cream text-[17px] font-semibold text-night transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-night focus-visible:outline-none active:opacity-80 tablet:h-15 tablet:rounded-[18px] tablet:text-lg"
      >
        나도 오늘 운세 보기
      </Link>
      <p className="text-center text-xs text-cream/70 tablet:text-[13px] tablet:text-cream/72">
        로그인 없이 생년월일만 있으면 돼요
      </p>
    </div>
  );
}

const SHORT_FIELD: Record<Field, string> = {
  love: "애정",
  money: "금전",
  work: "일",
  health: "건강",
};

function ShareCard({ date, fortune }: { date: string; fortune: Fortune }) {
  return (
    <section
      aria-label={`${shortDate(date)} 총운`}
      className="flex w-full flex-col gap-4.5 rounded-[28px] px-6 py-7 glass tablet:gap-5 tablet:p-9 desktop:w-120 desktop:shrink-0 desktop:px-9 desktop:py-10"
    >
      <span className="text-[13px] font-semibold tablet:text-[15px]">
        {shortDate(date)} 총운
      </span>
      <p className="flex items-baseline gap-1.5 tablet:gap-2">
        <span className="font-display text-[72px] leading-none tracking-[-0.04em] tablet:text-8xl desktop:text-[104px]">
          {fortune.total.score}
        </span>
        <span className="text-base text-cream/85 tablet:text-xl">/ 100</span>
      </p>
      <p className="font-display text-[19px] leading-[1.45] text-balance break-keep tablet:text-[26px] tablet:leading-[1.4]">
        {fortune.total.summary}
      </p>
      <dl className="grid grid-cols-4 gap-2 rounded-2xl border border-cream/14 bg-night/40 px-2 py-3.5 tablet:rounded-[18px] tablet:py-4.5">
        {FIELDS.map((key) => (
          <div
            key={key}
            className="flex flex-col items-center gap-1 tablet:gap-1.5"
          >
            <dt className="text-xs text-cream/80 tablet:text-sm tablet:text-cream/82">
              {SHORT_FIELD[key]}
            </dt>
            <dd
              aria-label={`5점 만점에 ${fortune.fields[key].stars}점`}
              className="text-base font-semibold tablet:text-xl"
            >
              {fortune.fields[key].stars}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
