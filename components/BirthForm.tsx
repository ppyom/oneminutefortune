"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState, useSyncExternalStore } from "react";
import { useTodayKst } from "@/components/TodayLabel";
import {
  BIRTH_ERROR_MESSAGE,
  formatBirthDigits,
  NAME_MAX_LENGTH,
  nextBirthDigits,
  normalizeName,
  validateBirth,
  type BirthError,
} from "@/lib/birth";
import { todayKst } from "@/lib/fortune/date";
import {
  getProfile,
  getServerProfile,
  saveProfile,
  subscribeProfile,
} from "@/lib/storage";

const fieldClass =
  "h-13.5 w-full rounded-[14px] border border-cream/22 bg-night/45 px-4 text-[17px] text-cream outline-none transition-colors placeholder:text-cream/45 focus-visible:border-cream/70 focus-visible:ring-2 focus-visible:ring-cream/25 aria-invalid:border-cream/70 tablet:h-14.5 tablet:rounded-2xl tablet:px-4.5 tablet:text-lg desktop:h-14 desktop:text-[17px]";
const labelClass = "text-[13px] leading-[normal] font-semibold tablet:text-sm";

/** 생년월일·이름 입력 카드. 다시 방문하면 저장된 값을 채워 둔다. */
export function BirthForm() {
  const router = useRouter();
  const id = useId();
  const birthRef = useRef<HTMLInputElement>(null);
  const today = useTodayKst();
  const stored = useSyncExternalStore(
    subscribeProfile,
    getProfile,
    getServerProfile,
  );

  // null = 아직 손대지 않음 → 저장된 값을 보여 준다
  const [birthDraft, setBirthDraft] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [error, setError] = useState<BirthError | null>(null);

  const birthDigits = birthDraft ?? stored?.birth ?? "";
  const name = nameDraft ?? stored?.name ?? "";
  const errorId = `${id}-birth-error`;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = validateBirth(birthDigits, today || todayKst());
    if (!result.ok) {
      setError(result.error);
      birthRef.current?.focus();
      return;
    }
    const cleanName = normalizeName(name);
    saveProfile({ birth: result.birth, name: cleanName || undefined });
    router.push("/result");
  }

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-4.5 rounded-[28px] px-5 py-6 glass tablet:gap-5 tablet:p-8 desktop:p-9"
      >
        <h2 className="hidden font-display text-2xl desktop:block">
          내 운세 확인하기
        </h2>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-birth`} className={labelClass}>
            생년월일
          </label>
          <input
            ref={birthRef}
            id={`${id}-birth`}
            name="birth"
            type="text"
            inputMode="numeric"
            autoComplete="bday"
            placeholder="1995. 03. 14"
            maxLength={12}
            value={formatBirthDigits(birthDigits)}
            onChange={(e) => {
              setBirthDraft(nextBirthDigits(birthDigits, e.target.value));
              setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={fieldClass}
          />
          <p
            id={errorId}
            role="alert"
            className="flex min-h-0 items-center gap-1.5 text-[13px] text-cream/88 empty:hidden"
          >
            {error && (
              <>
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  className="size-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="8" cy="8" r="6.25" />
                  <path d="M8 4.75v3.75" strokeLinecap="round" />
                  <circle cx="8" cy="11" r="0.5" fill="currentColor" />
                </svg>
                {BIRTH_ERROR_MESSAGE[error]}
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-name`} className={labelClass}>
            이름 <span className="font-normal text-cream/70">(선택)</span>
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="nickname"
            enterKeyHint="go"
            placeholder="결과 카드에 보여질 이름"
            maxLength={NAME_MAX_LENGTH}
            value={name}
            onChange={(e) => setNameDraft(e.target.value)}
            className={fieldClass}
          />
        </div>

        <button
          type="submit"
          className="mt-1 flex h-14 items-center justify-center rounded-2xl bg-cream text-[17px] font-semibold text-night transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-night focus-visible:outline-none active:opacity-80 tablet:h-15 tablet:rounded-[18px] tablet:text-lg desktop:h-14.5 desktop:text-[17px]"
        >
          오늘 운세 보기
        </button>

        <p className="hidden text-center text-[13px] text-cream/72 desktop:block">
          입력한 정보는 이 기기에만 저장돼요
        </p>
      </form>

      <p className="mt-4 text-center text-xs text-cream/70 tablet:mt-5 tablet:text-[13px] tablet:text-cream/72 desktop:hidden">
        입력한 정보는 이 기기에만 저장돼요
      </p>
    </>
  );
}
