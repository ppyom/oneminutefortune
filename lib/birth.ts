import { isValidYmd } from "@/lib/fortune/date";
import type { Ymd } from "@/lib/fortune/types";

/** 입력값에서 숫자만 최대 8자리 */
export function toBirthDigits(input: string): string {
  return input.replace(/\D/g, "").slice(0, 8);
}

/** 숫자 → 화면 표시용 `1995. 03. 14` (입력 중인 값도 처리) */
export function formatBirthDigits(digits: string): string {
  const y = digits.slice(0, 4);
  const m = digits.slice(4, 6);
  const d = digits.slice(6, 8);
  if (digits.length <= 4) return y;
  if (digits.length <= 6) return `${y}. ${m}`;
  return `${y}. ${m}. ${d}`;
}

/**
 * 입력창 onChange 처리. 구분자(". ")만 지운 경우엔 숫자가 그대로라
 * 지워지지 않는 것처럼 보이므로, 앞쪽 숫자 하나를 함께 지운다.
 */
export function nextBirthDigits(prevDigits: string, rawValue: string): string {
  const digits = toBirthDigits(rawValue);
  const prevShown = formatBirthDigits(prevDigits);
  if (digits === prevDigits && rawValue.length < prevShown.length) {
    return prevDigits.slice(0, -1);
  }
  return digits;
}

export type BirthError = "incomplete" | "invalid" | "tooOld" | "future";

export const BIRTH_ERROR_MESSAGE: Record<BirthError, string> = {
  incomplete: "생년월일 8자리를 입력해 주세요.",
  invalid: "날짜를 다시 확인해 주세요.",
  tooOld: "1900년 이후 날짜로 입력해 주세요.",
  future: "오늘 이후 날짜는 입력할 수 없어요.",
};

export function validateBirth(
  digits: string,
  today: Ymd,
): { ok: true; birth: Ymd } | { ok: false; error: BirthError } {
  if (digits.length !== 8) return { ok: false, error: "incomplete" };
  if (digits < "19000101") return { ok: false, error: "tooOld" };
  if (!isValidYmd(digits)) return { ok: false, error: "invalid" };
  if (digits > today) return { ok: false, error: "future" };
  return { ok: true, birth: digits };
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** `20261109` → `11월 9일 월요일` (withYear면 `2026년 11월 9일 월요일`) */
export function formatKoreanDate(ymd: Ymd, withYear = false): string {
  const y = Number(ymd.slice(0, 4));
  const m = Number(ymd.slice(4, 6));
  const d = Number(ymd.slice(6, 8));
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${withYear ? `${y}년 ` : ""}${m}월 ${d}일 ${weekday}요일`;
}

export const NAME_MAX_LENGTH = 12;

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ").slice(0, NAME_MAX_LENGTH);
}
