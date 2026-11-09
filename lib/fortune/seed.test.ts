import { describe, expect, it } from "vitest";
import { cyrb53, mulberry32, rngFor } from "./seed";

describe("cyrb53", () => {
  it("참조 구현과 같은 값을 낸다", () => {
    // bryc 원본 README의 참조값
    expect(cyrb53("a")).toBe(7929297801672961);
    expect(cyrb53("b")).toBe(8684336938537663);
    expect(cyrb53("revenge")).toBe(4051478007546757);
    expect(cyrb53("revenue")).toBe(8309097637345594);
  });

  it("53비트 범위 정수", () => {
    const h = cyrb53("1995031220261109:total");
    expect(Number.isSafeInteger(h)).toBe(true);
    expect(h).toBeGreaterThanOrEqual(0);
  });
});

describe("mulberry32", () => {
  it("같은 시드면 같은 수열", () => {
    const a = mulberry32(12345);
    const b = mulberry32(12345);
    for (let i = 0; i < 100; i++) expect(a()).toBe(b());
  });

  it("[0, 1) 범위", () => {
    const r = mulberry32(42);
    for (let i = 0; i < 10000; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("수열 고정 (바뀌면 모든 운세 결과가 바뀜)", () => {
    const r = mulberry32(1);
    expect([r(), r(), r()]).toMatchSnapshot();
  });
});

describe("rngFor", () => {
  it("salt가 다르면 수열이 다르다", () => {
    const a = rngFor("19950312", "20261109", "love")();
    const b = rngFor("19950312", "20261109", "money")();
    expect(a).not.toBe(b);
  });
});
