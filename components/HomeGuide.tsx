import Link from "next/link";
import { GuideList } from "@/components/GuideNav";
import { MENU_NAME, SITE_NAME } from "@/lib/site";

const STEPS = [
  {
    title: "생년월일 입력",
    body: "회원가입 없이 생년월일 8자리만 넣어요. 이름은 공유 카드에 보여 주고 싶을 때만 적어요.",
  },
  {
    title: "1분 안에 확인",
    body: "총운 점수와 등급, 애정·금전·일·건강운 별점, 행운의 색·숫자·방위·아이템을 한 화면에서 봐요.",
  },
  {
    title: "카드로 공유",
    body: "결과를 링크나 이미지로 친구에게 보내요. 링크는 날짜가 지나도 그날의 결과를 그대로 보여 줘요.",
  },
];

const GRADES = [
  { label: "최고", range: "85–100점", body: "미뤄 둔 일을 꺼내기 좋은 날" },
  { label: "좋음", range: "65–84점", body: "하던 일이 순조롭게 풀리는 날" },
  { label: "보통", range: "40–64점", body: "나만의 리듬을 지키기 좋은 날" },
  { label: "주의", range: "0–39점", body: "한 번 더 확인하면 괜찮은 날" },
];

const FAQ = [
  {
    q: "운세는 언제 바뀌나요?",
    a: "한국 시간 기준 매일 자정에 바뀌어요. 해외에 있어도 한국 날짜를 기준으로 계산해요.",
  },
  {
    q: "다시 보면 결과가 달라지나요?",
    a: "아니요. 생년월일과 날짜로 결과를 정해서, 같은 날 같은 생년월일이면 몇 번을 봐도 같은 결과가 나와요.",
  },
  {
    q: "입력한 생년월일은 어디에 저장되나요?",
    a: "내 기기의 브라우저에만 저장돼요. 서버에는 보관하지 않아서 다음 방문 때 다시 입력하지 않아도 되는 용도로만 쓰여요.",
  },
  {
    q: "운세 문장은 AI가 만드나요?",
    a: "아니요. 미리 정성껏 써 둔 문장 중에서 골라요. 주의 등급 문장은 겁을 주기보다 조언을 건네도록 썼어요.",
  },
];

/** 입력 화면 아래 소개 콘텐츠 — 서버에서 그려 검색엔진·광고 크롤러가 읽을 수 있게 한다 */
export function HomeGuide() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* 글래스가 보이도록 카드 뒤에 plum 행성 */}
      <div
        aria-hidden
        className="absolute top-40 -right-32 -z-10 size-80 rounded-full bg-plum/60 tablet:size-110"
      />
      <div
        aria-hidden
        className="absolute bottom-60 -left-24 -z-10 size-56 rounded-full bg-plum/45 tablet:size-80"
      />
      <div className="mx-auto flex w-full max-w-300 flex-col gap-16 px-6 py-16 tablet:px-12 tablet:py-20 desktop:px-30">
        <section aria-labelledby="home-how" className="flex flex-col gap-6">
          <h2 id="home-how" className="font-display text-2xl tablet:text-3xl">
            {MENU_NAME}, 이렇게 봐요
          </h2>
          <ol className="grid gap-4 tablet:grid-cols-3">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className="flex flex-col gap-2 rounded-[20px] p-5 glass-sm"
              >
                <span className="text-sm font-medium text-cream/75">
                  STEP {i + 1}
                </span>
                <span className="font-display text-xl">{s.title}</span>
                <p className="text-[15px] leading-6.5 text-cream/85">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="home-grades" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2
              id="home-grades"
              className="font-display text-2xl tablet:text-3xl"
            >
              총운 등급은 네 가지예요
            </h2>
            <p className="text-[15px] leading-6.5 text-cream/80 tablet:text-base">
              총운은 0–100점으로 나오고 점수에 따라 등급이 붙어요. 분야별 운세는
              별점 1–5개로 보여 줘요.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
            {GRADES.map((g) => (
              <li
                key={g.label}
                className="flex flex-col gap-1 rounded-[20px] p-5 glass-sm"
              >
                <span className="font-display text-2xl">{g.label}</span>
                <span className="text-sm text-cream/75">{g.range}</span>
                <span className="mt-1 text-[15px] leading-6 text-cream/85">
                  {g.body}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/guide/grades"
            className="inline-flex min-h-11 items-center self-start text-[15px] underline underline-offset-4"
          >
            등급별로 하루를 보내는 팁 보기
          </Link>
        </section>

        <section aria-labelledby="home-faq" className="flex flex-col gap-6">
          <h2 id="home-faq" className="font-display text-2xl tablet:text-3xl">
            자주 묻는 질문
          </h2>
          <dl className="flex flex-col gap-3">
            {FAQ.map((f) => (
              <div key={f.q} className="rounded-[20px] p-5 glass-sm">
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-2 text-[15px] leading-6.5 text-cream/85">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="home-guides" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2
              id="home-guides"
              className="font-display text-2xl tablet:text-3xl"
            >
              운세 가이드
            </h2>
            <p className="text-[15px] leading-6.5 text-cream/80 tablet:text-base">
              {SITE_NAME}의 결과를 더 재미있게 읽는 법을 정리했어요.
            </p>
          </div>
          <GuideList />
        </section>
      </div>
    </div>
  );
}
