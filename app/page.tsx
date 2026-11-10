import { BirthForm } from "@/components/BirthForm";
import { HomeGuide } from "@/components/HomeGuide";
import { MainBackdrop } from "@/components/MainBackdrop";
import { SiteFooter } from "@/components/SiteFooter";
import { TodayLabel } from "@/components/TodayLabel";
import { SITE_NAME } from "@/lib/site";

/*
 * 입력 화면 — design/Main(390) · TabletMain(834) · DesktopMain(1440)
 *  모바일: 카피 위, 입력 카드는 화면 아래
 *  태블릿: 초승달 아래로 카피·카드를 가운데 정렬
 *  데스크톱: 왼쪽 카피 / 오른쪽 글래스 카드 2단
 * 첫 화면 아래에는 소개·등급·FAQ·가이드 콘텐츠를 둔다 (입력 폼만 있으면 광고 심사에서 콘텐츠 없는 화면으로 본다)
 */
export default function Home() {
  return (
    <>
      <div className="relative isolate flex min-h-dvh flex-col overflow-hidden px-6 pt-6 pb-4 tablet:items-center tablet:px-12 tablet:pt-8 tablet:pb-6 desktop:items-stretch desktop:px-30 desktop:pb-12">
        <MainBackdrop />

        <header className="flex h-11 w-full items-center justify-between tablet:h-12 desktop:mx-auto desktop:h-14 desktop:max-w-300">
          <span className="font-display text-xl tracking-[-0.02em] tablet:text-2xl tablet:tracking-normal desktop:text-[26px]">
            {SITE_NAME}
          </span>
          <TodayLabel className="text-[13px] text-cream/75 tablet:text-[15px] tablet:text-cream/80 desktop:text-base" />
        </header>

        <main className="flex flex-1 flex-col tablet:items-center desktop:mx-auto desktop:w-full desktop:max-w-300 desktop:flex-row desktop:gap-24">
          <section className="mt-16 flex flex-col gap-3.5 tablet:mt-75 tablet:items-center tablet:gap-4 tablet:text-center desktop:mt-0 desktop:min-w-0 desktop:flex-1 desktop:items-start desktop:gap-5.5 desktop:text-left">
            <p className="text-sm font-medium tracking-[0.08em] text-cream/80 tablet:text-[15px] tablet:tracking-[0.1em] tablet:text-cream/85 desktop:text-base desktop:tracking-[0.12em]">
              TODAY’S FORTUNE
            </p>
            <h1 className="font-display text-[34px] leading-[1.32] tracking-[-0.03em] break-keep tablet:text-5xl tablet:leading-[1.3] desktop:text-[clamp(48px,4.45vw,64px)] desktop:leading-[1.25]">
              오늘, 당신의 별은
              <br />
              어디쯤 떠 있을까요
            </h1>
            <p className="text-[15px] leading-[1.6] text-cream/80 tablet:text-lg tablet:text-cream/82 desktop:text-xl desktop:leading-[1.65]">
              생년월일만 알려주면
              <br className="tablet:hidden desktop:inline" /> 매일 자정, 새로운
              운세가 도착해요.
            </p>
          </section>

          {/* 모바일: 카드를 화면 아래로 민다 */}
          <div aria-hidden className="min-h-6 flex-1 tablet:hidden" />

          <div className="w-full tablet:mt-14 tablet:w-130 desktop:mt-0 desktop:w-115 desktop:shrink-0">
            <BirthForm />
          </div>
        </main>
      </div>

      <HomeGuide />
      <SiteFooter className="px-4 pb-6" />
    </>
  );
}
