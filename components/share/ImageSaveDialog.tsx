"use client";

import { useEffect, useRef } from "react";
import { kakaoOpenExternalUrl } from "@/lib/inApp";

/**
 * 내려받기가 안 되는 환경(카카오톡·인스타그램 인앱 브라우저 등)에서
 * 결과 이미지를 띄우고 "길게 눌러 저장"을 안내한다.
 */
export function ImageSaveDialog({
  imageUrl,
  kakao,
  onClose,
}: {
  /** 절대 URL (카카오톡 외부 브라우저로 넘길 때 필요) */
  imageUrl: string;
  kakao: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="image-save-title"
      className="m-auto w-[calc(100%-32px)] max-w-140 rounded-[28px] p-0 text-cream glass backdrop:bg-night/75"
    >
      <div className="flex flex-col gap-4 p-5 tablet:p-6">
        <h2 id="image-save-title" className="font-display text-xl">
          이미지 저장
        </h2>
        {/* eslint-disable-next-line @next/next/no-img-element -- 동적 OG 이미지, 길게 눌러 저장할 수 있어야 한다 */}
        <img
          src={imageUrl}
          width={1200}
          height={630}
          alt="오늘의 운세 결과 이미지"
          className="aspect-[1200/630] h-auto w-full rounded-2xl border border-cream/20 bg-night"
        />
        <p className="text-center text-sm text-cream/88">
          이미지를 길게 눌러 저장해 주세요.
        </p>
        <div className="flex flex-col gap-2.5">
          {kakao && (
            <a
              href={kakaoOpenExternalUrl(imageUrl)}
              className="flex h-13 items-center justify-center rounded-2xl border-[1.5px] border-plum text-[15px] font-medium transition-colors hover:bg-plum/25 focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:outline-none"
            >
              다른 브라우저에서 열기
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-13 items-center justify-center rounded-2xl bg-cream text-[15px] font-semibold text-night transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-night focus-visible:outline-none"
          >
            닫기
          </button>
        </div>
      </div>
    </dialog>
  );
}
