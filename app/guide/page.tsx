import type { Metadata } from "next";
import Link from "next/link";
import { GuideList } from "@/components/GuideNav";
import { InfoPage, Section } from "@/components/InfoPage";
import { MENU_NAME, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "운세 가이드",
  description: `${SITE_NAME}의 ${MENU_NAME}를 더 재미있게 읽는 법. 등급, 별점, 행운의 색·숫자·방위·아이템을 풀어 설명해요.`,
  alternates: { canonical: "/guide" },
};

export default function GuideIndexPage() {
  return (
    <InfoPage
      title="운세 가이드"
      lead={`${MENU_NAME} 결과에 나오는 등급과 별점, 행운 정보를 어떻게 읽으면 좋은지 정리했어요.`}
      after={
        <div className="mt-10">
          <GuideList />
        </div>
      }
    >
      <Section title="결과 화면은 이렇게 생겼어요">
        <p>
          생년월일을 넣으면 한 화면에 세 가지가 나와요. 맨 위에는 하루 전체의
          흐름을 보여 주는{" "}
          <strong className="font-semibold text-cream">총운</strong>이 점수와
          등급, 한 줄 요약, 조금 더 긴 설명으로 나와요. 그 아래에는
          애정·금전·일·건강 네 분야의 운세가 별점과 한 문장으로 나오고, 마지막에
          행운의 색·숫자·방위·아이템이 나와요.
        </p>
        <p>
          모든 결과는 생년월일과 오늘 날짜로 정해져요. 같은 날 같은 생년월일이면
          몇 번을 다시 봐도 같은 결과가 나오고, 한국 시간 자정이 지나면 새로운
          운세로 바뀌어요. 친구에게 공유한 링크는 날짜가 지나도 그날의 결과를
          그대로 보여 줘요.
        </p>
      </Section>

      <Section title="가볍게, 하지만 쓸모 있게">
        <p>
          운세는 정답을 알려 주는 도구가 아니라 하루를 한 번 돌아보게 해 주는
          작은 계기예요. 좋은 결과가 나오면 미뤄 둔 일을 시작할 힘으로 쓰고,
          주의 결과가 나오면 평소보다 한 번 더 확인하는 습관으로 쓰면 충분해요.
          아래 가이드에서 항목마다 어떻게 받아들이면 좋은지 자세히 적어
          두었어요.
        </p>
        <p>
          아직 오늘의 운세를 보지 않았다면{" "}
          <Link href="/" className="underline underline-offset-4">
            첫 화면
          </Link>
          에서 생년월일을 넣고 먼저 확인해 보세요. 1분이면 충분해요.
        </p>
      </Section>
    </InfoPage>
  );
}
