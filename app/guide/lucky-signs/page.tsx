import type { Metadata } from "next";
import { GuideFooterNav } from "@/components/GuideNav";
import { InfoPage, Section } from "@/components/InfoPage";
import { LUCKY_ITEMS, luckyDirectionGuide } from "@/lib/luckyGuide";

export const metadata: Metadata = {
  title: "행운의 숫자·방위·아이템 활용법",
  description:
    "오늘의 운세에 나오는 행운의 숫자(1–99), 여덟 방위, 행운의 아이템을 일상에서 가볍게 즐기는 방법을 알려 드려요.",
  alternates: { canonical: "/guide/lucky-signs" },
};

export default function LuckySignsGuidePage() {
  return (
    <InfoPage
      title="행운의 숫자·방위·아이템 활용법"
      lead="행운의 색과 함께 매일 숫자, 방위, 아이템이 하나씩 나와요. 하루에 작은 재미를 더하는 방법을 모았어요."
      after={<GuideFooterNav current="lucky-signs" />}
    >
      <Section title="행운의 숫자 (1–99)">
        <p>
          행운의 숫자는 1부터 99 사이에서 하나가 나와요. 숫자를 활용하는 방법은
          정해져 있지 않아요. 몇 가지 예를 들어 볼게요.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            엘리베이터나 사물함, 좌석을 고를 때 숫자와 가까운 번호를 골라
            보세요.
          </li>
          <li>운동할 때 반복 횟수나 걸음 수 목표의 끝자리로 써 보세요.</li>
          <li>
            할 일에 그 숫자만큼 분을 정해 짧게 집중해 보세요. 예를 들어 25가
            나오면 25분 집중하기.
          </li>
          <li>
            시계를 보다가 그 숫자를 발견하면 잠깐 숨을 고르고 기분을 환기해
            보세요.
          </li>
        </ul>
        <p>
          복권 번호처럼 돈이 걸린 선택에 쓰는 건 권하지 않아요. 행운의 숫자는
          일상의 작은 선택을 즐겁게 만드는 정도로 쓰는 게 가장 좋아요.
        </p>
      </Section>

      <Section title="행운의 방위 (여덟 방향)">
        <p>
          방위는 동·서·남·북과 그 사이의 네 방향, 모두 여덟 가지 중 하나가
          나와요. 책상 위 물건을 그쪽에 두거나, 산책할 때 그 방향으로 먼저 걸어
          보거나, 카페에서 그쪽을 바라보는 자리에 앉아 보세요.
        </p>
        <dl className="space-y-3">
          {luckyDirectionGuide().map((d) => (
            <div key={d.name}>
              <dt className="font-semibold text-cream">{d.name}</dt>
              <dd className="mt-1">{d.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="행운의 아이템">
        <p>
          행운의 아이템은 누구나 쉽게 찾을 수 있는 생활 소품으로만 골랐어요.
          새로 살 필요 없이 이미 가진 물건을 하루 동안 조금 더 아껴 쓰면 돼요.
          지금 나오는 아이템은 아래와 같아요.
        </p>
        <p className="text-cream">{LUCKY_ITEMS.join(" · ")}</p>
        <p>
          예를 들어 텀블러가 나왔다면 오늘은 물을 조금 더 챙겨 마시고, 수첩이
          나왔다면 떠오르는 생각을 한 줄 적어 보세요. 작은 화분이 나왔다면
          창가에 있는 식물에 물을 주는 것도 좋아요. 아이템을 핑계로 나를 돌보는
          시간을 갖는 게 이 항목의 진짜 의미예요.
        </p>
      </Section>

      <Section title="재미로 즐겨 주세요">
        <p>
          행운의 숫자·방위·아이템은 생년월일과 날짜로 정해지는 오락용 정보예요.
          하루를 조금 더 즐겁게 보내는 작은 놀이로 즐겨 주세요.
        </p>
      </Section>
    </InfoPage>
  );
}
