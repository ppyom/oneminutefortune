import { sendGAEvent } from "@next/third-parties/google";
import { GA_ID } from "@/lib/site";

/*
 * GA4 퍼널 이벤트: 입력 → 결과 → 공유.
 * 생년월일·이름이 파라미터로 새지 않도록 이벤트별 파라미터를 타입으로 고정한다.
 */
export type AnalyticsEvents = {
  fortune_submit: Record<string, never>;
  share: { method: "web_share" | "copy_link" };
  save_image: { method: "download" | "in_app_preview" };
  landing_cta_click: Record<string, never>;
};

/**
 * GA4 커스텀 이벤트를 보낸다. `GA_ID`가 없으면(로컬·미설정 배포) 아무것도 하지 않는다.
 * @param event 이벤트 이름
 * @param params 이벤트 파라미터 — 개인정보(생년월일·이름)는 넣지 않는다
 */
export function track<E extends keyof AnalyticsEvents>(
  event: E,
  ...[params]: AnalyticsEvents[E] extends Record<string, never>
    ? []
    : [AnalyticsEvents[E]]
): void {
  if (!GA_ID) return;
  sendGAEvent("event", event, params ?? {});
}
