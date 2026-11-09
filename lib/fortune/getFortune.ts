import poolJson from "@/data/fortune.json";
import versionsJson from "@/data/pool-versions.json";
import { isValidYmd } from "./date";
import { rngFor } from "./seed";
import {
  FIELDS,
  GRADES,
  LUCKY_LISTS,
  type FieldFortune,
  type Fortune,
  type FortunePool,
  type Grade,
  type PoolVersion,
  type Ymd,
} from "./types";

/*
 * 결과 안정성 규칙
 * ----------------
 * - 문장은 `floor(rng() * counts[칸])`으로 고른다. counts는 해당 날짜에 유효한
 *   pool-versions 항목의 값이라, 문장을 배열 끝에 추가해도 freeze 전에는 무시되고,
 *   freeze 후에도 그 `from` 이전 날짜의 결과는 바뀌지 않는다.
 * - salt마다 PRNG가 따로라 한 항목의 변경이 다른 항목에 번지지 않는다.
 * - 아래 각 salt 안의 rng() 호출 순서는 고정이다. 바꾸면 결과가 바뀐다.
 *   새 값이 필요하면 해당 salt의 마지막에 호출을 추가하거나 새 salt를 만든다.
 */

/** 점수 구간. caution ≈ 15%, normal 35%, good 35%, best 15% */
const SCORE_BANDS: ReadonlyArray<{ upTo: number; min: number; max: number }> = [
  { upTo: 0.15, min: 0, max: 39 },
  { upTo: 0.5, min: 40, max: 64 },
  { upTo: 0.85, min: 65, max: 84 },
  { upTo: 1, min: 85, max: 100 },
];

export function gradeOf(score: number): Grade {
  if (score >= 85) return "best";
  if (score >= 65) return "good";
  if (score >= 40) return "normal";
  return "caution";
}

export function starsOf(score: number): number {
  switch (gradeOf(score)) {
    case "best":
      return 5;
    case "good":
      return 4;
    case "normal":
      return 3;
    case "caution":
      return score >= 20 ? 2 : 1;
  }
}

/** rng 2회 사용: 구간 선택 → 구간 내 점수 */
function drawScore(rng: () => number): number {
  const u = rng();
  const band = SCORE_BANDS.find((b) => u < b.upTo) ?? SCORE_BANDS.at(-1)!;
  return band.min + Math.floor(rng() * (band.max - band.min + 1));
}

/** 풀이 가진 모든 칸 키 (lucky.number 범위 제외) */
export function poolKeys(pool: FortunePool): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const g of GRADES) {
    out[`total.${g}.summary`] = pool.total[g].summary;
    out[`total.${g}.detail`] = pool.total[g].detail;
  }
  for (const f of FIELDS) for (const g of GRADES) out[`${f}.${g}`] = pool[f][g];
  for (const k of LUCKY_LISTS) out[`lucky.${k}`] = pool.lucky[k];
  return out;
}

/** 버전 목록이 풀과 맞는지 검사. 어긋나면 결과가 흔들릴 수 있으므로 즉시 던진다. */
export function validateVersions(
  pool: FortunePool,
  versions: PoolVersion[],
): void {
  if (versions.length === 0) throw new Error("pool-versions: 항목이 없음");
  const keys = poolKeys(pool);
  versions.forEach((v, i) => {
    if (!isValidYmd(v.from))
      throw new Error(`pool-versions[${i}]: from 형식 오류 "${v.from}"`);
    const prev = versions[i - 1];
    if (prev && v.from <= prev.from)
      throw new Error(`pool-versions[${i}]: from이 오름차순이 아님`);
    for (const [key, arr] of Object.entries(keys)) {
      const n = v.counts[key];
      if (!Number.isInteger(n) || n < 1)
        throw new Error(`pool-versions[${i}]: "${key}" 개수 없음`);
      if (n > arr.length)
        throw new Error(
          `pool-versions[${i}]: "${key}" ${n}개 기록, 실제 ${arr.length}개 (문장이 삭제됨?)`,
        );
      if (prev && n < prev.counts[key])
        throw new Error(`pool-versions[${i}]: "${key}" 개수가 줄어듦`);
    }
  });
}

/** date에 유효한 버전. 첫 버전 이전 날짜는 첫 버전을 쓴다. */
export function versionAt(versions: PoolVersion[], date: Ymd): PoolVersion {
  let found = versions[0];
  for (const v of versions) if (v.from <= date) found = v;
  return found;
}

export function createGetFortune(pool: FortunePool, versions: PoolVersion[]) {
  validateVersions(pool, versions);
  const keys = poolKeys(pool);

  return function getFortune(birth: Ymd, date: Ymd): Fortune {
    if (!isValidYmd(birth)) throw new Error(`잘못된 생년월일: "${birth}"`);
    if (!isValidYmd(date)) throw new Error(`잘못된 날짜: "${date}"`);

    const { counts } = versionAt(versions, date);
    const pick = (key: string, rng: () => number): string =>
      keys[key][Math.floor(rng() * counts[key])];

    // total: 점수(2) → summary(1) → detail(1)
    const rTotal = rngFor(birth, date, "total");
    const totalScore = drawScore(rTotal);
    const totalGrade = gradeOf(totalScore);
    const summary = pick(`total.${totalGrade}.summary`, rTotal);
    const detail = pick(`total.${totalGrade}.detail`, rTotal);

    // 분야별: 점수(2) → 문장(1)
    const fields = {} as Record<(typeof FIELDS)[number], FieldFortune>;
    for (const f of FIELDS) {
      const r = rngFor(birth, date, f);
      const score = drawScore(r);
      const grade = gradeOf(score);
      fields[f] = {
        score,
        grade,
        stars: starsOf(score),
        text: pick(`${f}.${grade}`, r),
      };
    }

    // lucky: color → number → direction → item
    const rLucky = rngFor(birth, date, "lucky");
    const color = pick("lucky.color", rLucky);
    const [nMin, nMax] = pool.lucky.number;
    const number = nMin + Math.floor(rLucky() * (nMax - nMin + 1));
    const direction = pick("lucky.direction", rLucky);
    const item = pick("lucky.item", rLucky);

    return {
      birth,
      date,
      total: { score: totalScore, grade: totalGrade, summary, detail },
      fields,
      lucky: { color, number, direction, item },
    };
  };
}

/** 같은 (birth, date)면 항상 같은 결과. 클라이언트·OG 이미지 공용. */
export const getFortune = createGetFortune(
  poolJson as FortunePool,
  versionsJson as PoolVersion[],
);
