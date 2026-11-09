/*
 * Google AdSense 설정. 값이 없거나 형식이 틀리면 광고 관련 코드를 아무것도 출력하지 않는다.
 *  - NEXT_PUBLIC_ADSENSE_CLIENT: 게시자 ID (ca-pub-0000000000000000)
 *    → 사이트 확인 스크립트·메타 태그, /ads.txt, 자동 광고
 *  - NEXT_PUBLIC_ADSENSE_SLOT_RESULT: 결과 화면 디스플레이 광고 단위 ID (숫자)
 * 자동 광고 켜기/끄기·페이지 제외는 애드센스 대시보드에서 한다.
 */

export function parseAdClient(raw: string | undefined): string | undefined {
  const v = raw?.trim();
  return v && /^ca-pub-\d{10,20}$/.test(v) ? v : undefined;
}

export function parseAdSlot(raw: string | undefined): string | undefined {
  const v = raw?.trim();
  return v && /^\d{5,20}$/.test(v) ? v : undefined;
}

export const ADSENSE_CLIENT = parseAdClient(
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
);
export const ADSENSE_SLOT_RESULT = parseAdSlot(
  process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULT,
);

/** /ads.txt 내용. f08c47fec0942fa0 은 Google의 인증 기관 ID(고정값) */
export function adsTxt(client: string): string {
  return `google.com, ${client.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`;
}

export function adsenseScriptSrc(client: string): string {
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
}
