"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * 수동 디스플레이 광고 자리. 게시자 ID·광고 단위 ID가 없으면 아무것도 그리지 않는다.
 * 크기를 미리 잡아 레이아웃이 밀리지 않게 하고(모바일 320×100, 태블릿 이상 728×90),
 * 광고가 채워지지 않으면(unfilled) 자리째 숨긴다.
 */
export function AdSlot({ slot }: { slot?: string }) {
  const pushed = useRef(false);
  const enabled = Boolean(ADSENSE_CLIENT && slot);

  useEffect(() => {
    if (!enabled || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 광고 차단기 등 — 광고 없이 계속
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <aside
      aria-label="광고"
      className="flex flex-col items-center gap-1.5 has-[ins[data-ad-status=unfilled]]:hidden"
    >
      <span className="text-[11px] text-cream/70">광고</span>
      <div className="h-[100px] w-full max-w-[320px] overflow-hidden tablet:h-[90px] tablet:max-w-[728px]">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="horizontal"
          data-full-width-responsive="false"
        />
      </div>
    </aside>
  );
}
