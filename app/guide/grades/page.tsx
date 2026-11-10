import type { Metadata } from "next";
import { GuideFooterNav } from "@/components/GuideNav";
import { InfoPage, Section } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "운세 등급 읽는 법",
  description:
    "총운 점수에 따라 나오는 최고·좋음·보통·주의 등급의 의미와, 등급별로 하루를 보내는 팁을 알려 드려요.",
  alternates: { canonical: "/guide/grades" },
};

const strong = "font-semibold text-cream";

export default function GradesGuidePage() {
  return (
    <InfoPage
      title="운세 등급 읽는 법"
      lead="총운은 0점부터 100점까지 점수로 나오고, 점수에 따라 네 가지 등급 중 하나가 붙어요."
      after={<GuideFooterNav current="grades" />}
    >
      <Section title="점수와 등급의 관계">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className={strong}>최고 (85–100점)</strong> — 흐름이 가장
            좋은 날이에요.
          </li>
          <li>
            <strong className={strong}>좋음 (65–84점)</strong> — 대체로 순조롭고
            기분 좋은 일이 생기기 쉬운 날이에요.
          </li>
          <li>
            <strong className={strong}>보통 (40–64점)</strong> — 크게 튀지 않고
            평소 페이스대로 흘러가는 날이에요.
          </li>
          <li>
            <strong className={strong}>주의 (0–39점)</strong> — 서두르기보다 한
            박자 쉬어 가면 좋은 날이에요.
          </li>
        </ul>
        <p>
          점수는 등급 안에서의 세기를 보여 줘요. 같은 좋음이라도 66점과 83점은
          느낌이 조금 달라요. 다만 숫자 하나하나에 너무 의미를 두기보다는 오늘의
          전체 분위기를 가늠하는 정도로 보면 좋아요.
        </p>
      </Section>

      <Section title="최고 — 미뤄 둔 일을 꺼내기 좋은 날">
        <p>
          최고 등급은 자주 나오지 않아요. 이런 날에는 평소 망설이던 일을 시작해
          보세요. 연락하고 싶던 사람에게 먼저 말을 걸거나, 미뤄 둔 계획의 첫
          단계를 밟거나, 새로운 장소에 가 보는 것도 좋아요.
        </p>
        <p>
          다만 운이 좋다고 해서 무리하게 큰 결정을 내릴 필요는 없어요. 좋은
          기분을 작은 실행으로 바꾸는 게 최고 등급을 가장 잘 쓰는 방법이에요.
        </p>
      </Section>

      <Section title="좋음 — 꾸준함이 빛나는 날">
        <p>
          좋음은 하던 일이 무난하게 풀리는 날이에요. 새로 크게 벌이기보다는 이미
          하고 있는 일에 조금 더 마음을 쓰면 결과가 잘 따라와요. 주변 사람에게
          고마움을 표현하기에도 좋은 날이에요.
        </p>
      </Section>

      <Section title="보통 — 나만의 리듬을 지키는 날">
        <p>
          보통은 나쁘다는 뜻이 아니에요. 특별한 일이 없다는 건 계획대로 하루를
          꾸려 가기 좋다는 뜻이기도 해요. 할 일 목록을 정리하고, 하나씩 지워
          나가는 성취감을 느껴 보세요. 작은 루틴을 지키는 것만으로도 충분히 좋은
          하루가 돼요.
        </p>
      </Section>

      <Section title="주의 — 한 번 더 확인하면 괜찮은 날">
        <p>
          주의 등급은 전체 결과 중 약 15% 정도로 나와요. 이 등급의 문장은 겁을
          주기보다 조언을 건네도록 썼어요. 메시지를 보내기 전에 한 번 더 읽어
          보고, 약속 시간과 준비물을 미리 확인하고, 피곤하면 일찍 쉬는 것처럼
          작은 습관이 하루를 지켜 줘요.
        </p>
        <p>
          주의가 나왔다고 걱정할 필요는 없어요. 운세는 재미로 보는 거예요.
          오히려 평소보다 꼼꼼하게 하루를 보낼 수 있는 기회로 삼아 보세요.
        </p>
      </Section>

      <Section title="총운과 분야별 운세가 다를 때">
        <p>
          총운이 보통인데 애정운 별점이 높거나, 총운이 좋은데 건강운이 낮게 나올
          수도 있어요. 분야별 운세는 총운과 따로 정해지기 때문이에요. 하루
          전체는 무난하지만 특정 분야에서 기회가 보인다는 뜻으로 읽으면 돼요.
          분야별 별점 읽는 법은 다음 가이드에서 자세히 설명해요.
        </p>
      </Section>
    </InfoPage>
  );
}
