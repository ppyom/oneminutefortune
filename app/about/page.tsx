import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, Section } from "@/components/InfoPage";
import { MENU_NAME, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "서비스 소개",
  description: `${SITE_NAME}은 생년월일만 넣으면 1분 안에 보는 ${MENU_NAME}예요.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <InfoPage
      title="서비스 소개"
      lead="생년월일만 넣으면 1분 안에 오늘의 운세를 보고, 카드로 공유할 수 있어요."
    >
      <Section title={`${SITE_NAME}은요`}>
        <p>
          바쁜 하루 중에 잠깐 들러 가볍게 보는 운세예요. 회원가입 없이
          생년월일만 입력하면 총운과 애정·금전·일·건강운, 행운의 색과 숫자를 한
          화면에서 볼 수 있어요.
        </p>
      </Section>

      <Section title="운세는 이렇게 만들어져요">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-cream">
              생년월일과 오늘 날짜
            </strong>
            를 조합해서 결과를 정해요. 같은 날 같은 생년월일이면 언제 다시 봐도
            같은 결과가 나와요.
          </li>
          <li>
            날짜는 한국 시간 기준이에요. 매일 자정(KST)에 새로운 운세로
            바뀌어요.
          </li>
          <li>
            문장은 미리 정성껏 써 둔 문장 중에서 골라요. AI가 즉석에서 만들지
            않아요.
          </li>
          <li>공유한 링크는 날짜가 지나도 그날의 결과를 그대로 보여 줘요.</li>
          <li>
            입력한 생년월일은 내 브라우저에만 저장되고 서버에는 보관하지 않아요.
            자세한 내용은{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              개인정보처리방침
            </Link>
            에서 볼 수 있어요.
          </li>
        </ul>
      </Section>

      <Section title="재미로 보는 운세예요">
        <p>
          {SITE_NAME}의 운세는 과학적 근거가 없는 오락용 콘텐츠예요. 건강, 돈,
          진로처럼 중요한 결정은 운세가 아니라 믿을 만한 정보와 전문가의 조언을
          바탕으로 내려 주세요.
        </p>
      </Section>
    </InfoPage>
  );
}
