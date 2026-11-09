import { normalizeName } from "@/lib/birth";
import { parseShareId, toShareId } from "@/lib/fortune/date";
import type { Ymd } from "@/lib/fortune/types";

/*
 * 공유 링크: /s/{생년월일}-{날짜}[?n=이름]
 *  - 날짜가 URL에 있어야 카톡 미리보기 캐시를 피하고, 지난 링크도 그날 결과를 보여 준다.
 *  - 이름은 입력한 사람만 붙는다 (서버에 저장하지 않으므로 링크가 유일한 전달 수단).
 */
export const NAME_PARAM = "n";

/** 이름 쿼리 정리: 첫 값만, 제어 문자 제거, 공백 정리·12자 제한 */
export function parseShareName(
  raw: string | string[] | null | undefined,
): string | undefined {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (!v) return undefined;
  const clean = normalizeName(v.replace(/[\u0000-\u001f\u007f]/g, ""));
  return clean || undefined;
}

function withName(path: string, name?: string): string {
  const n = parseShareName(name);
  if (!n) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}${NAME_PARAM}=${encodeURIComponent(n)}`;
}

export function sharePath(birth: Ymd, date: Ymd, name?: string): string {
  return withName(`/s/${toShareId(birth, date)}`, name);
}

/** 결과 OG 이미지 (B). 이미지 저장에도 같은 이미지를 쓴다 */
export function ogResultPath(birth: Ymd, date: Ymd, name?: string): string {
  return withName(`/api/og?id=${toShareId(birth, date)}`, name);
}

/**
 * 공유 id 검증. 형식이 맞고, 날짜가 오늘(KST) 이전이어야 한다.
 * 미래 날짜를 막아 "내일 운세"를 링크로 미리 볼 수 없게 한다.
 */
export function parseShareTarget(
  id: string,
  today: Ymd,
): { birth: Ymd; date: Ymd } | null {
  const parsed = parseShareId(id);
  if (!parsed) return null;
  if (parsed.date > today || parsed.birth > parsed.date) return null;
  return parsed;
}

/** "지민님" / 이름이 없으면 "친구" */
export function senderLabel(name?: string): string {
  return name ? `${name}님` : "친구";
}
