"use client";

import { useEffect, useRef, useState } from "react";
import type { Ymd } from "@/lib/fortune/types";
import { ogResultPath, senderLabel, sharePath } from "@/lib/share";

/*
 * 결과 화면 공유 버튼 — 공유하기(Web Share API, 미지원 시 링크 복사) · 이미지 저장 · 링크 복사
 * 이미지 저장은 OG 결과 이미지(1200×630)를 그대로 내려받는다.
 */

const primary =
  "flex h-14 items-center justify-center rounded-2xl bg-cream text-[17px] font-semibold text-night transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-night focus-visible:outline-none active:opacity-80 disabled:opacity-60 tablet:h-14.5 tablet:rounded-[18px]";
const secondary =
  "flex h-13 items-center justify-center rounded-2xl border-[1.5px] border-plum text-[15px] font-medium text-cream transition-colors hover:bg-plum/25 focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:outline-none active:bg-plum/40 disabled:opacity-60 tablet:h-14.5 tablet:rounded-[18px] tablet:text-base desktop:h-13.5";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 권한이 없거나 http 환경 → 예전 방식
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

export function ShareActions({
  birth,
  date,
  name,
  layout,
}: {
  birth: Ymd;
  date: Ymd;
  name?: string;
  /** stack: 주요 버튼 + 보조 2개 (모바일·데스크톱) / row: 2:1:1 한 줄 (태블릿) */
  layout: "stack" | "row";
}) {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function notify(text: string) {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 3000);
  }

  const url = () => new URL(sharePath(birth, date, name), location.origin).href;

  async function copyLink() {
    notify(
      (await copyText(url()))
        ? "링크를 복사했어요"
        : "복사하지 못했어요. 주소창의 링크를 이용해 주세요",
    );
  }

  async function share() {
    const data = {
      title: "오늘의 운세",
      text: `${senderLabel(name)}의 오늘 운세를 확인해 보세요`,
      url: url(),
    };
    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      try {
        await navigator.share(data);
      } catch (e) {
        // 사용자가 공유 창을 닫은 경우는 조용히 넘어간다
        if ((e as Error).name !== "AbortError") await copyLink();
      }
      return;
    }
    await copyLink();
  }

  async function saveImage() {
    setSaving(true);
    try {
      const res = await fetch(ogResultPath(birth, date, name));
      if (!res.ok) throw new Error(String(res.status));
      const blobUrl = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `oneminutefortune-${date}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      notify("이미지를 저장했어요");
    } catch {
      notify("이미지를 저장하지 못했어요. 잠시 후 다시 시도해 주세요");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div
        className={
          layout === "row"
            ? "grid grid-cols-[2fr_1fr_1fr] gap-3"
            : "flex flex-col gap-2.5 desktop:gap-3"
        }
      >
        <button type="button" onClick={share} className={primary}>
          공유하기
        </button>
        <div
          className={
            layout === "row"
              ? "contents"
              : "grid grid-cols-2 gap-2.5 desktop:gap-3"
          }
        >
          <button
            type="button"
            onClick={saveImage}
            disabled={saving}
            className={secondary}
          >
            {saving ? "저장 중…" : "이미지 저장"}
          </button>
          <button type="button" onClick={copyLink} className={secondary}>
            링크 복사
          </button>
        </div>
      </div>
      <p
        role="status"
        className="min-h-5 text-center text-[13px] text-cream/80"
      >
        {message}
      </p>
    </div>
  );
}
