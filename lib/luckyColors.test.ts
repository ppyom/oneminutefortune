import { describe, expect, it } from "vitest";
import pool from "@/data/fortune.json";
import { LUCKY_COLOR_HEX, luckyColorHex } from "./luckyColors";

describe("행운의 색 견본", () => {
  it("문장풀의 모든 색에 HEX가 있다", () => {
    const missing = pool.lucky.color.filter((c) => !LUCKY_COLOR_HEX[c]);
    expect(missing).toEqual([]);
  });

  it("HEX 형식", () => {
    for (const hex of Object.values(LUCKY_COLOR_HEX))
      expect(hex).toMatch(/^#[0-9A-F]{6}$/);
  });

  it("없는 색은 undefined", () => {
    expect(luckyColorHex("무지개")).toBeUndefined();
  });
});
