import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { formatKoreanDate } from "@/lib/birth";
import { todayKst } from "@/lib/fortune/date";
import { getFortune } from "@/lib/fortune/getFortune";
import { FIELDS, GRADE_LABEL, type Fortune } from "@/lib/fortune/types";
import { NAME_PARAM, parseShareName, parseShareTarget } from "@/lib/share";
import { SITE_URL } from "@/lib/site";

/*
 * OG 이미지 1200×630
 *  A. 공통 (/api/og)                    — design/OgStatic
 *  B. 결과 포함 (/api/og?id=생년월일-날짜&n=이름) — design/OgResult, 이미지 저장에도 사용
 * Satori는 backdrop-filter 미지원 → B의 글래스 카드는 미리 블러한 배경 PNG 위에 그린다
 * (scripts/gen-og-backgrounds.mjs). 폰트는 assets/fonts의 정적 TTF.
 */

const SIZE = { width: 1200, height: 630 };
// scripts/gen-og-backgrounds.mjs 의 CARD와 같은 값 (블러 영역과 카드가 겹쳐야 한다)
const OG_RESULT_CARD = { left: 740, top: 159, width: 380, height: 312 };

const NIGHT = "#290044";
const VIOLET = "#500071";
const PLUM = "#8A2A78";
const CREAM = "#EEE3B0";
const cream = (a: number) => `rgba(238, 227, 176, ${a})`;

const asset = (p: string) => readFile(join(process.cwd(), "assets", p));

// 모듈 단위로 한 번만 읽는다
const assetsPromise = Promise.all([
  asset("fonts/SUITE-Regular.ttf"),
  asset("fonts/SUITE-SemiBold.ttf"),
  asset("fonts/GowunDodum-Regular.ttf"),
  asset("og/result-bg.png"),
]).then(([suite400, suite600, gowun, resultBg]) => ({
  fonts: [
    {
      name: "SUITE",
      data: suite400,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "SUITE",
      data: suite600,
      weight: 600 as const,
      style: "normal" as const,
    },
    {
      name: "Gowun",
      data: gowun,
      weight: 400 as const,
      style: "normal" as const,
    },
  ],
  resultBg: `data:image/png;base64,${resultBg.toString("base64")}`,
}));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const target = id ? parseShareTarget(id, todayKst()) : null;
  const { fonts, resultBg } = await assetsPromise;

  if (target) {
    const fortune = getFortune(target.birth, target.date);
    const name = parseShareName(searchParams.get(NAME_PARAM));
    return new ImageResponse(
      <OgResult fortune={fortune} name={name} background={resultBg} />,
      {
        ...SIZE,
        fonts,
        headers: {
          // 같은 URL이면 결과가 영원히 같다 (getFortune은 순수 함수)
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Robots-Tag": "noindex",
        },
      },
    );
  }

  return new ImageResponse(<OgStatic host={new URL(SITE_URL).host} />, {
    ...SIZE,
    fonts,
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}

function Stars({ count, size }: { count: number; size: number }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24">
          <path
            d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
            fill={i < count ? CREAM : PLUM}
          />
        </svg>
      ))}
    </div>
  );
}

const FIELD_LABEL = {
  love: "애정",
  money: "금전",
  work: "일·학업",
  health: "건강",
};

/** B. 결과 포함 — design/OgResult */
function OgResult({
  fortune,
  name,
  background,
}: {
  fortune: Fortune;
  name?: string;
  background: string;
}) {
  const date = formatKoreanDate(fortune.date).replace(/ \S+요일$/, "");
  return (
    <div
      style={{
        ...SIZE,
        display: "flex",
        position: "relative",
        background: NIGHT,
        color: CREAM,
        fontFamily: "SUITE",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={background}
        {...SIZE}
        alt=""
        style={{ position: "absolute", left: 0, top: 0 }}
      />

      <div
        style={{
          position: "absolute",
          left: 80,
          top: 0,
          width: OG_RESULT_CARD.left - 80 - 56,
          height: SIZE.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 22,
        }}
      >
        <div style={{ fontSize: 26, color: cream(0.88) }}>
          {name ? `${name}님의 ${date} 운세` : `${date}의 운세`}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <div
            style={{
              fontFamily: "Gowun",
              fontSize: 168,
              lineHeight: 0.95,
              letterSpacing: -8,
            }}
          >
            {String(fortune.total.score)}
          </div>
          <div style={{ fontSize: 34, color: cream(0.8) }}>/ 100</div>
          <div
            style={{
              alignSelf: "center",
              marginLeft: 8,
              padding: "6px 18px",
              borderRadius: 999,
              background: CREAM,
              color: NIGHT,
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            {GRADE_LABEL[fortune.total.grade]}
          </div>
        </div>
        <div
          style={{
            fontFamily: "Gowun",
            fontSize: 40,
            lineHeight: 1.35,
            letterSpacing: -0.8,
            wordBreak: "keep-all",
          }}
        >
          {fortune.total.summary}
        </div>
        <div style={{ marginTop: 4, fontSize: 22, color: cream(0.8) }}>
          나도 오늘 운세 보기 · One Minute Fortune
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          ...OG_RESULT_CARD,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 20,
          padding: 32,
          borderRadius: 32,
          background: "rgba(80, 0, 113, 0.32)",
          border: `1px solid ${cream(0.22)}`,
          boxShadow: `inset 0 1px 0 ${cream(0.3)}, 0 16px 48px rgba(20, 0, 34, 0.45)`,
        }}
      >
        {FIELDS.map((key, i) => (
          <div
            key={key}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {i > 0 && <div style={{ height: 1, background: cream(0.16) }} />}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 600 }}>
                {FIELD_LABEL[key]}
              </div>
              <Stars count={fortune.fields[key].stars} size={26} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** A. 공통 — design/OgStatic (방사형 그라데이션은 CLAUDE.md 규칙에 따라 단색 원으로) */
function OgStatic({ host }: { host: string }) {
  return (
    <div
      style={{
        ...SIZE,
        display: "flex",
        position: "relative",
        background: NIGHT,
        color: CREAM,
        fontFamily: "SUITE",
      }}
    >
      <svg
        {...SIZE}
        viewBox="0 0 1200 630"
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <circle cx="120" cy="70" r="2" fill={CREAM} opacity="0.7" />
        <circle cx="420" cy="40" r="1.5" fill={CREAM} opacity="0.6" />
        <circle cx="640" cy="110" r="2" fill={CREAM} opacity="0.7" />
        <circle cx="560" cy="560" r="1.5" fill={CREAM} opacity="0.6" />
        <circle cx="760" cy="520" r="2" fill={CREAM} opacity="0.7" />
        <circle cx="1140" cy="80" r="1.5" fill={CREAM} opacity="0.7" />
        <circle cx="950" cy="320" r="240" fill={PLUM} opacity="0.7" />
        <circle cx="950" cy="320" r="170" fill={VIOLET} />
        <circle cx="950" cy="320" r="118" fill={CREAM} />
        <circle cx="998" cy="290" r="108" fill={VIOLET} />
        <circle cx="80" cy="640" r="140" fill={PLUM} opacity="0.6" />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 88,
          top: 0,
          height: SIZE.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 28,
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 2.9, opacity: 0.85 }}>
          ONE MINUTE FORTUNE
        </div>
        <div
          style={{
            fontFamily: "Gowun",
            fontSize: 104,
            lineHeight: 1.1,
            letterSpacing: -3,
          }}
        >
          오늘의 운세
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 30,
            lineHeight: 1.5,
            color: cream(0.88),
          }}
        >
          <div>생년월일만 넣으면</div>
          <div>매일 자정, 새로운 운세가 도착해요</div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 64,
              padding: "0 32px",
              borderRadius: 999,
              background: CREAM,
              color: NIGHT,
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            무료로 확인하기
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 64,
              padding: "0 28px",
              borderRadius: 999,
              background: "rgba(80, 0, 113, 0.35)",
              border: `1px solid ${cream(0.22)}`,
              fontSize: 22,
            }}
          >
            {host}
          </div>
        </div>
      </div>
    </div>
  );
}
