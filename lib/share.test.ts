import { describe, expect, it } from "vitest";
import {
  ogResultPath,
  parseShareName,
  parseShareTarget,
  senderLabel,
  sharePath,
} from "./share";

describe("공유 링크", () => {
  it("이름이 없으면 생년월일-날짜만", () => {
    expect(sharePath("19950314", "20261109")).toBe("/s/19950314-20261109");
    expect(sharePath("19950314", "20261109", "  ")).toBe(
      "/s/19950314-20261109",
    );
  });

  it("이름은 정리해서 인코딩", () => {
    expect(sharePath("19950314", "20261109", " 지민 ")).toBe(
      `/s/19950314-20261109?n=${encodeURIComponent("지민")}`,
    );
    expect(sharePath("19950314", "20261109", "a&b=c")).toBe(
      "/s/19950314-20261109?n=a%26b%3Dc",
    );
  });

  it("OG 이미지 경로", () => {
    expect(ogResultPath("19950314", "20261109")).toBe(
      "/api/og?id=19950314-20261109",
    );
    expect(ogResultPath("19950314", "20261109", "지민")).toBe(
      `/api/og?id=19950314-20261109&n=${encodeURIComponent("지민")}`,
    );
  });
});

describe("parseShareName", () => {
  it.each([
    [undefined, undefined],
    ["", undefined],
    ["   ", undefined],
    ["지민", "지민"],
    [["지민", "철수"], "지민"],
    ["지\u0000민\n", "지민"],
    ["가".repeat(30), "가".repeat(12)],
  ])("%j → %j", (raw, expected) => {
    expect(parseShareName(raw)).toBe(expected);
  });
});

describe("parseShareTarget", () => {
  const today = "20261109";
  it("오늘·과거 날짜는 허용", () => {
    expect(parseShareTarget("19950314-20261109", today)).toEqual({
      birth: "19950314",
      date: "20261109",
    });
    expect(parseShareTarget("19950314-20250101", today)).not.toBeNull();
  });
  it.each([
    "19950314-20261110", // 미래 날짜 (내일 운세 미리보기 방지)
    "20270101-20261109", // 생년월일이 날짜보다 뒤
    "19950230-20261109",
    "19950314",
    "abc",
  ])("거부: %s", (id) => {
    expect(parseShareTarget(id, today)).toBeNull();
  });
});

describe("senderLabel", () => {
  it("이름이 없으면 친구", () => {
    expect(senderLabel("지민")).toBe("지민님");
    expect(senderLabel()).toBe("친구");
  });
});
