import Link from "next/link";
import { GUIDES, guidePath, type GuideSlug } from "@/lib/guides";
import { MENU_NAME } from "@/lib/site";

const primaryButtonClass =
  "flex h-14 items-center justify-center rounded-2xl bg-cream px-6 text-[17px] font-semibold text-night transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-night focus-visible:outline-none active:opacity-80";

/** 가이드 카드 목록. current를 주면 그 글은 빼고 보여 준다. */
export function GuideList({ current }: { current?: GuideSlug }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {GUIDES.filter((g) => g.slug !== current).map((g) => (
        <li key={g.slug}>
          <Link
            href={guidePath(g.slug)}
            className="flex h-full min-h-11 flex-col gap-1.5 rounded-[20px] p-5 glass-sm transition-colors hover:border-cream/40 focus-visible:ring-2 focus-visible:ring-cream/40 focus-visible:outline-none"
          >
            <span className="font-display text-lg text-cream">{g.title}</span>
            <span className="text-sm leading-6 text-cream/75">
              {g.description}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** 가이드 글 하단: 운세 보러 가기 + 다른 가이드 */
export function GuideFooterNav({ current }: { current: GuideSlug }) {
  return (
    <div className="mt-10 flex flex-col gap-8">
      <Link href="/" className={primaryButtonClass}>
        {MENU_NAME} 보러 가기
      </Link>
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl">다른 가이드도 읽어 보세요</h2>
        <GuideList current={current} />
      </section>
    </div>
  );
}
