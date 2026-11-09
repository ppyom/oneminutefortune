"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import {
  FieldGrid,
  LuckyGrid,
  TotalCard,
} from "@/components/result/ResultSections";
import { AdSlot } from "@/components/AdSlot";
import { ShareActions } from "@/components/share/ShareActions";
import { SiteFooter } from "@/components/SiteFooter";
import { useTodayKst } from "@/components/TodayLabel";
import { ADSENSE_SLOT_RESULT } from "@/lib/adsense";
import { formatKoreanDate } from "@/lib/birth";
import { getFortune } from "@/lib/fortune/getFortune";
import { getProfile, getServerProfile, subscribeProfile } from "@/lib/storage";
import { SITE_NAME } from "@/lib/site";

const noop = () => () => {};

/** 저장된 생년월일 + 오늘(KST)로 결과를 계산해 보여 준다. 저장값이 없으면 입력 화면으로. */
export function ResultView() {
  const router = useRouter();
  const isClient = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const profile = useSyncExternalStore(
    subscribeProfile,
    getProfile,
    getServerProfile,
  );
  const today = useTodayKst();

  const fortune = useMemo(
    () => (profile && today ? getFortune(profile.birth, today) : null),
    [profile, today],
  );

  useEffect(() => {
    if (isClient && !profile) router.replace("/");
  }, [isClient, profile, router]);

  return (
    <div className="relative mx-auto flex w-full flex-1 flex-col gap-7 tablet:gap-8 desktop:max-w-300 desktop:gap-10">
      <header className="flex h-11 items-center justify-between tablet:h-12 desktop:h-14">
        <Link
          href="/"
          className="font-display text-xl tablet:text-2xl desktop:text-[26px]"
        >
          {SITE_NAME}
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-[13px] underline underline-offset-[3px] tablet:text-[15px] desktop:text-base"
        >
          다시 입력
        </Link>
      </header>

      {fortune && profile ? (
        <>
          {/* (공유 버튼은 화면 크기별로 자리가 달라 세 번 그리고 하나만 보인다) */}
          <div className="flex flex-col gap-1.5 px-1 tablet:gap-2 tablet:px-0">
            <p className="text-[13px] text-cream/75 tablet:text-[15px] tablet:text-cream/80 desktop:text-base">
              {formatKoreanDate(fortune.date, true)}
            </p>
            {/* 오른쪽 위 cream 원과 글자가 겹치지 않게 폭을 제한한다 */}
            <h1 className="max-w-67 font-display text-[26px] tracking-[-0.02em] [overflow-wrap:anywhere] break-keep tablet:max-w-150 tablet:text-4xl desktop:max-w-78 desktop:text-[44px]">
              {profile.name ? `${profile.name}님의 오늘` : "오늘의 운세"}
            </h1>
          </div>

          {/* 모바일·태블릿: 총운 → 분야별 → 행운 / 데스크톱: 왼쪽 총운 · 오른쪽 분야별·행운 */}
          <div className="flex flex-col gap-7 tablet:gap-8 desktop:flex-row desktop:items-start">
            <div className="flex flex-col gap-4 desktop:w-110 desktop:shrink-0">
              <TotalCard total={fortune.total} />
              <div className="hidden desktop:block">
                <ShareActions
                  birth={fortune.birth}
                  date={fortune.date}
                  name={profile.name}
                  layout="stack"
                />
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-7 tablet:gap-8 desktop:gap-9">
              <FieldGrid fields={fortune.fields} />
              <LuckyGrid lucky={fortune.lucky} />
              {/* 모바일: 주요 버튼 + 보조 2개 / 태블릿: 2:1:1 한 줄 */}
              <div className="tablet:hidden">
                <ShareActions
                  birth={fortune.birth}
                  date={fortune.date}
                  name={profile.name}
                  layout="stack"
                />
              </div>
              <div className="hidden tablet:block desktop:hidden">
                <ShareActions
                  birth={fortune.birth}
                  date={fortune.date}
                  name={profile.name}
                  layout="row"
                />
              </div>
              {/* 광고: 모바일·태블릿은 공유 버튼 아래, 데스크톱은 오른쪽 행운 아래 */}
              <AdSlot slot={ADSENSE_SLOT_RESULT} />
            </div>
          </div>

          <div className="mt-auto flex flex-col items-center gap-1.5 pt-2 text-center tablet:pt-0">
            <p className="font-display text-base tablet:text-lg desktop:text-[19px]">
              내일 운세는 자정에 도착해요
            </p>
            <p className="text-xs text-cream/70 tablet:text-[13px] tablet:text-cream/72">
              재미로 보는 운세예요. 중요한 결정은 스스로!
            </p>
            <SiteFooter notice={false} className="mt-1" />
          </div>
        </>
      ) : (
        <ResultSkeleton />
      )}
    </div>
  );
}

/** 저장값을 읽기 전(서버 렌더·하이드레이션) 자리표시 */
function ResultSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="운세를 불러오는 중"
      className="flex flex-col gap-7 tablet:gap-8 desktop:flex-row"
    >
      <div className="h-105 rounded-[28px] glass tablet:h-80 desktop:h-150 desktop:w-110 desktop:shrink-0" />
      <div className="flex flex-1 flex-col gap-7 tablet:gap-8">
        <div className="h-75 rounded-3xl glass-sm" />
        <div className="h-45 rounded-3xl glass" />
      </div>
    </div>
  );
}
