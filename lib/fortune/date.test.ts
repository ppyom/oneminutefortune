import { afterEach, describe, expect, it, vi } from "vitest";
import { isValidYmd, parseShareId, toKstYmd, todayKst } from "./date";

describe("toKstYmd — KST 자정 경계", () => {
  it.each([
    ["2026-11-09T14:59:59.999Z", "20261109"],
    ["2026-11-09T15:00:00.000Z", "20261110"],
    // 월말
    ["2026-11-30T14:59:59Z", "20261130"],
    ["2026-11-30T15:00:00Z", "20261201"],
    // 연말
    ["2026-12-31T14:59:59Z", "20261231"],
    ["2026-12-31T15:00:00Z", "20270101"],
    // 윤년
    ["2028-02-28T15:00:00Z", "20280229"],
    ["2028-02-29T15:00:00Z", "20280301"],
  ])("%s → %s", (iso, expected) => {
    expect(toKstYmd(new Date(iso))).toBe(expected);
  });

  it("다른 시간대 표기라도 같은 순간이면 같은 날짜", () => {
    expect(toKstYmd(new Date("2026-11-09T23:59:59-09:00"))).toBe("20261110");
    expect(toKstYmd(new Date("2026-11-10T00:00:00+09:00"))).toBe("20261110");
    expect(toKstYmd(new Date("2026-11-09T23:59:59+09:00"))).toBe("20261109");
  });
});

describe("todayKst", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("UTC 14:59 → 당일, 15:00 → 다음 날", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-09T14:59:00Z"));
    expect(todayKst()).toBe("20261109");
    vi.setSystemTime(new Date("2026-11-09T15:00:00Z"));
    expect(todayKst()).toBe("20261110");
  });
});

describe("isValidYmd", () => {
  it.each(["19950312", "20000229", "19000101", "20261231"])("유효: %s", (s) =>
    expect(isValidYmd(s)).toBe(true),
  );
  it.each([
    "19990229", // 평년 2/29
    "20261301",
    "20261100",
    "18991231", // 1900 이전
    "2026119",
    "2026-11-09",
    "abcdefgh",
    "",
  ])("무효: %s", (s) => expect(isValidYmd(s)).toBe(false));
});

describe("parseShareId", () => {
  it("생년월일-날짜", () => {
    expect(parseShareId("19950312-20261109")).toEqual({
      birth: "19950312",
      date: "20261109",
    });
  });
  it.each(["19950312", "19950312-2026110", "19950230-20261109", "x-y"])(
    "잘못된 id: %s",
    (id) => expect(parseShareId(id)).toBeNull(),
  );
});
