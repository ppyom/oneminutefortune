/*
 * 결과 화면 배경 (design/Result·TabletResult·DesktopResult의 SVG 좌표 그대로).
 * 세로로 스크롤되는 화면이라 모두 위쪽 기준으로 고정 크기 SVG를 가운데에 둔다.
 */
const PLUM = "#8A2A78";
const CREAM = "#EEE3B0";

const svgBase =
  "pointer-events-none absolute top-0 left-1/2 -z-10 max-w-none -translate-x-1/2";

export function ResultBackdrop() {
  return (
    <>
      <svg
        aria-hidden
        width="390"
        height="1780"
        viewBox="0 0 390 1780"
        className={`${svgBase} tablet:hidden`}
      >
        <circle cx="340" cy="230" r="120" fill={PLUM} />
        <circle cx="318" cy="150" r="22" fill={CREAM} opacity="0.9" />
        <circle cx="30" cy="470" r="110" fill={PLUM} opacity="0.8" />
        <circle cx="370" cy="780" r="90" fill={PLUM} opacity="0.7" />
        <circle cx="50" cy="1020" r="100" fill={PLUM} opacity="0.8" />
        <circle cx="360" cy="1500" r="110" fill={PLUM} opacity="0.6" />
      </svg>

      <svg
        aria-hidden
        width="834"
        height="1480"
        viewBox="0 0 834 1480"
        className={`${svgBase} hidden tablet:block desktop:hidden`}
      >
        <circle cx="740" cy="300" r="170" fill={PLUM} />
        <circle cx="700" cy="190" r="28" fill={CREAM} opacity="0.9" />
        <circle cx="60" cy="640" r="150" fill={PLUM} opacity="0.8" />
        <circle cx="790" cy="900" r="130" fill={PLUM} opacity="0.7" />
        <circle cx="100" cy="1250" r="140" fill={PLUM} opacity="0.6" />
      </svg>

      <svg
        aria-hidden
        width="1440"
        height="1240"
        viewBox="0 0 1440 1240"
        className={`${svgBase} hidden desktop:block`}
      >
        <circle cx="380" cy="380" r="230" fill={PLUM} />
        <circle cx="470" cy="210" r="30" fill={CREAM} opacity="0.9" />
        <circle cx="1380" cy="420" r="180" fill={PLUM} opacity="0.75" />
        <circle cx="900" cy="900" r="200" fill={PLUM} opacity="0.7" />
        <circle cx="80" cy="1100" r="160" fill={PLUM} opacity="0.5" />
        <circle cx="1300" cy="140" r="1.5" fill={CREAM} opacity="0.7" />
        <circle cx="760" cy="120" r="1" fill={CREAM} opacity="0.6" />
      </svg>
    </>
  );
}
