import type { Ymd } from "./types";

/** 한국은 서머타임이 없으므로 항상 UTC+9 */
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const pad = (n: number, len = 2) => String(n).padStart(len, "0");

/** 주어진 시각의 KST 날짜를 `YYYYMMDD`로. 클라이언트 시간대와 무관. */
export function toKstYmd(at: Date): Ymd {
  const k = new Date(at.getTime() + KST_OFFSET_MS);
  return `${pad(k.getUTCFullYear(), 4)}${pad(k.getUTCMonth() + 1)}${pad(k.getUTCDate())}`;
}

/** 오늘(KST). 현재 시각을 읽는 유일한 곳 — getFortune 안에서는 쓰지 않는다. */
export function todayKst(now: Date = new Date()): Ymd {
  return toKstYmd(now);
}

/** 실제로 존재하는 1900-01-01 이후 날짜인지 */
export function isValidYmd(s: string): boolean {
  if (!/^\d{8}$/.test(s)) return false;
  const y = Number(s.slice(0, 4));
  const m = Number(s.slice(4, 6));
  const d = Number(s.slice(6, 8));
  if (y < 1900) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

/** 공유 링크 id `YYYYMMDD-YYYYMMDD`(생년월일-날짜) 파싱. 잘못되면 null. */
export function parseShareId(id: string): { birth: Ymd; date: Ymd } | null {
  const m = /^(\d{8})-(\d{8})$/.exec(id);
  if (!m) return null;
  const [, birth, date] = m;
  if (!isValidYmd(birth) || !isValidYmd(date)) return null;
  return { birth, date };
}

export function toShareId(birth: Ymd, date: Ymd): string {
  return `${birth}-${date}`;
}
