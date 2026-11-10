import type { Metadata } from "next";
import { GuideFooterNav } from "@/components/GuideNav";
import { InfoPage, Section } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "분야별 운세와 별점 보는 법",
  description:
    "애정운·금전운·일운·건강운의 별점 1–5개가 뜻하는 것과 분야별로 하루를 보내는 팁을 정리했어요.",
  alternates: { canonical: "/guide/fields" },
};

const strong = "font-semibold text-cream";

export default function FieldsGuidePage() {
  return (
    <InfoPage
      title="분야별 운세와 별점 보는 법"
      lead="애정·금전·일·건강 네 분야는 별점 1–5개와 한 문장으로 나와요."
      after={<GuideFooterNav current="fields" />}
    >
      <Section title="별점은 이렇게 읽어요">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className={strong}>별 5개</strong> — 그 분야의 흐름이 아주
            좋아요. 적극적으로 움직여 보세요.
          </li>
          <li>
            <strong className={strong}>별 4개</strong> — 순조로워요. 하던 대로
            하면 좋은 결과가 따라와요.
          </li>
          <li>
            <strong className={strong}>별 3개</strong> — 무난해요. 특별한 변화
            없이 평소처럼 흘러가요.
          </li>
          <li>
            <strong className={strong}>별 1–2개</strong> — 조금 조심하면 좋은
            분야예요. 문장에 담긴 조언을 참고해 보세요.
          </li>
        </ul>
        <p>
          네 분야는 각각 따로 정해져요. 그래서 한 분야는 별 5개, 다른 분야는 별
          2개처럼 섞여 나오는 게 자연스러워요. 하루에도 잘 풀리는 일과 조심할
          일이 함께 있는 것처럼요.
        </p>
      </Section>

      <Section title="애정운 — 관계의 온도">
        <p>
          애정운은 연인뿐 아니라 가족, 친구, 동료처럼 가까운 사람과의 관계
          전반을 다뤄요. 별점이 높은 날에는 먼저 안부를 묻거나 솔직한 마음을
          전해 보세요. 별점이 낮은 날에는 말을 아끼고 상대의 이야기를 끝까지
          들어 주는 것만으로 충분해요.
        </p>
      </Section>

      <Section title="금전운 — 쓰는 습관 돌아보기">
        <p>
          금전운은 돈이 갑자기 생기거나 사라진다는 예언이 아니에요. 오늘의
          소비와 저축 습관을 한 번 돌아보라는 신호에 가까워요. 별점이 높으면
          미뤄 둔 정리, 예를 들어 가계부 쓰기나 구독 서비스 점검을 해 보기
          좋아요. 별점이 낮으면 충동구매를 한 번 참아 보는 정도로 받아들이면
          돼요.
        </p>
        <p>
          투자나 큰 지출처럼 중요한 결정은 운세가 아니라 믿을 만한 정보와
          전문가의 조언을 바탕으로 내려 주세요.
        </p>
      </Section>

      <Section title="일운 — 집중과 협업">
        <p>
          일운은 직장 일, 공부, 집안일처럼 오늘 해야 할 일을 얼마나 매끄럽게
          해낼 수 있는지를 보여 줘요. 별점이 높은 날에는 어려운 일을 앞쪽에
          배치해 보세요. 별점이 낮은 날에는 할 일을 잘게 나누고, 마감과 세부
          사항을 한 번 더 확인하면 실수를 줄일 수 있어요.
        </p>
      </Section>

      <Section title="건강운 — 몸의 신호에 귀 기울이기">
        <p>
          건강운은 컨디션을 챙기라는 가벼운 알림이에요. 별점이 높으면 산책이나
          스트레칭처럼 몸을 움직이기 좋은 날이고, 별점이 낮으면 물을 자주 마시고
          조금 일찍 잠자리에 들어 보세요.
        </p>
        <p>
          몸이 불편하다면 운세와 관계없이 꼭 병원이나 전문가와 상담해 주세요.
        </p>
      </Section>
    </InfoPage>
  );
}
