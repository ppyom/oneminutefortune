import type { Metadata } from "next";
import { GuideFooterNav } from "@/components/GuideNav";
import { InfoPage, Section } from "@/components/InfoPage";
import { luckyColorGuide } from "@/lib/luckyGuide";

export const metadata: Metadata = {
  title: "행운의 색 20가지 의미",
  description:
    "라벤더, 골드, 민트, 네이비 등 오늘의 운세에 나오는 행운의 색 20가지의 분위기와 일상에서 활용하는 방법을 소개해요.",
  alternates: { canonical: "/guide/lucky-color" },
};

export default function LuckyColorGuidePage() {
  return (
    <InfoPage
      title="행운의 색 20가지 의미"
      lead="오늘의 운세에는 매일 하나의 행운의 색이 나와요. 색마다 담긴 분위기와 활용법을 정리했어요."
      after={<GuideFooterNav current="lucky-color" />}
    >
      <Section title="행운의 색은 이렇게 써 보세요">
        <p>
          행운의 색을 꼭 옷 전체로 맞출 필요는 없어요. 양말, 머리끈, 휴대폰
          배경화면, 마시는 음료의 색처럼 작은 곳에 하나만 더해도 충분해요. 하루
          중에 그 색을 볼 때마다 오늘의 운세를 떠올리고 기분을 한 번 환기하는 게
          핵심이에요.
        </p>
        <p>
          색이 마음에 들지 않거나 갖고 있지 않아도 괜찮아요. 길에서 우연히 그
          색을 발견하는 것도 소소한 재미가 돼요.
        </p>
      </Section>

      <Section title="색별 의미">
        <dl className="space-y-4">
          {luckyColorGuide().map((c) => (
            <div key={c.name}>
              <dt className="font-semibold text-cream">{c.name}</dt>
              <dd className="mt-1">{c.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="알아 두면 좋은 점">
        <p>
          색의 의미는 색채에서 흔히 떠올리는 인상을 바탕으로 가볍게 정리한
          거예요. 과학적인 근거가 있는 건 아니니 재미로 즐겨 주세요. 행운의 색은
          생년월일과 날짜로 정해지기 때문에 같은 날 같은 생년월일이면 언제 봐도
          같은 색이 나와요.
        </p>
      </Section>
    </InfoPage>
  );
}
