import { describe, expect, it } from "vitest";
import poolJson from "@/data/fortune.json";
import versionsJson from "@/data/pool-versions.json";
import {
  createGetFortune,
  getFortune,
  gradeOf,
  poolKeys,
  starsOf,
  validateVersions,
  versionAt,
} from "./getFortune";
import { FIELDS, type FortunePool, type PoolVersion } from "./types";

const pool = poolJson as FortunePool;
const versions = versionsJson as PoolVersion[];

/** 1960–2009년생 × 2026-11-09부터 n일. 결정적 입력 생성 */
function* sampleInputs(nBirth: number, nDays: number) {
  for (let i = 0; i < nBirth; i++) {
    const y = 1960 + (i % 50);
    const m = 1 + ((i * 7) % 12);
    const d = 1 + ((i * 13) % 28);
    const birth = `${y}${String(m).padStart(2, "0")}${String(d).padStart(2, "0")}`;
    for (let j = 0; j < nDays; j++) {
      const dt = new Date(Date.UTC(2026, 10, 9 + j));
      const date = `${dt.getUTCFullYear()}${String(dt.getUTCMonth() + 1).padStart(2, "0")}${String(dt.getUTCDate()).padStart(2, "0")}`;
      yield [birth, date] as const;
    }
  }
}

describe("결정성", () => {
  it("같은 입력 → 같은 결과", () => {
    const first = getFortune("19950312", "20261109");
    for (let i = 0; i < 100; i++)
      expect(getFortune("19950312", "20261109")).toEqual(first);
  });

  it("입력이 바뀌면 결과도 대체로 바뀐다", () => {
    const base = JSON.stringify(getFortune("19950312", "20261109"));
    const others = [
      getFortune("19950313", "20261109"),
      getFortune("19950312", "20261110"),
      getFortune("19960312", "20261109"),
    ].map((f) => JSON.stringify(f));
    expect(others.some((o) => o !== base)).toBe(true);
  });

  it("잘못된 입력은 예외", () => {
    expect(() => getFortune("19950230", "20261109")).toThrow();
    expect(() => getFortune("19950312", "2026-11-09")).toThrow();
  });
});

describe("결과 형식", () => {
  it("점수·등급·별점·문장이 일관된다", () => {
    for (const [b, d] of sampleInputs(30, 10)) {
      const f = getFortune(b, d);
      expect(f.total.grade).toBe(gradeOf(f.total.score));
      expect(pool.total[f.total.grade].summary).toContain(f.total.summary);
      expect(pool.total[f.total.grade].detail).toContain(f.total.detail);
      for (const k of FIELDS) {
        const x = f.fields[k];
        expect(x.stars).toBeGreaterThanOrEqual(1);
        expect(x.stars).toBeLessThanOrEqual(5);
        expect(x.stars).toBe(starsOf(x.score));
        expect(pool[k][x.grade]).toContain(x.text);
      }
      expect(f.lucky.number).toBeGreaterThanOrEqual(pool.lucky.number[0]);
      expect(f.lucky.number).toBeLessThanOrEqual(pool.lucky.number[1]);
    }
  });

  it("등급 경계", () => {
    expect([100, 85, 84, 65, 64, 40, 39, 0].map(gradeOf)).toEqual([
      "best",
      "best",
      "good",
      "good",
      "normal",
      "normal",
      "caution",
      "caution",
    ]);
    expect([39, 20, 19, 0].map(starsOf)).toEqual([2, 2, 1, 1]);
  });
});

describe("분포", () => {
  it("총운 caution 비율 약 15% (12–18%)", () => {
    let total = 0;
    let caution = 0;
    for (const [b, d] of sampleInputs(500, 20)) {
      total++;
      if (getFortune(b, d).total.grade === "caution") caution++;
    }
    const ratio = caution / total;
    expect(ratio).toBeGreaterThan(0.12);
    expect(ratio).toBeLessThan(0.18);
  });
});

describe("스냅샷 — 이미 공유된 결과가 바뀌면 안 됨", () => {
  it.each([
    ["19950312", "20261109"],
    ["20000229", "20261109"], // 윤년 생일
    ["19681225", "20261110"],
    ["20090101", "20261231"],
    ["19801010", "20270101"],
  ])("%s / %s", (birth, date) => {
    expect(getFortune(birth, date)).toMatchSnapshot();
  });
});

describe("문장 추가 안정성 (A안: 날짜별 풀 버전)", () => {
  /** 모든 칸 끝에 더미 문장을 n개씩 붙인 풀 */
  function grownPool(n: number): FortunePool {
    const p = structuredClone(pool);
    for (const arr of Object.values(poolKeys(p)))
      for (let i = 0; i < n; i++) arr.push(`추가 문장 ${arr.length}`);
    return p;
  }

  function freeze(p: FortunePool, from: string): PoolVersion[] {
    const counts = Object.fromEntries(
      Object.entries(poolKeys(p)).map(([k, arr]) => [k, arr.length]),
    );
    return [...versions, { from, counts }];
  }

  const NEW_FROM = "20261201";

  it("문장만 추가하고 freeze 안 하면 모든 결과가 그대로", () => {
    const g = createGetFortune(grownPool(20), versions);
    for (const [b, d] of sampleInputs(50, 60))
      expect(g(b, d)).toEqual(getFortune(b, d));
  });

  it("freeze 후에도 from 이전 날짜의 결과는 그대로", () => {
    const p = grownPool(20);
    const g = createGetFortune(p, freeze(p, NEW_FROM));
    let checked = 0;
    for (const [b, d] of sampleInputs(50, 60)) {
      if (d >= NEW_FROM) continue;
      expect(g(b, d)).toEqual(getFortune(b, d));
      checked++;
    }
    expect(checked).toBeGreaterThan(0);
  });

  it("from 이후에는 새 문장이 실제로 쓰인다", () => {
    const p = grownPool(20);
    const g = createGetFortune(p, freeze(p, NEW_FROM));
    const used = [...sampleInputs(50, 30)]
      .map(([b]) => g(b, "20261215").total.summary)
      .some((s) => s.startsWith("추가 문장"));
    expect(used).toBe(true);
  });
});

describe("pool-versions 검증", () => {
  it("현재 데이터가 유효하다", () => {
    expect(() => validateVersions(pool, versions)).not.toThrow();
  });

  it("문장이 삭제되면 거부", () => {
    const p = structuredClone(pool);
    p.love.best.pop();
    expect(() => validateVersions(p, versions)).toThrow(/love\.best/);
  });

  it("개수가 줄어든 버전은 거부", () => {
    const bad: PoolVersion[] = [
      ...versions,
      {
        from: "20261201",
        counts: { ...versions[0].counts, "work.good": 2 },
      },
    ];
    expect(() => validateVersions(pool, bad)).toThrow(/줄어듦/);
  });

  it("from 순서가 틀리면 거부", () => {
    const bad = [...versions, { ...versions[0] }];
    expect(() => validateVersions(pool, bad)).toThrow(/오름차순/);
  });

  it("versionAt: 날짜에 맞는 버전 선택", () => {
    const vs: PoolVersion[] = [
      { from: "20261109", counts: {} },
      { from: "20261201", counts: {} },
    ];
    expect(versionAt(vs, "20261101").from).toBe("20261109");
    expect(versionAt(vs, "20261130").from).toBe("20261109");
    expect(versionAt(vs, "20261201").from).toBe("20261201");
    expect(versionAt(vs, "20270101").from).toBe("20261201");
  });
});
