import { describe, expect, it } from "vitest";
import {
  formatBirthDigits,
  formatKoreanDate,
  nextBirthDigits,
  normalizeName,
  toBirthDigits,
  validateBirth,
} from "./birth";

describe("입력 포맷", () => {
  it.each([
    ["", ""],
    ["1", "1"],
    ["1995", "1995"],
    ["19950", "1995. 0"],
    ["199503", "1995. 03"],
    ["1995031", "1995. 03. 1"],
    ["19950314", "1995. 03. 14"],
  ])("%s → %s", (digits, shown) => {
    expect(formatBirthDigits(digits)).toBe(shown);
  });

  it("숫자만 8자리까지", () => {
    expect(toBirthDigits("1995. 03. 14")).toBe("19950314");
    expect(toBirthDigits("1995-03-14-99")).toBe("19950314");
    expect(toBirthDigits("abc")).toBe("");
  });

  it("구분자만 지우면 앞 숫자도 함께 지운다", () => {
    // "1995. 03"에서 ". " 뒤 공백만 지운 경우 → 숫자 그대로지만 길이가 줄었다
    expect(nextBirthDigits("199503", "1995.03")).toBe("19950");
    expect(nextBirthDigits("1995", "199")).toBe("199");
    expect(nextBirthDigits("1995", "19951")).toBe("19951");
  });
});

describe("validateBirth", () => {
  const today = "20261109";
  it.each([
    ["19950314", true],
    ["20261109", true], // 오늘
    ["19000101", true],
    ["20000229", true],
  ])("유효: %s", (d, ok) => expect(validateBirth(d, today).ok).toBe(ok));

  it.each([
    ["1995031", "incomplete"],
    ["18991231", "tooOld"],
    ["19990229", "invalid"],
    ["19951301", "invalid"],
    ["20261110", "future"],
  ])("무효: %s → %s", (d, error) =>
    expect(validateBirth(d, today)).toEqual({ ok: false, error }),
  );
});

describe("formatKoreanDate", () => {
  it("요일 포함", () => {
    expect(formatKoreanDate("20261109")).toBe("11월 9일 월요일");
    expect(formatKoreanDate("20261109", true)).toBe("2026년 11월 9일 월요일");
    expect(formatKoreanDate("20280229")).toBe("2월 29일 화요일");
  });
});

describe("normalizeName", () => {
  it("공백 정리, 12자 제한", () => {
    expect(normalizeName("  지  민 ")).toBe("지 민");
    expect(normalizeName("가".repeat(20))).toHaveLength(12);
  });
});
