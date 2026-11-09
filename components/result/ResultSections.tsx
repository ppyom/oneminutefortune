import { luckyColorHex } from "@/lib/luckyColors";
import {
  FIELDS,
  GRADE_LABEL,
  type Field,
  type Fortune,
} from "@/lib/fortune/types";

/*
 * 결과 화면 섹션 — design/Result(390) · TabletResult(834) · DesktopResult(1440)
 * 공유 랜딩(/s/[id])에서도 다시 쓸 수 있게 데이터만 받는 순수 컴포넌트로 둔다.
 */

export const FIELD_LABEL: Record<Field, string> = {
  love: "애정",
  money: "금전",
  work: "일·학업",
  health: "건강",
};

const h2Class =
  "px-1 font-display text-xl tablet:px-0 tablet:text-2xl desktop:text-[26px]";

/** 총운: 모바일 세로 / 태블릿 점수·문장 가로 2단 / 데스크톱 세로 */
export function TotalCard({ total }: { total: Fortune["total"] }) {
  return (
    <section
      aria-label="총운"
      className="flex flex-col gap-5 rounded-[28px] px-6 py-7 glass tablet:flex-row tablet:items-center tablet:gap-9 tablet:p-9 desktop:flex-col desktop:items-stretch desktop:gap-5.5 desktop:px-9 desktop:py-10"
    >
      <div className="flex flex-col gap-5 tablet:w-60 tablet:shrink-0 tablet:gap-4 desktop:w-auto desktop:gap-5.5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold tablet:text-sm desktop:text-[15px]">
            총운
          </span>
          <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-night tablet:px-3 tablet:text-[13px]">
            {GRADE_LABEL[total.grade]}
          </span>
        </div>
        <p className="flex items-baseline gap-1.5 desktop:gap-2">
          <span className="font-display text-[88px] leading-none tracking-[-0.04em] tablet:text-[112px] desktop:text-[128px]">
            {total.score}
          </span>
          <span className="text-lg text-cream/75 tablet:text-xl tablet:text-cream/78 desktop:text-[22px]">
            / 100
          </span>
        </p>
        <div
          role="meter"
          aria-label="총운 점수"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={total.score}
          className="h-2 rounded-full bg-night/50"
        >
          <div
            className="h-2 rounded-full bg-cream"
            style={{ width: `${total.score}%` }}
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-5 tablet:flex-1 tablet:gap-3.5 desktop:gap-5.5">
        <p className="font-display text-[21px] leading-[1.45] text-balance break-keep tablet:text-[26px] tablet:leading-[1.4] desktop:text-[28px]">
          {total.summary}
        </p>
        <p className="text-[15px] leading-[1.7] text-cream/88 tablet:text-base tablet:leading-[1.75]">
          {total.detail}
        </p>
      </div>
    </section>
  );
}

/** 별점 (켜진 별 cream, 꺼진 별 plum) */
export function Stars({ count }: { count: number }) {
  return (
    <span
      role="img"
      aria-label={`5점 만점에 ${count}점`}
      className="flex gap-px text-[13px] tablet:gap-0.5 tablet:text-base desktop:text-[17px]"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="0 0 24 24"
          className={`size-[1em] ${i < count ? "text-cream" : "text-plum"}`}
          fill="currentColor"
        >
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
        </svg>
      ))}
    </span>
  );
}

export function FieldGrid({ fields }: { fields: Fortune["fields"] }) {
  return (
    <section className="flex flex-col gap-3.5 tablet:gap-4">
      <h2 className={h2Class}>분야별 운세</h2>
      <ul className="grid grid-cols-2 gap-3 tablet:gap-4">
        {FIELDS.map((key) => (
          <li
            key={key}
            className="flex flex-col gap-2.5 rounded-[20px] px-4 py-4.5 glass-sm tablet:gap-3 tablet:rounded-3xl tablet:p-6 desktop:gap-3.5 desktop:p-7"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[15px] font-semibold tablet:text-lg desktop:text-[19px]">
                {FIELD_LABEL[key]}
              </h3>
              <Stars count={fields[key].stars} />
            </div>
            <p className="text-sm leading-[1.6] break-keep text-cream/88 tablet:text-base">
              {fields[key].text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const luckyLabel =
  "text-xs text-cream/75 tablet:text-[13px] tablet:text-cream/78 desktop:text-sm";
const luckyValue =
  "text-[17px] font-semibold tablet:text-lg desktop:text-[19px]";
const luckyCell =
  "flex flex-col gap-2.5 border-plum px-4.5 py-5 tablet:gap-3 tablet:px-5 tablet:py-6 desktop:px-6 desktop:py-6.5";

/** 행운: 모바일 2×2 / 태블릿·데스크톱 4칸. 칸 사이는 plum 1px 선 */
export function LuckyGrid({ lucky }: { lucky: Fortune["lucky"] }) {
  const hex = luckyColorHex(lucky.color);
  return (
    <section className="flex flex-col gap-3.5 tablet:gap-4">
      <h2 className={h2Class}>오늘의 행운</h2>
      <dl className="grid grid-cols-2 overflow-hidden rounded-3xl glass tablet:grid-cols-4">
        <div className={`${luckyCell} border-r border-b tablet:border-b-0`}>
          <dt className={luckyLabel}>행운의 색</dt>
          <dd className="flex items-center gap-2">
            {hex && (
              <span
                aria-hidden
                className="size-5 shrink-0 rounded-full border border-cream tablet:size-5.5"
                style={{ backgroundColor: hex }}
              />
            )}
            <span className={luckyValue}>{lucky.color}</span>
          </dd>
        </div>
        <div
          className={`${luckyCell} border-b tablet:border-r tablet:border-b-0`}
        >
          <dt className={luckyLabel}>행운의 숫자</dt>
          <dd className="font-display text-[22px] leading-none tablet:text-2xl desktop:text-[26px]">
            {lucky.number}
          </dd>
        </div>
        <div className={`${luckyCell} border-r`}>
          <dt className={luckyLabel}>행운의 방향</dt>
          <dd className={luckyValue}>{lucky.direction}쪽</dd>
        </div>
        <div className={luckyCell}>
          <dt className={luckyLabel}>행운의 아이템</dt>
          <dd className={luckyValue}>{lucky.item}</dd>
        </div>
      </dl>
    </section>
  );
}
