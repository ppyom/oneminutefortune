/*
 * 인앱 브라우저 감지 (카카오톡·인스타그램 등).
 * 인앱 브라우저는 blob URL을 <a download>로 내려받지 못해, 이미지 저장을
 * "길게 눌러 저장" 안내로 대신한다.
 */
export type InAppBrowser = "kakaotalk" | "other";

const OTHER_IN_APP =
  /Instagram|FBAN|FBAV|FB_IAB|\bLine\/|NAVER\(inapp|DaumApps|everytimeApp|\bBAND\//i;

export function detectInAppBrowser(userAgent: string): InAppBrowser | null {
  if (/KAKAOTALK/i.test(userAgent)) return "kakaotalk";
  if (OTHER_IN_APP.test(userAgent)) return "other";
  return null;
}

/** 카카오톡 인앱 브라우저에서 기본 브라우저로 url을 연다 */
export function kakaoOpenExternalUrl(url: string): string {
  return `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`;
}
