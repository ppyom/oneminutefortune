/*
 * 공유 랜딩 배경 (design/Share·TabletShare·DesktopShare의 SVG 좌표 그대로).
 * 모바일·태블릿은 위쪽 기준, 데스크톱은 본문이 세로 가운데라 가운데 기준.
 */
const PLUM = "#8A2A78";
const CREAM = "#EEE3B0";

const svgBase =
  "pointer-events-none absolute left-1/2 -z-10 max-w-none -translate-x-1/2";

export function ShareBackdrop() {
  return (
    <>
      <svg
        aria-hidden
        width="390"
        height="844"
        viewBox="0 0 390 844"
        className={`${svgBase} top-0 tablet:hidden`}
      >
        <circle cx="60" cy="60" r="1.5" fill={CREAM} opacity="0.7" />
        <circle cx="200" cy="30" r="1" fill={CREAM} opacity="0.6" />
        <circle cx="360" cy="120" r="1.5" fill={CREAM} opacity="0.7" />
        <circle cx="320" cy="330" r="120" fill={PLUM} />
        <circle cx="300" cy="300" r="48" fill={CREAM} />
        <circle cx="318" cy="288" r="44" fill={PLUM} />
        <circle cx="40" cy="560" r="100" fill={PLUM} opacity="0.8" />
      </svg>

      <svg
        aria-hidden
        width="834"
        height="1194"
        viewBox="0 0 834 1194"
        className={`${svgBase} top-0 hidden tablet:block desktop:hidden`}
      >
        <circle cx="90" cy="110" r="1.5" fill={CREAM} opacity="0.7" />
        <circle cx="420" cy="60" r="1" fill={CREAM} opacity="0.6" />
        <circle cx="760" cy="140" r="1.5" fill={CREAM} opacity="0.7" />
        <circle cx="640" cy="560" r="190" fill={PLUM} />
        <circle cx="610" cy="500" r="64" fill={CREAM} />
        <circle cx="634" cy="484" r="58" fill={PLUM} />
        <circle cx="120" cy="860" r="150" fill={PLUM} opacity="0.8" />
      </svg>

      <svg
        aria-hidden
        width="1440"
        height="900"
        viewBox="0 0 1440 900"
        className={`${svgBase} top-1/2 hidden -translate-y-1/2 desktop:block`}
      >
        <circle cx="180" cy="150" r="1.5" fill={CREAM} opacity="0.7" />
        <circle cx="520" cy="100" r="1" fill={CREAM} opacity="0.6" />
        <circle cx="640" cy="780" r="1.5" fill={CREAM} opacity="0.6" />
        <circle cx="1390" cy="110" r="1.5" fill={CREAM} opacity="0.7" />
        <circle cx="1080" cy="440" r="260" fill={PLUM} />
        <circle cx="1260" cy="250" r="70" fill={CREAM} />
        <circle cx="1288" cy="232" r="64" fill={PLUM} />
        <circle cx="120" cy="880" r="170" fill={PLUM} opacity="0.55" />
      </svg>
    </>
  );
}
