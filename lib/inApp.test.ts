import { describe, expect, it } from "vitest";
import { detectInAppBrowser, kakaoOpenExternalUrl } from "./inApp";

describe("detectInAppBrowser", () => {
  it.each([
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 KAKAOTALK 10.9.0",
      "kakaotalk",
    ],
    [
      "Mozilla/5.0 (Linux; Android 14; SM-S918N Build/UP1A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0 Mobile Safari/537.36;KAKAOTALK 2410960",
      "kakaotalk",
    ],
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 340.0.2.18.104 (iPhone15,2; iOS 17_5)",
      "other",
    ],
    [
      "Mozilla/5.0 (Linux; Android 14; wv) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/475.0.0.0;]",
      "other",
    ],
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Line/14.10.0",
      "other",
    ],
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 NAVER(inapp; search; 2000; 12.6.4)",
      "other",
    ],
  ])("인앱: %s", (ua, expected) => {
    expect(detectInAppBrowser(ua)).toBe(expected);
  });

  it.each([
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
    // 'Line' 이 단어 중간에 들어간 일반 UA는 인앱이 아니다
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36",
  ])("일반 브라우저: %s", (ua) => {
    expect(detectInAppBrowser(ua)).toBeNull();
  });
});

describe("kakaoOpenExternalUrl", () => {
  it("url을 인코딩한다", () => {
    expect(kakaoOpenExternalUrl("https://a.app/api/og?id=1-2&n=지민")).toBe(
      `kakaotalk://web/openExternal?url=${encodeURIComponent("https://a.app/api/og?id=1-2&n=지민")}`,
    );
  });
});
