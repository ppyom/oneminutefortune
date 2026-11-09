/*
 * 입력 화면 배경 (design/Main·TabletMain·DesktopMain의 SVG 좌표 그대로).
 * 화면 크기가 디자인 프레임과 달라도 관계가 유지되도록 고정 크기 SVG를 가운데에 둔다.
 *  - 모바일: 별·초승달은 위쪽 기준, 행성은 아래쪽(입력 카드) 기준
 *  - 태블릿: 위쪽 기준 (세로로 흐르는 레이아웃)
 *  - 데스크톱: 세로 가운데 기준 (본문이 세로 가운데 정렬)
 */

const VIOLET = "#500071";
const PLUM = "#8A2A78";
const CREAM = "#EEE3B0";

function Stars({ points }: { points: [number, number, number, number][] }) {
  return points.map(([cx, cy, r, o]) => (
    <circle
      key={`${cx}-${cy}`}
      cx={cx}
      cy={cy}
      r={r}
      fill={CREAM}
      opacity={o}
    />
  ));
}

/** 초승달: violet 원 위에 cream 원, 다시 violet 원으로 가린다 */
function Crescent({
  cx,
  cy,
  halo,
  moon,
  shadow,
}: {
  cx: number;
  cy: number;
  halo: number;
  moon: number;
  shadow: [number, number, number];
}) {
  return (
    <>
      <circle cx={cx} cy={cy} r={halo} fill={VIOLET} />
      <circle cx={cx} cy={cy} r={moon} fill={CREAM} />
      <circle cx={shadow[0]} cy={shadow[1]} r={shadow[2]} fill={VIOLET} />
    </>
  );
}

const svgBase =
  "pointer-events-none absolute left-1/2 -z-10 max-w-none -translate-x-1/2";

export function MainBackdrop() {
  return (
    <>
      {/* 모바일 — 행성 (아래 기준) */}
      <svg
        aria-hidden
        width="390"
        height="844"
        viewBox="0 0 390 844"
        className={`${svgBase} bottom-0 tablet:hidden`}
      >
        <circle cx="30" cy="600" r="130" fill={PLUM} />
        <circle cx="370" cy="790" r="110" fill={PLUM} opacity="0.7" />
        <circle cx="335" cy="545" r="26" fill={CREAM} opacity="0.9" />
      </svg>
      {/* 모바일 — 별·초승달 (위 기준) */}
      <svg
        aria-hidden
        width="390"
        height="480"
        viewBox="0 0 390 480"
        className={`${svgBase} top-0 tablet:hidden`}
      >
        <Stars
          points={[
            [42, 88, 1.5, 0.7],
            [118, 42, 1, 0.5],
            [352, 60, 1.5, 0.8],
            [300, 150, 1, 0.5],
            [70, 260, 1, 0.5],
            [210, 110, 1, 0.6],
            [366, 300, 1.5, 0.6],
          ]}
        />
        <Crescent
          cx={290}
          cy={400}
          halo={68}
          moon={46}
          shadow={[309, 388, 42]}
        />
      </svg>

      {/* 태블릿 */}
      <svg
        aria-hidden
        width="834"
        height="1194"
        viewBox="0 0 834 1194"
        className={`${svgBase} top-0 hidden tablet:block desktop:hidden`}
      >
        <Stars
          points={[
            [80, 120, 1.5, 0.7],
            [240, 70, 1, 0.5],
            [760, 90, 1.5, 0.8],
            [640, 200, 1, 0.5],
            [120, 420, 1, 0.6],
            [730, 460, 1.5, 0.6],
          ]}
        />
        <Crescent
          cx={417}
          cy={250}
          halo={96}
          moon={64}
          shadow={[443, 233, 58]}
        />
        <circle cx="140" cy="900" r="180" fill={PLUM} />
        <circle cx="720" cy="1080" r="160" fill={PLUM} opacity="0.7" />
        <circle cx="660" cy="760" r="30" fill={CREAM} opacity="0.9" />
      </svg>

      {/* 데스크톱 */}
      <svg
        aria-hidden
        width="1440"
        height="900"
        viewBox="0 0 1440 900"
        className={`${svgBase} top-1/2 hidden -translate-y-1/2 desktop:block`}
      >
        <Stars
          points={[
            [160, 140, 1.5, 0.7],
            [420, 90, 1, 0.5],
            [700, 160, 1.5, 0.7],
            [560, 780, 1, 0.6],
            [1380, 120, 1.5, 0.7],
          ]}
        />
        <Crescent
          cx={1240}
          cy={220}
          halo={110}
          moon={74}
          shadow={[1270, 200, 68]}
        />
        <circle cx="960" cy="700" r="230" fill={PLUM} />
        <circle cx="1400" cy="860" r="160" fill={PLUM} opacity="0.7" />
        <circle cx="80" cy="900" r="160" fill={PLUM} opacity="0.45" />
      </svg>
    </>
  );
}
