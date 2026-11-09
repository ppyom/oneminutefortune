"use client";

import { useSyncExternalStore } from "react";
import { formatKoreanDate } from "@/lib/birth";
import { todayKst } from "@/lib/fortune/date";

// 탭으로 돌아올 때 날짜를 다시 읽는다 (자정이 지났을 수 있음)
function subscribe(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/** 오늘(KST) 날짜. 서버에서는 비워 두고 브라우저에서 채운다 (정적 페이지라 빌드 날짜가 박히지 않게) */
export function useTodayKst(): string {
  return useSyncExternalStore(
    subscribe,
    () => todayKst(),
    () => "",
  );
}

export function TodayLabel({ className }: { className?: string }) {
  const today = useTodayKst();
  return (
    <span className={className}>
      {today && (
        <time
          dateTime={`${today.slice(0, 4)}-${today.slice(4, 6)}-${today.slice(6)}`}
        >
          <span className="desktop:hidden">{formatKoreanDate(today)}</span>
          <span className="hidden desktop:inline">
            {formatKoreanDate(today, true)}
          </span>
        </time>
      )}
    </span>
  );
}
