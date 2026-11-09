import type { Metadata } from "next";
import { InfoPage, Section } from "@/components/InfoPage";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${SITE_NAME}이 어떤 정보를 어떻게 다루는지 안내해요.`,
  alternates: { canonical: "/privacy" },
};

const EFFECTIVE_DATE = "2026년 11월 9일";

export default function PrivacyPage() {
  return (
    <InfoPage
      title="개인정보처리방침"
      lead={`${SITE_NAME}은 회원가입이 없고, 입력한 생년월일과 이름을 서버에 저장하지 않아요.`}
    >
      <Section title="1. 수집하는 정보와 저장 위치">
        <p>
          운세를 보려면 생년월일을 입력해요. 결과 카드에 보여 줄 이름은 원할
          때만 입력해요. 이 값들은{" "}
          <strong className="font-semibold text-cream">
            내 기기의 브라우저(localStorage)에만
          </strong>{" "}
          저장되고, 다음에 방문할 때 다시 입력하지 않아도 되도록 쓰여요. 서버나
          데이터베이스에는 보관하지 않아요.
        </p>
        <p>
          브라우저 설정에서 사이트 데이터를 지우면 저장된 생년월일과 이름도 함께
          지워져요.
        </p>
      </Section>

      <Section title="2. 공유 링크">
        <p>
          결과를 공유하면 링크 주소에 생년월일과 날짜가 들어가요. 이름을
          입력했다면 이름도 함께 들어가요(예: /s/19950312-20261109). 링크를 받은
          사람은 이 정보를 볼 수 있고, 링크로 접속할 때 호스팅 서버(Vercel)의
          접속 기록에 주소가 남을 수 있어요. 생년월일을 알리고 싶지 않다면 링크
          대신 카드 이미지를 저장해서 공유해 주세요.
        </p>
      </Section>

      <Section title="3. 방문 통계 (Google Analytics)">
        <p>
          서비스를 개선하려고 Google Analytics 4를 써요. 이 도구는 쿠키(_ga,
          _ga_로 시작하는 이름)를 사용해 방문한 페이지, 머문 시간, 기기·브라우저
          종류, 대략적인 지역 같은 통계 정보를 모아요. 이름이나 연락처처럼
          개인을 바로 알아볼 수 있는 정보는 모으지 않아요.
        </p>
        <p>
          브라우저에서 쿠키를 차단하거나{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Google 애널리틱스 차단 부가기능
          </a>
          을 설치하면 수집을 거부할 수 있어요. 거부해도 운세는 그대로 볼 수
          있어요.
        </p>
      </Section>

      <Section title="4. 광고 쿠키 (예정)">
        <p>
          앞으로 서비스 운영을 위해 Google AdSense 같은 광고를 붙일 수 있어요.
          광고 서비스는 관심사에 맞는 광고를 보여 주려고 쿠키를 쓸 수 있어요.
          광고를 도입하기 전에 이 방침을 먼저 고쳐서 알려 드릴게요.
        </p>
      </Section>

      <Section title="5. 제3자 제공과 처리 위탁">
        <p>
          모은 정보를 다른 곳에 팔거나 제공하지 않아요. 다만 서비스 운영을 위해
          아래 업체의 도구를 써요.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Vercel Inc. — 웹사이트 호스팅, 접속 기록</li>
          <li>Google LLC — 방문 통계(Google Analytics)</li>
        </ul>
      </Section>

      <Section title="6. 보관 기간">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            localStorage의 생년월일·이름: 직접 지울 때까지 내 기기에만 남아요.
          </li>
          <li>
            Google Analytics 통계: Google Analytics 설정에 따른 기간(최대
            14개월) 동안 보관돼요.
          </li>
        </ul>
      </Section>

      <Section title="7. 방침 변경">
        <p>
          이 방침이 바뀌면 이 페이지에서 알려 드려요. 시행일: {EFFECTIVE_DATE}
        </p>
      </Section>
    </InfoPage>
  );
}
