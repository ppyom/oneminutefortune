import { describe, expect, it } from "vitest";
import pool from "@/data/fortune.json";
import {
  LUCKY_COLOR_MEANING,
  LUCKY_DIRECTION_TIP,
  luckyColorGuide,
  luckyDirectionGuide,
} from "./luckyGuide";

describe("운세 가이드 행운 항목 설명", () => {
  it("문장풀의 모든 색에 설명이 있다", () => {
    expect(pool.lucky.color.filter((c) => !LUCKY_COLOR_MEANING[c])).toEqual([]);
  });

  it("문장풀의 모든 방위에 설명이 있다", () => {
    expect(pool.lucky.direction.filter((d) => !LUCKY_DIRECTION_TIP[d])).toEqual(
      [],
    );
  });

  it("문장풀 순서를 따른다", () => {
    expect(luckyColorGuide().map((c) => c.name)).toEqual(pool.lucky.color);
    expect(luckyDirectionGuide().map((d) => d.name)).toEqual(
      pool.lucky.direction,
    );
  });
});
